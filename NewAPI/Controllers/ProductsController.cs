using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewAPI.Data;
using NewAPI.Models;

namespace NewAPI.Controllers;

[ApiController]
[Route("api/v2/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationContext _db;

    public ProductsController(ApplicationContext context)
    {
        _db = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAllProducts()
    {
        return await _db.Products.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        var created = _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return created.Entity;
    }
}