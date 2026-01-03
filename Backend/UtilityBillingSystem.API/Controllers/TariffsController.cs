using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UtilityBillingSystem.Application.DTOs.Tariffs;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class TariffsController : ControllerBase
    {
        private readonly ITariffService _service;

        public TariffsController(ITariffService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tariffs = await _service.GetAllAsync();
            return Ok(tariffs);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var tariffs = await _service.GetActiveAsync();
            return Ok(tariffs);
        }

        [HttpGet("by-utility-type/{utilityTypeId}")]
        public async Task<IActionResult> GetByUtilityType(int utilityTypeId)
        {
            var tariffs = await _service.GetByUtilityTypeAsync(utilityTypeId);
            return Ok(tariffs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tariff = await _service.GetByIdAsync(id);
            return Ok(tariff);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTariffDto request)
        {
            var tariff = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = tariff.TariffId }, tariff);
        }

        [HttpPut("{id}")]  // UPDATED
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTariffDto request)
        {
            await _service.UpdateAsync(id, request);
            return NoContent();
        }

        [HttpPatch("{id}/deactivate")]
        public async Task<IActionResult> Deactivate(int id)
        {
            await _service.DeactivateAsync(id);
            return NoContent();
        }

        [HttpDelete("{id}")]  // NEW
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}