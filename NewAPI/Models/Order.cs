namespace NewAPI.Models;

public class Order
{
    public int Id { get; set; }
    public OrderSource source { get; set; }
    public OrderState state { get; set; }
    public OrderCity city { get; set; }
}