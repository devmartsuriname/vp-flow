# Restore Point — AuthUX Split-Screen POST (TC-013)

**Date:** 2026-05-12
**Phase:** v2.0 Phase 1C-B
**TC:** TC-013-AuthUX-SplitScreen-Phase1C-B.md
**Lane:** B
**Status:** POST-execution snapshot

---

## Changes executed

### Modified files (5)

1. **`src/app/(other)/auth/sign-in/components/SignIn.tsx`** — rewritten to split-screen layout (`.auth-split` wrapper, `.auth-split-form` left + `<AuthVisualPanel />` right). Removed: no Google button to remove (was never present); kept `useSignIn()` hook untouched. Removed sign-up bottom link per TC. Button: `btn btn-primary` (purple).

2. **`src/app/(other)/auth/sign-up/components/SignUp.tsx`** — rewritten to split-screen. Local Supabase signUp logic preserved byte-equivalent in handler. Button: `btn btn-primary`. No Google button present originally — none added.

3. **`src/app/(other)/auth/reset-password/components/ResetPassword.tsx`** — rewritten to split-screen. No-op `handleSubmit(() => {})` preserved. Button: `btn btn-primary`. Removed legacy `bg-light bg-opacity-50 border-light` input overrides.

4. **`src/app/(other)/auth/lock-screen/components/LockScreen.tsx`** — rewritten to split-screen. Yup schema + no-op handler preserved. Button: `btn btn-primary`.

5. **`src/assets/scss/pages/_authentication.scss`** — removed rainbow gradient animation from `body.authentication-bg` (replaced with `var(--bs-body-bg)`); kept `.account-pages` min-height. Added `.auth-split`, `.auth-split-form`, `.auth-split-form-inner`, `.auth-split-visual`, `.auth-split-visual-content`, `.auth-split-visual-brand`, `.auth-split-visual-tagline`. Visual panel uses radial+linear gradient stack of `$primary`/`$indigo`/`$gray-900` with inline SVG (data URI) decorative geometric pattern overlay at opacity 0.85. Visual hidden <992px (form full-width). Preserved `.auth-logo` light/dark switch.

### Created files (2)

6. **`src/app/(other)/auth/components/AuthVisualPanel.tsx`** — new shared component rendering the right 40% gradient panel + VP-Flow brand + tagline "System of Record · Office of the Vice President". Used by all 4 auth views.

7. **`Project Restore Points/v2.0/RP_AuthUX_PRE_TC013.md`** — PRE snapshot.

## Files explicitly NOT touched (per TC §"Forbidden")

- `src/app/(other)/auth/sign-in/useSignIn.ts` — 0 lines changed
- `src/layouts/AuthLayout.tsx` — 0 lines changed
- All `page.tsx` route shells — 0 lines changed
- All `supabase/migrations/*.sql` — 0 lines changed
- All Edge Functions — 0 lines changed

Verified via `git status --short`: only the 5 in-scope files + 2 new files appear as modified/untracked.

## Validation

- `npm run lint` → **0 errors**, 12 pre-existing warnings (accepted via TC-009 — none introduced by TC-013)
- `npm run build` → **PASS** (vite built in 10.89s, PWA generateSW 105 entries)
- Auth hook files unmodified (verified by file diff scope)
- No migration files touched
- No hardcoded hex in TSX (SVG data URI in SCSS contains `%23ffffff` for stroke — allowed per TC §"Constraints" "no new hardcoded hex values except in SVG data URI if unavoidable")

## Visual outcome

- Desktop (≥992px): 60% form panel left (dark VP-Flow body bg) + 40% visual panel right (purple→indigo→dark gradient with SVG geometric overlay + "VP-Flow" headline + tagline)
- Tablet/mobile (<992px): visual panel hidden, form full-width centered
- Primary CTA: purple `btn-primary` on all 4 views
- Form structure preserved (labels, validation states, error feedback) — only wrapping markup and CSS classes changed

## Restoration procedure (if needed)

```
git checkout HEAD -- "src/app/(other)/auth/" "src/assets/scss/pages/_authentication.scss"
rm "src/app/(other)/auth/components/AuthVisualPanel.tsx"
rmdir "src/app/(other)/auth/components"
```

## Phase gate status

Phase 1C-B awaiting Delroy closure signal. Do not advance to next phase without explicit instruction.
