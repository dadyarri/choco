using choco.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace choco.Data;

public class AppDbContext: DbContext
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<Shipment> Shipments => Set<Shipment>();
    public DbSet<ShipmentStatus> ShipmentStatuses => Set<ShipmentStatus>();
    public DbSet<ShipmentItem> ShipmentItems => Set<ShipmentItem>();
    public DbSet<ShipmentItemStatus> ShipmentItemStatuses => Set<ShipmentItemStatus>();
    
    public AppDbContext(DbContextOptions<AppDbContext> contextOptions) : base(contextOptions) {}
}