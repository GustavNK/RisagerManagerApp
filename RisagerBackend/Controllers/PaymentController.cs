using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RisagerBackend.Data;

namespace RisagerBackend.Controllers;

[ApiController]
[Route("api/[controller]s")]
[Tags("Payment")]
public class PaymentController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public PaymentController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Get all payments
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPayments()
    {
        var payments = await _db.Payments.ToListAsync();
        return Ok(payments);
    }

    /// <summary>
    /// Create a new payment
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreatePayment([FromBody] Payment payment)
    {
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPayments), new { id = payment.Id }, payment);
    }
}
