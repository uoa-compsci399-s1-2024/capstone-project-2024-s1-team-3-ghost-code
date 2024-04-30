using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class AdminLoginDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
