using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UtilityBillingSystem.Application.DTOs.MeterReadings;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,BillingOfficer")]
    public class MeterReadingsController : ControllerBase
    {
        private readonly IMeterReadingService _service;

        public MeterReadingsController(IMeterReadingService service)
        {
            _service = service;
        }

        [HttpGet("billing-cycle/{billingCycleId}")]
        public async Task<IActionResult> GetByBillingCycle(int billingCycleId)
        {
            var readings = await _service.GetByBillingCycleAsync(billingCycleId);
            return Ok(readings);
        }

        [HttpGet("connection/{connectionId}")]
        public async Task<IActionResult> GetByConnection(int connectionId)
        {
            var readings = await _service.GetByConnectionAsync(connectionId);
            return Ok(readings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var reading = await _service.GetByIdAsync(id);
            return Ok(reading);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMeterReadingDto request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var reading = await _service.CreateAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { id = reading.MeterReadingId }, reading);
        }
    }
}