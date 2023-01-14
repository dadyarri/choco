using choco.Data;
using choco.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StatsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("ByCity")]
    public async Task<ActionResult> GetStatsByCity()
    {
        var data = await _db.Orders
            .Include(o => o.Address)
            .Include(o => o.Status)
            .Where(o => !o.Deleted && o.Status.Name != "Отменён" && o.Date.Month == DateTime.Now.Month &&
                        o.Date.Year == DateTime.Now.Year)
            .GroupBy(o => o.Address.City)
            .Select(g => new { name = g.Key.Name, value = g.Count() })
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("TopProducts")]
    public async Task<ActionResult> GetTopProducts()
    {
        var data = await _db.Orders
            .Include(o => o.Status)
            .Where(o => !o.Deleted && o.Status.Name != "Отменён" && o.Date.Month == DateTime.Now.Month &&
                        o.Date.Year == DateTime.Now.Year)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .SelectMany(o => o.OrderItems, (order, item) => new { order, item })
            .GroupBy(o => o.item.Product)
            .Select(g => new { name = g.Key.Name, value = g.Count() })
            .Take(10)
            .OrderByDescending(g => g.value)
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("Categories")]
    public async Task<ActionResult> GetCategories()
    {
        var data = await _db.Orders
            .Include(o => o.Status)
            .Where(o => !o.Deleted && o.Status.Name != "Отменён" && o.Date.Month == DateTime.Now.Month &&
                        o.Date.Year == DateTime.Now.Year)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .ThenInclude(p => p.Category)
            .SelectMany(o => o.OrderItems, (order, item) => new { order, item })
            .GroupBy(o => o.item.Product.Category)
            .Select(g => new { name = g.Key.Name, value = g.Count() })
            .Take(10)
            .OrderBy(g => g.value)
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("TotalIncomes/{months:int}")]
    public async Task<ActionResult> GetTotalIncomes(int months)
    {
        var incomeInfo = new List<IncomeInfo>();

        for (var delta = 0; delta > -months; delta--)
        {
            var date = DateTime.Now.AddMonths(delta);
            var data = await _db.Orders
                .Include(o => o.Status)
                .Where(o => !o.Deleted && o.Status.Name != "Отменён")
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.Date.Month == date.Month &&
                            o.Date.Year == date.Year)
                .ToListAsync();

            var income = data.Sum(order => order.OrderItems.Sum(oi => oi.Product.RetailPrice * oi.Amount));

            incomeInfo.Add(new IncomeInfo
            {
                Index = -delta,
                DateInfo = $"{date.Month}/{date.Year}",
                Total = income
            });
        }

        return Ok(incomeInfo);
    }
}