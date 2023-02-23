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
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger _logger;
    private readonly IDeltaUtils _delta;
    private readonly IVkUpdateUtils _vkUpdateUtils;

    public OrdersController(AppDbContext db, IVkUpdateUtils vkUpdateUtils, ILogger logger, IDeltaUtils delta)
    {
        _db = db;
        _vkUpdateUtils = vkUpdateUtils;
        _logger = logger;
        _delta = delta;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> GetAllOrders()
    {
        return Ok(await _db.Orders
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.Address)
            .ThenInclude(a => a.City)
            .OrderByDescending(o => o.Date)
            .ToListAsync());
    }

    [Authorize]
    [HttpGet("{orderId:guid}")]
    public async Task<ActionResult> GetOrderById(Guid orderId)
    {
        var order = await _db.Orders.Where(o => o.Id == orderId)
            .Include(o => o.Address)
            .ThenInclude(a => a.City)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.Status)
            .FirstOrDefaultAsync();

        if (order == null)
        {
            _logger.Warning("Order {orderId} was not found", orderId);
            return NotFound();
        }

        _logger.Information("Found order {orderId}", orderId);
        return Ok(order);
    }

    [Authorize]
    [HttpDelete("{orderId:guid}")]
    public async Task<ActionResult> DeleteOrder(Guid orderId)
    {
        var order = await _db.Orders
            .Where(o => o.Id == orderId)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.Status)
            .FirstOrDefaultAsync();

        if (order == null)
        {
            _logger.Warning("Order {orderId} was not found", orderId);
            return NotFound();
        }

        order.Deleted = true;
        if (order.Status.Name != "Отменён")
        {
            _logger.Information("Incrementing leftovers...");
            foreach (var item in order.OrderItems)
            {
                item.Product.Leftover += item.Amount;
                await _vkUpdateUtils.EditProduct(item.Product);
            }

            _logger.Information("Leftovers incremented...");

            await _vkUpdateUtils.ReplacePost();
        }

        await _db.SaveChangesAsync();

        _logger.Information("Deleted order {orderId}", orderId);
        return NoContent();
    }

    [Authorize]
    [HttpPut("{orderId:guid}")]
    public async Task<ActionResult> RecoverDeletedOrder(Guid orderId)
    {
        var order = await _db.Orders
            .Where(o => o.Id == orderId)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.Status)
            .FirstOrDefaultAsync();

        if (order == null)
        {
            _logger.Error("Order {orderId} was not found", orderId);
            return NotFound();
        }

        order.Deleted = false;
        if (order.Status.Name != "Отменён")
        {
            if (order.OrderItems.Any(oi => oi.Product.Leftover < oi.Amount))
            {
                _logger.Error("Insufficient amount of one or more products. Cancelling restoring...");
                order.Deleted = true;
                return Conflict();
            }

            _logger.Information("Decreasing leftovers...");
            foreach (var item in order.OrderItems)
            {
                item.Product.Leftover -= item.Amount;
                await _vkUpdateUtils.EditProduct(item.Product);
            }

            _logger.Information("Leftovers decreased");

            await _vkUpdateUtils.ReplacePost();
        }

        await _db.SaveChangesAsync();

        return Ok();
    }

    [Authorize]
    [HttpPatch("{orderId:guid}")]
    public async Task<ActionResult> UpdateOrder(Guid orderId, [FromBody] UpdateOrderRequestBody body)
    {
        var orderStatus = await _db.OrderStatuses.FindAsync(body.Status);
        var order = await _db.Orders
            .Where(o => o.Id == orderId)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.Status)
            .FirstOrDefaultAsync();

        if (orderStatus == null)
        {
            _logger.Error("Order status {Status} was not found", body.Status);
            return NotFound();
        }

        if (order == null)
        {
            _logger.Error("Order {orderId} was not found", orderId);
            return NotFound();
        }

        if (!IsStatusChangingPossible(order.Status.Name, orderStatus.Name))
        {
            _logger.Warning(
                "Can't change status of order ({Status.Name} -> {Name})",
                order.Status.Name,
                orderStatus.Name
            );

            return Conflict($"Переход {order.Status.Name} \u2192 {orderStatus.Name} невозможен");
        }

        var city = await _db.OrderCities.FindAsync(body.Address.City);

        if (city == null)
        {
            _logger.Error("Order city {City} was not found.", body.Address.City);
            return Conflict();
        }

        var address = new OrderAddress
        {
            City = city,
            Street = body.Address.Street,
            Building = body.Address.Building
        };

        var savedAddress = await _db.OrderAddresses.FirstOrDefaultAsync(a =>
            a.City == address.City && a.Street == address.Street &&
            a.Building == address.Building);

        if (savedAddress == null)
        {
            _logger.Information("Created new address");
            await _db.OrderAddresses.AddAsync(address);
        }

        order.Status = orderStatus;
        order.Date = body.Date;
        order.Address = address;

        switch (orderStatus.Name)
        {
            case "Обрабатывается":
            {
                var delta = _delta.CalculateDeltaInOrder(order.OrderItems, await FindOrderItems(body.OrderItems));
                
                if (delta.Count > 0)
                {
                    _logger.Information("Order items list has changed. Trying to update leftovers...");
                    try
                    {
                        order.OrderItems = await _delta.ApplyDeltaToOrder(order.OrderItems, delta);
                        
                        await _db.OrderItems
                            .Where(oi => oi.Order == null)
                            .ForEachAsync(oi => _db.OrderItems.Remove(oi));
                        _logger.Information("Leftovers changed");
                    }
                    catch (InvalidOperationException)
                    {
                        _logger.Error("Insufficient amount of one or more product.");
                        return Conflict();
                    }
                }
                else
                {
                    _logger.Information("Order items list was not changed.");
                }

                break;
            }
            case "Отменён":
            {
                _logger.Information("Increasing leftovers...");
                foreach (var item in order.OrderItems)
                {
                    item.Product.Leftover += item.Amount;
                    await _vkUpdateUtils.EditProduct(item.Product);
                }

                await _vkUpdateUtils.ReplacePost();

                _logger.Information("Leftovers increased");

                break;
            }
        }

        await _vkUpdateUtils.ReplacePost();

        await _db.SaveChangesAsync();
        _logger.Information("Order {orderId} updated", orderId);

        return Ok();
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> CreateOrder([FromBody] CreateOrderRequestBody body)
    {
        var orderItems = await FindOrderItems(body.OrderItems);
        var orderStatus = await _db.OrderStatuses.FindAsync(body.Status) ??
                          await _db.OrderStatuses.FirstAsync(os => os.Name == "Обрабатывается");

        if (orderStatus.Name == "Обрабатывается")
        {
            if (orderItems.Any(oi => oi.Product.Leftover < oi.Amount))
            {
                _logger.Information("Insufficient amount of one or more products. Cancelling creating order...");
                return Conflict();
            }

            _logger.Information("Decreasing leftovers...");
            foreach (var item in orderItems)
            {
                item.Product.Leftover -= item.Amount;
                await _vkUpdateUtils.EditProduct(item.Product);
            }

            _logger.Information("Leftovers decreased");

            await _vkUpdateUtils.ReplacePost();
        }

        var orderCity = await _db.OrderCities.FindAsync(body.Address.City);

        var savedAddress = await _db.OrderAddresses.FirstOrDefaultAsync(a =>
            a.City == orderCity && a.Street == body.Address.Street &&
            a.Building == body.Address.Building);

        OrderAddress orderAddress;

        if (savedAddress == null)
        {
            _logger.Information("Created new address");
            orderAddress = new OrderAddress
            {
                Building = body.Address.Building,
                City = orderCity!,
                Street = body.Address.Street
            };
            await _db.OrderAddresses.AddAsync(orderAddress);
        }
        else
        {
            orderAddress = savedAddress;
        }

        var order = new Order
        {
            Date = DateOnly.ParseExact(body.Date, "yyyy-MM-dd"),
            Address = orderAddress,
            OrderItems = orderItems,
            Status = orderStatus
        };
        await _db.Orders.AddAsync(order);
        await _db.SaveChangesAsync();

        _logger.Information("Order created");
        return Created("/api/Orders", order);
    }

    private async Task<List<OrderItem>> FindOrderItems(List<CreateOrderItemsRequestBody> source)
    {
        var items = new List<OrderItem>();
        foreach (var sourceItem in source)
        {
            items.Add(new OrderItem
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
               oldStatus == "Обрабатывается" && newStatus == "Выполнен" ||
               oldStatus == "Доставляется" && newStatus == "Выполнен" ||
               oldStatus == "Обрабатывается" && newStatus == "Отменён" ||
               oldStatus == "Отменён" && newStatus == "Обрабатывается" ||
               oldStatus == "Доставляется" && newStatus == "Отменён" ||
               oldStatus == "Отменён" && newStatus == "Доставляется" ||
               oldStatus == newStatus;
    }
}