using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using NewAPI.Data;
using NewAPI.Models;
using NewAPI.RequestBodies;

namespace NewAPI.Controllers.Auth;

[ApiController]
[Route("api/v2/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationContext _db;

    public AuthController(ApplicationContext context)
    {
        _db = context;
    }

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
        await _db.SaveChangesAsync();
        return Created("/api/v2/Auth", user);
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using (var hmac = new HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}