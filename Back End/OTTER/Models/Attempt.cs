using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Attempt
    {
        [Key]
        public int AttemptID { get; set; }
        [Required]
        public Quiz Quiz { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
        [Required]
        public string Completed { get; set; }
    }
}
