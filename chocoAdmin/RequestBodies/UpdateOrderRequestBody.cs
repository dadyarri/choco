using choco.Data.Models;

namespace choco.RequestBodies;

public class UpdateOrderRequestBody
{
    public Guid Status { get; set; }
    
    public Guid OrderId { get; set; }
    
}