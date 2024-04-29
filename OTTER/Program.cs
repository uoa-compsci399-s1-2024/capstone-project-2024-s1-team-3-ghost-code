using OTTER.Handler;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using OTTER.Data;
using Microsoft.OpenApi.Models;

namespace OTTER;

public class Program
{
    public static void Main(string[] args)
    {
        var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: MyAllowSpecificOrigins,
                              policy =>
                              {
                                  policy.WithOrigins("http://localhost:5173") // Specify the allowed origin
                                        .AllowAnyMethod() // Allow all methods, or use .WithMethods("GET", "POST") to specify
                                        .AllowAnyHeader() // Allow all headers, or specify like .WithHeaders("Authorization")
                                        .AllowCredentials(); // Necessary if your front-end needs to send credentials like cookies or auth headers
                              });
        });

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(options =>
        {
            options.EnableAnnotations();
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = "OTTER Backend APIs",
                Description = "APIs to support the OTTER project. Developed by Ghost Code."
            });
        });

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
            app.UseSwaggerUI(c =>
            {
                c.DocumentTitle = "OTTER Swagger UI";
            });
        }

        app.UseHttpsRedirection();

        app.UseCors(MyAllowSpecificOrigins);

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
