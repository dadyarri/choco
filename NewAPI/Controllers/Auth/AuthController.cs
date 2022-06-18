using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NewAPI.Data;
using NewAPI.Models;
using NewAPI.RequestBodies;
using NewAPI.Responses;
using Npgsql;

namespace NewAPI.Controllers.Auth;

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
    public AuthController(ApplicationContext context, IConfiguration configuration)
    {
        _db = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Регистрация пользователя
    /// </summary>
    /// <param name="body">Тело запроса с именем пользователя и паролем</param>
    [HttpPost("Register")]
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


    [HttpPost("Login")]
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

    private string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Username)
        };

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