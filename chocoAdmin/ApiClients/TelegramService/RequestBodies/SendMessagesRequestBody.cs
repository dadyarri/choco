using System.Text.Json.Serialization;

namespace choco.ApiClients.TelegramService.RequestBodies;

public class SendMessagesRequestBody
{
    [JsonPropertyName("message")]
    public string Message { get; set; }
    [JsonPropertyName("user_ids")]
    public List<long> UserIds { get; set; }
}