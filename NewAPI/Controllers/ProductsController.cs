using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewAPI.Data;
using NewAPI.Models;

namespace NewAPI.Controllers;

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
    /// <response code="200">Данные успешно получены</response>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<Product>>> GetAllProducts()
    {
        return await _db.Products.ToListAsync();
    }

    /// <summary>
    /// Создание товара
    /// </summary>
    /// <param name="product">Модель товара</param>
    /// <response code="201">Ресурс успешно создан</response>
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        var created = _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return Created("/api/v2/Products", created.Entity);
    }
}