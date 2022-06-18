namespace NewAPI.Models;

/// <summary>
/// Модель, представляющая заказ пользователя
/// </summary>
public class Order
{
    /// <summary>
    /// Идентификатор заказа
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Источник заказа
    /// </summary>
    public OrderSource Source { get; set; }

    /// <summary>
    /// Статус заказа
    /// </summary>
    public OrderState State { get; set; }

    /// <summary>
    /// Город, в котором был совершён заказ
    /// </summary>
    public OrderCity City { get; set; }
}