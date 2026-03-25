# Restore Point: v2.0 Phase 2 — Phase 1A.1 Post-Execution
**Created:** 2026-03-25
**Phase:** v2.0 Phase 2 — Phase 1A.1 (Push Notifications Only)
**Status:** POST-EXECUTION

## Changes Applied

### Database
- Created `push_subscriptions` table with owner-only RLS (SELECT, INSERT, DELETE)
- Enabled `pg_net` extension for HTTP calls from triggers
- Created `trigger_push_notification()` function — calls Edge Function on notification INSERT
- Created `on_notification_send_push` trigger on `notifications` table

### Supabase Secrets
- `VAPID_PUBLIC_KEY` — stored as runtime secret + exposed in `.env` as `VITE_VAPID_PUBLIC_KEY` (publishable)
- `VAPID_PRIVATE_KEY` — stored as runtime secret (Edge Function only)
- `VAPID_SUBJECT` — stored as runtime secret (Edge Function only)

### New Files Created
- `supabase/functions/send-push-notification/index.ts` — Edge Function with JWT validation, internal-only access control, Web Push RFC 8291 implementation
- `public/sw-push.js` — Push event handler (push + notificationclick) imported by workbox SW
- `src/hooks/usePushSubscription.ts` — Client hook for subscribe/unsubscribe
- `src/app/(admin)/settings/components/PushNotificationToggle.tsx` — Settings UI card

### Modified Files
- `vite.config.ts` — Added `importScripts: ['/sw-push.js']` to workbox config
- `src/app/(admin)/settings/page.tsx` — Added PushNotificationToggle card
- `src/app/(admin)/settings/components/index.ts` — Added PushNotificationToggle export
- `.env` — Added `VITE_VAPID_PUBLIC_KEY`

## Security Controls
- Edge Function rejects direct client calls (requires `x-trigger-source: pg_trigger` header + anon role OR service_role)
- Push subscriptions are owner-only via RLS
- Expired/invalid subscriptions auto-cleaned on 410/404 responses
- No v1.x triggers modified — new AFTER INSERT trigger on notifications table
- Trigger uses pg_net for async, non-blocking delivery

## Zero-Risk Checklist
- [x] No schema changes to v1.x tables
- [x] No RLS policy changes on v1.x tables
- [x] No existing trigger modifications
- [x] No UI changes outside Settings page
- [x] No email-related code introduced
- [x] All changes are additive
- [x] Build compiles without errors

## Rollback Instructions
1. Drop trigger: `DROP TRIGGER on_notification_send_push ON public.notifications;`
2. Drop function: `DROP FUNCTION public.trigger_push_notification();`
3. Drop table: `DROP TABLE public.push_subscriptions;`
4. Remove `importScripts` line from vite.config.ts
5. Remove PushNotificationToggle from Settings page
6. Delete new files: sw-push.js, send-push-notification/, usePushSubscription.ts, PushNotificationToggle.tsx
7. Remove `VITE_VAPID_PUBLIC_KEY` from .env
8. Remove VAPID secrets from Supabase
