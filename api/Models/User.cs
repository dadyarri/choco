using Newtonsoft.Json;

namespace api.Models;

/// <summary>
/// Модель, представляющая пользователя
/// </summary>
public class User
{
    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Имя пользователя
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Хеш пароля пользователя
    /// </summary>
    [JsonIgnore] public byte[] PasswordHash { get; set; }

    /// <summary>
    /// Соль пароля пользователя
    /// </summary>
    [JsonIgnore] public byte[] PasswordSalt { get; set; }

    /// <summary>
    /// Список ролей пользователя
    /// </summary>
    public List<Role> Roles { get; set; }
}