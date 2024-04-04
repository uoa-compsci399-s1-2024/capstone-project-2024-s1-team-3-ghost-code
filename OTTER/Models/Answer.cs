using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Answer
    {
        [Key]
        [Required]
        public int AnswerID { get; set; }
        [Required]
        public int AnswerType { get; set; }
        [Required]
        public string AnswerText { get; set; }
        [Required]
        public string? AnswerCoordinates { get; set; }
        [Required]
        public string CorrectAnswer { get; set; }
        [Required]
        public string? Feedback { get; set; }
    }
}
