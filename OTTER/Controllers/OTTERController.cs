using Microsoft.AspNetCore.Mvc;
using OTTER.Models;
using OTTER.Data;

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

        [HttpGet("Login")]
    }
}
