using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using choco.Utils.Interfaces;
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
    private readonly ILogger _logger;
    private readonly IVkUpdateUtils _vkUpdateUtils;
    private readonly IDeltaUtils _delta;

    public ShipmentsController(AppDbContext db, ILogger logger, IVkUpdateUtils vkUpdateUtils, IDeltaUtils delta)
    {
        _db = db;
        _logger = logger;
        _vkUpdateUtils = vkUpdateUtils;
        _delta = delta;
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
                await _vkUpdateUtils.EditProduct(item.Product);
                _logger.Information("Leftovers of product {Id} increased", item.Product.Id);
            }

            _logger.Information("Leftovers incremented");

            await _vkUpdateUtils.ReplacePost();
        }

        var shipment = new Shipment
        {
            Date = body.Date,
            ShipmentItems = shipmentItems,
            Status = shipmentStatus
        };

        await _db.Shipments.AddAsync(shipment);
        await _db.SaveChangesAsync();

        _logger.Information("Shipment {Id} created", shipment.Id);

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
            _logger.Warning("Shipment {Id} was not found", shipmentId);
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
                await _vkUpdateUtils.EditProduct(item.Product);
                _logger.Information("Leftovers of product {Id} decreased", item.Product.Id);
            }

            _logger.Information("Leftovers decreased");

            await _vkUpdateUtils.ReplacePost();
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
            _logger.Warning("Shipment {Id} was not found", shipmentId);
            return NotFound();
        }

        shipment.Deleted = false;
        if (shipment.Status.Name != "Отменена")
        {
            _logger.Information("Increasing leftovers...");
            foreach (var item in shipment.ShipmentItems)
            {
                item.Product.Leftover += item.Amount;
                await _vkUpdateUtils.EditProduct(item.Product);
                _logger.Information("Leftovers of product {Id} increased", item.Product.Id);
            }

            _logger.Information("Leftovers increased");

            await _vkUpdateUtils.ReplacePost();
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
            _logger.Warning("Shipment {shipmentId} was not found", shipmentId);
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
            _logger.Warning("Shipment status {Status} was not found", body.Status);
            return NotFound();
        }

        if (shipment == null)
        {
            _logger.Warning("Shipment {shipmentId} was not found", shipmentId);
            return NotFound();
        }

        if (!IsStatusChangingPossible(shipment.Status.Name, shipmentStatus.Name))
        {
            _logger
                .ForContext("oldStatusName", shipment.Status.Name)
                .ForContext("newStatusName", shipmentStatus.Name)
                .Warning("Can't change shipment status {oldStatusName} → {newStatusName}");
            return Conflict($"{shipment.Status.Name} → {shipmentStatus.Name}");
        }

        shipment.Status = shipmentStatus;
        shipment.Date = shipment.Date;

        if (shipmentStatus.Name == "Выполнена")
        {
            _logger.Information("Shipment finished, increasing leftovers...");
            var delta = _delta.CalculateDelta(
                shipment.ShipmentItems,
                await FindShipmentItems(body.ShipmentItems)
            );
            if (delta.Count > 0)
            {
                _logger.Information("Shipment items list has changed. Trying to update leftovers...");
                try
                {
                    shipment.ShipmentItems = await _delta.ApplyDelta(shipment.ShipmentItems, delta);
                        
                    await _db.ShipmentItems
                        .Where(si => si.Shipment == null)
                        .ForEachAsync(si => _db.ShipmentItems.Remove(si));
                    _logger.Information("Leftovers changed");
                }
                catch (InvalidOperationException)
                {
                    _logger.Error("Insufficient amount of one or more product.");
                    return Conflict();
                }
            }

            await _vkUpdateUtils.ReplacePost();
        }

        await _db.SaveChangesAsync();

        _logger.Information("Shipment {shipmentId} updated", shipmentId);

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