using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Core.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FatherName { get; set; }  // NEW
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }  // NEW
        public string City { get; set; }  // NEW
        public string State { get; set; }  // NEW
        public string PinCode { get; set; }  // NEW
        public string IdProofType { get; set; }  // NEW
        public string IdProofNumber { get; set; }  // NEW
        public string PasswordHash { get; set; }
        public UserRole? Role { get; set; }
        public bool IsActive { get; set; }
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public int? ApprovedBy { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime? LastLoginAt { get; set; }

        // Navigation
        public User ApprovedByUser { get; set; }
        public Consumer Consumer { get; set; }
    }
}