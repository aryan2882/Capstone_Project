using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Users
{
    public class UpdateUserDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [Phone]
        public string Phone { get; set; }
    }
}