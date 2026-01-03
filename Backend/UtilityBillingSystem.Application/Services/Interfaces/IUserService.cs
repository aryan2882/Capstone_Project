using UtilityBillingSystem.Application.DTOs.Users;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllApprovedStaffUsersAsync();
        Task<List<PendingUserDto>> GetPendingUsersAsync();  // NEW
        Task<UserDto> GetUserByIdAsync(int userId);
        Task<UserDto> AssignRoleAndApproveAsync(int userId, int approvedBy, AssignRoleDto request);  // NEW
        Task RejectUserAsync(int userId, RejectUserDto request);  // NEW
        Task UpdateUserAsync(int userId, UpdateUserDto request);
        Task DeactivateUserAsync(int userId);
    }
}