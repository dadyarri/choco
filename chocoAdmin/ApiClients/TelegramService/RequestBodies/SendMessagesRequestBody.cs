namespace choco.ApiClients.TelegramService.RequestBodies;

public class SendMessagesRequestBody
{
    public string Message { get; set; }
    public List<long> UserIds { get; set; }
}