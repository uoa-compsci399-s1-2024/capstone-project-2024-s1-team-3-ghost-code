using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Organization
    {
        [Key]
        public int OrgID { get; set; }
        [Required]
        public string OrgName { get; set; }
    }
}
