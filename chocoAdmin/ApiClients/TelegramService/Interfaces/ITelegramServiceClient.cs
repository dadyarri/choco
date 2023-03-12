using choco.ApiClients.TelegramService.RequestBodies;

namespace choco.ApiClients.TelegramService.Interfaces;

public interface ITelegramServiceClient
{
    void SendMessages(SendMessagesRequestBody body);
}