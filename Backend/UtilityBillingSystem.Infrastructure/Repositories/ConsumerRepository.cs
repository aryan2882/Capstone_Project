using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class ConsumerRepository : IConsumerRepository
    {
        private readonly ApplicationDbContext _context;

        public ConsumerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Consumer> GetByIdAsync(int consumerId)
        {
            return await _context.Consumers
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.ConsumerId == consumerId);
        }

        public async Task<Consumer> GetByUserIdAsync(int userId)
        {
            return await _context.Consumers
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<List<Consumer>> GetAllAsync()
        {
            return await _context.Consumers
                .Include(c => c.User)
                .OrderBy(c => c.ConsumerCode)
                .ToListAsync();
        }

        public async Task<Consumer> AddAsync(Consumer consumer)
        {
            await _context.Consumers.AddAsync(consumer);
            await _context.SaveChangesAsync();
            return consumer;
        }

        public async Task UpdateAsync(Consumer consumer)
        {
            _context.Consumers.Update(consumer);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Consumer consumer)  // NEW
        {
            _context.Consumers.Remove(consumer);
            await _context.SaveChangesAsync();
        }

        public async Task<string> GenerateConsumerCodeAsync()
        {
            var lastConsumer = await _context.Consumers
                .OrderByDescending(c => c.ConsumerId)
                .FirstOrDefaultAsync();

            int nextNumber = lastConsumer != null ? lastConsumer.ConsumerId + 1 : 1;
            return $"CONS{nextNumber:D6}";
        }
    }
}