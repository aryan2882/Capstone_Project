namespace UtilityBillingSystem.Application.DTOs.BillingCycles
{
    public class BillingCycleDto
    {
        public int BillingCycleId { get; set; }
        public string CycleName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime MeterReadingDeadline { get; set; }
        public DateTime BillGenerationDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime PenaltyStartDate { get; set; }
        public bool IsClosed { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}