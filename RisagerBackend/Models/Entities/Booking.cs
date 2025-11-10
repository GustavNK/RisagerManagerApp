using System.ComponentModel.DataAnnotations.Schema;

public class Booking
{
    public int Id { get; set; }
    public int PropertyId { get; set; }

    [ForeignKey("User")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int ExpectedPeople { get; set; } = 1;
}
