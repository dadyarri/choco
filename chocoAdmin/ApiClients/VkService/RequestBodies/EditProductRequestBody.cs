using System.Text.Json.Serialization;

namespace choco.ApiClients.VkService.RequestBodies;

public class EditProductRequestBody
{
    [JsonPropertyName("marketId")]
    public int MarketId { get; set; }
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("price")]
    public int? Price { get; set; }
    [JsonPropertyName("leftover")]
    public int? Leftover { get; set; }
    
    [JsonPropertyName("deleted")]
    public bool? IsDeleted { get; set; }
}
