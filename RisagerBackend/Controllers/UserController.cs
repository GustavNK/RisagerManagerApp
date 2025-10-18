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
        InvitationCode? invitationCode = await _context.InvitationCodes
            .FirstOrDefaultAsync(ic => ic.Code == userDto.InvitationCode
                                     && !ic.IsUsed
                                     && ic.ExpiryDate > DateTime.UtcNow);

        if (invitationCode == null)
        {
            return BadRequest(new
            {
                message = "Invalid or expired invitation code",
                error = "INVALID_INVITATION_CODE"
            });
        }

        User user = new()
        {
            UserName = userDto.Username,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            PhoneNumber = userDto.PhoneNumber
        };
        IdentityResult result = await _userManager.CreateAsync(user, userDto.Password);

        if (result.Succeeded)
        {
            // Mark invitation code as used
            invitationCode.IsUsed = true;
            invitationCode.UsedDate = DateTime.UtcNow;
            invitationCode.UsedByUserId = user.Id;
            _ = await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProfile), new { id = user.Id },
                new { message = "User registered successfully", userId = user.Id });
        }

        var errors = result.Errors.Select(e => new { code = e.Code, description = e.Description }).ToList();
        return BadRequest(new
        {
            message = "Registration failed",
            errors,
            details = string.Join("; ", result.Errors.Select(e => e.Description))
        });
    }

    /// <summary>
    /// Login user
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        Microsoft.AspNetCore.Identity.SignInResult result = await _signInManager.PasswordSignInAsync(
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
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        User? user = await _userManager.FindByIdAsync(userId);
        return user == null
            ? NotFound()
            : Ok(new
            {
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
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        User? user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        user.FirstName = updateDto.FirstName;
        user.LastName = updateDto.LastName;
        user.PhoneNumber = updateDto.PhoneNumber;
        user.Email = updateDto.Email;

        IdentityResult result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            return Ok(new { message = "Profile updated successfully" });
        }

        var errors = result.Errors.Select(e => new { code = e.Code, description = e.Description }).ToList();
        return BadRequest(new
        {
            message = "Update failed",
            errors
        });
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAllUsers()
    {
        List<User> users = await _userManager.Users.ToListAsync();
        List<UserListDto> userList = [];

        foreach (User? user in users)
        {
            // First, let's check all bookings for this user (for debugging)
            List<Booking> allUserBookings = await _context.Bookings
                .Where(b => b.UserId == user.UserName)
                .ToListAsync();

            // Then get the next future booking
            Booking? nextBooking = await _context.Bookings
                .Where(b => b.UserId == user.UserName && b.StartDate > DateTime.UtcNow)
                .OrderBy(b => b.StartDate)
                .FirstOrDefaultAsync();

            Property? property = nextBooking != null ?
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
        List<Booking> bookings = await _context.Bookings.ToListAsync();
        List<Property> properties = await _context.Properties.ToListAsync();
        List<User> users = await _userManager.Users.ToListAsync();

        return Ok(new
        {
            bookings,
            properties,
            users = users.Select(u => new { u.Id, u.UserName }).ToList(),
            currentTime = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Generate invitation code
    /// </summary>
    [HttpPost("invitation-codes")]
    //[Authorize]
    public async Task<IActionResult> CreateInvitationCode()
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            //return Unauthorized();
        }

        // Generate a unique invitation code
        string code = Guid.NewGuid().ToString("N")[..8].ToUpper();

        InvitationCode invitationCode = new()
        {
            Code = code,
            CreatedDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(7), // Valid for 7 days
            IsUsed = false,
            CreatedByUserId = userId
        };

        _ = _context.InvitationCodes.Add(invitationCode);
        _ = await _context.SaveChangesAsync();


        return new OkObjectResult(
            new InvitationCodeDto
            {
                Id = invitationCode.Id,
                Code = invitationCode.Code,
                CreatedDate = invitationCode.CreatedDate,
                ExpiryDate = invitationCode.ExpiryDate,
                IsUsed = invitationCode.IsUsed,
                UsedDate = invitationCode.UsedDate,
                CreatedByUser = userId
            });
    }
}
