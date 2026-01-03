using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UtilityBillingSystem.Application.DTOs.Connections;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConnectionsController : ControllerBase
    {
        private readonly IConnectionService _service;

        public ConnectionsController(IConnectionService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,BillingOfficer")]
        public async Task<IActionResult> GetAll()
        {
            var connections = await _service.GetAllAsync();
            return Ok(connections);
        }

        [HttpGet("consumer/{consumerId}")]
        public async Task<IActionResult> GetByConsumer(int consumerId)
        {
            var connections = await _service.GetByConsumerIdAsync(consumerId);
            return Ok(connections);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var connection = await _service.GetByIdAsync(id);
            return Ok(connection);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,BillingOfficer")]
        public async Task<IActionResult> Create([FromBody] CreateConnectionDto request)
        {
            var connection = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = connection.ConnectionId }, connection);
        }

        [HttpPut("{id}")]  // NEW
        [Authorize(Roles = "Admin,BillingOfficer")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateConnectionDto request)
        {
            await _service.UpdateAsync(id, request);
            return NoContent();
        }

        [HttpPost("{id}/disconnect")]  // FIXED
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Disconnect(int id, [FromBody] DisconnectConnectionDto request)
        {
            await _service.DisconnectAsync(id, request.Reason);
            return NoContent();
        }
    }
}