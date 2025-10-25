using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RisagerBackend.Data;

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
        List<Booking> bookings = await _db.Bookings.ToListAsync();
        List<User> users = await _userManager.Users.ToListAsync();
        List<Property> properties = await _db.Properties.ToListAsync();

        List<BookingWithUserDto> bookingsWithUser = bookings.Select(b =>
        {
            User? user = users.FirstOrDefault(u => u.UserName == b.UserId);
            Property? property = properties.FirstOrDefault(p => p.Id == b.PropertyId);
            string[] fullName = user != null ?
                new[] { user.FirstName, user.LastName }.Where(n => !string.IsNullOrEmpty(n)).ToArray() :
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
                UserFirstName = user?.FirstName ?? "",
                UserLastName = user?.LastName ?? "",
                UserFullName = fullName.Length > 0 ? string.Join(" ", fullName) : b.UserId,
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
            .Where(b => b.PropertyId == propertyId)
            .OrderBy(b => b.StartDate)
            .ToListAsync();

        List<User> users = await _userManager.Users.ToListAsync();
        List<Property> properties = await _db.Properties.ToListAsync();

        List<BookingWithUserDto> bookingsWithUser = bookings.Select(b =>
        {
            User? user = users.FirstOrDefault(u => u.UserName == b.UserId);
            Property? property = properties.FirstOrDefault(p => p.Id == b.PropertyId);
            string[] fullName = user != null ?
                new[] { user.FirstName, user.LastName }.Where(n => !string.IsNullOrEmpty(n)).ToArray() :
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
                UserFirstName = user?.FirstName ?? "",
                UserLastName = user?.LastName ?? "",
                UserFullName = fullName.Length > 0 ? string.Join(" ", fullName) : b.UserId,
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
    public async Task<IActionResult> CreateBooking([FromBody] Booking booking)
    {
        // Check for booking conflicts (overlapping dates for the same property)
        List<Booking> conflictingBookings = await _db.Bookings
            .Where(b => b.PropertyId == booking.PropertyId &&
                       booking.StartDate < b.EndDate && booking.EndDate > b.StartDate)
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
        if (booking.StartDate >= booking.EndDate)
        {
            return BadRequest(new
            {
                error = "Invalid dates",
                message = "End date must be after start date"
            });
        }

        if (booking.StartDate < DateTime.Today)
        {
            return BadRequest(new
            {
                error = "Invalid start date",
                message = "Start date cannot be in the past"
            });
        }

        // Validate expected people count
        if (booking.ExpectedPeople is < 1 or > 20)
        {
            return BadRequest(new
            {
                error = "Invalid people count",
                message = "Expected people must be between 1 and 20"
            });
        }

        _ = _db.Bookings.Add(booking);
        _ = await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBookings), new { id = booking.Id }, booking);
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
