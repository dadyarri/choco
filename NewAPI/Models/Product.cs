using System.ComponentModel.DataAnnotations;

namespace NewAPI.Models;

/// <summary>
/// Модель, представляющая товар
/// </summary>
public class Product
{
    /// <summary>
    /// Идентификатор товара
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Название товара
    /// </summary>
    [Required]
    public string Name { get; set; }

    /// <summary>
    /// Оптовая цена
    /// </summary>
    [Required]
    public int WholesalePrice { get; set; }

    /// <summary>
    /// Розничная цена
    /// </summary>
    [Required]
    public int RetailPrice { get; set; }

    /// <summary>
    /// Остаток на складе
    /// </summary>
    [Required]
    public int Leftover { get; set; }

    /// <summary>
    /// Идентификатор товара в Магазине ВК
    /// </summary>
    public int? MarketId { get; set; }

    /// <summary>
    /// Флаг, указывающий на то, продаётся ли товар на развес
    /// </summary>
    [Required]
    public bool IsByWeight { get; set; }
}