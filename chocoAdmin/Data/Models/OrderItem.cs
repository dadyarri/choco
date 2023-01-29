namespace choco.Data.Models;

public class OrderItem: BaseModel
{
    public Product Product { get; set; }
    public double Amount { get; set; }
}