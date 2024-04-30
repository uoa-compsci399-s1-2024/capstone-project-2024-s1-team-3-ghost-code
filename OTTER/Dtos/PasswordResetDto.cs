using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class PasswordResetDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
