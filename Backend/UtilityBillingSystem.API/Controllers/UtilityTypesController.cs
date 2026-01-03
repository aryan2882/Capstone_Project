using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UtilityBillingSystem.Application.DTOs.UtilityTypes;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]  // ONLY ADMIN
    public class UtilityTypesController : ControllerBase
    {
        private readonly IUtilityTypeService _service;

        public UtilityTypesController(IUtilityTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var utilityTypes = await _service.GetAllAsync();
            return Ok(utilityTypes);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var utilityTypes = await _service.GetActiveAsync();
            return Ok(utilityTypes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var utilityType = await _service.GetByIdAsync(id);
            return Ok(utilityType);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUtilityTypeDto request)
        {
            var utilityType = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = utilityType.UtilityTypeId }, utilityType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUtilityTypeDto request)
        {
            await _service.UpdateAsync(id, request);
            return NoContent();
        }

        [HttpPatch("{id}/deactivate")]  // Deactivate (soft delete)
        public async Task<IActionResult> Deactivate(int id)
        {
            await _service.DeactivateAsync(id);
            return NoContent();
        }

        [HttpDelete("{id}")]  // NEW - Hard delete
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}