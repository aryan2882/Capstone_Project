using UtilityBillingSystem.Application.DTOs.Connections;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IConnectionService
    {
        Task<List<ConnectionDto>> GetAllAsync();
        Task<List<ConnectionDto>> GetByConsumerIdAsync(int consumerId);
        Task<ConnectionDto> GetByIdAsync(int id);
        Task<ConnectionDto> CreateAsync(CreateConnectionDto request);
        Task UpdateAsync(int id, UpdateConnectionDto request);  // NEW
        Task DisconnectAsync(int id, string reason);
    }
}