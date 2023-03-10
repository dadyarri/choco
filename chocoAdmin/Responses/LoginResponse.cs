namespace choco.Responses;

public class LoginResponse
{
    public string Token { get; set; }
    public string Name { get; set; }
    public Uri AvatarUri { get; set; }
}