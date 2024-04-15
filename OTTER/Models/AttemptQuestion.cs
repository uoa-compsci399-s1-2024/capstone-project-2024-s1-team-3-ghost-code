using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class AttemptQuestion
    {
        [Key]
        public int AttemptQID { get; set; }
        [Required]
        public int Attempt { get; set; }
        [Required]
        public int Question { get; set; }
        [Required]
        public int Sequence { get; set; }
    }
}
