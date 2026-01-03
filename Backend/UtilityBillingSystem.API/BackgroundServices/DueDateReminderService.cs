using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.API.BackgroundServices
{
    public class DueDateReminderService : BackgroundService
    {
        private readonly ILogger<DueDateReminderService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public DueDateReminderService(
            ILogger<DueDateReminderService> logger,
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Due Date Reminder Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                        // Find bills due in 3 days that are unpaid
                        var threeDaysFromNow = DateTime.Today.AddDays(3);
                        var billsDueSoon = await context.Bills
                            .Where(b => b.DueDate.Date == threeDaysFromNow &&
                                       b.Status != BillStatus.Paid &&
                                       b.OutstandingAmount > 0)
                            .ToListAsync(stoppingToken);

                        foreach (var bill in billsDueSoon)
                        {
                            await notificationService.SendDueDateReminderAsync(bill.BillId);
                        }

                        if (billsDueSoon.Any())
                        {
                            _logger.LogInformation($"Created {billsDueSoon.Count} due date reminders");
                        }

                        // Find overdue bills
                        var overdueBills = await context.Bills
                            .Where(b => b.DueDate.Date < DateTime.Today &&
                                       b.Status != BillStatus.Paid &&
                                       b.OutstandingAmount > 0)
                            .ToListAsync(stoppingToken);

                        foreach (var bill in overdueBills)
                        {
                            // Check if overdue notification already sent recently
                            var recentOverdueNotification = await context.Notifications
                                .Where(n => n.ConsumerId == bill.ConsumerId &&
                                           n.NotificationType == "Overdue" &&
                                           n.CreatedAt >= DateTime.UtcNow.AddDays(-7))
                                .AnyAsync(stoppingToken);

                            if (!recentOverdueNotification)
                            {
                                await notificationService.SendOverdueNotificationAsync(bill.BillId);
                            }
                        }

                        if (overdueBills.Any())
                        {
                            _logger.LogInformation($"Checked {overdueBills.Count} overdue bills");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error in Due Date Reminder Service: {ex.Message}");
                }

                // Run once per day at midnight
                var now = DateTime.Now;
                var tomorrow = now.Date.AddDays(1);
                var delay = tomorrow - now;

                _logger.LogInformation($"Next run in {delay.TotalHours:F1} hours");
                await Task.Delay(delay, stoppingToken);
            }

            _logger.LogInformation("Due Date Reminder Service stopped");
        }
    }
}