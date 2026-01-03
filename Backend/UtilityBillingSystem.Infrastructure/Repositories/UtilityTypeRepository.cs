using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class UtilityTypeRepository : IUtilityTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public UtilityTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UtilityType> GetByIdAsync(int utilityTypeId)
        {
            return await _context.UtilityTypes.FindAsync(utilityTypeId);
        }

        public async Task<List<UtilityType>> GetAllAsync()
        {
            return await _context.UtilityTypes
                .OrderBy(u => u.Name)
                .ToListAsync();
        }

        public async Task<List<UtilityType>> GetActiveAsync()
        {
            return await _context.UtilityTypes
                .Where(u => u.IsActive)
                .OrderBy(u => u.Name)
                .ToListAsync();
        }

        public async Task<UtilityType> AddAsync(UtilityType utilityType)
        {
            await _context.UtilityTypes.AddAsync(utilityType);
            await _context.SaveChangesAsync();
            return utilityType;
        }

        public async Task UpdateAsync(UtilityType utilityType)
        {
            _context.UtilityTypes.Update(utilityType);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(UtilityType utilityType)  // NEW
        {
            _context.UtilityTypes.Remove(utilityType);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> NameExistsAsync(string name)
        {
            return await _context.UtilityTypes.AnyAsync(u => u.Name.ToLower() == name.ToLower());
        }
    }
}