using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class BillRepository : IBillRepository
    {
        private readonly ApplicationDbContext _context;

        public BillRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Bill> GetByIdAsync(int billId)
        {
            return await _context.Bills
                .Include(b => b.Consumer)
                    .ThenInclude(c => c.User)  // FIX
                .Include(b => b.Connection)
                    .ThenInclude(c => c.UtilityType)
                .Include(b => b.Connection)
                    .ThenInclude(c => c.Consumer)
                        .ThenInclude(consumer => consumer.User)  // FIX
                .Include(b => b.BillingCycle)
                .Include(b => b.MeterReading)
                .Include(b => b.GeneratedByUser)
                .FirstOrDefaultAsync(b => b.BillId == billId);
        }

        public async Task<List<Bill>> GetAllAsync()
        {
            return await _context.Bills
                .Include(b => b.Consumer)
                    .ThenInclude(c => c.User)  // FIX
                .Include(b => b.Connection)
                    .ThenInclude(c => c.UtilityType)
                .Include(b => b.BillingCycle)
                .OrderByDescending(b => b.BillDate)
                .ToListAsync();
        }

        public async Task<List<Bill>> GetByConsumerIdAsync(int consumerId)
        {
            return await _context.Bills
                .Include(b => b.Consumer)
                    .ThenInclude(c => c.User)  // FIX
                .Include(b => b.Connection)
                    .ThenInclude(c => c.UtilityType)
                .Include(b => b.BillingCycle)
                .Where(b => b.ConsumerId == consumerId)
                .OrderByDescending(b => b.BillDate)
                .ToListAsync();
        }

        public async Task<List<Bill>> GetByStatusAsync(BillStatus status)
        {
            return await _context.Bills
                .Include(b => b.Consumer)
                    .ThenInclude(c => c.User)  // FIX
                .Include(b => b.Connection)
                    .ThenInclude(c => c.UtilityType)
                .Where(b => b.Status == status)
                .ToListAsync();
        }

        public async Task<List<Bill>> GetOutstandingBillsAsync()
        {
            return await _context.Bills
                .Include(b => b.Consumer)
                    .ThenInclude(c => c.User)  // FIX
                .Include(b => b.Connection)
                    .ThenInclude(c => c.UtilityType)
                .Where(b => b.OutstandingAmount > 0 && b.Status != BillStatus.Paid)
                .OrderBy(b => b.DueDate)
                .ToListAsync();
        }

        public async Task<Bill> GetByMeterReadingIdAsync(int meterReadingId)
        {
            return await _context.Bills
                .FirstOrDefaultAsync(b => b.MeterReadingId == meterReadingId);
        }

        public async Task<Bill> GetLastBillAsync(int consumerId)
        {
            return await _context.Bills
                .Where(b => b.ConsumerId == consumerId)
                .OrderByDescending(b => b.BillDate)
                .FirstOrDefaultAsync();
        }

        public async Task<Bill> AddAsync(Bill bill)
        {
            await _context.Bills.AddAsync(bill);
            await _context.SaveChangesAsync();
            return bill;
        }

        public async Task UpdateAsync(Bill bill)
        {
            _context.Bills.Update(bill);
            await _context.SaveChangesAsync();
        }

        public async Task<string> GenerateBillNumberAsync()
        {
            var lastBill = await _context.Bills
                .OrderByDescending(b => b.BillId)
                .FirstOrDefaultAsync();

            int nextNumber = lastBill != null ? lastBill.BillId + 1 : 1;
            return $"BILL-{DateTime.Now.Year}-{nextNumber:D6}";
        }
    }
}