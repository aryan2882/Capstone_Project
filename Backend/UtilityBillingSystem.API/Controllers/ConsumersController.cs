using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using UtilityBillingSystem.Application.DTOs.Consumers;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConsumersController : ControllerBase
    {
        private readonly IConsumerService _consumerService;

        public ConsumersController(IConsumerService consumerService)
        {
            _consumerService = consumerService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,BillingOfficer,AccountOfficer")]
        public async Task<IActionResult> GetAllConsumers()
        {
            var consumers = await _consumerService.GetAllConsumersAsync();
            return Ok(consumers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetConsumerById(int id)
        {
            var consumer = await _consumerService.GetConsumerByIdAsync(id);
            return Ok(consumer);
        }

        [HttpGet("my-profile")]
        [Authorize(Roles = "Consumer")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var consumer = await _consumerService.GetConsumerByUserIdAsync(userId);
            return Ok(consumer);
        }

        [HttpPut("my-profile")]
        [Authorize(Roles = "Consumer")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateConsumerDto request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var consumer = await _consumerService.GetConsumerByUserIdAsync(userId);
            await _consumerService.UpdateConsumerAsync(consumer.ConsumerId, request);
            return NoContent();
        }

        [HttpGet("{consumerId}/consumption/{connectionId}")]  // NEW
        [Authorize(Roles = "Consumer,Admin,BillingOfficer,AccountOfficer")]
        public async Task<IActionResult> GetConsumptionDetails(int consumerId, int connectionId)
        {
            var consumption = await _consumerService.GetConsumptionDetailsAsync(consumerId, connectionId);
            return Ok(consumption);
        }

        [HttpGet("my-consumption/{connectionId}")]  // NEW - Consumer views own consumption
        [Authorize(Roles = "Consumer")]
        public async Task<IActionResult> GetMyConsumption(int connectionId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var consumer = await _consumerService.GetConsumerByUserIdAsync(userId);
            var consumption = await _consumerService.GetConsumptionDetailsAsync(consumer.ConsumerId, connectionId);
            return Ok(consumption);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteConsumer(int id)
        {
            await _consumerService.DeleteConsumerAsync(id);
            return NoContent();
        }
    }
}