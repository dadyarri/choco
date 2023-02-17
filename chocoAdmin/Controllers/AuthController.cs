using System.Security.Cryptography;
using System.Text;
using choco.Data;
using choco.Data.Models;
using choco.RequestBodies;
using Microsoft.AspNetCore.Mvc;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController: ControllerBase
{

    private readonly AppDbContext _db;

    public AuthController(AppDbContext db)
    {
        _db = db;
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
        
        return Created("/auth/register", user);
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512();
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }
}