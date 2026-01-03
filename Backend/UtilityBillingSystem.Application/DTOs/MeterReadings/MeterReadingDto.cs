namespace UtilityBillingSystem.Application.DTOs.MeterReadings
{
    public class MeterReadingDto
    {
        public int MeterReadingId { get; set; }
        public int ConnectionId { get; set; }
        public string MeterNumber { get; set; }
        public string ConsumerName { get; set; }
        public int BillingCycleId { get; set; }
        public string CycleName { get; set; }
        public decimal PreviousReading { get; set; }
        public decimal CurrentReading { get; set; }
        public decimal Consumption { get; set; }
        public DateTime ReadingDate { get; set; }
        public string Remarks { get; set; }
        public bool IsBillGenerated { get; set; }
    }
}