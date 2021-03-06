using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using api.Responses;

namespace api.Controllers.Products;

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
    /// <response code="200">Товар найден</response>
    /// <response code="401">Ошибка авторизации</response>
    /// <response code="404">Товар не найден</response>
    [HttpGet("{id:int}")]
    [Authorize(Roles="Administrator")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
        var product = await _db.Products.FindAsync(id);

        if (product is null)
        {
            return NotFound(new Error
            {
                Code = (int)HttpStatusCode.NotFound,
                Message = "Product with this id was not found",
                Data = id
            });
        }

        return product;
    }

    /// <summary>
    /// Получение товара по идентификатору в магазине ВК
    /// </summary>
    /// <param name="marketId">Идентификатор товара в магазине ВК</param>
    /// <response code="200">Товар найден</response>
    /// <response code="401">Ошибка авторизации</response>
    /// <response code="404">Товар не найден</response>
    [Authorize(Roles="Administrator")]
    [Produces("application/json")]
    [HttpGet("Market/{marketId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Product>> GetProductByMarketId(int marketId)
    {
        try
        {
            return await _db.Products.SingleAsync(p => p.MarketId == marketId);
        }
        catch (InvalidOperationException)
        {
            return NotFound(new Error
            {
                Code = (int)HttpStatusCode.NotFound,
                Message = "Chat with this marketId was not found",
                Data = marketId
            });
        }
    }

    /// <summary>
    /// Обновление товара
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <param name="product">Запрос в формате JSON PATCH, обновляющий ресурс</param>
    /// <response code="400">Тело запроса не передано или не валидно</response>
    /// <response code="401">Ошибка авторизации</response>
    /// <response code="404">Товар не найден</response>
    /// <response code="200">Товар изменён</response>
    [HttpPatch("{id:int}")]
    [Authorize(Roles="Administrator")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] JsonPatchDocument<Product>? product)
    {
        if (product == null)
            return BadRequest(new Error
            {
                Code = (int)HttpStatusCode.BadRequest,
                Message = "Product was not passed"
            });

        var entity = await _db.Products.FindAsync(id);

        if (entity == null)
        {
            return NotFound(new Error
            {
                Code = (int)HttpStatusCode.NotFound,
                Message = "Product with this id was not found",
                Data = id
            });
        }

        product.ApplyTo(entity, ModelState);
        await _db.SaveChangesAsync();
        return Ok(entity);
    }

    /// <summary>
    /// Удаление товара
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <response code="204">Товар удалён</response>
    /// <response code="401">Ошибка авторизации</response>
    /// <response code="404">Товар не найден</response>
    [HttpDelete("{id:int}")]
    [Authorize(Roles="Administrator")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var entity = await _db.Products.FindAsync(id);

        if (entity is null)
        {
            return NotFound(new Error
            {
                Code = (int)HttpStatusCode.NotFound,
                Message = "Product with this id was not found",
                Data = id
            });
        }

        _db.Products.Remove(entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}