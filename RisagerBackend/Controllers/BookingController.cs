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
    public async Task<IActionResult> GetBookings()
    {
        var bookings = await _db.Bookings.ToListAsync();
        var users = await _userManager.Users.ToListAsync();
        var properties = await _db.Properties.ToListAsync();

        var bookingsWithUser = bookings.Select(b =>
        {
            var user = users.FirstOrDefault(u => u.UserName == b.UserId);
            var property = properties.FirstOrDefault(p => p.Id == b.PropertyId);
            var fullName = user != null ?
                new[] { user.FirstName, user.LastName }.Where(n => !string.IsNullOrEmpty(n)).ToArray() :
                Array.Empty<string>();

            var nights = (b.EndDate - b.StartDate).Days;
            var pricePerPersonPerNight = 30m; // Fixed price: 30 DKK per person per night
            var totalPrice = nights * pricePerPersonPerNight * b.ExpectedPeople;

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
    /// Get bookings by property
    /// </summary>
    [HttpGet("property/{propertyId}")]
    [ProducesResponseType(typeof(List<BookingWithUserDto>), 200)]
    public async Task<IActionResult> GetBookingsByProperty(int propertyId)
    {
        var bookings = await _db.Bookings
            .Where(b => b.PropertyId == propertyId)
            .OrderBy(b => b.StartDate)
            .ToListAsync();

        var users = await _userManager.Users.ToListAsync();
        var properties = await _db.Properties.ToListAsync();

        var bookingsWithUser = bookings.Select(b =>
        {
            var user = users.FirstOrDefault(u => u.UserName == b.UserId);
            var property = properties.FirstOrDefault(p => p.Id == b.PropertyId);
            var fullName = user != null ?
                new[] { user.FirstName, user.LastName }.Where(n => !string.IsNullOrEmpty(n)).ToArray() :
                Array.Empty<string>();

            var nights = (b.EndDate - b.StartDate).Days;
            var pricePerPersonPerNight = 30m; // Fixed price: 30 DKK per person per night
            var totalPrice = nights * pricePerPersonPerNight * b.ExpectedPeople;

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
        var conflictingBookings = await _db.Bookings
            .Where(b => b.PropertyId == booking.PropertyId &&
                       (booking.StartDate < b.EndDate && booking.EndDate > b.StartDate))
            .ToListAsync();

        if (conflictingBookings.Any())
        {
            return Conflict(new {
                error = "Booking conflict detected",
                message = "The selected dates overlap with an existing booking for this property",
                conflictingBookings = conflictingBookings.Select(b => new {
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
            return BadRequest(new {
                error = "Invalid dates",
                message = "End date must be after start date"
            });
        }

        if (booking.StartDate < DateTime.Today)
        {
            return BadRequest(new {
                error = "Invalid start date",
                message = "Start date cannot be in the past"
            });
        }

        // Validate expected people count
        if (booking.ExpectedPeople < 1 || booking.ExpectedPeople > 20)
        {
            return BadRequest(new {
                error = "Invalid people count",
                message = "Expected people must be between 1 and 20"
            });
        }

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBookings), new { id = booking.Id }, booking);
    }

    /// <summary>
    /// Delete a booking
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null)
        {
            return NotFound(new {
                error = "Booking not found",
                message = $"No booking found with ID {id}"
            });
        }

        _db.Bookings.Remove(booking);
        await _db.SaveChangesAsync();
        return Ok(new {
            message = "Booking deleted successfully",
            deletedBooking = new {
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
