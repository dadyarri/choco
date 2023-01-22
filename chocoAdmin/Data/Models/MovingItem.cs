namespace choco.Data.Models;

public class MovingItem: BaseModel
{
    public Product Product { get; set; }
    public double Amount { get; set; }
}