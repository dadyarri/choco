using choco.ApiClients.VkService;
using choco.Data;
using choco.Data.Models;
using choco.Exceptions;
using choco.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ExportController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly VkServiceClient _vkServiceClient;

    public ExportController(AppDbContext db, VkServiceClient vkServiceClient)
    {
        _db = db;
        _vkServiceClient = vkServiceClient;
    }

    [HttpGet("ReplacePost")]
    public async Task<ActionResult> ReplacePost()
    {
        var products = await _db.Products
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
            .ToListAsync();
        var imageData = ReplacePostUtil.GenerateImage(products).ToArray();
        try
        {
            await new ReplacePostUtil(_vkServiceClient).ReplacePost(imageData);
        }
        catch (UploadingImageException e)
        {
            return Problem(e.Message);
        }

        return Ok();
    }

    [HttpGet("Image")]
    public async Task<ActionResult> ExportImage()
    {
        var products = await _db.Products
            .Where(p => p.Leftover > 0 && !p.Deleted)
            .OrderBy(p => p.Name)
            .Select(p =>
                new Product
                {
                    Category = null,
                    Deleted = p.Deleted,
                    Id = p.Id,
                    IsByWeight = p.IsByWeight,
                    Leftover = Math.Floor(p.Leftover),
                    MarketId = p.MarketId,
                    Name = p.Name,
                    RetailPrice = p.RetailPrice,
                    WholesalePrice = p.WholesalePrice
                })
            .ToListAsync();
        var imageData = ReplacePostUtil.GenerateImage(products).ToArray();

        return File(imageData, "image/jpeg");
    }
}