using choco.ApiClients.VkService;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using choco.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ShipmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly VkServiceClient _vkServiceClient;

    public ShipmentsController(AppDbContext db, VkServiceClient vkServiceClient)
    {
        _db = db;
        _vkServiceClient = vkServiceClient;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllShipments()
    {
        return Ok(await _db.Shipments
            .Include(s => s.Status)
            .Include(s => s.ShipmentItems)
            .ThenInclude(si => si.Product)
            .Include(s => s.ShipmentItems)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult> CreateShipment([FromBody] CreateShipmentRequestBody body)
    {
        var shipmentItems = await FindShipmentItems(body.ShipmentItems);
        var shipmentStatus = await _db.ShipmentStatuses.FindAsync(body.Status);

        if (shipmentStatus!.Name == "Выполнена")
        {
            foreach (var item in shipmentItems)
            {
                item.Product.Leftover += item.Amount;
                await UpdateLeftoverInVk(item);
            }

            await ReplacePost();
        }

        var shipment = new Shipment
        {
            Date = body.Date,
            ShipmentItems = shipmentItems,
            Status = shipmentStatus
        };

        await _db.Shipments.AddAsync(shipment);
        await _db.SaveChangesAsync();

        return Created("/api/Shipments", shipment);
    }

    [HttpDelete("{shipmentId:guid}")]
    public async Task<ActionResult> DeleteShipment(Guid shipmentId)
    {
        var shipment = await _db.Shipments
            .Where(s => s.Id == shipmentId)
            .Include(s => s.ShipmentItems)
            .ThenInclude(si => si.Product)
            .Include(s => s.Status)
            .FirstOrDefaultAsync();
        if (shipment == null) return NotFound();

        shipment.Deleted = true;
        if (shipment.Status.Name == "Выполнена")
        {
            foreach (var item in shipment.ShipmentItems)
            {
                item.Product.Leftover -= item.Amount;
                await UpdateLeftoverInVk(item);
            }

            await ReplacePost();
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{shipmentId:guid}")]
    public async Task<ActionResult> RecoverDeletedShipment(Guid shipmentId)
    {
        var shipment = await _db.Shipments
            .Where(o => o.Id == shipmentId)
            .Include(o => o.ShipmentItems)
            .ThenInclude(si => si.Product)
            .Include(o => o.Status)
            .FirstOrDefaultAsync();
        if (shipment == null) return NotFound();

        shipment.Deleted = false;
        if (shipment.Status.Name != "Отменена")
        {
            foreach (var item in shipment.ShipmentItems)
            {
                item.Product.Leftover -= item.Amount;
                await UpdateLeftoverInVk(item);
            }

            await ReplacePost();
        }

        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("{shipmentId:guid}")]
    public async Task<ActionResult> GetShipmentById(Guid shipmentId)
    {
        var order = await _db.Shipments.Where(s => s.Id == shipmentId)
            .Include(s => s.Status)
            .Include(s => s.ShipmentItems)
            .ThenInclude(si => si.Product)
            .FirstOrDefaultAsync();
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateShipment([FromBody] UpdateShipmentRequestBody body)
    {
        var orderStatus = await _db.ShipmentStatuses.FindAsync(body.Status);
        var order = await _db.Shipments
            .Where(s => s.Id == body.ShipmentId)
            .Include(s => s.ShipmentItems)
            .ThenInclude(si => si.Product)
            .Include(s => s.Status)
            .FirstOrDefaultAsync();

        if (orderStatus == null) return NotFound();
        if (order == null) return NotFound();

        if (!IsStatusChangingPossible(order.Status.Name, orderStatus.Name))
        {
            return Conflict();
        }

        order.Status = orderStatus;

        if (orderStatus.Name == "Выполнена")
        {
            foreach (var item in order.ShipmentItems)
            {
                item.Product.Leftover += item.Amount;
                await UpdateLeftoverInVk(item);
            }

            await ReplacePost();
        }

        await _db.SaveChangesAsync();

        return Ok();
    }

    private async Task<List<ShipmentItem>> FindShipmentItems(List<CreateShipmentItemsRequestBody> source)
    {
        var items = new List<ShipmentItem>();
        foreach (var sourceItem in source)
        {
            items.Add(new ShipmentItem
            {
                Amount = sourceItem.Amount,
                Product = await _db.Products.FindAsync(sourceItem.Id)
            });
        }

        return items;
    }

    private async Task UpdateLeftoverInVk(ShipmentItem item)
    {
        if (item.Product.MarketId != 0)
        {
            await _vkServiceClient.EditProduct(new EditProductRequestBody
            {
                MarketId = item.Product.MarketId,
                Leftover = (int)item.Product.Leftover
            });
        }
    }

    private async Task ReplacePost()
    {
        var imageData =
            ReplacePostUtil.GenerateImage(
                await _db.Products
                    .Where(p => p.Leftover > 0 && !p.Deleted)
                    .ToListAsync()
            ).ToArray();
        await new ReplacePostUtil(_vkServiceClient).ReplacePost(imageData);
    }
    
    private bool IsStatusChangingPossible(string oldStatus, string newStatus)
    {
        return oldStatus == "Обрабатывается" && newStatus == "Доставляется" ||
               oldStatus == "Доставляется" && newStatus == "Выполнен" ||
               oldStatus == "Обрабатывается" && newStatus == "Отменён" ||
               oldStatus == "Отменён" && newStatus == "Обрабатывается" ||
               oldStatus == "Доставляется" && newStatus == "Отменён" ||
               oldStatus == "Отменён" && newStatus == "Доставляется";
    }
}