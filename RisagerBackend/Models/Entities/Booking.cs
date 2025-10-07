public class Booking
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int ExpectedPeople { get; set; } = 1;
}
