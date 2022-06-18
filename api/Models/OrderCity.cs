namespace NewAPI.Models;

/// <summary>
/// Модель, представляющая город заказа
/// </summary>
public class OrderCity
{
    /// <summary>
    /// Конструктор города
    /// </summary>
    /// <param name="name">Название города</param>
    public OrderCity(string name)
    {
        Name = name;
    }

    /// <summary>
    /// Идентификатор заказа
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Название города
    /// </summary>
    public string Name { get; set; }
}