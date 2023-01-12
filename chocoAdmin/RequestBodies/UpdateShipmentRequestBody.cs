namespace choco.RequestBodies;

public class UpdateShipmentRequestBody
{
    public Guid Status { get; set; }
    public Guid ShipmentId { get; set; }
}