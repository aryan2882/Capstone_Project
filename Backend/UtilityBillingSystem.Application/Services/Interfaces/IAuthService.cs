using UtilityBillingSystem.Application.DTOs.Auth;
using UtilityBillingSystem.Application.DTOs.Users;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
        Task<UserDto> RegisterAsync(UserRegisterDto request);  // Changed
    }
}