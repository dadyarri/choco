using choco.ApiClients.Vk.Models;
using choco.ApiClients.Vk.Responses;

namespace choco.ApiClients.Vk;

public class VkApi
{
    public string Token { get; init; }
    public int OwnerId { get; set; }
    public string ApiVersion { get; init; }

    public async Task<WallGetResult> WallGet(WallGetParams @params)
    {
        return new WallGetResult();
    }

    public async Task WallDelete(WallDeleteParams @params)
    {
        
    }

    public async Task WallPost(WallPostParams @params)
    {
        
    }

    public async Task WallPin(WallPinParams @params)
    {
        
    }

    public async Task PhotosGetWallUploadServer(PhotosGetWallUploadServerParams @params)
    {
        
    }

    public async Task MarketEdit()
    {
        
    }
}
