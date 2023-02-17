using choco.ApiClients.VkService;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using choco.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly VkServiceClient _vkServiceClient;

    public OrdersController(AppDbContext db, VkServiceClient vkServiceClient)
    {
        _db = db;
        _vkServiceClient = vkServiceClient;
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
        if (order == null) return NotFound();
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
        if (order == null) return NotFound();

        order.Deleted = true;
        if (order.Status.Name != "Отменён")
        {
            foreach (var item in order.OrderItems)
            {
                item.Product.Leftover += item.Amount;
                await UpdateLeftoverInVk(item);
            }

            await ReplacePost();
        }

        await _db.SaveChangesAsync();
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
        if (order == null) return NotFound();

        order.Deleted = false;
        if (order.Status.Name != "Отменён")
        {
            if (order.OrderItems.Any(oi => oi.Product.Leftover < oi.Amount))
            {
                return Conflict();
            }

            foreach (var item in order.OrderItems)
            {
                item.Product.Leftover -= item.Amount;
                await UpdateLeftoverInVk(item);
            }

            await ReplacePost();
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

        if (orderStatus == null) return NotFound();
        if (order == null) return NotFound();

        if (!IsStatusChangingPossible(order.Status.Name, orderStatus.Name))
        {
            return Conflict($"Переход {order.Status.Name} \u2192 {orderStatus.Name} невозможен");
        }

        var address = new OrderAddress
        {
            City = await _db.OrderCities.FindAsync(body.Address.City),
            Street = body.Address.Street,
            Building = body.Address.Building
        };

        var savedAddress = await _db.OrderAddresses.SingleOrDefaultAsync(a =>
            a.City == address.City && a.Street == address.Street &&
            a.Building == address.Building);

        if (savedAddress == null)
        {
            await _db.OrderAddresses.AddAsync(address);
        }

        order.Status = orderStatus;
        order.Date = body.Date;
        order.Address = address;
        order.OrderItems = await FindOrderItems(body.OrderItems);

        switch (orderStatus.Name)
        {
            case "Обрабатывается":
            {
                foreach (var item in order.OrderItems)
                {
                    item.Product.Leftover -= item.Amount;
                    await UpdateLeftoverInVk(item);
                }

                break;
            }
            case "Отменён":
            {
                foreach (var item in order.OrderItems)
                {
                    item.Product.Leftover += item.Amount;
                    await UpdateLeftoverInVk(item);
                }

                break;
            }
        }

        await ReplacePost();

        await _db.SaveChangesAsync();

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
                return Conflict();
            }

            foreach (var item in orderItems)
            {
                item.Product.Leftover -= item.Amount;
                await UpdateLeftoverInVk(item);
            }

            await ReplacePost();
        }

        var orderCity = await _db.OrderCities.FindAsync(body.Address.City);

        var savedAddress = await _db.OrderAddresses.FirstOrDefaultAsync(a =>
            a.City == orderCity && a.Street == body.Address.Street &&
            a.Building == body.Address.Building);

        OrderAddress orderAddress;

        if (savedAddress == null)
        {
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

    private async Task UpdateLeftoverInVk(OrderItem item)
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
               oldStatus == "Обрабатывается" && newStatus == "Выполнен" ||
               oldStatus == "Доставляется" && newStatus == "Выполнен" ||
               oldStatus == "Обрабатывается" && newStatus == "Отменён" ||
               oldStatus == "Отменён" && newStatus == "Обрабатывается" ||
               oldStatus == "Доставляется" && newStatus == "Отменён" ||
               oldStatus == "Отменён" && newStatus == "Доставляется" ||
               oldStatus == newStatus;
    }
}