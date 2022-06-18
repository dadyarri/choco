using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using NewAPI.Data;
using NewAPI.Models;
using NewAPI.RequestBodies;
using Npgsql;

namespace NewAPI.Controllers.Auth;

/// <summary>
/// Работа с пользователями (регистрация/авторизация/аутентификация...)
/// </summary>
[ApiController]
[Route("api/v2/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationContext _db;

    /// <summary>
    /// Конструктор контроллера
    /// </summary>
    /// <param name="context">Автоматически добавляемый контекст базы данных</param>
    public AuthController(ApplicationContext context)
    {
        _db = context;
    }

    /// <summary>
    /// Регистрация пользователя
    /// </summary>
    /// <param name="body">Тело запроса с именем пользователя и паролем</param>
    [HttpPost]
    public async Task<ActionResult<User>> Register(UserParameters body)
    {
        CreatePasswordHash(body.Password, out byte[] passwordHash, out byte[] passwordSalt);
        var user = new User
        {
            Username = body.Username,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt
        };

        await _db.Users.AddAsync(user);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException ex) when
            (ex.InnerException is PostgresException exception)
        {
            return exception.SqlState switch
            {
                PostgresErrorCodes.UniqueViolation => Conflict(user),
                _ => Problem(exception.MessageText)
            };
        }

        return Created("/api/v2/Auth", user);
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512();
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    }
}