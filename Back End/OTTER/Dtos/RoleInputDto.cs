using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class RoleInputDto
    {
        [Required]
        public string RoleName { get; set; }
    }
}
