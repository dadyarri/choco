using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewAPI.Data;
using NewAPI.Models;

namespace NewAPI.Controllers;

[ApiController]
[Route("/api/v2/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ApplicationContext _db;
    private readonly ILogger<ProductController> _logger;

    public ProductController(ApplicationContext context, ILogger<ProductController> logger)
    {
        _db = context;
        _logger = logger;
    }

    [HttpGet("{id:int}")]
    [Produces("application/json")]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
        var product = await _db.Products.FindAsync(id);

        if (product is null)
        {
            return NotFound(id);
        }

        return product;
    }

    [HttpGet("market/{marketId:int}")]
    [Produces("application/json")]
    public async Task<ActionResult<Product>> GetProductByMarketId(int marketId)
    {
        try
        {
            return await _db.Products.SingleAsync(p => p.MarketId == marketId);
        }
        catch (InvalidOperationException)
        {
            return NotFound(marketId);
        }
    }

    [HttpPatch("{id:int}")]
    [Produces("application/json")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] JsonPatchDocument<Product>? product)
    {
        if (product == null) return BadRequest(product);

        var entity = await _db.Products.FindAsync(id);

        if (entity == null)
        {
            return NotFound(id);
        }

        product.ApplyTo(entity, ModelState);
        await _db.SaveChangesAsync();
        return Ok(entity);
    }

    [HttpDelete("{id:int}")]
    [Produces("application/json")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var entity = await _db.Products.FindAsync(id);

        if (entity is null)
        {
            return NotFound(id);
        }

        _db.Products.Remove(entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}