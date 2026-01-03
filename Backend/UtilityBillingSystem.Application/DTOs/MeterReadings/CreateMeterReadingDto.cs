using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.MeterReadings
{
    public class CreateMeterReadingDto
    {
        [Required]
        public int ConnectionId { get; set; }

        [Required]
        public int BillingCycleId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal CurrentReading { get; set; }

        [Required]
        public DateTime ReadingDate { get; set; }

        public string Remarks { get; set; }
    }
}