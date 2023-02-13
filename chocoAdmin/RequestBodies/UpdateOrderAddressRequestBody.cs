namespace choco.RequestBodies;

public class UpdateOrderAddressRequestBody
{
    public Guid City { get; set; }
    public string Street { get; set; }
    public string Building { get; set; }
}
