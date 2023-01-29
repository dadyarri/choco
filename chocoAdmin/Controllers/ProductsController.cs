using choco.ApiClients.VkService;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using choco.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly VkServiceClient _vkServiceClient;

    public ProductsController(AppDbContext db, VkServiceClient vkServiceClient)
    {
        _db = db;
        _vkServiceClient = vkServiceClient;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllProducts()
    {
        return Ok(await _db.Products
            .OrderBy(p => p.Name)
            .ToListAsync()
        );
    }

    [HttpPatch("{productId:guid}")]
    public async Task<ActionResult> UpdateProduct(Guid productId, [FromBody] UpdateProductRequestBody body)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product == null) return NotFound();

        product.Category = await _db.ProductCategories.FindAsync(body.Category);
        product.RetailPrice = body.RetailPrice;
        product.WholesalePrice = body.WholesalePrice;
        product.IsByWeight = body.IsByWeight;
        product.Name = body.Name;
        product.MarketId = body.MarketId;

        await _db.SaveChangesAsync();

        return Ok(product);
    }

    [HttpGet("{productId:guid}")]
    public async Task<ActionResult> GetProduct(Guid productId)
    {
        var product = await _db.Products
            .Where(p => p.Id == productId)
            .Include(p => p.Category)
            .FirstOrDefaultAsync();

        if (product == null) return NotFound();

        return Ok(product);
    }

    [HttpDelete("{productId:guid}")]
    public async Task<ActionResult> DeleteProduct(Guid productId)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product == null) return NotFound();

        product.Deleted = true;
        await _db.SaveChangesAsync();

        if (product.MarketId != 0)
        {
            await _vkServiceClient.EditProduct(new EditProductRequestBody
            {
                MarketId = product.MarketId,
                Leftover = 0
            });
        }

        await ReplacePost();

        return NoContent();
    }

    [HttpPut("{productId:guid}")]
    public async Task<ActionResult> RecoverProductFromDeleted(Guid productId)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product == null) return NotFound();

        product.Deleted = false;
        await _db.SaveChangesAsync();

        if (product.MarketId != 0)
        {
            await _vkServiceClient.EditProduct(new EditProductRequestBody
            {
                MarketId = product.MarketId,
                Leftover = (int)product.Leftover
            });
        }

        await ReplacePost();

        return Ok();
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
            WholesalePrice = body.WholesalePrice,
            MarketId = body.MarketId
        };

        await _db.Products.AddAsync(product);
        await _db.SaveChangesAsync();

        return Created("/Products", body);
    }

    private async Task ReplacePost()
    {
        var imageData =
            ReplacePostUtil.GenerateImage(
                await _db.Products
                    .Where(p => p.Leftover > 0 && !p.Deleted)
                    .ToListAsync()
            ).ToArray();
        await new ReplacePostUtil(_vkServiceClient).ReplacePost(imageData);
    }
}