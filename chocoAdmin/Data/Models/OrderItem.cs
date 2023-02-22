using choco.Data.Interfaces;

namespace choco.Data.Models;

public class OrderItem: BaseModel, ITransactionItem
{
    public Product Product { get; set; }
    public double Amount { get; set; }
    public Order? Order { get; set; }
}