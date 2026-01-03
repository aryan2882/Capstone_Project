using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Core.Entities
{
    public class Connection
    {
        public int ConnectionId { get; set; }
        public int ConsumerId { get; set; }
        public int UtilityTypeId { get; set; }
        public int TariffId { get; set; }
        public string MeterNumber { get; set; }
        public decimal ConnectionLoad { get; set; }
        public decimal InitialReading { get; set; }
        public DateTime? ActivationDate { get; set; }
        public ConnectionStatus Status { get; set; }
        public DateTime? DisconnectionDate { get; set; }
        public string? DisconnectionReason { get; set; }
        public DateTime? CreatedAt { get; set; }

        // Navigation
        public Consumer Consumer { get; set; }
        public UtilityType UtilityType { get; set; }
        public Tariff Tariff { get; set; }
        public ICollection<MeterReading> MeterReadings { get; set; }
        public ICollection<Bill> Bills { get; set; }
    }
}