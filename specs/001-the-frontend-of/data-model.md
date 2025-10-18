# Data Model & Design System

## Design System Entities

This document defines the conceptual design entities that will govern the UI/UX improvements. These are not database models but design specifications.

### 1. Color Palette

**Purpose**: Define a cohesive, accessible color system that reflects the "forest retreat" theme of Risager Plantage.

**Primary Colors** (Forest Greens):
- **Primary-50**: Lightest green (backgrounds, subtle highlights)
- **Primary-100**: Very light green (hover states, soft backgrounds)
- **Primary-200**: Light green (borders, dividers)
- **Primary-300**: Medium-light green (secondary borders)
- **Primary-400**: Medium green (icons, secondary actions)
- **Primary-500**: Base green (primary buttons, links, headers)
- **Primary-600**: Dark green (primary button hover states)
- **Primary-700**: Darker green (active states)
- **Primary-800**: Very dark green (header backgrounds, footer)
- **Primary-900**: Darkest green (text on light backgrounds)

**Semantic Colors**:
- **Success**: Green variants (booking confirmations, success messages)
- **Error**: Red variants (validation errors, critical alerts)
- **Warning**: Amber variants (warnings, important notices)
- **Info**: Blue variants (informational messages)

**Neutral Colors**:
- **Background**: Off-white for main backgrounds
- **Foreground**: Dark gray/black for primary text
- **Muted**: Medium gray for secondary text
- **Border**: Light gray for borders and dividers

**Accessibility Requirements**:
- All text-on-background combinations must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Color is never the only indicator of state or meaning (use icons, text, or patterns as well)

### 2. Typography Scale

**Purpose**: Establish consistent, accessible typography throughout the application.

**Font Families**:
- **Body**: System font stack (Arial, Helvetica, sans-serif) - maintains existing choice for Danish language support
- **Headings**: Same as body for consistency
- **Monospace**: For code or technical content (if needed)

**Font Sizes** (in rem, 1rem = 16px):
- **Display**: 3.75rem (60px) - Hero headings
- **H1**: 3rem (48px) - Primary page titles
- **H2**: 2.25rem (36px) - Major sections
- **H3**: 1.875rem (30px) - Subsections
- **H4**: 1.5rem (24px) - Minor headings
- **H5**: 1.25rem (20px) - Small headings
- **H6**: 1.125rem (18px) - Smallest headings
- **Body**: 1rem (16px) - Default text
- **Small**: 0.875rem (14px) - Secondary text, labels
- **Tiny**: 0.75rem (12px) - Captions, footnotes (use sparingly)

**Line Heights**:
- **Headings**: 1.2 (tight)
- **Body**: 1.5 (comfortable reading)
- **Small text**: 1.4

**Font Weights**:
- **Regular**: 400 (body text)
- **Medium**: 500 (emphasis, buttons)
- **Semibold**: 600 (headings, important labels)
- **Bold**: 700 (strong emphasis)

### 3. Spacing Scale

**Purpose**: Create consistent rhythm and hierarchy through standardized spacing.

**Scale** (in rem):
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)
- **4xl**: 6rem (96px)

**Application**:
- Page margins: xl or 2xl
- Section gaps: xl or 2xl
- Card padding: lg or xl
- Element gaps: md or lg
- Tight spacing: sm
- Micro spacing: xs

### 4. Interactive Elements

**Purpose**: Define consistent behavior and appearance for all interactive components.

**Touch Targets**:
- Minimum size: 24×24px (WCAG AA)
- Recommended size: 44×44px (WCAG AAA)
- All buttons, links, and form inputs must meet this requirement
- Add padding to small elements to meet target size

**Button Variants**:
- **Primary**: Solid background with primary color, white text
- **Secondary**: Outlined with primary color border, primary text
- **Tertiary**: Text-only with primary color, no background or border
- **Destructive**: Solid background with error color, white text

**Button States**:
- **Default**: Base appearance
- **Hover**: Slightly darker background (90% opacity)
- **Focus**: 2px outline with primary color, 2px offset
- **Active**: Darker background (80% opacity)
- **Disabled**: 50% opacity, not-allowed cursor, no interaction

**Form Input States**:
- **Default**: Light border (border-200)
- **Focus**: Primary color border (border-500), 2px ring
- **Error**: Error color border (border-error), error message below
- **Disabled**: Gray background, lighter text, not-allowed cursor
- **Success**: Success color border (optional, after validation)

### 5. Component Patterns

**Purpose**: Define reusable component structures and their relationships.

**Basic UI Components** (Atoms):
- Button (primary, secondary, tertiary variants)
- Input (text, email, tel, date, number)
- Label (form labels with proper association)
- Badge (status indicators)
- Avatar/Icon (user representations, decorative icons)
- Alert (success, error, warning, info variants)
- Spinner (loading indicator)

**Layout Components** (Molecules):
- Card (container with consistent padding, border, shadow)
- Header (navigation, logo, user menu)
- Footer (links, copyright, contact info)
- Container (max-width wrapper for content)
- Stack (vertical spacing component)
- Grid (responsive grid layout)

**Feature Components** (Organisms):
- Navigation (header nav with links, responsive menu)
- Form Group (label + input + error message)
- Property Card (house information display)
- Booking Card (booking details display)
- Calendar (date selection with availability)
- User Menu (dropdown with profile, logout)

**Page Templates**:
- **Full-page form**: Centered card with form (login, register)
- **Application layout**: Header + main content + footer
- **List view**: Header + filterable/searchable list
- **Detail view**: Header + detailed content + actions

### 6. Responsive Breakpoints

**Purpose**: Ensure consistent responsive behavior across all pages.

**Breakpoints**:
- **Mobile**: 320px - 639px (1 column, vertical stack)
- **Tablet**: 640px - 1023px (2 columns, hybrid layouts)
- **Desktop**: 1024px - 1279px (multi-column, side-by-side)
- **Large Desktop**: 1280px+ (wide layouts, more whitespace)

**Responsive Strategies**:
- Mobile-first approach (base styles for mobile, media queries for larger screens)
- Navigation collapses to hamburger menu on mobile
- Forms stack vertically on mobile, may be side-by-side on desktop
- Content max-width: 1280px (7xl container)
- Page padding: responsive (4 on mobile, 6 on tablet, 8 on desktop)

### 7. Animation & Transitions

**Purpose**: Provide smooth, performant feedback for user interactions.

**Transition Speeds**:
- **Fast**: 150ms (small UI changes, hover states)
- **Base**: 200ms (most interactions, button clicks)
- **Slow**: 300ms (larger changes, modal open/close)

**Transition Properties**:
- Button hover: background-color, transform
- Input focus: border-color, box-shadow
- Modal open: opacity, transform
- Loading states: opacity, rotate (for spinners)

**Animation Principles**:
- Use CSS transitions for simple state changes
- Prefer transform and opacity (GPU-accelerated)
- Avoid animating layout properties (width, height, margin)
- Respect prefers-reduced-motion user preference

## Design Tokens Summary

These conceptual "entities" will be implemented as CSS variables in the TailwindCSS v4 configuration:

**Colors**: 50-900 scale for primary, plus semantic colors (success, error, warning, info) and neutrals
**Typography**: Font sizes (display, h1-h6, body, small, tiny), line heights, weights
**Spacing**: xs through 4xl scale for consistent rhythm
**Borders**: Radius values (sm, md, lg, full), width values
**Shadows**: sm, md, lg, xl for depth and elevation
**Transitions**: Duration and easing functions

## Accessibility Compliance

Every design entity must support:
- **WCAG AA Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Touch Targets**: 44×44px minimum for all interactive elements
- **Focus Indicators**: Visible 2px outlines with sufficient contrast
- **Text Scaling**: Support up to 200% zoom without loss of functionality
- **Keyboard Navigation**: All interactive elements accessible via Tab, Enter, Space
- **Screen Reader Support**: Semantic HTML, ARIA labels where needed

## Implementation Notes

- All values should be defined as CSS custom properties using TailwindCSS v4 `@theme` directive
- Use OKLCH color format for better color manipulation and accessibility
- Component styles should favor utility classes over custom CSS
- Create React component wrappers for complex UI patterns
- Document color usage in a style guide (which colors for which purposes)
