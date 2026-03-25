# v2.0 Phase 2 — Revised: Split Phase 1A into 1A.1 and 1A.2

## Correction Applied

Push Notifications and Email Notifications split into independent execution phases. Email is blocked by missing domain configuration and must not be bundled with execution-ready Push work.

---

## Phase 1A.1 — Push Notifications Only

### Pre-Implementation Gate


| Gate Item                         | Status                                          |
| --------------------------------- | ----------------------------------------------- |
| RLS strategy — push_subscriptions | DEFINED — owner-only (user_id = auth.uid())     |
| Edge Function security            | DEFINED — JWT validation in-code                |
| Migration approach                | Additive only, no v1.x changes                  |
| Existing PWA                      | Confirmed — vite-plugin-pwa with workbox active |
| External blockers                 | NONE — can proceed immediately                  |


### Execution Steps

1. Create `push_subscriptions` table with RLS (migration)
2. VAPID key generation and storage as Supabase secrets
3. Push service worker extension (`public/sw-push.js`) integrated with existing workbox SW
4. Edge Function: `send-push-notification` (JWT-validated, queries subscriptions, sends Web Push)
5. Client hook: `usePushSubscription` (subscribe/unsubscribe logic)
6. Settings UI: `PushNotificationToggle.tsx` component
7. Delivery wiring: trigger on `notifications` table insert via `pg_net` to invoke push delivery (no v1.x trigger modifications)

### Restore Points

- **PRE:** `Project Restore Points/v2.0/RP-v2.0-Phase2-1A1-PRE.md`
- **POST:** `Project Restore Points/v2.0/RP-v2.0-Phase2-1A1-POST.md`

### Validation

- Push subscription stored in DB with owner-only RLS
- Browser push permission request works
- Notification delivered when new `notifications` row inserted
- No impact on existing v1.x modules
- No email-related code or infrastructure created

---

## Phase 1A.2 — Email Notifications Only

### Pre-Implementation Gate


| Gate Item            | Status                                         |
| -------------------- | ---------------------------------------------- |
| Email domain         | REQUIRED — must be configured before execution |
| Email infrastructure | REQUIRED — setup_email_infra must complete     |
| Push notifications   | Independent — Phase 1A.1 not required          |


### Execution Steps (after domain is configured)

1. Email domain setup (user action via Lovable email setup dialog)
2. Email infrastructure setup (queue, tables, cron dispatcher)
3. Scaffold transactional email Edge Functions
4. Create 4 email templates:
  - Case deadline warning
  - Appointment decision
  - Document finalized
  - Incoming post status update
5. Register templates in registry
6. Wire email delivery into notification flow (extend `pg_net` trigger or `process-notification-channels` Edge Function)
7. Create unsubscribe page
8. Deploy all email Edge Functions

  
**NOTE — PUSH NOTIFICATION SECURITY ENFORCEMENT (MANDATORY BEFORE EXECUTION)**

---

## CONTEXT

Phase 1A.1 (Push Notifications) is approved for execution.

Before implementation begins, push delivery must be strictly controlled.

---

## REQUIRED SECURITY RULES

### 1. Allowed Trigger Path (MANDATORY)

Push notifications may ONLY be triggered via:

- Server-side logic tied to:
  - `notifications` table insert events
  - Controlled backend flow

NOT allowed:

- Direct client calls to `send-push-notification`
- Public or unauthenticated access

---

### 2. Edge Function Protection

For `send-push-notification`:

- Require JWT validation
- Validate user context (no blind execution)
- Reject all unauthenticated requests
- No public endpoints

---

### 3. Audit Logging (MANDATORY)

Each push event must:

- Be traceable via existing audit system
- Include:
  - user_id
  - notification type
  - timestamp

No silent delivery allowed.

---

### 4. Rate Control (BASIC)

- Prevent rapid repeated push calls
- Ensure no infinite trigger loops from DB events

---

## CONSTRAINTS

- No changes to existing v1.x audit system
- No bypass of RLS
- No new public endpoints

---

## STOP CONDITION

- Security rules confirmed
- Implementation may begin

---

**Governance:**

- Security is mandatory
- No assumptions
- Audit logging required
- RLS enforced

---

**Await Further Instructions**  
  
  
Restore Points

- **PRE:** `Project Restore Points/v2.0/RP-v2.0-Phase2-1A2-PRE.md`
- **POST:** `Project Restore Points/v2.0/RP-v2.0-Phase2-1A2-POST.md`

### Validation

- Email domain verified
- Transactional email sends successfully
- All 4 templates render correctly
- Suppression and unsubscribe functional
- No impact on existing v1.x modules
- No push notification code modified

---

## Execution Rules

- Phase 1A.1 may proceed immediately upon approval
- Phase 1A.2 is BLOCKED until email domain is configured and verified
- Each phase has independent restore points — no cross-phase restore points
- Each phase is independently verifiable and rollbackable
- No code from Phase 1A.2 may be introduced during Phase 1A.1 execution

## What is NOT touched

- No v1.x files modified
- No existing RLS policies changed
- No existing triggers modified
- All changes are additive