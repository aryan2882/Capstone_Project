using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface IUtilityTypeRepository
    {
        Task<UtilityType> GetByIdAsync(int utilityTypeId);
        Task<List<UtilityType>> GetAllAsync();
        Task<List<UtilityType>> GetActiveAsync();
        Task<UtilityType> AddAsync(UtilityType utilityType);
        Task UpdateAsync(UtilityType utilityType);
        Task DeleteAsync(UtilityType utilityType);  // NEW
        Task<bool> NameExistsAsync(string name);
    }
}