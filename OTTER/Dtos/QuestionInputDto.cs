using System.ComponentModel.DataAnnotations;
using OTTER.Models;

namespace OTTER.Dtos
{
    public class QuestionInputDto
    {
        [Required]
        public int ModID {  get; set; }
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
        [Required]
        public int QuestionType { get; set; }
        [Required]
        public string Stage { get; set; }
        [Required]
        public IEnumerable<AnswerInputDto> Answers { get; set; }
    }
}
