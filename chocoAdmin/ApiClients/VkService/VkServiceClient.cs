using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using choco.ApiClients.VkService.RequestBodies;
using choco.Exceptions;

namespace choco.ApiClients.VkService;

public class VkServiceClient
{
    private static bool isDevelopment = string.Equals(
        Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
        "development",
        StringComparison.InvariantCultureIgnoreCase
    );

    private static HttpClient _httpClient => new()
    {
        BaseAddress = new Uri(isDevelopment ? "http://localhost:5679" : "http://vkintegration.com:8080")
    };

    public async Task<string?> UploadImage(byte[] imageData)
    {
        var byteArrayContent = new ByteArrayContent(imageData);
        byteArrayContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg");
        var response = await _httpClient.PostAsync("/uploadImage", byteArrayContent);
        if (response.StatusCode == HttpStatusCode.OK)
        {
            return await response.Content.ReadAsStringAsync();
        }

        return null;
    }

    public async Task EditProduct(EditProductRequestBody body)
    {
        var stringContent =
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync("/editProduct", stringContent);
        if (response.StatusCode == HttpStatusCode.UnprocessableEntity)
        {
            throw new UpdatingProductException("Couldn't update product");
        }
    }

    public async Task ReplacePost(ReplacePostRequestBody body)
    {
        var stringContent = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
        await _httpClient.PostAsync("/replacePinned", stringContent);
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