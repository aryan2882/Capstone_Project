using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface ITariffRepository
    {
        Task<Tariff> GetByIdAsync(int tariffId);
        Task<Tariff> GetByIdWithSlabsAsync(int tariffId);
        Task<List<Tariff>> GetAllAsync();
        Task<List<Tariff>> GetByUtilityTypeAsync(int utilityTypeId);
        Task<List<Tariff>> GetActiveAsync();
        Task<Tariff> AddAsync(Tariff tariff);
        Task UpdateAsync(Tariff tariff);
        Task DeleteAsync(Tariff tariff);  // NEW
    }
}