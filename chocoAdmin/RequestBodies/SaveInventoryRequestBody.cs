using choco.Data.Models;

namespace choco.RequestBodies;

public class SaveInventoryRequestBody
{
    public Product[] Products { get; set; }
}