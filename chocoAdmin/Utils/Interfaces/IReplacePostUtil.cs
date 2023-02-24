using choco.Data.Models;
using SkiaSharp;

namespace choco.Utils.Interfaces;

public interface IReplacePostUtil
{
    public Task ReplacePost(byte[] imageData);
    public SKData GenerateImage(List<Product> products);

}