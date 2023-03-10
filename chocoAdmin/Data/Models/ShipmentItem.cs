using System.Text.Json.Serialization;
using choco.Data.Interfaces;

namespace choco.Data.Models;

public class ShipmentItem: BaseModel, ITransactionItem
{
    public Product Product { get; set; }
    public double Amount { get; set; }
    [JsonIgnore]
    public Shipment? Shipment { get; set; }
}