using choco.Data.Models;
using choco.Utils.Interfaces;
using ILogger = Serilog.ILogger;

namespace choco.Utils.Services;

public class DeltaUtils : IDeltaUtils
{
    private readonly IVkUpdateUtils _vkUpdateUtils;
    private readonly ILogger _logger;

    public DeltaUtils(IVkUpdateUtils vkUpdateUtils, ILogger logger)
    {
        _vkUpdateUtils = vkUpdateUtils;
        _logger = logger;
    }

    public List<IDeltaUtils.DeltaItem> CalculateDelta(List<OrderItem> oldList, List<OrderItem> newList)
    {
        var oldDict = new Dictionary<Guid, OrderItem>();
        foreach (var item in oldList)
        {
            oldDict[item.Product.Id] = item;
        }

        var delta = new List<IDeltaUtils.DeltaItem>();

        foreach (var newItem in newList)
        {
            _logger.Information("Working with '{Name}'", newItem.Product.Name);
            if (oldDict.TryGetValue(newItem.Product.Id, out var oldItem))
            {
                _logger.Information("Found in old list");
                if (Math.Abs(newItem.Amount - oldItem.Amount) >= 0.01)
                {
                    _logger
                        .ForContext("oldItemAmount", oldItem.Amount)
                        .ForContext("newItemAmount", newItem.Amount)
                        .Information("Amount differs ({oldItemAmount} -> {newItemAmount})");
     
                    delta.Add(new IDeltaUtils.DeltaItem
                    {
                        Product = newItem.Product, Amount = oldItem.Amount - newItem.Amount, ShouldDelete = false,
                    });
                }
            }
            else
            {
                _logger.Information("Adding new item to delta...");
                delta.Add(new IDeltaUtils.DeltaItem
                    { Product = newItem.Product, Amount = -newItem.Amount, ShouldDelete = false });
            }

            _logger.Information("Delta updated: {delta}", delta);
        }

        foreach (var oldItem in oldList)
        {
            if (newList.All(x => x.Product.Id != oldItem.Product.Id))
            {
                _logger.Information("Found deleted items, marking them as should be deleted");
                delta.Add(new IDeltaUtils.DeltaItem
                    { Product = oldItem.Product, Amount = oldItem.Amount, ShouldDelete = true });
            }
        }

        return delta;
    }

    public async Task<List<OrderItem>> ApplyDelta(List<OrderItem> oldList, List<IDeltaUtils.DeltaItem> delta)
    {
        if (delta.Any(item => item.Product.Leftover + item.Amount < 0))
        {
            _logger.Error("Insufficient stock for one or more products in delta");
            throw new InvalidOperationException("Insufficient stock for one or more products in delta");
        }

        foreach (var deltaItem in delta)
        {
            var oldItem = oldList.FirstOrDefault(x => x.Product.Id == deltaItem.Product.Id);
            if (oldItem != null)
            {
                _logger.Information("Found item from delta in old list, updating leftovers");
                oldItem.Product.Leftover += deltaItem.Amount;
                oldItem.Amount -= deltaItem.Amount;

                await _vkUpdateUtils.EditProduct(oldItem.Product);
            }
            else
            {
                _logger.Information("Didn't found item from delta in old list, adding it to order, updating leftovers");
                deltaItem.Product.Leftover += deltaItem.Amount;
                oldList.Add(new OrderItem
                    { Product = deltaItem.Product, Amount = deltaItem.Amount });
                await _vkUpdateUtils.EditProduct(deltaItem.Product);
            }
        }

        _logger.Information("Deleting items, that was marked as should be deleted...");
        var shouldBeDeleted = delta.Where(y => y.ShouldDelete).ToList();
        _logger.Information("Will delete {Count} items", shouldBeDeleted.Count);
        foreach (var deltaItem in shouldBeDeleted)
        {
            oldList.RemoveAll(oi => oi.Product.Id == deltaItem.Product.Id);
        }

        return oldList;
    }

    public List<IDeltaUtils.DeltaItem> CalculateDelta(List<ShipmentItem> oldList, List<ShipmentItem> newList)
    {
        throw new NotImplementedException();
    }

    public Task<List<ShipmentItem>> ApplyDelta(List<ShipmentItem> oldList, List<IDeltaUtils.DeltaItem> delta)
    {
        throw new NotImplementedException();
    }
}