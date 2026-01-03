using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Connections
{
    public class UpdateConnectionDto
    {
        [Required]
        public int TariffId { get; set; }

        [Required]
        [StringLength(50)]
        public string MeterNumber { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal ConnectionLoad { get; set; }
    }
}