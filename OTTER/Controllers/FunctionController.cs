using Microsoft.AspNetCore.Mvc;
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
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
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
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "No Admin with that ID found")]
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
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
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
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(409, "Admin with submitted email already exists")]
        [Authorize(Roles = "Admin")]
        [HttpPost("AddAdmin")]
        public ActionResult<Admin> AddAdmin(AdminInputDto newadmin)
        {
            if (_repo.GetAdmins().FirstOrDefault(e => e.Email == newadmin.Email) == null)
            {
                Admin a = new Admin { FirstName = newadmin.FirstName, LastName = newadmin.LastName, Email = newadmin.Email, Password = BCrypt.Net.BCrypt.HashPassword(newadmin.Password) };
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
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
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
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "Admin with submitted ID does not exist")]
        [SwaggerResponse(409, "Conflict")]
        [Authorize(Roles = "Admin")]
        [HttpPut("EditAdmin")]
        public ActionResult<AdminOutputDto> EditAdmin(AdminEditDto updatedAdmin)
        {
            if (_repo.GetAdminByID(updatedAdmin.AdminID) != null)
            {
                if (_repo.GetAdminByEmail(updatedAdmin.Email) == null || _repo.GetAdminByEmail(updatedAdmin.Email).Email == _repo.GetAdminByID(updatedAdmin.AdminID).Email)
                {
                    AdminOutputDto edited = _repo.EditAdmin(updatedAdmin);
                    return Ok(edited);
                }
                else
                {
                    return Conflict("Admin with email " + updatedAdmin.Email + " already exists.");
                }
            }
            else
            {
                return NotFound("Admin with ID " + updatedAdmin.AdminID + " not found.");
            }
        }

        [SwaggerOperation(
            Summary = "Gets all the questions from a module",
            Description = "Requires admin privileges",
            Tags = new[] { "AdminQuizFunctions" }
        )]
        [SwaggerResponse(200, "List of questions by module", typeof(IEnumerable<AdminQuestionOutputDto>))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "Admin")]
        [HttpGet("GetQuestions/{module}")]
        public ActionResult<IEnumerable<AdminQuestionOutputDto>> GetQuestionsByModule(int module)
        {
            return Ok(_repo.GetQuestionsByModuleAdmin(module));
        }

        [SwaggerOperation(
            Summary = "Gets all the modules",
            Description = "Requires admin or clinician privileges",
            Tags = new[] { "ClinicianFunctions", "AdminQuizFunctions" }
        )]
        [SwaggerResponse(200, "List of modules", typeof(IEnumerable<Module>))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "User,Admin")]
        [HttpGet("GetModules")]
        public ActionResult<IEnumerable<Module>> GetModules()
        {
            return Ok(_repo.GetModules());
        }

        [SwaggerOperation(
            Summary = "Gets a module by ID",
            Description = "Requires clinician or admin privileges",
            Tags = new[] { "ClinicianFunctions" }
        )]
        [SwaggerResponse(200, "Returns a module")]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "User,Admin")]
        [HttpGet("GetModuleByID/{id}")]
        public ActionResult<Module> GetModuleByID(int id)
        {
            return Ok(_repo.GetModuleByID(id));
        }

        [SwaggerOperation(
            Summary = "Returns a list of clinicians",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Returns a list of users",typeof(IEnumerable<User>))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "Admin")]
        [HttpGet("ClinicianSearch/{term}")]
        public ActionResult<IEnumerable<User>> SearchUsers(string term)
        {
            return Ok(_repo.GetUserBySearch(term));
        }

        [SwaggerOperation(
            Summary = "Adds a new question to the question bank",
            Description = "Admin privileges required",
            Tags = new[] { "AdminQuizFunctions" }
        )]
        [SwaggerResponse(200, "Successfully added question", typeof(Question))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "Admin")]
        [HttpPost("AddQuestion")]
        public ActionResult<Question> CreateQuestion(QuestionInputDto newQuestion)
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

        [SwaggerOperation(
            Summary = "Deletes a question from the question bank",
            Description = "Admin privileges required",
            Tags = new[] { "AdminQuizFunctions" }
        )]
        [SwaggerResponse(200, "Successfully deleted question")]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "A question with submitted ID could not be found")]
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

        [SwaggerOperation(
            Summary = "Edits a question",
            Description = "Admin privileges required",
            Tags = new[] { "AdminQuizFunctions" }
        )]
        [SwaggerResponse(200, "Successfully edited question", typeof(Question))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "A question with submitted ID could not be found")]
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

        /*[HttpGet("ClinicianLogin/{email}")]
        public ActionResult ClinicianLogin(string email)
        {
            if(_repo.GetUserByEmail(email) != null)
            {
                return Ok(_repo.GetUserByEmail(email));
            } else
            {
                return NotFound("No user with email " + email + " exists.");
            }
        }*/

        [SwaggerOperation(
            Summary = "Gets the certification status of a clinician",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Successfully retrieved clinician certification", typeof(Certification))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "A user with submitted ID could not be found")]
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

        [SwaggerOperation(
            Summary = "Sets the certification status of a clinician",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Successfully set certification status", typeof(Certification))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "A user with submitted ID could not be found")]
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

        [SwaggerOperation(
            Summary = "Gets all the quizzes of a module",
            Description = "Clinician privileges required",
            Tags = new[] { "ClinicianFunctions" }
        )]
        [SwaggerResponse(200, "Successfully retrieved quizzes", typeof(IEnumerable<Quiz>))]
        [SwaggerResponse(401, "User token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "User")]
        [HttpGet("GetQuizzesByModID/{id}")]
        public ActionResult<IEnumerable<Quiz>> GetQuizzesByID(int id)
        {
            return Ok(_repo.GetQuizzesByID(id));
        }

        [SwaggerOperation(
            Summary = "Gets a specific quiz by its ID",
            Description = "Clinician privileges required",
            Tags = new[] { "ClinicianFunctions" }
        )]
        [SwaggerResponse(200, "Successfully retrieved quiz", typeof(Quiz))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "User")]
        [HttpGet("GetQuizByID/{id}")]
        public ActionResult<Quiz> GetQuizByID(int id)
        {
            return Ok(_repo.GetQuizByID(id));
        }

        [SwaggerOperation(
            Summary = "Gets the set of randomly selected questions for a quiz",
            Description = "Clinician privileges required",
            Tags = new[] { "ClinicianFunctions" }
        )]
        [SwaggerResponse(200, "Successfully retrieved questions", typeof(IEnumerable<QuestionOutputDto>))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "User")]
        [HttpPost("GetQuizQs")]
        public ActionResult<IEnumerable<QuestionOutputDto>> GetQuizQs(QuizInputDto quizInput)
        {
            return Ok(_repo.GetQuizQs(quizInput));
        }

        [SwaggerOperation(
            Summary = "Submits the selected answers and marks the quiz, returns the result and sends appropriate email",
            Description = "Clinician privileges required",
            Tags = new[] { "ClinicianFunctions" }
        )]
        [SwaggerResponse(200, "Successfully marked quiz", typeof(QuizSubMarksDto))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [Authorize(Roles = "User")]
        [HttpPost("QuizSubmission")]
        public ActionResult<QuizSubMarksDto> SubmitQuiz(QuizSubmissionDto submission)
        {
            return Ok(_repo.MarkQuiz(submission));
        }

        [SwaggerOperation(
            Summary = "Returns the list of current organizations",
            Tags = new[] { "ClinicianFunctions" }
        )]
        [SwaggerResponse(200, "Organizations retrieved", typeof(IEnumerable<Organization>))]
        [HttpGet("GetOrganizations")]
        public ActionResult<IEnumerable<Organization>> GetOrganizations()
        {
            return Ok(_repo.GetOrganizations());
        }

        [SwaggerOperation(
            Summary = "Returns the list of current roles",
            Tags = new[] { "ClinicianFunctions" }
        )]
        [SwaggerResponse(200, "Roles retrieved", typeof(IEnumerable<Role>))]
        [HttpGet("GetRoles")]
        public ActionResult<IEnumerable<Role>> GetRoles()
        {
            return Ok(_repo.GetRoles());
        }

        [SwaggerOperation(
            Summary = "Creates a new clinician profile",
            Tags = new[] { "ClinicianFunctions" }
        )]
        [SwaggerResponse(200, "New clinician created", typeof(User))]
        [SwaggerResponse(409, "Clinician with submitted email already exists")]
        [HttpPost("AddClinician")]
        public ActionResult<User> AddClinician(UserInputDto user)
        {
            if(_repo.GetUserByEmail(user.UserEmail) == null)
            {
                User newUser = new User { FirstName = user.FirstName, LastName = user.LastName, UserEmail = user.UserEmail, Organization = _repo.GetOrganizationByID(user.OrganizationID), Role = _repo.GetRoleByID(user.RoleID) };
                _repo.AddUser(newUser);
                _repo.SendEmail(newUser.UserEmail, $"Welcome to the VERIFY Study!", $"Hi {newUser.FirstName},<br><br>Welcome to the VERIFY Study's Online TMS Training Experience Reboot. We're so glad you've joined us in our quest to better" +
                    $"understand the effects of a stroke on a patient, and also help to improve the recovery process for them.<Br>To become fully certified in the study, you must first pass the final quiz for each module, followed by the practical test. " +
                    $"There is a practice quiz for each module that we recommend you attempt before attempting the final quiz." +
                    $"<Br>Upon passing all the required tests, your newly awarded certification will be valid for 1 year. To remain certified, you must complete the Recertification Quiz every year you wish to remain certified." +
                    $"<Br><Br>Once again we'd like to thank you for joining us, and we wish you the best of luck in your studies.<Br>The VERIFY Team");
                return Ok(_repo.GetUserByEmail(newUser.UserEmail));
            } else
            {
                return Conflict("Clinician with email " + user.UserEmail + " already exists.");
            }
        }

        [SwaggerOperation(
            Summary = "Edits a clinicians details",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Clinician updated", typeof(User))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "Clinician with submitted ID could not be found")]
        [SwaggerResponse(409, "Conflict")]
        [Authorize(Roles = "Admin")]
        [HttpPut("EditClinician")]
        public ActionResult<User> EditClinician(UserEditDto user)
        {
            if (_repo.GetUserByID(user.UserID) != null)
            {
                if (_repo.GetUserByEmail(user.UserEmail) == null || _repo.GetUserByEmail(user.UserEmail).UserEmail == _repo.GetUserByID(user.UserID).UserEmail)
                {
                    User editUser = new User { FirstName = user.FirstName, LastName = user.LastName, UserEmail = user.UserEmail, Organization = _repo.GetOrganizationByID(user.OrganizationID), Role = _repo.GetRoleByID(user.RoleID) };
                    _repo.EditUser(user.UserID, editUser);
                    return Ok(_repo.GetUserByID(user.UserID));
                }
                else
                {
                    return Conflict("Clinician with email " + user.UserEmail + " already exists.");
                }
            }
            else
            {
                return NotFound("Clinician with ID " + user.UserID + " not found.");
            }
        }

        [SwaggerOperation(
            Summary = "Deletes a clinicians profile",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Clinician deleted")]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "Clinician with submitted ID could not be found")]
        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteClinician/{email}")]
        public ActionResult DeleteClinician(string email)
        {
            if (_repo.GetUserByEmail(email) != null)
            {
                _repo.GetUserByEmail(email);
                return Ok("Clinician deleted");
            }
            else
            {
                return NotFound("Clinician with email " + email + " not found.");
            }
        }

        [SwaggerOperation(
            Summary = "Adds an organization to the current list of organizations",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Organization added",typeof(Organization))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(409, "Organization with submitted name already exists")]
        [Authorize(Roles = "Admin")]
        [HttpPost("AddOrganization")]
        public ActionResult<Organization> AddOrganization(OrgInputDto orgInput)
        {
            if (_repo.GetOrganizationByNameLower(orgInput.OrgName) == null)
            {
                return Ok(_repo.AddOrganization(new Organization { OrgName = orgInput.OrgName }));
            }
            else
            {
                return Conflict("Organization with name " + orgInput.OrgName + " already exists.");
            }
        }

        [SwaggerOperation(
            Summary = "Edits the name of an organization",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Organization updated")]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "Organization with submitted ID not found")]
        [Authorize(Roles = "Admin")]
        [HttpPut("EditOrganization")]
        public ActionResult<Organization> EditOrganization(Organization org)
        {
            if (_repo.GetOrganizationByID(org.OrgID) != null)
            {
                _repo.EditOrganization(org);
                return Ok("Organization updated.");
            }
            else
            {
                return NotFound("Organization with ID " + org.OrgID + " not found.");
            }
        }

        [SwaggerOperation(
            Summary = "Deletes an organization from the current list of organizations",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Organization deleted")]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "Organization with submitted ID not found")]
        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteOrganization/{orgID}")]
        public ActionResult DeleteOrganization(int orgID)
        {
            if (_repo.GetOrganizationByID(orgID) != null)
            {
                _repo.DeleteOrganization(orgID);
                return Ok("Organization deleted.");
            }
            else
            {
                return NotFound("Organization with ID " + orgID + " not found.");
            }
        }
       
        [SwaggerOperation(
            Summary = "Adds a role to the current lsit of roles",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Role added", typeof(Role))]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(409, "Role with submitted name already exists")]
        [Authorize(Roles = "Admin")]
        [HttpPost("AddRole")]
        public ActionResult<Role> AddRole(RoleInputDto roleInput)
        {
            if (_repo.GetRoleByNameLower(roleInput.RoleName) == null)
            {
                return Ok(_repo.AddRole(new Role{ RoleName= roleInput.RoleName}));
            }
            else
            {
                return Conflict("Role with name " + roleInput.RoleName + " already exists.");
            }
        }

        [SwaggerOperation(
            Summary = "Edits the name of a role",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Role updated")]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "Role with submitted ID not found")]
        [Authorize(Roles = "Admin")]
        [HttpPut("EditRole")]
        public ActionResult<Role> EditRole(Role role)
        {
            if (_repo.GetRoleByID(role.RoleID) != null)
            {
                _repo.EditRole(role);
                return Ok("Role updated.");
            }
            else
            {
                return NotFound("Role with ID " + role.RoleID + " not found.");
            }
        }

        [SwaggerOperation(
            Summary = "Deletes a role from the current list of roles",
            Description = "Admin privileges required",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Role deleted")]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token is not authorized to view resource")]
        [SwaggerResponse(404, "Role with submitted ID not found")]
        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteRole/{orgID}")]
        public ActionResult DeleteRole(int roleID)
        {
            if (_repo.GetRoleByID(roleID) != null)
            {
                _repo.DeleteRole(roleID);
                return Ok("Role deleted.");
            }
            else
            {
                return NotFound("Role with ID " + roleID + " not found.");
            }
        }

        [SwaggerOperation(
            Summary = "Gets ALL the attempts between certain dates AND with a given UserID OR QuizID OR Completion status",
            Description = "Admin privileges requried. NOTE: Dates must be provided. Remaining properties can be null, however only one at a time can be filled.",
            Tags = new[] { "AdminUserFunctions" }
        )]
        [SwaggerResponse(200, "Stats retrieved")]
        [SwaggerResponse(400, "Start or end date not valid/missing")]
        [SwaggerResponse(401, "Token is invalid")]
        [SwaggerResponse(403, "Token not authorized to view resource")]
        [Authorize(Roles = "Admin")]
        [HttpGet("GetStats")]
        public ActionResult GetStats(StatRequestDto statIn)
        {
            if (statIn.SearchStart != null && statIn.SearchEnd != null && DateTime.Compare(statIn.SearchStart, statIn.SearchEnd) <= 0)
            {
                if(statIn.UserID != null)
                {
                    return Ok(_repo.GetAttempts().Where(e => e.User.UserID == statIn.UserID && DateTime.Compare(statIn.SearchStart, e.DateTime) <= 0 && DateTime.Compare(e.DateTime, statIn.SearchEnd) <= 0));
                } else if (statIn.QuizID != null)
                {
                    return Ok(_repo.GetAttempts().Where(e => e.Quiz.QuizID == statIn.QuizID && DateTime.Compare(statIn.SearchStart, e.DateTime) <= 0 && DateTime.Compare(e.DateTime, statIn.SearchEnd) <= 0));
                } else if (statIn.Complete != null)
                {
                    return Ok(_repo.GetAttempts().Where(e => e.Completed == statIn.Complete && DateTime.Compare(statIn.SearchStart, e.DateTime) <= 0 && DateTime.Compare(e.DateTime, statIn.SearchEnd) <= 0));
                } else
                {
                    return Ok(_repo.GetAttempts().Where(e => DateTime.Compare(statIn.SearchStart, e.DateTime) <= 0 && DateTime.Compare(e.DateTime, statIn.SearchEnd) <= 0));
                }
            } else
            {
                return BadRequest("Please specify a start and end date");
            }
        }
    }
}
