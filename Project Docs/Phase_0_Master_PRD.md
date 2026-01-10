# Phase 0 – Master PRD (Documentation Only)

## Project Title

VP Appointments & Case Management System (VP-Flow)

## Client

Office of the Vice President of Suriname

## Purpose

Design a controlled internal system for managing Vice Presidential appointments and converting selected appointments into actionable cases with prioritization, reminders, and institutional memory.

This system exists to reduce cognitive overload, prevent forgotten follow‑ups, and provide structured oversight for the Vice President and immediate support staff.

---

## 1. Scope Definition

### In Scope (v1.0)

- Internal appointments management
- VP‑controlled appointment approval
- Case creation derived from appointments
- Multiple cases per single appointment
- Case prioritization (High / Medium / Low)
- Deadlines with reminders and overdue notifications
- Internal notes editor for appointments and cases
- PDF generation for finalized cases (internal archive)
- Client/person history (appointments + cases)
- Role‑based access (VP, Secretary, Protocol)
- Full audit logging (who / when / action)

### Explicitly Out of Scope (v1.0)

- External booking by citizens or diplomats
- Client self‑service portals
- Case reopening after closure
- Formal legal document generation
- Public access or sharing

Future extensions (v1.1+): external interfaces, broader cabinet scaling.

---

## 2. Core Principles

- Appointment is the primary object
- Case is an optional action unit derived from an appointment
- No case exists without explicit VP activation
- One appointment may produce multiple independent cases
- Case ownership always remains with the VP
- System supports the VP; it does not replace judgment

---

## 3. User Roles & Authority Model

### Vice President (VP)

- Creates and approves appointments
- Activates cases
- Splits multiple cases from one appointment
- Sets priority and deadlines
- Writes and edits case content
- Triggers PDF generation
- Final authority on all actions

### Secretary

- Views all VP appointments and cases
- Assists with reminders and communication
- Cannot approve appointments
- Cannot create or close cases independently
- Cannot override VP decisions

### Protocol Department

- Read / execute access only
- Sees confirmed appointments
- Executes day‑of‑appointment protocol actions
- No modification rights

---

## 4. Appointment Lifecycle

1. Appointment Created (VP or Secretary)
2. Pending VP Confirmation
3. Approved or Rejected by VP
4. Scheduled & Executed
5. Optional Case Creation

Appointments may exist without any case.

---

## 5. Case Model

### Case Creation Rules

- Activated only by VP
- Can be created during or after the appointment
- Multiple cases allowed per appointment
- Each case represents a single actionable item

### Case States (Final)

- Draft (editable, no reminders)
- Open (active, reminders enabled)
- In Progress
- Parked
- Closed (final, immutable)

Reopening closed cases is not allowed.

---

## 6. Case Attributes

Each case contains:

- Linked appointment
- Linked client/person
- Subject / title
- Detailed notes (editor‑based)
- Priority (High / Medium / Low)
- Deadline
- Status
- Owner (VP)
- Audit log

---

## 7. Priority & Reminder Logic

| Priority | Dashboard Behavior | Reminders | Escalation |
| -------- | ------------------ | --------- | ---------- |
| High     | Always top         | Multiple  | Yes        |
| Medium   | Normal             | Single    | No         |
| Low      | Separate block     | Optional  | No         |

Reminders occur before deadlines and upon overdue status.

---

## 8. Client / Person Registry

- Internal registry only
- Clients are not system users
- All appointments and cases link to a client record
- Historical view available per client
- Enables institutional memory and preparation

---

## 9. PDF Generation

- Triggered manually by VP or authorized assistant
- Generated after case save or closure
- Stored as internal archive
- Not automatically shared externally

---

## 10. Audit & Compliance

- Every status change is logged
- Includes actor, timestamp, and action
- Immutable audit trail
  n---

## 11. Hosting & Security

- Cloud‑based deployment allowed (v1.0)
- Planned migration to VPS (future)
- Role‑based access enforcement
- Data isolation per role
- No formal state security classification, but hardened access required

---

## 12. Success Criteria

- 100% of VP appointments managed through the system
- No duplicate appointments
- No missed high‑priority follow‑ups
- Clear dashboard visibility of workload and priorities

---

## 13. Phase Gate Status

Phase 0 (Documentation) – COMPLETE

No implementation is authorized until explicit approval of Phase 1.

---

**Await Further Instructions.**

