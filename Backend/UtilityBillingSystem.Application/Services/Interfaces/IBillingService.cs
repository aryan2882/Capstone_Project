using UtilityBillingSystem.Application.DTOs.Bills;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IBillingService
    {
        Task<List<BillDto>> GetAllAsync();
        Task<List<BillDto>> GetByConsumerAsync(int consumerId);
        Task<List<BillDto>> GetOutstandingBillsAsync();
        Task<BillDto> GetByIdAsync(int id);
        Task<BillDto> GenerateBillAsync(int generatedBy, GenerateBillDto request);
        Task<List<BillDto>> GenerateBulkBillsAsync(int generatedBy, int billingCycleId);
    }
}