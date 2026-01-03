namespace UtilityBillingSystem.Application.DTOs.Bills
{
    public class BillDto
    {
        public int BillId { get; set; }
        public string BillNumber { get; set; }
        public int ConsumerId { get; set; }
        public string ConsumerName { get; set; }
        public string ConsumerCode { get; set; }
        public int ConnectionId { get; set; }
        public string MeterNumber { get; set; }
        public string UtilityTypeName { get; set; }
        public string CycleName { get; set; }

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

        public DateTime BillDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string Status { get; set; }
    }
}