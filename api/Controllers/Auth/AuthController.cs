using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using api.Data;
using api.Models;
using api.RequestBodies;
using api.Responses;
using Npgsql;

namespace api.Controllers.Auth;

/// <summary>
/// Работа с пользователями (регистрация/авторизация/аутентификация...)
/// </summary>
[ApiController]
[Route("api/v2/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationContext _db;

    /// <summary>
    /// Конструктор контроллера
    /// </summary>
    /// <param name="context">Автоматически добавляемый контекст базы данных</param>
    /// <param name="configuration">Автоматически добавляемая конфигурация проекта</param>
    public AuthController(ApplicationContext context, IConfiguration configuration)
    {
        _db = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Регистрация пользователя
    /// </summary>
    /// <param name="body">Тело запроса с именем пользователя и паролем</param>
    /// <response code="201">Пользователь создан</response>
    /// <response code="409">Конфликт (пользователь с таким именем уже есть)</response>
    /// <response code="500">Ошибка сервера</response>
    [AllowAnonymous]
    [HttpPost("Register")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
        catch (DbUpdateException ex) when
            (ex.InnerException is PostgresException exception)
        {
            return exception.SqlState switch
            {
                PostgresErrorCodes.UniqueViolation => Conflict(new Error
                {
                    Code = (int)HttpStatusCode.Conflict,
                    Message = "User already exist",
                    Data = body.Username
                }),
                _ => Problem(exception.MessageText)
            };
        }

        return Created("/api/v2/Auth", user);
    }


    /// <summary>
    /// Аутентификация пользователя и генерация JWT
    /// </summary>
    /// <param name="body">Логин и пароль пользователя</param>
    /// <response code="200">Токен сгенерирован</response>
    /// <response code="400">Невалидные данные (имя пользователя/пароль)</response>
    [AllowAnonymous]
    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<string>> Login(UserParameters body)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Username.Equals(body.Username));

        if (user is null)
        {
            return BadRequest(new Error
            {
                Code = (int)HttpStatusCode.BadRequest,
                Message = "User was not found",
                Data = body.Username
            });
        }

        if (!VerifyPasswordHash(body.Password, user.PasswordHash, user.PasswordSalt))
        {
            return BadRequest(new Error
            {
                Code = (int)HttpStatusCode.BadRequest,
                Message = "Wrong password"
            });
        }

        return Ok(GenerateToken(user));
    }

    /// <summary>
    /// Получение информации о текущем пользователе
    /// </summary>
    /// <response code="200">Данные получены</response>
    /// <response code="401">Пользователь не авторизован</response>
    [Authorize]
    [HttpGet("Whoami")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<UserResponse> Whoami()
    {
        var user = GetCurrentUser();

        if (user is not null)
        {
            return Ok(user);
        }

        return Unauthorized(new Error
        {
            Code = (int)HttpStatusCode.Unauthorized,
            Message = "User is not authorized"
        });
    }

    private UserResponse? GetCurrentUser()
    {
        if (HttpContext.User.Identity is not ClaimsIdentity identity) return null;
        var userClaims = identity.Claims;
        return new UserResponse
        {
            Username = userClaims.First(c => c.Type == ClaimTypes.Name).Value
        };
    }

    private string GenerateToken(User user)
    {
        
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Username),
        };

        var rolesOfUser = _db.Roles.Where(
            r => r.Users.Any(u => u.Id == user.Id));

        foreach (var role in rolesOfUser)
        {
            claims.Add(new Claim(ClaimTypes.Role, role.Name));
        }

        var key = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("Security:Token").Value));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            issuer: _configuration.GetSection("Security:Issuer").Value,
            audience: _configuration.GetSection("Security:Audience").Value,
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: credentials
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512();
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    }

    private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512(passwordSalt);
        var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        return computedHash.SequenceEqual(passwordHash);
    }
}