using OTTER.Handler
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using OTTER.Data;

namespace OTTER;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen();

        builder.Services.AddAuthentication().AddScheme<AuthenticationSchemeOptions, AdminHandler>("Authentication", null);

        builder.Services.AddDbContext<OTTERDBContext>(options => options.UseSqlite(builder.Configuration["OTTERConnection"]));

        builder.Services.AddControllers();

        builder.Services.AddScoped<IOTTERRepo, DBOTTERRepo>();

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("Admin", policy => policy.RequireClaim("Admin"));
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
