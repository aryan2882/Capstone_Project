namespace UtilityBillingSystem.Application.DTOs.Consumers
{
    public class ConsumptionDetailsDto
    {
        public int ConnectionId { get; set; }
        public string MeterNumber { get; set; }
        public string UtilityTypeName { get; set; }
        public List<MonthlyConsumptionDto> MonthlyConsumption { get; set; }
        public ConsumptionSummaryDto Summary { get; set; }
    }

    public class MonthlyConsumptionDto
    {
        public string Month { get; set; }
        public DateTime ReadingDate { get; set; }
        public decimal PreviousReading { get; set; }
        public decimal CurrentReading { get; set; }
        public decimal Consumption { get; set; }
        public decimal BillAmount { get; set; }
        public string BillStatus { get; set; }
    }

    public class ConsumptionSummaryDto
    {
        public decimal TotalConsumption { get; set; }
        public decimal AverageMonthlyConsumption { get; set; }
        public decimal HighestConsumption { get; set; }
        public decimal LowestConsumption { get; set; }
        public int TotalMonths { get; set; }
        public decimal CurrentMonthConsumption { get; set; }
        public string ComparisonWithLastMonth { get; set; }  // "Higher by 20%" or "Lower by 10%"
    }
}