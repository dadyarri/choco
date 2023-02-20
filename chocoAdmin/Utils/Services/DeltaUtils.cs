using choco.Data.Models;
using choco.Utils.Interfaces;

namespace choco.Utils.Services;

public class DeltaUtils: IDeltaUtils
{
    private readonly IVkUpdateUtils _vkUpdateUtils;

    public DeltaUtils(IVkUpdateUtils vkUpdateUtils)
    {
        _vkUpdateUtils = vkUpdateUtils;
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
        foreach (var item in newList)
        {
            if (oldDict.TryGetValue(item.Product.Id, out var value))
            {
                // The product exists in the old list, so we check if the amount has changed
                if (Math.Abs(item.Amount - value.Amount) > 0.1)
                {
                    // The amount has changed, so we add the delta to the list
                    delta.Add(new IDeltaUtils.DeltaItem
                        { Product = item.Product, Amount = value.Amount - item.Amount, ShouldDelete = false });
                }
            }
            else
            {
                // The product is new, so we add the entire item to the list as the delta
                delta.Add(new IDeltaUtils.DeltaItem { Product = item.Product, Amount = item.Amount, ShouldDelete = false });
            }
        }

        // Loop through the old list and check for deleted items
        foreach (var item in oldList)
        {
            if (newList.All(x => x.Product.Id != item.Product.Id))
            {
                // The product doesn't exist in the new list, so we add the delta to the list
                delta.Add(new IDeltaUtils.DeltaItem { Product = item.Product, Amount = item.Amount, ShouldDelete = true });
            }
        }

        // Return the delta list
        return delta;
    }

    public async Task ApplyDelta(List<OrderItem> oldList, List<IDeltaUtils.DeltaItem> delta)
    {
        if (delta.Any(item => item.Product.Leftover + item.Amount < 0))
        {
            throw new InvalidOperationException("Insufficient stock for one or more products in delta");
        }

        foreach (var item in delta)
        {
            var oldItem = oldList.FirstOrDefault(x => x.Product.Id == item.Product.Id);
            if (oldItem != null)
            {
                oldItem.Product.Leftover += item.Amount;
                await _vkUpdateUtils.EditProduct(oldItem.Product);
            }
            else
            {
                item.Product.Leftover -= item.Amount;
                oldList.Add(new OrderItem { Product = item.Product, Amount = item.Amount });
                await _vkUpdateUtils.EditProduct(item.Product);
            }
        }

        oldList.RemoveAll(x =>
            delta.Any(y => y.Product.Id == x.Product.Id && Math.Abs(y.Amount - -x.Amount) < 0.1 || y.ShouldDelete));
    }
}