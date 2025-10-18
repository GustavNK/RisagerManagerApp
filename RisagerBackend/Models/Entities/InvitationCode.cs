using System.ComponentModel.DataAnnotations;

public class InvitationCode
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Code { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public DateTime ExpiryDate { get; set; }

    public bool IsUsed { get; set; }

    public DateTime? UsedDate { get; set; }

    public string? UsedByUserId { get; set; }

    public string? CreatedByUserId { get; set; }
}