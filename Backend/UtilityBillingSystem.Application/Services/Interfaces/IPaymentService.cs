using UtilityBillingSystem.Application.DTOs.Payments;

namespace UtilityBillingSystem.Application.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<List<PaymentDto>> GetAllAsync();
        Task<List<PaymentDto>> GetByConsumerAsync(int consumerId);
        Task<List<PaymentDto>> GetByConnectionAsync(int connectionId);  // NEW
        Task<PaymentDto> GetByIdAsync(int id);
        Task<PaymentDto> RecordPaymentAsync(int recordedBy, RecordPaymentDto request);
    }
}