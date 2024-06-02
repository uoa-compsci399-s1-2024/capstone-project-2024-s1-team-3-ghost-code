using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class EmailInputDto
    {
        [Required]
        public string Email { get; set; }
    }
}
