using AutoMapper;
using UtilityBillingSystem.Application.DTOs.Auth;
using UtilityBillingSystem.Application.DTOs.Users;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConsumerRepository _consumerRepository;
        private readonly IJwtService _jwtService;
        private readonly IMapper _mapper;

        public AuthService(
            IUserRepository userRepository,
            IConsumerRepository consumerRepository,
            IJwtService jwtService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _consumerRepository = consumerRepository;
            _jwtService = jwtService;
            _mapper = mapper;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!user.IsApproved)
            {
                throw new UnauthorizedAccessException("Account is pending approval. Please contact administrator.");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Account is deactivated. Please contact administrator.");
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Get consumer ID if user is a consumer
            int? consumerId = null;
            if (user.Role == Core.Enums.UserRole.Consumer)
            {
                var consumer = await _consumerRepository.GetByUserIdAsync(user.UserId);
                consumerId = consumer?.ConsumerId;
            }

            var token = _jwtService.GenerateToken(user);

            return new LoginResponseDto
            {
                Token = token,
                UserId = user.UserId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString(),
                ConsumerId = consumerId
            };
        }

        public async Task<UserDto> RegisterAsync(UserRegisterDto request)
        {
            // Validate email uniqueness
            if (await _userRepository.EmailExistsAsync(request.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            // Create User with ALL details
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                FatherName = request.FatherName,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                City = request.City,
                State = request.State,
                PinCode = request.PinCode,
                IdProofType = request.IdProofType,
                IdProofNumber = request.IdProofNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = null,  // No role yet
                IsActive = false,
                IsApproved = false,
                CreatedAt = DateTime.UtcNow
            };

            user = await _userRepository.AddAsync(user);

            return _mapper.Map<UserDto>(user);
        }
    }
}