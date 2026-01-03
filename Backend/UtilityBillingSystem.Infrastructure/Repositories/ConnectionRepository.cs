using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class ConnectionRepository : IConnectionRepository
    {
        private readonly ApplicationDbContext _context;

        public ConnectionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Connection> GetByIdAsync(int connectionId)
        {
            return await _context.Connections
                .Include(c => c.Consumer)
                    .ThenInclude(consumer => consumer.User)
                .Include(c => c.UtilityType)
                .Include(c => c.Tariff)
                .FirstOrDefaultAsync(c => c.ConnectionId == connectionId);
        }

        public async Task<List<Connection>> GetAllAsync()
        {
            return await _context.Connections
                .Include(c => c.Consumer)
                    .ThenInclude(consumer => consumer.User)
                .Include(c => c.UtilityType)
                .Include(c => c.Tariff)
                .OrderBy(c => c.MeterNumber)
                .ToListAsync();
        }

        public async Task<List<Connection>> GetByConsumerIdAsync(int consumerId)
        {
            return await _context.Connections
                .Include(c => c.Consumer)
                    .ThenInclude(consumer => consumer.User)
                .Include(c => c.UtilityType)
                .Include(c => c.Tariff)
                .Where(c => c.ConsumerId == consumerId)
                .ToListAsync();
        }

        public async Task<Connection> AddAsync(Connection connection)
        {
            await _context.Connections.AddAsync(connection);
            await _context.SaveChangesAsync();
            return connection;
        }

        public async Task UpdateAsync(Connection connection)
        {
            _context.Connections.Update(connection);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> MeterNumberExistsAsync(string meterNumber)
        {
            return await _context.Connections.AnyAsync(c => c.MeterNumber == meterNumber);
        }
    }
}