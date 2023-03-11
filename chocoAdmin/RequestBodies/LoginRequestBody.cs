namespace choco.RequestBodies;

public class LoginRequestBody
{
    public string Username { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}