using Microsoft.EntityFrameworkCore;
using NewAPI.Models;

namespace NewAPI.Data;

public class ApplicationContext : DbContext
{
    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {
    }

    public DbSet<Chat> Chats => Set<Chat>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderCity> OrderCities => Set<OrderCity>();
    public DbSet<OrderedProduct> OrderedProducts => Set<OrderedProduct>();
    public DbSet<OrderSource> OrderSources => Set<OrderSource>();
    public DbSet<OrderState> OrderStates => Set<OrderState>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
}