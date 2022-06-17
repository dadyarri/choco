namespace NewAPI.Models;

public class OrderState
{
    public int Id { get; set; }
    public string Name { get; set; }

    public OrderState(string name)
    {
        Name = name;
    }
}
