namespace NewAPI.Models;

public class OrderCity
{
    public int Id { get; set; }
    public string Name { get; set; }

    public OrderCity(string name)
    {
        Name = name;
    }
}
