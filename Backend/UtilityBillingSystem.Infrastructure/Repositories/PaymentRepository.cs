using System.Numerics;
using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace UtilityBillingSystem.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Payment> GetByIdAsync(int paymentId)
        {
            return await _context.Payments
                .Include(p => p.Consumer)
                    .ThenInclude(c => c.User)
                .Include(p => p.Bill)
                    .ThenInclude(b => b.Connection)
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId);
        }

        public async Task<List<Payment>> GetAllAsync()
        {
            return await _context.Payments
                .Include(p => p.Consumer)
                    .ThenInclude(c => c.User)
                .Include(p => p.Bill)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task<List<Payment>> GetByConsumerIdAsync(int consumerId)
        {
            return await _context.Payments
                .Include(p => p.Bill)
                    .ThenInclude(b => b.Connection)
                .Where(p => p.ConsumerId == consumerId)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task<List<Payment>> GetByBillIdAsync(int billId)
        {
            return await _context.Payments
                .Where(p => p.BillId == billId)
                .OrderBy(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task<List<Payment>> GetByConnectionIdAsync(int connectionId)  // NEW
        {
            return await _context.Payments
                .Include(p => p.Consumer)
                    .ThenInclude(c => c.User)
                .Include(p => p.Bill)
                .Where(p => p.Bill.ConnectionId == connectionId)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task<Payment> AddAsync(Payment payment)
        {
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<string> GenerateReceiptNumberAsync()
        {
            var lastPayment = await _context.Payments
                .OrderByDescending(p => p.PaymentId)
                .FirstOrDefaultAsync();

            int nextNumber = lastPayment != null ? lastPayment.PaymentId + 1 : 1;
            return $"RCP-{DateTime.Now.Year}-{nextNumber:D6}";
        }
    }
}