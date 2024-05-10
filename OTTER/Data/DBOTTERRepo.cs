using OTTER.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using OTTER.Dtos;
using System.Security.Cryptography;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;
using System.Runtime.ConstrainedExecution;
using Microsoft.AspNetCore.Components.Forms;

namespace OTTER.Data
{
    public class DBOTTERRepo : IOTTERRepo
    {
        private readonly OTTERDBContext _dbContext;
        private readonly string _emailApiUri = "https://script.google.com/macros/s/AKfycbzvev_v7GVvporKeNujKD5ndYEcQa-Xv93tu5FHhwyea_TC_-7PqW2qk1Jv63uSfQ1F/exec";
        public DBOTTERRepo(OTTERDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void SendEmail(string requestEmail, string requestSubject, string requestBody)
        {
            var client = new HttpClient();
            var endpoint = new Uri(_emailApiUri);
            var newEmail = new EmailContentDto()
            {
                email = requestEmail,
                subject = requestSubject,
                body = requestBody
            };
            var newEmailJson = JsonConvert.SerializeObject(newEmail);
            var payload = new StringContent(newEmailJson, Encoding.UTF8, "application/json");

            client.PostAsync(endpoint, payload);
        }

        public IEnumerable<Module> GetModules()
        {
            return _dbContext.Modules.ToList<Module>();
        }
        public Module GetModuleByID(int id)
        {
            return _dbContext.Modules.FirstOrDefault(e => e.ModuleID == id);
        }

        public IEnumerable<Quiz> GetQuizzesByID(int id)
        {
            return _dbContext.Quizzes.Where(e => e.Module.ModuleID == id);
        }
        public Quiz GetQuizByID(int id)
        {
            return _dbContext.Quizzes.FirstOrDefault(e => e.QuizID == id);
        }

        public Question GetQuestionByID(int id)
        {
            return _dbContext.Questions.FirstOrDefault(e => e.QuestionID == id);
        }

        public IEnumerable<Question> GetQuestionsByModule(int id)
        {
            return _dbContext.Questions.Where(e => e.Module.ModuleID == id).ToList<Question>();
        }

        public IEnumerable<QuestionOutputDto> GetQuizQs(QuizInputDto quizInput)
        {
            Quiz quiz = GetQuizByID(quizInput.QuizID);
            Attempt attempt = AddAttempt(new Attempt { Quiz = quiz, User = GetUserByID(quizInput.UserID), DateTime = DateTime.UtcNow, Completed = "INCOMPLETE" });
            Random random = new Random();
            IEnumerable<Question> validMod = GetQuestionsByModule(quizInput.ModuleID);
            IEnumerable<Question> validStage = validMod.Where(e => e.Stage == quiz.Stage && e.Deleted == false);
            List<QuestionOutputDto> output = new List<QuestionOutputDto>();
            for (int i = 0; i < quiz.Length; i++)
            {
                int randnum = random.Next(0,validStage.Count());
                Question randq = validStage.ElementAt(randnum);
                if (output.FirstOrDefault(e => e.QuestionID == randq.QuestionID) != null)
                {
                    i--;
                    continue;
                }
                QuestionOutputDto qOutputDto = new QuestionOutputDto { QuestionID = randq.QuestionID, Title = randq.Title, Description = randq.Description, ImageURL = randq.ImageURL, QuestionType = randq.QuestionType, Stage = randq.Stage };
                List<AnswerOutputDto> aOutputDto = new List<AnswerOutputDto>();
                foreach (Answer answer in _dbContext.Answers.Where(e => e.Question.QuestionID == randq.QuestionID))
                {
                    AnswerOutputDto a = new AnswerOutputDto { AnswerID = answer.AnswerID, QuestionID = answer.Question.QuestionID, AnswerType = answer.AnswerType, AnswerText = answer.AnswerText, AnswerCoordinates = answer.AnswerCoordinates };
                    aOutputDto.Add(a);
                }
                qOutputDto.Answers = aOutputDto;
                AttemptQuestion attemptq = new AttemptQuestion { Attempt = GetAttemptByID(attempt.AttemptID), Question = GetQuestionByID(randq.QuestionID), Sequence = i + 1, Answers = new List<Answer>() };
                AddAttemptQuestion(attemptq);
                qOutputDto.AttemptID = attempt.AttemptID;
                output.Add(qOutputDto);
            }
            return output;
        }

        public Question AddQuestion(Question question)
        {
            EntityEntry<Question> e = _dbContext.Questions.Add(question);
            _dbContext.SaveChanges();
            return e.Entity;
        }

        public void DeleteQuestion(int id)
        {
            Question q = _dbContext.Questions.FirstOrDefault(e => e.QuestionID == id);
            if (q != null)
            {
                q.Deleted = true;
                foreach (Answer a in _dbContext.Answers.Where(e => e.Question.QuestionID == q.QuestionID))
                {
                    a.Deleted = true;
                }
                _dbContext.SaveChanges();
            }
        }

        public Question EditQuestion(EditQuestionInputDto question)
        {
            Question q = _dbContext.Questions.FirstOrDefault(e => e.QuestionID == question.QuestionID);
            if (q != null)
            {
                q.Title = question.Title;
                q.Description = question.Description;
                q.ImageURL = question.ImageURL;
                q.Stage = question.Stage;
                _dbContext.SaveChanges();
                foreach(EditAnswerInputDto answer in question.Answers)
                {
                    EditAnswer(answer);
                }
                q = _dbContext.Questions.FirstOrDefault(e => e.QuestionID == question.QuestionID);
            }
            return q;
        }

        public IEnumerable<Answer> GetCorrectAnswersByQID(int id)
        {
            return _dbContext.Answers.Where(e => e.Question.QuestionID == id && e.CorrectAnswer == true);
        }

        public Answer GetAnswerByID(int id)
        {
            return _dbContext.Answers.FirstOrDefault(e => e.AnswerID == id);
        }

        public Answer AddAnswer(Answer answer)
        {
            EntityEntry<Answer> a = _dbContext.Answers.Add(answer);
            _dbContext.SaveChanges();
            return a.Entity;
        }

        public void DeleteAnswer(int id)
        {
            Answer a = _dbContext.Answers.FirstOrDefault(e => e.AnswerID == id);
            if (a != null)
            {
                _dbContext.Answers.Remove(a);
                _dbContext.SaveChanges();
            }
        }

        public Answer EditAnswer(EditAnswerInputDto answer)
        {
            Answer a = _dbContext.Answers.FirstOrDefault(e => e.AnswerID == answer.AnswerID);
            if (a != null)
            {
                a.AnswerText = answer.AnswerText;
                a.AnswerCoordinates = answer.AnswerCoordinates;
                a.CorrectAnswer = answer.CorrectAnswer;
                a.Feedback = answer.Feedback;
                _dbContext.SaveChanges();
                a = _dbContext.Answers.FirstOrDefault(e => e.AnswerID == answer.AnswerID);
            }
            return a;
        }

        public IEnumerable<Attempt> GetAttempts()
        {
            return _dbContext.Attempts.ToList<Attempt>();
        }

        public Attempt GetAttemptByID(int id)
        {
            return _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == id);
        }

        public Attempt AddAttempt(Attempt attempt)
        {
            EntityEntry<Attempt> at = _dbContext.Attempts.Add(attempt);
            _dbContext.SaveChanges();
            return at.Entity;
        }

        public AttemptQuestion GetAttemptQuestionBySequenceAndUserAndAttempt(int s, int u, int a)
        {
            return _dbContext.AttemptQuestions.FirstOrDefault(e => e.Attempt.User.UserID == u && e.Sequence == s && e.Attempt.AttemptID == a);
        }

        public AttemptQuestion AddAttemptQuestion(AttemptQuestion attemptQ)
        {
            EntityEntry<AttemptQuestion> atQ = _dbContext.AttemptQuestions.Add(attemptQ);
            _dbContext.SaveChanges();
            return atQ.Entity;
        }

        public QuizSubMarksDto MarkQuiz(QuizSubmissionDto submission)
        {
            QuizSubMarksDto output = new QuizSubMarksDto { Sequence = new List<int>(), Correct = new List<List<bool>>(), Feedback = new List<List<string>>() };
            foreach (int sequence in submission.Sequence)
            {
                List<bool> correct = new List<bool>();
                List<string> feedback = new List<string>();
                foreach (int AID in submission.AnswerID.ElementAt(sequence - 1))
                {
                    AttemptQuestion aQ = GetAttemptQuestionBySequenceAndUserAndAttempt(sequence, submission.UserID, submission.AttemptID);
                    aQ.Answers.ToList().Add(GetAnswerByID(AID));
                    GetAnswerByID(AID).Attempts.ToList().Add(aQ);
                    correct.Add(GetAnswerByID(AID).CorrectAnswer);
                    feedback.Add(GetAnswerByID(AID).Feedback);
                }
                output.Correct.Add(correct);
                output.Feedback.Add(feedback);
                output.Sequence.Add(sequence);
            }
            _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "FAIL";
            _dbContext.SaveChanges();
            double mark = 0.0;
            double count = 0.0;

            foreach (int sequence in submission.Sequence)
            {

                if(GetCorrectAnswersByQID(submission.QuestionID.ElementAt(sequence - 1)).Count() == 1)
                {
                    count++;
                    if (output.Correct.ElementAt(sequence - 1).ElementAt(0) == true)
                    {
                        mark++;
                    }
                } else
                {
                    double multiCount = GetCorrectAnswersByQID(submission.QuestionID.ElementAt(sequence - 1)).Count();
                    double multiMark = 0.0;
                    count++;
                    foreach (bool correct in output.Correct.ElementAt(sequence - 1))
                    {
                        if(correct == true)
                        {
                            multiMark++;
                        }
                    }
                    if (multiMark == multiCount)
                    {
                        mark++;
                    } 
                }
            }

            //foreach(List<bool> question in output.Correct)
            //{
            //    foreach (bool answer in question)
            //    {
            //        count++;
            //        if (answer == true)
            //        {
            //            mark++;
            //        }
            //    }
            //}

            if(GetAttemptByID(submission.AttemptID).Quiz.Stage == "Final" && mark /count >= 0.8)
            {
                _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "PASS";
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1)};
                AddCertification(cert);
                if (cert.Type.Contains("Final") && GetCertificationByID(cert.User.UserID).Where(e => e.Type.Contains("Final")).Count() == 6)
                {
                    SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} quiz", $"Hi {cert.User.FirstName},<br><br>Congratulations on passing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} quiz.<Br>It appears you have passed every final quiz for all available modules. You should now register to complete the practical test to become fully qualified in the VERIFY study." +
                    $"<Br><Br>Thanks,<Br>The VERIFY Team");
                }
                else if (cert.Type.Contains("Final")) {
                    SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} quiz", $"Hi {cert.User.FirstName},<br><br>Congratulations on passing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} quiz.<Br>You should now move on to another module." +
                    $"<Br><Br>Thanks,<Br>The VERIFY Team");
                } else if (cert.Type == "Recertification"){
                    SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} quiz", $"Hi {cert.User.FirstName},<br><br>Congratulations on passing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} quiz.<Br>You are now recertified until {cert.ExpiryDateTime.ToString("dd/MM/yyyy")}." +
                    $"<Br><Br>Thanks,<Br>The VERIFY Team");
                } 
            } 
            else if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Practice" && mark/count >= 0.7)
            {
                _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "PASS";
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1) };
                AddCertification(cert);
                SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} quiz", $"Hi {cert.User.FirstName},<br><br>Congratulations on passing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} quiz.<Br>You should now progress to the final quiz for this module." +
                    $"<Br><Br>Thanks,<Br>The VERIFY Team");
            }

            output.Score = (int)(Math.Floor(mark / count) * 100);
            return output;
        }

        public IEnumerable<User> GetUsers()
        {
            return _dbContext.Users.Include(e => e.Role).Include(e => e.Organization).ToList<User>();
        }

        public User GetUserByEmail(string email)
        {
            return _dbContext.Users.Include(e => e.Role).Include(e => e.Organization).FirstOrDefault(e => e.UserEmail == email);
        }

        public User GetUserByID(int id)
        {
            return _dbContext.Users.Include(e => e.Role).Include(e => e.Organization).FirstOrDefault(e => e.UserID == id);
        }
        public IEnumerable<User> GetUserBySearch(string search)
        {
            return _dbContext.Users.Include(e => e.Role).Include(e => e.Organization).Where(e => e.UserEmail.ToLower().Contains(search.ToLower()) || e.FirstName.ToLower().Contains(search.ToLower()) || e.LastName.ToLower().Contains(search.ToLower()) || e.Role.RoleName.ToLower().Contains(search.ToLower()) || e.Organization.OrgName.ToLower().Contains(search.ToLower()));
        }

        public User AddUser(User user)
        {
            EntityEntry<User> u = _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            return u.Entity;
        }

        public void DeleteUser(string email)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserEmail == email);
            if (user != null)
            {
                _dbContext.Users.Remove(user);
                _dbContext.SaveChanges();
            }
        }

        public User EditUser(int id, User user)
        {
            User u = _dbContext.Users.FirstOrDefault(e => e.UserID == id);
            if (u != null)
            {
                u.FirstName = user.FirstName;
                u.LastName = user.LastName;
                u.UserEmail = user.UserEmail;
                u.Organization = user.Organization;
                u.Role = user.Role;
                _dbContext.SaveChanges();
                u = _dbContext.Users.FirstOrDefault(e => e.UserID == id);
            }
            return u;
        }

        public IEnumerable<Certification> GetCertificationByID(int id)
        {
            return _dbContext.Certifications.Where(e => e.User.UserID == id && (e.Type == "InitCertification" || e.Type == "Recertification"));
        }

        public Certification AddCertification(Certification certification)
        {
            EntityEntry<Certification> c = _dbContext.Certifications.Add(certification);
            _dbContext.SaveChanges();
            if (certification.Type == "InitCertification")
            {
                SendEmail(certification.User.UserEmail, $"You are now fully certified with the VERIFY study!", $"Hi {certification.User.FirstName},<br><br>Congratulations on passing the " +
                    $"practical test.<Br>An admin has already entered you certifcation status and you are now certified until {certification.ExpiryDateTime.ToString("dd/MM/yyyy")}." +
                    $"<Br><Br>To remain certified, you must complete the Recertification Quiz which is now accessible via the quiz dashboard." +
                    $"<Br><Br>Thanks,<Br>The VERIFY Team");
            }
            return c.Entity;
        }

        public Certification EditCertification(Certification certification)
        {
            Certification c = _dbContext.Certifications.FirstOrDefault(e => e.CertificationID == certification.CertificationID);
            if (c != null)
            {
                c.DateTime = certification.DateTime;
                c.ExpiryDateTime = certification.ExpiryDateTime;
                _dbContext.SaveChanges();
                c = _dbContext.Certifications.FirstOrDefault(e => e.CertificationID == certification.CertificationID);
            }
            return c;
        }

        public IEnumerable<Organization> GetOrganizations()
        {
            Organization other = _dbContext.Organizations.First(r => r.OrgName == "Other");
            IEnumerable<Organization> list = _dbContext.Organizations.Where(r => r.OrgName != "Other").OrderBy(o => o.OrgName).ToList<Organization>();
            list = list.Append(other);
            return list;
        }

        public Organization GetOrganizationByID(int id)
        {
            return _dbContext.Organizations.FirstOrDefault(e => e.OrgID == id);
        }

        public Organization GetOrganizationByNameLower(string name)
        {
            return _dbContext.Organizations.FirstOrDefault(e => e.OrgName.ToLower() == name.ToLower());
        }

        public Organization AddOrganization(Organization organization)
        {
            EntityEntry<Organization> o = _dbContext.Organizations.Add(organization);
            _dbContext.SaveChanges();
            return o.Entity;
        }

        public void DeleteOrganization(int id)
        {
            Organization o = _dbContext.Organizations.FirstOrDefault(o => o.OrgID == id);
            if (o != null)
            {
                _dbContext.Organizations.Remove(o);
                _dbContext.SaveChanges();
            }
        }

        public Organization EditOrganization(Organization organization)
        {
            Organization o = _dbContext.Organizations.FirstOrDefault(e => e.OrgID == organization.OrgID);
            if (o != null)
            {
                o.OrgName = organization.OrgName;
                _dbContext.SaveChanges();
                o = _dbContext.Organizations.FirstOrDefault(e => e.OrgID == organization.OrgID);
            }
            return o;
        }

        public IEnumerable<Role> GetRoles()
        {
            return _dbContext.Roles.ToList<Role>();
        }
        
        public Role GetRoleByID(int id)
        {
            return _dbContext.Roles.FirstOrDefault(e => e.RoleID == id);
        }

        public Role GetRoleByNameLower(string name)
        {
            return _dbContext.Roles.FirstOrDefault(e => e.RoleName.ToLower() == name.ToLower());
        }

        public Role AddRole(Role role)
        {
            EntityEntry<Role> r = _dbContext.Roles.Add(role);
            _dbContext.SaveChanges();
            return r.Entity;
        }
        
        public void DeleteRole(int id)
        {
            Role r = _dbContext.Roles.FirstOrDefault(e => e.RoleID == id);
            if (r != null)
            {
                _dbContext.Roles.Remove(r);
                _dbContext.SaveChanges();
            }
        }
        
        public Role EditRole(Role role)
        {
            Role r = _dbContext.Roles.FirstOrDefault(e => e.RoleID == role.RoleID);
            if (r != null)
            {
                r.RoleName = role.RoleName;
                _dbContext.SaveChanges();
                r = _dbContext.Roles.FirstOrDefault(e => e.RoleID == role.RoleID);
            }
            return r;
        }
        
        public bool validAdmin(string email, string password)
        {
            Admin admin = _dbContext.Admins.FirstOrDefault(e => e.Email == email && e.Password == password);
            if (admin == null)
                return false;
            else
                return true;
        }

        public IEnumerable<Admin> GetAdmins()
        {
            return _dbContext.Admins.ToList<Admin>();
        }

        public IEnumerable<Admin> SearchAdmins(string search)
        {
            return _dbContext.Admins.Where(e => e.FirstName.ToLower().Contains(search.ToLower()) || e.LastName.ToLower().Contains(search.ToLower()) || e.Email.ToLower().Contains(search.ToLower()));
        }

        public Admin GetAdminByID(int id)
        {
            return _dbContext.Admins.FirstOrDefault(e => e.AdminID == id);
        }

        public Admin GetAdminByEmail(string email)
        {
            return _dbContext.Admins.FirstOrDefault(e => e.Email == email);
        }

        public Admin AddAdmin(Admin admin)
        {
            EntityEntry<Admin> a = _dbContext.Admins.Add(admin);
            _dbContext.SaveChanges();
            return a.Entity;
        }

        public void DeleteAdmin(int id)
        {
            Admin admin = _dbContext.Admins.FirstOrDefault(e => e.AdminID == id);
            if (admin != null)
            {
                _dbContext.Admins.Remove(admin);
                _dbContext.SaveChanges();
            }
        }

        public AdminOutputDto EditAdmin(AdminEditDto admin)
        {
            Admin a = _dbContext.Admins.First(e => e.AdminID == admin.AdminID);
            a.FirstName = admin.FirstName;
            a.LastName = admin.LastName;
            a.Email = admin.Email;
            a.Password = BCrypt.Net.BCrypt.HashPassword(admin.Password);
            _dbContext.SaveChanges();
            a = _dbContext.Admins.First(e => e.AdminID == admin.AdminID);
            AdminOutputDto newAdmin = new AdminOutputDto { AdminID = a.AdminID, FirstName = a.FirstName, LastName = a.LastName, Email = a.Email };
            return newAdmin;
        }

        public void ResetPassword(string email)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.Email == email);
            if (a != null)
            {
                Random rnd = new Random();
                a.PasswordResetToken = Convert.ToString(rnd.Next(112233,998877));
                a.ResetTokenExpires = DateTime.Now.AddMinutes(30);
                _dbContext.SaveChanges();

                SendEmail(a.Email, "Password reset request",
                    $"Hi {a.FirstName},<br><br>We have received a request to reset your password.<br><br>Reset code: {a.PasswordResetToken}" +
                    $"<br><br>This code is valid for 30 minutes.<br><br>Thanks,<br>The VERIFY Team");
            }
        }

        public bool CheckPasswordReset(string token)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.PasswordResetToken == token);
            if (a != null)
            {
                if (a.ResetTokenExpires > DateTime.Now) { return true; }
                else { return false; }
            }
            else { return false; }
        }

        public bool SubmitPasswordReset(PasswordResetDto passwordResetDto)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.PasswordResetToken == passwordResetDto.Token);
            if (a != null)
            {
                if (a.ResetTokenExpires > DateTime.Now) { 
                    a.Password = BCrypt.Net.BCrypt.HashPassword(passwordResetDto.Password);
                    a.PasswordResetToken = null;
                    a.ResetTokenExpires = null;
                    _dbContext.SaveChanges();
                    return true;
                }
                else { return false; }
            }
            else { return false; }
        }

        public void SetLastAdminLogin(int id)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.AdminID == id);
            a.LastLogin = DateTime.Now;
            _dbContext.SaveChanges();
        }
    }
}
