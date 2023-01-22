using choco.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace choco.Data;

public class AppDbContext : DbContext
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<Shipment> Shipments => Set<Shipment>();
    public DbSet<MovingStatus> MovingStatuses => Set<MovingStatus>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<MovingItem> MovingItems => Set<MovingItem>();
    public DbSet<OrderCity> OrderCities => Set<OrderCity>();
    public DbSet<OrderAddress> OrderAddresses => Set<OrderAddress>();

    public AppDbContext(DbContextOptions<AppDbContext> contextOptions) : base(contextOptions)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderCity>().HasData(
            new OrderCity { Id = new Guid("7bb926d3-04e1-4419-adec-8182fc5e5447"), Name = "Владимир" },
            new OrderCity { Id = new Guid("b07cd394-9803-45db-809e-9d830c16089b"), Name = "Фурманов" }
        );
        modelBuilder.Entity<MovingStatus>().HasData(
            new MovingStatus { Id = new Guid("d057e2b1-e980-499d-b2e0-0655edeee50d"), Name = "Обрабатывается" },
            new MovingStatus { Id = new Guid("86b7dcde-a491-47b2-b984-44928d76a6c0"), Name = "Доставляется" },
            new MovingStatus { Id = new Guid("7a572649-b14d-403c-9975-4632ccb15b0c"), Name = "Выполнено" },
            new MovingStatus { Id = new Guid("cc5f4a12-9105-44d7-9130-0ff5583dafac"), Name = "Отменено" }
        );
        base.OnModelCreating(modelBuilder);
    }
}