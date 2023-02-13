namespace choco.RequestBodies;

public class CreateOrderRequestBody
{
    public string Date { get; set; }
    public Guid? Status { get; set; }
    public List<CreateOrderItemsRequestBody> OrderItems { get; set; }
    public CreateOrderAddressRequestBody Address {get; set;}
    }

public class CreateOrderAddressRequestBody
{
    public Guid City { get; set; }
    public string Street { get; set; }
    public string Building { get; set; }
}

public class CreateOrderItemsRequestBody
{
    public Guid Id { get; set; }
    public double Amount { get; set; }
}
