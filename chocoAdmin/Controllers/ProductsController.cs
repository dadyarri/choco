using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductsController: ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllProducts()
    {
        return Ok(await _db.Products.ToListAsync());
    }

    [HttpGet("{productId:guid}")]
    public async Task<ActionResult> GetProduct(Guid productId)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product == null) return NotFound();
        
        return Ok(product);
    }

    [HttpDelete("{productId:guid}")]
    public async Task<ActionResult> DeleteProduct(Guid productId)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product == null) return NotFound();
        
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult> CreateProduct([FromBody] CreateProductRequestBody body)
    {
        var product = new Product
        {
            Name = body.Name,
            Category = await _db.ProductCategories.FindAsync(body.Category),
            IsByWeight = body.IsByWeight,
            Leftover = body.Leftover,
            RetailPrice = body.RetailPrice,
            WholesalePrice = body.WholesalePrice
        };
        
        await _db.Products.AddAsync(product);
        await _db.SaveChangesAsync();
        
        return Created("/Products", body);
    }
    
}