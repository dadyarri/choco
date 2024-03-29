using choco.ApiClients.VkService.Interfaces;
using choco.ApiClients.VkService.RequestBodies;
using choco.Data.Models;
using choco.Utils.Interfaces;
using SkiaSharp;

namespace choco.Utils.Services;

public class ReplacePostUtil: IReplacePostUtil
{
    private readonly IVkServiceClient _vkServiceClient;

    public ReplacePostUtil(IVkServiceClient vkServiceClient)
    {
        _vkServiceClient = vkServiceClient;
    }

    public async Task ReplacePost(byte[] imageData)
    {
        var attachmentId = await Task.Run(() => _vkServiceClient.UploadImage(imageData));
        if (attachmentId != null)
        {
            await Task.Run(() => _vkServiceClient.ReplacePost(new ReplacePostRequestBody
            {
                Photo = attachmentId.Photo
            }));
        }
    }

    public SKData GenerateImage(List<Product> products)
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
                Style = SKPaintStyle.Fill,
                Typeface = SKTypeface.FromFamilyName("Roboto")
            };

            if (products.Count > 0)
            {
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
                    var postfixAtPrice = product.IsByWeight ? "/кг" : "";
                    canvas.DrawLine(
                        new SKPoint(nameXCoord + xPadding, yCoord + yPadding + 5),
                        new SKPoint(leftoverXCoord + xPadding + 105, yCoord + yPadding + 5),
                        paint
                    );
                    canvas.DrawText(product.Name, nameXCoord + xPadding + 5, yCoord + yPadding, paint);
                    canvas.DrawText($"""{product.RetailPrice}₽{postfixAtPrice}""", priceXCoord + xPadding + 5, yCoord + yPadding, paint);
                    canvas.DrawText($"{product.Leftover} {unit}", leftoverXCoord + xPadding + 5, yCoord + yPadding,
                        paint);
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
            }
            else
            {
                canvas.DrawText("Товара нет в наличии", xPadding, yPadding, paint);
            }

            var image = surface.Snapshot();
            data = image.Encode(SKEncodedImageFormat.Jpeg, 100);
        }

        return data;
    }
}