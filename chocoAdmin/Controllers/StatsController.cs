using choco.Data;
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
}