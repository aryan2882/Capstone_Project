using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface IBillRepository
    {
        Task<Bill> GetByIdAsync(int billId);
        Task<List<Bill>> GetAllAsync();
        Task<List<Bill>> GetByConsumerIdAsync(int consumerId);
        Task<List<Bill>> GetByStatusAsync(BillStatus status);
        Task<List<Bill>> GetOutstandingBillsAsync();
        Task<Bill> GetByMeterReadingIdAsync(int meterReadingId);
        Task<Bill> GetLastBillAsync(int consumerId);
        Task<Bill> AddAsync(Bill bill);
        Task UpdateAsync(Bill bill);
        Task<string> GenerateBillNumberAsync();
    }
}