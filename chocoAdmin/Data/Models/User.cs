namespace choco.Data.Models;

public class User : BaseModel
{
    public string Username { get; set; } = string.Empty;
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
    public Uri AvatarUri { get; set; }
    public string Name { get; set; }
}