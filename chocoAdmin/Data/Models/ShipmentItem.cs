namespace choco.Data.Models;

public class ShipmentItem: BaseModel
{
    public Shipment Shipment { get; set; }
    public Product Product { get; set; }
    public double Amount { get; set; }
    public ShipmentItemStatus Status { get; set; }
}