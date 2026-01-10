-- ===========================================
-- VP-FLOW: Phase A — Enum Types
-- Migration A1.1 through A1.11
-- ===========================================

-- A1.1: Application roles (VP, Secretary, Protocol)
CREATE TYPE public.app_role AS ENUM ('vp', 'secretary', 'protocol');

-- A1.2: Client types
CREATE TYPE public.client_type AS ENUM ('person', 'organization');

-- A1.3: Appointment status lifecycle
CREATE TYPE public.appointment_status AS ENUM (
  'draft',
  'pending_vp',
  'approved',
  'rejected',
  'rescheduled',
  'cancelled',
  'completed'
);

-- A1.4: Appointment visibility levels
CREATE TYPE public.appointment_visibility AS ENUM ('vp_secretary', 'vp_only');

-- A1.5: Case status lifecycle
CREATE TYPE public.case_status AS ENUM (
  'draft',
  'open',
  'in_progress',
  'parked',
  'closed'
);

-- A1.6: Case priority levels
CREATE TYPE public.case_priority AS ENUM ('high', 'medium', 'low');

-- A1.7: Reminder types
CREATE TYPE public.reminder_type AS ENUM ('upcoming_deadline', 'overdue');

-- A1.8: Reminder delivery channels
CREATE TYPE public.reminder_channel AS ENUM ('in_app', 'email');

-- A1.9: Protocol execution status
CREATE TYPE public.protocol_status AS ENUM (
  'expected',
  'arrived',
  'assisted',
  'no_show',
  'completed'
);

-- A1.10: Document entity types (for polymorphic association)
CREATE TYPE public.document_entity_type AS ENUM ('case');

-- A1.11: Audit action types
CREATE TYPE public.audit_action AS ENUM (
  'create',
  'update',
  'status_change',
  'pdf_generate',
  'priority_change',
  'deadline_change'
);