using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class QuizSubMarksDto
    {
        [Required]
        public List<int> Sequence { get; set; }
        [Required]
        public List<List<bool>> Correct { get; set; }
        [Required]
        public List<List<string>> Feedback { get; set; }
        [Required]
        public int Score { get; set; }
    }
}
