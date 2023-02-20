using choco.ApiClients.VkService.RequestBodies;
using choco.ApiClients.VkService.Responses;

namespace choco.ApiClients.VkService.Interfaces;

public interface IVkServiceClient
{
    public Task<UploadFileResponse?> UploadImage(byte[] imageData);

    public Task EditProduct(EditProductRequestBody body);

    public Task ReplacePost(ReplacePostRequestBody body);

    public Task<string> GetProductUrl(int marketId);

    protected Task<bool> TryPing();
}