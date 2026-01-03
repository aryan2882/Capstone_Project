namespace UtilityBillingSystem.Application.DTOs.Reports
{
    public class ConsumerSummaryReportDto
    {
        public int ConsumerId { get; set; }
        public string ConsumerCode { get; set; }
        public string ConsumerName { get; set; }
        public string UtilityType { get; set; }
        public decimal TotalBilled { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal TotalOutstanding { get; set; }
        public decimal AverageMonthlyConsumption { get; set; }
        public int TotalBills { get; set; }
    }
}