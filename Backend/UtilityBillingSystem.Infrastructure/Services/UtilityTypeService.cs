using AutoMapper;
using UtilityBillingSystem.Application.DTOs.UtilityTypes;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class UtilityTypeService : IUtilityTypeService
    {
        private readonly IUtilityTypeRepository _repository;
        private readonly IMapper _mapper;

        public UtilityTypeService(IUtilityTypeRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<UtilityTypeDto>> GetAllAsync()
        {
            var utilityTypes = await _repository.GetAllAsync();
            return _mapper.Map<List<UtilityTypeDto>>(utilityTypes);
        }

        public async Task<List<UtilityTypeDto>> GetActiveAsync()
        {
            var utilityTypes = await _repository.GetActiveAsync();
            return _mapper.Map<List<UtilityTypeDto>>(utilityTypes);
        }

        public async Task<UtilityTypeDto> GetByIdAsync(int id)
        {
            var utilityType = await _repository.GetByIdAsync(id);
            if (utilityType == null)
                throw new KeyNotFoundException("Utility Type not found");

            return _mapper.Map<UtilityTypeDto>(utilityType);
        }

        public async Task<UtilityTypeDto> CreateAsync(CreateUtilityTypeDto request)
        {
            if (await _repository.NameExistsAsync(request.Name))
                throw new InvalidOperationException("Utility Type with this name already exists");

            var utilityType = _mapper.Map<UtilityType>(request);
            utilityType.IsActive = true;
            utilityType.CreatedAt = DateTime.UtcNow;

            utilityType = await _repository.AddAsync(utilityType);
            return _mapper.Map<UtilityTypeDto>(utilityType);
        }

        public async Task UpdateAsync(int id, UpdateUtilityTypeDto request)
        {
            var utilityType = await _repository.GetByIdAsync(id);
            if (utilityType == null)
                throw new KeyNotFoundException("Utility Type not found");

            _mapper.Map(request, utilityType);
            await _repository.UpdateAsync(utilityType);
        }

        public async Task DeactivateAsync(int id)
        {
            var utilityType = await _repository.GetByIdAsync(id);
            if (utilityType == null)
                throw new KeyNotFoundException("Utility Type not found");

            utilityType.IsActive = false;
            await _repository.UpdateAsync(utilityType);
        }

        public async Task DeleteAsync(int id)  // NEW
        {
            var utilityType = await _repository.GetByIdAsync(id);
            if (utilityType == null)
                throw new KeyNotFoundException("Utility Type not found");

            await _repository.DeleteAsync(utilityType);
        }
    }
}