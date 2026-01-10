# Phase 1 – System Architecture & Data Model (Documentation Only)

## Project
**VP-Flow** (VP Appointments & Case Management System)

## Status
Documentation only. No implementation authorized.

---

## 1. Mandatory Challenge (Architecture-Level)

### Weak assumption
- **Assumption:** A single, unified data model can safely serve VP, Secretary, and Protocol with role-based filtering.

### Missing constraint
- **Constraint not yet codified:** Formal policy for **sensitive appointment/case visibility** (e.g., “VP-only” records) beyond the current baseline of “VP + Secretary”.

### Failure mode
- If this assumption is wrong, role-based filtering will be insufficient and confidential items could surface to unintended staff, reducing trust and adoption.

---

## 2. Architecture Goals

- **Reliability:** zero duplicate appointments; stable state transitions.
- **Traceability:** immutable audit events for all critical changes.
- **Low-friction capture:** VP can create/split cases during or after meetings with minimal steps.
- **Operational clarity:** Protocol sees only what is required to execute day-of.
- **Portability:** cloud-first for v1.0, migration-ready to VPS later.

---

## 3. System Context & Components

### 3.1 Logical Components
1. **Web App (Admin-style internal UI)**
   - VP console
   - Secretary console
   - Protocol console (restricted)

2. **Backend (Supabase-like)**
   - Postgres database
   - Row Level Security (RLS)
   - Auth (email/password or SSO later)
   - Storage (PDF archives)
   - Edge Functions (PDF generation, calendar sync jobs)

3. **Integrations**
   - **Google Calendar Sync** (optional per settings)
   - Email/SMS provider (optional later; v1.0 can be in-app notifications)

---

## 4. Module Breakdown (v1.0)

### 4.1 Appointments Module
- Create appointment (VP or Secretary)
- VP confirmation workflow (pending → approved/rejected)
- Scheduling updates (reschedule, cancel)
- Linking to client/person
- Protocol execution marker (arrived/no-show/assisted)

### 4.2 Cases Module
- VP activates case(s) from an appointment
- Multiple cases per appointment
- States: Draft → Open → In Progress / Parked → Closed
- Priority + deadline
- Reminders + overdue notifications
- Notes editor

### 4.3 Clients / Persons Module (Internal Registry)
- Single registry for persons and organizations
- Quick search + history view
- Link appointments and cases

### 4.4 Protocol Module (Read/Execute)
- View approved appointments
- Day-of execution checklist + status updates (execute-only)
- No appointment edits, no case access unless explicitly allowed

### 4.5 Documents / PDF Archive Module
- Generate PDF for a case (manual trigger by VP or authorized assistant)
- Store PDFs in secure archive
- View/download according to permissions

### 4.6 Notifications Module
- In-app notifications for:
  - upcoming deadlines
  - overdue cases
  - appointment changes relevant to a role

### 4.7 Audit & Governance Module
- Immutable audit events
- Minimal “who/when/what” view
- Export option (future)

### 4.8 Settings Module
- Google account connection (OAuth) and sync preferences
- Role/user management (internal)

---

## 5. Data Model (Conceptual ERD)

### 5.1 Core Entities

#### users
- Internal users only (VP, Secretary, Protocol)
- Stored in auth provider + mirrored profile table

#### user_profiles
- `id` (uuid, matches auth user id)
- `full_name`
- `role` (enum: vp, secretary, protocol)
- `is_active`

#### clients
Represents a person or organization (not a system user).
- `id`
- `type` (enum: person, organization)
- `display_name`
- `primary_contact_phone` (optional)
- `primary_contact_email` (optional)
- `notes` (optional)

#### appointments
- `id`
- `title`
- `client_id` (nullable for internal-only meetings)
- `location` (optional)
- `start_at`, `end_at`
- `created_by_user_id` (vp or secretary)
- `requires_vp_confirmation` (bool; default true)
- `status` (enum: draft, pending_vp, approved, rejected, rescheduled, cancelled, completed)
- `vp_decision_at` (timestamp, optional)
- `vp_decision_by` (user id, optional)
- `notes_richtext` (optional; editor output)
- `visibility` (enum: vp_secretary, vp_only) — **reserved for future tightening**

#### appointment_attendees (optional, v1.0 minimal)
- Supports multiple guests/stakeholders.
- `appointment_id`
- `name`
- `organization` (optional)
- `contact` (optional)

#### cases
- `id`
- `appointment_id` (required)
- `client_id` (denormalized for fast history; optional)
- `title`
- `priority` (enum: high, medium, low)
- `status` (enum: draft, open, in_progress, parked, closed)
- `deadline_at` (optional)
- `owner_user_id` (always VP)
- `notes_richtext` (editor)
- `closed_at` (optional)

#### case_actions (optional, if needed for structured to-dos)
- If VP wants multiple tasks inside one case. Since you allow multiple cases per appointment, this may be deferred.

#### reminders
- `id`
- `case_id`
- `type` (enum: upcoming_deadline, overdue)
- `scheduled_for`
- `sent_at` (optional)
- `channel` (enum: in_app; future: email, sms)

#### notifications
- `id`
- `user_id`
- `type`
- `payload` (json)
- `read_at` (optional)
- `created_at`

#### protocol_events
Protocol execution log for approved appointments.
- `id`
- `appointment_id`
- `status` (enum: expected, arrived, assisted, no_show, completed)
- `notes` (optional)
- `updated_by_user_id` (protocol)
- `updated_at`

#### documents
- `id`
- `entity_type` (enum: case)
- `entity_id` (case_id)
- `storage_path`
- `file_name`
- `generated_by_user_id`
- `generated_at`

#### audit_events
Immutable append-only audit.
- `id`
- `actor_user_id`
- `entity_type` (appointment, case, client, document, settings)
- `entity_id`
- `action` (create/update/status_change/pdf_generate/etc.)
- `before` (json, optional)
- `after` (json, optional)
- `created_at`

---

## 6. Key Relationships

- `clients 1—N appointments`
- `appointments 1—N cases`
- `appointments 1—1 protocol_events (or 1—N for timeline)`
- `cases 1—N reminders`
- `cases 1—N documents`
- `users 1—N audit_events`

---

## 7. RLS & Permissions (Conceptual)

### 7.1 Role Capabilities

**VP**
- Full CRUD on appointments, cases, clients
- Finalize/close cases
- Generate PDFs
- View all audit logs

**Secretary**
- Create appointments
- View all VP appointments and cases (except any future “vp_only”)
- Cannot approve/reject appointments
- Cannot close cases
- Can trigger reminders/communications support features (if exposed)
- Can generate PDFs only if explicitly authorized

**Protocol**
- Read approved appointments only
- Update protocol execution status only
- No access to cases
- No access to client sensitive notes (if restricted)

### 7.2 RLS Enforcement Pattern
- Use `user_profiles.role` to drive policies.
- Appointments:
  - Secretary can read all non-vp_only.
  - Protocol can read only `status = approved`.
  - Only VP can transition `pending_vp → approved/rejected`.
- Cases:
  - VP can CRUD.
  - Secretary can read; no write unless explicitly allowed later.
- Documents:
  - Only VP/authorized secretary can access.
- Audit events:
  - Read: VP; optional restricted view for Secretary.
  - Write: service role via triggers/functions.

---

## 8. Audit Logging Strategy

### 8.1 What must be audited
- Appointment lifecycle transitions (pending/approved/rejected/rescheduled/cancelled)
- Case lifecycle transitions (draft/open/in_progress/parked/closed)
- Priority changes
- Deadline changes
- PDF generation events
- Permission/role changes

### 8.2 How to implement (documentation-level)
- Prefer **append-only** `audit_events` rows.
- Use DB triggers or a service-layer wrapper to ensure no critical action occurs without an audit event.

---

## 9. Google Calendar Sync (Documentation Model)

### 9.1 Sync Modes
- **Import mode:** pull events from Google into VP-Flow as read-only references.
- **Two-way mode (target):** approved VP-Flow appointments push to Google; updates reconcile.

### 9.2 Conflict Rules (must be explicit)
- VP-Flow remains the **source of truth** for confirmation status.
- If a conflict appears (same time overlap):
  - Surface conflict warning to VP/Secretary
  - Do not auto-delete or auto-move events

### 9.3 Data Mapping
- Appointment ↔ Google Event
- Store `google_event_id` and `google_calendar_id` per appointment when sync is enabled.

---

## 10. PDF Generation (Documentation Model)

### 10.1 Trigger
- Manual action by VP or authorized assistant.

### 10.2 Template Content (minimum)
- Client/person
- Appointment summary (created/approved/rescheduled/completed)
- Case title, notes, priority, deadline, status
- Audit summary (optional, last actions)

### 10.3 Storage
- Store in secure bucket
- Persist reference in `documents` table

---

## 11. Non-Goals (to prevent scope creep)

- No external user accounts (citizens/diplomats)
- No payment, billing, or public scheduling
- No complex workflow engine beyond the defined states
- No reopening closed cases

---

## 12. Phase Gate Status

Phase 1 (Architecture & Data Model) – COMPLETE (documentation)

**Hard Stop:** Await explicit authorization for Phase 2 (Parity / UI & Core Module Structure) or for a separate Phase 1 artifact (workflow diagrams) if required.

---

**Await Further Instructions.**

