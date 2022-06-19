using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace api.OperationFilters;

/// <summary>
/// Фильтр, назначающий авторизацию по JWT-токену всем методам без атрибута AllowAnonymousAttribute
/// </summary>
public class AuthResponsesOperationFilter : IOperationFilter
{
    
    /// <summary>
    /// Применяет фильтр
    /// </summary>
    /// <param name="operation">Операция OpenAPI</param>
    /// <param name="context">Контекст фильтра</param>
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (!context.MethodInfo.GetCustomAttributes(true).Any(x => x is AllowAnonymousAttribute) && !context.MethodInfo
                .DeclaringType.GetCustomAttributes(true).Any(x => x is AllowAnonymousAttribute))
        {
            operation.Security = new List<OpenApiSecurityRequirement>()
            {
                new()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                }
            };
        }
    }
}