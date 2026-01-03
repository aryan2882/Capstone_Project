using AutoMapper;
using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Application.DTOs.Consumers;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class ConsumerService : IConsumerService
    {
        private readonly IConsumerRepository _consumerRepository;
        private readonly IUserRepository _userRepository;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ConsumerService(
            IConsumerRepository consumerRepository,
            IUserRepository userRepository,
            ApplicationDbContext context,
            IMapper mapper)
        {
            _consumerRepository = consumerRepository;
            _userRepository = userRepository;
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ConsumerDto>> GetAllConsumersAsync()
        {
            var consumers = await _consumerRepository.GetAllAsync();
            return _mapper.Map<List<ConsumerDto>>(consumers);
        }

        public async Task<ConsumerDto> GetConsumerByIdAsync(int consumerId)
        {
            var consumer = await _consumerRepository.GetByIdAsync(consumerId);
            if (consumer == null)
                throw new KeyNotFoundException("Consumer not found");

            return _mapper.Map<ConsumerDto>(consumer);
        }

        public async Task<ConsumerDto> GetConsumerByUserIdAsync(int userId)
        {
            var consumer = await _consumerRepository.GetByUserIdAsync(userId);
            if (consumer == null)
                throw new KeyNotFoundException("Consumer not found");

            return _mapper.Map<ConsumerDto>(consumer);
        }

        public async Task UpdateConsumerAsync(int consumerId, UpdateConsumerDto request)
        {
            var consumer = await _consumerRepository.GetByIdAsync(consumerId);
            if (consumer == null)
                throw new KeyNotFoundException("Consumer not found");

            consumer.FatherName = request.FatherName;
            consumer.Address = request.Address;
            consumer.City = request.City;
            consumer.State = request.State;
            consumer.PinCode = request.PinCode;
            consumer.IdProofType = request.IdProofType;
            consumer.IdProofNumber = request.IdProofNumber;

            await _consumerRepository.UpdateAsync(consumer);
        }

        public async Task DeleteConsumerAsync(int consumerId)
        {
            var consumer = await _consumerRepository.GetByIdAsync(consumerId);
            if (consumer == null)
                throw new KeyNotFoundException("Consumer not found");

            var user = await _userRepository.GetByIdAsync(consumer.UserId);
            if (user != null)
            {
                user.IsActive = false;
                await _userRepository.UpdateAsync(user);
            }

            await _consumerRepository.DeleteAsync(consumer);
        }

        public async Task<ConsumptionDetailsDto> GetConsumptionDetailsAsync(int consumerId, int connectionId)  // NEW
        {
            // Verify consumer owns this connection
            var connection = await _context.Connections
                .Include(c => c.UtilityType)
                .FirstOrDefaultAsync(c => c.ConnectionId == connectionId && c.ConsumerId == consumerId);

            if (connection == null)
                throw new KeyNotFoundException("Connection not found or does not belong to this consumer");

            // Get meter readings with bills
            var readings = await _context.MeterReadings
                .Include(m => m.BillingCycle)
                .Where(m => m.ConnectionId == connectionId)
                .OrderByDescending(m => m.ReadingDate)
                .Take(12)  // Last 12 months
                .ToListAsync();

            if (!readings.Any())
            {
                return new ConsumptionDetailsDto
                {
                    ConnectionId = connectionId,
                    MeterNumber = connection.MeterNumber,
                    UtilityTypeName = connection.UtilityType.Name,
                    MonthlyConsumption = new List<MonthlyConsumptionDto>(),
                    Summary = new ConsumptionSummaryDto
                    {
                        TotalConsumption = 0,
                        AverageMonthlyConsumption = 0,
                        HighestConsumption = 0,
                        LowestConsumption = 0,
                        TotalMonths = 0,
                        CurrentMonthConsumption = 0,
                        ComparisonWithLastMonth = "No data available"
                    }
                };
            }

            // Get bills for these readings
            var bills = await _context.Bills
                .Where(b => b.ConnectionId == connectionId)
                .ToDictionaryAsync(b => b.MeterReadingId, b => b);

            var monthlyData = readings.Select(r => new MonthlyConsumptionDto
            {
                Month = r.BillingCycle.CycleName,
                ReadingDate = r.ReadingDate,
                PreviousReading = r.PreviousReading,
                CurrentReading = r.CurrentReading,
                Consumption = r.Consumption,
                BillAmount = bills.ContainsKey(r.MeterReadingId) ? bills[r.MeterReadingId].TotalAmount : 0,
                BillStatus = bills.ContainsKey(r.MeterReadingId) ? bills[r.MeterReadingId].Status.ToString() : "Not Generated"
            }).ToList();

            var consumptions = readings.Select(r => r.Consumption).ToList();
            var currentMonthConsumption = consumptions.FirstOrDefault();
            var lastMonthConsumption = consumptions.Skip(1).FirstOrDefault();

            string comparison = "No previous data";
            if (lastMonthConsumption > 0)
            {
                var diff = currentMonthConsumption - lastMonthConsumption;
                var percentChange = (diff / lastMonthConsumption) * 100;

                if (percentChange > 0)
                    comparison = $"Higher by {percentChange:F1}% compared to last month";
                else if (percentChange < 0)
                    comparison = $"Lower by {Math.Abs(percentChange):F1}% compared to last month";
                else
                    comparison = "Same as last month";
            }

            return new ConsumptionDetailsDto
            {
                ConnectionId = connectionId,
                MeterNumber = connection.MeterNumber,
                UtilityTypeName = connection.UtilityType.Name,
                MonthlyConsumption = monthlyData,
                Summary = new ConsumptionSummaryDto
                {
                    TotalConsumption = consumptions.Sum(),
                    AverageMonthlyConsumption = consumptions.Average(),
                    HighestConsumption = consumptions.Max(),
                    LowestConsumption = consumptions.Min(),
                    TotalMonths = consumptions.Count,
                    CurrentMonthConsumption = currentMonthConsumption,
                    ComparisonWithLastMonth = comparison
                }
            };
        }
    }
}