namespace UtilityBillingSystem.Core.Entities
{
    public class TariffSlab
    {
        public int TariffSlabId { get; set; }
        public int TariffId { get; set; }
        public int SlabNumber { get; set; }
        public decimal FromUnit { get; set; }
        public decimal? ToUnit { get; set; }  // Null means unlimited
        public decimal RatePerUnit { get; set; }

        // Navigation
        public Tariff Tariff { get; set; }
    }
}