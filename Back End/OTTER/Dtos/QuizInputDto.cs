using System.ComponentModel.DataAnnotations;
using OTTER.Models;

namespace OTTER.Dtos
{
    public class QuizInputDto
    {
        [Required]
        public int QuizID { get; set; }
        [Required]
        public int UserID { get; set; }
        [Required]
        public int ModuleID { get; set; }
    }
}
