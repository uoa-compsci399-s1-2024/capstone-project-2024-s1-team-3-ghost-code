using OTTER.Models;

namespace OTTER.Dtos
{
    public class AnswerInputDto
    {
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
        public ICollection<AttemptQuestion> Attempts { get; set; }
    }
}
