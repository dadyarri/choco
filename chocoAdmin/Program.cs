using System.Net;
using System.Text;
using choco.ApiClients.TelegramService.Interfaces;
using choco.ApiClients.TelegramService.Services;
using choco.ApiClients.VkService.Interfaces;
using choco.ApiClients.VkService.Services;
using choco.Data;
using choco.Extensions;
using choco.Utils.Interfaces;
using choco.Utils.Services;
using LettuceEncrypt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("Default");

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .CreateLogger();

try
{
    builder.Host.UseSerilog();

    builder.Services.AddControllersWithViews(options => { options.UseGeneralRoutePrefix("api"); });
    builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

    builder.Services.AddScoped<IVkServiceClient, VkServiceClient>();
    builder.Services.AddScoped<ITelegramServiceClient, TelegramServiceClient>();
    builder.Services.AddScoped<IVkUpdateUtils, VkUpdateUtils>();
    builder.Services.AddScoped<ITelegramInformer, TelegramInformer>();
    builder.Services.AddScoped<IDeltaUtils, DeltaUtils>();
    builder.Services.AddScoped<IReplacePostUtil, ReplacePostUtil>();

    builder.Services.AddSingleton(Log.Logger);

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
    
    builder.Services.AddSpaStaticFiles(config =>
    {
        config.RootPath = "client/dist";
    });

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

        Log.Logger.Information("Checking if has pending migrations...");

        if (context.Database.GetPendingMigrations().Any())
        {
            Log.Logger.Information(
                "Found pending migrations: {0}, migrating...",
                context.Database.GetPendingMigrations()
            );
            context.Database.Migrate();
        }
    }


    app.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");

    var spaPath = "/app";
    if (app.Environment.IsDevelopment())
    {
        app.MapWhen(y => y.Request.Path.StartsWithSegments(spaPath), client =>
        {
            client.UseSpa(spa =>
            {
                spa.UseProxyToSpaDevelopmentServer("https://localhost:6363");
            });
        });
    }
    else
    {
        app.Map(spaPath, client =>
        {
            client.UseSpaStaticFiles();
            client.UseSpa(spa => {
                spa.Options.SourcePath = "client";

                // adds no-store header to index page to prevent deployment issues (prevent linking to old .js files)
                // .js and other static resources are still cached by the browser
                spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
                {
                    OnPrepareResponse = ctx =>
                    {
                        ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
                        headers.CacheControl = new CacheControlHeaderValue
                        {
                            NoCache = true,
                            NoStore = true,
                            MustRevalidate = true
                        };
                    }
                };
            });
        });
    }

    app.MapFallbackToFile("index.html");
    app.UseSerilogRequestLogging();

    app.UseAuthentication();
    app.UseAuthorization();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}