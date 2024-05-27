using Microsoft.AspNetCore.Mvc;
using OTTER.Data;
using OTTER.Models;

namespace OTTER.Controllers
{
    [Route("action")]
    [ApiController]
    public class ActionController : Controller
    {
        private readonly IOTTERRepo _repo;

        public ActionController(IOTTERRepo repo)
        {
            _repo = repo;
        }

        [HttpGet("ApproveAdminDelete")]
        public ActionResult<string> ApproveAdminDelete(string? token)
        {
            AdminDeleteRequest request = _repo.GetAdminDeleteRequest(token);

            var templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Dtos", "actionResult.html");
            var htmlTemplate = System.IO.File.ReadAllText(templatePath);

            if (request == null || request.Expiry < DateTime.UtcNow)
            {
                var htmlBody = htmlTemplate.Replace("{{actionHeading}}", "Request Invalid").Replace("{{actionBody}}", "This request does not exist, or has expired.");

                return Content(htmlBody, "text/html");
            }
            else
            {
                _repo.DeleteAdmin(request);

                var htmlBody = htmlTemplate.Replace("{{actionHeading}}", "Request Approved").Replace("{{actionBody}}", $"The following admin has now been deleted:<br><br>{request.Admin.FirstName} {request.Admin.LastName}");

                return Content(htmlBody, "text/html");
            }
        }

        [HttpGet("DenyAdminDelete")]
        public ActionResult<string> DenyAdminDelete(string? token)
        {
            AdminDeleteRequest request = _repo.GetAdminDeleteRequest(token);

            var templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Dtos", "actionResult.html");
            var htmlTemplate = System.IO.File.ReadAllText(templatePath);

            if (request == null || request.Expiry < DateTime.UtcNow)
            {
                var htmlBody = htmlTemplate.Replace("{{actionHeading}}", "Request Invalid").Replace("{{actionBody}}", "This request does not exist, or has expired.");

                return Content(htmlBody, "text/html");
            }
            else
            {
                _repo.RemoveAdminDeleteRequest(request);

                var htmlBody = htmlTemplate.Replace("{{actionHeading}}", "Request Denied").Replace("{{actionBody}}", $"The request to delete the following admin has been denied:<br><br>{request.Admin.FirstName} {request.Admin.LastName}<br><br>This admin remains in the system.");

                return Content(htmlBody, "text/html");
            }
        }
    }
}
