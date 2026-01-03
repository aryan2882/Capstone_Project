using AutoMapper;
using UtilityBillingSystem.Application.DTOs.Tariffs;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class TariffService : ITariffService
    {
        private readonly ITariffRepository _repository;
        private readonly IMapper _mapper;

        public TariffService(ITariffRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<TariffDto>> GetAllAsync()
        {
            var tariffs = await _repository.GetAllAsync();
            return _mapper.Map<List<TariffDto>>(tariffs);
        }

        public async Task<List<TariffDto>> GetActiveAsync()
        {
            var tariffs = await _repository.GetActiveAsync();
            return _mapper.Map<List<TariffDto>>(tariffs);
        }

        public async Task<List<TariffDto>> GetByUtilityTypeAsync(int utilityTypeId)
        {
            var tariffs = await _repository.GetByUtilityTypeAsync(utilityTypeId);
            return _mapper.Map<List<TariffDto>>(tariffs);
        }

        public async Task<TariffDto> GetByIdAsync(int id)
        {
            var tariff = await _repository.GetByIdWithSlabsAsync(id);
            if (tariff == null)
                throw new KeyNotFoundException("Tariff not found");

            return _mapper.Map<TariffDto>(tariff);
        }

        public async Task<TariffDto> CreateAsync(CreateTariffDto request)
        {
            // Validation
            if (request.IsSlabBased && (request.TariffSlabs == null || !request.TariffSlabs.Any()))
                throw new InvalidOperationException("Slab-based tariff must have at least one slab");

            if (!request.IsSlabBased && !request.FlatRate.HasValue)
                throw new InvalidOperationException("Flat rate is required for non-slab tariffs");

            var tariff = _mapper.Map<Tariff>(request);
            tariff.IsActive = true;
            tariff.CreatedAt = DateTime.UtcNow;

            // Add slabs if slab-based
            if (request.IsSlabBased && request.TariffSlabs != null)
            {
                tariff.TariffSlabs = request.TariffSlabs.Select((slab, index) => new TariffSlab
                {
                    SlabNumber = index + 1,
                    FromUnit = slab.FromUnit,
                    ToUnit = slab.ToUnit,
                    RatePerUnit = slab.RatePerUnit
                }).ToList();
            }

            tariff = await _repository.AddAsync(tariff);
            return await GetByIdAsync(tariff.TariffId);
        }

        public async Task UpdateAsync(int id, UpdateTariffDto request)  // UPDATED
        {
            var tariff = await _repository.GetByIdWithSlabsAsync(id);
            if (tariff == null)
                throw new KeyNotFoundException("Tariff not found");

            // Validation
            if (request.IsSlabBased && (request.TariffSlabs == null || !request.TariffSlabs.Any()))
                throw new InvalidOperationException("Slab-based tariff must have at least one slab");

            if (!request.IsSlabBased && !request.FlatRate.HasValue)
                throw new InvalidOperationException("Flat rate is required for non-slab tariffs");

            tariff.PlanName = request.PlanName;
            tariff.FixedMonthlyCharge = request.FixedMonthlyCharge;
            tariff.MinimumCharge = request.MinimumCharge;
            tariff.TaxPercentage = request.TaxPercentage;
            tariff.IsSlabBased = request.IsSlabBased;
            tariff.FlatRate = request.FlatRate;
            tariff.EffectiveTo = request.EffectiveTo;
            tariff.IsActive = request.IsActive;

            // Update slabs
            if (request.IsSlabBased && request.TariffSlabs != null)
            {
                // Remove old slabs
                tariff.TariffSlabs.Clear();

                // Add new slabs
                tariff.TariffSlabs = request.TariffSlabs.Select((slab, index) => new TariffSlab
                {
                    TariffId = tariff.TariffId,
                    SlabNumber = index + 1,
                    FromUnit = slab.FromUnit,
                    ToUnit = slab.ToUnit,
                    RatePerUnit = slab.RatePerUnit
                }).ToList();
            }

            await _repository.UpdateAsync(tariff);
        }

        public async Task DeactivateAsync(int id)
        {
            var tariff = await _repository.GetByIdAsync(id);
            if (tariff == null)
                throw new KeyNotFoundException("Tariff not found");

            tariff.IsActive = false;
            await _repository.UpdateAsync(tariff);
        }

        public async Task DeleteAsync(int id)  // NEW
        {
            var tariff = await _repository.GetByIdAsync(id);
            if (tariff == null)
                throw new KeyNotFoundException("Tariff not found");

            await _repository.DeleteAsync(tariff);
        }
    }
}