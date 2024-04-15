using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Question
    {
        [Key]
        public int QuestionID { get; set; }
        [Required]
        public int Module { get; set; }
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? ImageURL { get; set; }
        [Required]
        public int QuestionType { get; set; }

    }
}
