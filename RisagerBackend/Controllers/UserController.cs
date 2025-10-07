using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RisagerBackend.Data;
using System.Security.Claims;

namespace RisagerBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("User")]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ApplicationDbContext _context;

    public UserController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _context = context;
    }

    /// <summary>
    /// Register a new user with an invitation code
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto userDto)
    {
        // Validate invitation code
        var invitationCode = await _context.InvitationCodes
            .FirstOrDefaultAsync(ic => ic.Code == userDto.InvitationCode
                                     && !ic.IsUsed
                                     && ic.ExpiryDate > DateTime.Now);

        if (invitationCode == null)
        {
            return BadRequest(new {
                message = "Invalid or expired invitation code",
                error = "INVALID_INVITATION_CODE"
            });
        }

        var user = new User {
            UserName = userDto.Username,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            PhoneNumber = userDto.PhoneNumber
        };
        var result = await _userManager.CreateAsync(user, userDto.Password);

        if (result.Succeeded)
        {
            // Mark invitation code as used
            invitationCode.IsUsed = true;
            invitationCode.UsedDate = DateTime.Now;
            invitationCode.UsedByUserId = user.Id;
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProfile), new { id = user.Id },
                new { message = "User registered successfully", userId = user.Id });
        }

        var errors = result.Errors.Select(e => new { code = e.Code, description = e.Description }).ToList();
        return BadRequest(new {
            message = "Registration failed",
            errors = errors,
            details = string.Join("; ", result.Errors.Select(e => e.Description))
        });
    }

    /// <summary>
    /// Login user
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var result = await _signInManager.PasswordSignInAsync(
            loginDto.Username,
            loginDto.Password,
            loginDto.RememberMe,
            false);

        return result.Succeeded ? Ok() : Unauthorized();
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound();

        return Ok(new {
            username = user.UserName,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            phoneNumber = user.PhoneNumber
        });
    }

    /// <summary>
    /// Update current user profile
    /// </summary>
    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto updateDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound();

        user.FirstName = updateDto.FirstName;
        user.LastName = updateDto.LastName;
        user.PhoneNumber = updateDto.PhoneNumber;
        user.Email = updateDto.Email;

        var result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            return Ok(new { message = "Profile updated successfully" });
        }

        var errors = result.Errors.Select(e => new { code = e.Code, description = e.Description }).ToList();
        return BadRequest(new {
            message = "Update failed",
            errors = errors
        });
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        var userList = new List<UserListDto>();

        foreach (var user in users)
        {
            // First, let's check all bookings for this user (for debugging)
            var allUserBookings = await _context.Bookings
                .Where(b => b.UserId == user.UserName)
                .ToListAsync();

            // Then get the next future booking
            var nextBooking = await _context.Bookings
                .Where(b => b.UserId == user.UserName && b.StartDate > DateTime.Now)
                .OrderBy(b => b.StartDate)
                .FirstOrDefaultAsync();

            var property = nextBooking != null ?
                await _context.Properties.FirstOrDefaultAsync(p => p.Id == nextBooking.PropertyId) : null;

            // Debug: Log the user ID and booking count
            Console.WriteLine($"User: {user.UserName} (ID: {user.Id}), Total bookings: {allUserBookings.Count}, Future bookings: {(nextBooking != null ? 1 : 0)}");

            userList.Add(new UserListDto
            {
                Id = user.Id,
                Username = user.UserName ?? "",
                FirstName = user.FirstName ?? "",
                LastName = user.LastName ?? "",
                PhoneNumber = user.PhoneNumber ?? "",
                Email = user.Email ?? "",
                NextBookingDate = nextBooking?.StartDate,
                NextBookingPropertyName = property?.Name
            });
        }

        return Ok(userList);
    }

    /// <summary>
    /// Debug endpoint for bookings
    /// </summary>
    [HttpGet("debug-bookings")]
    [Authorize]
    public async Task<IActionResult> DebugBookings()
    {
        var bookings = await _context.Bookings.ToListAsync();
        var properties = await _context.Properties.ToListAsync();
        var users = await _userManager.Users.ToListAsync();

        return Ok(new {
            bookings = bookings,
            properties = properties,
            users = users.Select(u => new { u.Id, u.UserName }).ToList(),
            currentTime = DateTime.Now
        });
    }

    /// <summary>
    /// Generate invitation code
    /// </summary>
    [HttpPost("invitation-codes")]
    [Authorize]
    public async Task<IActionResult> CreateInvitationCode()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        // Generate a unique invitation code
        var code = Guid.NewGuid().ToString("N")[..8].ToUpper();

        var invitationCode = new InvitationCode
        {
            Code = code,
            CreatedDate = DateTime.Now,
            ExpiryDate = DateTime.Now.AddDays(7), // Valid for 7 days
            IsUsed = false,
            CreatedByUserId = userId
        };

        _context.InvitationCodes.Add(invitationCode);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInvitationCodes), new { id = invitationCode.Id },
            new InvitationCodeDto
            {
                Id = invitationCode.Id,
                Code = invitationCode.Code,
                CreatedDate = invitationCode.CreatedDate,
                ExpiryDate = invitationCode.ExpiryDate,
                IsUsed = invitationCode.IsUsed,
                UsedDate = invitationCode.UsedDate,
                UsedByUserId = invitationCode.UsedByUserId,
                CreatedByUserId = invitationCode.CreatedByUserId
            });
    }

    /// <summary>
    /// Get invitation codes created by current user
    /// </summary>
    [HttpGet("invitation-codes")]
    [Authorize]
    public async Task<IActionResult> GetInvitationCodes()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var invitationCodes = await _context.InvitationCodes
            .Where(ic => ic.CreatedByUserId == userId)
            .OrderByDescending(ic => ic.CreatedDate)
            .ToListAsync();

        var result = invitationCodes.Select(ic => new InvitationCodeDto
        {
            Id = ic.Id,
            Code = ic.Code,
            CreatedDate = ic.CreatedDate,
            ExpiryDate = ic.ExpiryDate,
            IsUsed = ic.IsUsed,
            UsedDate = ic.UsedDate,
            UsedByUserId = ic.UsedByUserId,
            CreatedByUserId = ic.CreatedByUserId
        }).ToList();

        return Ok(result);
    }
}
