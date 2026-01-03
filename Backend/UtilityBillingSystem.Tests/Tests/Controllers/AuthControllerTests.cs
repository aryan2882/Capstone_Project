using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UtilityBillingSystem.API.Controllers;
using UtilityBillingSystem.Application.DTOs.Auth;
using UtilityBillingSystem.Application.Services.Interfaces;
using Xunit;

namespace UtilityBillingSystem.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _authServiceMock;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _authServiceMock = new Mock<IAuthService>();
            _controller = new AuthController(_authServiceMock.Object);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOkResult()
        {
            // Arrange
            var loginRequest = new LoginRequestDto
            {
                Email = "test@example.com",
                Password = "Test@123"
            };

            var loginResponse = new LoginResponseDto
            {
                Token = "mock-token",
                UserId = 1,
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                Role = "Admin"
            };

            _authServiceMock
                .Setup(x => x.LoginAsync(loginRequest))
                .ReturnsAsync(loginResponse);

            // Act
            var result = await _controller.Login(loginRequest);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var response = okResult.Value.Should().BeOfType<LoginResponseDto>().Subject;
            response.Token.Should().Be("mock-token");
            response.Email.Should().Be("test@example.com");
        }

        [Fact]
        public async Task Register_ValidData_ReturnsOkResult()
        {
            // Arrange
            var registerRequest = new UserRegisterDto
            {
                FirstName = "John",
                LastName = "Doe",
                FatherName = "Robert Doe",
                Email = "john@example.com",
                Phone = "9876543210",
                Address = "123 Main St",
                City = "Jamshedpur",
                State = "Jharkhand",
                PinCode = "831001",
                IdProofType = "Aadhaar",
                IdProofNumber = "1234-5678-9012",
                Password = "John@123",
                ConfirmPassword = "John@123"
            };

            // Act
            var result = await _controller.Register(registerRequest);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            _authServiceMock.Verify(x => x.RegisterAsync(registerRequest), Times.Once);
        }
    }
}