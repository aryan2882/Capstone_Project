using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Core.Entities
{
    public class Bill
    {
        public int BillId { get; set; }
        public string BillNumber { get; set; }
        public int ConsumerId { get; set; }
        public int ConnectionId { get; set; }
        public int BillingCycleId { get; set; }
        public int MeterReadingId { get; set; }

        // Amounts
        public decimal Consumption { get; set; }
        public decimal EnergyCharge { get; set; }
        public decimal FixedCharge { get; set; }
        public decimal PreviousOutstanding { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal PenaltyAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal OutstandingAmount { get; set; }

        // Dates
        public DateTime BillDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaymentDate { get; set; }

        // Status
        public BillStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public int GeneratedBy { get; set; }

        // Navigation
        public Consumer Consumer { get; set; }
        public Connection Connection { get; set; }
        public BillingCycle BillingCycle { get; set; }
        public MeterReading MeterReading { get; set; }
        public User GeneratedByUser { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}