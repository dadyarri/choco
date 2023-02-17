using choco.ApiClients.VkService;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using choco.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[Controller]
[Route("[controller]")]
public class InventoryController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly VkServiceClient _vkServiceClient;
    private readonly ILogger _logger;

    public InventoryController(AppDbContext db, VkServiceClient vkServiceClient, ILogger logger)
    {
        _db = db;
        _vkServiceClient = vkServiceClient;
        _logger = logger;
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
            await UpdateLeftoverInVk(product);
        }

        await _db.SaveChangesAsync();
        await ReplacePost();

        _logger.LogInformation("Inventory saved");
        return Created("/inventory", null);
    }

    private async Task UpdateLeftoverInVk(Product item)
    {
        if (item.MarketId != 0)
        {
            await _vkServiceClient.EditProduct(new EditProductRequestBody
            {
                MarketId = item.MarketId,
                Leftover = (int)Math.Round(item.Leftover)
            });
        }
    }

    private async Task ReplacePost()
    {
        var imageData =
            ReplacePostUtil.GenerateImage(
                await _db.Products
                    .Where(p => p.Leftover > 0 && !p.Deleted)
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
            ).ToArray();
        await new ReplacePostUtil(_vkServiceClient).ReplacePost(imageData);
    }
}