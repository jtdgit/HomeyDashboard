using Microsoft.EntityFrameworkCore;
using OfferteWizard.Core.Interfaces;
using OfferteWizard.Infrastructure.Data;
using OfferteWizard.Infrastructure.Pdf;
using OfferteWizard.Infrastructure.Services;
using OfferteWizard.Web.Components;
using OfferteWizard.Web.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=offertewizard.db"));

// Services
builder.Services.AddScoped<IKlantService, KlantService>();
builder.Services.AddScoped<IThemaService, ThemaService>();
builder.Services.AddScoped<IVragenService, VragenService>();
builder.Services.AddScoped<IOfferteCalculator, OfferteCalculator>();
builder.Services.AddScoped<IOfferteService, OfferteService>();
builder.Services.AddScoped<IPdfGenerator, OffertePdfGenerator>();
builder.Services.AddScoped<AppState>();

// Blazor
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
