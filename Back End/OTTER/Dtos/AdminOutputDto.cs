using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos

{
    public class AdminOutputDto
    {
        [Key]
        public int AdminID { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
    }
}
