using UtilityBillingSystem.Application.DTOs.Consumers;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IConsumerService
    {
        Task<List<ConsumerDto>> GetAllConsumersAsync();
        Task<ConsumerDto> GetConsumerByIdAsync(int consumerId);
        Task<ConsumerDto> GetConsumerByUserIdAsync(int userId);
        Task UpdateConsumerAsync(int consumerId, UpdateConsumerDto request);
        Task DeleteConsumerAsync(int consumerId);
        Task<ConsumptionDetailsDto> GetConsumptionDetailsAsync(int consumerId, int connectionId);  // NEW
    }
}