using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Question
    {
        [Key]
        [Required]
        public int QuestionID { get; set; }
        [Required]
        public int Module { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public string? ImageURL { get; set; }
        [Required]
        public int QuestionType { get; set; }

    }
}
