using UtilityBillingSystem.Application.DTOs.UtilityTypes;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IUtilityTypeService
    {
        Task<List<UtilityTypeDto>> GetAllAsync();
        Task<List<UtilityTypeDto>> GetActiveAsync();
        Task<UtilityTypeDto> GetByIdAsync(int id);
        Task<UtilityTypeDto> CreateAsync(CreateUtilityTypeDto request);
        Task UpdateAsync(int id, UpdateUtilityTypeDto request);
        Task DeactivateAsync(int id);
        Task DeleteAsync(int id);  // NEW
    }
}