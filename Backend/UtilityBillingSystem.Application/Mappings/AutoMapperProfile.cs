using AutoMapper;
using UtilityBillingSystem.Application.DTOs.Bills;
using UtilityBillingSystem.Application.DTOs.BillingCycles;
using UtilityBillingSystem.Application.DTOs.Connections;
using UtilityBillingSystem.Application.DTOs.Consumers;
using UtilityBillingSystem.Application.DTOs.MeterReadings;
using UtilityBillingSystem.Application.DTOs.Payments;
using UtilityBillingSystem.Application.DTOs.Tariffs;
using UtilityBillingSystem.Application.DTOs.Users;
using UtilityBillingSystem.Application.DTOs.UtilityTypes;
using UtilityBillingSystem.Core.Entities;

namespace UtilityBillingSystem.Application.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.HasValue ? src.Role.ToString() : null))
                .ForMember(dest => dest.ConsumerId, opt => opt.MapFrom(src => src.Consumer != null ? src.Consumer.ConsumerId : (int?)null));

            CreateMap<User, PendingUserDto>();

            // Consumer mappings
            CreateMap<Consumer, ConsumerDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone));

            // UtilityType mappings
            CreateMap<UtilityType, UtilityTypeDto>();
            CreateMap<CreateUtilityTypeDto, UtilityType>();
            CreateMap<UpdateUtilityTypeDto, UtilityType>();

            // Tariff mappings
            CreateMap<Tariff, TariffDto>()
                .ForMember(dest => dest.UtilityTypeName, opt => opt.MapFrom(src => src.UtilityType.Name));
            CreateMap<CreateTariffDto, Tariff>()
                .ForMember(dest => dest.TariffSlabs, opt => opt.Ignore());  // FIX - Handle manually in service
            CreateMap<TariffSlab, TariffSlabDto>();
            CreateMap<TariffSlabDto, TariffSlab>();  // FIX - ADD THIS MAPPING

            // BillingCycle mappings
            CreateMap<BillingCycle, BillingCycleDto>();
            CreateMap<CreateBillingCycleDto, BillingCycle>();

            // MeterReading mappings
            CreateMap<MeterReading, MeterReadingDto>()
                .ForMember(dest => dest.MeterNumber, opt => opt.MapFrom(src => src.Connection.MeterNumber))
                .ForMember(dest => dest.ConsumerName, opt => opt.MapFrom(src =>
                    src.Connection.Consumer.User.FirstName + " " + src.Connection.Consumer.User.LastName))
                .ForMember(dest => dest.CycleName, opt => opt.MapFrom(src => src.BillingCycle.CycleName));

            CreateMap<CreateConnectionDto, Connection>();

            // Bill mappings
            CreateMap<Bill, BillDto>()
                .ForMember(dest => dest.ConsumerName, opt => opt.MapFrom(src =>
                    src.Consumer.User.FirstName + " " + src.Consumer.User.LastName))
                .ForMember(dest => dest.ConsumerCode, opt => opt.MapFrom(src => src.Consumer.ConsumerCode))
                .ForMember(dest => dest.MeterNumber, opt => opt.MapFrom(src => src.Connection.MeterNumber))
                .ForMember(dest => dest.UtilityTypeName, opt => opt.MapFrom(src => src.Connection.UtilityType.Name))
                .ForMember(dest => dest.CycleName, opt => opt.MapFrom(src => src.BillingCycle.CycleName))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            // Connection mappings
            CreateMap<Connection, ConnectionDto>()
                .ForMember(dest => dest.ConsumerName, opt => opt.MapFrom(src =>
                    src.Consumer.User.FirstName + " " + src.Consumer.User.LastName))
                .ForMember(dest => dest.ConsumerCode, opt => opt.MapFrom(src => src.Consumer.ConsumerCode))
                .ForMember(dest => dest.UtilityTypeName, opt => opt.MapFrom(src => src.UtilityType.Name))
                .ForMember(dest => dest.TariffName, opt => opt.MapFrom(src => src.Tariff.PlanName))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            // Payment mappings
            CreateMap<Payment, PaymentDto>()
                .ForMember(dest => dest.ConsumerName, opt => opt.MapFrom(src => $"{src.Consumer.User.FirstName} {src.Consumer.User.LastName}"))
                .ForMember(dest => dest.BillNumber, opt => opt.MapFrom(src => src.Bill.BillNumber))
                .ForMember(dest => dest.PaymentMode, opt => opt.MapFrom(src => src.PaymentMode.ToString()));
        }
    }
}