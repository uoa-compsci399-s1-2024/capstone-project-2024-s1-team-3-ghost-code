using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Organization
    {
        [Key]
        public int OrganisationID { get; set; }
        [Required]
        public string OrgName { get; set; }
    }
}
