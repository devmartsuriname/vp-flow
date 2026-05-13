# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Auth UX Redesign — Split-Screen Layout (Phase 1C-B)
- **Project:** VP-Flow
- **Phase:** v2.0 Phase 1C-B
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Redesign all four auth views (SignIn, SignUp, ResetPassword, LockScreen) to a split-screen layout: left 60% form panel (dark surface, VP-Flow tokens), right 40% visual panel (purple gradient + inline SVG decorative elements). Reference: TheCubeFactory layout pattern. No external assets. No auth logic changes.

---

## Execution Mode

[ ] SAFE MODE — bug fixes, narrow corrections, code review
[x] EXTENDED MODE — controlled feature work, bounded module expansion
[ ] FULL BUILD MODE — full implementation within approved PRD

---

## Risk Classification

[ ] LOW — single module, no data/auth impact
[x] MEDIUM — multi-file within module, potential side effects
[ ] HIGH — DB / auth / security / API contract / architecture / cross-module

**MEDIUM reason:** Four UI components rewritten. Shared SCSS file (`_authentication.scss`) touched — affects all four views simultaneously. No migrations, no RLS, no auth logic.

---

## Design Specification (Delroy confirmed 2026-05-12)

| Parameter | Decision |
|---|---|
| Layout split | 60% form (left) / 40% visual (right) |
| Breakpoint | Visual panel hidden on <lg (≤992px); form full-width |
| Button color | `btn btn-primary` (#7e67fe purple) — replaces `btn-dark` |
| Scope | All 4 auth views: SignIn, SignUp, ResetPassword, LockScreen |
| Visual panel | Purple gradient + inline SVG decorative geometric elements (TheCubeFactory pattern — no person, no external assets) |
| Google sign-in | REMOVE — not used, user management via admin panel / Supabase |
| Sign-up link on SignIn | REMOVE — no self-registration |
| Tagline | Right panel: "VP-Flow" name + "System of Record · Office of the Vice President" in light typography overlay |

---

## Scope Definition

### In Scope

**All work is Lane B — component + SCSS refactor only**

**Files to modify:**

1. `src/app/(other)/auth/sign-in/components/SignIn.tsx`
   - Rewrite JSX to split-screen layout
   - Remove "Sign in with Google" button
   - Remove "Don't have an account? Sign Up" link
   - Keep: useSignIn() hook, Controller, login handler — untouched in behavior
   - Button: `btn btn-primary` (purple)

2. `src/app/(other)/auth/sign-up/components/SignUp.tsx`
   - Same split-screen layout pattern
   - Remove Google OAuth button if present
   - Keep form logic, hook, validation untouched

3. `src/app/(other)/auth/reset-password/components/ResetPassword.tsx`
   - Same split-screen layout pattern
   - Keep form logic untouched

4. `src/app/(other)/auth/lock-screen/components/LockScreen.tsx`
   - Same split-screen layout pattern
   - Keep form logic untouched

5. `src/assets/scss/pages/_authentication.scss`
   - Remove rainbow gradient animation from `body.authentication-bg`
   - Add `.auth-split`, `.auth-split-form`, `.auth-split-visual` classes
   - `.auth-split-visual`: purple gradient background (`$primary` → `$indigo` → `$gray-900`) + inline SVG background pattern
   - Existing `authentication-bg` base rules (min-height, display) preserved — do not break other uses
   - All colors via existing SCSS tokens (`$primary`, `$indigo`, `$gray-900`) — no new hardcoded hex values except in SVG data URI if unavoidable

**Visual panel (right 40%):**
- CSS gradient: radial + linear, `$primary` (#7e67fe) → `$indigo` (#53389f) → `$gray-900` (#323a46)
- Inline SVG decorative elements embedded in SCSS or as React component: abstract geometric shapes (circles, lines, floating icon outlines) in low opacity — inspired by TheCubeFactory right panel aesthetic
- Text overlay: VP-Flow logo/name + tagline "System of Record · Office of the Vice President" in light typography
- No external image files, no person illustrations, no CDN assets

**After all changes:**
- `npm run lint` must exit 0
- `npm run build` must exit 0
- Manual visual check: dark mode sign-in renders split-screen correctly

### Out of Scope

- `useSignIn.ts`, `useSignUp.ts`, and all other `use*.ts` auth hooks — do NOT touch
- Supabase auth client, session handling, route guards
- Yup validation schemas
- `AuthLayout.tsx`
- `page.tsx` route shells
- Any migration, RLS, or Edge Function
- Adding Google OAuth (permanently out of scope for VP-Flow)
- Adding self-registration flow
- Any frozen v1.x modules

---

## File Boundary

### Allowed — Modified Files

- `src/app/(other)/auth/sign-in/components/SignIn.tsx`
- `src/app/(other)/auth/sign-up/components/SignUp.tsx`
- `src/app/(other)/auth/reset-password/components/ResetPassword.tsx`
- `src/app/(other)/auth/lock-screen/components/LockScreen.tsx`
- `src/assets/scss/pages/_authentication.scss`

### Allowed — New Files

- Optional: `src/app/(other)/auth/components/AuthVisualPanel.tsx` — shared right-panel component (if Claude Code judges a shared component cleaner than duplicating JSX across 4 views)

### Forbidden

- All `use*.ts` auth hook files
- `AuthLayout.tsx`
- All `page.tsx` route shells
- All migration files
- All Edge Functions
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`
- Any file outside `src/app/(other)/auth/` and `src/assets/scss/pages/_authentication.scss`

---

## Pre-Execution Requirements (Lane B)

1. **PRE restore point** must be created: `RP_AuthUX_PRE_TC013.md` in `/Project Restore Points/v2.0/`
2. No Lane C gate required — no migrations, no RLS

---

## Expected Output

- All 4 auth views render split-screen 60/40 layout on desktop
- Right panel: purple gradient + geometric SVG decorative elements + VP-Flow tagline
- Left panel: dark surface, VP-Flow tokens, purple primary button
- No Google sign-in button anywhere
- No self-registration link on SignIn
- Auth logic 100% unchanged — all existing hooks, redirects, validation work as before
- `npm run lint` exits 0, `npm run build` exits 0

---

## Verification Requirement

Claude Code must confirm after execution:

1. `npm run lint` exit 0
2. `npm run build` exit 0
3. Show diff of all 5 modified files (4 components + SCSS)
4. Confirm no auth hook files were modified
5. Confirm no migration files were touched
6. Screenshot or visual description of the rendered split-screen layout

---

## Constraints

- Auth logic in `use*.ts` files must remain byte-for-byte identical
- No hardcoded hex values in TSX files — SCSS tokens only
- No external images or CDN assets
- Google OAuth buttons must be fully removed, not just hidden
- Visual panel must work CSS-only or inline SVG — no npm packages for illustrations
- Apply Bootstrap + SCSS patterns consistent with existing codebase (not Tailwind)
- `npm run lint` must exit 0 before reporting complete

---

## Stop Condition

Stop after: lint exits 0, build exits 0, diff shown, POST restore point created, report delivered to Delroy.

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode: EXTENDED MODE
- [x] Risk classified: MEDIUM (4 UI components + shared SCSS)
- [x] File boundaries explicit
- [x] Stop condition defined
- [x] No field blank
- [x] PRE restore point required
- [x] Design decisions documented and confirmed by Delroy
- [x] Auth logic explicitly protected — hooks forbidden
- [x] Google OAuth removal explicit
- [x] No external assets constraint documented

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
