namespace NewAPI.Models;

public class OrderedProduct
{
    public int Id { get; set; }
    public Order Order { get; init; }
    public Product Product { get; set; }
    public int Quantity { get; set; }
}