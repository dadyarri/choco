using System.Net;
using System.Text;
using choco.ApiClients.VkService;
using choco.Data;
using choco.Extensions;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using LettuceEncrypt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

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

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    var key = builder
        .Configuration
        .GetRequiredSection("Security")
        .GetValue<string>("Key");
    ArgumentException.ThrowIfNullOrEmpty(key);
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                key)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

if (!builder.Environment.IsDevelopment())
{
    builder.Services
        .AddLettuceEncrypt()
        .PersistDataToDirectory(
            new DirectoryInfo(builder.Configuration["Certificates:Path"]!),
            builder.Configuration["Certificates:Password"]
        );


    builder.WebHost.UseKestrel(k =>
    {
        var appServices = k.ApplicationServices;
        k.Listen(
            IPAddress.Any, 443,
            o => o.UseHttps(h => { h.UseLettuceEncrypt(appServices); }));
    });
}

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

app.UseAuthentication();
app.UseAuthorization();

app.Run();