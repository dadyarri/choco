using choco.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace choco.Data;

public class AppDbContext : DbContext
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<Shipment> Shipments => Set<Shipment>();
    public DbSet<ShipmentStatus> ShipmentStatuses => Set<ShipmentStatus>();
    public DbSet<ShipmentItem> ShipmentItems => Set<ShipmentItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderStatus> OrderStatuses => Set<OrderStatus>();
    public DbSet<OrderCity> OrderCities => Set<OrderCity>();
    public DbSet<OrderAddress> OrderAddresses => Set<OrderAddress>();
    public DbSet<User> Users => Set<User>();

    public AppDbContext(DbContextOptions<AppDbContext> contextOptions) : base(contextOptions)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderCity>().HasData(
            new OrderCity { Id = new Guid("ff463388-158c-48ab-98c2-6b798ceda4ed"), Name = "Владимир" },
            new OrderCity { Id = new Guid("121ed4ac-8fd9-4a2f-b88e-80129fbbc824"), Name = "Фурманов" },
            new OrderCity { Id = new Guid("0b1b3201-ace5-475b-8ddc-9e15af8f9f77"), Name = "Приволжск" },
            new OrderCity { Id = new Guid("44d561fe-a8fd-4f3f-8674-75942b34e48a"), Name = "Иваново" }
        );
        modelBuilder.Entity<ShipmentStatus>().HasData(
            new ShipmentStatus { Id = new Guid("21ecdafc-dc56-4bb2-868f-0be776726713"), Name = "Обрабатывается" },
            new ShipmentStatus { Id = new Guid("90786c29-b967-457f-afe6-714d92b5fffd"), Name = "Доставляется" },
            new ShipmentStatus { Id = new Guid("9ba56286-f218-4a04-a682-9ded4613a33e"), Name = "Выполнена" },
            new ShipmentStatus { Id = new Guid("d5c0799e-bd48-4e12-985b-502a05e72432"), Name = "Отменена" }
        );
        modelBuilder.Entity<OrderStatus>().HasData(
            new OrderStatus { Id = new Guid("f6ef3e23-a292-4ee8-ac4b-03ba6d95830f"), Name = "Обрабатывается" },
            new OrderStatus { Id = new Guid("3c3fd23a-e53f-446f-b7d9-82647eb87e59"), Name = "Доставляется" },
            new OrderStatus { Id = new Guid("4aa80967-1dbb-452e-acba-ac027d88fea6"), Name = "Ожидает получения" },
            new OrderStatus { Id = new Guid("bd40220b-354c-474f-a6eb-e5106ca7dd2a"), Name = "Выполнен" },
            new OrderStatus { Id = new Guid("1ffb1ac4-2cfe-42af-8b4c-e782ea720f97"), Name = "Отменён" }
        );
        base.OnModelCreating(modelBuilder);
    }
}
