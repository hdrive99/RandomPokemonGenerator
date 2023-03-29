using Microsoft.EntityFrameworkCore;
using RandomPokemonGenerator.Web.Data;
using RandomPokemonGenerator.Web.Libraries;
using RandomPokemonGenerator.Web.Libraries.Interfaces;
using RandomPokemonGenerator.Web.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddOutputCache(options => {
    options.AddBasePolicy(builder =>
        builder.Expire(TimeSpan.FromSeconds(31536000)));
    options.AddPolicy("GetTagPolicy", policyBuilder => policyBuilder.Tag("Get"));
});
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddScoped<ICachingHelper, CachingHelper>();
builder.Services.AddScoped<IPokemonSetService, PokemonSetService>();
builder.Services.AddScoped<IFormatListService, FormatListService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors(opt => opt.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseCors();
}

app.UseOutputCache();

app.UseAuthorization();

app.MapControllers();

app.Run();
