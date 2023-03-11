using choco.ApiClients.TelegramService.Interfaces;
using choco.ApiClients.TelegramService.RequestBodies;
using choco.Data.Models;
using choco.Utils.Interfaces;
using Grynwald.MarkdownGenerator;

namespace choco.Utils.Services;

public class TelegramInformer : ITelegramInformer
{
    private readonly ITelegramServiceClient _telegramServiceClient;

    public TelegramInformer(ITelegramServiceClient telegramServiceClient)
    {
        _telegramServiceClient = telegramServiceClient;
    }

    public string GenerateMessageFromOrder(Order order)
    {
        var document = new MdDocument();

        document.Root.Add(new MdParagraph("Новый заказ!"));
        document.Root.Add(new MdParagraph("Содержимое заказа:"));

        var orderItemsInfo = order.OrderItems
            .Select(orderItem => new MdListItem($"{orderItem.Product.Name} x{orderItem.Amount}"));

        var totalSum = order.OrderItems
            .Sum(oi => oi.Amount * oi.Product.RetailPrice);

        document.Root.Add(new MdBulletList(orderItemsInfo));

        document.Root.Add(new MdParagraph($"Итог: {totalSum}₽"));

        document.Root.Add(
            new MdParagraph($"Адрес: г. {order.Address.City.Name}, {order.Address.Street}, {order.Address.Building}")
        );

        return document.ToString().Replace("\\", "");
    }

    public async void SendMessage(string message, List<long> userIds)
    {
        await Task.Run(() => _telegramServiceClient.SendMessages(new SendMessagesRequestBody
        {
            Message = message,
            UserIds = userIds
        }));
    }
}