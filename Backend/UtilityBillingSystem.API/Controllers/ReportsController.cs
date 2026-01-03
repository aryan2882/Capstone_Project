using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,AccountOfficer")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportsController(IReportService service)
        {
            _service = service;
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _service.GetRevenueReportAsync(startDate, endDate);
            return Ok(report);
        }

        [HttpGet("outstanding")]
        public async Task<IActionResult> GetOutstandingReport()
        {
            var report = await _service.GetOutstandingReportAsync();
            return Ok(report);
        }

        [HttpGet("consumption/{billingCycleId}")]
        public async Task<IActionResult> GetConsumptionReport(int billingCycleId)
        {
            var report = await _service.GetConsumptionReportAsync(billingCycleId);
            return Ok(report);
        }

        [HttpGet("collection")]
        public async Task<IActionResult> GetCollectionReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _service.GetCollectionReportAsync(startDate, endDate);
            return Ok(report);
        }

        [HttpGet("consumer-summary")]
        public async Task<IActionResult> GetConsumerSummaryReport()
        {
            var report = await _service.GetConsumerSummaryReportAsync();
            return Ok(report);
        }
    }
}