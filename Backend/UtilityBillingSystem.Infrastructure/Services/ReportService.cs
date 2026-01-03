using System.Reflection.PortableExecutable;
using Microsoft.EntityFrameworkCore;
using UtilityBillingSystem.Application.DTOs.Reports;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Infrastructure.Data;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RevenueReportDto> GetRevenueReportAsync(DateTime startDate, DateTime endDate)
        {
            var startDateOnly = startDate.Date;
            var endDateOnly = endDate.Date.AddDays(1).AddTicks(-1);

            var bills = await _context.Bills
                .Where(b => b.BillDate.Date >= startDateOnly && b.BillDate.Date <= endDateOnly)
                .ToListAsync();

            return new RevenueReportDto
            {
                Period = $"{startDate:dd-MMM-yyyy} to {endDate:dd-MMM-yyyy}",
                TotalBillAmount = bills.Sum(b => b.TotalAmount),
                TotalCollected = bills.Sum(b => b.PaidAmount),
                TotalOutstanding = bills.Sum(b => b.OutstandingAmount),
                TotalBills = bills.Count,
                PaidBills = bills.Count(b => b.Status == BillStatus.Paid),
                UnpaidBills = bills.Count(b => b.Status != BillStatus.Paid)
            };
        }

        public async Task<List<OutstandingReportDto>> GetOutstandingReportAsync()
        {
            var report = await _context.Bills
                .Where(b => b.OutstandingAmount > 0 && b.Status != BillStatus.Paid)
                .GroupBy(b => new
                {
                    b.ConsumerId,
                    b.Consumer.ConsumerCode,
                    ConsumerName = b.Consumer.User.FirstName + " " + b.Consumer.User.LastName,
                    b.Consumer.User.Phone
                })
                .Select(g => new OutstandingReportDto
                {
                    ConsumerId = g.Key.ConsumerId,
                    ConsumerCode = g.Key.ConsumerCode,
                    ConsumerName = g.Key.ConsumerName,
                    Phone = g.Key.Phone,
                    TotalOutstanding = g.Sum(b => b.OutstandingAmount),
                    UnpaidBillsCount = g.Count(),
                    OldestBillDate = g.Min(b => b.BillDate),
                    DaysOverdue = (int)(DateTime.Now - g.Min(b => b.DueDate)).TotalDays
                })
                .OrderByDescending(r => r.TotalOutstanding)
                .ToListAsync();

            return report;
        }

        public async Task<List<ConsumptionReportDto>> GetConsumptionReportAsync(int billingCycleId)
        {
            var report = await _context.MeterReadings
                .Where(m => m.BillingCycleId == billingCycleId)
                .GroupBy(m => m.Connection.UtilityType.Name)
                .Select(g => new ConsumptionReportDto
                {
                    UtilityType = g.Key,
                    TotalConsumption = g.Sum(m => m.Consumption),
                    AverageConsumption = g.Average(m => m.Consumption),
                    TotalConnections = g.Count(),
                    HighestConsumption = g.Max(m => m.Consumption),
                    LowestConsumption = g.Min(m => m.Consumption)
                })
                .ToListAsync();

            return report;
        }

        public async Task<List<CollectionReportDto>> GetCollectionReportAsync(DateTime startDate, DateTime endDate)
        {
            var startDateOnly = startDate.Date;
            var endDateOnly = endDate.Date.AddDays(1).AddTicks(-1);

            // Fetch data first
            var payments = await _context.Payments
                .Where(p => p.PaymentDate.Date >= startDateOnly && p.PaymentDate.Date <= endDateOnly)
                .ToListAsync();

            // Group in memory
            var report = payments
                .GroupBy(p => new
                {
                    p.PaymentDate.Date,
                    PaymentMode = p.PaymentMode
                })
                .Select(g => new CollectionReportDto
                {
                    Date = g.Key.Date,
                    PaymentMode = g.Key.PaymentMode.ToString(),
                    TotalAmount = g.Sum(p => p.Amount),
                    TransactionCount = g.Count()
                })
                .OrderBy(r => r.Date)
                .ThenBy(r => r.PaymentMode)
                .ToList();

            return report;
        }

        public async Task<List<ConsumerSummaryReportDto>> GetConsumerSummaryReportAsync()
        {
            var report = await _context.Consumers
                .Include(c => c.User)
                .Select(c => new
                {
                    Consumer = c,
                    Bills = _context.Bills.Where(b => b.ConsumerId == c.ConsumerId).ToList(),
                    MeterReadings = _context.MeterReadings
                        .Where(m => m.Connection.ConsumerId == c.ConsumerId)
                        .ToList(),
                    UtilityType = _context.Connections
                        .Where(conn => conn.ConsumerId == c.ConsumerId)
                        .Select(conn => conn.UtilityType.Name)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return report.Select(r => new ConsumerSummaryReportDto
            {
                ConsumerId = r.Consumer.ConsumerId,
                ConsumerCode = r.Consumer.ConsumerCode,
                ConsumerName = $"{r.Consumer.User.FirstName} {r.Consumer.User.LastName}",
                UtilityType = r.UtilityType,
                TotalBilled = r.Bills.Sum(b => b.TotalAmount),
                TotalPaid = r.Bills.Sum(b => b.PaidAmount),
                TotalOutstanding = r.Bills.Sum(b => b.OutstandingAmount),
                AverageMonthlyConsumption = r.MeterReadings.Any()
                    ? r.MeterReadings.Average(m => m.Consumption)
                    : 0,
                TotalBills = r.Bills.Count
            }).ToList();
        }
    }
}