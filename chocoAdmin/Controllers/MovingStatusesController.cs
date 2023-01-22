using choco.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[Controller]
[Route("[controller]")]
public class ShipmentStatusesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ShipmentStatusesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllShipmentStatuses()
    {
        return Ok(await _db.MovingStatuses
            .ToListAsync());
    }
}