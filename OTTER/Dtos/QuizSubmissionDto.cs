using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class QuizSubmissionDto
    {
        [Required]
        public IEnumerable<IEnumerable<int>> AnswerID { get; set; }
        [Required]
        public IEnumerable<int> Sequence { get; set; }
        [Required]
        public int UserID { get; set; }
        [Required]
        public int AttemptID { get; set; }

    }
}
