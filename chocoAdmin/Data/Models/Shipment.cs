namespace choco.Data.Models;

public class Shipment: BaseModel
{
    public DateOnly Date { get; set; }
    public List<ShipmentItem> ShipmentItems { get; set; }
}