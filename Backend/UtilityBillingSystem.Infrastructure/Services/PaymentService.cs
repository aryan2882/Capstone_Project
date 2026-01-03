using AutoMapper;
using UtilityBillingSystem.Application.DTOs.Payments;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IBillRepository _billRepository;
        private readonly IMapper _mapper;

        public PaymentService(
            IPaymentRepository paymentRepository,
            IBillRepository billRepository,
            IMapper mapper)
        {
            _paymentRepository = paymentRepository;
            _billRepository = billRepository;
            _mapper = mapper;
        }

        public async Task<List<PaymentDto>> GetAllAsync()
        {
            var payments = await _paymentRepository.GetAllAsync();
            return _mapper.Map<List<PaymentDto>>(payments);
        }

        public async Task<List<PaymentDto>> GetByConsumerAsync(int consumerId)
        {
            var payments = await _paymentRepository.GetByConsumerIdAsync(consumerId);
            return _mapper.Map<List<PaymentDto>>(payments);
        }

        public async Task<List<PaymentDto>> GetByConnectionAsync(int connectionId)  // NEW
        {
            var payments = await _paymentRepository.GetByConnectionIdAsync(connectionId);
            return _mapper.Map<List<PaymentDto>>(payments);
        }

        public async Task<PaymentDto> GetByIdAsync(int id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null)
                throw new KeyNotFoundException("Payment not found");

            return _mapper.Map<PaymentDto>(payment);
        }

        public async Task<PaymentDto> RecordPaymentAsync(int recordedBy, RecordPaymentDto request)
        {
            var bill = await _billRepository.GetByIdAsync(request.BillId);
            if (bill == null)
                throw new KeyNotFoundException("Bill not found");

            if (request.Amount > bill.OutstandingAmount)
                throw new InvalidOperationException("Payment amount exceeds outstanding amount");

            var payment = new Payment
            {
                ReceiptNumber = await _paymentRepository.GenerateReceiptNumberAsync(),
                ConsumerId = bill.ConsumerId,
                BillId = request.BillId,
                Amount = request.Amount,
                PaymentMode = request.PaymentMode,
                TransactionId = request.TransactionId,
                PaymentDate = request.PaymentDate,
                Remarks = request.Remarks,
                RecordedBy = recordedBy,
                CreatedAt = DateTime.UtcNow
            };

            payment = await _paymentRepository.AddAsync(payment);

            // Update bill
            bill.PaidAmount += request.Amount;
            bill.OutstandingAmount -= request.Amount;

            if (bill.OutstandingAmount == 0)
            {
                bill.Status = BillStatus.Paid;
                bill.PaymentDate = request.PaymentDate;
            }
            else
            {
                bill.Status = BillStatus.Partial;
            }

            await _billRepository.UpdateAsync(bill);

            return await GetByIdAsync(payment.PaymentId);
        }
    }
}