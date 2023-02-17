using choco.Data;
using choco.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductCategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductCategoriesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> GetAllProductCategories()
    {
        return Ok(await _db.ProductCategories
            .ToListAsync());
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> CreateProductCategory([FromBody] ProductCategory body)
    {
        await _db.ProductCategories.AddAsync(body);
        await _db.SaveChangesAsync();
        
        return Created("/ProductCategories", body);
    }
}