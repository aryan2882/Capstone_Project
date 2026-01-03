using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Application.Helpers
{
    public static class BillCalculator
    {
        public static decimal CalculateEnergyCharge(decimal consumption, Tariff tariff)
        {
            if (!tariff.IsSlabBased)
            {
                return consumption * (tariff.FlatRate ?? 0);
            }

            decimal totalCharge = 0;
            decimal remainingConsumption = consumption;

            var slabs = tariff.TariffSlabs.OrderBy(s => s.SlabNumber).ToList();

            foreach (var slab in slabs)
            {
                if (remainingConsumption <= 0)
                    break;

                decimal slabConsumption;

                if (slab.ToUnit.HasValue)
                {
                    // Calculate consumption for this slab
                    decimal slabRange = slab.ToUnit.Value - slab.FromUnit;
                    slabConsumption = Math.Min(remainingConsumption, slabRange);
                }
                else
                {
                    // Last slab (unlimited)
                    slabConsumption = remainingConsumption;
                }

                totalCharge += slabConsumption * slab.RatePerUnit;
                remainingConsumption -= slabConsumption;
            }

            return totalCharge;
        }

        public static decimal CalculateTax(decimal subtotal, decimal taxPercentage)
        {
            return subtotal * (taxPercentage / 100);
        }

        public static decimal CalculatePenalty(decimal outstandingAmount, DateTime dueDate, decimal penaltyRate = 2)
        {
            if (DateTime.Now <= dueDate)
                return 0;

            return outstandingAmount * (penaltyRate / 100);
        }
    }
}