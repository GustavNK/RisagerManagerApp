# UI/UX Refactoring Quickstart Guide

## Overview

This guide helps developers understand and implement the UI/UX design system improvements for the Risager Plantage vacation house manager.

## What's Changing?

**Goal**: Transform the frontend from an AI-generated prototype into a professional, accessible, maintainable application while keeping visual changes minimal.

**Key Improvements**:
1. ✅ Consistent design system (colors, typography, spacing)
2. ✅ Reusable UI components (buttons, inputs, cards)
3. ✅ Improved project structure (Next.js 15 best practices)
4. ✅ Accessibility compliance (WCAG AA)
5. ✅ Better code maintainability (separated concerns, reduced duplication)

## Before You Start

### Prerequisites

- Node.js (latest LTS)
- Familiarity with Next.js 15 App Router
- Understanding of TailwindCSS v4
- Basic accessibility knowledge

### Review Key Documents

1. **[research.md](./research.md)** - Next.js 15, TailwindCSS v4, and accessibility best practices
2. **[data-model.md](./data-model.md)** - Design system specifications (colors, typography, components)
3. **[spec.md](./spec.md)** - Feature requirements and success criteria

## Design System at a Glance

### Color Palette

**Forest Retreat Theme** (greens and earth tones):
```css
Primary Colors (Green):
- primary-50 to primary-900: Lightest to darkest greens
- primary-500: Base green (buttons, links)
- primary-800: Dark green (headers, footers)

Semantic Colors:
- success-*: Green shades (confirmations)
- error-*: Red shades (errors, validation)
- warning-*: Amber shades (warnings)
- info-*: Blue shades (informational)

Neutrals:
- background: Off-white (#FAFAFA)
- foreground: Dark gray/black (#171717)
- muted: Medium gray (secondary text)
- border: Light gray (dividers)
```

### Typography

**Scale**:
- Display: 60px (hero headings)
- H1: 48px (page titles)
- H2: 36px (sections)
- H3: 30px (subsections)
- Body: 16px (default)
- Small: 14px (labels)

**Line Heights**:
- Headings: 1.2
- Body: 1.5 (comfortable reading)

### Spacing

**8-point grid system**:
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px, 4xl: 96px

### Touch Targets

**Accessibility requirement**:
- Minimum: 44×44px (WCAG AAA recommended)
- All buttons, links, and inputs must meet this

## Project Structure

### New Organization

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Route group for auth pages
│   │   ├── login/
│   │   └── page.tsx            # Move from app/login/page.tsx
│   ├── (dashboard)/             # Route group for authenticated pages
│   │   ├── booking/
│   │   ├── bookings/
│   │   ├── feed/
│   │   ├── profile/
│   │   └── users/
│   ├── layout.tsx              # Root layout (keep existing)
│   ├── page.tsx                # Home page (keep existing)
│   └── globals.css             # Global styles with design system
│
├── components/                  # NEW: Reusable components
│   ├── ui/                     # Basic UI components
│   │   ├── button.tsx         # Reusable button component
│   │   ├── input.tsx          # Reusable input component
│   │   ├── card.tsx           # Reusable card component
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── index.ts           # Barrel exports
│   │
│   ├── layout/                 # Layout components
│   │   ├── header.tsx         # Shared header component
│   │   ├── footer.tsx         # Shared footer component
│   │   ├── container.tsx      # Max-width container
│   │   └── navigation.tsx     # Navigation component
│   │
│   └── features/               # Feature-specific components
│       ├── booking/
│       │   ├── property-card.tsx
│       │   ├── booking-calendar.tsx
│       │   └── booking-summary.tsx
│       ├── auth/
│       │   ├── login-form.tsx
│       │   └── register-form.tsx
│       └── feed/
│           └── post-card.tsx
│
├── lib/                        # Utilities and shared logic
│   ├── api.ts                 # Keep existing API utils
│   ├── api-client/            # Keep existing client
│   ├── query-provider.tsx     # Keep existing provider
│   ├── utils.ts               # NEW: Utility functions (cn helper)
│   └── constants.ts           # NEW: Constants (color names, etc.)
│
└── hooks/                      # NEW: Custom React hooks
    ├── use-user.ts            # User authentication hook
    └── use-booking.ts         # Booking logic hook
```

### Files to Remove/Clean Up

Based on Next.js 15 best practices, these files are unnecessary:

- ❌ `tailwind.config.js` (if exists) - Not needed in TailwindCSS v4
- ❌ `next.config.js` (duplicate) - Keep only `next.config.ts`
- ❌ Any `_app.tsx` or `_document.tsx` (App Router uses layout.tsx)

## Implementation Phases

### Phase 1: Design System Foundation (Priority 1)

**Goal**: Establish the design system without breaking existing functionality.

**Tasks**:
1. Update `globals.css` with TailwindCSS v4 design tokens
2. Create color palette using OKLCH format
3. Define typography scale
4. Set up spacing and sizing variables
5. Test that existing pages still render correctly

**Outcome**: Design system defined, ready for component refactoring.

### Phase 2: Basic UI Components (Priority 1)

**Goal**: Create reusable UI components (buttons, inputs, cards).

**Tasks**:
1. Create `components/ui/button.tsx` with variants (primary, secondary, tertiary)
2. Create `components/ui/input.tsx` with all states (default, focus, error, disabled)
3. Create `components/ui/card.tsx` as compound component
4. Create `components/ui/alert.tsx` for success/error messages
5. Create `lib/utils.ts` with `cn()` helper function
6. Document usage examples for each component

**Outcome**: Reusable UI components ready to replace inline styles.

### Phase 3: Layout Components (Priority 1)

**Goal**: Extract common layout patterns (header, footer, navigation).

**Tasks**:
1. Create `components/layout/header.tsx` from existing page headers
2. Create `components/layout/footer.tsx` from home page footer
3. Create `components/layout/navigation.tsx` for nav links
4. Create `components/layout/container.tsx` for max-width wrapper
5. Update `app/layout.tsx` to use new header/footer components

**Outcome**: Consistent layout across all pages.

### Phase 4: Page Refactoring (Priority 2)

**Goal**: Refactor existing pages to use new components and structure.

**Tasks**:
1. Refactor `login/page.tsx` to use Button, Input, Card components
2. Refactor `booking/page.tsx` to use layout components and extract calendar
3. Refactor `bookings/page.tsx` to use Card and Button components
4. Refactor `feed/page.tsx` to use layout and card components
5. Refactor `profile/page.tsx` to use form components
6. Refactor `users/page.tsx` to use list and card patterns

**Outcome**: All pages use design system components, reduced code duplication by 80%.

### Phase 5: Feature Components (Priority 2)

**Goal**: Extract complex, feature-specific logic into dedicated components.

**Tasks**:
1. Create `components/features/booking/booking-calendar.tsx` (extract from booking page)
2. Create `components/features/booking/property-card.tsx` (house selection)
3. Create `components/features/auth/login-form.tsx` (extract from login page)
4. Create `components/features/auth/register-form.tsx` (extract from login page)
5. Create `components/features/feed/post-card.tsx` (if applicable)

**Outcome**: Clean separation of concerns, easier to test and maintain.

### Phase 6: Route Groups & Organization (Priority 3)

**Goal**: Improve project structure with Next.js 15 conventions.

**Tasks**:
1. Create `app/(auth)/` route group
2. Move `login/page.tsx` to `(auth)/login/page.tsx`
3. Create `app/(dashboard)/` route group
4. Move authenticated pages to `(dashboard)/`
5. Clean up unnecessary files (see list above)
6. Update imports across codebase

**Outcome**: Modern Next.js 15 project structure.

### Phase 7: Accessibility Audit (Priority 1)

**Goal**: Ensure WCAG AA compliance across all pages.

**Tasks**:
1. Run Lighthouse accessibility audit on all pages
2. Verify color contrast ratios (minimum 4.5:1)
3. Verify touch target sizes (minimum 44×44px)
4. Test keyboard navigation (Tab, Enter, Space)
5. Add focus indicators to all interactive elements
6. Fix any identified issues

**Outcome**: 100% WCAG AA compliance.

### Phase 8: Testing & Documentation (Priority 3)

**Goal**: Validate improvements and document the design system.

**Tasks**:
1. User testing with family members (task completion time)
2. Performance testing (Lighthouse, Web Vitals)
3. Cross-browser testing (Chrome, Safari, Firefox, Edge)
4. Mobile testing (various screen sizes)
5. Document component usage in Storybook or similar (optional)

**Outcome**: Validated improvements, documented system.

## Quick Reference: Common Patterns

### Using the cn() Utility

```tsx
import { cn } from '@/lib/utils'

// Merge Tailwind classes safely
<div className={cn('base-class', 'another-class', someCondition && 'conditional-class')} />
```

### Creating a Reusable Button

```tsx
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        // Variant styles
        {
          'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
          'border-2 border-primary-600 text-primary-600 hover:bg-primary-50': variant === 'secondary',
          'text-primary-600 hover:bg-primary-50': variant === 'tertiary',
        },
        // Size styles
        {
          'px-3 py-2 text-sm h-9': size === 'sm',
          'px-4 py-3 text-base h-11': size === 'md',
          'px-6 py-4 text-lg h-14': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}
```

### Using the Reusable Components

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function MyPage() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Login</Card.Title>
      </Card.Header>
      <Card.Content>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button variant="primary">Login</Button>
      </Card.Content>
    </Card>
  )
}
```

## Testing Checklist

Before marking a page as "complete", verify:

- ✅ Uses components from `components/ui/` (no inline duplicate styles)
- ✅ All text meets 4.5:1 contrast ratio
- ✅ All buttons/links are at least 44×44px
- ✅ Focus indicators are visible (test with Tab key)
- ✅ Works on mobile (320px width)
- ✅ Works on desktop (1920px width)
- ✅ Keyboard navigation works (Tab, Enter, Space)
- ✅ Looks consistent with other pages (same colors, fonts, spacing)

## Common Pitfalls to Avoid

❌ **Don't** create one-off component styles inline - use the reusable components
❌ **Don't** remove the existing functionality - only change presentation
❌ **Don't** skip accessibility testing - it's a core requirement
❌ **Don't** use arbitrary colors - use the design system palette
❌ **Don't** forget to update imports when moving files
❌ **Don't** make buttons/links smaller than 44×44px
❌ **Don't** remove focus indicators (bad for accessibility)

✅ **Do** use the design system components
✅ **Do** test keyboard navigation
✅ **Do** verify color contrast ratios
✅ **Do** keep existing Danish language text
✅ **Do** maintain backward compatibility with data
✅ **Do** ask for help when stuck

## Getting Help

**Design System Questions**: Refer to `data-model.md`
**Technical Questions**: Refer to `research.md`
**Component Examples**: Check existing pages after they're refactored
**Accessibility Questions**: Use WebAIM Contrast Checker, WAVE tool

## Success Metrics

Track progress against success criteria from spec.md:

- **SC-001**: 100% text meets WCAG AA contrast (use contrast checker)
- **SC-002**: 90% first-attempt task completion (user testing)
- **SC-003**: 100% colors from defined palette (code audit)
- **SC-004**: 80% reduction in duplicated styles (before/after LOC comparison)
- **SC-005**: 5 minute time-to-first-booking (user testing)
- **SC-006**: 100% touch targets meet 44px minimum (Lighthouse audit)
- **SC-007**: 50% faster development time for new pages (time tracking)
- **SC-008**: Zero inconsistent styles (visual audit)
- **SC-009**: Core content visible within 3 seconds (Lighthouse)
- **SC-010**: Improved user satisfaction (family feedback)

## Next Steps

1. Review all documentation in `specs/001-the-frontend-of/`
2. Run `/speckit.tasks` to generate actionable task breakdown
3. Start with Phase 1 (Design System Foundation)
4. Implement phases sequentially
5. Test continuously as you build
6. Get feedback from family members

---

**Remember**: The goal is not to redesign the application, but to make it more professional, accessible, and maintainable while keeping the visual changes minimal.
