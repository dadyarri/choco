namespace NewAPI.RequestBodies;

/// <summary>
/// Параметры пагинации
/// </summary>
public class PagingParameters
{
    private const int MaxPageSize = 7;

    private readonly int _pageSize;

    /// <summary>
    /// Номер страницы
    /// </summary>
    public int PageNumber { get; init; } = 1;

    /// <summary>
    /// Количество элементов на странице
    /// </summary>
    public int PageSize
    {
        get => _pageSize;
        init => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
}