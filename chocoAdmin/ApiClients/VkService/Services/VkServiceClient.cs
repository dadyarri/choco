using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using choco.ApiClients.VkService.Interfaces;
using choco.ApiClients.VkService.RequestBodies;
using choco.ApiClients.VkService.Responses;
using choco.Exceptions;
using ILogger = Serilog.ILogger;

namespace choco.ApiClients.VkService.Services;

public class VkServiceClient : IVkServiceClient
{
    private static readonly bool IsDevelopment = string.Equals(
        Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
        "development",
        StringComparison.InvariantCultureIgnoreCase
    );

    private readonly ILogger _logger;

    public VkServiceClient(ILogger logger)
    {
        _logger = logger;
    }

    private static HttpClient HttpClient => new()
    {
        BaseAddress = new Uri(IsDevelopment ? "http://localhost:5679" : "http://vkintegration.com:8080")
    };

    public async Task<UploadFileResponse?> UploadImage(byte[] imageData)
    {
        if (await TryPing())
        {
            var content = new MultipartFormDataContent();
            var streamContent = new StreamContent(new MemoryStream(imageData));
            streamContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg");
            content.Add(streamContent, "photo", "upload.jpg");
            var response = await HttpClient.PostAsync("/uploadImage", content);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                _logger.Information("Image uploaded");
                return JsonSerializer.Deserialize<UploadFileResponse>(await response.Content.ReadAsStringAsync());
            }
        }

        return null;
    }

    public async Task EditProduct(EditProductRequestBody body)
    {
        if (await TryPing())
        {
            var stringContent =
                new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await HttpClient.PostAsync("/editProduct", stringContent);
            if (response.StatusCode == HttpStatusCode.UnprocessableEntity)
            {
                throw new UpdatingProductException("Couldn't update product");
            }
            _logger.Information("Product {MarketId} updated", body.MarketId);
        }
    }

    public async Task ReplacePost(ReplacePostRequestBody body)
    {
        if (await TryPing())
        {
            var stringContent = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var result = await HttpClient.PostAsync("/replacePinned", stringContent);
            if (result.StatusCode == HttpStatusCode.UnprocessableEntity)
            {
                throw new UpdatingPostException("Couldn't update post");
            }
            _logger.Information("Post updated");
        }
    }

    public async Task<bool> TryPing()
    {
        try
        {
            var result = await HttpClient.GetAsync("ping");
            var tryPing = result.StatusCode == HttpStatusCode.OK;
            if (tryPing)
            {
                _logger.Information("VkIntegration service is available, continue synchronization...");
            }
            else
            {
                _logger.Warning("VkIntegration service is not available at the moment, skipping syncronization...");
            }
            return tryPing;
        }
        catch (HttpRequestException)
        {
            _logger.Warning("VkIntegration service is not available at the moment, skipping syncronization...");
            return false;
        }
    }

    public async Task<string> GetProductUrl(int marketId)
    {
        var result = await HttpClient.GetAsync($"/productUrl/{marketId}");
        return await result.Content.ReadAsStringAsync();
    }
}