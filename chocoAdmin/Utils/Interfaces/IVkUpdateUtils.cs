using choco.ApiClients.VkService.RequestBodies;
using choco.Data.Models;

namespace choco.Utils.Interfaces;

public interface IVkUpdateUtils
{
    public Task EditProduct(Product item);
    public Task EditProduct(EditProductRequestBody item);
    public Task ReplacePost();


}