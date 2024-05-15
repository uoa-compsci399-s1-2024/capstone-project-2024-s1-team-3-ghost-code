using OTTER.Handler;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using OTTER.Data;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Swashbuckle.AspNetCore.Filters;
using Amazon;

namespace OTTER;

public class Program
{
    public static void Main(string[] args)
    {
        var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        var builder = WebApplication.CreateBuilder(args);

        var appName = builder.Environment.ApplicationName;

        // Add services to the container.

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: MyAllowSpecificOrigins,
                              policy =>
                              {
                                  policy.WithOrigins(
                                      "http://localhost:5173",
                                      "https://www.tmstrainingquizzes.com",
                                      "https://sahil-branch.d1khm46bk5sp3v.amplifyapp.com",
                                      "https://ayesha-branch.d1khm46bk5sp3v.amplifyapp.com"
                                      ) // Specify the allowed origin
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

            options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                Description = "Admin authorisation header using the Bearer scheme (\"Bearer {token}\")",
                In = ParameterLocation.Header,
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });
            options.OperationFilter<SecurityRequirementsOperationFilter>();
        });

        if (!builder.Environment.IsDevelopment()) {
            builder.Configuration.AddSecretsManager(region: RegionEndpoint.APSoutheast2,
            configurator: options =>
            {
                options.SecretFilter = entry => entry.Name.StartsWith($"{appName}_");
                options.KeyGenerator = (entry, s) => s
                    .Replace($"{appName}_", string.Empty)
                    .Replace("__", ":");
                options.PollingInterval = TimeSpan.FromSeconds(10);
            });
        }

        /*builder.Services.AddAuthentication().AddScheme<AuthenticationSchemeOptions, AdminHandler>("Authentication", null);*/

        builder.Services.AddDbContext<OTTERDBContext>(options => options.UseSqlServer(builder.Configuration["OTTERConnection"]));

        builder.Services.AddControllers();

        builder.Services.AddScoped<IOTTERRepo, DBOTTERRepo>();

        /*builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("Admin", policy => policy.RequireClaim("Admin"));
        });*/
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:AuthToken").Value)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        /*if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.DocumentTitle = "OTTER Swagger UI";
                c.DefaultModelsExpandDepth(-1);
            });
        }*/

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.DocumentTitle = "OTTER Swagger UI";
            c.DefaultModelsExpandDepth(-1);
        });

        app.UseHttpsRedirection();

        app.UseCors(MyAllowSpecificOrigins);

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
