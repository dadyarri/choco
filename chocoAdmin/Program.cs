using choco.ApiClients.VkService;
using choco.Data;
using choco.Extensions;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("Default");

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllersWithViews(options => { options.UseGeneralRoutePrefix("api"); });
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddSingleton<VkServiceClient>();

builder.Services.AddLettuceEncrypt();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<AppDbContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
}


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");
app.UseSerilogRequestLogging();

app.Run();