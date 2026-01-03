namespace UtilityBillingSystem.Application.DTOs.Tariffs
{
    public class TariffDto
    {
        public int TariffId { get; set; }
        public string PlanName { get; set; }
        public int UtilityTypeId { get; set; }
        public string UtilityTypeName { get; set; }
        public decimal FixedMonthlyCharge { get; set; }
        public decimal MinimumCharge { get; set; }
        public decimal TaxPercentage { get; set; }
        public bool IsSlabBased { get; set; }
        public decimal? FlatRate { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
        public bool IsActive { get; set; }
        public List<TariffSlabDto> TariffSlabs { get; set; }
    }
}