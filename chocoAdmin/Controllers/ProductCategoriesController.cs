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

    [HttpDelete]
    [Authorize]
    [Route("{categoryId:guid}")]
    public async Task<ActionResult> DeleteProductCategory(Guid categoryId)
    {

        var category = await _db.ProductCategories.FindAsync(categoryId);

        if (category == null)
        {
            return NotFound();
        }

        category.Deleted = true;
        await _db.SaveChangesAsync();
        
        return NoContent();
    }

    [HttpPut]
    [Authorize]
    [Route("{categoryId:guid}")]
    public async Task<ActionResult> RestoreProductCategory(Guid categoryId)
    {

        var category = await _db.ProductCategories.FindAsync(categoryId);

        if (category == null)
        {
            return NotFound();
        }

        category.Deleted = false;
        await _db.SaveChangesAsync();
        
        return Ok();
    }

    [HttpPatch("{categoryId:guid}")]
    [Authorize]
    public async Task<ActionResult> UpdateProductCategory(Guid categoryId, [FromBody] ProductCategory body)
    {
        var category = await _db.ProductCategories.FindAsync(categoryId);

        if (category == null)
        {
            return NotFound();
        }

        category.Name = body.Name;
        await _db.SaveChangesAsync();

        return Ok(category);

    }
}