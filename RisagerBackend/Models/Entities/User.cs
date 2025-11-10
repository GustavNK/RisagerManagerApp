using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}