using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface IPaymentRepository
    {
        Task<Payment> GetByIdAsync(int paymentId);
        Task<List<Payment>> GetAllAsync();
        Task<List<Payment>> GetByConsumerIdAsync(int consumerId);
        Task<List<Payment>> GetByBillIdAsync(int billId);
        Task<List<Payment>> GetByConnectionIdAsync(int connectionId);  // NEW
        Task<Payment> AddAsync(Payment payment);
        Task<string> GenerateReceiptNumberAsync();
    }
}