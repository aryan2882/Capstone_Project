using AutoMapper;
using UtilityBillingSystem.Application.DTOs.BillingCycles;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class BillingCycleService : IBillingCycleService
    {
        private readonly IBillingCycleRepository _repository;
        private readonly IMapper _mapper;

        public BillingCycleService(IBillingCycleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<BillingCycleDto>> GetAllAsync()
        {
            var cycles = await _repository.GetAllAsync();
            return _mapper.Map<List<BillingCycleDto>>(cycles);
        }

        public async Task<BillingCycleDto> GetByIdAsync(int id)
        {
            var cycle = await _repository.GetByIdAsync(id);
            if (cycle == null)
                throw new KeyNotFoundException("Billing Cycle not found");

            return _mapper.Map<BillingCycleDto>(cycle);
        }

        public async Task<BillingCycleDto> GetCurrentCycleAsync()
        {
            var cycle = await _repository.GetCurrentCycleAsync();
            if (cycle == null)
                throw new KeyNotFoundException("No active billing cycle found");

            return _mapper.Map<BillingCycleDto>(cycle);
        }

        public async Task<BillingCycleDto> CreateAsync(CreateBillingCycleDto request)
        {
            var cycle = _mapper.Map<BillingCycle>(request);
            cycle.IsClosed = false;
            cycle.CreatedAt = DateTime.UtcNow;

            cycle = await _repository.AddAsync(cycle);
            return _mapper.Map<BillingCycleDto>(cycle);
        }

        public async Task CloseCycleAsync(int id)
        {
            var cycle = await _repository.GetByIdAsync(id);
            if (cycle == null)
                throw new KeyNotFoundException("Billing Cycle not found");

            cycle.IsClosed = true;
            await _repository.UpdateAsync(cycle);
        }
    }
}