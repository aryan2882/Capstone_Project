using UtilityBillingSystem.Application.DTOs.MeterReadings;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IMeterReadingService
    {
        Task<List<MeterReadingDto>> GetByBillingCycleAsync(int billingCycleId);
        Task<List<MeterReadingDto>> GetByConnectionAsync(int connectionId);
        Task<MeterReadingDto> GetByIdAsync(int id);
        Task<MeterReadingDto> CreateAsync(int recordedBy, CreateMeterReadingDto request);
    }
}