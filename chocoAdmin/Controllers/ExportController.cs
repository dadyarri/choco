using choco.Data;
using choco.Data.Models;
using choco.Utils.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ExportController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger _logger;
    private readonly IVkUpdateUtils _vkUpdateUtils;
    private readonly IReplacePostUtil _replacePostUtil;

    public ExportController(AppDbContext db, ILogger logger, IVkUpdateUtils vkUpdateUtils, IReplacePostUtil replacePostUtil)
    {
        _db = db;
        _logger = logger;
        _vkUpdateUtils = vkUpdateUtils;
        _replacePostUtil = replacePostUtil;
    }

    [Authorize]
    [HttpGet("ReplacePost")]
    public async Task<ActionResult> ReplacePost()
    {
        await _vkUpdateUtils.ReplacePost();
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
        var imageData = _replacePostUtil.GenerateImage(products).ToArray();

        _logger.LogInformation("Image requested");
        return File(imageData, "image/jpeg");
    }
}