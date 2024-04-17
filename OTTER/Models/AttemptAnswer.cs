using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OTTER.Models
{
    [PrimaryKey(nameof(Question), nameof(Answer))]
    public class AttemptAnswer
    {
        public int Question { get; set; }
        public int Answer { get; set; }
    }
}
