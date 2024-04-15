using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OTTER.Models
{
    public class AttemptAnswer
    {
        [Key, Column(Order = 0)]
        public int Question { get; set; }
        [Key, Column(Order = 1)]
        public int Answer { get; set; }
    }
}
