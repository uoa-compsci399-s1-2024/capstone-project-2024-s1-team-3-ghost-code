namespace OTTER.Dtos

{
    public class CurrentAdminOutputDto
    {
        public int AdminID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime PreviousLogin { get; set; }
    }
}
