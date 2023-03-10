using choco.Data.Interfaces;
using choco.Data.Models;

namespace choco.Utils.Interfaces;

public interface IDeltaUtils
{
    public class DeltaItem
    {
        public double Amount { get; init; }
        public required Product Product { get; init; }
        public bool ShouldDelete { get; init; }

        public override string ToString()
        {
            return $"Delta['{Product.Name}', {Amount}, {ShouldDelete}]";
        }
    }
    
    public List<DeltaItem> CalculateDelta<T>(List<T> oldList, List<T> newList) where T: ITransactionItem;
    public Task<List<T>> ApplyDelta<T>(List<T> oldList, List<DeltaItem> delta) where T: ITransactionItem, new();


}