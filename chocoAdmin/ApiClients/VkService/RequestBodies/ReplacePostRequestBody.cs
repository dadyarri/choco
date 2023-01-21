using System.Text.Json.Serialization;

namespace choco.ApiClients.VkService.RequestBodies;

public class ReplacePostRequestBody
{
    [JsonPropertyName("photo")]
    public string Photo { get; set; }
    [JsonPropertyName("text")]
    public string? Text { get; set; }
}
