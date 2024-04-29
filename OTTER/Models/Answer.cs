using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Answer
    {
        [Key]
        public int AnswerID { get; set; }
        [Required]
        public Question Question { get; set; }
        [Required]
        public int AnswerType { get; set; }
        [Required]
        public string AnswerText { get; set; }
        public string? AnswerCoordinates { get; set; }
        [Required]
        public bool CorrectAnswer { get; set; }
        public string? Feedback { get; set; }
        public List<AttemptQuestion> Attempts { get; set; } = [];
        [Required]
        public bool Deleted { get; set; }
    }
}
