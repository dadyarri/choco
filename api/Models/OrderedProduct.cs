namespace api.Models;

/// <summary>
/// Модель, преставляющая заказанный товар
/// </summary>
public class OrderedProduct
{
    /// <summary>
    /// Идентификатор заказанного товара
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Идентификатор заказа
    /// </summary>
    public Order Order { get; init; }

    /// <summary>
    /// Идентификатор товара
    /// </summary>
    public Product Product { get; set; }

    /// <summary>
    /// Количество товара
    /// </summary>
    public int Quantity { get; set; }
}