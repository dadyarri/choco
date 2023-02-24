using choco.ApiClients.VkService.Interfaces;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data;
using choco.Data.Models;
using choco.Utils.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace choco.Utils.Services;

public class VkUpdateUtils: IVkUpdateUtils
{
    private readonly AppDbContext _db;
    private readonly IVkServiceClient _vkServiceClient;
    private readonly IReplacePostUtil _replacePostUtil;

    public VkUpdateUtils(IVkServiceClient vkServiceClient, AppDbContext db, IReplacePostUtil replacePostUtil)
    {
        _vkServiceClient = vkServiceClient;
        _db = db;
        _replacePostUtil = replacePostUtil;
    }

    public async Task EditProduct(Product item)
    {
        if (item.MarketId != 0)
        {
            await Task.Run(() => _vkServiceClient.EditProduct(new EditProductRequestBody
            {
                MarketId = item.MarketId,
                Leftover = (int)Math.Round(item.Leftover),
                Price = item.RetailPrice,
                Name = item.Name
            }));
        }   
    }

    public async Task EditProduct(EditProductRequestBody item)
    {
        if (item.MarketId != 0)
        {
            await Task.Run(() => _vkServiceClient.EditProduct(item));
        }   
    }
    
    public async Task ReplacePost()
    {
        var imageData =
            _replacePostUtil.GenerateImage(
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
        await _replacePostUtil.ReplacePost(imageData);
    }
    
    
}