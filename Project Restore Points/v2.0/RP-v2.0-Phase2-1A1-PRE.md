# Restore Point: v2.0 Phase 2 — Phase 1A.1 Pre-Execution
**Created:** 2026-03-25
**Phase:** v2.0 Phase 2 — Phase 1A.1 (Push Notifications Only)
**Status:** PRE-EXECUTION

## Planned Changes

### New Database Table
- `push_subscriptions` — stores Web Push subscription data per user
- RLS: owner-only (user_id = auth.uid())

### New Supabase Secrets
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

### New Files
- `supabase/functions/send-push-notification/index.ts` — Edge Function for Web Push delivery
- `public/sw-push.js` — Push event handler for service worker
- `src/hooks/usePushSubscription.ts` — Client-side push subscription management
- `src/app/(admin)/settings/components/PushNotificationToggle.tsx` — Settings UI toggle

### Modified Files
- `vite.config.ts` — Add importScripts for sw-push.js in workbox config
- `src/app/(admin)/settings/page.tsx` — Add PushNotificationToggle component
- `src/app/(admin)/settings/components/index.ts` — Export new component

### Database Trigger
- New trigger on `notifications` table INSERT to invoke push delivery via pg_net

## State Before Execution
- No `push_subscriptions` table exists
- No Edge Functions exist (`supabase/functions/` is empty)
- No push notification infrastructure
- PWA exists via `vite-plugin-pwa` with workbox (app shell caching only)
- `supabase/config.toml` contains only project_id
- Settings page has 3 cards: Profile, Theme, SystemInfo

## Rollback Instructions
1. Drop `push_subscriptions` table (cascade)
2. Remove push notification trigger from `notifications` table
3. Delete all new files listed above
4. Revert modified files to pre-change state
5. Remove VAPID secrets from Supabase
