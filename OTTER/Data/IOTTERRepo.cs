using OTTER.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace OTTER.Data
{
    public interface IOTTERRepo
    {
        Module GetModuleByID(int id);
        Quiz GetQuizByID(int id);
        Question GetQuestionByID(int id);
        Question AddQuestion(Question question);
        Question DeleteQuestion(int id);
        Question EditQuestion(Question question);
        Answer GetAnswerByID(int id);
        Answer AddAnswer(Answer answer);
        Answer DeleteAnswer(Answer answer);
        Answer EditAnswer(Answer answer);
        Attempt GetAttemptByID(int id);
        Attempt AddAttempt(Attempt attempt);
        AttemptQuestion GetAttemptQuestionByID(int id);
        AttemptQuestion AddAttemptQuestion(AttemptQuestion attemptQ);
        AttemptAnswer GetAttemptAnswerByID(int id);
        AttemptAnswer AddAttemptAnswer(AttemptAnswer attemptA);
        IEnumerable<User> GetUsers();
        User GetUserByEmail(string email);
        User AddUser(User user);
        User DeleteUser(string email);
        User EditUser(User user);
        Certification GetCertificationByID(int id);
        Certification AddCertification(Certification certification);
        Certification EditCertification(Certification certification);
        IEnumerable<Organization> GetOrganizations();
        Organization GetOrganizationByID(int id);
        Organization AddOrganization(Organization organization);
        Organization DeleteOrganization(Organization organization);
        Organization EditOrganization(Organization organization);
        bool validAdmin(string username, string password);


    }
}
