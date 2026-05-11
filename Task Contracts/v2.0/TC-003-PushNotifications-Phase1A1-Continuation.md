# TC-003 — Push Notifications v2.0 Phase 1A.1 Continuation

**Status:** DRAFT
**Lane:** C (Edge Function, push infrastructure — highest risk)
**Module:** Push Notifications (v2.0)
**Created:** 2026-05-11
**Created by:** Devmart (Claude.ai / Cowork)
**Approved by:** — awaiting Delroy

---

## Context

v2.0 Phase 1A.1 (Push Notifications) is mid-flight. Recent commits without formal TC closure:
- `4e685aa` — Fix push toggle hang
- `9235b3b` — Add push toggle flow
- `5dc8d43` — Split phase 1A.1 post-execution

Current state (confirmed by 2026-05-11 audit):
- `push_subscriptions` table — present ✅
- `trigger_push_notification` trigger — present ✅
- `pg_net` extension — enabled ✅
- `supabase/functions/send-push-notification/index.ts` — present, JWT + trigger-source gate ✅
- `public/sw-push.js` — present ✅
- `src/hooks/usePushSubscription.ts` — present ✅
- `PushNotificationToggle.tsx` in Settings — present, toggle hang fixed ✅
- VAPID secrets in Supabase — unverified ⚠️
- Edge Function CORS: `*` — too broad ⚠️ (LOW)
- Runtime delivery with real device — untested ⚠️

**Decision (Delroy, 2026-05-11):** Optie B — continuation TC from current state.

---

## Scope

This TC covers the remaining work to formally complete and seal Phase 1A.1.

### Task 1 — Narrow Edge Function CORS (Lane C)
In `supabase/functions/send-push-notification/index.ts`:
- Replace `Access-Control-Allow-Origin: *` with the project's Supabase URL only
- Or remove the CORS header entirely (Edge Function is called server-side only, not from browser)
- Verify the function still works after the change

### Task 2 — VAPID Secrets Verification (Lane C — read-only check)
- Verify that `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` are set in Supabase Edge Function secrets
- Do NOT expose or log the private key
- Document status in the POST restore point
- If secrets are missing: STOP and report to Delroy — do not proceed

### Task 3 — Runtime Smoke Test (read + log only)
- Subscribe the toggle in Settings with a test account
- Trigger a notification via a test case action
- Verify the push arrives on a subscribed device
- Document result in the POST restore point
- If push fails: STOP and report to Delroy with error details — do not self-fix

### Task 4 — Formal Phase Closure
- Create POST restore point: `RP_PushNotifications_POST_Phase1A1_Final.md`
- Document: what works, what was verified, what remains for Phase 1A.2
- Update `CHANGELOG.md` with Phase 1A.1 closure entry
- Update `/.claude/rules/phase-gates.md` Phase 1A.1 status to CLOSED

---

## Out of Scope

- No email notifications (Phase 1A.2 — blocked until this TC closes)
- No notification preferences UI
- No changes to the `push_subscriptions` table schema
- No changes to any v1.x frozen behavior
- No new Edge Functions
- No changes to the hard-coded Supabase URL in the push migration (separate TC required — Lane C)

---

## Files Affected

| File | Change |
|---|---|
| `supabase/functions/send-push-notification/index.ts` | Narrow CORS header |
| `CHANGELOG.md` | Add Phase 1A.1 closure entry |
| `/.claude/rules/phase-gates.md` | Update Phase 1A.1 status to CLOSED |

---

## Acceptance Criteria

- [ ] CORS header narrowed in Edge Function
- [ ] VAPID secrets confirmed present in Supabase (or STOP condition triggered)
- [ ] Push notification delivered to at least one subscribed device in smoke test
- [ ] POST restore point created with full verification record
- [ ] CHANGELOG updated
- [ ] Phase gate updated to CLOSED
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)

---

## STOP Conditions — Report to Delroy if:

- VAPID secrets are missing from Supabase
- Push delivery fails after CORS fix
- Any unexpected behavior in the push_subscriptions trigger
- Scope requires touching Phase 1A.2 work

---

## Restore Points

- PRE: `Project Restore Points/v2.0/RP_PushNotifications_PRE_Phase1A1_Final.md`
- POST: `Project Restore Points/v2.0/RP_PushNotifications_POST_Phase1A1_Final.md`

---

## Governance Checklist

- [ ] Guardian Rules confirmed active
- [ ] No frozen v1.x behavior touched
- [ ] No killed features reintroduced (no offline sync, no background sync)
- [ ] RLS not bypassed
- [ ] VAPID_PRIVATE_KEY never logged or exposed in code
- [ ] Build/lint passes after execution
- [ ] PRE restore point created before execution
- [ ] POST restore point created after execution
- [ ] Delroy re-confirmed before Lane C execution begins

---

## Notes

Lane C requires Delroy re-confirmation before Claude Code begins execution. After Devmart creates the PRE restore point and presents the plan, Claude Code must pause and wait for Delroy's "Goedgekeurd" before touching the Edge Function.

Phase 1A.2 (Email Notifications) remains BLOCKED until this TC reaches status CLOSED.
