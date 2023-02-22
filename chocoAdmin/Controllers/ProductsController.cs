using choco.ApiClients.VkService.RequestBodies;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using choco.Utils.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ILogger = Serilog.ILogger;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger _logger;
    private readonly IVkUpdateUtils _vkUpdateUtils;

    public ProductsController(AppDbContext db, ILogger logger, IVkUpdateUtils vkUpdateUtils)
    {
        _db = db;
        _logger = logger;
        _vkUpdateUtils = vkUpdateUtils;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> GetAllProducts()
    {
        return Ok(await _db.Products
            .OrderBy(p => p.Name)
            .Select(p =>
                new Product
                {
                    Category = null,
                    Deleted = p.Deleted,
                    Id = p.Id,
                    IsByWeight = p.IsByWeight,
                    Leftover = Math.Round(p.Leftover, 2),
                    MarketId = p.MarketId,
                    Name = p.Name,
                    RetailPrice = p.RetailPrice,
                    WholesalePrice = p.WholesalePrice
                })
            .ToListAsync()
        );
    }

    [Authorize]
    [HttpPatch("{productId:guid}")]
    public async Task<ActionResult> UpdateProduct(Guid productId, [FromBody] UpdateProductRequestBody body)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product == null)
        {
            _logger.Warning("Product {productId} was not found", productId);
            return NotFound();
        }

        product.Category = await _db.ProductCategories.FindAsync(body.Category);
        product.RetailPrice = body.RetailPrice;
        product.WholesalePrice = body.WholesalePrice;
        product.IsByWeight = body.IsByWeight;
        product.Name = body.Name;
        product.MarketId = body.MarketId;

        await _db.SaveChangesAsync();


        await _vkUpdateUtils.EditProduct(product);

        await _vkUpdateUtils.ReplacePost();
        
        _logger.Information("Product saved");

        return Ok(product);
    }

    [Authorize]
    [HttpGet("{productId:guid}")]
    public async Task<ActionResult> GetProduct(Guid productId)
    {
        var product = await _db.Products
            .Where(p => p.Id == productId)
            .Include(p => p.Category)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            _logger.Warning("Product {productId} was not found", productId);
            return NotFound();
        }

        return Ok(product);
    }

    [Authorize]
    [HttpDelete("{productId:guid}")]
    public async Task<ActionResult> DeleteProduct(Guid productId)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product == null)
        {
            _logger.Warning("Product {productId} was not found", productId);
            return NotFound();
        }

        product.Deleted = true;
        await _db.SaveChangesAsync();
        
        _logger.Information("Product {productId} deleted", productId);

        if (product.MarketId != 0)
        {
            _logger.Information("Hiding product {productId} from vk", productId);
            await _vkUpdateUtils.EditProduct(new EditProductRequestBody
            {
                MarketId = product.MarketId,
                Leftover = 0
            });
        }

        await _vkUpdateUtils.ReplacePost();

        return NoContent();
    }

    [Authorize]
    [HttpPut("{productId:guid}")]
    public async Task<ActionResult> RecoverProductFromDeleted(Guid productId)
    {
        var product = await _db.Products.FindAsync(productId);

        if (product == null)
        {
            _logger.Warning("Product {productId} was not found", productId);
            return NotFound();
        }

        product.Deleted = false;
        await _db.SaveChangesAsync();
        
        _logger.Information("Product {productId} restored", productId);

        if (product.MarketId != 0)
        {
            _logger.Information("Restoring product {productId} in vk...", productId);
            await _vkUpdateUtils.EditProduct(new EditProductRequestBody
            {
                MarketId = product.MarketId,
                Leftover = (int)product.Leftover
            });
            _logger.Information("Product {productId} restored", productId);
        }

        await _vkUpdateUtils.ReplacePost();

        return Ok();
    }

    [HttpPost]
    [Authorize]
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

        _logger.Information("Product {Id} created", product.Id);
        
        return Created("/Products", body);
    }
}