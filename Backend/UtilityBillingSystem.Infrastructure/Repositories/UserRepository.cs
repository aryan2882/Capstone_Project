using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Consumer)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Consumer)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users
                .Include(u => u.Consumer)
                .OrderBy(u => u.FirstName)
                .ToListAsync();
        }

        public async Task<List<User>> GetApprovedStaffUsersAsync()
        {
            return await _context.Users
                .Where(u => u.IsApproved &&
                           (u.Role == UserRole.Admin ||
                            u.Role == UserRole.BillingOfficer ||
                            u.Role == UserRole.AccountOfficer))
                .OrderBy(u => u.FirstName)
                .ToListAsync();
        }

        public async Task<List<User>> GetPendingUsersAsync()
        {
            return await _context.Users
                .Where(u => !u.IsApproved && string.IsNullOrEmpty(u.RejectionReason))
                .OrderBy(u => u.CreatedAt)
                .ToListAsync();
        }

        public async Task<User> AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
    }
}