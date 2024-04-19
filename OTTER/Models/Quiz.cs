using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Quiz
    {
        [Key]
        public int QuizID { get; set; }
        [Required]
        public string Name { get; set;}
        [Required]
        public int Sequence { get; set;}
        [Required]
        public bool Visible { get; set; }
        [Required]
        public Module Module { get; set;}
        [Required]
        public string Stage { get; set;}
        [Required]
        public int Length { get; set;}
    }
}
