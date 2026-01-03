using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Users
{
    public class RejectUserDto
    {
        [Required]
        public string RejectionReason { get; set; }
    }
}