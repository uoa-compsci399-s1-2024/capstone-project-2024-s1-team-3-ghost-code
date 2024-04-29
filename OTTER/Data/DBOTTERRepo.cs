using OTTER.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Security.Cryptography.X509Certificates;
using OTTER.Dtos;

namespace OTTER.Data
{
    public class DBOTTERRepo : IOTTERRepo
    {
        private readonly OTTERDBContext _dbContext;
        public DBOTTERRepo(OTTERDBContext dbContext)
        {
            _dbContext = dbContext;
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
            Attempt attempt = AddAttempt(new Attempt { Quiz = GetQuizByID(quizInput.QuizID), User = GetUserByID(quizInput.UserID), DateTime = DateTime.UtcNow, Completed = "INCOMPLETE" });
            Random random = new Random();
            IEnumerable<Question> validMod = GetQuestionsByModule(quizInput.ModuleID);
            IEnumerable<Question> validStage = validMod.Where(e => e.Stage == quizInput.Stage && e.Deleted == false);
            List<QuestionOutputDto> output = new List<QuestionOutputDto>();
            for (int i = 0; i < quizInput.Length; i++)
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

        public AttemptQuestion GetAttemptQuestionBySequenceAndUser(int s, int u)
        {
            return _dbContext.AttemptQuestions.FirstOrDefault(e => e.Attempt.User.UserID == u && e.Sequence == s);
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
                    AttemptQuestion aQ = GetAttemptQuestionBySequenceAndUser(sequence, submission.UserID);
                    aQ.Answers.ToList().Add(GetAnswerByID(AID));
                    GetAnswerByID(AID).Attempts.ToList().Add(aQ);
                    correct.Add(GetAnswerByID(AID).CorrectAnswer);
                    feedback.Add(GetAnswerByID(AID).Feedback);
                }
                output.Correct.Add(correct);
                output.Feedback.Add(feedback);
                output.Sequence.Add(sequence);
            }
            _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "COMPLETE";
            _dbContext.SaveChanges();
            return output;
        }

        public IEnumerable<User> GetUsers()
        {
            return _dbContext.Users.ToList<User>();
        }

        public User GetUserByEmail(string email)
        {
            return _dbContext.Users.FirstOrDefault(e => e.UserEmail == email);
        }

        public User GetUserByID(int id)
        {
            return _dbContext.Users.FirstOrDefault(e => e.UserID == id);
        }
        public IEnumerable<User> GetUserBySearch(string search)
        {
            return _dbContext.Users.Where(e => e.UserEmail.ToLower().Contains(search.ToLower()) || e.FirstName.ToLower().Contains(search.ToLower()) || e.LastName.ToLower().Contains(search.ToLower()) || e.Role.RoleName.ToLower().Contains(search.ToLower()) || e.Organization.OrgName.ToLower().Contains(search.ToLower()));
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

        public User EditUser(User user)
        {
            User u = _dbContext.Users.FirstOrDefault(e => e.UserEmail == user.UserEmail);
            if (u != null)
            {
                u.FirstName = user.FirstName;
                u.LastName = user.LastName;
                u.Organization = user.Organization;
                _dbContext.SaveChanges();
                u = _dbContext.Users.FirstOrDefault(e => e.UserEmail == user.UserEmail);
            }
            return u;
        }

        public IEnumerable<Certification> GetCertificationByID(int id)
        {
            return _dbContext.Certifications.Where(e => e.User.UserID == id && (e.Type == "PRACTICAL" || e.Type == "RECERT"));
        }

        public Certification AddCertification(Certification certification)
        {
            EntityEntry<Certification> c = _dbContext.Certifications.Add(certification);
            _dbContext.SaveChanges();
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
            return _dbContext.Organizations.ToList<Organization>();
        }

        public Organization GetOrganizationByID(int id)
        {
            return _dbContext.Organizations.FirstOrDefault(e => e.OrgID == id);
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

        public Admin EditAdmin(Admin admin)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.AdminID == admin.AdminID);
            if (a != null)
            {
                a.FirstName = admin.FirstName;
                a.LastName = admin.LastName;
                a.Email = admin.Email;
                a.Password = admin.Password;
                _dbContext.SaveChanges();
                a = _dbContext.Admins.FirstOrDefault(e => e.AdminID == admin.AdminID);
            }
            return a;
        }
    }
}
