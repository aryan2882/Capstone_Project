using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Consumers
{
    public class RejectConsumerDto
    {
        [Required]
        public string RejectionReason { get; set; }
    }
}