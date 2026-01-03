using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UtilityBillingSystem.Application.DTOs.Payments;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _service;
        private readonly IConsumerService _consumerService;

        public PaymentsController(IPaymentService service, IConsumerService consumerService)
        {
            _service = service;
            _consumerService = consumerService;
        }

        // ========== ACCOUNT OFFICER ENDPOINTS ==========

        [HttpGet]
        [Authorize(Roles = "Admin,AccountOfficer")]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _service.GetAllAsync();
            return Ok(payments);
        }

        [HttpGet("consumer/{consumerId}")]
        [Authorize(Roles = "Admin,AccountOfficer,BillingOfficer")]
        public async Task<IActionResult> GetByConsumer(int consumerId)
        {
            var payments = await _service.GetByConsumerAsync(consumerId);
            return Ok(payments);
        }

        [HttpGet("connection/{connectionId}")]  // NEW - Track by connection
        [Authorize(Roles = "Admin,AccountOfficer,BillingOfficer")]
        public async Task<IActionResult> GetByConnection(int connectionId)
        {
            var payments = await _service.GetByConnectionAsync(connectionId);
            return Ok(payments);
        }

        [HttpPost("record-offline")]  // Account Officer records offline payment
        [Authorize(Roles = "Admin,AccountOfficer")]
        public async Task<IActionResult> RecordOfflinePayment([FromBody] RecordPaymentDto request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var payment = await _service.RecordPaymentAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { id = payment.PaymentId }, payment);
        }

        // ========== CONSUMER ENDPOINTS ==========

        [HttpGet("my-payments")]  // Consumer views own payments
        [Authorize(Roles = "Consumer")]
        public async Task<IActionResult> GetMyPayments()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var consumer = await _consumerService.GetConsumerByUserIdAsync(userId);
            var payments = await _service.GetByConsumerAsync(consumer.ConsumerId);
            return Ok(payments);
        }

        [HttpPost("make-online-payment")]  // Consumer makes online payment
        [Authorize(Roles = "Consumer")]
        public async Task<IActionResult> MakeOnlinePayment([FromBody] ConsumerOnlinePaymentDto request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var consumer = await _consumerService.GetConsumerByUserIdAsync(userId);

            // Mock payment gateway processing
            // In real system: Integrate with Razorpay, Paytm, PhonePe, etc.
            var mockTransactionId = $"TXN{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";

            var paymentDto = new RecordPaymentDto
            {
                BillId = request.BillId,
                Amount = request.Amount,
                PaymentMode = request.PaymentMode,
                TransactionId = mockTransactionId,
                PaymentDate = DateTime.UtcNow,
                Remarks = $"Online payment via {request.PaymentMode} - {request.PaymentMethod}"
            };

            // Record payment (userId will be consumer's user ID)
            var payment = await _service.RecordPaymentAsync(userId, paymentDto);

            return Ok(new
            {
                success = true,
                message = "Payment successful",
                transactionId = mockTransactionId,
                receiptNumber = payment.ReceiptNumber,
                payment
            });
        }

        // ========== COMMON ENDPOINTS ==========

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var payment = await _service.GetByIdAsync(id);
            return Ok(payment);
        }
    }
}