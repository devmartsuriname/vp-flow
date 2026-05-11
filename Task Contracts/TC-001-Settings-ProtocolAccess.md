# TC-001 — Protocol Settings Access

**Status:** EXECUTED
**Lane:** B (UI component change — no migration, no RLS change)
**Module:** Settings
**Created:** 2026-05-11
**Created by:** Devmart (Claude.ai / Cowork)
**Approved by:** Delroy — 2026-05-11 ("Goedgekeurd. Start uitvoering.")
**Executed:** 2026-05-11 (Claude Code, Mode A)
**Restore points:** PRE `RP_Settings_PRE_ProtocolAccess.md`, POST `RP_Settings_POST_ProtocolAccess.md`

---

## Context

The PRD (Phase_1_RLS_Policy_Matrix.md) specifies that Protocol users may read their own profile (`user_profiles` — self only). The Settings page currently redirects Protocol to `/dashboards` entirely, which conflicts with the PRD and with Delroy's explicit decision (2026-05-11).

The Settings page has 4 cards:
- ProfileCard — all roles (per PRD: Protocol reads own profile)
- ThemeSettingsCard — all roles (personal preference, no governance risk)
- SystemInfoCard — all roles (VP sees extra info, no sensitive data for others)
- PushNotificationToggle — VP and Secretary only (correctly excluded)

**Decision:** Protocol must have access to the first 3 cards. The Push Toggle exclusion remains.

---

## Scope

Remove the Protocol redirect from `settings/page.tsx`.  
Remove the Protocol render-block safety check from `settings/page.tsx`.  
Verify that `PushNotificationToggle` component already restricts Protocol internally — if not, add the check inside the component.  
No changes to any other file.

---

## Out of Scope

- No RLS changes
- No migration
- No changes to ProfileCard, ThemeSettingsCard, SystemInfoCard components
- No changes to navigation or routing
- No changes to any other page or module
- No style changes

---

## Files Affected

| File | Change |
|---|---|
| `src/app/(admin)/settings/page.tsx` | Remove Protocol redirect (useEffect) and Protocol render-block |
| `src/app/(admin)/settings/components/PushNotificationToggle.tsx` | Verify Protocol is excluded — add check if missing |

---

## Acceptance Criteria

- [x] Protocol user can navigate to `/settings` without redirect
- [x] Protocol user sees: ProfileCard, ThemeSettingsCard, SystemInfoCard
- [x] Protocol user does NOT see PushNotificationToggle
- [x] VP user sees all 4 cards (no regression)
- [x] Secretary user sees all 4 cards (no regression)
- [x] Build passes (`npm run build`)
- [x] Lint passes on touched files (repo-wide pre-existing issues out of scope)

---

## Restore Points

- PRE: `RP_Settings_PRE_ProtocolAccess.md`
- POST: `RP_Settings_POST_ProtocolAccess.md`

---

## Governance Checklist

- [x] Guardian Rules confirmed active
- [x] No frozen v1.x RLS behavior touched
- [x] No killed features reintroduced
- [x] RLS not bypassed (user_profiles self-only SELECT already enforced at DB level)
- [x] Build/lint passes after execution
- [x] PRE restore point created before execution
- [x] POST restore point created after execution

---

## Notes

The RLS policy for `user_profiles` (Protocol: R self only) is already in place — no DB change needed. This is purely a UI gating correction to align the frontend with the PRD.

After execution: update CLAUDE.md Section 14 to mark this issue as RESOLVED.
