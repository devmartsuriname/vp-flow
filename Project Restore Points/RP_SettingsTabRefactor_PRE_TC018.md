# Restore Point — PRE — TC-018 Settings Tab Refactor

- **TC:** TC-018 Settings Tab Refactor
- **Lane:** B (Medium)
- **Date:** 2026-05-15
- **Mode:** EXTENDED

## Current State (PRE)

Settings page (`src/app/(admin)/settings/page.tsx`) is a single scrolling layout with the following cards rendered in a `Row` grid:

1. `ProfileCard` (Col lg=6) — readonly profile info
2. `ThemeSettingsCard` (Col lg=6) — theme preferences
3. `SystemInfoCard` (Col lg=6) — system info, version pulled from `APP_INFO.version = "1.3.0"` in `constants.ts`
4. `PushNotificationToggle` (Col lg=6) — standalone browser push subscription card (with Status badge + Enable switch); guarded internally by `isProtocol(role) → null`
5. `NotificationPreferencesCard` (Col lg=6) — per-user push + email preference toggles (DB); Dutch labels for push/email
6. `EmailSettingsCard` (Col lg=12) — SMTP config; gated by `role === 'vp'` only; buttons labelled "Test Verbinding" + "Opslaan"

## Files to be modified

- `src/app/(admin)/settings/page.tsx`
- `src/app/(admin)/settings/components/NotificationPreferencesCard.tsx`
- `src/app/(admin)/settings/components/EmailSettingsCard.tsx`
- `src/app/(admin)/settings/components/SystemInfoCard.tsx` (centralized version source confirmation)
- `src/app/(admin)/settings/constants.ts` (version bump)
- `src/app/(admin)/settings/components/index.ts` (remove standalone push toggle export)
- `src/app/(admin)/settings/components/PushNotificationToggle.tsx` (delete — standalone card removed per TC)

## Not touched

- Data hooks (`hooks/useEmailSettings`, `hooks/useNotificationPreferences`, `usePushSubscription`)
- RLS, migrations, auth, Edge Functions
- Other modules

## Rollback

Restore the files listed above from git HEAD prior to TC-018 commit.
