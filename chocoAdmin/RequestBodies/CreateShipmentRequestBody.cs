using choco.Data.Models;

namespace choco.RequestBodies;

public class CreateShipmentRequestBody
{
    public DateOnly Date { get; set; }
    public List<CreateShipmentItemsRequestBody> ShipmentItems { get; set; }
    public Guid Status { get; set; }
    
}
public class CreateShipmentItemsRequestBody
{
    public Guid Id { get; set; }
    public double Amount { get; set; }
}