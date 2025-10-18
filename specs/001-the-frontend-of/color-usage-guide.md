# Color Usage Guide

**Project**: Risager Plantage - Family Vacation House Manager
**Feature**: UI/UX Design System and Code Refactoring
**Version**: 1.0
**Date**: 2025-10-11

## Purpose

This guide documents when and how to use each color from the design system palette. It serves as a reference for developers implementing new features or modifying existing UI elements.

## Design Philosophy

**Forest Retreat Theme**: The color palette reflects the natural, calming environment of Risager Plantage (Danish forest retreat). All colors are chosen to create a warm, inviting atmosphere appropriate for a vacation rental booking system.

**Key Principles**:
1. **Consistency**: Use the same color for the same purpose everywhere
2. **Accessibility**: Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
3. **Semantic Meaning**: Colors should convey meaning (green = success, red = error)
4. **Hierarchy**: Use color to establish visual hierarchy and importance

---

## Primary Colors (Forest Green)

### When to Use

Primary colors are the core of the brand identity and should be used for:
- **Main actions**: Primary buttons, important links
- **Brand elements**: Headers, logos, navigation
- **Interactive elements**: Hover states, active states
- **Key UI components**: Cards, borders, focus rings

### Color Scale

| Color | Hex Equivalent | Use Case |
|-------|---------------|----------|
| `green-50` | Very light green | Subtle backgrounds, hover states on light surfaces |
| `green-100` | Light green | Card borders, dividers, inactive states |
| `green-200` | Soft green | Input borders, secondary borders |
| `green-300` | Medium-light green | Disabled text, placeholder text |
| `green-400` | Medium green | Icons, secondary actions |
| `green-500` | Base green | **Primary buttons (default state)**, important links |
| `green-600` | Forest green | **Primary buttons (hover state)**, active navigation |
| `green-700` | Dark green | Primary buttons (active/pressed state) |
| `green-800` | Very dark green | **Headings**, dark text on light backgrounds |
| `green-900` | Darkest green | High-emphasis text |

### Usage Examples

**Primary Button**:
```tsx
// Default: green-600 background
// Hover: green-700
// Active: green-800
<Button variant="primary">Book Now</Button>
```

**Page Heading**:
```tsx
// Use green-800 for high contrast on light backgrounds
<h1 className="text-4xl font-bold text-green-800">Velkommen</h1>
```

**Card Border**:
```tsx
// Use green-100 for subtle borders
<div className="border border-green-100 rounded-lg">...</div>
```

**Input Border**:
```tsx
// Default: green-200
// Focus: green-600
<Input className="border-green-200 focus:border-green-600" />
```

### Common Mistakes to Avoid

❌ **Don't use green-500 for headings** - It doesn't meet WCAG AA contrast on white backgrounds
❌ **Don't use green-100 for text** - Too light, poor contrast
❌ **Don't use green-900 for buttons** - Too dark, makes text hard to read
✅ **Do use green-600 to green-800 for buttons**
✅ **Do use green-800 for headings and important text**
✅ **Do use green-100 to green-200 for borders and dividers**

---

## Semantic Colors

### Success (Green)

**When to Use**:
- Successful form submissions
- Confirmation messages
- Booking confirmed states
- Successful operations

**Color Variants**:
- `green-500` to `green-700` for success alerts/badges
- `green-100` for success alert backgrounds
- `green-800` for success alert text

**Example**:
```tsx
<Alert variant="success">
  Booking confirmed! You'll receive an email shortly.
</Alert>
```

**Visual Pattern**:
- Background: `green-100`
- Border: `green-500`
- Text: `green-800`
- Icon: `green-600`

---

### Error (Red)

**When to Use**:
- Form validation errors
- Failed operations
- Destructive actions (delete buttons)
- Critical warnings

**Color Variants**:
- `red-500` to `red-700` for error alerts/badges
- `red-100` for error alert backgrounds
- `red-800` for error alert text
- `red-600` for destructive buttons

**Example**:
```tsx
<Alert variant="error">
  Login failed. Please check your credentials.
</Alert>

<Button variant="destructive">Slet Booking</Button>
```

**Visual Pattern**:
- Background: `red-100`
- Border: `red-500`
- Text: `red-800`
- Icon: `red-600`

---

### Warning (Yellow/Amber)

**When to Use**:
- Important notices that require attention
- Upcoming deadlines
- Potential issues (but not critical errors)
- Booking conflicts or date warnings

**Color Variants**:
- `yellow-500` to `yellow-700` for warning alerts/badges
- `yellow-100` for warning alert backgrounds
- `yellow-800` for warning alert text

**Example**:
```tsx
<Alert variant="warning">
  Selected dates are close to another booking. Please verify.
</Alert>
```

**Visual Pattern**:
- Background: `yellow-100`
- Border: `yellow-500`
- Text: `yellow-800`
- Icon: `yellow-600`

---

### Info (Blue)

**When to Use**:
- Informational messages
- Help text, tooltips
- Non-critical notifications
- Tips and suggestions

**Color Variants**:
- `blue-500` to `blue-700` for info alerts/badges
- `blue-100` for info alert backgrounds
- `blue-800` for info alert text

**Example**:
```tsx
<Alert variant="info">
  Tip: You can view all bookings on the calendar page.
</Alert>
```

**Visual Pattern**:
- Background: `blue-100`
- Border: `blue-500`
- Text: `blue-800`
- Icon: `blue-600`

---

## Neutral Colors

### Background & Foreground

**CSS Variables** (runtime theming):
```css
--background: #ffffff;  /* White (light mode) */
--foreground: #171717;  /* Almost black (light mode) */
```

**When to Use**:
- `var(--background)`: Main page background, card backgrounds
- `var(--foreground)`: Primary text color, headings, body text

**Example**:
```tsx
<div className="bg-background text-foreground">
  Main content with proper contrast
</div>
```

**Why CSS Variables?**
These use CSS variables to enable future dark mode support without changing component code.

---

### Gray Scale (Neutral Tones)

**When to Use**:
- Secondary text, captions
- Borders, dividers
- Disabled states
- Muted elements

**Color Scale**:
| Color | Use Case |
|-------|----------|
| `gray-50` | Subtle backgrounds, hover states |
| `gray-100` | Card backgrounds, section dividers |
| `gray-200` | Borders, disabled inputs |
| `gray-300` | Placeholder text |
| `gray-400` | Icons, secondary text |
| `gray-500` | Muted text |
| `gray-600` | Body text on colored backgrounds |
| `gray-700` | Strong secondary text |
| `gray-800` | Near-black text |
| `gray-900` | Black text |

**Usage Examples**:

**Secondary Text**:
```tsx
<p className="text-gray-600">Last updated: December 2024</p>
```

**Disabled Input**:
```tsx
<Input disabled className="bg-gray-100 text-gray-400 cursor-not-allowed" />
```

**Divider**:
```tsx
<hr className="border-gray-200" />
```

---

## Button Color Patterns

### Primary Button
**Purpose**: Main call-to-action, most important action on page
```tsx
<Button variant="primary">
  // Background: green-600
  // Hover: green-700
  // Active: green-800
  // Text: white
  Book Now
</Button>
```

### Secondary Button
**Purpose**: Secondary actions, alternative options
```tsx
<Button variant="secondary">
  // Background: transparent
  // Border: green-600
  // Text: green-600
  // Hover: green-50 background
  View Details
</Button>
```

### Tertiary Button
**Purpose**: Subtle actions, less emphasis
```tsx
<Button variant="tertiary">
  // Background: transparent
  // Text: green-600
  // Hover: green-50 background
  // No border
  Cancel
</Button>
```

### Destructive Button
**Purpose**: Delete, remove, or destructive actions
```tsx
<Button variant="destructive">
  // Background: red-600
  // Hover: red-700
  // Active: red-800
  // Text: white
  Slet
</Button>
```

---

## Form Element Colors

### Input Fields

**Default State**:
```tsx
// Border: green-200 (subtle)
// Background: white
// Text: foreground
<Input className="border-green-200" />
```

**Focus State**:
```tsx
// Border: green-600 (emphasized)
// Ring: green-600 with opacity
// Background: white
<Input className="focus:border-green-600 focus:ring-green-600" />
```

**Error State**:
```tsx
// Border: red-500
// Text: red-800 (error message)
<Input className="border-red-500" />
<p className="text-red-800 text-sm">Invalid email address</p>
```

**Disabled State**:
```tsx
// Background: gray-100
// Border: gray-200
// Text: gray-400
<Input disabled className="bg-gray-100 border-gray-200 text-gray-400" />
```

---

## Card & Container Colors

### Card
```tsx
<Card>
  // Background: white
  // Border: green-100 (subtle)
  // Shadow: subtle gray shadow
  // Hover: can add green-50 tint
</Card>
```

### Container Backgrounds
```tsx
// Main page background - gradient for visual interest
<div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
  // Subtle green gradient creates forest atmosphere
</div>

// Solid background alternative
<div className="bg-green-50">
  // Light green background
</div>
```

---

## Navigation & Header Colors

### Active Navigation Item
```tsx
// Text: green-800 (darker, emphasized)
// Background: green-100 (subtle highlight)
// Border-bottom: green-600 (accent indicator)
<Link className="text-green-800 bg-green-100 border-b-2 border-green-600">
  Hjem
</Link>
```

### Inactive Navigation Item
```tsx
// Text: green-600 (normal)
// Hover: green-700 text, green-50 background
<Link className="text-green-600 hover:text-green-700 hover:bg-green-50">
  Bookings
</Link>
```

---

## Accessibility Contrast Reference

### WCAG AA Requirements

**Normal Text** (< 24px regular, < 19px bold):
- Minimum contrast: **4.5:1**
- Safe combinations:
  - `green-800` on `white` ✅ (9.24:1)
  - `green-700` on `white` ✅ (6.47:1)
  - `green-600` on `white` ❌ (3.98:1) - Only use for large text or buttons
  - `foreground` on `background` ✅ (15.2:1)

**Large Text** (≥ 24px regular, ≥ 19px bold):
- Minimum contrast: **3:1**
- Safe combinations:
  - `green-600` on `white` ✅ (3.98:1)
  - `green-500` on `white` ❌ (2.68:1) - Still too light

**UI Components** (buttons, borders, icons):
- Minimum contrast: **3:1**
- Safe combinations:
  - `green-600` borders on `white` ✅
  - `green-500` borders on `white` ❌

---

## Quick Reference Cheatsheet

| Element | Color | Reasoning |
|---------|-------|-----------|
| **Page Background** | `bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50` | Subtle forest theme |
| **Card Background** | `bg-white` | Clean, readable surface |
| **Card Border** | `border-green-100` | Subtle brand presence |
| **Heading Text** | `text-green-800` | High contrast, brand color |
| **Body Text** | `text-foreground` | Maximum readability |
| **Secondary Text** | `text-gray-600` | Deemphasized information |
| **Primary Button** | `bg-green-600 hover:bg-green-700` | Strong call-to-action |
| **Secondary Button** | `border-green-600 text-green-600` | Alternative action |
| **Destructive Button** | `bg-red-600 hover:bg-red-700` | Warning before delete |
| **Input Border** | `border-green-200 focus:border-green-600` | Subtle → emphasized |
| **Error Text** | `text-red-800` | Clear error indication |
| **Success Alert** | `bg-green-100 border-green-500 text-green-800` | Positive feedback |
| **Link (inactive)** | `text-green-600 hover:text-green-700` | Clickable indication |
| **Link (active)** | `text-green-800 bg-green-100` | Current page indicator |

---

## Color Combinations to Avoid

❌ **Low Contrast Issues**:
- `green-500` text on `white` background (normal text) - Only 2.68:1
- `green-400` text on `white` background - Only 1.95:1
- `gray-300` text on `white` background - Only 2.22:1

❌ **Semantic Confusion**:
- Don't use red for success states
- Don't use green for error states
- Don't use yellow/amber for normal informational messages (use blue)

❌ **Brand Inconsistency**:
- Don't use purple, pink, or orange (not in forest retreat theme)
- Don't use arbitrary hex colors (use design system tokens)
- Don't mix warm and cool greens inconsistently

---

## Testing Your Color Choices

### Tools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Lighthouse Accessibility Audit**: Built into Chrome DevTools
- **WAVE Browser Extension**: https://wave.webaim.org/extension/

### Checklist
- ✅ All text meets 4.5:1 contrast ratio (or 3:1 for large text)
- ✅ Colors have semantic meaning (success = green, error = red)
- ✅ Information is not conveyed by color alone (use icons + text)
- ✅ Focus indicators are clearly visible
- ✅ Disabled states are visually distinguishable
- ✅ Colors fit the forest retreat theme

---

## Adding New Colors

If you need a color not in the current system:

1. **Check if existing color works**: Try different shades of existing colors first
2. **Justify the addition**: Document why existing colors don't meet the need
3. **Maintain theme consistency**: New colors should fit the forest retreat theme
4. **Verify accessibility**: Check contrast ratios with WebAIM
5. **Add to globals.css**: Define in design system with semantic name
6. **Update this guide**: Document when and how to use the new color

**Example Process**:
```
Need: Subtle background for code blocks
Try: gray-50, gray-100, green-50 (existing colors)
If none work: Add --color-code-background: oklch(...) to globals.css
Document: "Code Blocks: Use bg-[color-code-background] for syntax highlighting"
```

---

## Common Scenarios

### Scenario 1: Creating a New Button Variant
**Question**: Should I create a new color or use existing semantic colors?

**Answer**: Use existing semantic colors:
- **Primary action**: `green-600` (forest green, matches brand)
- **Success action**: `green-600` (same as primary for consistency)
- **Destructive action**: `red-600` (clearly dangerous)
- **Secondary action**: `green-600` border only (less emphasis)
- **Tertiary action**: `green-600` text only (minimal emphasis)

### Scenario 2: Styling a Calendar Component
**Question**: What colors should I use for dates, selected dates, and unavailable dates?

**Answer**:
- **Normal dates**: `text-gray-800` on `white`
- **Hover state**: `bg-green-50 text-green-800`
- **Selected date**: `bg-green-600 text-white`
- **Unavailable date**: `bg-gray-100 text-gray-400` (with line-through)
- **Today indicator**: `border-green-600` (2px border)

### Scenario 3: Alert Banners
**Question**: When should I use each alert variant?

**Answer**:
- **Success**: Booking confirmed, payment received, profile updated
- **Error**: Login failed, booking conflict, validation error
- **Warning**: Upcoming deadline, potential conflict, important notice
- **Info**: Helpful tips, feature announcements, non-critical updates

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-11 | Initial color usage guide created |

---

**Need Help?**
- Review [data-model.md](./data-model.md) for design system specifications
- Check [accessibility-audit-results.md](./accessibility-audit-results.md) for compliance details
- Test contrast ratios with WebAIM Contrast Checker
- Ask team members for design review before adding new colors
