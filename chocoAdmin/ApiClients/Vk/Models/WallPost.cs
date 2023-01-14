namespace choco.ApiClients.Vk.Models;

public class WallPost
{
    public int Id { get; init; }
    public int OwnerId { get; init; }
    public int Date { get; init; }
    public string? Text { get; init; }
    public List<Attachment>? Attachments { get; init; }
    public bool IsPinned { get; init; }
}