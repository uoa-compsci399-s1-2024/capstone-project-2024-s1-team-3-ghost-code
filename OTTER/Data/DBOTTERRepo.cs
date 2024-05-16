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
using iTextSharp.text.pdf;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using System;

namespace OTTER.Data
{
    public class DBOTTERRepo : IOTTERRepo
    {
        private readonly OTTERDBContext _dbContext;
        private readonly string _emailApiUri = "https://script.google.com/macros/s/AKfycbxju7WbjRdS5w3e_PNTmuVgGU0l-ZA3L_Lu_FVkjAnSb1h0BTg_cDwY0czF8BWOig6z/exec";
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

        public string CreateCertitificate(string name, Module module, DateTime date)
        {
            string bucketURL = "https://s3.ap-southeast-2.amazonaws.com/certificate.tmstrainingquizzes.com/";

            // Load the template PDF
            using (var reader = new PdfReader(bucketURL + "certtemplate.pdf"))
            {
                using (var stream = new MemoryStream())
                {
                    var stamper = new PdfStamper(reader, stream);
                    var form = stamper.AcroFields;

                    // Populate fields with data
                    form.SetField("Name", name);
                    form.SetField("Module", $"VERIFY: {module.Name} module");
                    form.SetField("Date", date.ToString("dd MMMM yyyy"));

                    // Flatten the form (optional)
                    stamper.FormFlattening = true;

                    stamper.Close();

                    byte[] bytes = stream.ToArray();

                    // Upload to S3
                    string certURI = $"certificates/{date.ToString("yyyyMMddhhmmss")}{name.Replace(" ", "")}{module.Name.Replace(" ", "")}.pdf";

                    if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production") // Only uploads if the environment is production to get accurate AWS credentials
                    {
                        UploadToS3(bytes, certURI);

                        return bucketURL + certURI;
                    } else // If not production, certificate not found
                    {
                        return bucketURL + "404.html";
                    }
                }
            }
        }

        static void UploadToS3(byte[] bytes, string key)
        {
            var credentials = new InstanceProfileAWSCredentials();
            using (var stream = new MemoryStream(bytes))
            {
                using (var client = new AmazonS3Client(credentials, RegionEndpoint.APSoutheast2))
                {
                    var transferUtility = new TransferUtility(client);
                    transferUtility.Upload(stream, "certificate.tmstrainingquizzes.com", key);
                }
            }
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

        public IEnumerable<AdminQuestionOutputDto> GetQuestionsByModuleAdmin(int id)
        {
            List<AdminQuestionOutputDto> output = new List<AdminQuestionOutputDto>();
            IEnumerable<Question> Qs = _dbContext.Questions.Where(e => e.Module.ModuleID == id).ToList<Question>();
            foreach (Question q in Qs)
            {
                AdminQuestionOutputDto adminQuestionOutputDto = new AdminQuestionOutputDto { QuestionID = q.QuestionID, ModID = id, Title = q.Title, Description = q.Description, ImageURL = q.ImageURL, QuestionType = q.QuestionType, Stage = q.Stage, Answers = new List<AdminAnswerOutputDto>() };
                IEnumerable<Answer> As = _dbContext.Answers.Include(e => e.Question).Where(e => e.Question.QuestionID == q.QuestionID).ToList<Answer>();
                foreach (Answer a in As)
                {
                    AdminAnswerOutputDto adminAnswerOutputDto = new AdminAnswerOutputDto { AnswerID = a.AnswerID, QuestionID = q.QuestionID, AnswerType = a.AnswerType, AnswerText = a.AnswerText, AnswerCoordinates = a.AnswerCoordinates, CorrectAnswer = a.CorrectAnswer, Feedback = a.Feedback };
                    adminQuestionOutputDto.Answers.Add(adminAnswerOutputDto);
                }
                output.Add(adminQuestionOutputDto);
            }
            return output;
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
            Question oldQ = _dbContext.Questions.Include(e => e.Module).FirstOrDefault(e => e.QuestionID == question.QuestionID);
            if (oldQ != null)
            {
                DeleteQuestion(oldQ.QuestionID);
                Question newQ = new Question { Module = oldQ.Module, Title = question.Title, Description = question.Description, ImageURL = question.ImageURL, QuestionType = oldQ.QuestionType, Stage = oldQ.Stage, Deleted = false };
                AddQuestion(newQ);
                _dbContext.SaveChanges();
                foreach(EditAnswerInputDto answer in question.Answers)
                {
                    Answer oldA = _dbContext.Answers.FirstOrDefault(e => e.AnswerID == answer.AnswerID);
                    AddAnswer(new Answer { Question = newQ, AnswerType = oldA.AnswerType, AnswerText = answer.AnswerText, AnswerCoordinates = answer.AnswerCoordinates, CorrectAnswer = answer.CorrectAnswer, Feedback = answer.Feedback, Attempts = new List<AttemptQuestion>(), Deleted = false });
                }
                newQ = _dbContext.Questions.FirstOrDefault(e => e.QuestionID == question.QuestionID);
                return newQ;
            }
            return null;


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
            return _dbContext.Attempts.Include(e => e.User).Include(e => e.Quiz).ThenInclude(e => e.Module).ToList<Attempt>();
        }

        public Attempt GetAttemptByID(int id)
        {
            return _dbContext.Attempts.Include(e => e.Quiz).FirstOrDefault(e => e.AttemptID == id);
        }

        public Attempt AddAttempt(Attempt attempt)
        {
            IEnumerable<Attempt> current = GetAttempts().Where(e => e.User.UserID == attempt.User.UserID && e.Completed == "INCOMPLETE");
            if(current != null)
            {
                foreach(Attempt next in current)
                {
                    IEnumerable<AttemptQuestion> question = _dbContext.AttemptQuestions.Include(e => e.Attempt).Where(e => e.Attempt.AttemptID == next.AttemptID);
                    if (question != null)
                    {
                        foreach (AttemptQuestion aQuestion in question)
                        {
                            _dbContext.AttemptQuestions.Remove(aQuestion);
                        }
                    }
                    _dbContext.Attempts.Remove(next);
                }
            }
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
            QuizSubMarksDto output = new QuizSubMarksDto { Sequence = new List<int>(), SelectedCorrect = new List<List<bool>>(), SelectedFeedback = new List<List<string>>(), MissedCorrectAID = new List<List<int>>()  };
            foreach (int sequence in submission.Sequence)
            {
                List<bool> correct = new List<bool>();
                List<string> feedback = new List<string>();
                List<int> missedCorrectAID = new List<int>();
                List<int> selectedAID = new List<int>();
                foreach (int AID in submission.AnswerID.ElementAt(sequence - 1))
                {
                    selectedAID.Add(AID);
                    AttemptQuestion aQ = GetAttemptQuestionBySequenceAndUserAndAttempt(sequence, submission.UserID, submission.AttemptID);
                    aQ.Answers.ToList().Add(GetAnswerByID(AID));
                    GetAnswerByID(AID).Attempts.ToList().Add(aQ);
                    correct.Add(GetAnswerByID(AID).CorrectAnswer);
                    feedback.Add(GetAnswerByID(AID).Feedback);
                }
                foreach (Answer correctAnswer in GetCorrectAnswersByQID(submission.QuestionID.ElementAt(sequence - 1))){
                    if(selectedAID.Contains(correctAnswer.AnswerID) == false)
                    {
                        missedCorrectAID.Add(correctAnswer.AnswerID);
                    }
                }
                output.MissedCorrectAID.Add(missedCorrectAID);
                output.SelectedCorrect.Add(correct);
                output.SelectedFeedback.Add(feedback);
                output.Sequence.Add(sequence);
            }
            _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "FAIL";
            _dbContext.SaveChanges();
            double mark = 0.0;
            double count = 0.0;

            foreach (int sequence in submission.Sequence)
            {
                double multiCount = GetCorrectAnswersByQID(submission.QuestionID.ElementAt(sequence - 1)).Count();
                double multiMark = 0.0;
                count++;
                foreach (bool correct in output.SelectedCorrect.ElementAt(sequence - 1))
                {
                    if(correct == true)
                    {
                        multiMark++;
                    } else if (correct == false)
                    {
                        multiMark--;
                    }
                }
                if (multiMark == multiCount)
                {
                    mark++;
                } 
            }

            if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Final" && mark /count >= 0.8)
            {
                
                _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "PASS";
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1)};
                string certificateURL = CreateCertitificate($"{cert.User.FirstName} {cert.User.LastName}", GetQuestionByID(submission.QuestionID.ElementAt(0)).Module, cert.DateTime);
                cert.CertificateURL = certificateURL;
                AddCertification(cert);
                if (cert.Type.Contains("Final") && GetCertificationByID(cert.User.UserID).Where(e => e.Type.Contains("Final")).Count() == 6)
                {
                    SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} quiz", $"Hi {cert.User.FirstName},<br><br>Congratulations on passing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} quiz. To view your certificate for this module, <a href = '{cert.CertificateURL}'>click here</a>." +
                    $"<Br>It appears you have passed every final quiz for all available modules. You should now register to complete the practical test to become fully qualified in the VERIFY study." +
                    $"<Br><Br>Thanks,<Br>The VERIFY Team");
                }
                else if (cert.Type.Contains("Final")) {
                    SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} quiz", $"Hi {cert.User.FirstName},<br><br>Congratulations on passing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} quiz. To view your certificate for this module, <a href = '{cert.CertificateURL}'>click here</a>." +
                    $"<Br>You should now move on to another module." +
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
            } else if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Recert" && mark / count >= 0.8)
            {
                _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "PASS";
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1) };
                SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} quiz", $"Hi {cert.User.FirstName},<br><br>Congratulations on passing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} quiz.<Br>You are now recertified until {cert.ExpiryDateTime.ToString("dd/MM/yyyy")}." +
                    $"<Br><Br>Thanks,<Br>The VERIFY Team");
            }

            output.Score = (int)(Math.Floor((mark / count) * 100));
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
            return _dbContext.Certifications.Include(e => e.User).ThenInclude(e => e.Organization).Include(e => e.User).ThenInclude(e => e.Role).Where(e => e.User.UserID == id && (e.Type == "InitCertification" || e.Type == "Recert"));
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
            Role other = _dbContext.Roles.First(r => r.RoleName == "Other");
            IEnumerable<Role> list = _dbContext.Roles.Where(r => r.RoleName != "Other").OrderBy(o => o.RoleName).ToList<Role>();
            list = list.Append(other);
            return list;
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
