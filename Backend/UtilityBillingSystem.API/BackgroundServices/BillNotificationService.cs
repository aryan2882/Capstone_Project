using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.BackgroundServices
{
    public class BillNotificationService : BackgroundService
    {
        private readonly ILogger<BillNotificationService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public BillNotificationService(
            ILogger<BillNotificationService> logger,
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Bill Notification Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                        var sentCount = await notificationService.ProcessPendingNotificationsAsync();

                        if (sentCount > 0)
                        {
                            _logger.LogInformation($"Processed {sentCount} notifications");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error in Bill Notification Service: {ex.Message}");
                }

                // Run every 5 minutes
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }

            _logger.LogInformation("Bill Notification Service stopped");
        }
    }
}