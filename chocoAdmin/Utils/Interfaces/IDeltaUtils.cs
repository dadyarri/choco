using choco.Data.Models;
using choco.Utils.Services;

namespace choco.Utils.Interfaces;

public interface IDeltaUtils
{
    public class DeltaItem
    {
        public double Amount { get; init; }
        public required Product Product { get; init; }
        public bool ShouldDelete { get; init; }
    }
    
    public List<DeltaItem> CalculateDelta(List<OrderItem> oldList, List<OrderItem> newList);
    public Task ApplyDelta(List<OrderItem> oldList, List<DeltaItem> delta);


}