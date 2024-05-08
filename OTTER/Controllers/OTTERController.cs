using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using OTTER.Models;
using OTTER.Data;
using OTTER.Dtos;
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

        [Authorize(AuthenticationSchemes = "Authentication")]
        [Authorize(Policy = "Admin")]
        [HttpGet("GetAdmins")]
        public ActionResult<IEnumerable<Admin>> GetAdmins()
        {
            IEnumerable<Admin> admins = _repo.GetAdmins();
            return Ok(admins);
        }

        [Authorize(AuthenticationSchemes = "Authentication")]
        [Authorize(Policy = "Admin")]
        [HttpGet("GetAdminByEmail/{email}")]
        public ActionResult<IEnumerable<Admin>> GetAdminByEmail(string email)
        {
            return Ok(_repo.GetAdminByEmail(email));
        }

        [Authorize(AuthenticationSchemes = "Authentication")]
        [Authorize(Policy = "Admin")]
        [HttpPost("AddAdmin")]
        public ActionResult<Admin> AddAdmin(AdminInputDto newadmin)
        {
            if (_repo.GetAdmins().FirstOrDefault(e => e.Email == newadmin.Email) == null)
            {
                Admin a = new Admin { FirstName = newadmin.FirstName, LastName = newadmin.LastName, Email = newadmin.Email, Password = newadmin.Password };
                _repo.AddAdmin(a);
                return CreatedAtAction(nameof(GetAdminByEmail), new { email = a.Email }, a);
            }
            else
            {
                return Conflict("An admin with email " + newadmin.Email + " already exists!");
            }
        }

        [Authorize(AuthenticationSchemes = "Authentication")]
        [Authorize(Policy = "Admin")]
        [HttpDelete("DeleteAdmin/{id}")]
        public ActionResult DeleteAdmin(int id)
        {
            Admin a = _repo.GetAdminByID(id);
            if (a == null)
                return NotFound("No admin with the ID " + id + " exists!");
            else
            {
                _repo.DeleteAdmin(id);
                return Ok("Admin successfully deleted!");
            }
        }

        [Authorize(AuthenticationSchemes = "Authentication")]
        [Authorize(Policy = "Admin")]
        [HttpPut("EditAdmin")]
        public ActionResult<Admin> EditAdmin(Admin updatedAdmin)
        {
            return Ok(_repo.EditAdmin(updatedAdmin));
        }

        [Authorize(AuthenticationSchemes = "Authentication")]
        [Authorize(Policy = "Admin")]
        [HttpGet("GetQuestions/{module}")]
        public ActionResult<IEnumerable<Question>> GetQuestionsByModule(int module)
        {
            return Ok(_repo.GetQuestionsByModule(module));
        }

        [HttpGet("GetModules")]
        public ActionResult<IEnumerable<Module>> GetModules()
        {
            return Ok(_repo.GetModules());
        }

        [HttpGet("GetModuleByID/{id}")]
        public ActionResult<Module> GetModuleByID(int id)
        {
            return Ok(_repo.GetModuleByID(id));
        }

        [HttpGet("ClinicianSearch/{term}")]
        public ActionResult<IEnumerable<User>> SearchUsers(string term)
        {
            return Ok(_repo.GetUserBySearch(term));
        }

        [HttpPost("AddQuestion")]
        public ActionResult<User> CreateQuestion(QuestionInputDto newQuestion)
        {
            Question q = new Question { Module = _repo.GetModuleByID(newQuestion.ModID), Title = newQuestion.Title, Description = newQuestion.Description, ImageURL = newQuestion.ImageURL, QuestionType = newQuestion.QuestionType};
            _repo.AddQuestion(q);
            foreach (AnswerInputDto newAnswer in newQuestion.Answers)
            {
                Answer a = new Answer { Question = _repo.GetQuestionByID(q.QuestionID), AnswerType = newAnswer.AnswerType, AnswerText = newAnswer.AnswerText, AnswerCoordinates = newAnswer.AnswerCoordinates, CorrectAnswer = newAnswer.CorrectAnswer, Feedback = newAnswer.Feedback, Attempts = new List<AttemptQuestion>() };
                _repo.AddAnswer(a);            
            }
            return Ok("Question Created Successfully");
        }
    }
}
