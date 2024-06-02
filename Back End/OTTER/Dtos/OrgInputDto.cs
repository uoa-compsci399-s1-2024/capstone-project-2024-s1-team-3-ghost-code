using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class OrgInputDto
    {
        [Required]
        public string OrgName { get; set; }
    }
}
