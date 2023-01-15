namespace choco.ApiClients.VkService.RequestBodies;

public class EditProductRequestBody
{
    public int MarketId { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public int Leftover { get; set; }
}
