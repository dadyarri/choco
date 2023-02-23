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
    
    public List<DeltaItem> CalculateDelta(List<OrderItem> oldList, List<OrderItem> newList);
    public Task<List<OrderItem>> ApplyDelta(List<OrderItem> oldList, List<DeltaItem> delta);
    
    public List<DeltaItem> CalculateDelta(List<ShipmentItem> oldList, List<ShipmentItem> newList);
    public Task<List<ShipmentItem>> ApplyDelta(List<ShipmentItem> oldList, List<DeltaItem> delta);


}