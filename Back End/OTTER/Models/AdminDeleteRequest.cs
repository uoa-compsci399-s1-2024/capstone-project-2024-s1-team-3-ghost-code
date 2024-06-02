using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OTTER.Models
{
    public class AdminDeleteRequest
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [ForeignKey("AdminId")]
        public Admin Admin { get; set; }
        [Required]
        [ForeignKey("RequestorId")]
        public Admin Requestor { get; set; }
        [Required]
        public DateTime Expiry { get; set; }
        [Required]
        public string Token { get; set; }

    }
}
