using choco.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkiaSharp;

namespace choco.Controllers;

[ApiController]
[Route("[controller]")]
public class ExportController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExportController(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ActionResult> ExportImage()
    {
        var products = await _db.Products.Where(p => p.Leftover > 0 && !p.Deleted).ToListAsync();
        SKData data;

        const float xPadding = 50.0f;
        const float yPadding = 50.0f;

        var imageInfo = new SKImageInfo(600, 600);
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
            var priceXCoord = 300;
            var leftoverXCoord = 400;

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
                    new SKPoint(nameXCoord + xPadding, (yCoord + yPadding) + 5),
                    new SKPoint(leftoverXCoord + xPadding + 105, (yCoord + yPadding + 5)),
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
            data = image.Encode(SKEncodedImageFormat.Jpeg, 80);
        }

        return File(data.ToArray(), "image/jpeg");
    }
}