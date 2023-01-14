using choco.ApiClients.Vk.Models;

namespace choco.ApiClients.Vk.Responses;

public class WallGetResult
{
    public int Count { get; init; }
    public List<WallPost> Items { get; init; }
}