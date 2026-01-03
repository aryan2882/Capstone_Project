using FluentAssertions;
using UtilityBillingSystem.Application.Helpers;
using UtilityBillingSystem.Core.Entities;
using Xunit;

namespace UtilityBillingSystem.Tests.Helpers
{
    public class BillCalculatorTests
    {
        [Fact]
        public void CalculateEnergyCharge_FlatRate_ReturnsCorrectAmount()
        {
            // Arrange
            var tariff = new Tariff
            {
                IsSlabBased = false,
                FlatRate = 5.50m
            };
            decimal consumption = 150.5m;

            // Act
            var result = BillCalculator.CalculateEnergyCharge(consumption, tariff);

            // Assert
            result.Should().Be(827.75m); // 150.5 * 5.50
        }

        [Fact]
        public void CalculateEnergyCharge_SlabBased_ReturnsCorrectAmount()
        {
            // Arrange
            var tariff = new Tariff
            {
                IsSlabBased = true,
                TariffSlabs = new List<TariffSlab>
                {
                    new TariffSlab { FromUnit = 0, ToUnit = 100, RatePerUnit = 5.00m },
                    new TariffSlab { FromUnit = 100, ToUnit = 200, RatePerUnit = 7.00m },
                    new TariffSlab { FromUnit = 200, ToUnit = null, RatePerUnit = 10.00m }
                }
            };
            decimal consumption = 150.5m;

            // Act
            var result = BillCalculator.CalculateEnergyCharge(consumption, tariff);

            // Assert
            // 0-100: 100 * 5 = 500
            // 100-150.5: 50.5 * 7 = 353.5
            // Total: 853.5
            result.Should().Be(853.50m);
        }

        [Fact]
        public void CalculateTax_ReturnsCorrectAmount()
        {
            // Arrange
            decimal subtotal = 1000m;
            decimal taxPercentage = 18m;

            // Act
            var result = BillCalculator.CalculateTax(subtotal, taxPercentage);

            // Assert
            result.Should().Be(180m); // 1000 * 0.18
        }

        [Fact]
        public void CalculatePenalty_BeforeDueDate_ReturnsZero()
        {
            // Arrange
            decimal outstandingAmount = 1000m;
            DateTime dueDate = DateTime.Today.AddDays(5);

            // Act
            var result = BillCalculator.CalculatePenalty(outstandingAmount, dueDate);

            // Assert
            result.Should().Be(0m);
        }

        [Fact]
        public void CalculatePenalty_AfterDueDate_ReturnsCorrectAmount()
        {
            // Arrange
            decimal outstandingAmount = 1000m;
            DateTime dueDate = DateTime.Today.AddDays(-5);
            decimal penaltyRate = 2m;

            // Act
            var result = BillCalculator.CalculatePenalty(outstandingAmount, dueDate, penaltyRate);

            // Assert
            result.Should().Be(20m); // 1000 * 0.02
        }
    }
}