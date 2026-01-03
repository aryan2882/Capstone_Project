using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UtilityBillingSystem.Application.DTOs.BillingCycles;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,BillingOfficer,AccountOfficer")]
    public class BillingCyclesController : ControllerBase
    {
        private readonly IBillingCycleService _service;

        public BillingCyclesController(IBillingCycleService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,BillingOfficer,AccountOfficer")]
        public async Task<IActionResult> GetAll()
        {
            var cycles = await _service.GetAllAsync();
            return Ok(cycles);
        }

        [HttpGet("current")]
        [Authorize(Roles = "Admin,BillingOfficer")]
        public async Task<IActionResult> GetCurrent()
        {
            var cycle = await _service.GetCurrentCycleAsync();
            return Ok(cycle);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cycle = await _service.GetByIdAsync(id);
            return Ok(cycle);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBillingCycleDto request)
        {
            var cycle = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = cycle.BillingCycleId }, cycle);
        }

        [HttpPost("{id}/close")]
        public async Task<IActionResult> Close(int id)
        {
            await _service.CloseCycleAsync(id);
            return NoContent();
        }
    }
}