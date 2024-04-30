using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using OTTER.Data;
using OTTER.Dtos;
using OTTER.Models;
using Swashbuckle.AspNetCore.Annotations;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Security.Cryptography;

namespace OTTER.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IOTTERRepo _repo;
        private readonly IConfiguration _configuration;

        public AuthController(IOTTERRepo repo, IConfiguration configuration)
        {
            _repo = repo;
            _configuration = configuration;
        }

        [SwaggerOperation(
            Summary = "Gets token from Admin login"
        )]
        [SwaggerResponse(200, "Admin login was successful and token returned")]
        [SwaggerResponse(401, "Admin login email or password is incorrect")]
        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login(AdminLoginDto loginDto)
        {
            Admin admin = _repo.GetAdminByEmail(loginDto.Email);
            if (admin == null || admin.Password != loginDto.Password)
            {
                return Unauthorized("Email or Password invalid.");
            }

            _repo.SetLastAdminLogin(admin.AdminID);

            string token = CreateToken(admin);
            return Ok(token);
        }

        private string CreateToken(Admin admin)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.SerialNumber, admin.AdminID.ToString()),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:AuthToken").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [SwaggerOperation(
            Summary = "Sends password reset code to user email"
        )]
        [SwaggerResponse(200, "Reset request submitted")]
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            _repo.ResetPassword(email);
            return Ok("If user found, password reset token will be sent to email.");
        }

        [SwaggerOperation(
            Summary = "Checks if password reset token is valid"
        )]
        [SwaggerResponse(200, "Password reset token valid")]
        [SwaggerResponse(400, "Password reset token not valid")]
        [HttpGet("CheckPasswordReset/{token}")]
        public ActionResult<string> CheckPasswordReset(string token)
        {
            bool result = _repo.CheckPasswordReset(token);
            if (result) { return Ok("Reset token valid"); }
            else { return BadRequest("Reset token not valid"); }
        }

        [SwaggerOperation(
            Summary = "Resets password if reset token is valid"
        )]
        [SwaggerResponse(200, "Password succesfully reset")]
        [SwaggerResponse(400, "Password reset token not valid")]
        [HttpPost("SubmitPasswordReset")]
        public ActionResult<string> SubmitPasswordReset(PasswordResetDto passwordResetDto)
        {
            bool result = _repo.SubmitPasswordReset(passwordResetDto);
            if (result) { return Ok("Password reset"); }
            else { return BadRequest("Reset token not valid"); }
        }

        [SwaggerOperation(
            Summary = "Gets Admin details based on current token",
            Description = "Requires admin privileges"
        )]
        [SwaggerResponse(200, "Query for Admins was successful", typeof(AdminOutputDto))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "Admin")]
        [HttpGet("GetCurrentAdmin")]
        public ActionResult<AdminOutputDto> GetCurrentAdmin()
        {
            Admin admin = _repo.GetAdminByID(int.Parse(User.FindFirstValue(ClaimTypes.SerialNumber)));
            return Ok(new AdminOutputDto { AdminID = admin.AdminID, FirstName = admin.FirstName, LastName = admin.LastName, Email = admin.Email });
        }
    }
}
