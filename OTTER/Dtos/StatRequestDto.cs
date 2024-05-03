using System.ComponentModel.DataAnnotations;

namespace OTTER.Dtos
{
    public class StatRequestDto
    {
        public DateTime SearchStart {  get; set; }
        public DateTime SearchEnd { get; set; }
        public int? QuizID { get; set; }
        public int? UserID { get; set; }
        public string? Complete {  get; set; }

    }
}
