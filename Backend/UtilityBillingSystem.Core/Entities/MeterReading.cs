namespace UtilityBillingSystem.Core.Entities
{
    public class MeterReading
    {
        public int MeterReadingId { get; set; }
        public int ConnectionId { get; set; }
        public int BillingCycleId { get; set; }
        public decimal PreviousReading { get; set; }
        public decimal CurrentReading { get; set; }
        public decimal Consumption { get; set; }
        public DateTime ReadingDate { get; set; }
        public string Remarks { get; set; }
        public int RecordedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsBillGenerated { get; set; }

        // Navigation
        public Connection Connection { get; set; }
        public BillingCycle BillingCycle { get; set; }
        public User RecordedByUser { get; set; }
    }
}