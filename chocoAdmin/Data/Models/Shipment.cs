namespace choco.Data.Models;

public class Shipment: BaseModel<Guid>
{
    public DateOnly Date { get; set; }
    public List<ShipmentItem> ShipmentItems { get; set; }
}