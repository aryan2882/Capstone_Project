using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(int userId);
        Task<User> GetByEmailAsync(string email);
        Task<List<User>> GetAllAsync();
        Task<List<User>> GetApprovedStaffUsersAsync();  // Modified
        Task<List<User>> GetPendingUsersAsync();  // NEW
        Task<User> AddAsync(User user);
        Task UpdateAsync(User user);
        Task<bool> EmailExistsAsync(string email);
    }
}