namespace UtilityBillingSystem.Application.DTOs.Consumers
{
    public class ConsumerDto
    {
        public int ConsumerId { get; set; }
        public string ConsumerCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PinCode { get; set; }
        public string IdProofType { get; set; }
        public string IdProofNumber { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}