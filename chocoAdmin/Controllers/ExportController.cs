using choco.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ExportController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExportController(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ActionResult> ExportImage()
    {
        var products = await _db.Products.Where(p => p.Leftover > 0 && !p.Deleted).ToListAsync();
        return Ok();
    }
}