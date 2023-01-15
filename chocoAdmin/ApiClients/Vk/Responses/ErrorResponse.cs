namespace choco.ApiClients.Vk.Responses;

public class ErrorResponse
{
    public int ErrorCode { get; set; }
    public string ErrorMsg { get; set; }
    public List<KeyValueObject> RequestParams { get; set; }
}