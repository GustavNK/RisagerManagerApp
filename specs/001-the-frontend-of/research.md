# Next.js 15 & React 19 Best Practices Research (2025)

## Table of Contents
1. [Modern Next.js 15 Project Structure](#1-modern-nextjs-15-project-structure)
2. [TailwindCSS v4 Best Practices](#2-tailwindcss-v4-best-practices)
3. [Accessibility Standards (WCAG AA)](#3-accessibility-standards-wcag-aa)
4. [Component Architecture](#4-component-architecture)

---

## 1. Modern Next.js 15 Project Structure

### Recommended File/Folder Structure

```
project-root/
├── src/                          # Optional but recommended
│   ├── app/                      # App Router (routing happens here)
│   │   ├── layout.tsx           # Root layout (required)
│   │   ├── page.tsx             # Home page
│   │   ├── loading.tsx          # Loading UI
│   │   ├── error.tsx            # Error UI
│   │   ├── (auth)/              # Route group (doesn't affect URL)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/           # Feature-based routes
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── api/                 # API routes
│   │       └── route.ts
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Basic UI components (Button, Input, Card)
│   │   ├── layout/              # Layout components (Header, Footer, Sidebar)
│   │   └── features/            # Feature-specific components
│   │       ├── auth/
│   │       └── dashboard/
│   ├── lib/                     # Utility functions and shared logic
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/                   # Custom React hooks
│   ├── context/                 # React Context providers
│   ├── types/                   # TypeScript type definitions
│   └── styles/                  # Global styles
│       └── globals.css
├── public/                      # Static assets
├── .env                         # Environment variables
├── next.config.js              # Next.js configuration
├── package.json
├── tsconfig.json
└── tailwind.config.js          # (Not needed in Tailwind v4)
```

### Key Best Practices

#### Using src/ Directory
- **Recommended**: Use `src/` directory for better separation between source code and configuration files
- Available since Next.js 12 and widely adopted in 2025
- Makes the root cleaner and easier to navigate

#### App Directory Organization

**Route Groups** (folders with parentheses):
- Syntax: `(auth)`, `(marketing)`, `(dashboard)`
- Don't affect the URL path
- Useful for organizing routes without impacting URL structure
- Example: `app/(auth)/login/page.tsx` → URL: `/login`

**Private Folders** (underscore prefix):
- Syntax: `_components`, `_utils`
- Tells Next.js router this folder is NOT part of routes
- Useful for co-locating helper files with routes

**Feature-Based Organization**:
- Group related components by feature/domain (not by type)
- Better: `features/auth/LoginForm.tsx`
- Avoid: `forms/LoginForm.tsx`

#### Component Structure Guidelines

**Where Should Reusable Components Go?**

1. **ui/** - Basic, generic UI components
   - Button, Input, Card, Modal, Badge
   - No business logic
   - Highly reusable across features

2. **layout/** - Layout-specific components
   - Header, Footer, Sidebar, Navigation
   - Usually used once in layouts

3. **features/** - Feature-specific components
   - Organized by domain (auth, booking, profile)
   - Can contain both smart and presentational components
   - Example: `features/booking/BookingForm.tsx`

### Server vs Client Component Organization

#### Default: Server Components
- All components in the App Router are Server Components by default
- Keep components as Server Components unless they need client-side features

#### When to Use Client Components ("use client")
- Interactive elements (onClick, onChange, useState)
- Browser APIs (localStorage, window)
- React hooks (useState, useEffect, useContext)
- Event listeners

#### Key Patterns

**1. Composition Pattern (Recommended)**
```tsx
// ClientWrapper.tsx (Client Component)
"use client"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState()

  return (
    <div onClick={handleClick}>
      {children} {/* Server Component can be passed as children */}
    </div>
  )
}

// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData() // Server-side data fetching

  return (
    <ClientWrapper>
      <ServerComponent data={data} />
    </ClientWrapper>
  )
}
```

**2. Minimize Client Component Scope**
- Add "use client" only to components that need interactivity
- Move interactive parts into separate Client Components
- Don't mark entire pages as client components unnecessarily

**3. Context Provider Pattern**
```tsx
// providers/theme-provider.tsx (Client Component)
"use client"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

// app/layout.tsx (Server Component)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**4. Data Fetching in Server Components**
- Each Server Component can fetch the data it needs directly
- Next.js automatically memoizes fetch calls
- No need to prop drill or use context for data

### Files Typically Unnecessary in Next.js 15

1. **tailwind.config.js** - Not required in Tailwind v4 (CSS-first configuration)
2. **pages/** directory - If using App Router
3. **\_app.tsx** and **\_document.tsx** - Replaced by `app/layout.tsx`
4. **Complex Redux setup** - Server Components and Server Actions reduce need for client state management
5. **API route wrappers** - Server Actions can replace many API routes

### Layouts and Providers Best Practices

**Root Layout Requirements:**
- Must exist at `app/layout.tsx`
- Must define `<html>` and `<body>` tags
- Cannot be deleted

**Async Layouts (New in Next.js 15):**
```tsx
// app/layout.tsx
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser() // Fetch user data

  return (
    <html>
      <body>
        <Header user={user} />
        {children}
      </body>
    </html>
  )
}
```

**Provider Placement:**
- Place providers as deep in the tree as possible
- Helps Next.js optimize static parts
- Create providers as separate Client Components

---

## 2. TailwindCSS v4 Best Practices

### Major Changes in v4

**CSS-First Configuration:**
- No more `tailwind.config.js` file required
- Configure everything directly in CSS using `@theme` directive
- Faster compilation and better developer experience

### Setup for Design Systems

#### 1. Basic Configuration (globals.css)

```css
/* src/styles/globals.css */
@import "tailwindcss";

/* Define design tokens using @theme directive */
@theme {
  /* Spacing scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  /* Color palette using OKLCH (recommended) */
  --color-primary-50: oklch(0.97 0.01 200);
  --color-primary-100: oklch(0.94 0.02 200);
  --color-primary-500: oklch(0.60 0.15 200);
  --color-primary-900: oklch(0.30 0.12 200);

  /* Semantic colors */
  --color-success: oklch(0.70 0.18 142);
  --color-error: oklch(0.65 0.25 27);
  --color-warning: oklch(0.80 0.15 85);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;
}

/* Dark mode support */
@theme dark {
  --color-primary-50: oklch(0.30 0.12 200);
  --color-primary-900: oklch(0.97 0.01 200);
}
```

#### 2. CSS Variables for Runtime Theming

```css
/* Runtime theme variables */
:root {
  --background: oklch(1.0 0 0);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1.0 0 0);
  --card-foreground: oklch(0.15 0 0);
  --primary: oklch(0.60 0.15 200);
  --primary-foreground: oklch(1.0 0 0);
}

.dark {
  --background: oklch(0.15 0 0);
  --foreground: oklch(0.95 0 0);
  --card: oklch(0.18 0 0);
  --card-foreground: oklch(0.95 0 0);
  --primary: oklch(0.70 0.18 200);
  --primary-foreground: oklch(0.15 0 0);
}

/* Use with Tailwind utilities */
.bg-background {
  background-color: var(--background);
}
```

### Why OKLCH Color Format?

**Benefits:**
- More predictable and consistent color manipulation
- Perceptually uniform (equal changes = equal visual differences)
- Wider color gamut than RGB (more vivid colors)
- Better for accessibility (easier to maintain contrast ratios)

**Format:**
```css
/* oklch(lightness chroma hue) */
--color-blue: oklch(0.60 0.15 250);
/*
  lightness: 0-1 (0 = black, 1 = white)
  chroma: 0-0.4+ (0 = gray, higher = more saturated)
  hue: 0-360 (color angle: 0=red, 120=green, 240=blue)
*/
```

### Creating Reusable Component Patterns

#### 1. Component Layer for Custom Classes

```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }

  .btn-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/90;
  }

  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }

  .input {
    @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm;
  }
}
```

#### 2. When to Use @apply

**✅ Good Use Cases:**
- Small, highly reusable components (buttons, badges, inputs)
- Complex state variants that are used repeatedly
- When not using a component framework like React

**❌ Avoid:**
- One-off styles that aren't reused
- Complex component styles (use React components instead)
- Everything (defeats the purpose of utility-first)

#### 3. React Component Pattern (Preferred)

```tsx
// components/ui/button.tsx
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        // Variant styles
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/90': variant === 'secondary',
          'border border-input bg-background hover:bg-accent': variant === 'outline',
        },
        // Size styles
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-base': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}
```

### Design System Best Practices

1. **Design Tokens in CSS**
   - Define all tokens using `@theme` directive
   - Use CSS variables for runtime theme switching
   - Keep tokens consistent with design system

2. **Color System**
   - Use OKLCH for all colors
   - Define semantic colors (primary, secondary, success, error)
   - Create 50-900 scales for main colors

3. **Typography Scale**
   - Define consistent font sizes
   - Include line heights
   - Use rem units for accessibility

4. **Spacing Scale**
   - Consistent spacing system (4px, 8px, 16px, etc.)
   - Use for padding, margin, gap

5. **Component Utilities**
   - Create utilities for repeated patterns
   - Use React components for complex patterns
   - Keep @apply usage minimal

---

## 3. Accessibility Standards (WCAG AA)

### Color Contrast Requirements

#### Text Contrast (WCAG 2.1 SC 1.4.3)

| Element Type | Minimum Contrast Ratio |
|-------------|------------------------|
| Normal text (< 18pt / 24px) | **4.5:1** |
| Large text (≥ 18pt/24px regular OR ≥ 14pt/19px bold) | **3:1** |
| UI components & graphics | **3:1** |

**Important Notes:**
- These are Level AA requirements (minimum for most compliance)
- Contrast ratio measures relative luminance between foreground and background
- Use tools like WebAIM Contrast Checker to verify compliance

**Examples:**
```css
/* ✅ Good: Meets 4.5:1 for normal text */
.text-dark {
  color: oklch(0.20 0 0); /* #333333 on white background */
}

/* ❌ Bad: Only 3:1 ratio - fails for normal text */
.text-gray {
  color: oklch(0.60 0 0); /* #999999 on white background */
}

/* ✅ Good: 3:1 is OK for large text only */
.heading-large {
  font-size: 24px;
  color: oklch(0.60 0 0); /* Can use lower contrast for large text */
}
```

### Touch Target Sizes

#### WCAG 2.2 Requirements

| WCAG Level | Minimum Size | Success Criterion |
|------------|--------------|-------------------|
| AA | **24px × 24px** | 2.5.8: Target Size (Minimum) |
| AAA | **44px × 44px** | 2.5.5: Target Size (Enhanced) |

**Key Takeaways:**
- For AA compliance (minimum): 24px × 24px
- **Best Practice**: 44px × 44px (meets AAA and improves usability)
- Applies to all interactive elements (buttons, links, form inputs)
- Spacing between targets also matters

**Implementation:**
```css
/* Minimum AA compliance */
.btn-minimum {
  min-width: 24px;
  min-height: 24px;
}

/* Recommended for better usability (AAA) */
.btn-recommended {
  min-width: 44px;
  min-height: 44px;
}

/* Using Tailwind v4 */
@theme {
  --size-touch-min: 24px;  /* AA minimum */
  --size-touch-target: 44px; /* AAA / recommended */
}
```

### Font Sizes and Typography

#### No Official Minimum, But Guidelines Exist

**WCAG Requirements:**
- No specific minimum font size mandated
- Must be resizable up to 200% without loss of content/functionality
- Contrast requirements vary by text size

**Large Text Definition:**
- 18pt (24px) or larger
- 14pt (18.66px) bold or larger
- Requires only 3:1 contrast ratio (vs 4.5:1 for normal text)

**Best Practice Recommendations:**
```css
/* Recommended minimum sizes */
--font-size-body: 16px;      /* Standard body text */
--font-size-small: 14px;     /* Small text (captions, labels) */
--font-size-minimum: 12px;   /* Absolute minimum (avoid if possible) */

/* Never use smaller than 12px for body text */
```

**Typography Best Practices:**
1. Use relative units (rem, em) for font sizes
2. Default body text: 16px (1rem)
3. Allow browser zoom and text scaling
4. Maintain adequate line height (1.5 for body text)
5. Ensure sufficient letter spacing for readability

### Interactive Element States

#### Focus Indicators (WCAG 2.4.7 - Level AA)

**Requirements:**
- All keyboard-operable elements must have visible focus indicator
- Focus indicator must be clearly distinguishable
- Never remove outline without providing alternative

**Implementation:**
```css
/* ❌ Never do this */
button {
  outline: none; /* Removes focus indicator */
}

/* ✅ Provide custom focus indicator */
button {
  outline: none;
  transition: box-shadow 0.2s;
}

button:focus-visible {
  outline: 2px solid oklch(0.60 0.15 200);
  outline-offset: 2px;
  /* or */
  box-shadow: 0 0 0 3px oklch(0.60 0.15 200 / 0.5);
}

/* Modern approach with :focus-visible */
.btn {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
}
```

**Focus Indicator Best Practices:**
- Minimum 2px outline width
- High contrast against background
- Use `:focus-visible` for better UX (shows focus for keyboard, not mouse)
- Ensure focus order follows logical reading order
- Test with keyboard navigation (Tab key)

#### Interactive States Required

**All interactive elements need these states:**

1. **Default State**
   - Initial appearance

2. **Hover State**
   - Visual feedback on mouse over
   - Indicates element is interactive

3. **Focus State**
   - Keyboard focus indicator (required for AA)
   - Must be clearly visible

4. **Active/Pressed State**
   - Feedback during interaction

5. **Disabled State**
   - Clearly indicate non-interactive state
   - Lower opacity or different color
   - Cursor: not-allowed

**Example Implementation:**
```tsx
// components/ui/button.tsx
export function Button({ disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'transition-colors duration-200',

        // Default state
        'bg-primary text-primary-foreground',

        // Hover state
        'hover:bg-primary/90',

        // Focus state (keyboard navigation)
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',

        // Active state
        'active:bg-primary/80',

        // Disabled state
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',

        className
      )}
      disabled={disabled}
      {...props}
    />
  )
}
```

### Accessibility Checklist for Components

**For every interactive component, ensure:**

- ✅ Color contrast meets 4.5:1 (or 3:1 for large text)
- ✅ Touch targets are at least 24×24px (preferably 44×44px)
- ✅ Focus indicators are clearly visible
- ✅ Works with keyboard navigation (Tab, Enter, Space, Arrows)
- ✅ Includes proper ARIA labels when needed
- ✅ All states are visually distinct (hover, focus, active, disabled)
- ✅ Text is resizable up to 200%
- ✅ Semantic HTML elements used (button, not div with onClick)

---

## 4. Component Architecture

### Modern React 19 Patterns

#### New React 19 Features

**Key Changes:**
1. **No more forwardRef** - ref is now a regular prop
2. **New hooks**: `useActionState`, `useFormStatus`, `useOptimistic`, `use()`
3. **Server Actions** - First-class support for server mutations
4. **Enhanced Server Components** - Better integration with Next.js

**Example (ref as prop):**
```tsx
// React 18 - Old way
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />
})

// React 19 - New way
function Input({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

### TypeScript Best Practices for Components

#### Interface vs Type for Props

**Recommendation: Use `interface` by default**

**Why Interface:**
- Better performance (especially with complex intersections)
- More familiar syntax for object types
- Clear indication of object shape
- Better error messages
- Can be extended/merged

**When to Use Type:**
- Union types: `type Status = 'idle' | 'loading' | 'success' | 'error'`
- Intersection with unions: `type Props = BaseProps & (VariantA | VariantB)`
- Complex type manipulations

**Examples:**
```tsx
// ✅ Preferred: Interface for component props
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

// ✅ Good: Type for unions
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

// ✅ Good: Extending interface
interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode
  iconPosition?: 'left' | 'right'
}

// ✅ Good: Type for complex scenarios
type ConditionalProps =
  | { mode: 'single'; value: string }
  | { mode: 'multiple'; value: string[] }
```

#### Typing Component Props Patterns

**1. Basic Props with Children:**
```tsx
interface CardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Card({ title, description, children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}
```

**2. Extending HTML Elements:**
```tsx
// Inherit all native button props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}

export function Button({ variant = 'primary', isLoading, children, ...props }: ButtonProps) {
  return (
    <button {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  )
}
```

**3. Generic Components:**
```tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}

// Usage
<List
  items={users}
  renderItem={user => <UserCard user={user} />}
  keyExtractor={user => user.id}
/>
```

**4. Discriminated Unions for Variants:**
```tsx
type AlertProps =
  | {
      variant: 'success'
      onDismiss?: () => void
    }
  | {
      variant: 'error'
      retry: () => void  // Required for error variant
    }
  | {
      variant: 'info'
    }

export function Alert(props: AlertProps & { message: string }) {
  const { variant, message } = props

  return (
    <div className={`alert alert-${variant}`}>
      {message}
      {props.variant === 'error' && (
        <button onClick={props.retry}>Retry</button>
      )}
      {props.variant === 'success' && props.onDismiss && (
        <button onClick={props.onDismiss}>Dismiss</button>
      )}
    </div>
  )
}
```

### Separating Concerns (Logic vs Presentation)

#### Container-Presentation Pattern

**Principle:** Separate data fetching/logic from UI rendering

**Container Component (Logic):**
- Handles data fetching
- Manages state
- Handles business logic
- Minimal UI
- Server Components in Next.js 15

**Presentation Component (UI):**
- Receives data via props
- Focuses on rendering
- No data fetching
- Reusable
- Can be Client or Server Component

**Example:**
```tsx
// containers/BookingContainer.tsx (Server Component)
export async function BookingContainer() {
  // Data fetching and business logic
  const bookings = await fetchBookings()
  const properties = await fetchProperties()

  return (
    <BookingList
      bookings={bookings}
      properties={properties}
    />
  )
}

// components/features/booking/BookingList.tsx (Presentation)
interface BookingListProps {
  bookings: Booking[]
  properties: Property[]
}

export function BookingList({ bookings, properties }: BookingListProps) {
  // Pure UI rendering
  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <BookingCard
          key={booking.id}
          booking={booking}
          property={properties.find(p => p.id === booking.propertyId)}
        />
      ))}
    </div>
  )
}
```

### Client vs Server Components Strategy

#### Decision Tree

```
Is the component interactive? (state, events, effects)
├─ YES → Client Component ("use client")
└─ NO
    ├─ Does it fetch data?
    │   ├─ YES → Server Component
    │   └─ NO → Server Component (default)
    └─ Is it purely presentational?
        └─ YES → Server Component (can be used in both)
```

#### Server Component Use Cases
- Data fetching
- Accessing backend resources directly
- Keeping sensitive information on server
- Large dependencies that don't need client-side JS
- Static content

#### Client Component Use Cases
- Interactive elements (buttons, forms, inputs)
- Event listeners (onClick, onChange)
- State management (useState, useReducer)
- Effects (useEffect)
- Browser-only APIs (localStorage, window)
- React hooks
- Class components

#### Best Practices

**1. Keep Client Components Small and Focused**
```tsx
// ❌ Bad: Entire page is client component
"use client"

export default function DashboardPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <StaticHeader />
      <StaticContent />
      <InteractiveCounter count={count} setCount={setCount} />
      <StaticFooter />
    </div>
  )
}

// ✅ Good: Only interactive part is client component
// page.tsx (Server Component)
export default function DashboardPage() {
  return (
    <div>
      <StaticHeader />
      <StaticContent />
      <InteractiveCounter />  {/* Only this is client component */}
      <StaticFooter />
    </div>
  )
}

// components/InteractiveCounter.tsx
"use client"

export function InteractiveCounter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**2. Pass Server Components to Client Components**
```tsx
// ClientWrapper.tsx
"use client"

interface ClientWrapperProps {
  children: React.ReactNode  // Can be Server Component
  sidebar: React.ReactNode   // Can be Server Component
}

export function ClientWrapper({ children, sidebar }: ClientWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <aside>{sidebar}</aside>}
      <main>{children}</main>
    </div>
  )
}

// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData()

  return (
    <ClientWrapper sidebar={<ServerSidebar data={data} />}>
      <ServerContent data={data} />
    </ClientWrapper>
  )
}
```

### Creating Reusable UI Components

#### Component Library Structure

**Atomic Design Approach:**
```
components/
├── ui/                    # Atoms (smallest components)
│   ├── button.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   └── avatar.tsx
├── layout/               # Molecules (layout components)
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── container.tsx
└── features/            # Organisms (feature-specific)
    ├── auth/
    │   ├── login-form.tsx
    │   └── register-form.tsx
    └── booking/
        ├── booking-form.tsx
        └── booking-card.tsx
```

#### Reusable Component Patterns

**1. Compound Components Pattern:**
```tsx
// components/ui/card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      {children}
    </div>
  )
}

function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  )
}

function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  )
}

function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

// Export as compound component
Card.Header = CardHeader
Card.Title = CardTitle
Card.Content = CardContent

// Usage
<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Content>
    Card content goes here
  </Card.Content>
</Card>
```

**2. Render Props Pattern:**
```tsx
interface DataFetcherProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return <>{children(data, loading, error)}</>
}

// Usage
<DataFetcher<User> url="/api/user">
  {(user, loading, error) => {
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!user) return null
    return <UserProfile user={user} />
  }}
</DataFetcher>
```

**3. Custom Hooks Pattern:**
```tsx
// hooks/use-toggle.ts
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse }
}

// Usage in component
function Modal() {
  const { value: isOpen, toggle, setFalse } = useToggle()

  return (
    <>
      <button onClick={toggle}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <button onClick={setFalse}>Close</button>
        </div>
      )}
    </>
  )
}
```

### Form Handling with React 19 & Next.js 15

#### Server Actions Pattern

**Modern approach with useActionState:**

```tsx
// app/actions.ts
"use server"

import { z } from 'zod'

const bookingSchema = z.object({
  propertyId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  guests: z.number().min(1)
})

interface FormState {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function createBooking(prevState: FormState, formData: FormData): Promise<FormState> {
  // Validate
  const result = bookingSchema.safeParse({
    propertyId: formData.get('propertyId'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    guests: Number(formData.get('guests'))
  })

  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors
    }
  }

  // Save to database
  try {
    await db.booking.create({ data: result.data })
    return {
      success: true,
      message: 'Booking created successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create booking'
    }
  }
}
```

```tsx
// components/features/booking/BookingForm.tsx
"use client"

import { useActionState } from 'react'
import { createBooking } from '@/app/actions'

export function BookingForm() {
  const [state, formAction, isPending] = useActionState(createBooking, {
    success: false,
    message: ''
  })

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="propertyId">Property</label>
        <select name="propertyId" id="propertyId">
          <option value="1">Røde Hus</option>
          <option value="2">Søhuset</option>
        </select>
        {state.errors?.propertyId && (
          <p className="text-error">{state.errors.propertyId[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="startDate">Start Date</label>
        <input type="date" name="startDate" id="startDate" />
        {state.errors?.startDate && (
          <p className="text-error">{state.errors.startDate[0]}</p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Booking'}
      </button>

      {state.message && (
        <p className={state.success ? 'text-success' : 'text-error'}>
          {state.message}
        </p>
      )}
    </form>
  )
}
```

#### Client-Side Validation with Zod

```tsx
"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(3, 'Password must be at least 3 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    // Submit to server
    await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className={errors.email ? 'border-error' : ''}
        />
        {errors.email && (
          <p className="text-error">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className={errors.password ? 'border-error' : ''}
        />
        {errors.password && (
          <p className="text-error">{errors.password.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

---

## Summary of Key Recommendations

### Project Structure
- ✅ Use `src/` directory for cleaner organization
- ✅ Organize components by feature, not by type
- ✅ Use route groups `(name)` for logical grouping
- ✅ Keep Server Components as default, use Client Components sparingly
- ✅ Place providers as deep in tree as possible

### TailwindCSS v4
- ✅ Use CSS-first configuration with `@theme` directive
- ✅ Prefer OKLCH color format for better color handling
- ✅ Create design tokens as CSS variables
- ✅ Use React components over `@apply` for complex patterns
- ✅ Minimize custom CSS, embrace utility-first approach

### Accessibility
- ✅ Ensure 4.5:1 contrast for normal text, 3:1 for large text
- ✅ Minimum touch targets: 24×24px (AA), prefer 44×44px (AAA)
- ✅ Always provide visible focus indicators
- ✅ Use semantic HTML elements
- ✅ Test with keyboard navigation
- ✅ Support text scaling up to 200%

### Component Architecture
- ✅ Use `interface` for component props (better performance)
- ✅ Separate concerns: Container (logic) vs Presentation (UI)
- ✅ Keep Client Components small and focused
- ✅ Pass Server Components as children/props to Client Components
- ✅ Use Server Actions with `useActionState` for forms
- ✅ Validate with Zod on both client and server
- ✅ Create reusable components with clear prop interfaces

### TypeScript Patterns
- ✅ Use `interface` for object types and component props
- ✅ Use `type` for unions and complex type manipulations
- ✅ Extend HTML element props when needed
- ✅ Use generics for flexible, reusable components
- ✅ Leverage discriminated unions for variant props

---

## Additional Resources

### Official Documentation
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [TailwindCSS v4 Documentation](https://tailwindcss.com/docs)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Tools & Testing
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Accessibility Tool](https://wave.webaim.org/)
- [Lighthouse (Chrome DevTools)](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Color Tools
- [OKLCH Color Picker](https://oklch.com/)
- [Coolors Color Palette Generator](https://coolors.co/)
- [Adobe Color](https://color.adobe.com/)

---

*Research compiled: 2025-10-11*
*Sources: Official documentation, WebAIM, W3C WAI, industry best practices*
