using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using choco.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;
    private readonly ILogger _logger;

    public AuthController(AppDbContext db, IConfiguration configuration, ILogger logger)
    {
        _db = db;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterRequestBody body)
    {
        CreatePasswordHash(body.Password, out var passwordHash, out var passwordSalt);

        var user = new User
        {
            Username = body.Username,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            AvatarUri = body.AvatarUri,
            Name = body.Name
        };

        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();

        _logger.LogInformation("User {} created", user.Username);

        return Created("/auth/register", user);
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginRequestBody body)
    {
        var user = await _db.Users.Where(u => u.Username == body.Username).FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound();
        }

        if (!VerifyPasswordHash(body.Password, user.PasswordHash, user.PasswordSalt))
        {
            return Forbid();
        }

        var token = GenerateToken(user);

        _logger.LogInformation("User {} logged in", user.Username);
        return Ok(new LoginResponse { Token = token, Name = user.Name, AvatarUri = user.AvatarUri });
    }

    [Authorize]
    [HttpGet("verify")]
    public async Task<ActionResult> Verify()
    {
        return Ok();
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512();
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }

    private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512(passwordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computedHash.SequenceEqual(passwordHash);
    }

    private string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Username)
        };

        var securityKey = _configuration.GetRequiredSection("Security").GetValue<string>("Key");
        ArgumentException.ThrowIfNullOrEmpty(securityKey);

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(securityKey));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(2),
            signingCredentials: credentials
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }
}