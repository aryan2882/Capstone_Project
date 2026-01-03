namespace UtilityBillingSystem.Application.DTOs.Payments
{
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public string ReceiptNumber { get; set; }
        public int ConsumerId { get; set; }
        public string ConsumerName { get; set; }
        public int BillId { get; set; }
        public string BillNumber { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; }
        public string TransactionId { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Remarks { get; set; }
    }
}