namespace choco.Data.Models;

/// <summary>
/// Модель, представляющая товар
/// </summary>
public class Product: BaseModel
{
    /// <summary>
    /// Категория товара (например: молочный, горький...)
    /// </summary>
    public ProductCategory Category { get; set; }
    
    /// <summary>
    /// Название товара
    /// </summary>
    public string Name { get; set; }
    
    /// <summary>
    /// Розничная цена
    /// </summary>
    public int RetailPrice { get; set; }
    
    /// <summary>
    /// Оптовая цена
    /// </summary>
    public int WholesalePrice { get; set; }
    
    /// <summary>
    /// Флаг, указывающий на то, должен ли товар продаваться "на развес"
    /// </summary>
    public bool IsByWeight { get; set; }
    
    /// <summary>
    /// Количество товара, оставшегося на складе
    /// </summary>
    public double Leftover { get; set; }
}