namespace UtilityBillingSystem.Application.DTOs.Reports
{
    public class OutstandingReportDto
    {
        public int ConsumerId { get; set; }
        public string ConsumerCode { get; set; }
        public string ConsumerName { get; set; }
        public string Phone { get; set; }
        public decimal TotalOutstanding { get; set; }
        public int UnpaidBillsCount { get; set; }
        public DateTime? OldestBillDate { get; set; }
        public int DaysOverdue { get; set; }
    }
}