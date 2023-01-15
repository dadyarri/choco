namespace choco.ApiClients.Vk.Models;

public class WallPostParams
{
    public bool FromGroup { get; set; }
    public string Message { get; set; }
    public List<string> Attachments { get; set; }
    public bool CloseComments { get; set; }
    
}