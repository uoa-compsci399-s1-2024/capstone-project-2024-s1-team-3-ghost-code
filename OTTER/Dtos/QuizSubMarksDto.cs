using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class QuizSubMarksDto
    {
        [Required]
        public List<int> Sequence { get; set; }
        [Required]
        public List<List<bool>> SelectedCorrect { get; set; }
        [Required]
        public List<List<string>> SelectedFeedback { get; set; }
        [Required]
        public int Score { get; set; }
        [Required]
        public List<List<string>> MissedFeedback { get; set; }
        [Required]
        public List<List<int>> MissedCorrectAID { get; set; }
    }
}
