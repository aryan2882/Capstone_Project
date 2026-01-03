namespace UtilityBillingSystem.Application.DTOs.Users
{
    public class PendingUserDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FatherName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PinCode { get; set; }
        public string IdProofType { get; set; }
        public string IdProofNumber { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}