using choco.Data.Models;

namespace choco.Data.Interfaces;

public interface ITransactionItem
{
    public Product Product { get; set; }
    public double Amount { get; set; }
}