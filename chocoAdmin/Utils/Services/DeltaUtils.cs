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
        // Create a dictionary to store the old list's order items by product ID
        var oldDict = new Dictionary<Guid, OrderItem>();
        foreach (var item in oldList)
        {
            oldDict[item.Product.Id] = item;
        }

        // Create a list to store the delta
        var delta = new List<IDeltaUtils.DeltaItem>();

        // Loop through the new list and compare with the old list
        foreach (var newItem in newList)
        {
            _logger.Information("Working with '{Name}'", newItem.Product.Name);
            if (oldDict.TryGetValue(newItem.Product.Id, out var oldItem))
            {
                _logger.Information("Found in old list");
                // The product exists in the old list, so we check if the amount has changed
                if (Math.Abs(newItem.Amount - oldItem.Amount) >= 0.01)
                {
                    _logger.Information(
                        "Amount differs ({Amount} -> {Amount})",
                        oldItem.Amount,
                        newItem.Amount
                    );
                    // The amount has changed, so we add the delta to the list
                    delta.Add(new IDeltaUtils.DeltaItem
                    {
                        Product = newItem.Product, Amount = oldItem.Amount - newItem.Amount, ShouldDelete = false,
                    });
                    _logger.Information("Delta updated: {delta}", delta);
                }
            }
            else
            {
                // The product is new, so we add the entire item to the list as the delta
                delta.Add(new IDeltaUtils.DeltaItem
                    { Product = newItem.Product, Amount = -newItem.Amount, ShouldDelete = false });
            }
        }

        // Loop through the old list and check for deleted items
        foreach (var oldItem in oldList)
        {
            if (newList.All(x => x.Product.Id != oldItem.Product.Id))
            {
                // The product doesn't exist in the new list, so we add the delta to the list
                delta.Add(new IDeltaUtils.DeltaItem
                    { Product = oldItem.Product, Amount = oldItem.Amount, ShouldDelete = true });
            }
        }

        // Return the delta list
        return delta;
    }

    public async Task<List<OrderItem>> ApplyDelta(List<OrderItem> oldList, List<IDeltaUtils.DeltaItem> delta)
    {
        // Finding insufficient leftovers of product after applying delta, if any
        if (delta.Any(item => item.Product.Leftover + item.Amount < 0))
        {
            throw new InvalidOperationException("Insufficient stock for one or more products in delta");
        }

        foreach (var deltaItem in delta)
        {
            // Try finding item from new list in old list
            var oldItem = oldList.FirstOrDefault(x => x.Product.Id == deltaItem.Product.Id);
            if (oldItem != null)
            {
                // Found item
                oldItem.Product.Leftover += deltaItem.Amount; // Update leftover of product
                oldItem.Amount -= deltaItem.Amount; // Update amount of product in the order

                await _vkUpdateUtils.EditProduct(oldItem.Product);
            }
            else
            {
                // Not found
                deltaItem.Product.Leftover += deltaItem.Amount; // Update leftover of product
                oldList.Add(new OrderItem
                    { Product = deltaItem.Product, Amount = deltaItem.Amount }); // Add new product to order
                await _vkUpdateUtils.EditProduct(deltaItem.Product);
            }
        }

        // Remove all items, that should be deleted
        var shouldBeDeleted = delta.Where(y => y.ShouldDelete);
        foreach (var deltaItem in shouldBeDeleted)
        {
            oldList.RemoveAll(oi => oi.Product.Id == deltaItem.Product.Id);
        }

        return oldList;
    }
}