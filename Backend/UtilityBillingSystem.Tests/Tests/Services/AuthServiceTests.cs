using FluentAssertions;
using Moq;
using UtilityBillingSystem.Application.DTOs.Auth;
using UtilityBillingSystem.Application.Services.Interfaces;
using UtilityBillingSystem.Core.Entities;
using UtilityBillingSystem.Core.Enums;
using UtilityBillingSystem.Core.Interfaces;
using UtilityBillingSystem.Infrastructure.Services;
using Xunit;
using AutoMapper;

namespace UtilityBillingSystem.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IConsumerRepository> _consumerRepositoryMock;
        private readonly Mock<IJwtService> _jwtServiceMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _consumerRepositoryMock = new Mock<IConsumerRepository>();
            _jwtServiceMock = new Mock<IJwtService>();
            _mapperMock = new Mock<IMapper>();

            _authService = new AuthService(
                _userRepositoryMock.Object,
                _consumerRepositoryMock.Object,
                _jwtServiceMock.Object,
                _mapperMock.Object
            );
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var email = "test@example.com";
            var password = "Test@123";
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new User
            {
                UserId = 1,
                Email = email,
                PasswordHash = passwordHash,
                FirstName = "Test",
                LastName = "User",
                Role = UserRole.Admin,
                IsActive = true,
                IsApproved = true
            };

            _userRepositoryMock
                .Setup(x => x.GetByEmailAsync(email))
                .ReturnsAsync(user);

            _jwtServiceMock
                .Setup(x => x.GenerateToken(user))
                .Returns("mock-jwt-token");

            var loginRequest = new LoginRequestDto
            {
                Email = email,
                Password = password
            };

            // Act
            var result = await _authService.LoginAsync(loginRequest);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().Be("mock-jwt-token");
            result.Email.Should().Be(email);
            result.UserId.Should().Be(1);
        }

        [Fact]
        public async Task LoginAsync_InvalidPassword_ThrowsUnauthorizedException()
        {
            // Arrange
            var email = "test@example.com";
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("correctpassword");

            var user = new User
            {
                Email = email,
                PasswordHash = passwordHash,
                IsActive = true,
                IsApproved = true
            };

            _userRepositoryMock
                .Setup(x => x.GetByEmailAsync(email))
                .ReturnsAsync(user);

            var loginRequest = new LoginRequestDto
            {
                Email = email,
                Password = "wrongpassword"
            };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _authService.LoginAsync(loginRequest)
            );
        }

        [Fact]
        public async Task LoginAsync_InactiveUser_ThrowsUnauthorizedException()
        {
            // Arrange
            var email = "test@example.com";
            var password = "Test@123";
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new User
            {
                Email = email,
                PasswordHash = passwordHash,
                IsActive = false,  // Inactive
                IsApproved = true
            };

            _userRepositoryMock
                .Setup(x => x.GetByEmailAsync(email))
                .ReturnsAsync(user);

            var loginRequest = new LoginRequestDto
            {
                Email = email,
                Password = password
            };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _authService.LoginAsync(loginRequest)
            );

            exception.Message.Should().Contain("deactivated");
        }
    }
}