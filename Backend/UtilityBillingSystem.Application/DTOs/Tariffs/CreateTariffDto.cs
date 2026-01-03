using System.Buffers.Text;
using System.ComponentModel.DataAnnotations;
using UtilityBillingSystem.Core.Entities;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace UtilityBillingSystem.Application.DTOs.Tariffs
{
    public class CreateTariffDto
    {
        [Required]
        [StringLength(100)]
        public string PlanName { get; set; }

        [Required]
        public int UtilityTypeId { get; set; }

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
        public decimal? FlatRate { get; set; }  // Required if IsSlabBased = false

        [Required]
        public DateTime EffectiveFrom { get; set; }

        public DateTime? EffectiveTo { get; set; }

        public List<TariffSlabDto> TariffSlabs { get; set; }  // REMOVE [Required] - validate in service
    }
}
