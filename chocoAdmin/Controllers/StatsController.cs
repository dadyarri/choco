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
            .GroupBy(o => o.Address.City)
            .Select(g => new { name = g.Key.Name, value = g.Count() })
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("CompareIncome")]
    public async Task<ActionResult> GetIncomeInLastTwoMonths()
    {
        var currentMonthDate = DateTime.Now;
        var previousMonthDate = DateTime.Now.AddMonths(-1);

        var currentMonthData = await _db.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.Date.Month == currentMonthDate.Month &&
                        o.Date.Year == currentMonthDate.Year).ToListAsync();

        var currentMonthIncome =
            currentMonthData.Sum(order => order.OrderItems.Sum(oi => oi.Product.RetailPrice * oi.Amount));

        var previousMonthData = await _db.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.Date.Month == previousMonthDate.Month &&
                        o.Date.Year == previousMonthDate.Year).ToListAsync();

        var previousMonthIncome =
            previousMonthData.Sum(order => order.OrderItems.Sum(oi => oi.Product.RetailPrice * oi.Amount));

        return Ok(new IncomesResponse
        {
            IncomeInfos = new List<IncomeInfo>
            {
                new()
                {
                    DateInfo = $"{currentMonthDate.Month}/{currentMonthDate.Year}",
                    Total = currentMonthIncome
                },
                new()
                {
                    DateInfo = $"{previousMonthDate.Month}/{previousMonthDate.Year}",
                    Total = previousMonthIncome
                }
            }
        });
    }
}