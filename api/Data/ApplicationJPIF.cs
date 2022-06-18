using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;

namespace api.Data;

/// <summary>
/// Форматтер тела PATCH запроса
/// </summary>
public class ApplicationJpif
{
    /// <summary>
    /// Получает форматтер тела PATCH запроса
    /// </summary>
    /// <returns></returns>
    public static NewtonsoftJsonInputFormatter GetJsonPatchInputFormatter()
    {
        var builder = new ServiceCollection()
            .AddLogging()
            .AddMvc()
            .AddNewtonsoftJson()
            .Services
            .BuildServiceProvider();

        return builder
            .GetRequiredService<IOptions<MvcOptions>>()
            .Value
            .InputFormatters
            .OfType<NewtonsoftJsonInputFormatter>()
            .First();
    }
}