namespace api.Responses;

/// <summary>
/// Тело ответа, возвращаемого, когда происходит ошибка
/// </summary>
public class Error
{
    /// <summary>
    /// HTTP код ошибки
    /// </summary>
    public int Code { get; set; }
    
    /// <summary>
    /// Сообщение об ошибке
    /// </summary>
    public string Message { get; set; }
    
    /// <summary>
    /// Опциональные данные, описывающие причину ошибки
    /// </summary>
    public object? Data { get; set; }
}