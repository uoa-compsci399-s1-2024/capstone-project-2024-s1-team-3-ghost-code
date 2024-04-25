using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Quiz
    {
        [Key]
        [Required]
        public int QuizID { get; set; }
        [Required]
        public string Name { get; set;}
        [Required]
        public int Sequence { get; set;}
        [Required]
        public bool Visible { get; set; }
        [Required]
        public int Module { get; set;}
        [Required]
        public string Stage { get; set;}
        //ADD LENGTH AS A LATER THING
    }
}
