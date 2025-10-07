using System.ComponentModel.DataAnnotations;

public class Post
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    public string AuthorId { get; set; } = string.Empty;

    public string AuthorName { get; set; } = string.Empty;

    public string? AttachmentFileName { get; set; }

    public string? AttachmentOriginalName { get; set; }

    public string? AttachmentContentType { get; set; }

    public long? AttachmentSize { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}