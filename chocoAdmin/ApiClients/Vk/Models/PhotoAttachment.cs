namespace choco.ApiClients.Vk.Models;

public class PhotoAttachment: Attachment
{
    public new AttachmentTypes Type = AttachmentTypes.Photo;
    public string Photo { get; set; }
}