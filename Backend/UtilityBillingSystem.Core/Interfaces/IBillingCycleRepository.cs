using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface IBillingCycleRepository
    {
        Task<BillingCycle> GetByIdAsync(int billingCycleId);
        Task<List<BillingCycle>> GetAllAsync();
        Task<BillingCycle> GetCurrentCycleAsync();
        Task<BillingCycle> AddAsync(BillingCycle billingCycle);
        Task UpdateAsync(BillingCycle billingCycle);
    }
}