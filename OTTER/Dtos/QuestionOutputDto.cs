using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class QuestionOutputDto
    {
        [Required]
        public int QuestionID { get; set; }
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? ImageURL { get; set; }
        [Required]
        public int QuestionType { get; set; }
        [Required]
        public string Stage { get; set; }
        [Required]
        public IEnumerable<AnswerOutputDto> Answers { get; set; }
        [Required]
        public int AttemptID { get; set; }
    }
}
