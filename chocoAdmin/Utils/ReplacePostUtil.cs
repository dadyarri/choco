using choco.ApiClients.VkService;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data.Models;
using choco.Exceptions;
using SkiaSharp;

namespace choco.Utils;

public class ReplacePostUtil
{
    private readonly VkServiceClient _vkServiceClient;

    public ReplacePostUtil(VkServiceClient vkServiceClient)
    {
        _vkServiceClient = vkServiceClient;
    }

    public async Task ReplacePost(byte[] imageData)
    {
        var attachmentId = await _vkServiceClient.UploadImage(imageData);
        if (attachmentId != null)
        {
            await _vkServiceClient.ReplacePost(new ReplacePostRequestBody
            {
                Photo = attachmentId
            });
        }
        else
        {
            throw new UploadingImageException("Couldn't upload image to server");
        }
    }
    public static SKData GenerateImage(List<Product> products)
    {
        SKData data;

        const float xPadding = 25.0f;
        const float yPadding = 25.0f;

        var ySize = yPadding + 20 + 30 * products.Count;

        var imageInfo = new SKImageInfo(700, (int)ySize);
        using (var surface = SKSurface.Create(imageInfo))
        {
            var canvas = surface.Canvas;
            canvas.Clear(SKColors.White);

            var paint = new SKPaint
            {
                IsAntialias = true,
                Color = new SKColor(0, 0, 0),
                TextSize = 20.0f,
                Style = SKPaintStyle.Fill
            };

            var yCoord = 0;
            var nameXCoord = 20;
            var priceXCoord = 425;
            var leftoverXCoord = 525;

            canvas.DrawText("Название", nameXCoord + xPadding + 5, yCoord + yPadding, paint);
            canvas.DrawText("Цена", priceXCoord + xPadding + 5, yCoord + yPadding, paint);
            canvas.DrawText("В наличии", leftoverXCoord + xPadding + 5, yCoord + yPadding, paint);

            canvas.DrawLine(
                new SKPoint(nameXCoord + xPadding - 1, yCoord + yPadding - 20),
                new SKPoint(leftoverXCoord + xPadding + 106, yCoord + yPadding - 20),
                paint
            );

            canvas.DrawLine(
                new SKPoint(nameXCoord + xPadding, yCoord + yPadding + 10),
                new SKPoint(leftoverXCoord + xPadding + 105, yCoord + yPadding + 10),
                paint
            );

            foreach (var product in products)
            {
                yCoord += 30;
                var unit = product.IsByWeight ? "кг." : "шт.";
                canvas.DrawLine(
                    new SKPoint(nameXCoord + xPadding, yCoord + yPadding + 5),
                    new SKPoint(leftoverXCoord + xPadding + 105, yCoord + yPadding + 5),
                    paint
                );
                canvas.DrawText(product.Name, nameXCoord + xPadding + 5, yCoord + yPadding, paint);
                canvas.DrawText($"{product.RetailPrice}₽", priceXCoord + xPadding + 5, yCoord + yPadding, paint);
                canvas.DrawText($"{product.Leftover} {unit}", leftoverXCoord + xPadding + 5, yCoord + yPadding, paint);
            }

            canvas.DrawLine(
                new SKPoint(nameXCoord + xPadding, 0 + yPadding - 20),
                new SKPoint(nameXCoord + xPadding, yCoord + yPadding + 5),
                paint
            );

            canvas.DrawLine(
                new SKPoint(priceXCoord + xPadding, 0 + yPadding - 20),
                new SKPoint(priceXCoord + xPadding, yCoord + yPadding + 5),
                paint
            );

            canvas.DrawLine(
                new SKPoint(leftoverXCoord + xPadding, 0 + yPadding - 20),
                new SKPoint(leftoverXCoord + xPadding, yCoord + yPadding + 5),
                paint
            );

            canvas.DrawLine(
                new SKPoint(leftoverXCoord + xPadding + 105, 0 + yPadding - 20),
                new SKPoint(leftoverXCoord + xPadding + 105, yCoord + yPadding + 5),
                paint
            );

            var image = surface.Snapshot();
            data = image.Encode(SKEncodedImageFormat.Jpeg, 100);
        }

        return data;
    }
}