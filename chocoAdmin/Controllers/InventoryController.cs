using choco.Data;
using choco.RequestBodies;
using choco.Utils.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ILogger = Serilog.ILogger;

namespace choco.Controllers;

[Controller]
[Route("[controller]")]
public class InventoryController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger _logger;
    private readonly IVkUpdateUtils _vkUpdateUtils;

    public InventoryController(AppDbContext db, ILogger logger, IVkUpdateUtils vkUpdateUtils)
    {
        _db = db;
        _logger = logger;
        _vkUpdateUtils = vkUpdateUtils;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> SaveInventory([FromBody] SaveInventoryRequestBody body)
    {
        foreach (var product in body.Products)
        {
            var savedProduct = await _db.Products.FindAsync(product.Id);
            if (savedProduct == null) continue;

            savedProduct.Leftover = product.Leftover;
            await _vkUpdateUtils.EditProduct(product);
        }

        await _db.SaveChangesAsync();
        await _vkUpdateUtils.ReplacePost();

        _logger.Information("Inventory saved");
        return Created("/inventory", null);
    }
}