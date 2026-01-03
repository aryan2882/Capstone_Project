using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Core.Interfaces
{
    public interface IMeterReadingRepository
    {
        Task<MeterReading> GetByIdAsync(int meterReadingId);
        Task<List<MeterReading>> GetByConnectionIdAsync(int connectionId);
        Task<List<MeterReading>> GetByBillingCycleIdAsync(int billingCycleId);
        Task<MeterReading> GetLastReadingAsync(int connectionId);
        Task<List<MeterReading>> GetPendingReadingsAsync(int billingCycleId);
        Task<MeterReading> AddAsync(MeterReading meterReading);
        Task UpdateAsync(MeterReading meterReading);
        Task<bool> ReadingExistsAsync(int connectionId, int billingCycleId);
    }
}