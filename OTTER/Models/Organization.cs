using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Organization
    {
        [Key]
        [Required]
        public string OrganizationName { get; set; }
    }
}
