using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RisagerBackend.Data;
using RisagerBackend.Services;

namespace RisagerBackend.Controllers;

[ApiController]
[Route("api/[controller]s")]
[Tags("Post")]
public class PostController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IBlobStorageService _blobService;

    public PostController(ApplicationDbContext db, IBlobStorageService blobService)
    {
        _db = db;
        _blobService = blobService;
    }

    /// <summary>
    /// Get all posts
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPosts()
    {
        var posts = await _db.Posts
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
        return Ok(posts);
    }

    /// <summary>
    /// Create a new post
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto postDto)
    {
        var post = new Post
        {
            Title = postDto.Title,
            Content = postDto.Content,
            AuthorId = "current-user", // TODO: Get from authenticated user
            AuthorName = postDto.AuthorName,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPosts), new { id = post.Id }, post);
    }

    /// <summary>
    /// Create a new post with file attachment
    /// </summary>
    [HttpPost("with-file")]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> CreatePostWithFile([FromForm] string title, [FromForm] string content, [FromForm] string authorName, IFormFile? file)
    {
        if (string.IsNullOrEmpty(title) || string.IsNullOrEmpty(content) || string.IsNullOrEmpty(authorName))
        {
            return BadRequest("Title, content, and author name are required");
        }

        var post = new Post
        {
            Title = title,
            Content = content,
            AuthorId = "current-user", // TODO: Get from authenticated user
            AuthorName = authorName,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (file != null && file.Length > 0)
        {
            // Validate file size (max 10MB)
            if (file.Length > 10 * 1024 * 1024)
            {
                return BadRequest("File size cannot exceed 10MB");
            }

            // Upload file to blob storage
            var fileName = await _blobService.UploadFileAsync(file);
            post.AttachmentFileName = fileName;
            post.AttachmentOriginalName = file.FileName;
            post.AttachmentContentType = file.ContentType;
            post.AttachmentSize = file.Length;
        }

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPosts), new { id = post.Id }, post);
    }

    /// <summary>
    /// Download post attachment
    /// </summary>
    [HttpGet("download/{postId}")]
    public async Task<IActionResult> DownloadAttachment(int postId)
    {
        var post = await _db.Posts.FindAsync(postId);
        if (post?.AttachmentFileName == null)
        {
            return NotFound("Post or attachment not found");
        }

        try
        {
            var download = await _blobService.DownloadFileAsync(post.AttachmentFileName);
            var stream = download.Content;

            return File(
                stream,
                post.AttachmentContentType ?? "application/octet-stream",
                post.AttachmentOriginalName ?? post.AttachmentFileName
            );
        }
        catch
        {
            return NotFound("File not found in storage");
        }
    }

    /// <summary>
    /// Delete a post
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post == null)
        {
            return NotFound(new {
                error = "Post not found",
                message = $"No post found with ID {id}"
            });
        }

        _db.Posts.Remove(post);
        await _db.SaveChangesAsync();
        return Ok(new {
            message = "Post deleted successfully",
            deletedPost = new {
                id = post.Id,
                title = post.Title,
                authorName = post.AuthorName
            }
        });
    }
}
