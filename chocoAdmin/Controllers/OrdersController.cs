using choco.ApiClients.VkService;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
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
    public async Task<ActionResult> GetAllOrders()
    {
        return Ok(await _db.Orders
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.Address)
            .ThenInclude(a => a.City)
            .ToListAsync());
    }

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

    [HttpDelete("{orderId:guid}")]
    public async Task<ActionResult> DeleteOrder(Guid orderId)
    {
        var order = await _db.Orders
            .Where(o => o.Id == orderId)
            .Include(o => o.OrderItems)
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
        }
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut]
    public async Task<ActionResult> UpdateOrder([FromBody] UpdateOrderRequestBody body)
    {
        var orderStatus = await _db.OrderStatuses.FindAsync(body.Status);
        var order = await _db.Orders
            .Where(o => o.Id == body.OrderId)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync();

        if (orderStatus == null) return NotFound();
        if (order == null) return NotFound();

        order.Status = orderStatus;

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

        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult> CreateOrder([FromBody] CreateOrderRequestBody body)
    {
        var orderItems = await FindOrderItems(body.OrderItems);
        var orderStatus = await _db.OrderStatuses.FindAsync(body.Status);

        if (orderStatus.Name == "Обрабатывается")
        {
            foreach (var item in orderItems)
            {
                item.Product.Leftover -= item.Amount;
                await UpdateLeftoverInVk(item);
            }
        }

        var order = new Order
        {
            Date = DateOnly.ParseExact(body.Date, "yyyy-mm-dd"),
            Address = new OrderAddress
            {
                Building = body.Address.Building,
                City = await _db.OrderCities.FindAsync(body.Address.City),
                Street = body.Address.Street
            },
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
}