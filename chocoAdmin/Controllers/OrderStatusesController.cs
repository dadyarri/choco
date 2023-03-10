using choco.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[Controller]
[Route("[controller]")]
public class OrderStatusesController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrderStatusesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> GetAllOrderStatuses()
    {
        return Ok(await _db.OrderStatuses
            .ToListAsync());
    }
}