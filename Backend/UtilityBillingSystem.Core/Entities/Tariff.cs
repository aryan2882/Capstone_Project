namespace UtilityBillingSystem.Core.Entities
{
    public class Tariff
    {
        public int TariffId { get; set; }
        public string PlanName { get; set; }  // Residential, Commercial, Industrial
        public int UtilityTypeId { get; set; }
        public decimal FixedMonthlyCharge { get; set; }
        public decimal MinimumCharge { get; set; }
        public decimal TaxPercentage { get; set; }
        public bool IsSlabBased { get; set; }
        public decimal? FlatRate { get; set; }  // If not slab-based
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation
        public UtilityType UtilityType { get; set; }
        public ICollection<TariffSlab> TariffSlabs { get; set; }
        public ICollection<Connection> Connections { get; set; }
    }
}