using choco.ApiClients.VkService;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using choco.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ILogger = Serilog.ILogger;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ShipmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly VkServiceClient _vkServiceClient;
    private readonly ILogger _logger;

    public ShipmentsController(AppDbContext db, VkServiceClient vkServiceClient, ILogger logger)
    {
        _db = db;
        _vkServiceClient = vkServiceClient;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> GetAllShipments()
    {
        return Ok(await _db.Shipments
            .Include(s => s.Status)
            .Include(s => s.ShipmentItems)
            .ThenInclude(si => si.Product)
            .Include(s => s.ShipmentItems)
            .OrderByDescending(s => s.Date)
            .ToListAsync());
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> CreateShipment([FromBody] CreateShipmentRequestBody body)
    {
        var shipmentItems = await FindShipmentItems(body.ShipmentItems);
        var shipmentStatus = await _db.ShipmentStatuses.FindAsync(body.Status) ??
                             await _db.ShipmentStatuses.FirstAsync(os => os.Name == "Обрабатывается");

        if (shipmentStatus!.Name == "Выполнена")
        {
            _logger.Information("Shipment finished, incrementing leftovers...");
            foreach (var item in shipmentItems)
            {
                item.Product.Leftover += item.Amount;
                await Task.Run(() => UpdateLeftoverInVk(item));
                _logger.Information("Leftovers of product {} increased", item.Product.Id);
            }

            _logger.Information("Leftovers incremented");

            await Task.Run(ReplacePost);
        }

        var shipment = new Shipment
        {
            Date = body.Date,
            ShipmentItems = shipmentItems,
            Status = shipmentStatus
        };

        await _db.Shipments.AddAsync(shipment);
        await _db.SaveChangesAsync();

        _logger.Information("Shipment {} created", shipment.Id);

        return Created("/api/Shipments", shipment);
    }

    [Authorize]
    [HttpDelete("{shipmentId:guid}")]
    public async Task<ActionResult> DeleteShipment(Guid shipmentId)
    {
        var shipment = await _db.Shipments
            .Where(s => s.Id == shipmentId)
            .Include(s => s.ShipmentItems)
            .ThenInclude(si => si.Product)
            .Include(s => s.Status)
            .FirstOrDefaultAsync();

        if (shipment == null)
        {
            _logger.Warning("Shipment {} was not found", shipmentId);
            return NotFound();
        }

        shipment.Deleted = true;
        if (shipment.Status.Name == "Выполнена")
        {
            if (shipment.ShipmentItems.Any(oi => oi.Product.Leftover < oi.Amount))
            {
                _logger.Information("Insufficient amount of one or more products. Cancelling deleting shipment...");
                return Conflict();
            }

            _logger.Information("Decreasing leftovers...");
            foreach (var item in shipment.ShipmentItems)
            {
                item.Product.Leftover -= item.Amount;
                await Task.Run(() => UpdateLeftoverInVk(item));
                _logger.Information("Leftovers of product {} decreased", item.Product.Id);
            }

            _logger.Information("Leftovers decreased");

            await Task.Run(ReplacePost);
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpPut("{shipmentId:guid}")]
    public async Task<ActionResult> RecoverDeletedShipment(Guid shipmentId)
    {
        var shipment = await _db.Shipments
            .Where(o => o.Id == shipmentId)
            .Include(o => o.ShipmentItems)
            .ThenInclude(si => si.Product)
            .Include(o => o.Status)
            .FirstOrDefaultAsync();

        if (shipment == null)
        {
            _logger.Warning("Shipment {} was not found", shipmentId);
            return NotFound();
        }

        shipment.Deleted = false;
        if (shipment.Status.Name != "Отменена")
        {
            _logger.Information("Increasing leftovers...");
            foreach (var item in shipment.ShipmentItems)
            {
                item.Product.Leftover += item.Amount;
                await Task.Run(() => UpdateLeftoverInVk(item));
                _logger.Information("Leftovers of product {} increased", item.Product.Id);
            }

            _logger.Information("Leftovers increased");

            await Task.Run(ReplacePost);
        }

        await _db.SaveChangesAsync();

        _logger.Information("Shipment restored from deleted");

        return Ok();
    }

    [Authorize]
    [HttpGet("{shipmentId:guid}")]
    public async Task<ActionResult> GetShipmentById(Guid shipmentId)
    {
        var shipment = await _db.Shipments.Where(s => s.Id == shipmentId)
            .Include(s => s.Status)
            .Include(s => s.ShipmentItems)
            .ThenInclude(si => si.Product)
            .FirstOrDefaultAsync();

        if (shipment == null)
        {
            _logger.Warning("Shipment {} was not found", shipmentId);
            return NotFound();
        }

        return Ok(shipment);
    }

    [Authorize]
    [HttpPatch("{shipmentId:guid}")]
    public async Task<ActionResult> UpdateShipment(Guid shipmentId, [FromBody] UpdateShipmentRequestBody body)
    {
        var shipmentStatus = await _db.ShipmentStatuses.FindAsync(body.Status);
        var shipment = await _db.Shipments
            .Where(s => s.Id == shipmentId)
            .Include(s => s.ShipmentItems)
            .ThenInclude(si => si.Product)
            .Include(s => s.Status)
            .FirstOrDefaultAsync();

        if (shipmentStatus == null)
        {
            _logger.Warning("Shipment status {} was not found", body.Status);
            return NotFound();
        }

        if (shipment == null)
        {
            _logger.Warning("Shipment {} was not found", shipmentId);
            return NotFound();
        }

        if (!IsStatusChangingPossible(shipment.Status.Name, shipmentStatus.Name))
        {
            _logger.Warning(
                "Can't change shipment status {} → {}",
                shipment.Status.Name,
                shipmentStatus.Name
            );
            return Conflict($"{shipment.Status.Name} → {shipmentStatus.Name}");
        }

        shipment.Status = shipmentStatus;
        shipment.Date = shipment.Date;
        
        // todo: calculate delta between new and old shipment items to correctly change leftovers
        // todo: skip decreasing leftovers, if delta is 0
        shipment.ShipmentItems = await FindShipmentItems(body.ShipmentItems);

        if (shipmentStatus.Name == "Выполнена")
        {
            _logger.Information("Shipment finished, increasing leftovers...");
            foreach (var item in shipment.ShipmentItems)
            {
                item.Product.Leftover += item.Amount;
                await Task.Run(() => UpdateLeftoverInVk(item));
                _logger.Information("Leftovers of product {} increased", item.Product.Id);
            }

            await Task.Run(ReplacePost);
        }

        await _db.SaveChangesAsync();
        
        _logger.Information("Shipment {} updated", shipmentId);

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
                    .OrderBy(p => p.Name)
                    .Select(p =>
                        new Product
                        {
                            Category = null,
                            Deleted = p.Deleted,
                            Id = p.Id,
                            IsByWeight = p.IsByWeight,
                            Leftover = Math.Round(p.Leftover, 2),
                            MarketId = p.MarketId,
                            Name = p.Name,
                            RetailPrice = p.RetailPrice,
                            WholesalePrice = p.WholesalePrice
                        })
                    .ToListAsync()
            ).ToArray();
        await new ReplacePostUtil(_vkServiceClient).ReplacePost(imageData);
    }

    private bool IsStatusChangingPossible(string oldStatus, string newStatus)
    {
        return oldStatus == "Обрабатывается" && newStatus == "Доставляется" ||
               oldStatus == "Обрабатывается" && newStatus == "Выполнена" ||
               oldStatus == "Доставляется" && newStatus == "Выполнена" ||
               oldStatus == "Обрабатывается" && newStatus == "Отменена" ||
               oldStatus == "Отменена" && newStatus == "Обрабатывается" ||
               oldStatus == "Доставляется" && newStatus == "Отменена" ||
               oldStatus == "Отменена" && newStatus == "Доставляется" ||
               oldStatus == newStatus;
    }
}