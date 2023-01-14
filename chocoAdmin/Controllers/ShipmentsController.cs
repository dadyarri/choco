using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ShipmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ShipmentsController(AppDbContext db)
    {
        _db = db;
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

        if (shipmentStatus.Name == "Получено")
        {
            foreach (var item in shipmentItems)
            {
                item.Product.Leftover += item.Amount;
            }
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

    [HttpDelete("{orderId:guid}")]
    public async Task<ActionResult> DeleteShipment(Guid orderId)
    {
        var shipment = await _db.Shipments.FindAsync(orderId);
        if (shipment == null) return NotFound();

        shipment.Deleted = true;
        await _db.SaveChangesAsync();
        return NoContent();
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
            .FirstOrDefaultAsync();

        if (orderStatus == null) return NotFound();
        if (order == null) return NotFound();

        order.Status = orderStatus;
        
        if (orderStatus.Name == "Получено")
        {
            foreach (var item in order.ShipmentItems)
            {
                item.Product.Leftover += item.Amount;
            }
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
}