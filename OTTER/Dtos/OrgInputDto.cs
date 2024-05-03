using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class OrgInputDto
    {
        [Required]
        public string OrgName { get; set; }
    }
}
