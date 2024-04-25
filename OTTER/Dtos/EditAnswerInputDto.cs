using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class EditAnswerInputDto
    {
        [Required]
        public int AnswerID { get; set; }
        [Required]
        public string AnswerText { get; set; }
        public string? AnswerCoordinates { get; set; }
        [Required]
        public bool CorrectAnswer { get; set; }
        public string? Feedback { get; set; }
    }
}
