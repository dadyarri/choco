using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using choco.ApiClients.VkService.RequestBodies;
using choco.ApiClients.VkService.Responses;
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

    public async Task<UploadFileResponse?> UploadImage(byte[] imageData)
    {
        var content = new MultipartFormDataContent();
        var streamContent = new StreamContent(new MemoryStream(imageData));
        streamContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg");
        content.Add(streamContent, "photo", "upload.jpg");
        var response = await _httpClient.PostAsync("/uploadImage", content);
        if (response.StatusCode == HttpStatusCode.OK)
        {
            return JsonSerializer.Deserialize<UploadFileResponse>(await response.Content.ReadAsStringAsync());
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
        var result = await _httpClient.PostAsync("/replacePinned", stringContent);
        if (result.StatusCode == HttpStatusCode.UnprocessableEntity)
        {
            throw new UpdatingPostException("Couldn't update post");
        }
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