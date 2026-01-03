using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface IConsumerRepository
    {
        Task<Consumer> GetByIdAsync(int consumerId);
        Task<Consumer> GetByUserIdAsync(int userId);
        Task<List<Consumer>> GetAllAsync();
        Task<Consumer> AddAsync(Consumer consumer);
        Task UpdateAsync(Consumer consumer);
        Task DeleteAsync(Consumer consumer);  // NEW
        Task<string> GenerateConsumerCodeAsync();
    }
}