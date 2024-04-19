using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class Certification
    {
        [Key]
        public int CertificationID { get; set; }
        [Required]
        public Module Module { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
        [Required]
        public DateTime ExpiryDateTime { get; set; }
    }
}
