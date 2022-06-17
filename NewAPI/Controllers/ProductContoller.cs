using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewAPI.Data;
using NewAPI.Models;

namespace NewAPI.Controllers;

/// <summary>
/// Работа с отдельными элементами коллекции товаров
/// </summary>
[ApiController]
[Route("/api/v2/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ApplicationContext _db;
    private readonly ILogger<ProductController> _logger;

    /// <summary>
    /// Конструктор контроллера
    /// </summary>
    /// <param name="context">Автоматически добавляемый контекст базы данных</param>
    /// <param name="logger">Автоматически добавляемый логгер</param>
    public ProductController(ApplicationContext context, ILogger<ProductController> logger)
    {
        _db = context;
        _logger = logger;
    }

    /// <summary>
    /// Получение товара по идентификатору
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
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

    /// <summary>
    /// Получение товара по идентификатору в магазине ВК
    /// </summary>
    /// <param name="marketId">Идентификатор товара в магазине ВК</param>
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

    /// <summary>
    /// Обновление товара
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <param name="product">Запрос в формате JSON PATCH, обновляющий ресурс</param>
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

    /// <summary>
    /// Удаление товара
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <returns></returns>
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