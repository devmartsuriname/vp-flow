# RP_Settings_PRE_ProtocolAccess

**Type:** PRE restore point
**TC:** TC-001 — Protocol Settings Access
**Lane:** B
**Created:** 2026-05-11
**Author:** Claude Code (Devmart execution agent)

---

## Purpose

Capture the state of the Settings module BEFORE TC-001 execution. TC-001 removes the Protocol redirect/block from `settings/page.tsx` so Protocol can see Profile + Theme + System Info, while ensuring `PushNotificationToggle` remains hidden for Protocol.

---

## Files in scope

1. `src/app/(admin)/settings/page.tsx`
2. `src/app/(admin)/settings/components/PushNotificationToggle.tsx`

No other files will be modified by TC-001.

---

## Current state — `src/app/(admin)/settings/page.tsx`

- Imports `useEffect` from React, `useNavigate` from `react-router-dom`, and `isProtocol`, `isVP` from `@/hooks/useUserRole`.
- Header docblock states: "Protocol: Redirected to dashboard".
- Lines 29–34: `useEffect` that redirects Protocol users to `/dashboards` when `role && isProtocol(role)`.
- Lines 51–54: render-block safety check — `if (isProtocol(role)) return null`.
- Renders 4 cards in `<Row>`:
  - `ProfileCard` (Col lg=6)
  - `ThemeSettingsCard` (Col lg=6)
  - `SystemInfoCard` (Col lg=6) — passes `role`
  - `PushNotificationToggle` (Col lg=6)
- `isVP` is imported but not used in this file (current state).

Net effect: Protocol cannot reach `/settings` — they are redirected away.

---

## Current state — `src/app/(admin)/settings/components/PushNotificationToggle.tsx`

- Functional component, no internal role check.
- Uses `usePushSubscription` hook for subscription state and `react-toastify` for feedback.
- Renders a Bootstrap `Card` with status badge, toggle switch, and helper text.
- Component renders the same UI for any role that mounts it. Protocol is currently kept away only because the page-level redirect prevents the component from ever mounting.

---

## What is NOT touched by TC-001

- ProfileCard, ThemeSettingsCard, SystemInfoCard components (unchanged)
- `useUserProfile` hook
- `useUserRole` hook / role model (FROZEN)
- RLS policies for `user_profiles` (already correct — Protocol R self)
- Routing, navigation, sidebars
- Any other module

---

## Risks identified before execution

- Removing the page-level Protocol block without adding an internal guard to `PushNotificationToggle` would expose the push toggle to Protocol — a governance regression. Mitigation: TC-001 explicitly requires adding the check inside the component if missing.
- An empty `<Col lg={6}>` wrapper remains in the grid if the component returns `null` for Protocol. Layout cosmetic only — no functional impact. Acceptance criteria do not forbid this; awaiting Delroy confirmation on plan.

---

## Validation plan (POST execution)

- `npm run lint`
- `npm run build`
- Manual: confirm acceptance criteria in TC-001.

---

## References

- TC: `/Task Contracts/TC-001-Settings-ProtocolAccess.md`
- PRD: Phase_1_RLS_Policy_Matrix (Protocol R self on user_profiles)
- CLAUDE.md Section 14: Known Issue — Protocol settings access
