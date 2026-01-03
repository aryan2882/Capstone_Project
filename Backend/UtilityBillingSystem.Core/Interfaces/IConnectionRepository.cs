using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface IConnectionRepository
    {
        Task<Connection> GetByIdAsync(int connectionId);
        Task<List<Connection>> GetByConsumerIdAsync(int consumerId);
        Task<List<Connection>> GetAllAsync();
        Task<Connection> AddAsync(Connection connection);
        Task UpdateAsync(Connection connection);
        Task<bool> MeterNumberExistsAsync(string meterNumber);
    }
}