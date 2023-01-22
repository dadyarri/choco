namespace choco.Data.Models;

public class Order: BaseModel
{
    public DateOnly Date { get; set; }
    public OrderStatus Status { get; set; }
    public List<MovingItem> Items { get; set; }
    public OrderAddress Address { get; set; }
    public bool Deleted { get; set; }
}