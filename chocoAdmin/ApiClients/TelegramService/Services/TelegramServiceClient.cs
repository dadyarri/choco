using System.Net;
using System.Text;
using System.Text.Json;
using choco.ApiClients.TelegramService.Interfaces;
using choco.ApiClients.TelegramService.RequestBodies;
using Polly;
using Polly.Contrib.WaitAndRetry;
using ILogger = Serilog.ILogger;

namespace choco.ApiClients.TelegramService.Services;

public class TelegramServiceClient : ITelegramServiceClient
{
    private static readonly bool IsDevelopment = string.Equals(
        Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
        "development",
        StringComparison.InvariantCultureIgnoreCase
    );

    private readonly ILogger _logger;

    private readonly IAsyncPolicy<HttpResponseMessage> _retryPolicy = Policy<HttpResponseMessage>
        .Handle<HttpRequestException>()
        .OrResult(x =>
            x.StatusCode is
                HttpStatusCode.TooManyRequests or
                HttpStatusCode.InternalServerError or
                HttpStatusCode.BadRequest
        )
        .WaitAndRetryAsync(
            Backoff.DecorrelatedJitterBackoffV2(TimeSpan.FromSeconds(1), 5)
        );


    public TelegramServiceClient(ILogger logger)
    {
        _logger = logger;
    }

    private static HttpClient HttpClient => new()
    {
        BaseAddress = new Uri(IsDevelopment ? "http://localhost:8000" : "http://vkintegration.com:8080")
    };


    public async void SendMessages(SendMessagesRequestBody body)
    {
        if (await TryPing())
        {
            var stringContent = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var result = await _retryPolicy.ExecuteAsync(() => HttpClient.PostAsync("/sendMessages", stringContent));

            if (result.StatusCode == HttpStatusCode.OK)
            {
                _logger.Information("Messages sent");
            }
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
                _logger.Information("TelegramIntegration service is available, continue informing...");
            }
            else
            {
                _logger.Warning("TelegramIntegration service is not available at the moment, skipping informing...");
            }

            return tryPing;
        }
        catch (HttpRequestException)
        {
            _logger.Warning("TelegramIntegration service is not available at the moment, skipping informing...");
            return false;
        }
    }
}