namespace api.Models;

/// <summary>
/// Модель, представляющая чат с пользователем ВК
/// </summary>
public class Chat
{
    /// <summary>
    /// Идентификатор
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Идентификатор чата в ВК
    /// </summary>
    public int VkId { get; set; }

    /// <summary>
    /// Статус чата: активен/не активен
    /// </summary>
    public bool IsActive { get; set; }
}