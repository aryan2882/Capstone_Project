namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendBillGeneratedNotificationAsync(int billId);
        Task SendDueDateReminderAsync(int billId);
        Task SendOverdueNotificationAsync(int billId);
        Task<int> ProcessPendingNotificationsAsync();
    }
}