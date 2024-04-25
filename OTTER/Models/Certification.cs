using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Certification
    {
        [Key]
        [Required]
        public int CertificationID { get; set; }
        [Required]
        public int Module { get; set; }
        [Required]
        public string UserEmail { get; set; }
        [Required]
        public string DateTime { get; set; }
        [Required]
        public string ExpiryDateTime { get; set; }
    }
}
