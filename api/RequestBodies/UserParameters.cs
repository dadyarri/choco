namespace api.RequestBodies;

/// <summary>
/// Тело запроса к методам группы Auth
/// </summary>
public class UserParameters
{
    /// <summary>
    /// Имя пользователя
    /// </summary>
    public string Username { get; set; } = string.Empty;
    
    /// <summary>
    /// Пароль
    /// </summary>
    public string Password { get; set; } = string.Empty;
}