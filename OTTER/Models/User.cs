using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class User
    {
        [Key]
        [Required]
        public string UserEmail { get; set; }
        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }
        [Required]
        public string? Organization { get; set; }
    }
}
