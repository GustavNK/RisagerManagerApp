# Implementation Plan: UI/UX Design System and Code Refactoring

**Branch**: `001-the-frontend-of` | **Date**: 2025-10-11 | **Spec**: [spec.md](./spec.md)
**Input**: User request to improve UI/UX design and code maintainability with minimal visual changes

**Note**: This plan focuses on establishing a professional design system, improving accessibility, and creating reusable components while maintaining existing functionality.

## Summary

Transform the Risager Plantage vacation house manager frontend from an AI-generated prototype into a professional, accessible, and maintainable application. Establish a cohesive design system with consistent colors (forest retreat theme), typography, and spacing. Create reusable UI components (buttons, inputs, cards) to reduce code duplication by 80%. Improve project structure following Next.js 15 best practices. Ensure WCAG AA accessibility compliance. Make minimal visual changes - focus on organization, consistency, and code quality.

**Key Constraint**: Avoid touching `RisagerBackend/` folder and `src/lib/api-client/client.ts` unless absolutely necessary. Remove unnecessary files for a cleaner Next.js 15 project structure.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.3.5 and React 19
**Primary Dependencies**:
- Next.js 15.3.5 (App Router with Turbopack)
- React 19.0.0 & React DOM 19.0.0
- TailwindCSS v4 (CSS-first configuration)
- @tanstack/react-query 5.90.2 (data fetching)
- Axios 1.12.2 (HTTP client)

**Storage**: N/A (UI/UX refactoring only, no database changes)
**Testing**: Manual testing + Lighthouse accessibility audits (no existing test framework)
**Target Platform**: Modern web browsers (Chrome, Safari, Firefox, Edge) on desktop and mobile devices
**Project Type**: Web application (Next.js frontend + .NET backend)
**Performance Goals**:
- Core content visible within 3 seconds on slow connections
- Lighthouse Performance score > 90
- Lighthouse Accessibility score = 100

**Constraints**:
- No backend changes (RisagerBackend folder is off-limits)
- No changes to `src/lib/api-client/client.ts` (auto-generated from swagger)
- Must maintain backward compatibility with existing user data
- Must preserve Danish language throughout
- Must maintain existing functionality (no feature removals)
- Make minimal visual changes (reorganize and refine, don't redesign)

**Scale/Scope**:
- 7 pages/routes (home, login, booking, bookings, feed, profile, users)
- ~10-15 reusable UI components to create
- ~20-30 existing inline component patterns to consolidate
- Small family user base (< 50 users)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASS - No constitution violations

**Analysis**:
- This project does not have a defined constitution file (placeholder template present)
- No specific architecture constraints to violate
- Following industry-standard Next.js 15 and React 19 best practices
- Using well-established patterns (component-based architecture, utility-first CSS)
- No unnecessary complexity being introduced

**Post-Phase-1 Check**: Will re-evaluate after design artifacts are complete.

## Project Structure

### Documentation (this feature)

```
specs/001-the-frontend-of/
├── spec.md              # Feature specification (user requirements)
├── plan.md              # This file (implementation plan)
├── research.md          # Best practices research (Phase 0 complete)
├── data-model.md        # Design system specification (Phase 1 complete)
├── quickstart.md        # Developer quickstart guide (Phase 1 complete)
├── checklists/
│   └── requirements.md  # Specification quality checklist (complete)
└── tasks.md             # Task breakdown (Phase 2 - run /speckit.tasks)
```

### Source Code (repository root)

**Current Structure**:
```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── login/               # Login/register page
│   ├── booking/             # Create booking page
│   ├── bookings/            # View bookings page
│   ├── feed/                # Community feed page
│   ├── profile/             # User profile page
│   └── users/               # User management page
│
└── lib/
    ├── api.ts               # API utilities (getApiUrl, error handling)
    ├── api-client/          # Auto-generated API client (DO NOT TOUCH)
    │   └── client.ts
    └── query-provider.tsx   # React Query provider
```

**Target Structure** (After refactoring):
```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Route group for authentication (NEW)
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/             # Route group for authenticated pages (NEW)
│   │   ├── booking/
│   │   ├── bookings/
│   │   ├── feed/
│   │   ├── profile/
│   │   └── users/
│   ├── layout.tsx              # Root layout (update to use new components)
│   ├── page.tsx                # Home page (refactor with new components)
│   └── globals.css             # Design system CSS with @theme (MAJOR UPDATE)
│
├── components/                  # NEW: Reusable components
│   ├── ui/                     # Basic UI components (atoms)
│   │   ├── button.tsx         # Button with variants (primary, secondary, tertiary)
│   │   ├── input.tsx          # Form input with all states
│   │   ├── label.tsx          # Form label
│   │   ├── card.tsx           # Card container (compound component)
│   │   ├── badge.tsx          # Status badge
│   │   ├── alert.tsx          # Alert/message component
│   │   ├── spinner.tsx        # Loading spinner
│   │   └── index.ts           # Barrel exports
│   │
│   ├── layout/                 # Layout components (molecules)
│   │   ├── header.tsx         # Application header with navigation
│   │   ├── footer.tsx         # Application footer
│   │   ├── navigation.tsx     # Navigation menu component
│   │   ├── container.tsx      # Max-width wrapper
│   │   └── index.ts           # Barrel exports
│   │
│   └── features/               # Feature-specific components (organisms)
│       ├── auth/
│       │   ├── login-form.tsx
│       │   └── register-form.tsx
│       ├── booking/
│       │   ├── property-card.tsx
│       │   ├── booking-calendar.tsx
│       │   └── booking-summary.tsx
│       └── feed/
│           └── post-card.tsx
│
├── hooks/                      # NEW: Custom React hooks
│   ├── use-user.ts            # User authentication state
│   └── use-booking.ts         # Booking logic
│
└── lib/
    ├── api.ts                 # KEEP: API utilities
    ├── api-client/            # KEEP: Auto-generated client (DO NOT TOUCH)
    │   └── client.ts
    ├── query-provider.tsx     # KEEP: React Query provider
    ├── utils.ts               # NEW: Utility functions (cn helper)
    └── constants.ts           # NEW: Constants
```

**Files to Remove**:
- `next.config.js` (keep only `next.config.ts`)
- `tailwind.config.js` (if exists - TailwindCSS v4 doesn't need it)

**Structure Decision**:
Using Next.js 15 App Router structure with route groups for better organization. The `(auth)` and `(dashboard)` route groups don't affect URLs but provide logical separation. Components are organized by atomic design principles (ui/layout/features). This structure follows Next.js 15 best practices and improves maintainability without disrupting existing functionality.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

**Status**: N/A - No violations to track

---

## Implementation Phases

### Phase 0: Research & Analysis ✅ COMPLETE

**Status**: ✅ Completed
**Output**: [research.md](./research.md)

**Completed Work**:
1. ✅ Researched Next.js 15 and React 19 best practices
2. ✅ Investigated TailwindCSS v4 CSS-first configuration
3. ✅ Documented WCAG AA accessibility requirements (contrast ratios, touch targets, focus indicators)
4. ✅ Researched modern TypeScript and component architecture patterns
5. ✅ Compiled comprehensive research document with actionable recommendations

**Key Findings**:
- Use `@theme` directive in CSS for TailwindCSS v4 (no tailwind.config.js needed)
- OKLCH color format recommended for better accessibility and color manipulation
- 4.5:1 contrast ratio for normal text, 3:1 for large text (WCAG AA)
- 44×44px minimum touch targets (WCAG AAA, best practice)
- Interface > Type for component props (better TypeScript performance)
- Composition pattern for mixing Server and Client Components
- Keep Client Components small and focused

### Phase 1: Design System & Architecture ✅ COMPLETE

**Status**: ✅ Completed
**Outputs**:
- [data-model.md](./data-model.md) - Design system specification
- [quickstart.md](./quickstart.md) - Developer implementation guide

**Completed Work**:
1. ✅ Defined color palette (forest retreat theme with greens and earth tones)
2. ✅ Established typography scale (display, h1-h6, body, small sizes)
3. ✅ Created spacing scale (xs through 4xl, 8-point grid system)
4. ✅ Specified interactive element requirements (touch targets, states)
5. ✅ Documented component patterns (atoms, molecules, organisms)
6. ✅ Defined responsive breakpoints (mobile, tablet, desktop, large desktop)
7. ✅ Established animation and transition standards
8. ✅ Created quickstart guide for developers

**Design Tokens Defined**:
- **Colors**: Primary (green 50-900), semantic (success, error, warning, info), neutrals
- **Typography**: Font sizes, line heights, weights
- **Spacing**: Consistent 8-point grid system
- **Borders**: Radius values, widths
- **Shadows**: Elevation levels (sm, md, lg, xl)
- **Transitions**: Duration and easing functions

### Phase 2: Task Breakdown 🔄 NEXT

**Status**: 🔄 Pending (run `/speckit.tasks` to generate)
**Output**: `tasks.md`

**Expected Outcome**:
Dependency-ordered task list with:
- Setup tasks (create directories, configure design system)
- Component creation tasks (ui, layout, features)
- Page refactoring tasks (7 pages to update)
- Structure reorganization tasks (route groups, file moves)
- Accessibility audit tasks
- Testing and validation tasks

**To Execute**: Run `/speckit.tasks` command after this `/speckit.plan` command completes

---

## Implementation Strategy

### Phased Rollout Approach

The implementation will follow an incremental approach to minimize risk and ensure continuous functionality:

**Phase A: Foundation** (High Priority)
1. Set up design system in `globals.css` with TailwindCSS v4 `@theme`
2. Create utility functions (`cn` helper in `lib/utils.ts`)
3. Verify existing pages still work with new CSS

**Phase B: Component Library** (High Priority)
1. Build UI components (Button, Input, Card, Alert)
2. Build layout components (Header, Footer, Navigation, Container)
3. Test components in isolation

**Phase C: Page Refactoring** (Medium Priority)
1. Refactor one page at a time (start with simplest: login)
2. Extract feature components during refactoring
3. Test each page before moving to next

**Phase D: Structure Optimization** (Lower Priority)
1. Create route groups `(auth)` and `(dashboard)`
2. Move pages to new structure
3. Update imports
4. Remove unnecessary files

**Phase E: Polish & Validation** (High Priority)
1. Run Lighthouse accessibility audits
2. Fix any accessibility issues
3. Cross-browser testing
4. User testing with family members

### Risk Mitigation

**Risks**:
1. Breaking existing functionality during refactoring
2. Import path issues when moving files
3. Styling conflicts between old and new components
4. Performance regression

**Mitigation Strategies**:
1. ✅ Test after each page refactoring (incremental validation)
2. ✅ Use absolute imports (`@/components/...`) to simplify refactoring
3. ✅ Keep existing functionality intact, only change presentation
4. ✅ Run Lighthouse before and after to compare performance
5. ✅ Maintain `main` branch stability by working in feature branch

### Success Validation

**Acceptance Criteria** (from spec.md):
- [ ] **SC-001**: 100% of text meets WCAG AA contrast (4.5:1 minimum)
- [ ] **SC-002**: 90% first-attempt task completion rate
- [ ] **SC-003**: 100% colors from defined palette (no arbitrary values)
- [ ] **SC-004**: 80% reduction in duplicated styling code
- [ ] **SC-005**: New users complete first booking within 5 minutes
- [ ] **SC-006**: 100% touch targets meet 44px minimum
- [ ] **SC-007**: 50% faster development time for new pages
- [ ] **SC-008**: Zero inconsistent styles across pages
- [ ] **SC-009**: Core content visible within 3 seconds
- [ ] **SC-010**: Improved user satisfaction (family feedback)

**Measurement Methods**:
- Contrast ratios: WebAIM Contrast Checker
- Touch targets: Lighthouse accessibility audit
- Task completion: User testing sessions
- Code duplication: Before/after lines of code comparison
- Performance: Lighthouse Performance score
- Consistency: Visual audit + automated style linting

---

## Next Steps

1. ✅ **Complete** - Review this implementation plan
2. ✅ **Complete** - Review research.md, data-model.md, quickstart.md
3. 🔄 **NEXT** - Run `/speckit.tasks` to generate actionable task breakdown
4. ⏳ **Pending** - Begin implementation starting with Phase A (Foundation)
5. ⏳ **Pending** - Continuous testing and validation throughout implementation
6. ⏳ **Pending** - Final accessibility audit and user testing

---

## References

**Documentation**:
- [Feature Specification](./spec.md) - User requirements and success criteria
- [Research Findings](./research.md) - Next.js 15, TailwindCSS v4, accessibility best practices
- [Design System](./data-model.md) - Color palette, typography, components
- [Quickstart Guide](./quickstart.md) - Implementation guide for developers
- [Requirements Checklist](./checklists/requirements.md) - Specification quality validation

**External Resources**:
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TailwindCSS v4 Documentation](https://tailwindcss.com/docs)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Plan Version**: 1.0
**Last Updated**: 2025-10-11
**Status**: Ready for task generation (`/speckit.tasks`)
