using Newtonsoft.Json;

namespace NewAPI.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;

    [JsonIgnore] public byte[] PasswordHash { get; set; }

    [JsonIgnore] public byte[] PasswordSalt { get; set; }
}