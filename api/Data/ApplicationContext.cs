using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data;

/// <summary>
/// Контекст базы данных
/// </summary>
public class ApplicationContext : DbContext
{
    /// <summary>
    /// Конструктор контекста
    /// </summary>
    /// <param name="options">Параметры контекста</param>
    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {
    }

    /// <summary>
    /// Коллекция чатов
    /// </summary>
    public DbSet<Chat> Chats => Set<Chat>();

    /// <summary>
    /// Коллекция заказов
    /// </summary>
    public DbSet<Order> Orders => Set<Order>();

    /// <summary>
    /// Коллекция городов, доступных для совершения заказа
    /// </summary>
    public DbSet<OrderCity> OrderCities => Set<OrderCity>();

    /// <summary>
    /// Коллекция заказанных товаров
    /// </summary>
    public DbSet<OrderedProduct> OrderedProducts => Set<OrderedProduct>();

    /// <summary>
    /// Коллекция источников заказа
    /// </summary>
    public DbSet<OrderSource> OrderSources => Set<OrderSource>();

    /// <summary>
    /// Коллекция состояний заказа
    /// </summary>
    public DbSet<OrderState> OrderStates => Set<OrderState>();

    /// <summary>
    /// Коллекция товаров
    /// </summary>
    public DbSet<Product> Products => Set<Product>();

    /// <summary>
    /// Коллекция товаров
    /// </summary>
    public DbSet<Role> Roles => Set<Role>();

    /// <summary>
    /// Коллекция пользователей
    /// </summary>
    public DbSet<User> Users => Set<User>();

    /// <summary>
    /// Операции, выполняемые при создании таблиц
    /// </summary>
    /// <param name="builder"></param>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>(entity => { entity.HasIndex(e => e.Username).IsUnique(); });
    }
}