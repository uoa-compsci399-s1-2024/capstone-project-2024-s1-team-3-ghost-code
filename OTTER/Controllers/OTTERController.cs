using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using OTTER.Models;
using OTTER.Data;
using System.Security.Claims;

namespace OTTER.Controllers
{
    [Route("webapi")]
    [ApiController]
    public class OTTERController : Controller
    {
        private readonly IOTTERRepo _repo;

        public OTTERController(IOTTERRepo repo)
        {
            _repo = repo;
        }

        [Authorize(AuthenticationSchemes = "Authentication")]
        [Authorize(Policy = "Admin")]
        [HttpGet("Login")]
        public ActionResult TryLogin()
        {
            return Ok();
        }
    }
}
