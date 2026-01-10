# VP-Flow Migration Sequence

**Phase:** 2 - Implementation Planning  
**Document Type:** Database Migration Order  
**Status:** DOCUMENTATION ONLY - NOT EXECUTED  
**Source:** Database_Schema_Design.md, RLS_Policies_SQL.md

---

## 1. Overview

This document defines the ordered sequence for creating all database objects in VP-Flow. The sequence respects dependencies between objects to ensure successful migration.

**CRITICAL:** This document is for planning purposes only. No migrations have been or will be executed until Phase 3 is authorized.

---

## 2. Migration Sequence

### Phase A: Foundation (No Dependencies)

#### A1. Enum Types

**Order:** 1-11 (can be parallel)

| Migration | Object | Dependencies |
|-----------|--------|--------------|
| A1.1 | `app_role` enum | None |
| A1.2 | `client_type` enum | None |
| A1.3 | `appointment_status` enum | None |
| A1.4 | `appointment_visibility` enum | None |
| A1.5 | `case_status` enum | None |
| A1.6 | `case_priority` enum | None |
| A1.7 | `reminder_type` enum | None |
| A1.8 | `reminder_channel` enum | None |
| A1.9 | `protocol_status` enum | None |
| A1.10 | `document_entity_type` enum | None |
| A1.11 | `audit_action` enum | None |

**SQL Reference:**
```sql
-- A1.1
CREATE TYPE public.app_role AS ENUM ('vp', 'secretary', 'protocol');

-- A1.2
CREATE TYPE public.client_type AS ENUM ('person', 'organization');

-- A1.3
CREATE TYPE public.appointment_status AS ENUM (
  'draft', 'pending_vp', 'approved', 'rejected', 
  'rescheduled', 'cancelled', 'completed'
);

-- A1.4
CREATE TYPE public.appointment_visibility AS ENUM ('vp_secretary', 'vp_only');

-- A1.5
CREATE TYPE public.case_status AS ENUM (
  'draft', 'open', 'in_progress', 'parked', 'closed'
);

-- A1.6
CREATE TYPE public.case_priority AS ENUM ('high', 'medium', 'low');

-- A1.7
CREATE TYPE public.reminder_type AS ENUM ('upcoming_deadline', 'overdue');

-- A1.8
CREATE TYPE public.reminder_channel AS ENUM ('in_app', 'email');

-- A1.9
CREATE TYPE public.protocol_status AS ENUM (
  'expected', 'arrived', 'assisted', 'no_show', 'completed'
);

-- A1.10
CREATE TYPE public.document_entity_type AS ENUM ('case');

-- A1.11
CREATE TYPE public.audit_action AS ENUM (
  'create', 'update', 'status_change', 
  'pdf_generate', 'priority_change', 'deadline_change'
);
```

---

### Phase B: Security Functions

#### B1. Role Checking Functions

**Order:** 12-16 (sequential, depends on A1.1)

| Migration | Object | Dependencies |
|-----------|--------|--------------|
| B1.1 | `has_role()` function | A1.1 (app_role) |
| B1.2 | `is_vp()` function | B1.1 |
| B1.3 | `is_secretary()` function | B1.1 |
| B1.4 | `is_protocol()` function | B1.1 |
| B1.5 | `is_vp_or_secretary()` function | B1.1 |

**SQL Reference:**
```sql
-- B1.1
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$ ... $$;

-- B1.2-B1.5 (convenience wrappers)
CREATE OR REPLACE FUNCTION public.is_vp(_user_id UUID) ...
CREATE OR REPLACE FUNCTION public.is_secretary(_user_id UUID) ...
CREATE OR REPLACE FUNCTION public.is_protocol(_user_id UUID) ...
CREATE OR REPLACE FUNCTION public.is_vp_or_secretary(_user_id UUID) ...
```

---

### Phase C: Core Tables - User Domain

#### C1. User Tables

**Order:** 17-18 (sequential)

| Migration | Object | Dependencies |
|-----------|--------|--------------|
| C1.1 | `user_roles` table | A1.1 (app_role), auth.users |
| C1.2 | `user_profiles` table | auth.users |

**SQL Reference:**
```sql
-- C1.1
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_unique UNIQUE (user_id, role)
);

-- C1.2
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### Phase D: Core Tables - Business Domain

#### D1. Primary Business Tables

**Order:** 19-22 (sequential due to FK dependencies)

| Migration | Object | Dependencies |
|-----------|--------|--------------|
| D1.1 | `clients` table | A1.2 (client_type), auth.users |
| D1.2 | `appointments` table | A1.3, A1.4, D1.1 (clients), auth.users |
| D1.3 | `appointment_attendees` table | D1.2 (appointments) |
| D1.4 | `cases` table | A1.5, A1.6, D1.1, D1.2, auth.users |

**SQL Reference:**
```sql
-- D1.1
CREATE TABLE public.clients ( ... );

-- D1.2
CREATE TABLE public.appointments ( ... );

-- D1.3
CREATE TABLE public.appointment_attendees ( ... );

-- D1.4
CREATE TABLE public.cases ( ... );
```

---

### Phase E: Supporting Tables

#### E1. Supporting Tables

**Order:** 23-27 (can be parallel after D1.4)

| Migration | Object | Dependencies |
|-----------|--------|--------------|
| E1.1 | `reminders` table | A1.7, A1.8, D1.4 (cases) |
| E1.2 | `notifications` table | auth.users |
| E1.3 | `protocol_events` table | A1.9, D1.2 (appointments) |
| E1.4 | `documents` table | A1.10, auth.users |
| E1.5 | `audit_events` table | A1.11, auth.users |

**SQL Reference:**
```sql
-- E1.1
CREATE TABLE public.reminders ( ... );

-- E1.2
CREATE TABLE public.notifications ( ... );

-- E1.3
CREATE TABLE public.protocol_events ( ... );

-- E1.4
CREATE TABLE public.documents ( ... );

-- E1.5
CREATE TABLE public.audit_events ( ... );
```

---

### Phase F: Indexes

#### F1. Performance Indexes

**Order:** 28-40 (can be parallel, after all tables)

| Migration | Object | Target Table |
|-----------|--------|--------------|
| F1.1 | `idx_user_roles_user_id` | user_roles |
| F1.2 | `idx_user_roles_role` | user_roles |
| F1.3 | `idx_user_profiles_active` | user_profiles |
| F1.4 | `idx_clients_display_name` | clients |
| F1.5 | `idx_clients_type` | clients |
| F1.6 | `idx_appointments_status` | appointments |
| F1.7 | `idx_appointments_start_at` | appointments |
| F1.8 | `idx_appointments_client_id` | appointments |
| F1.9 | `idx_cases_status` | cases |
| F1.10 | `idx_cases_priority` | cases |
| F1.11 | `idx_cases_appointment_id` | cases |
| F1.12 | `idx_reminders_scheduled` | reminders |
| F1.13 | `idx_notifications_user` | notifications |
| F1.14 | `idx_audit_events_entity` | audit_events |

---

### Phase G: Enable RLS

#### G1. Enable Row-Level Security

**Order:** 41-51 (can be parallel, after all tables)

| Migration | Object | Table |
|-----------|--------|-------|
| G1.1 | Enable RLS | user_roles |
| G1.2 | Enable RLS | user_profiles |
| G1.3 | Enable RLS | clients |
| G1.4 | Enable RLS | appointments |
| G1.5 | Enable RLS | appointment_attendees |
| G1.6 | Enable RLS | cases |
| G1.7 | Enable RLS | reminders |
| G1.8 | Enable RLS | notifications |
| G1.9 | Enable RLS | protocol_events |
| G1.10 | Enable RLS | documents |
| G1.11 | Enable RLS | audit_events |

**SQL Reference:**
```sql
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
-- ... etc
```

---

### Phase H: RLS Policies

#### H1. User Domain Policies

**Order:** 52-59 (after G1)

| Migration | Object | Table |
|-----------|--------|-------|
| H1.1 | VP view all roles | user_roles |
| H1.2 | Users view own roles | user_roles |
| H1.3 | VP manage roles | user_roles |
| H1.4 | Authenticated view profiles | user_profiles |
| H1.5 | Users update own profile | user_profiles |
| H1.6 | VP update any profile | user_profiles |
| H1.7 | System insert profiles | user_profiles |

#### H2. Client Policies

**Order:** 60-63 (after G1)

| Migration | Object | Table |
|-----------|--------|-------|
| H2.1 | VP/Secretary view clients | clients |
| H2.2 | VP/Secretary create clients | clients |
| H2.3 | VP/Secretary update clients | clients |
| H2.4 | VP delete clients | clients |

#### H3. Appointment Policies

**Order:** 64-72 (after G1)

| Migration | Object | Table |
|-----------|--------|-------|
| H3.1 | VP view all appointments | appointments |
| H3.2 | Secretary view visible | appointments |
| H3.3 | Protocol view approved | appointments |
| H3.4 | VP/Secretary create | appointments |
| H3.5 | VP update any | appointments |
| H3.6 | Secretary update own draft | appointments |
| H3.7 | VP delete | appointments |
| H3.8 | VP/Secretary view attendees | appointment_attendees |
| H3.9 | Protocol view approved attendees | appointment_attendees |

#### H4. Case Policies

**Order:** 73-77 (after G1)

| Migration | Object | Table |
|-----------|--------|-------|
| H4.1 | VP view all cases | cases |
| H4.2 | Secretary view cases | cases |
| H4.3 | VP create cases | cases |
| H4.4 | VP update non-closed | cases |
| H4.5 | (No delete policy) | cases |

#### H5. Supporting Table Policies

**Order:** 78-88 (after G1)

| Migration | Object | Table |
|-----------|--------|-------|
| H5.1 | VP/Secretary view reminders | reminders |
| H5.2 | Users view own notifications | notifications |
| H5.3 | Users update own notifications | notifications |
| H5.4 | All view protocol events | protocol_events |
| H5.5 | Protocol create events | protocol_events |
| H5.6 | Protocol update own events | protocol_events |
| H5.7 | VP/Secretary view documents | documents |
| H5.8 | VP/Secretary create documents | documents |
| H5.9 | VP delete documents | documents |
| H5.10 | VP view audit events | audit_events |
| H5.11 | (No update/delete audit) | audit_events |

---

### Phase I: Triggers

#### I1. Security Triggers

**Order:** 89-90 (after all policies)

| Migration | Object | Purpose |
|-----------|--------|---------|
| I1.1 | `prevent_closed_case_update()` function | Immutability |
| I1.2 | `trigger_prevent_closed_case_update` trigger | Cases table |

#### I2. Audit Triggers

**Order:** 91-94 (after all policies)

| Migration | Object | Purpose |
|-----------|--------|---------|
| I2.1 | `log_audit_event()` function | Audit logging |
| I2.2 | `audit_cases_changes` trigger | Cases audit |
| I2.3 | `audit_appointments_changes` trigger | Appointments audit |
| I2.4 | Updated timestamp triggers | All tables |

#### I3. Edge Function Triggers

**Order:** 95-96 (after all policies)

| Migration | Object | Purpose |
|-----------|--------|---------|
| I3.1 | `trigger_schedule_reminder` | Reminder scheduling |
| I3.2 | `trigger_calendar_sync` | Calendar sync |

---

### Phase J: Storage

#### J1. Storage Buckets

**Order:** 97-98 (independent)

| Migration | Object | Purpose |
|-----------|--------|---------|
| J1.1 | `attachments` bucket | Case attachments |
| J1.2 | `client-files` bucket | Client documents |

#### J2. Storage Policies

**Order:** 99-100 (after J1)

| Migration | Object | Purpose |
|-----------|--------|---------|
| J2.1 | Attachments access policy | VP/Secretary access |
| J2.2 | Client files access policy | VP/Secretary access |

---

### Phase K: Edge Functions

#### K1. Edge Function Deployment

**Order:** 101-106 (independent, after secrets configured)

| Migration | Object | Purpose |
|-----------|--------|---------|
| K1.1 | `send-notification` | Notification dispatch |
| K1.2 | `schedule-reminder` | Reminder scheduling |
| K1.3 | `process-reminders` | Reminder processing |
| K1.4 | `sync-calendar` | Google Calendar sync |
| K1.5 | `log-audit-event` | Backup audit logging |
| K1.6 | `generate-case-pdf` | PDF generation |

---

## 3. Migration Dependency Graph

```
Phase A (Enums)
    │
    ▼
Phase B (Security Functions)
    │
    ▼
Phase C (User Tables)
    │
    ▼
Phase D (Business Tables) ──────────┐
    │                               │
    ▼                               ▼
Phase E (Supporting Tables)    Phase F (Indexes)
    │                               │
    └───────────┬───────────────────┘
                │
                ▼
        Phase G (Enable RLS)
                │
                ▼
        Phase H (RLS Policies)
                │
                ▼
        Phase I (Triggers)
                │
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
Phase J (Storage)     Phase K (Edge Functions)
```

---

## 4. Rollback Sequence

In case of migration failure, rollback in REVERSE order:

```
1. Edge Functions (K1.6 → K1.1)
2. Storage Policies (J2.2 → J2.1)
3. Storage Buckets (J1.2 → J1.1)
4. Triggers (I3.2 → I1.1)
5. RLS Policies (H5.11 → H1.1)
6. Enable RLS (reverse - N/A, just drop tables)
7. Indexes (F1.14 → F1.1)
8. Supporting Tables (E1.5 → E1.1)
9. Business Tables (D1.4 → D1.1)
10. User Tables (C1.2 → C1.1)
11. Security Functions (B1.5 → B1.1)
12. Enum Types (A1.11 → A1.1)
```

---

## 5. Migration File Naming Convention

```
YYYYMMDD_HHMMSS_<phase>_<sequence>_<description>.sql

Examples:
20260110_100000_A1_01_create_app_role_enum.sql
20260110_100001_A1_02_create_client_type_enum.sql
20260110_100100_B1_01_create_has_role_function.sql
20260110_100200_C1_01_create_user_roles_table.sql
```

---

## 6. Pre-Migration Checklist

Before executing any migration:

- [ ] Phase 3 explicitly authorized
- [ ] All Phase 2 documents reviewed and approved
- [ ] Supabase project provisioned
- [ ] Database connection verified
- [ ] Required secrets configured
- [ ] Backup strategy confirmed
- [ ] Rollback plan confirmed
- [ ] Testing environment ready

---

## 7. Document Status

| Item | Status |
|------|--------|
| Migration sequence | DOCUMENTED |
| Dependency graph | DOCUMENTED |
| Rollback sequence | DOCUMENTED |
| File naming convention | DOCUMENTED |
| Pre-migration checklist | DOCUMENTED |
| Migration Execution | NOT PERFORMED |

---

**Document Classification:** PHASE 2 - IMPLEMENTATION PLANNING  
**Execution Status:** DOCUMENTATION ONLY - AWAITING PHASE 3 AUTHORIZATION
