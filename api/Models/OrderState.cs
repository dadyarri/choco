namespace api.Models;

/// <summary>
/// Модель, представляющая статус заказа
/// </summary>
public class OrderState
{
    /// <summary>
    /// Конструктов
    /// </summary>
    /// <param name="name">Название статуса</param>
    public OrderState(string name)
    {
        Name = name;
    }

    /// <summary>
    /// Идентификатор статуса
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Название статуса
    /// </summary>
    public string Name { get; set; }
}