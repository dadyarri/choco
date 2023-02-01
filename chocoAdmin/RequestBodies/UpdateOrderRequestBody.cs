namespace choco.RequestBodies;

public class UpdateOrderRequestBody
{
    public DateOnly Date { get; set; }
    public Guid Status { get; set; }
    
    public UpdateOrderAddressRequestBody Address { get; set; }
    
}