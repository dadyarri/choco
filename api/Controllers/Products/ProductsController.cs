using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.Models;
using api.RequestBodies;
using api.Responses;
using Newtonsoft.Json;

namespace api.Controllers.Products;

/// <summary>
/// Работа с коллекцией товаров
/// </summary>
[ApiController]
[Route("api/v2/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationContext _db;

    /// <summary>
    /// Конструктор контроллера
    /// </summary>
    /// <param name="context">Автоматически добавляемый контекст базы данных</param>
    public ProductsController(ApplicationContext context)
    {
        _db = context;
    }

    /// <summary>
    /// Получение всех доступных товаров
    /// </summary>
    /// <param name="parameters">Параметры пагинации</param>
    /// <response code="200">Данные успешно получены</response>
    /// <response code="401">Ошибка авторизации</response>
    [HttpGet]
    [Authorize]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Paged<Product>>> GetAllProducts([FromQuery] PagingParameters parameters)
    {
        var queryResults = _db.Products.OrderBy(p => p.Id);

        Paged<Product> products =
            await Paged<Product>.ToPaged(queryResults, parameters.PageNumber, parameters.PageSize);

        var metadata = new
        {
            products.TotalCount,
            products.PageSize,
            products.CurrentPage,
            products.TotalPages,
            products.HasPrevious,
            products.HasNext
        };

        Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

        return Ok(products);
    }

    /// <summary>
    /// Создание товара
    /// </summary>
    /// <param name="product">Модель товара</param>
    /// <response code="201">Ресурс успешно создан</response>
    /// <response code="401">Ошибка авторизации</response>
    [HttpPost]
    [Authorize]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        var created = _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return Created("/api/v2/Products", created.Entity);
    }
}