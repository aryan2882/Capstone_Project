using System.ComponentModel.DataAnnotations;

namespace UtilityBillingSystem.Application.DTOs.Consumers
{
    public class UpdateConsumerDto
    {
        [Required]
        public string FatherName { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        public string PinCode { get; set; }

        public string IdProofType { get; set; }
        public string IdProofNumber { get; set; }
    }
}