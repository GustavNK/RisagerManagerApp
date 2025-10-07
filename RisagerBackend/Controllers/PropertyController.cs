using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RisagerBackend.Data;

namespace RisagerBackend.Controllers;

[ApiController]
[Route("api/[controller]s")]
[Tags("Property")]
public class PropertyController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public PropertyController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Get all properties
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetProperties()
    {
        var properties = await _db.Properties.ToListAsync();
        return Ok(properties);
    }

    /// <summary>
    /// Create a new property
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateProperty([FromBody] Property property)
    {
        _db.Properties.Add(property);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProperties), new { id = property.Id }, property);
    }
}
