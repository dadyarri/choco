namespace choco.RequestBodies;

public class LoginByRefreshTokenRequestBody
{
    public string Username { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}