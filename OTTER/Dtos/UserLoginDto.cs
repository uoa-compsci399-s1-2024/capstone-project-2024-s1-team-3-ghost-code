using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class UserLoginDto
    {
        [Required]
        public string Email { get; set; }
    }
}
