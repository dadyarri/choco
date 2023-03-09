namespace choco.Data.Models;

/// <summary>
/// Категория товара
/// </summary>
public class ProductCategory: BaseModel
{
    /// <summary>
    /// Название категории товара (например: молочный, горький...)
    /// </summary>
    public string Name { get; set; }

    public bool Deleted { get; set; }
}