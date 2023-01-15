using choco.ApiClients.Vk.Models;
using choco.ApiClients.Vk.Responses;

namespace choco.ApiClients.Vk;

public class VkApi
{
    public string Token { get; init; }
    public int OwnerId { get; set; }
    public string ApiVersion { get; init; }

    public async Task<BaseResponse<WallGetResult>> WallGet(WallGetParams @params)
    {
        return new BaseResponse<WallGetResult>();
    }

    public async Task<BaseResponse<WallDeleteResult>> WallDelete(WallDeleteParams @params)
    {
        return new BaseResponse<WallDeleteResult>();
    }

    public async Task<BaseResponse<BaseCodeResult>> WallPost(WallPostParams @params)
    {
        return new BaseResponse<BaseCodeResult>();
    }

    public async Task<BaseResponse<BaseCodeResult>> WallPin(WallPinParams @params)
    {
        return new BaseResponse<BaseCodeResult>();
    }

    public async Task<BaseResponse<PhotosGetWallUploadServerResult>> PhotosGetWallUploadServer(PhotosGetWallUploadServerParams @params)
    {
        return new BaseResponse<PhotosGetWallUploadServerResult>();
    }

    public async Task<BaseResponse<BaseCodeResult>> MarketEdit(MarketEditParams @params)
    {
        return new BaseResponse<BaseCodeResult>();
    }
}
