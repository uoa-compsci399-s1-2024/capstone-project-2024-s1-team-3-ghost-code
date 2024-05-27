using OTTER.Models;
using Microsoft.EntityFrameworkCore;

namespace OTTER.Data
{
    public class OTTERDBContext : DbContext
    {
        public OTTERDBContext(DbContextOptions<OTTERDBContext> options) : base(options) { }
        public DbSet<AdminDeleteRequest> AdminDeleteRequests { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Attempt> Attempts { get; set; }
        public DbSet<AttemptQuestion> AttemptQuestions { get; set; }
        public DbSet<Certification> Certifications { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Disable cascade delete for all relationships
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
    }
}
