using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Core.Entities
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public int? ConsumerId { get; set; }
        public string NotificationType { get; set; }  // "BillGenerated", "DueDate", "Overdue"
        public string Subject { get; set; }
        public string Message { get; set; }
        public bool IsSent { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? SentAt { get; set; }

        // Navigation
        public Consumer Consumer { get; set; }
    }
}