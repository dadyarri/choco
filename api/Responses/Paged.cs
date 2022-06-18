using Microsoft.EntityFrameworkCore;

namespace NewAPI.Responses;

/// <summary>
/// Постраничный список
/// </summary>
/// <typeparam name="TModel"></typeparam>
public class Paged<TModel> : List<TModel>
{
    /// <summary>
    /// Номер текущей страницы
    /// </summary>
    public readonly int CurrentPage;

    /// <summary>
    /// Общее количество страниц
    /// </summary>
    public readonly int TotalPages;

    /// <summary>
    /// Размер страницы
    /// </summary>
    public int PageSize;

    /// <summary>
    /// Общее количество элементов
    /// </summary>
    public int TotalCount;

    /// <summary>
    /// Конструктов
    /// </summary>
    /// <param name="items">Список моделей</param>
    /// <param name="count">Количество элементов</param>
    /// <param name="pageNumber">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    public Paged(List<TModel> items, int count, int pageNumber, int pageSize)
    {
        TotalCount = count;
        PageSize = pageSize;
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);

        AddRange(items);
    }

    /// <summary>
    /// Флаг, указывающий на наличие предыдущей страницы
    /// </summary>
    public bool HasPrevious => CurrentPage > 1;

    /// <summary>
    /// Флаг, указывающий на наличие следующей страницы
    /// </summary>
    public bool HasNext => CurrentPage < TotalPages;

    /// <summary>
    /// Конвертирование результата запроса в постраничный список
    /// </summary>
    /// <param name="source">Исходные данные</param>
    /// <param name="pageNumber">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    /// <returns></returns>
    public static async Task<Paged<TModel>> ToPaged(IQueryable<TModel> source, int pageNumber, int pageSize)
    {
        int count = source.Count();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new Paged<TModel>(items, count, pageNumber, pageSize);
    }
}