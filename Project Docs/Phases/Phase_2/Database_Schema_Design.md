# VP-Flow Database Schema Design

**Phase:** 2 - Implementation Planning  
**Document Type:** Database Schema Specification  
**Status:** DOCUMENTATION ONLY - NOT EXECUTED  
**Source:** Phase_1_Architecture_Data_Model.md

---

## 1. Overview

This document defines the complete database schema for VP-Flow, including all tables, columns, types, constraints, and relationships. This specification is derived exclusively from Phase 1 Architecture documentation.

**CRITICAL:** This document contains SQL definitions for documentation purposes only. No SQL has been or will be executed until Phase 3 is authorized.

---

## 2. Enum Type Definitions

```sql
-- Role enumeration (3 roles only - no expansion permitted)
CREATE TYPE public.app_role AS ENUM ('vp', 'secretary', 'protocol');

-- Client type classification
CREATE TYPE public.client_type AS ENUM ('person', 'organization');

-- Appointment lifecycle states
CREATE TYPE public.appointment_status AS ENUM (
  'draft',
  'pending_vp',
  'approved',
  'rejected',
  'rescheduled',
  'cancelled',
  'completed'
);

-- Appointment visibility levels
CREATE TYPE public.appointment_visibility AS ENUM ('vp_secretary', 'vp_only');

-- Case lifecycle states
CREATE TYPE public.case_status AS ENUM (
  'draft',
  'open',
  'in_progress',
  'parked',
  'closed'
);

-- Case priority levels
CREATE TYPE public.case_priority AS ENUM ('high', 'medium', 'low');

-- Reminder classification
CREATE TYPE public.reminder_type AS ENUM ('upcoming_deadline', 'overdue');

-- Notification delivery channel
CREATE TYPE public.reminder_channel AS ENUM ('in_app', 'email');

-- Protocol execution status
CREATE TYPE public.protocol_status AS ENUM (
  'expected',
  'arrived',
  'assisted',
  'no_show',
  'completed'
);

-- Document attachment entity type
CREATE TYPE public.document_entity_type AS ENUM ('case');

-- Audit action classification
CREATE TYPE public.audit_action AS ENUM (
  'create',
  'update',
  'status_change',
  'pdf_generate',
  'priority_change',
  'deadline_change'
);
```

---

## 3. Table Definitions

### 3.1 User Domain Tables

#### 3.1.1 user_roles

Stores role assignments for authenticated users. Roles are stored separately from profiles per security best practices.

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT user_roles_unique UNIQUE (user_id, role)
);

-- Index for role lookups
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | Foreign key to auth.users |
| role | app_role | NO | - | Assigned role (vp/secretary/protocol) |
| created_at | TIMESTAMPTZ | NO | now() | Role assignment timestamp |

---

#### 3.1.2 user_profiles

Extended user profile information.

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for active user lookups
CREATE INDEX idx_user_profiles_active ON public.user_profiles(is_active) WHERE is_active = true;
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | - | Primary key, FK to auth.users |
| full_name | TEXT | NO | - | User's display name |
| is_active | BOOLEAN | NO | true | Account active status |
| created_at | TIMESTAMPTZ | NO | now() | Profile creation timestamp |
| updated_at | TIMESTAMPTZ | NO | now() | Last update timestamp |

---

### 3.2 Business Domain Tables

#### 3.2.1 clients

Stores client (person or organization) records.

```sql
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type client_type NOT NULL,
  display_name TEXT NOT NULL,
  primary_contact_phone TEXT,
  primary_contact_email TEXT,
  notes TEXT,  -- HIDDEN FROM PROTOCOL
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for search and filtering
CREATE INDEX idx_clients_display_name ON public.clients(display_name);
CREATE INDEX idx_clients_type ON public.clients(type);
CREATE INDEX idx_clients_created_by ON public.clients(created_by_user_id);
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| type | client_type | NO | - | Person or organization |
| display_name | TEXT | NO | - | Client name for display |
| primary_contact_phone | TEXT | YES | - | Phone contact |
| primary_contact_email | TEXT | YES | - | Email contact |
| notes | TEXT | YES | - | Internal notes (VP/Secretary only) |
| created_by_user_id | UUID | NO | - | Creator reference |
| created_at | TIMESTAMPTZ | NO | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | now() | Last update timestamp |

**Security Note:** The `notes` column MUST be hidden from Protocol role via RLS.

---

#### 3.2.2 appointments

Core appointment records.

```sql
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  location TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  requires_vp_confirmation BOOLEAN NOT NULL DEFAULT true,
  status appointment_status NOT NULL DEFAULT 'draft',
  vp_decision_at TIMESTAMPTZ,
  vp_decision_by UUID REFERENCES auth.users(id),
  notes_richtext TEXT,  -- HIDDEN FROM PROTOCOL
  visibility appointment_visibility NOT NULL DEFAULT 'vp_secretary',
  google_event_id TEXT,
  google_calendar_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT appointments_time_valid CHECK (end_at > start_at)
);

-- Indexes for common queries
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_start_at ON public.appointments(start_at);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_status_start ON public.appointments(status, start_at);
CREATE INDEX idx_appointments_created_by ON public.appointments(created_by_user_id);
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| title | TEXT | NO | - | Appointment title |
| client_id | UUID | YES | - | FK to clients (nullable for internal meetings) |
| location | TEXT | YES | - | Meeting location |
| start_at | TIMESTAMPTZ | NO | - | Start date/time |
| end_at | TIMESTAMPTZ | NO | - | End date/time |
| created_by_user_id | UUID | NO | - | Creator reference |
| requires_vp_confirmation | BOOLEAN | NO | true | VP approval required flag |
| status | appointment_status | NO | 'draft' | Current lifecycle status |
| vp_decision_at | TIMESTAMPTZ | YES | - | When VP decided |
| vp_decision_by | UUID | YES | - | Which VP user decided |
| notes_richtext | TEXT | YES | - | Rich text notes (VP/Secretary only) |
| visibility | appointment_visibility | NO | 'vp_secretary' | Who can view |
| google_event_id | TEXT | YES | - | Google Calendar event ID |
| google_calendar_id | TEXT | YES | - | Google Calendar ID |
| created_at | TIMESTAMPTZ | NO | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | now() | Last update timestamp |

**Security Note:** The `notes_richtext` column MUST be hidden from Protocol role via RLS.

---

#### 3.2.3 appointment_attendees

Attendees for each appointment.

```sql
CREATE TABLE public.appointment_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  organization TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for appointment lookups
CREATE INDEX idx_appointment_attendees_appointment ON public.appointment_attendees(appointment_id);
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| appointment_id | UUID | NO | - | FK to appointments |
| name | TEXT | NO | - | Attendee name |
| organization | TEXT | YES | - | Attendee organization |
| contact | TEXT | YES | - | Contact information |
| created_at | TIMESTAMPTZ | NO | now() | Creation timestamp |

---

#### 3.2.4 cases

Case records derived from appointments. VP-only creation.

```sql
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id),
  client_id UUID REFERENCES public.clients(id),  -- Denormalized for convenience
  title TEXT NOT NULL,
  priority case_priority NOT NULL,
  status case_status NOT NULL DEFAULT 'draft',
  deadline_at TIMESTAMPTZ,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id),
  notes_richtext TEXT,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT cases_closed_valid CHECK (
    (status = 'closed' AND closed_at IS NOT NULL) OR
    (status != 'closed' AND closed_at IS NULL)
  )
);

-- Indexes for dashboard and filtering
CREATE INDEX idx_cases_status ON public.cases(status);
CREATE INDEX idx_cases_priority ON public.cases(priority);
CREATE INDEX idx_cases_status_priority ON public.cases(status, priority);
CREATE INDEX idx_cases_appointment_id ON public.cases(appointment_id);
CREATE INDEX idx_cases_client_id ON public.cases(client_id);
CREATE INDEX idx_cases_owner ON public.cases(owner_user_id);
CREATE INDEX idx_cases_deadline ON public.cases(deadline_at) WHERE deadline_at IS NOT NULL;
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| appointment_id | UUID | NO | - | FK to source appointment |
| client_id | UUID | YES | - | FK to client (denormalized) |
| title | TEXT | NO | - | Case title |
| priority | case_priority | NO | - | High/medium/low |
| status | case_status | NO | 'draft' | Current lifecycle status |
| deadline_at | TIMESTAMPTZ | YES | - | Action deadline |
| owner_user_id | UUID | NO | - | VP owner (must be VP role) |
| notes_richtext | TEXT | YES | - | Rich text notes |
| closed_at | TIMESTAMPTZ | YES | - | Closure timestamp |
| created_at | TIMESTAMPTZ | NO | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | now() | Last update timestamp |

**Critical Constraint:** Cases can ONLY be created by VP. Closed cases are IMMUTABLE.

---

### 3.3 Supporting Tables

#### 3.3.1 reminders

Scheduled reminders for case deadlines.

```sql
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  type reminder_type NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  channel reminder_channel NOT NULL DEFAULT 'in_app',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for reminder processing
CREATE INDEX idx_reminders_case ON public.reminders(case_id);
CREATE INDEX idx_reminders_scheduled ON public.reminders(scheduled_for) WHERE sent_at IS NULL;
CREATE INDEX idx_reminders_pending ON public.reminders(scheduled_for, sent_at) WHERE sent_at IS NULL;
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| case_id | UUID | NO | - | FK to cases |
| type | reminder_type | NO | - | Upcoming or overdue |
| scheduled_for | TIMESTAMPTZ | NO | - | When to send |
| sent_at | TIMESTAMPTZ | YES | - | When actually sent |
| channel | reminder_channel | NO | 'in_app' | Delivery method |
| created_at | TIMESTAMPTZ | NO | now() | Creation timestamp |

---

#### 3.3.2 notifications

User notification queue.

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for user notification lists
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, created_at) WHERE read_at IS NULL;
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | FK to auth.users |
| type | TEXT | NO | - | Notification type identifier |
| payload | JSONB | YES | - | Notification data |
| read_at | TIMESTAMPTZ | YES | - | When marked as read |
| created_at | TIMESTAMPTZ | NO | now() | Creation timestamp |

---

#### 3.3.3 protocol_events

Protocol execution tracking for appointments.

```sql
CREATE TABLE public.protocol_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id),
  status protocol_status NOT NULL,
  notes TEXT,
  updated_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for protocol lookups
CREATE INDEX idx_protocol_events_appointment ON public.protocol_events(appointment_id);
CREATE INDEX idx_protocol_events_status ON public.protocol_events(status);
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| appointment_id | UUID | NO | - | FK to appointments |
| status | protocol_status | NO | - | Execution status |
| notes | TEXT | YES | - | Protocol notes |
| updated_by_user_id | UUID | NO | - | Protocol user who updated |
| updated_at | TIMESTAMPTZ | NO | now() | Last update timestamp |
| created_at | TIMESTAMPTZ | NO | now() | Creation timestamp |

---

#### 3.3.4 documents

Attached documents for cases.

```sql
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type document_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  generated_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  generated_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for document lookups
CREATE INDEX idx_documents_entity ON public.documents(entity_type, entity_id);
CREATE INDEX idx_documents_generated_by ON public.documents(generated_by_user_id);
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| entity_type | document_entity_type | NO | - | Type of parent entity |
| entity_id | UUID | NO | - | Parent entity ID |
| storage_path | TEXT | NO | - | Storage bucket path |
| file_name | TEXT | NO | - | Original file name |
| generated_by_user_id | UUID | NO | - | User who generated |
| generated_at | TIMESTAMPTZ | NO | - | Generation timestamp |
| created_at | TIMESTAMPTZ | NO | now() | Creation timestamp |

---

#### 3.3.5 audit_events

Immutable audit log. Append-only.

```sql
CREATE TABLE public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NOT NULL REFERENCES auth.users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action audit_action NOT NULL,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for audit history lookups
CREATE INDEX idx_audit_events_entity ON public.audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_events_actor ON public.audit_events(actor_user_id);
CREATE INDEX idx_audit_events_action ON public.audit_events(action);
CREATE INDEX idx_audit_events_created ON public.audit_events(created_at);
```

**Column Specifications:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| actor_user_id | UUID | NO | - | User who performed action |
| entity_type | TEXT | NO | - | Type of affected entity |
| entity_id | UUID | NO | - | Affected entity ID |
| action | audit_action | NO | - | Type of action |
| before_state | JSONB | YES | - | State before change |
| after_state | JSONB | YES | - | State after change |
| created_at | TIMESTAMPTZ | NO | now() | Action timestamp |

**CRITICAL:** This table is APPEND-ONLY. No UPDATE or DELETE operations permitted.

---

## 4. Storage Buckets

```sql
-- Storage bucket for case attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attachments', 'attachments', false);

-- Storage bucket for client-related files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-files', 'client-files', false);
```

---

## 5. Relationship Diagram

```
auth.users
    │
    ├──< user_roles (user_id)
    │
    ├──< user_profiles (id)
    │
    ├──< clients (created_by_user_id)
    │       │
    │       ├──< appointments (client_id)
    │       │       │
    │       │       ├──< appointment_attendees (appointment_id)
    │       │       │
    │       │       ├──< cases (appointment_id)
    │       │       │       │
    │       │       │       ├──< reminders (case_id)
    │       │       │       │
    │       │       │       └──< documents (entity_id)
    │       │       │
    │       │       └──< protocol_events (appointment_id)
    │       │
    │       └──< cases (client_id) [denormalized]
    │
    ├──< appointments (created_by_user_id, vp_decision_by)
    │
    ├──< cases (owner_user_id)
    │
    ├──< notifications (user_id)
    │
    ├──< protocol_events (updated_by_user_id)
    │
    ├──< documents (generated_by_user_id)
    │
    └──< audit_events (actor_user_id)
```

---

## 6. Document Status

| Item | Status |
|------|--------|
| Enum definitions | DOCUMENTED |
| Table definitions | DOCUMENTED |
| Column specifications | DOCUMENTED |
| Constraints | DOCUMENTED |
| Indexes | DOCUMENTED |
| Relationships | DOCUMENTED |
| SQL Execution | NOT PERFORMED |

---

**Document Classification:** PHASE 2 - IMPLEMENTATION PLANNING  
**Execution Status:** DOCUMENTATION ONLY - AWAITING PHASE 3 AUTHORIZATION
