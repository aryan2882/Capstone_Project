using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Tariffs
{
    public class UpdateTariffDto
    {
        [Required]
        [StringLength(100)]
        public string PlanName { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal FixedMonthlyCharge { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal MinimumCharge { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal TaxPercentage { get; set; }

        [Required]
        public bool IsSlabBased { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? FlatRate { get; set; }

        public DateTime? EffectiveTo { get; set; }

        public bool IsActive { get; set; }

        public List<TariffSlabDto> TariffSlabs { get; set; }
    }
}