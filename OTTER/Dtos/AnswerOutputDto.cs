using OTTER.Models;
using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class AnswerOutputDto
    {
        [Required]
        public int AnswerID { get; set; }
        [Required]
        public int QuestionID { get; set; }
        [Required]
        public int AnswerType { get; set; }
        [Required]
        public string AnswerText { get; set; }
        public string? AnswerCoordinates { get; set; }
    }
}
