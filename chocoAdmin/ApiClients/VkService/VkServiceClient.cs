using choco.ApiClients.VkService.RequestBodies;

namespace choco.ApiClients.VkService;

public class VkServiceClient
{
    private readonly HttpClient _httpClient;

    public VkServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> UploadImage(byte[] imageData)
    {
        return (await _httpClient.PostAsync("/uploadImage", new ByteArrayContent(imageData)))
            .Content.ToString()!;
    }

    public async Task EditProduct(EditProductRequestBody body)
    {
        await _httpClient.PostAsync("/editProduct", new StringContent(body.ToString()!));
    }

    public async Task ReplacePost(ReplacePostRequestBody body)
    {
        await _httpClient.PostAsync("/replacePost", new StringContent(body.ToString()!));
    }
}
