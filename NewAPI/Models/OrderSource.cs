namespace NewAPI.Models;

public class OrderSource
{
    public int Id { get; set; }
    public string Name { get; set; }

    public OrderSource(string name)
    {
        Name = name;
    }
}
