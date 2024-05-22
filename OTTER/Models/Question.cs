using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Question
    {
        [Key]
        public int QuestionID { get; set; }
        [Required]
        public Module Module { get; set; }
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? ImageURL { get; set; }
        [Required]
        public int QuestionType { get; set; }
        [Required]
        public int Topic {  get; set; }
        [Required]
        public bool Deleted { get; set; }
        public int attemptTotal { get; set; } = 0;
        public int correctTotal { get; set; } = 0;
    }
}
