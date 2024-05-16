using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class QuizAccessDto
    {
        [Required]
        public bool PracticePassed { get; set; }
        [Required]
        public bool FinalPassed { get; set; }
        [Required]
        public string Description { get; set; }
    }
}
