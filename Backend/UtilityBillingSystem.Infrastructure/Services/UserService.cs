using AutoMapper;
using UtilityBillingSystem.Application.DTOs.Users;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Core.Interfaces;

namespace UtilityBillingSystem.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConsumerRepository _consumerRepository;
        private readonly IMapper _mapper;

        public UserService(
            IUserRepository userRepository,
            IConsumerRepository consumerRepository,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _consumerRepository = consumerRepository;
            _mapper = mapper;
        }

        public async Task<List<UserDto>> GetAllApprovedStaffUsersAsync()
        {
            var users = await _userRepository.GetApprovedStaffUsersAsync();
            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task<List<PendingUserDto>> GetPendingUsersAsync()
        {
            var users = await _userRepository.GetPendingUsersAsync();
            return _mapper.Map<List<PendingUserDto>>(users);
        }

        public async Task<UserDto> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> AssignRoleAndApproveAsync(int userId, int approvedBy, AssignRoleDto request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            if (user.IsApproved)
            {
                throw new InvalidOperationException("User is already approved");
            }

            // Assign role
            user.Role = request.Role;
            user.IsApproved = true;
            user.IsActive = true;
            user.ApprovedBy = approvedBy;
            user.ApprovedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            // If role is Consumer, create consumer profile from user data
            if (request.Role == UserRole.Consumer)
            {
                var consumer = new Consumer
                {
                    UserId = user.UserId,
                    ConsumerCode = await _consumerRepository.GenerateConsumerCodeAsync(),
                    FatherName = user.FatherName,
                    Address = user.Address,
                    City = user.City,
                    State = user.State,
                    PinCode = user.PinCode,
                    IdProofType = user.IdProofType,
                    IdProofNumber = user.IdProofNumber,
                    CreatedAt = DateTime.UtcNow
                };

                await _consumerRepository.AddAsync(consumer);
            }

            // Reload user with consumer data
            user = await _userRepository.GetByIdAsync(userId);
            return _mapper.Map<UserDto>(user);
        }

        public async Task RejectUserAsync(int userId, RejectUserDto request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            if (user.IsApproved)
            {
                throw new InvalidOperationException("Cannot reject an approved user");
            }

            user.RejectionReason = request.RejectionReason;
            user.IsActive = false;

            await _userRepository.UpdateAsync(user);
        }

        public async Task UpdateUserAsync(int userId, UpdateUserDto request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Phone = request.Phone;

            await _userRepository.UpdateAsync(user);
        }

        public async Task DeactivateUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            user.IsActive = false;
            await _userRepository.UpdateAsync(user);
        }
    }
}