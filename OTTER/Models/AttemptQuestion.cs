using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class AttemptQuestion
    {
        [Key]
        public int AttemptQID { get; set; }
        [Required]
        public Attempt Attempt { get; set; }
        [Required]
        public Question Question { get; set; }
        [Required]
        public int Sequence { get; set; }
        [Required]
        public List<Answer> Answers { get; set; } = [];
    }
}
