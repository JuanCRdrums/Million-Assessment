using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application;
using RealEstate.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("MongoSettings"));
builder.Services.AddSingleton<MongoContext>();
builder.Services.AddScoped<IPropertyReadRepository, PropertyReadRepository>();
builder.Services.AddSingleton<IDataSeeder, DataSeeder>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Real Estate API",
        Description = "API to fetch real estate properties with owners, images, and traces (MongoDB).",
        Contact = new OpenApiContact
        {
            Name = "Your Name",
            Email = "you@email.com"
        }
    });
});

var app = builder.Build();

// Seeder
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<IDataSeeder>();
    await seeder.SeedAsync(app.Lifetime.ApplicationStopping);
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Real Estate API v1");
        c.RoutePrefix = string.Empty; // Swagger at root URL
    });
}

app.UseHttpsRedirection();

// Endpoints
app.MapGet("/api/properties", async (
    [FromServices] IPropertyReadRepository repo,
    [FromQuery] string? name,
    [FromQuery] string? address,
    [FromQuery] string? codeInternal,
    [FromQuery] int? year,
    [FromQuery] int? yearMin,
    [FromQuery] int? yearMax,
    [FromQuery] decimal? priceMin,
    [FromQuery] decimal? priceMax,
    [FromQuery] string? ownerId,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    CancellationToken ct = default) =>
{
    var filter = new PropertyFilter
    {
        Name = name,
        Address = address,
        CodeInternal = codeInternal,
        Year = year,
        YearMin = yearMin,
        YearMax = yearMax,
        MinPrice = priceMin,
        MaxPrice = priceMax,
        OwnerId = ownerId
    };

    var (items, total) = await repo.SearchAsync(filter, Math.Max(1, page), Math.Clamp(pageSize, 1, 200), ct);
    return Results.Ok(new { total, items });
})
.WithName("SearchProperties")
.WithSummary("Search properties")
.WithDescription("Retrieve properties filtered by any field. Supports ranges for price and year.")
.Produces(StatusCodes.Status200OK);

app.MapGet("/api/properties/{id}", async (
    string id,
    [FromServices] IPropertyReadRepository repo,
    CancellationToken ct) =>
{
    var item = await repo.GetByIdAsync(id, ct);
    return item is null ? Results.NotFound() : Results.Ok(item);
})
.WithName("GetPropertyById")
.WithSummary("Get property by Id")
.WithDescription("Retrieve complete information about a single property, including owner, images, and traces.")
.Produces(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);

app.Run();
