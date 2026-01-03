using UtilityBillingSystem.Application.DTOs.Reports;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IReportService
    {
        Task<RevenueReportDto> GetRevenueReportAsync(DateTime startDate, DateTime endDate);
        Task<List<OutstandingReportDto>> GetOutstandingReportAsync();
        Task<List<ConsumptionReportDto>> GetConsumptionReportAsync(int billingCycleId);
        Task<List<CollectionReportDto>> GetCollectionReportAsync(DateTime startDate, DateTime endDate);
        Task<List<ConsumerSummaryReportDto>> GetConsumerSummaryReportAsync();
    }
}