using AutoMapper;
using UtilityBillingSystem.Application.DTOs.Bills;
using UtilityBillingSystem.Application.Helpers;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class BillingService : IBillingService
    {
        private readonly IBillRepository _billRepository;
        private readonly IMeterReadingRepository _meterReadingRepository;
        private readonly ITariffRepository _tariffRepository;
        private readonly IBillingCycleRepository _billingCycleRepository;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;

        public BillingService(
            IBillRepository billRepository,
            IMeterReadingRepository meterReadingRepository,
            ITariffRepository tariffRepository,
            IBillingCycleRepository billingCycleRepository,
            INotificationService notificationService,
            IMapper mapper)
        {
            _billRepository = billRepository;
            _meterReadingRepository = meterReadingRepository;
            _tariffRepository = tariffRepository;
            _billingCycleRepository = billingCycleRepository;
            _notificationService = notificationService;
            _mapper = mapper;
        }

        public async Task<List<BillDto>> GetAllAsync()
        {
            var bills = await _billRepository.GetAllAsync();
            return _mapper.Map<List<BillDto>>(bills);
        }

        public async Task<List<BillDto>> GetByConsumerAsync(int consumerId)
        {
            var bills = await _billRepository.GetByConsumerIdAsync(consumerId);
            return _mapper.Map<List<BillDto>>(bills);
        }

        public async Task<List<BillDto>> GetOutstandingBillsAsync()
        {
            var bills = await _billRepository.GetOutstandingBillsAsync();
            return _mapper.Map<List<BillDto>>(bills);
        }

        public async Task<BillDto> GetByIdAsync(int id)
        {
            var bill = await _billRepository.GetByIdAsync(id);
            if (bill == null)
                throw new KeyNotFoundException("Bill not found");

            return _mapper.Map<BillDto>(bill);
        }

        public async Task<BillDto> GenerateBillAsync(int generatedBy, GenerateBillDto request)
        {
            // Get meter reading
            var meterReading = await _meterReadingRepository.GetByIdAsync(request.MeterReadingId);
            if (meterReading == null)
                throw new KeyNotFoundException("Meter Reading not found");

            if (meterReading.IsBillGenerated)
                throw new InvalidOperationException("Bill already generated for this reading");

            // Get tariff with slabs
            var tariff = await _tariffRepository.GetByIdWithSlabsAsync(meterReading.Connection.TariffId);
            if (tariff == null)
                throw new KeyNotFoundException("Tariff not found");

            // Get billing cycle
            var billingCycle = await _billingCycleRepository.GetByIdAsync(meterReading.BillingCycleId);
            if (billingCycle == null)
                throw new KeyNotFoundException("Billing Cycle not found");

            // Get previous outstanding
            var lastBill = await _billRepository.GetLastBillAsync(meterReading.Connection.ConsumerId);
            decimal previousOutstanding = lastBill?.OutstandingAmount ?? 0;

            // Calculate bill
            decimal energyCharge = BillCalculator.CalculateEnergyCharge(meterReading.Consumption, tariff);
            decimal fixedCharge = tariff.FixedMonthlyCharge;
            decimal subtotal = energyCharge + fixedCharge + previousOutstanding;
            decimal taxAmount = BillCalculator.CalculateTax(subtotal, tariff.TaxPercentage);
            decimal penaltyAmount = previousOutstanding > 0
                ? BillCalculator.CalculatePenalty(previousOutstanding, lastBill.DueDate)
                : 0;
            decimal totalAmount = subtotal + taxAmount + penaltyAmount;

            // Apply minimum charge
            if (totalAmount < tariff.MinimumCharge)
                totalAmount = tariff.MinimumCharge;

            var bill = new Bill
            {
                BillNumber = await _billRepository.GenerateBillNumberAsync(),
                ConsumerId = meterReading.Connection.ConsumerId,
                ConnectionId = meterReading.ConnectionId,
                BillingCycleId = meterReading.BillingCycleId,
                MeterReadingId = meterReading.MeterReadingId,
                Consumption = meterReading.Consumption,
                EnergyCharge = energyCharge,
                FixedCharge = fixedCharge,
                PreviousOutstanding = previousOutstanding,
                Subtotal = subtotal,
                TaxAmount = taxAmount,
                PenaltyAmount = penaltyAmount,
                TotalAmount = totalAmount,
                PaidAmount = 0,
                OutstandingAmount = totalAmount,
                BillDate = billingCycle.BillGenerationDate,  // ⬅️ FIX: Use billing cycle date
                DueDate = billingCycle.DueDate,
                Status = BillStatus.Generated,
                GeneratedBy = generatedBy,
                CreatedAt = DateTime.UtcNow  // This is the actual system timestamp
            };
            bill = await _billRepository.AddAsync(bill);


            // Update meter reading
            meterReading.IsBillGenerated = true;
            await _meterReadingRepository.UpdateAsync(meterReading);
            await _notificationService.SendBillGeneratedNotificationAsync(bill.BillId);

            return await GetByIdAsync(bill.BillId);
        }

        public async Task<List<BillDto>> GenerateBulkBillsAsync(int generatedBy, int billingCycleId)
        {
            var readings = await _meterReadingRepository.GetByBillingCycleIdAsync(billingCycleId);
            var unbilledReadings = readings.Where(r => !r.IsBillGenerated).ToList();

            var generatedBills = new List<BillDto>();

            foreach (var reading in unbilledReadings)
            {
                try
                {
                    var bill = await GenerateBillAsync(generatedBy, new GenerateBillDto
                    {
                        MeterReadingId = reading.MeterReadingId
                    });
                    generatedBills.Add(bill);
                }
                catch (Exception ex)
                {
                    // Log error and continue
                    Console.WriteLine($"Error generating bill for reading {reading.MeterReadingId}: {ex.Message}");
                }
            }

            return generatedBills;
        }
    }
}