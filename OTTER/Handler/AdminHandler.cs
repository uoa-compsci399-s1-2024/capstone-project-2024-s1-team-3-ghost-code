using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using OTTER.Data;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Encodings.Web;
using System.Security.Claims;

namespace OTTER.Handler
{
    public class AdminHandler : AuthenticationHandler<AuthenticationSchemeOptions> 
    {
        private readonly IOTTERRepo _repo;
        public AdminHandler(
            IOTTERRepo repo,
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
            _repo = repo;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
            {
                Response.Headers.Add("WWW-Authenticate", "Basic");
                return AuthenticateResult.Fail("Authorization header not found.");
            } else
            {
                var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
                var credentials = Encoding.UTF8.GetString(credentialBytes).Split(":");
                var username = credentials[0];
                var password = credentials[1];

                if (_repo.validAdmin(username, password))
                {
                    var claims = new[] { new Claim("admin", username) };
                    ClaimsIdentity identity = new ClaimsIdentity(claims, "Basic");
                    ClaimsPrincipal principal = new ClaimsPrincipal(identity);
                    AuthenticationTicket ticket = new AuthenticationTicket(principal, Scheme.Name);
                    return AuthenticateResult.Success(ticket);
                } else
                {
                    return AuthenticateResult.Fail("Username and Password do not match.");
                }
            }
        }
    }
}
