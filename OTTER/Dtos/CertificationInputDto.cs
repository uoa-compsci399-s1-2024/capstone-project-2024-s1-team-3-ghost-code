using OTTER.Models;
using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class CertificationInputDto
    {
        [Required]
        public int UserID { get; set; }
        [Required]
        public string Type { get; set; }
    }
}
