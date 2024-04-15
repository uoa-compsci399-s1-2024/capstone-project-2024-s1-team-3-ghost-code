using OTTER.Models;
using Microsoft.EntityFrameworkCore;

namespace OTTER.Data
{
    public class OTTERDBContext : DbContext
    {
        public OTTERDBContext(DbContextOptions<OTTERDBContext> options) : base(options) { }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Attempt> Attempts { get; set; }
        public DbSet<AttemptAnswer> AttemptAnswers { get; set; }
        public DbSet<AttemptQuestion> AttemptQuestions { get; set; }
        public DbSet<Certification> Certifications { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
