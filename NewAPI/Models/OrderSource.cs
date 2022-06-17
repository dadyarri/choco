namespace NewAPI.Models;

/// <summary>
/// Модель, представляющая источник заказа
/// </summary>
public class OrderSource
{
    /// <summary>
    /// Конструктор
    /// </summary>
    /// <param name="name">Название источника</param>
    public OrderSource(string name)
    {
        Name = name;
    }

    /// <summary>
    /// Идентификатор источника заказа
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Название источника
    /// </summary>
    public string Name { get; set; }
}