namespace UtilityBillingSystem.Application.DTOs.Reports
{
    public class RevenueReportDto
    {
        public string Period { get; set; }
        public decimal TotalBillAmount { get; set; }
        public decimal TotalCollected { get; set; }
        public decimal TotalOutstanding { get; set; }
        public int TotalBills { get; set; }
        public int PaidBills { get; set; }
        public int UnpaidBills { get; set; }
    }
}