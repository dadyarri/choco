namespace choco.RequestBodies;

public class UpdateShipmentRequestBody
{
    public DateOnly Date { get; set; }
    public Guid Status { get; set; }
    public List<CreateShipmentItemsRequestBody> ShipmentItems { get; set; }
}