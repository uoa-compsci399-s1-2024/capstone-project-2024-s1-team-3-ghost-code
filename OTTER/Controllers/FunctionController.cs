﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using OTTER.Models;
using OTTER.Data;
using OTTER.Dtos;
using System.Security.Claims;
using System.Runtime;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace OTTER.Controllers
{
    [Route("webapi")]
    [ApiController]
    public class FunctionController : Controller
    {
        private readonly IOTTERRepo _repo;

        public FunctionController(IOTTERRepo repo)
        {
            _repo = repo;
        }

        [SwaggerOperation(
            Summary = "Gets a list of current admins",
            Description = "Requires admin privileges",
            Tags = new[] { "Admins" }
        )]
        [SwaggerResponse(200, "Query for Admins was successful", typeof(AdminOutputDto))]
        [SwaggerResponse(401, "Admin token is invalid")]
        [Authorize(Roles = "Admin")]
        [HttpGet("GetAdmins")]
        public ActionResult<IEnumerable<AdminOutputDto>> GetAdmins()
        {
            List<AdminOutputDto> admins = new List<AdminOutputDto>();
            foreach (Admin admin in _repo.GetAdmins())
            {
                admins.Add(new AdminOutputDto { AdminID = admin.AdminID, FirstName = admin.FirstName, LastName = admin.LastName, Email = admin.Email });
            }
            return Ok(admins);
        }

        [SwaggerOperation(
            Summary = "Gets an admin by their ID",
            Description = "Requires admin privileges",
            Tags = new[] { "Admins" }
        )]
        [SwaggerResponse(200, "Query for Admin was successful", typeof(AdminOutputDto))]
        [SwaggerResponse(401, "Admin login email or password is incorrect")]
        [Authorize(Roles = "Admin")]
        [HttpGet("GetAdminByID/{id}")]
        public ActionResult<AdminOutputDto> GetAdminByID(int id)
        {
            Admin admin = _repo.GetAdminByID(id);
            if (admin != null) {
                return Ok(new AdminOutputDto { AdminID = admin.AdminID, FirstName = admin.FirstName, LastName = admin.LastName, Email = admin.Email });
            }
            else
            {
                return NotFound("There is no Admin with ID " + id +".");
            }

        }

        [SwaggerOperation(
            Summary = "Gets a list of current admins filtered by a search term",
            Description = "Requires admin privileges",
            Tags = new[] { "Admins" }
        )]
        [SwaggerResponse(200, "Query for Admins was successful", typeof(AdminOutputDto))]
        [SwaggerResponse(401, "Admin login email or password is incorrect")]
        [Authorize(Roles = "Admin")]
        [HttpGet("SearchAdmins/{search}")]
        public ActionResult<IEnumerable<Admin>> GetAdminByEmail(string search)
        {
            List<AdminOutputDto> admins = new List<AdminOutputDto>();
            foreach (Admin admin in _repo.SearchAdmins(search))
            {
                admins.Add(new AdminOutputDto { AdminID = admin.AdminID, FirstName = admin.FirstName, LastName = admin.LastName, Email = admin.Email });
            }
            return Ok(admins);
        }

        [SwaggerOperation(
            Summary = "Creates a new admin",
            Description = "Requires admin privileges",
            Tags = new[] { "Admins" }
        )]
        [SwaggerResponse(201, "New admin created", typeof(AdminInputDto))]
        [SwaggerResponse(401, "Admin login email or password is incorrect")]
        [SwaggerResponse(409, "Admin with submitted email already exists")]
        [Authorize(Roles = "Admin")]
        [HttpPost("AddAdmin")]
        public ActionResult<Admin> AddAdmin(AdminInputDto newadmin)
        {
            if (_repo.GetAdmins().FirstOrDefault(e => e.Email == newadmin.Email) == null)
            {
                Admin a = new Admin { FirstName = newadmin.FirstName, LastName = newadmin.LastName, Email = newadmin.Email, Password = newadmin.Password };
                _repo.AddAdmin(a);
                AdminOutputDto aOut = new AdminOutputDto { AdminID = a.AdminID, FirstName = a.FirstName, LastName = a.LastName, Email = a.Email };
                return CreatedAtAction(nameof(GetAdminByID), new { id = aOut.AdminID}, aOut);
            }
            else
            {
                return Conflict("An admin with email " + newadmin.Email + " already exists!");
            }
        }

        [SwaggerOperation(
            Summary = "Deletes an admin",
            Description = "Requires admin privileges. Admin ID can be found using GetAdmins or SearchAdmins.",
            Tags = new[] { "Admins" }
        )]
        [SwaggerResponse(200, "Admin deleted")]
        [SwaggerResponse(401, "Admin login email or password is incorrect")]
        [SwaggerResponse(404, "Admin with submitted ID does not exist")]
        [Authorize(Roles = "Admin")]
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

        [SwaggerOperation(
            Summary = "Edits an admin",
            Description = "Requires admin privileges",
            Tags = new[] { "Admins" }
        )]
        [SwaggerResponse(200, "Admin edited", typeof(AdminOutputDto))]
        [SwaggerResponse(401, "Admin login email or password is incorrect")]
        [SwaggerResponse(404, "Admin with submitted ID does not exist")]
        [Authorize(Roles = "Admin")]
        [HttpPut("EditAdmin")]
        public ActionResult<Admin> EditAdmin(Admin updatedAdmin)
        {
            Admin edited = _repo.EditAdmin(updatedAdmin);
            if (edited != null)
            {
                return Ok(new AdminOutputDto { AdminID = edited.AdminID, FirstName = edited.FirstName, LastName = edited.LastName, Email = edited.Email });
            } else
            {
                return NotFound("No Admin could be found with the ID of " + updatedAdmin.AdminID + ".");
            }
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
        [HttpGet("ClinicianSearch/{term}")]
        public ActionResult<IEnumerable<User>> SearchUsers(string term)
        {
            return Ok(_repo.GetUserBySearch(term));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("AddQuestion")]
        public ActionResult<User> CreateQuestion(QuestionInputDto newQuestion)
        {
            Question q = new Question { Module = _repo.GetModuleByID(newQuestion.ModID), Title = newQuestion.Title, Description = newQuestion.Description, ImageURL = newQuestion.ImageURL, QuestionType = newQuestion.QuestionType, Stage = newQuestion.Stage, Deleted = false};
            _repo.AddQuestion(q);
            foreach (AnswerInputDto newAnswer in newQuestion.Answers)
            {
                Answer a = new Answer { Question = _repo.GetQuestionByID(q.QuestionID), AnswerType = newAnswer.AnswerType, AnswerText = newAnswer.AnswerText, AnswerCoordinates = newAnswer.AnswerCoordinates, CorrectAnswer = newAnswer.CorrectAnswer, Feedback = newAnswer.Feedback, Attempts = new List<AttemptQuestion>(), Deleted = false };
                _repo.AddAnswer(a);            
            }
            return Ok(q);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteQuestion/{id}")]
        public ActionResult DeleteQuestion(int id)
        {
            Question q = _repo.GetQuestionByID(id);
            if (q != null)
            {
                _repo.DeleteQuestion(id);
                return Ok("Question Deleted Successfully");
            } else
            {
                return NotFound("A question with ID " + id + " could not be found.");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("EditQuestion")]
        public ActionResult<Question> EditQuestion(EditQuestionInputDto updatedQuestion)
        {
            Question q = _repo.GetQuestionByID(updatedQuestion.QuestionID);
            if (q != null)
            {
                return Ok(_repo.EditQuestion(updatedQuestion));
            }
            else
            {
                return NotFound("A question with ID " + updatedQuestion.QuestionID + " could not be found.");
            }
        }

        [HttpGet("ClinicianLogin/{email}")]
        public ActionResult ClinicianLogin(string email)
        {
            if(_repo.GetUserByEmail(email) != null)
            {
                return Ok(_repo.GetUserByEmail(email));
            } else
            {
                return NotFound("No user with email " + email + " exists.");
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("GetClinicianCertificationStatus/{id}")]
        public ActionResult<Certification> GetClinicianCertificationStatus(int id)
        {
            IEnumerable<Certification> cert = _repo.GetCertificationByID(id);
            if (cert.Count() != 0)
            {
                return Ok(cert);
            } else
            {
                return NotFound("This user is not certified.");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("SetClinicianCertificationStatus")]
        public ActionResult<Certification> SetClinicianCertificationStatus(CertificationInputDto newCert)
        {
            
            if (_repo.GetUserByID(newCert.UserID) != null)
            {
                Certification cert = new Certification { User = _repo.GetUserByID(newCert.UserID), DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1), Type = newCert.Type };
                _repo.AddCertification(cert);
                return Ok(cert); 
            }
            else
            {
                return NotFound("A user with ID " + newCert.UserID + " could not be found.");
            }
        }

        [HttpGet("GetQuizzesByModID/{id}")]
        public ActionResult<IEnumerable<Quiz>> GetQuizzesByID(int id)
        {
            return Ok(_repo.GetQuizzesByID(id));
        }

        [HttpGet("GetQuizByID/{id}")]
        public ActionResult<Quiz> GetQuizByID(int id)
        {
            return Ok(_repo.GetQuizByID(id));
        }

        [HttpPost("GetQuizQs")]
        public ActionResult<IEnumerable<QuestionOutputDto>> GetQuizQs(QuizInputDto quizInput)
        {
            return Ok(_repo.GetQuizQs(quizInput));
        }

        [HttpPost("QuizSubmission")]
        public ActionResult<QuizSubMarksDto> SubmitQuiz(QuizSubmissionDto submission)
        {
            return Ok(_repo.MarkQuiz(submission));
        }
    }
}