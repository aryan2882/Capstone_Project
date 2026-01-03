using System.ComponentModel.DataAnnotations;
using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Application.DTOs.Users
{
    public class AssignRoleDto
    {
        [Required]
        public UserRole Role { get; set; }
    }
}