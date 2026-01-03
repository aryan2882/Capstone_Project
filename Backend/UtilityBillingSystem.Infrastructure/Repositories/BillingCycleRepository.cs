using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class BillingCycleRepository : IBillingCycleRepository
    {
        private readonly ApplicationDbContext _context;

        public BillingCycleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BillingCycle> GetByIdAsync(int billingCycleId)
        {
            return await _context.BillingCycles.FindAsync(billingCycleId);
        }

        public async Task<List<BillingCycle>> GetAllAsync()
        {
            return await _context.BillingCycles
                .OrderByDescending(b => b.StartDate)
                .ToListAsync();
        }

        public async Task<BillingCycle> GetCurrentCycleAsync()
        {
            var today = DateTime.Today;
            return await _context.BillingCycles
                .Where(b => b.StartDate <= today && b.EndDate >= today && !b.IsClosed)
                .FirstOrDefaultAsync();
        }

        public async Task<BillingCycle> AddAsync(BillingCycle billingCycle)
        {
            await _context.BillingCycles.AddAsync(billingCycle);
            await _context.SaveChangesAsync();
            return billingCycle;
        }

        public async Task UpdateAsync(BillingCycle billingCycle)
        {
            _context.BillingCycles.Update(billingCycle);
            await _context.SaveChangesAsync();
        }
    }
}