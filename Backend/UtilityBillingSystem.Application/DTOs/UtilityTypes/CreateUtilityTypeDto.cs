using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.UtilityTypes
{
    public class CreateUtilityTypeDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string UnitOfMeasurement { get; set; }

        [StringLength(200)]
        public string Description { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal BaseRate { get; set; }
    }
}