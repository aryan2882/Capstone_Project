using AutoMapper;
using UtilityBillingSystem.Application.DTOs.MeterReadings;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class MeterReadingService : IMeterReadingService
    {
        private readonly IMeterReadingRepository _repository;
        private readonly IConnectionRepository _connectionRepository;
        private readonly IMapper _mapper;

        public MeterReadingService(
            IMeterReadingRepository repository,
            IConnectionRepository connectionRepository,
            IMapper mapper)
        {
            _repository = repository;
            _connectionRepository = connectionRepository;
            _mapper = mapper;
        }

        public async Task<List<MeterReadingDto>> GetByBillingCycleAsync(int billingCycleId)
        {
            var readings = await _repository.GetByBillingCycleIdAsync(billingCycleId);
            return _mapper.Map<List<MeterReadingDto>>(readings);
        }

        public async Task<List<MeterReadingDto>> GetByConnectionAsync(int connectionId)
        {
            var readings = await _repository.GetByConnectionIdAsync(connectionId);
            return _mapper.Map<List<MeterReadingDto>>(readings);
        }

        public async Task<MeterReadingDto> GetByIdAsync(int id)
        {
            var reading = await _repository.GetByIdAsync(id);
            if (reading == null)
                throw new KeyNotFoundException("Meter Reading not found");

            return _mapper.Map<MeterReadingDto>(reading);
        }

        public async Task<MeterReadingDto> CreateAsync(int recordedBy, CreateMeterReadingDto request)
        {
            // Check if reading already exists
            if (await _repository.ReadingExistsAsync(request.ConnectionId, request.BillingCycleId))
                throw new InvalidOperationException("Reading already exists for this connection in this billing cycle");

            // Get previous reading
            var lastReading = await _repository.GetLastReadingAsync(request.ConnectionId);
            var previousReading = lastReading?.CurrentReading ?? 0;
            if (request.CurrentReading < previousReading)
                throw new InvalidOperationException("Current reading cannot be less than previous reading");

            var meterReading = new MeterReading
            {
                ConnectionId = request.ConnectionId,
                BillingCycleId = request.BillingCycleId,
                PreviousReading = previousReading,
                CurrentReading = request.CurrentReading,
                Consumption = request.CurrentReading - previousReading,
                ReadingDate = request.ReadingDate,
                Remarks = request.Remarks,
                RecordedBy = recordedBy,
                CreatedAt = DateTime.UtcNow,
                IsBillGenerated = false
            };

            meterReading = await _repository.AddAsync(meterReading);
            return await GetByIdAsync(meterReading.MeterReadingId);
        }
    }
}