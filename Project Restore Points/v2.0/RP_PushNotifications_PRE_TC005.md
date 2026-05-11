# RP — Push Notifications PRE TC-005

**Type:** PRE restore point
**TC:** TC-005 — Push Notifications Auth Fix
**Lane:** C
**Created:** 2026-05-11
**Author:** Claude Code (Mode A, Devmart Guardian Rules v2.1)
**Status:** DRAFT — awaiting Delroy goedkeuring before any execution

---

## 1. Purpose

Snapshot the current state of the push notification auth chain before TC-005 executes. Captures:
- Current `trigger_push_notification()` function body (from migration `20260325104819`)
- Edge Function `send-push-notification/index.ts` access control logic
- Edge Function "Verify JWT with legacy secret" setting (confirmed ON via Supabase Dashboard)
- 401 evidence on `net._http_response`

---

## 2. Current Edge Function — Verify JWT Setting

| Setting | Current State | Source |
|---|---|---|
| `Verify JWT with legacy secret` on `send-push-notification` | **ON (ENABLED)** | Supabase Dashboard → Edge Functions → send-push-notification → Settings (confirmed by Delroy during TC-003 diagnostic) |

Result: Auth Gateway rejects all calls with 401 `{"error":"Invalid token"}` because the trigger sends a legacy anon JWT while the project is on the new `sb_publishable_*` key format.

Evidence: `net._http_response` rows at `2026-05-11 21:20:39.620737` — `status_code: 401`, `content: {"error":"Invalid token"}`. No Edge Function invocation logged in dashboard (rejection happens before function executes).

---

## 3. Current Trigger Function Body — VERBATIM

Source: `supabase/migrations/20260325104819_045b0e84-738b-4139-8b5c-7abf8ee1951d.sql`

```sql
-- Update trigger to use anon key (publishable, already public in codebase)
CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_request_id bigint;
BEGIN
  -- Call send-push-notification Edge Function using anon key
  -- The Edge Function will use service role key from its own env for DB access
  SELECT net.http_post(
    url := 'https://xjkkumclqqnjngnttabf.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqa2t1bWNscXFuam5nbnR0YWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjgzNTgsImV4cCI6MjA4MzYwNDM1OH0.ScqfBEHeOUwyrOYbjRxt2vf4GAbAo24jWjFRFgsvQDA',
      'x-trigger-source', 'pg_trigger'
    ),
    body := jsonb_build_object(
      'userId', NEW.user_id,
      'title', NEW.title,
      'message', NEW.message,
      'link', NEW.link
    )
  ) INTO v_request_id;

  RETURN NEW;
END;
$$;
```

Key facts:
- Hardcoded legacy anon JWT (HS256, ref `xjkkumclqqnjngnttabf`, exp 2036-01-14) — no longer valid against new `sb_publishable_*` key format
- Hardcoded project URL (also a known issue, MEDIUM, NOT in TC-005 scope)
- `x-trigger-source: pg_trigger` header present — authoritative gate per Edge Function design

---

## 4. Current Edge Function Access Control — `send-push-notification/index.ts`

Lines 16-58 implement internal access control:

```ts
const authHeader = req.headers.get('Authorization');
const triggerSource = req.headers.get('x-trigger-source');

if (!authHeader?.startsWith('Bearer ')) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, ... });
}

// Validate JWT
const userClient = createClient(supabaseUrl, supabaseAnonKey, {
  global: { headers: { Authorization: authHeader } },
});
const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(
  authHeader.replace('Bearer ', '')
);
if (claimsError || !claimsData?.claims) {
  return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, ... });
}

const callerRole = (claimsData.claims as Record<string, unknown>).role;
const isInternalTrigger = callerRole === 'anon' && triggerSource === 'pg_trigger';
const isServiceRole = callerRole === 'service_role';

if (!isInternalTrigger && !isServiceRole) {
  return new Response(JSON.stringify({ error: 'Forbidden: internal use only' }), { status: 403, ... });
}
```

**Critical observation for Task 2 Option A:**
- Line 20-25: function returns 401 if no `Bearer` header is present
- Line 37-45: function calls `auth.getClaims()` and returns 401 on failure
- Line 49-58: function requires `callerRole === 'anon'` (from JWT claims) AND `x-trigger-source: pg_trigger`, OR `service_role`

The Edge Function does NOT currently treat `x-trigger-source` as sufficient on its own. It always requires a valid Bearer JWT first.

→ Option A in TC-005 (remove `Authorization` header from trigger) **cannot work without simultaneously modifying `index.ts`** to:
- Remove the missing-Bearer 401 gate (lines 20-25), OR
- Add a branch that accepts `x-trigger-source: pg_trigger` without a JWT, OR
- Use a different shared-secret header

This conflicts with TC-005 "Files Affected" table, which lists only the new migration — no Edge Function code change.

---

## 5. Other Frozen Push Components (untouched by TC-005)

| Component | State | Source |
|---|---|---|
| `push_subscriptions` table + RLS | Frozen | v2.0 Phase 1A.1 |
| `sw-push.js` push handler | Frozen | v2.0 Phase 1A.1 |
| `usePushSubscription.ts` client hook | Frozen | v2.0 Phase 1A.1 |
| `PushNotificationToggle.tsx` UI | Frozen | v2.0 Phase 1A.1 |
| VAPID keys in Supabase secrets | Frozen | v2.0 Phase 1A.1 |

---

## 6. Smoke Test Pre-State

- In-app notifications: WORKING (independent of push)
- Push toggle subscribe/unsubscribe: WORKING (TC-003 verified)
- `push_subscriptions` row exists for VP test device: WORKING
- Trigger fires on notification INSERT: WORKING (`net.http_post` row created)
- Auth Gateway pass: **FAILING (401)** ← TC-005 target
- Edge Function execution: BLOCKED by Auth Gateway

---

## 7. Risks Captured

| Risk | Severity | Notes |
|---|---|---|
| Option A as written breaks Edge Function internal access control | HIGH | Surfaced above — TC-005 Task 2 needs scope clarification or expansion |
| Disabling `Verify JWT` removes Auth Gateway layer | HIGH | TC risk row 1 — secure-reviewer required before execution |
| Hardcoded Supabase URL remains | MEDIUM | Out of TC-005 scope; flagged for later |
| Lane C — no rollback for `CREATE OR REPLACE` mid-flight | LOW | pg_net is async, brief window |

---

## 8. Files Snapshotted (read-only here, no modifications made)

- `supabase/migrations/20260325104819_045b0e84-738b-4139-8b5c-7abf8ee1951d.sql`
- `supabase/functions/send-push-notification/index.ts`

---

**DRAFT — PRE restore point only. No execution has started. Awaiting Delroy goedkeuring + decision on Option A scope conflict before proceeding to Task 1 or Task 2.**
