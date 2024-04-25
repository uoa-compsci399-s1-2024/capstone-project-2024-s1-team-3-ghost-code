using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        [Required]
        public string UserEmail { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Role { get; set; }
        [Required]
        public Organization Organization { get; set; }
    }
}
