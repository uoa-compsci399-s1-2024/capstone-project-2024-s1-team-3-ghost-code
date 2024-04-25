using OTTER.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace OTTER.Data
{
    public interface IOTTERRepo
    {
        Module GetModuleByID(int id);
        Quiz GetQuizByID(int id);
        Question GetQuestionByID(int id);
        IEnumerable<Question> GetQuestionsByModule(int id);
        Question AddQuestion(Question question);
        void DeleteQuestion(int id);
        Question EditQuestion(Question question);
        Answer GetAnswerByID(int id);
        Answer AddAnswer(Answer answer);
        void DeleteAnswer(int id);
        Answer EditAnswer(Answer answer);
        Attempt GetAttemptByID(int id);
        Attempt AddAttempt(Attempt attempt);
        AttemptQuestion GetAttemptQuestionByID(int id);
        AttemptQuestion AddAttemptQuestion(AttemptQuestion attemptQ);
        /*AttemptAnswer GetAttemptAnswerByID(int id);
        AttemptAnswer AddAttemptAnswer(AttemptAnswer attemptA);*/
        IEnumerable<User> GetUsers();
        User GetUserByEmail(string email);
        User AddUser(User user);
        void DeleteUser(string email);
        User EditUser(User user);
        Certification GetCertificationByID(int id);
        Certification AddCertification(Certification certification);
        Certification EditCertification(Certification certification);
        IEnumerable<Organization> GetOrganizations();
        Organization GetOrganizationByID(int id);
        Organization AddOrganization(Organization organization);
        void DeleteOrganization(int id);
        Organization EditOrganization(Organization organization);
        bool validAdmin(string email, string password);
        IEnumerable<Admin> GetAdmins();
        IEnumerable<Admin> GetAdminByEmail(string email);
        Admin GetAdminByID(int id);
        Admin AddAdmin(Admin admin);
        void DeleteAdmin(int id);
        Admin EditAdmin(Admin admin);

    }
}
