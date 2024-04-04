using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Module
    {
        [Key]
        [Required]
        public int ModuleID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int Sequence { get; set; }
    }
}
