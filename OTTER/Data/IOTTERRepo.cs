using OTTER.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using OTTER.Dtos;

namespace OTTER.Data
{
    public interface IOTTERRepo
    {
        void SendEmail(string email, string subject, string body);
        IEnumerable<Module> GetModules();
        Module GetModuleByID(int id);
        IEnumerable<Quiz> GetQuizzesByID(int id);
        Quiz GetQuizByID(int id);
        Question GetQuestionByID(int id);
        IEnumerable<Question> GetQuestionsByModule(int id);
        IEnumerable<QuestionOutputDto> GetQuizQs(QuizInputDto quizInput);
        Question AddQuestion(Question question);
        void DeleteQuestion(int id);
        Question EditQuestion(EditQuestionInputDto question);
        Answer GetAnswerByID(int id);
        Answer AddAnswer(Answer answer);
        void DeleteAnswer(int id);
        Answer EditAnswer(EditAnswerInputDto answer);
        IEnumerable<Attempt> GetAttempts();
        Attempt GetAttemptByID(int id);
        Attempt AddAttempt(Attempt attempt);
        AttemptQuestion GetAttemptQuestionBySequenceAndUser(int s, int u);
        AttemptQuestion AddAttemptQuestion(AttemptQuestion attemptQ);
        QuizSubMarksDto MarkQuiz(QuizSubmissionDto submission);
        IEnumerable<User> GetUsers();
        User GetUserByEmail(string email);
        User GetUserByID(int id);
        IEnumerable<User> GetUserBySearch(string search);
        User AddUser(User user);
        void DeleteUser(string email);
        User EditUser(int id, User user);
        IEnumerable<Certification> GetCertificationByID(int id);
        Certification AddCertification(Certification certification);
        Certification EditCertification(Certification certification);
        IEnumerable<Organization> GetOrganizations();
        Organization GetOrganizationByID(int id);
        Organization GetOrganizationByNameLower(string name);
        Organization AddOrganization(Organization organization);
        void DeleteOrganization(int id);
        Organization EditOrganization(Organization organization);
        IEnumerable<Role> GetRoles();
        Role GetRoleByID(int id);
        Role GetRoleByNameLower(string name);
        Role AddRole(Role role);
        void DeleteRole(int id);
        Role EditRole(Role role);
        bool validAdmin(string email, string password);
        IEnumerable<Admin> GetAdmins();
        IEnumerable<Admin> SearchAdmins(string search);
        Admin GetAdminByID(int id);
        Admin GetAdminByEmail(string email);
        Admin AddAdmin(Admin admin);
        void DeleteAdmin(int id);
        Admin EditAdmin(Admin admin);
        void ResetPassword(string email);
        bool CheckPasswordReset(string token);
        bool SubmitPasswordReset(PasswordResetDto passwordResetDto);
        void SetLastAdminLogin(int id);

    }
}
