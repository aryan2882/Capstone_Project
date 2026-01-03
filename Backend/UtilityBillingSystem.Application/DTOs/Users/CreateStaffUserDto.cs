using System.ComponentModel.DataAnnotations;
using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Application.DTOs.Users
{
    public class CreateStaffUserDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string Phone { get; set; }

        [Required]
        public UserRole Role { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }
}