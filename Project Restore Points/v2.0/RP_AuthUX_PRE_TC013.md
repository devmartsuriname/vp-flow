# Restore Point — AuthUX Split-Screen PRE (TC-013)

**Date:** 2026-05-12
**Phase:** v2.0 Phase 1C-B
**TC:** TC-013-AuthUX-SplitScreen-Phase1C-B.md
**Lane:** B (component + SCSS refactor)
**Status:** PRE-execution snapshot

---

## Scope of this restore point

Visual redesign of all 4 auth views to split-screen layout (60% form / 40% visual gradient panel). Auth logic untouched. SCSS shared file updated.

## Files in scope (current state captured)

1. `src/app/(other)/auth/sign-in/components/SignIn.tsx` — 108 lines, react-bootstrap Card/Row/Col, full-width centered card on `authentication-bg` rainbow gradient body. Form: email + password + remember me + Sign In btn-dark. Uses `useSignIn()` hook from `../useSignIn.ts`.

2. `src/app/(other)/auth/sign-up/components/SignUp.tsx` — 211 lines, similar pattern. Form: fullName + email + password + acceptTerms + Sign Up btn-dark. Local Supabase signUp call (no hook).

3. `src/app/(other)/auth/reset-password/components/ResetPassword.tsx` — 88 lines. Form: email only + Reset Password btn-dark. No-op `handleSubmit(() => {})`.

4. `src/app/(other)/auth/lock-screen/components/LockScreen.tsx` — 96 lines. Form: password only + Sign In btn-dark. No-op `handleSubmit(() => {})`.

5. `src/assets/scss/pages/_authentication.scss` — 55 lines. Defines `body.authentication-bg` rainbow gradient animation (#ee7752 → #e73c7e → #23a6d5 → #23d5ab, 15s ease infinite). Defines `.account-pages` flex layout. Defines `.auth-logo` light/dark variants.

## Files protected (untouched — Forbidden per TC)

- `src/app/(other)/auth/sign-in/useSignIn.ts`
- `src/layouts/AuthLayout.tsx`
- All `page.tsx` route shells under `auth/`
- All migration files in `supabase/migrations/`
- All Edge Functions
- `.claude/`, `Project Docs/`, `Task Contracts/`

## Design tokens referenced

- `$primary: #7e67fe` (purple) — primary accent
- `$indigo: #53389f` — gradient mid-stop
- `$gray-900: #21252e` — base dark
- `$body-bg-dark: #191e23` — dark body background
- Bootstrap CSS vars: `var(--bs-primary)`, `var(--bs-body-bg)`, `var(--bs-border-color)`

## Restoration procedure (if needed)

`git checkout HEAD -- src/app/\(other\)/auth/ src/assets/scss/pages/_authentication.scss` then remove any new files (`AuthVisualPanel.tsx`).

## Risks (per TC §"Risks")

- `authentication-bg` body class is shared by all 4 views — changes propagate.
- Bootstrap-only stack (no Tailwind) — must respect Bootstrap utility patterns.
- Dark-mode tokens must resolve correctly for both auth-only override and global theme.
