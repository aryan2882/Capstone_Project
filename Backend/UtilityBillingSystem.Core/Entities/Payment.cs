using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Core.Entities
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public string ReceiptNumber { get; set; }
        public int ConsumerId { get; set; }
        public int BillId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMode PaymentMode { get; set; }
        public string? TransactionId { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Remarks { get; set; }
        public int RecordedBy { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation
        public Consumer Consumer { get; set; }
        public Bill Bill { get; set; }
        public User RecordedByUser { get; set; }
    }
}