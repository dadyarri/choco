namespace choco.ApiClients.Vk.Models;

public class MarketEditParams
{
    public int ItemId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Price { get; set; }
    public int StockAmount { get; set; }
}