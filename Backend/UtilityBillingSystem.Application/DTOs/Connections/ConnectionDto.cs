namespace UtilityBillingSystem.Application.DTOs.Connections
{
    public class ConnectionDto
    {
        public int ConnectionId { get; set; }
        public int ConsumerId { get; set; }
        public string ConsumerName { get; set; }
        public string ConsumerCode { get; set; }
        public int UtilityTypeId { get; set; }
        public string UtilityTypeName { get; set; }
        public int TariffId { get; set; }
        public string TariffName { get; set; }
        public string MeterNumber { get; set; }
        public decimal ConnectionLoad { get; set; }
        public decimal InitialReading { get; set; }
        public DateTime ActivationDate { get; set; }
        public string Status { get; set; }
        public DateTime? DisconnectionDate { get; set; }
        public string DisconnectionReason { get; set; }
    }
}