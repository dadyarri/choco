using choco.Data.Models;

namespace choco.Utils.Interfaces;

public interface ITelegramInformer
{
    public string GenerateMessageFromOrder(Order order);
    public void SendMessage(string message, List<long> userIds);
}