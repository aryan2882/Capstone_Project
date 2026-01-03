using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Bills
{
    public class GenerateBillDto
    {
        [Required]
        public int MeterReadingId { get; set; }
    }
}