namespace choco.Data.Models;

public class Customer: BaseModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<OrderAddress> Addresses { get; set; }
    public string Phone { get; set; }
    public Uri? ChatUri { get; set; }
    public bool Deleted { get; set; }
}