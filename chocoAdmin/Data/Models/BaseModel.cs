namespace choco.Data.Models;

/// <summary>
/// Базовая модель, от которой наследуются все модели
/// </summary>
public class BaseModel
{
    /// <summary>
    /// Идентификатор
    /// </summary>
    public Guid Id { get; set; }
}