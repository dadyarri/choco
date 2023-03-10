namespace choco.RequestBodies;

public class RegisterRequestBody
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Uri AvatarUri { get; set; }
    public string Name { get; set; }
}