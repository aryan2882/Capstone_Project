using System.ComponentModel.DataAnnotations;
using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Application.DTOs.Payments
{
    public class RecordPaymentDto
    {
        [Required]
        public int BillId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public PaymentMode PaymentMode { get; set; }

        public string? TransactionId { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        public string Remarks { get; set; }
    }
}