using choco.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomersController : ControllerBase
{
    private readonly AppDbContext _db;

    public CustomersController(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ActionResult> GetAll()
    {
        return Ok(await _db.Customers
            .Include(c => c.Addresses)
            .ThenInclude(a => a.City)
            .ToListAsync()
        );
    }
}