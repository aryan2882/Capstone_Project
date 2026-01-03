using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class MeterReadingRepository : IMeterReadingRepository
    {
        private readonly ApplicationDbContext _context;

        public MeterReadingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MeterReading> GetByIdAsync(int meterReadingId)
        {
            return await _context.MeterReadings
                .Include(m => m.Connection)
                    .ThenInclude(c => c.Consumer)
                        .ThenInclude(consumer => consumer.User)  // FIX
                .Include(m => m.Connection.UtilityType)  // FIX
                .Include(m => m.BillingCycle)
                .Include(m => m.RecordedByUser)
                .FirstOrDefaultAsync(m => m.MeterReadingId == meterReadingId);
        }

        public async Task<List<MeterReading>> GetByConnectionIdAsync(int connectionId)
        {
            return await _context.MeterReadings
                .Include(m => m.Connection)
                    .ThenInclude(c => c.Consumer)
                        .ThenInclude(consumer => consumer.User)  // FIX
                .Include(m => m.BillingCycle)
                .Include(m => m.RecordedByUser)
                .Where(m => m.ConnectionId == connectionId)
                .OrderByDescending(m => m.ReadingDate)
                .ToListAsync();
        }

        public async Task<List<MeterReading>> GetByBillingCycleIdAsync(int billingCycleId)
        {
            return await _context.MeterReadings
                .Include(m => m.Connection)
                    .ThenInclude(c => c.Consumer)
                        .ThenInclude(consumer => consumer.User)  // FIX
                .Include(m => m.Connection.UtilityType)  // FIX
                .Include(m => m.BillingCycle)
                .Include(m => m.RecordedByUser)
                .Where(m => m.BillingCycleId == billingCycleId)
                .ToListAsync();
        }

        public async Task<MeterReading> GetLastReadingAsync(int connectionId)
        {
            return await _context.MeterReadings
                .Include(m => m.Connection)
                .Where(m => m.ConnectionId == connectionId)
                .OrderByDescending(m => m.ReadingDate)
                .FirstOrDefaultAsync();
        }

        public async Task<List<MeterReading>> GetPendingReadingsAsync(int billingCycleId)
        {
            var allConnections = await _context.Connections
                .Where(c => c.Status == Core.Enums.ConnectionStatus.Active)
                .Select(c => c.ConnectionId)
                .ToListAsync();

            var readConnections = await _context.MeterReadings
                .Where(m => m.BillingCycleId == billingCycleId)
                .Select(m => m.ConnectionId)
                .ToListAsync();

            var pendingConnectionIds = allConnections.Except(readConnections).ToList();

            return pendingConnectionIds.Select(id => new MeterReading
            {
                ConnectionId = id
            }).ToList();
        }

        public async Task<MeterReading> AddAsync(MeterReading meterReading)
        {
            await _context.MeterReadings.AddAsync(meterReading);
            await _context.SaveChangesAsync();
            return meterReading;
        }

        public async Task UpdateAsync(MeterReading meterReading)
        {
            _context.MeterReadings.Update(meterReading);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ReadingExistsAsync(int connectionId, int billingCycleId)
        {
            return await _context.MeterReadings
                .AnyAsync(m => m.ConnectionId == connectionId && m.BillingCycleId == billingCycleId);
        }
    }
}