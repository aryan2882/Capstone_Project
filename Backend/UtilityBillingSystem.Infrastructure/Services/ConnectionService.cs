using AutoMapper;
using UtilityBillingSystem.Application.DTOs.Connections;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class ConnectionService : IConnectionService
    {
        private readonly IConnectionRepository _repository;
        private readonly IMapper _mapper;

        public ConnectionService(IConnectionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<ConnectionDto>> GetAllAsync()
        {
            var connections = await _repository.GetAllAsync();
            return _mapper.Map<List<ConnectionDto>>(connections);
        }

        public async Task<List<ConnectionDto>> GetByConsumerIdAsync(int consumerId)
        {
            var connections = await _repository.GetByConsumerIdAsync(consumerId);
            return _mapper.Map<List<ConnectionDto>>(connections);
        }

        public async Task<ConnectionDto> GetByIdAsync(int id)
        {
            var connection = await _repository.GetByIdAsync(id);
            if (connection == null)
                throw new KeyNotFoundException("Connection not found");

            return _mapper.Map<ConnectionDto>(connection);
        }

        public async Task<ConnectionDto> CreateAsync(CreateConnectionDto request)
        {
            if (await _repository.MeterNumberExistsAsync(request.MeterNumber))
                throw new InvalidOperationException("Meter number already exists");

            var connection = _mapper.Map<Connection>(request);
            connection.Status = ConnectionStatus.Active;
            connection.CreatedAt = DateTime.UtcNow;

            connection = await _repository.AddAsync(connection);
            return await GetByIdAsync(connection.ConnectionId);
        }

        public async Task UpdateAsync(int id, UpdateConnectionDto request)  // NEW
        {
            var connection = await _repository.GetByIdAsync(id);
            if (connection == null)
                throw new KeyNotFoundException("Connection not found");

            // Check if meter number is unique (excluding current connection)
            var existingConnection = await _repository.GetAllAsync();
            if (existingConnection.Any(c => c.MeterNumber == request.MeterNumber && c.ConnectionId != id))
                throw new InvalidOperationException("Meter number already exists");

            connection.TariffId = request.TariffId;
            connection.MeterNumber = request.MeterNumber;
            connection.ConnectionLoad = request.ConnectionLoad;

            await _repository.UpdateAsync(connection);
        }

        public async Task DisconnectAsync(int id, string reason)
        {
            var connection = await _repository.GetByIdAsync(id);
            if (connection == null)
                throw new KeyNotFoundException("Connection not found");

            connection.Status = ConnectionStatus.Disconnected;
            connection.DisconnectionDate = DateTime.UtcNow;
            connection.DisconnectionReason = reason;

            await _repository.UpdateAsync(connection);
        }
    }
}