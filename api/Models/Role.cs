using Newtonsoft.Json;

namespace api.Models;

/// <summary>
/// Модель, представляющая роль пользователя
/// </summary>
public class Role
{
    /// <summary>
    /// Идентификатор роли
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Название роли
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Список пользователей с ролью
    /// </summary>
    [JsonIgnore]
    public List<User> Users { get; set; }
}