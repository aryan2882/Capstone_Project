using UtilityBillingSystem.Application.DTOs.Tariffs;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface ITariffService
    {
        Task<List<TariffDto>> GetAllAsync();
        Task<List<TariffDto>> GetActiveAsync();
        Task<List<TariffDto>> GetByUtilityTypeAsync(int utilityTypeId);
        Task<TariffDto> GetByIdAsync(int id);
        Task<TariffDto> CreateAsync(CreateTariffDto request);
        Task UpdateAsync(int id, UpdateTariffDto request);  // UPDATED
        Task DeactivateAsync(int id);
        Task DeleteAsync(int id);  // NEW
    }
}