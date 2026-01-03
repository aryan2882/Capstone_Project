namespace UtilityBillingSystem.Core.Entities
{
    public class Consumer
    {
        public int ConsumerId { get; set; }
        public int UserId { get; set; }
        public string ConsumerCode { get; set; }  // Auto-generated
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PinCode { get; set; }
        public string IdProofType { get; set; }
        public string IdProofNumber { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation
        public User User { get; set; }
        public ICollection<Connection> Connections { get; set; }  // ADD THIS
        public ICollection<Bill> Bills { get; set; }              // ADD THIS
        public ICollection<Payment> Payments { get; set; }
    }
}