# Missing Features Analysis
## Risager Plantage Family Property Booking System - MVP

**Document Version:** 1.0
**Date:** 2025-11-10

---

## Critical Priority - Must Have for MVP

### 1. Password Reset Flow
- No way for users to recover forgotten passwords
- **Needs:** Email service, reset token generation, `/reset-password` page

### 2. Email Notifications
- Users not notified about bookings, conflicts, or cancellations
- **Needs:** Email service integration, templates for booking confirmations, reminders, cancellations

### 3. Logout Functionality
- Frontend clears localStorage but server session remains valid
- **Needs:** Backend logout endpoint that invalidates ASP.NET Identity cookie

### 4. Audit Trail
- No tracking of who created/modified/deleted records
- **Needs:** AuditLog table, logging middleware for all actions

---

## High Priority - Strongly Recommended

### 5. Booking Modification
- Users must delete and recreate to change dates
- **Needs:** `PUT /api/bookings/{id}` endpoint with authorization

### 6. Admin Dashboard
- No centralized management interface
- **Needs:** Admin pages for user management, booking overview, statistics

### 7. Calendar View
- Only list view available, hard to see availability
- **Needs:** Calendar component showing bookings by property

### 8. Conflict Prevention UI
- Users learn about conflicts only after submission
- **Needs:** Real-time availability check as dates are selected

### 9. Rate Limiting
- All endpoints accept unlimited requests (brute force risk)
- **Needs:** AspNetCoreRateLimit package configured

### 10. Pagination
- All endpoints return ALL records (performance issue)
- **Needs:** Page/pageSize parameters on list endpoints

---

## Medium Priority - Nice to Have

### 11. Search and Filter
- No way to search bookings, users, or posts
- **Needs:** Filter controls on list pages

### 12. Export Functionality
- No way to export data for reporting
- **Needs:** CSV export for bookings, payments, users

### 13. Booking Approval Workflow
- All bookings instantly confirmed
- **Needs:** Pending/Approved/Rejected status, admin approval interface

### 14. User Roles Beyond Admin
- Only Admin or regular user
- **Needs:** Property Manager role with limited permissions

### 15. Mobile Optimizations
- Basic responsive design, not optimized for mobile
- **Needs:** Mobile-friendly navigation, larger tap targets

---

## Low Priority - Future Enhancements

- Photo gallery for properties
- Weather integration
- Maintenance schedule (block dates for repairs)
- Two-factor authentication
- Push notifications

---

## Implementation Roadmap

**Phase 1 (Week 1-2):** Fix security issues + logout + audit trail + password reset
**Phase 2 (Week 3-4):** Email notifications + booking modification + calendar view + rate limiting
**Phase 3 (Week 5-6):** Admin dashboard + search/filter + export
**Phase 4 (Month 2+):** Approval workflow + mobile optimization + future features

**Total Effort Estimate:** ~170 hours (4-5 weeks full-time)
