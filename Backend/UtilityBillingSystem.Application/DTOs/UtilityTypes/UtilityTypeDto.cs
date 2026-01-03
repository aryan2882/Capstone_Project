namespace UtilityBillingSystem.Application.DTOs.UtilityTypes
{
    public class UtilityTypeDto
    {
        public int UtilityTypeId { get; set; }
        public string Name { get; set; }
        public string UnitOfMeasurement { get; set; }
        public string Description { get; set; }
        public decimal BaseRate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}