# Phase 1 – Notification & Reminder SLA Specification (Documentation Only)

## Project
**VP-Flow**

## Status
Documentation only. No implementation authorized.

## Purpose
Define strict, role-aware notification and reminder SLAs to ensure zero missed high‑priority follow‑ups while avoiding alert fatigue. This document is authoritative for timing, escalation, delivery channels, and failure handling.

---

## 1. Mandatory Challenge (SLA-Level)

### Weak assumption
- **Assumption:** Timed reminders alone will change behavior.

### Missing constraint
- **Constraint not fully specified:** What happens if notifications are **ignored**, **missed**, or **delivery fails**.

### Failure mode
- If escalation and acknowledgement are not enforced, critical cases can still be forgotten despite reminders.

---

## 2. Roles & Notification Scope

| Role | Receives Notifications | Notes |
|---|---|---|
| VP | Yes | Primary recipient for all case-related SLAs |
| Secretary | Yes (support) | Receives mirrored alerts for support only |
| Protocol | Limited | Appointment-day execution alerts only |

---

## 3. Notification Channels (v1.0)

| Channel | Status | Notes |
|---|---|---|
| In-app | Mandatory | Primary channel |
| Email | Optional (configurable) | For redundancy |
| SMS / WhatsApp | Out of scope v1.0 | Future extension |

In-app delivery is considered the **source of truth** for acknowledgement.

---

## 4. Event Types Covered

### 4.1 Appointment Events
- Pending VP approval
- Approved
- Rescheduled
- Cancelled
- Day-of appointment reminder

### 4.2 Case Events
- Case activated (Draft → Open)
- Upcoming deadline
- Deadline overdue
- Priority change
- Case closed

### 4.3 Protocol Events
- Day-of execution start
- Arrival / no-show recorded

---

## 5. Case Reminder SLA Matrix

### 5.1 High Priority (Critical)

| Stage | Timing | Recipient | Escalation |
|---|---|---|---|
| Upcoming | T‑7 days | VP + Secretary | — |
| Upcoming | T‑3 days | VP + Secretary | — |
| Upcoming | T‑1 day | VP + Secretary | — |
| Due Today | T‑0 | VP | Banner lock |
| Overdue | Daily | VP + Secretary | Persistent banner |

**Rules:**
- High-priority overdue cases **cannot be hidden or dismissed** without status change.
- Dashboard banner remains visible until case is closed or re‑prioritized.

---

### 5.2 Medium Priority

| Stage | Timing | Recipient | Escalation |
|---|---|---|---|
| Upcoming | T‑3 days | VP | — |
| Due Today | T‑0 | VP | — |
| Overdue | Weekly | VP | Passive alert |

---

### 5.3 Low Priority

| Stage | Timing | Recipient | Escalation |
|---|---|---|---|
| Upcoming | T‑1 day (optional) | VP | — |
| Overdue | None (or monthly digest) | VP | — |

Low-priority cases never block the dashboard.

---

## 6. Appointment Notification SLA

### 6.1 Pending VP Approval

| Timing | Recipient | Action |
|---|---|---|
| Immediate | VP | Approval request |
| T+2 hours (if untouched) | VP | Reminder |
| T+8 hours | VP | Escalation banner |

> SLA timing may be refined but escalation hierarchy is fixed.

---

### 6.2 Approved / Rescheduled / Cancelled

| Event | Recipient | Notes |
|---|---|---|
| Approved | Secretary + Protocol | Protocol gains visibility |
| Rescheduled | Secretary + Protocol | Overwrites prior schedule |
| Cancelled | Secretary + Protocol | Execution halted |

---

### 6.3 Day‑of Appointment

| Timing | Recipient | Notes |
|---|---|---|
| T‑24 hours | VP + Secretary | Preparation reminder |
| T‑2 hours | Protocol | Execution readiness |
| T‑0 | Protocol | Expected arrival |

---

## 7. Acknowledgement Rules

- **VP acknowledgement** is implicit when:
  - Opening the notification
  - Taking an action (status change, note edit)
- Unacknowledged high-priority alerts continue to escalate.

---

## 8. Escalation Mechanics

### 8.1 Dashboard Escalation
- High priority overdue cases trigger:
  - Persistent top banner
  - Highlighted case cards

### 8.2 Secretary Support Escalation
- Secretary receives mirrored alerts for:
  - High priority upcoming
  - All overdue cases

Secretary **cannot dismiss** VP alerts.

---

## 9. Failure & Resilience Rules

| Scenario | System Behavior |
|---|---|
| Notification delivery fails | Retry + log audit event |
| User offline | Queue notification |
| Reminder job fails | Retry with backoff |
| Repeated failures | Surface system alert to VP |

---

## 10. Audit Coverage

Each notification event must log:
- Recipient
- Event type
- Scheduled time
- Sent time
- Acknowledged time (if applicable)

Audit records are immutable.

---

## 11. Non‑Goals (Explicit)

- No auto‑delegation of cases
- No external escalation (SMS/WhatsApp) in v1.0
- No AI‑driven prioritization

---

## 12. Phase Gate Status

Phase 1 (Notification & Reminder SLA) – COMPLETE (documentation)

**Hard Stop:** Await explicit authorization for Phase 2 (Implementation Planning or Execution).

---

**Await Further Instructions.**

