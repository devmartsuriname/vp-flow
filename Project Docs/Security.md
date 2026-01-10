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

**Document Version:** 1.0  
**Created:** 2026-01-10  
**Authority:** Devmart / Office of the Vice President
