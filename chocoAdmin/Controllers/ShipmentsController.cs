using choco.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[Controller]
[Route("[controller]")]
public class ShipmentsController: ControllerBase
{
    private readonly AppDbContext _db;

    public ShipmentsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllShipments()
    {
        return Ok(await _db.Shipments.ToListAsync());
    }
    
}