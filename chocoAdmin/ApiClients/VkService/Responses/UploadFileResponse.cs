using System.Text.Json.Serialization;

namespace choco.ApiClients.VkService.Responses;

public class UploadFileResponse
{
    [JsonPropertyName("photo")]
    public string Photo { get; set; }
}