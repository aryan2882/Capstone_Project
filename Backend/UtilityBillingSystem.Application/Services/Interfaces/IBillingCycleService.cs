using UtilityBillingSystem.Application.DTOs.BillingCycles;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IBillingCycleService
    {
        Task<List<BillingCycleDto>> GetAllAsync();
        Task<BillingCycleDto> GetByIdAsync(int id);
        Task<BillingCycleDto> GetCurrentCycleAsync();
        Task<BillingCycleDto> CreateAsync(CreateBillingCycleDto request);
        Task CloseCycleAsync(int id);
    }
}