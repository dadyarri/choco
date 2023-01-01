namespace choco.Data.Models;

public class OrderAddress: BaseModel
{
    public OrderCity City { get; set; }
    public string Street { get; set; }
    public string Building { get; set; }
}