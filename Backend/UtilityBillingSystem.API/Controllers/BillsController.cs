using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UtilityBillingSystem.Application.DTOs.Bills;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BillsController : ControllerBase
    {
        private readonly IBillingService _service;

        public BillsController(IBillingService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,BillingOfficer,AccountOfficer")]
        public async Task<IActionResult> GetAll()
        {
            var bills = await _service.GetAllAsync();
            return Ok(bills);
        }

        [HttpGet("consumer/{consumerId}")]
        public async Task<IActionResult> GetByConsumer(int consumerId)
        {
            var bills = await _service.GetByConsumerAsync(consumerId);
            return Ok(bills);
        }

        [HttpGet("outstanding")]
        [Authorize(Roles = "Admin,AccountOfficer")]
        public async Task<IActionResult> GetOutstanding()
        {
            var bills = await _service.GetOutstandingBillsAsync();
            return Ok(bills);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var bill = await _service.GetByIdAsync(id);
            return Ok(bill);
        }

        [HttpPost("generate")]
        [Authorize(Roles = "Admin,BillingOfficer")]
        public async Task<IActionResult> Generate([FromBody] GenerateBillDto request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var bill = await _service.GenerateBillAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { id = bill.BillId }, bill);
        }

        [HttpPost("generate-bulk/{billingCycleId}")]
        [Authorize(Roles = "Admin,BillingOfficer")]
        public async Task<IActionResult> GenerateBulk(int billingCycleId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var bills = await _service.GenerateBulkBillsAsync(userId, billingCycleId);
            return Ok(new
            {
                message = $"Generated {bills.Count} bills successfully",
                bills
            });
        }
    }
}