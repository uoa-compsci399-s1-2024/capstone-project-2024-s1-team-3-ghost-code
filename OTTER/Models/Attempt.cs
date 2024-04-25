using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Attempt
    {
        [Key]
        [Required]
        public int AttemptID { get; set; }
        [Required]
        public int QuizID { get; set; }
        [Required]
        public string UserEmail { get; set; }
        [Required]
        public string DateTime { get; set; }
    }
}
