using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(ApplicationDbContext context, ILogger<NotificationService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SendBillGeneratedNotificationAsync(int billId)
        {
            var bill = await _context.Bills
                .Include(b => b.Consumer)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(b => b.BillId == billId);

            if (bill == null) return;

            var notification = new Notification
            {
                ConsumerId = bill.ConsumerId,
                NotificationType = "BillGenerated",
                Subject = $"New Bill Generated - {bill.BillNumber}",
                Message = $"Dear {bill.Consumer.User.FirstName},\n\n" +
                         $"Your bill for {bill.BillNumber} has been generated.\n" +
                         $"Amount: ₹{bill.TotalAmount:N2}\n" +
                         $"Due Date: {bill.DueDate:dd-MMM-yyyy}\n\n" +
                         $"Please pay before the due date to avoid penalties.",
                IsSent = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                    " Bill is Created | Consumer: {ConsumerName} | Bill: {BillNumber} | Amount: ₹{Amount:N2} | Notification ID: {NotificationId}",
                    $"{bill.Consumer.User.FirstName} {bill.Consumer.User.LastName}",
                    bill.BillNumber,
                    bill.TotalAmount,
                    notification.NotificationId
                );
        }

        public async Task SendDueDateReminderAsync(int billId)
        {
            var bill = await _context.Bills
                .Include(b => b.Consumer)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(b => b.BillId == billId);

            if (bill == null || bill.Status == Core.Enums.BillStatus.Paid) return;

            var notification = new Notification
            {
                ConsumerId = bill.ConsumerId,
                NotificationType = "DueDate",
                Subject = $"Payment Due Reminder - {bill.BillNumber}",
                Message = $"Dear {bill.Consumer.User.FirstName},\n\n" +
                         $"This is a reminder that your bill {bill.BillNumber} is due on {bill.DueDate:dd-MMM-yyyy}.\n" +
                         $"Outstanding Amount: ₹{bill.OutstandingAmount:N2}\n\n" +
                         $"Please make payment to avoid penalties.",
                IsSent = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Due date reminder created for Consumer {bill.ConsumerId}, Bill {billId}");
        }

        public async Task SendOverdueNotificationAsync(int billId)
        {
            var bill = await _context.Bills
                .Include(b => b.Consumer)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(b => b.BillId == billId);

            if (bill == null || bill.Status == Core.Enums.BillStatus.Paid) return;

            var notification = new Notification
            {
                ConsumerId = bill.ConsumerId,
                NotificationType = "Overdue",
                Subject = $"Overdue Payment Notice - {bill.BillNumber}",
                Message = $"Dear {bill.Consumer.User.FirstName},\n\n" +
                         $"Your bill {bill.BillNumber} is now OVERDUE.\n" +
                         $"Due Date: {bill.DueDate:dd-MMM-yyyy}\n" +
                         $"Outstanding Amount: ₹{bill.OutstandingAmount:N2}\n" +
                         $"Penalty: ₹{bill.PenaltyAmount:N2}\n\n" +
                         $"Please make immediate payment to avoid service disconnection.",
                IsSent = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Overdue notification created for Consumer {bill.ConsumerId}, Bill {billId}");
        }

        public async Task<int> ProcessPendingNotificationsAsync()
        {
            // Get unsent notifications
            var pendingNotifications = await _context.Notifications
                .Where(n => !n.IsSent)
                .Take(100) // Process in batches
                .ToListAsync();

            foreach (var notification in pendingNotifications)
            {
                try
                {
                    // In real system: Send email/SMS here
                    // For now, just log and mark as sent
                    _logger.LogInformation($"Sending notification: {notification.Subject} to Consumer {notification.ConsumerId}");

                    // Mock sending
                    await Task.Delay(100); // Simulate email/SMS sending

                    notification.IsSent = true;
                    notification.SentAt = DateTime.UtcNow;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Failed to send notification {notification.NotificationId}: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();
            return pendingNotifications.Count;
        }
    }
}