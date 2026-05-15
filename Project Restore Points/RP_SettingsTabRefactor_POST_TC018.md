# Restore Point — POST — TC-018 Settings Tab Refactor

- **TC:** TC-018 Settings Tab Refactor
- **Lane:** B (Medium)
- **Date:** 2026-05-15
- **Mode:** EXTENDED

## State After Execution

### Tab structure (Settings page)

`src/app/(admin)/settings/page.tsx` now renders a `Tab.Container` with `Nav variant="tabs"` (same Bootstrap pattern used in `ClientDetail.tsx`). Tabs in order:

| # | Tab key          | Label         | Component                       | Visible to              |
|---|------------------|---------------|---------------------------------|-------------------------|
| 1 | `profile`        | Profiel       | `ProfileCard`                   | All roles               |
| 2 | `appearance`     | Weergave      | `ThemeSettingsCard`             | All roles               |
| 3 | `notifications`  | Notificaties  | `NotificationPreferencesCard`   | All roles               |
| 4 | `system`         | Systeem       | `SystemInfoCard`                | All roles               |
| 5 | `email-config`   | E-mail Config | `EmailSettingsCard`             | VP + Secretary (not Protocol) |

Default active tab: `profile`. Active tab is React state via `Tab.Container` (not persisted — resets on refresh as required).

### Role filter (Email Config)

- Source: `import { isProtocol } from '@/hooks/useUserRole'` + `role` from `useAuthContext()`.
- Implementation: `const showEmailConfig = !isProtocol(role)`. Both the `Nav.Item` and the `Tab.Pane` for `email-config` are wrapped in `{showEmailConfig && (...)}` — tab not rendered for Protocol (no DOM presence).
- Verification: with `role === 'protocol'`, `isProtocol(role)` returns `true`, `showEmailConfig` is `false`, both fragments are skipped. With `role === 'vp'` or `role === 'secretary'`, `isProtocol` returns `false`, tab + pane render.

### Version source

- Central constant: `APP_INFO.version` in `src/app/(admin)/settings/constants.ts`.
- Updated from `"1.3.0"` → `"2.0.0"` to reflect current baseline (v2.0 phase work).
- Consumed by `SystemInfoCard` as `v{APP_INFO.version}`. No hardcoded version literal in `page.tsx` or component bodies.

### Consolidated push toggle

- **Removed:** standalone `PushNotificationToggle.tsx` (file deleted) + its export in `components/index.ts`. The dedicated card with Status badge + Enable/Disable switch is gone.
- **Added:** in `NotificationPreferencesCard`, a status `Badge` (Active / Inactive / Blocked / Not Supported) rendered next to the "Push notificaties" label. Status is derived from `usePushSubscription()` (`isSupported`, `permission`, `isSubscribed`).
- **Unchanged:** preference toggle data flow (`useUpsertNotificationPreferences`), SMTP save flow, RLS, hooks.

### Language fix

- `EmailSettingsCard`: `"Test Verbinding"` → `"Test Connection"`, `"Opslaan"` → `"Save"`. Only these two button labels changed.

## Files modified

- `src/app/(admin)/settings/page.tsx` (rewritten as Tab.Container layout)
- `src/app/(admin)/settings/components/NotificationPreferencesCard.tsx` (added status badge)
- `src/app/(admin)/settings/components/EmailSettingsCard.tsx` (2 button labels)
- `src/app/(admin)/settings/constants.ts` (version bump 1.3.0 → 2.0.0)
- `src/app/(admin)/settings/components/index.ts` (removed PushNotificationToggle export)

## Files deleted

- `src/app/(admin)/settings/components/PushNotificationToggle.tsx`

## Validation

- `npm run lint` → 0 errors, 7 pre-existing warnings (accepted via TC-009).
- `npm run build` → built in 14.28s, 0 errors. PWA precache regenerated.
- Role-filter logic verified by reading: `isProtocol(role)` short-circuits both the Nav.Item and Tab.Pane render for Email Config.

## Not touched

- RLS, migrations, auth, Edge Functions.
- `usePushSubscription` hook, `useNotificationPreferences` hook, `useEmailSettings` hook.
- All other modules.

## Rollback

`git checkout HEAD -- src/app/(admin)/settings/` and restore `PushNotificationToggle.tsx` from git history.
