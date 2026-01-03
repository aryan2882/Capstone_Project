using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Connections
{
    public class DisconnectConnectionDto
    {
        [Required]
        public string Reason { get; set; }
    }
}