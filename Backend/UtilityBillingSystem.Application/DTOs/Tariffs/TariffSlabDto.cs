namespace UtilityBillingSystem.Application.DTOs.Tariffs
{
    public class TariffSlabDto
    {
        public int SlabNumber { get; set; }
        public decimal FromUnit { get; set; }
        public decimal? ToUnit { get; set; }
        public decimal RatePerUnit { get; set; }
    }
}