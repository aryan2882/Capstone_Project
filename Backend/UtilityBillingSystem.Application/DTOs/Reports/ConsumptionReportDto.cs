namespace UtilityBillingSystem.Application.DTOs.Reports
{
    public class ConsumptionReportDto
    {
        public string UtilityType { get; set; }
        public decimal TotalConsumption { get; set; }
        public decimal AverageConsumption { get; set; }
        public int TotalConnections { get; set; }
        public decimal HighestConsumption { get; set; }
        public decimal LowestConsumption { get; set; }
    }
}