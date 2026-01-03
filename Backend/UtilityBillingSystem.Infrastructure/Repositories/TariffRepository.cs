using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class TariffRepository : ITariffRepository
    {
        private readonly ApplicationDbContext _context;

        public TariffRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Tariff> GetByIdAsync(int tariffId)
        {
            return await _context.Tariffs
                .Include(t => t.UtilityType)
                .FirstOrDefaultAsync(t => t.TariffId == tariffId);
        }

        public async Task<Tariff> GetByIdWithSlabsAsync(int tariffId)
        {
            return await _context.Tariffs
                .Include(t => t.UtilityType)
                .Include(t => t.TariffSlabs.OrderBy(s => s.SlabNumber))
                .FirstOrDefaultAsync(t => t.TariffId == tariffId);
        }

        public async Task<List<Tariff>> GetAllAsync()
        {
            return await _context.Tariffs
                .Include(t => t.UtilityType)
                .OrderBy(t => t.PlanName)
                .ToListAsync();
        }

        public async Task<List<Tariff>> GetByUtilityTypeAsync(int utilityTypeId)
        {
            return await _context.Tariffs
                .Include(t => t.UtilityType)
                .Where(t => t.UtilityTypeId == utilityTypeId && t.IsActive)
                .OrderBy(t => t.PlanName)
                .ToListAsync();
        }

        public async Task<List<Tariff>> GetActiveAsync()
        {
            return await _context.Tariffs
                .Include(t => t.UtilityType)
                .Where(t => t.IsActive)
                .OrderBy(t => t.PlanName)
                .ToListAsync();
        }

        public async Task<Tariff> AddAsync(Tariff tariff)
        {
            await _context.Tariffs.AddAsync(tariff);
            await _context.SaveChangesAsync();
            return tariff;
        }

        public async Task UpdateAsync(Tariff tariff)
        {
            _context.Tariffs.Update(tariff);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Tariff tariff)  // NEW
        {
            _context.Tariffs.Remove(tariff);
            await _context.SaveChangesAsync();
        }
    }
}