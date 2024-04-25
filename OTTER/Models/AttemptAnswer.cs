using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OTTER.Models
{
    public class AttemptAnswer
    {
        [Key]
        [Required]
        public int Question { get; set; }
        [Required]
        public int Answer { get; set; }
    }
}
