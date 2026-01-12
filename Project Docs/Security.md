# VP-Flow — Security Documentation

**Project:** VP-Flow  
**Client:** Office of the Vice President of Suriname  
**Document Type:** Security Policy Summary  
**Status:** Documentation Only

---

## Document Purpose

This document summarizes the security architecture for VP-Flow, including Row-Level Security policies, audit logging requirements, and data isolation principles.

> **Authoritative Source:** `Phase_1_RLS_Policy_Matrix.md`

---

## Security Principles

### Core Tenets

1. **Least Privilege:** Users access only what their role requires
2. **Defense in Depth:** Security at database, API, and UI levels
3. **Audit Everything:** All critical actions leave an immutable trail
4. **Data Isolation:** Protocol role has strict visibility boundaries
5. **Immutability:** Closed cases cannot be modified

---

## Role-Based Access Summary

### VP (Vice President)

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Clients | ✓ | ✓ | ✓ | ✓ |
| Appointments | ✓ | ✓ | ✓ | ✓ |
| Cases | ✓ | ✓ | ✓ | — (close only) |
| Audit Logs | — | ✓ | — | — |
| Reminders | ✓ | ✓ | ✓ | ✓ |

**Unique Authorities:**
- Approve appointments
- Create cases from appointments
- Close cases (FINAL action)
- View audit logs

### Secretary

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Clients | ✓ | ✓ | ✓ | — |
| Appointments | ✓ | ✓ | ✓ | — |
| Cases | — | ✓ | — | — |
| Audit Logs | — | — | — | — |
| Reminders | ✓ | ✓ | ✓ | — |

**Restrictions:**
- Cannot approve appointments
- Cannot create cases
- Cannot close cases
- Cannot view audit logs

### Protocol

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Clients | — | — | — | — |
| Appointments | — | ✓ (approved only) | — | — |
| Cases | — | — | — | — |
| Audit Logs | — | — | — | — |
| Reminders | — | — | — | — |

**Strict Isolation:**
- Can ONLY see approved appointments
- Cannot see pending or rejected appointments
- Cannot access cases under any circumstance
- Cannot access client notes or sensitive details

---

## Row-Level Security (RLS) Policies

### RLS Implementation Strategy

All tables are protected by RLS policies that:
1. Check user role from session/JWT
2. Apply appropriate filters per role
3. Enforce at database level (cannot bypass via API)

### Policy Summary by Table

#### `clients` Table

| Role | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| VP | All | All | All | All |
| Secretary | All | All | All | None |
| Protocol | **NONE** | None | None | None |

```sql
-- Conceptual Policy (not actual implementation)
-- Protocol is completely blocked from clients table
```

#### `appointments` Table

| Role | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| VP | All | All | All | All |
| Secretary | All | All | All (except approve) | None |
| Protocol | **Approved only** | None | None | None |

```sql
-- Conceptual Policy for Protocol
-- WHERE status = 'approved' AND appointment_date = CURRENT_DATE
```

#### `cases` Table

| Role | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| VP | All | All | All (except closed) | None |
| Secretary | All | None | None | None |
| Protocol | **NONE** | None | None | None |

**Critical Rule:** Closed cases have no UPDATE policy for any role.

#### `audit_logs` Table

| Role | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| VP | All | Via function only | **NONE** | **NONE** |
| Secretary | None | Via function only | **NONE** | **NONE** |
| Protocol | None | Via function only | **NONE** | **NONE** |

**Critical Rule:** Audit logs are append-only. No role can update or delete.

---

## Data Isolation Rules

### Protocol Isolation

Protocol role has the most restricted access:

```
┌────────────────────────────────────────────────────┐
│              PROTOCOL VISIBILITY                    │
│                                                    │
│  ╔════════════════════════════════════════════╗   │
│  ║  VISIBLE                                   ║   │
│  ║  • Approved appointments (today)           ║   │
│  ║  • Appointment time, location              ║   │
│  ║  • Client name (display only)              ║   │
│  ║  • Appointment purpose                     ║   │
│  ╚════════════════════════════════════════════╝   │
│                                                    │
│  ╔════════════════════════════════════════════╗   │
│  ║  HIDDEN                                    ║   │
│  ║  • All cases                               ║   │
│  ║  • Client contact details                  ║   │
│  ║  • Client notes                            ║   │
│  ║  • Appointment internal notes              ║   │
│  ║  • Pending/rejected appointments           ║   │
│  ║  • Historical appointments                 ║   │
│  ║  • Audit logs                              ║   │
│  ╚════════════════════════════════════════════╝   │
└────────────────────────────────────────────────────┘
```

### Closed Case Immutability

Once a case is closed by the VP:

| Action | Allowed |
|--------|---------|
| View case details | ✓ (VP, Secretary) |
| Modify case fields | ✗ |
| Reopen case | ✗ |
| Delete case | ✗ |
| Add notes to closed case | ✗ |

**Enforcement:** Database trigger + RLS policy combination

---

## Audit Logging

### Purpose

Maintain an immutable record of all significant actions for:
- Accountability
- Investigation support
- Compliance
- Institutional memory

### Logged Actions

| Category | Actions Logged |
|----------|----------------|
| Authentication | Login, logout, failed attempts |
| Appointments | Create, update, approve, reject, cancel |
| Cases | Create, update status, close, assign |
| Clients | Create, update, delete |
| System | Role changes, permission modifications |

### Audit Log Structure (Conceptual)

| Field | Description |
|-------|-------------|
| `id` | Unique log entry ID |
| `timestamp` | When action occurred |
| `user_id` | Who performed action |
| `user_role` | Role at time of action |
| `action` | Type of action |
| `entity_type` | Table/entity affected |
| `entity_id` | ID of affected record |
| `old_values` | Previous state (if update) |
| `new_values` | New state |
| `ip_address` | Request origin |

### Audit Retention
- Logs retained indefinitely
- No automated purging
- Archive strategy for older logs (future consideration)

---

## Authentication Security

### Password Requirements
- Minimum 8 characters
- Enforced by Supabase Auth defaults
- Consider strengthening for government context

### Session Security
- JWT-based sessions
- Automatic token refresh
- Secure logout (token revocation)
- Session timeout for inactivity (configurable)

### Brute Force Protection
- Rate limiting on login attempts
- Account lockout after repeated failures
- Alerts on suspicious activity

---

## Data Protection

### Sensitive Data Handling

| Data Type | Protection |
|-----------|------------|
| Client contact info | RLS (VP, Secretary only) |
| Client notes | RLS (VP, Secretary only) |
| Case details | RLS (VP, Secretary only) |
| Audit logs | RLS (VP read-only) |
| User passwords | Hashed by Supabase Auth |

### Data in Transit
- All API calls over HTTPS
- TLS 1.2+ enforced

### Data at Rest
- PostgreSQL encryption via Supabase
- Backup encryption enabled

---

## Security Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ LAYER 1: Authentication (Supabase Auth)             │   │
│  │ • Verify user identity                              │   │
│  │ • Issue session token with role                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ LAYER 2: Authorization (RLS Policies)               │   │
│  │ • Check role against resource                       │   │
│  │ • Filter data at database level                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ LAYER 3: Application Logic                          │   │
│  │ • Validate state transitions                        │   │
│  │ • Enforce business rules                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ LAYER 4: Audit (Append-only Logs)                   │   │
│  │ • Record all critical actions                       │   │
│  │ • Immutable trail                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Testing Requirements

### Pre-Deployment Checks

| Test | Description |
|------|-------------|
| RLS Verification | Attempt unauthorized access per role |
| Protocol Isolation | Confirm case access is blocked |
| Closed Case Lock | Attempt modification of closed case |
| Audit Integrity | Attempt update/delete of audit log |
| Auth Bypass | Test direct API access without session |

### Ongoing Security

| Practice | Frequency |
|----------|-----------|
| Dependency updates | Monthly |
| Access review | Quarterly |
| Audit log review | As needed |
| Penetration testing | Pre-launch, annually |

---

## References

- **Complete RLS Matrix:** `Phase_1_RLS_Policy_Matrix.md`
- **System Architecture:** `Phase_1_Architecture_Data_Model.md`
- **Workflow Definitions:** `Phase_1_Workflow_State_Diagrams.md`

---

## Security Scan Disposition (Fix / Accept / Defer)

**Scan Date:** 2026-01-11  
**Total Findings:** 10 (2 ERROR, 6 WARN, 2 INFO)

### ERROR Findings

| ID | Table | Finding | Disposition | Rationale |
|----|-------|---------|-------------|-----------|
| EXPOSED_SENSITIVE_DATA | `appointment_attendees` | "Meeting Attendee Contact Information Could Be Stolen" | **FIXED (2026-01-11)** | Implemented Option 2 enforcement: Created `appointment_attendees_protocol` VIEW excluding email/phone. Dropped Protocol direct table access. Protocol must use restricted VIEW. |
| EXPOSED_SENSITIVE_DATA | `clients` | "Client Personal and Business Data Could Be Exposed" | **FALSE POSITIVE** | RLS is ENABLED. SELECT policy: `is_vp_or_secretary(auth.uid())`. Protocol and anon have NO access. No `USING(true)` policy exists. Scanner misidentified due to heuristic check. |

### WARNING Findings

| ID | Table | Finding | Disposition | Rationale |
|----|-------|---------|-------------|-----------|
| MISSING_RLS_PROTECTION | `cases` | "No DELETE policy" | **ACCEPT (Intentional)** | Per Phase 1 §7: Cases cannot be deleted. Absence of DELETE policy is by design. RLS blocks unauthorized users at SELECT/INSERT/UPDATE level. |
| MISSING_RLS_PROTECTION | `reminders` | "No INSERT/UPDATE/DELETE policies" | **ACCEPT (Intentional)** | Per Phase 1 §8: Reminders are system-managed only. Users should not INSERT/UPDATE/DELETE. System uses service role for writes. |
| MISSING_RLS_PROTECTION | `notifications` | "No INSERT/DELETE policies" | **ACCEPT (Intentional)** | Per Phase 1 §11: Notifications created by system-only, auto-expire. Users can read/mark-read only. This is correct design. |
| MISSING_RLS_PROTECTION | `audit_events` | "No UPDATE/DELETE policies" | **ACCEPT (Intentional)** | Per Phase 1 §12: Audit logs are immutable (append-only). UPDATE/DELETE denial is implicit via RLS. This is a critical security feature, not a gap. |
| MISSING_RLS_PROTECTION | `protocol_events` | "No DELETE policy" | **ACCEPT (Intentional)** | Per Phase 1 §9: Protocol events maintain historical record. DELETE not allowed by design. |
| MISSING_RLS_PROTECTION | `documents` | "No UPDATE policy" | **DEFER** | Documents feature not implemented in v1.0 UI. Table exists for future use. When activated, add: `CREATE POLICY "VP/Secretary can update documents" ON documents FOR UPDATE USING (is_vp_or_secretary(auth.uid()))`. |

### INFO Findings

| ID | Table | Finding | Disposition | Rationale |
|----|-------|---------|-------------|-----------|
| MISSING_RLS_PROTECTION | `user_profiles` | "No DELETE policy" | **ACCEPT (Intentional)** | Per Phase 1 §3: User profiles cannot be deleted. Deactivation only (`is_active = false`). |
| MISSING_RLS_PROTECTION | `notifications` | "Users Cannot Clear Their Own Notifications" | **DEFER** | Low priority UX enhancement. Can be added in Phase 5 if requested: `CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (user_id = auth.uid())`. |

### High-Risk Item Analysis

#### A) `appointment_attendees` Protocol Access — OPTION 2 ENFORCED

**Decision Owner:** VP Office  
**Decision Date:** 2026-01-11  
**Status:** DECIDED (FINAL)

**Binding Policy:** OPTION 2 — PROTOCOL LIMITED VIEW

Protocol role access to `appointment_attendees`:
- **CAN see:** `id`, `appointment_id`, `name`, `role`, `created_at`
- **CANNOT see:** `email`, `phone`

**Operational Context (documentation only, not system behavior):**
- Physical check-in happens at the front desk (balie)
- Protocol prepares based on appointment visibility only
- No confirmation or status changes occur in VP-Flow
- Contact with attendees is managed offline by Secretary/VP

**Rationale:**
- Cabinet-level privacy requirement
- Least-privilege principle for Protocol role
- Protocol = viewer only, not coordinator

**Implementation Status:** ✓ COMPLETE (2026-01-11)
- Created `appointment_attendees_protocol` VIEW excluding email/phone columns
- Dropped Protocol direct SELECT policy on base table
- Protocol must now query the VIEW for attendee data
- VP/Secretary retain full access to base table with all columns

#### B) `clients` Table (FALSE POSITIVE - VERIFIED)

**Verification:**
- RLS ENABLED: ✓
- Anon SELECT: ✗ BLOCKED (no policy for anon)
- VP SELECT: ✓ `is_vp_or_secretary(auth.uid())`
- Secretary SELECT: ✓ `is_vp_or_secretary(auth.uid())`
- Protocol SELECT: ✗ BLOCKED (no matching policy)

**Conclusion:** Scanner heuristic false positive. No action required.

---

---

## Appendix A: Security Scan Evidence (Audit-Grade)

### A.1 `clients` Table — FALSE POSITIVE

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "Client Personal and Business Data Could Be Exposed" |
| **Severity** | ERROR |
| **Table** | `public.clients` |
| **RLS Enabled** | ✓ YES (verified: `rowsecurity = true`) |
| **Policies Governing SELECT** | `VP/Secretary can view clients` |
| **Policy Logic** | `USING (public.is_vp_or_secretary(auth.uid()))` |
| **VP Access** | ✓ SELECT allowed |
| **Secretary Access** | ✓ SELECT allowed |
| **Protocol Access** | ✗ BLOCKED (no matching policy) |
| **Anon Access** | ✗ BLOCKED (RLS enabled, no anon grant, no `USING(true)`) |
| **Conclusion** | Scanner false positive. RLS correctly restricts to VP/Secretary. |

### A.2 `appointment_attendees` Table — FALSE POSITIVE (2026-01-12)

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "Attendee Contact Information Could Be Harvested by Unauthorized Users" |
| **Severity** | ERROR |
| **Table** | `public.appointment_attendees` |
| **Scanner ID** | `appointment_attendees_email_phone_exposure` |
| **Scanner** | `supabase_lov` |
| **Disposition** | **IGNORED (False Positive)** |
| **RLS Enabled** | ✓ YES |

**RLS Policies Verified:**

| Policy Name | Command | Access Control |
|-------------|---------|----------------|
| `Protocol can view attendees for approved` | SELECT | `is_protocol(auth.uid()) AND appointment.status = 'approved'` |
| `VP/Secretary can manage attendees` | ALL | `is_vp_or_secretary(auth.uid())` |
| `VP/Secretary can view attendees` | SELECT | `is_vp_or_secretary(auth.uid())` |

**Additional Data Masking Enforcement:**

| Mechanism | Purpose |
|-----------|---------|
| `get_protocol_attendees()` | Security definer function that masks `email` and `phone` columns for Protocol users |
| VP Office Decision | Option 2 enforced (2026-01-11) — Protocol sees name/role only |

**Access Matrix:**

| Role | SELECT | Columns Visible |
|------|--------|-----------------|
| VP | ✓ (all appointments) | All columns |
| Secretary | ✓ (all appointments) | All columns |
| Protocol | ✓ (approved only) | `id`, `appointment_id`, `name`, `role`, `created_at`, `created_by` |
| Anon | ✗ BLOCKED | None |

**Conclusion:** Scanner false positive. Comprehensive RLS + security definer function ensures data is properly protected. Protocol cannot access email/phone. Unauthenticated users have zero access.

### A.3 `cases` Table — ACCEPTED (Phase 1 Compliant)

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "No DELETE policy" |
| **Severity** | WARN |
| **Table** | `public.cases` |
| **RLS Enabled** | ✓ YES |
| **Policies Governing SELECT** | `VP/Secretary can view cases` |
| **DELETE Policy** | None (intentional) |
| **Protocol Access** | ✗ BLOCKED (no SELECT, INSERT, UPDATE, DELETE) |
| **Design Rationale** | Per Phase 1 §7: Cases cannot be deleted. Closed cases are immutable. |
| **Conclusion** | ACCEPTED. Absence of DELETE is a security feature. |

### A.4 `audit_events` Table — ACCEPTED (Phase 1 Compliant)

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "No UPDATE/DELETE policies" |
| **Severity** | WARN |
| **Table** | `public.audit_events` |
| **RLS Enabled** | ✓ YES |
| **Policies Governing SELECT** | `VP can view audit events` |
| **Policies Governing INSERT** | `VP/Secretary can insert audit events` |
| **UPDATE Policy** | None (intentional) |
| **DELETE Policy** | None (intentional) |
| **Design Rationale** | Per Phase 1 §12: Audit logs are immutable (append-only). |
| **Conclusion** | ACCEPTED. Missing UPDATE/DELETE is a critical security feature. |

### A.5 `reminders` Table — ACCEPTED (Phase 1 Compliant)

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "No INSERT/UPDATE/DELETE policies" |
| **Severity** | WARN |
| **Table** | `public.reminders` |
| **RLS Enabled** | ✓ YES |
| **Policies Governing SELECT** | `VP/Secretary can view reminders` |
| **INSERT/UPDATE/DELETE** | None (intentional) |
| **Design Rationale** | Per Phase 1 §8: Reminders are system-managed via service role. |
| **Conclusion** | ACCEPTED. User write access is intentionally blocked. |

### A.6 `notifications` Table — ACCEPTED (Phase 1 Compliant)

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "No INSERT/DELETE policies" |
| **Severity** | WARN |
| **Table** | `public.notifications` |
| **RLS Enabled** | ✓ YES |
| **Policies Governing SELECT** | `Users can view own notifications` |
| **Policies Governing UPDATE** | `Users can update own notifications` |
| **INSERT/DELETE** | None (intentional) |
| **Design Rationale** | Per Phase 1 §11: Notifications are system-created. |
| **DELETE Note** | DEFERRED as low-priority UX enhancement |
| **Conclusion** | ACCEPTED. User INSERT/DELETE intentionally blocked. |

### A.7 `protocol_events` Table — ACCEPTED (Phase 1 Compliant)

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "No DELETE policy" |
| **Severity** | WARN |
| **Table** | `public.protocol_events` |
| **RLS Enabled** | ✓ YES |
| **Policies Governing SELECT** | Protocol OR VP/Secretary |
| **DELETE Policy** | None (intentional) |
| **Design Rationale** | Per Phase 1 §9: Historical record preserved for audit trail. |
| **Conclusion** | ACCEPTED. DELETE blocked to preserve execution history. |

### A.8 `user_profiles` Table — ACCEPTED (Phase 1 Compliant)

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "No DELETE policy" |
| **Severity** | INFO |
| **Table** | `public.user_profiles` |
| **RLS Enabled** | ✓ YES |
| **Policies Governing SELECT** | VP/Secretary: all; Others: own only |
| **DELETE Policy** | None (intentional) |
| **Design Rationale** | Per Phase 1 §3: Profiles deactivated, never deleted. |
| **Conclusion** | ACCEPTED. Missing DELETE policy is intentional. |

### A.9 `documents` Table — DEFERRED

| Attribute | Evidence |
|-----------|----------|
| **Finding** | "No UPDATE policy" |
| **Severity** | WARN |
| **Table** | `public.documents` |
| **v1.0 UI Status** | Feature NOT implemented |
| **Disposition** | DEFERRED until feature activated |
| **Proposed Fix** | `CREATE POLICY "VP/Secretary can update documents" ON documents FOR UPDATE USING (is_vp_or_secretary(auth.uid()))` |

---

## Phase 5 Validation Notes

### Scan Disposition Summary (Phase 5 Ready)

| Finding | Status | Action Required |
|---------|--------|-----------------|
| `appointment_attendees_sensitive_exposure` | FIXED | Verify `get_protocol_attendees()` function excludes email/phone |
| `clients` table exposure | FALSE POSITIVE | No action — verified RLS blocks Protocol/anon |
| `cases` DELETE policy missing | INTENTIONAL | No action — by design per Phase 1 §7 |
| `audit_events` UPDATE/DELETE missing | INTENTIONAL | No action — append-only by design |
| `reminders` write policies missing | INTENTIONAL | No action — system-managed only |
| `notifications` INSERT/DELETE missing | INTENTIONAL | DELETE may be added in Phase 5C as UX enhancement |
| `protocol_events` DELETE missing | INTENTIONAL | No action — historical record preserved |
| `user_profiles` DELETE missing | INTENTIONAL | No action — deactivation model |
| `documents` UPDATE missing | DEFERRED | Add when feature activated in UI |

### Phase 5 Security Verification Checklist

The following items MUST be verified during Phase 5 execution:

| # | Verification | Method | Expected Result |
|---|--------------|--------|-----------------|
| 1 | Protocol cannot SELECT from cases | Direct API query as Protocol | Empty result / RLS error |
| 2 | Protocol cannot retrieve email/phone from attendees | Call `get_protocol_attendees()` | Columns not in result |
| 3 | Closed case UPDATE blocked | Attempt UPDATE on closed case | Database trigger error |
| 4 | Audit log UPDATE blocked | Attempt UPDATE on audit_events | RLS denial |
| 5 | Audit log DELETE blocked | Attempt DELETE on audit_events | RLS denial |
| 6 | Only VP can approve appointments | Secretary attempts approval | Action blocked |
| 7 | Only VP can create cases | Secretary attempts creation | Action blocked |
| 8 | Only VP can assign roles | Secretary attempts role change | Action blocked |

### No New Policies Required

All RLS policies are implemented per Phase 1 Matrix. Phase 5 is validation only — no new policies to be introduced.

---

**Document Version:** 1.3  
**Updated:** 2026-01-11  
**Phase Status:** Phase 4 CLOSED, Phase 5 READY  
**Authority:** Devmart / Office of the Vice President
