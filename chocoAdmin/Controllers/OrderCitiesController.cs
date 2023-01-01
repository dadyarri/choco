using choco.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[Controller]
[Route("[controller]")]
public class OrderCitiesController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrderCitiesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllOrderCities()
    {
        return Ok(await _db.OrderCities
            .ToListAsync());
    }
}