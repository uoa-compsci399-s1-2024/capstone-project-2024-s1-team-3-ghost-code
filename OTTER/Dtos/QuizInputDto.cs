using System.ComponentModel.DataAnnotations;
using OTTER.Models;

namespace OTTER.Dtos
{
    public class QuizInputDto
    {
        [Required]
        public int ModuleID { get; set; }
        [Required]
        public string Stage { get; set; }
        [Required]
        public int Length { get; set; }
        [Required]
        public int QuizID { get; set; }
        [Required]
        public int UserID { get; set; }
    }
}
