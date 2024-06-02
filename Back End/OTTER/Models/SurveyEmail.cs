using System.ComponentModel.DataAnnotations;

namespace OTTER.Models
{
    public class SurveyEmail
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; }
    }
}
