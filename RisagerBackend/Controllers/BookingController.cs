using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RisagerBackend.Data;
using System.Security.Claims;

namespace RisagerBackend.Controllers;

[ApiController]
[Route("api/[controller]s")]
[Tags("Booking")]
public class BookingController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<User> _userManager;

    public BookingController(ApplicationDbContext db, UserManager<User> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    /// <summary>
    /// Get all bookings
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<BookingWithUserDto>), 200)]
    public async Task<List<BookingWithUserDto>> GetBookings()
    {
        List<Booking> bookings = await _db.Bookings
            .Include(b => b.User)
            .ToListAsync();

        List<BookingWithUserDto> bookingsWithUser = bookings.Select(b =>
        {
            string[] fullName = b.User != null ?
                new[] { b.User.FirstName, b.User.LastName }.Where(n => !string.IsNullOrEmpty(n)).ToArray() :
                Array.Empty<string>();

            int nights = (b.EndDate - b.StartDate).Days;
            decimal pricePerPersonPerNight = 30m; // Fixed price: 30 DKK per person per night
            decimal totalPrice = nights * pricePerPersonPerNight * b.ExpectedPeople;

            return new BookingWithUserDto
            {
                Id = b.Id,
                PropertyId = b.PropertyId,
                UserId = b.UserId,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                ExpectedPeople = b.ExpectedPeople,
                UserFirstName = b.User?.FirstName ?? "",
                UserLastName = b.User?.LastName ?? "",
                UserFullName = fullName.Length > 0 ? string.Join(" ", fullName) : b.User?.Email ?? b.UserId,
                TotalPrice = totalPrice,
                Nights = nights
            };
        }).ToList();

        return bookingsWithUser;
    }

    /// <summary>
    /// Get bookings by property
    /// </summary>
    [HttpGet("property/{propertyId}")]
    [ProducesResponseType(typeof(List<BookingWithUserDto>), 200)]
    public async Task<IActionResult> GetBookingsByProperty(int propertyId)
    {
        List<Booking> bookings = await _db.Bookings
            .Include(b => b.User)
            .Where(b => b.PropertyId == propertyId)
            .OrderBy(b => b.StartDate)
            .ToListAsync();

        List<BookingWithUserDto> bookingsWithUser = bookings.Select(b =>
        {
            string[] fullName = b.User != null ?
                new[] { b.User.FirstName, b.User.LastName }.Where(n => !string.IsNullOrEmpty(n)).ToArray() :
                Array.Empty<string>();

            int nights = (b.EndDate - b.StartDate).Days;
            decimal pricePerPersonPerNight = 30m; // Fixed price: 30 DKK per person per night
            decimal totalPrice = nights * pricePerPersonPerNight * b.ExpectedPeople;

            return new BookingWithUserDto
            {
                Id = b.Id,
                PropertyId = b.PropertyId,
                UserId = b.UserId,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                ExpectedPeople = b.ExpectedPeople,
                UserFirstName = b.User?.FirstName ?? "",
                UserLastName = b.User?.LastName ?? "",
                UserFullName = fullName.Length > 0 ? string.Join(" ", fullName) : b.User?.Email ?? b.UserId,
                TotalPrice = totalPrice,
                Nights = nights
            };
        }).ToList();

        return Ok(bookingsWithUser);
    }

    /// <summary>
    /// Get future bookings (from today onwards)
    /// </summary>
    [HttpGet("future")]
    [ProducesResponseType(typeof(List<BookingWithUserDto>), 200)]
    public async Task<IActionResult> GetFutureBookings()
    {
        DateTime today = DateTime.UtcNow;
        List<Booking> bookings = await _db.Bookings
            .Include(b => b.User)
            .Where(b => b.EndDate >= today)
            .OrderBy(b => b.StartDate)
            .ToListAsync();

        List<BookingWithUserDto> bookingsWithUser = bookings.Select(b =>
        {
            string[] fullName = b.User != null ?
                new[] { b.User.FirstName, b.User.LastName }.Where(n => !string.IsNullOrEmpty(n)).ToArray() :
                Array.Empty<string>();

            int nights = (b.EndDate - b.StartDate).Days;
            decimal pricePerPersonPerNight = 30m; // Fixed price: 30 DKK per person per night
            decimal totalPrice = nights * pricePerPersonPerNight * b.ExpectedPeople;

            return new BookingWithUserDto
            {
                Id = b.Id,
                PropertyId = b.PropertyId,
                UserId = b.UserId,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                ExpectedPeople = b.ExpectedPeople,
                UserFirstName = b.User?.FirstName ?? "",
                UserLastName = b.User?.LastName ?? "",
                UserFullName = fullName.Length > 0 ? string.Join(" ", fullName) : b.User?.Email ?? b.UserId,
                TotalPrice = totalPrice,
                Nights = nights
            };
        }).ToList();

        return Ok(bookingsWithUser);
    }

    /// <summary>
    /// Get future bookings by property (from today onwards)
    /// </summary>
    [HttpGet("property/{propertyId}/future")]
    [ProducesResponseType(typeof(List<BookingWithUserDto>), 200)]
    public async Task<IActionResult> GetFutureBookingsByProperty(int propertyId)
    {
        DateTime today = DateTime.UtcNow;
        List<Booking> bookings = await _db.Bookings
            .Include(b => b.User)
            .Where(b => b.PropertyId == propertyId && b.EndDate >= today)
            .OrderBy(b => b.StartDate)
            .ToListAsync();

        List<BookingWithUserDto> bookingsWithUser = bookings.Select(b =>
        {
            string[] fullName = b.User != null ?
                new[] { b.User.FirstName, b.User.LastName }.Where(n => !string.IsNullOrEmpty(n)).ToArray() :
                Array.Empty<string>();

            int nights = (b.EndDate - b.StartDate).Days;
            decimal pricePerPersonPerNight = 30m; // Fixed price: 30 DKK per person per night
            decimal totalPrice = nights * pricePerPersonPerNight * b.ExpectedPeople;

            return new BookingWithUserDto
            {
                Id = b.Id,
                PropertyId = b.PropertyId,
                UserId = b.UserId,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                ExpectedPeople = b.ExpectedPeople,
                UserFirstName = b.User?.FirstName ?? "",
                UserLastName = b.User?.LastName ?? "",
                UserFullName = fullName.Length > 0 ? string.Join(" ", fullName) : b.User?.Email ?? b.UserId,
                TotalPrice = totalPrice,
                Nights = nights
            };
        }).ToList();

        return Ok(bookingsWithUser);
    }

    /// <summary>
    /// Create a new booking
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto bookingDto)
    {
        // Get the currently logged-in user
        string? currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null)
        {
            return Unauthorized(new
            {
                error = "Not authenticated",
                message = "You must be logged in to create a booking"
            });
        }

        User? currentUser = await _userManager.FindByIdAsync(currentUserId);
        if (currentUser == null)
        {
            return BadRequest(new
            {
                error = "User not found",
                message = "Current user not found"
            });
        }

        User? user;

        // If email is provided, this is an admin booking on behalf of another user
        // Otherwise, use the currently logged-in user
        if (!string.IsNullOrEmpty(bookingDto.UserEmail))
        {
            // Check if current user is admin
            bool isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin");
            if (!isAdmin)
            {
                return Forbid("Only administrators can create bookings on behalf of other users");
            }

            // Look up the user to book for
            user = await _userManager.FindByEmailAsync(bookingDto.UserEmail);
            if (user == null)
            {
                return BadRequest(new
                {
                    error = "User not found",
                    message = $"No user found with email: {bookingDto.UserEmail}"
                });
            }
        }
        else
        {
            // Use the currently logged-in user
            user = currentUser;
        }

        // Check for booking conflicts (overlapping dates for the same property)
        List<Booking> conflictingBookings = await _db.Bookings
            .Where(b => b.PropertyId == bookingDto.PropertyId &&
                       bookingDto.StartDate < b.EndDate && bookingDto.EndDate > b.StartDate)
            .ToListAsync();

        if (conflictingBookings.Any())
        {
            return Conflict(new
            {
                error = "Booking conflict detected",
                message = "The selected dates overlap with an existing booking for this property",
                conflictingBookings = conflictingBookings.Select(b => new
                {
                    id = b.Id,
                    startDate = b.StartDate,
                    endDate = b.EndDate,
                    userId = b.UserId
                })
            });
        }

        // Validate dates
        if (bookingDto.StartDate >= bookingDto.EndDate)
        {
            return BadRequest(new
            {
                error = "Invalid dates",
                message = "End date must be after start date"
            });
        }

        if (bookingDto.StartDate < DateTime.Today)
        {
            return BadRequest(new
            {
                error = "Invalid start date",
                message = "Start date cannot be in the past"
            });
        }

        // Validate expected people count
        if (bookingDto.ExpectedPeople is < 1 or > 20)
        {
            return BadRequest(new
            {
                error = "Invalid people count",
                message = "Expected people must be between 1 and 20"
            });
        }

        // Create the booking
        Booking booking = new()
        {
            PropertyId = bookingDto.PropertyId,
            User = user,
            StartDate = bookingDto.StartDate,
            EndDate = bookingDto.EndDate,
            ExpectedPeople = bookingDto.ExpectedPeople
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        return new OkObjectResult($"New bookings created at {bookingDto.StartDate.ToShortDateString()} to {bookingDto.EndDate.ToShortDateString()}");
    }

    /// <summary>
    /// Delete a booking
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        Booking? booking = await _db.Bookings.FindAsync(id);
        //string? currentUserName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //string? currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
        //if (booking?.UserId != currentUserName || currentUserRole == "Admin")
        //{
        //    return Forbid("The user trying to delete this booking is not the one who created it");
        //}

        if (booking == null)
        {
            return NotFound(new
            {
                error = "Booking not found",
                message = $"No booking found with ID {id}"
            });
        }

        _ = _db.Bookings.Remove(booking);
        _ = await _db.SaveChangesAsync();
        return Ok(new
        {
            message = "Booking deleted successfully",
            deletedBooking = new
            {
                id = booking.Id,
                propertyId = booking.PropertyId,
                userId = booking.UserId,
                startDate = booking.StartDate,
                endDate = booking.EndDate,
                expectedPeople = booking.ExpectedPeople
            }
        });
    }
}
