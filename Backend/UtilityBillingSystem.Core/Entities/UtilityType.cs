namespace UtilityBillingSystem.Core.Entities
{
    public class UtilityType
    {
        public int UtilityTypeId { get; set; }
        public string Name { get; set; }  // Electricity, Water, Gas
        public string UnitOfMeasurement { get; set; }  // kWh, Liters, Cubic Meters
        public string Description { get; set; }
        public decimal BaseRate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation
        public ICollection<Tariff> Tariffs { get; set; }
        public ICollection<Connection> Connections { get; set; }
    }
}