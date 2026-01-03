using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}