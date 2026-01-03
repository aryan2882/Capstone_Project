using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Connections
{
    public class CreateConnectionDto
    {
        [Required]
        public int ConsumerId { get; set; }

        [Required]
        public int UtilityTypeId { get; set; }

        [Required]
        public int TariffId { get; set; }

        [Required]
        [StringLength(50)]
        public string MeterNumber { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal ConnectionLoad { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal InitialReading { get; set; }

        [Required]
        public DateTime ActivationDate { get; set; }
    }
}