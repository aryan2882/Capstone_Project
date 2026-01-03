namespace UtilityBillingSystem.Application.DTOs.Reports
{
    public class CollectionReportDto
    {
        public DateTime Date { get; set; }
        public string PaymentMode { get; set; }
        public decimal TotalAmount { get; set; }
        public int TransactionCount { get; set; }
    }
}