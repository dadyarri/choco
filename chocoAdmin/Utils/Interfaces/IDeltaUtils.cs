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
    
    public List<DeltaItem> CalculateDeltaInOrder(List<OrderItem> oldList, List<OrderItem> newList);
    public Task<List<OrderItem>> ApplyDeltaToOrder(List<OrderItem> oldList, List<DeltaItem> delta);
    
    public List<DeltaItem> CalculateDeltaInShipment(List<ShipmentItem> oldList, List<ShipmentItem> newList);
    public Task<List<ShipmentItem>> ApplyDeltaToOrder(List<ShipmentItem> oldList, List<DeltaItem> delta);


}