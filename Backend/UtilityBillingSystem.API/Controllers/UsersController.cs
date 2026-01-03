using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UtilityBillingSystem.Application.DTOs.Users;
using UtilityBillingSystem.Application.Services.Interfaces;

namespace UtilityBillingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,BillingOfficer")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("staff")]
        public async Task<IActionResult> GetAllStaffUsers()
        {
            var users = await _userService.GetAllApprovedStaffUsersAsync();
            return Ok(users);
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingUsers()
        {
            var users = await _userService.GetPendingUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return Ok(user);
        }

        [HttpPost("{id}/assign-role")]
        public async Task<IActionResult> AssignRoleAndApprove(int id, [FromBody] AssignRoleDto request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _userService.AssignRoleAndApproveAsync(id, adminId, request);
            return Ok(user);
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectUser(int id, [FromBody] RejectUserDto request)
        {
            await _userService.RejectUserAsync(id, request);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto request)
        {
            await _userService.UpdateUserAsync(id, request);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeactivateUser(int id)
        {
            await _userService.DeactivateUserAsync(id);
            return NoContent();
        }
    }
}