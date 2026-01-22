# VP-Flow Backend Documentation

**Version:** 1.0  
**Last Updated:** 2026-01-22

---

## Overview

VP-Flow uses Supabase as its backend, providing:
- PostgreSQL database with Row-Level Security (RLS)
- Authentication via Supabase Auth
- Real-time capabilities (optional, not used in v1.0)

---

## Database Tables

### Core Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `clients` | Guest registry (persons/organizations) | ✅ Enabled |
| `appointments` | VP appointment scheduling | ✅ Enabled |
| `appointment_attendees` | Appointment participants | ✅ Enabled |
| `cases` | VP-created case management | ✅ Enabled |
| `audit_events` | Immutable action log | ✅ Enabled |
| `notifications` | User notifications | ✅ Enabled |
| `documents` | File attachments (v1.1) | ✅ Enabled |
| `reminders` | Case deadline reminders | ✅ Enabled |
| `protocol_events` | Protocol execution tracking | ✅ Enabled |

### Identity Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `user_profiles` | User display names and status | ✅ Enabled |
| `user_roles` | Role assignments (VP/Secretary/Protocol) | ✅ Enabled |

---

## Roles & Permissions

### Role Definitions

| Role | Access Level |
|------|--------------|
| `vp` | Full authority - all tables, all operations |
| `secretary` | Support - appointments, clients; read-only cases |
| `protocol` | Execution - approved appointments only, no cases |

### Security Functions

```sql
-- Check if user has a specific role
has_role(user_id uuid, role app_role) → boolean

-- Role-specific helpers
is_vp(user_id uuid) → boolean
is_secretary(user_id uuid) → boolean
is_protocol(user_id uuid) → boolean
is_vp_or_secretary(user_id uuid) → boolean
```

All functions use `SECURITY DEFINER` to prevent RLS recursion.

---

## RLS Policy Summary

### Clients Table
- VP/Secretary: Full CRUD
- Protocol: No access

### Appointments Table
- VP/Secretary: Full CRUD
- Protocol: Read approved appointments only

### Cases Table
- VP: Full CRUD
- Secretary: Read-only
- Protocol: No access

### Audit Events Table
- VP: Read-only (append-only by triggers)
- Secretary/Protocol: No access

### Notifications Table
- All roles: Own notifications only

---

## Key Constraints

1. **Closed Cases are Immutable**: Database trigger prevents updates to closed cases
2. **Audit Logs are Append-Only**: No DELETE policy exists (by design)
3. **Protocol Isolation**: Protocol role cannot access cases, client notes, or attendee contact info

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) |
| `SUPABASE_DB_URL` | Direct database connection |

---

## Enums

```sql
app_role: 'vp' | 'secretary' | 'protocol'
appointment_status: 'draft' | 'pending_vp' | 'approved' | 'rejected' | 'rescheduled' | 'cancelled' | 'completed'
case_status: 'draft' | 'open' | 'in_progress' | 'parked' | 'closed'
case_priority: 'high' | 'medium' | 'low'
client_type: 'person' | 'organization'
```

---

**Document Status:** v1.0 FROZEN
