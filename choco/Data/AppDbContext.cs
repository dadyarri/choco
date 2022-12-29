using choco.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace choco.Data;

public class AppDbContext: DbContext
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
}