using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.BillingCycles
{
    public class CreateBillingCycleDto
    {
        [Required]
        [StringLength(50)]
        public string CycleName { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public DateTime MeterReadingDeadline { get; set; }

        [Required]
        public DateTime BillGenerationDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public DateTime PenaltyStartDate { get; set; }
    }
}