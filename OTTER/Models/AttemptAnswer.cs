using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OTTER.Models
{
    public class AttemptAnswer
    {
        [Key]
        public string AttemptAID { get; set; }
        [ForeignKey("Question"), Column(Order = 0)]
        public int Question { get; set; }
        [ForeignKey("Answer"), Column(Order = 1)]
        public int Answer { get; set; }
    }
}
