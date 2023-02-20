using choco.ApiClients.VkService;
using choco.ApiClients.VkService.Services;
using choco.Data;
using choco.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class VkController : ControllerBase
{
    private readonly VkServiceClient _vkServiceClient;

    public VkController(VkServiceClient vkServiceClient)
    {
        _vkServiceClient = vkServiceClient;
    }

    [Authorize]
    [HttpGet("ProductUrl/{marketId:int}")]
    public async Task<ActionResult> GetProductUrl(int marketId)
    {
        return Ok(await _vkServiceClient.GetProductUrl(marketId));
    }
}