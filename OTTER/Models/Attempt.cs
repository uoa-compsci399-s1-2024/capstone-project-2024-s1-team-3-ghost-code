using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Attempt
    {
        [Key]
        public int AttemptID { get; set; }
        [Required]
        public int QuizID { get; set; }
        [Required]
        public int UserID { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
    }
}
