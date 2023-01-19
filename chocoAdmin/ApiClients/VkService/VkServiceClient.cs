using System.Net;
using choco.ApiClients.VkService.RequestBodies;

namespace choco.ApiClients.VkService;

public class VkServiceClient
{
    private static HttpClient _httpClient => new()
    {
        BaseAddress = new Uri("http://vkintegration.com:8080")
    };

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

    public async Task<bool> Ping()
    {
        var result = await _httpClient.GetAsync("ping");
        return result.StatusCode == HttpStatusCode.OK;
    }

    public async Task<string> GetProductUrl(int marketId)
    {
        var result = await _httpClient.GetAsync($"/productUrl/{marketId}");
        return await result.Content.ReadAsStringAsync();
    }
}
