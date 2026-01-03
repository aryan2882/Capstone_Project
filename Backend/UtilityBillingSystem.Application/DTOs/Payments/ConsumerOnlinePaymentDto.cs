using System.ComponentModel.DataAnnotations;
using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Application.DTOs.Payments
{
    public class ConsumerOnlinePaymentDto
    {
        [Required]
        public int BillId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public PaymentMode PaymentMode { get; set; }  // Must be Online (2)

        [Required]
        public string PaymentMethod { get; set; }  // "UPI", "Net Banking", "Credit Card", "Debit Card"
    }
}