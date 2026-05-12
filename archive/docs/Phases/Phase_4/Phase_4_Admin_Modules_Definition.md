# Phase 4 — Admin Modules Definition

**Status:** 🟡 PREPARATION (Implementation BLOCKED)  
**Date:** 2026-01-10  
**Governance:** STRICT — Phase-Gated  

---

## Source References (Mandatory)

| Document | Location | Purpose |
|----------|----------|---------|
| Phase_1_RLS_Policy_Matrix.md | `/Project Docs/Phase_1_RLS_Policy_Matrix.md` | Role permissions authority |
| Phase_1_Architecture_Data_Model.md | `/Project Docs/Phase_1_Architecture_Data_Model.md` | Entity definitions authority |
| README.md | `/README.md` | Guardian rules, conventions |
| DARKONE_ASSET_MAP.md | `/DARKONE_ASSET_MAP.md` | Asset governance |

---

## 1. Module Definitions

| Module | Purpose | Backend Entities | Source Reference |
|--------|---------|------------------|------------------|
| **Dashboard** | Priority workload overview, KPI stats, upcoming appointments | `appointments`, `cases`, `reminders` | Phase_1_Architecture_Data_Model.md §4.1, §4.2 |
| **Appointments** | Full appointment lifecycle management | `appointments`, `appointment_attendees`, `clients`, `protocol_events` | Phase_1_Architecture_Data_Model.md §4.1 |
| **Cases** | Case creation, tracking, closure (VP-controlled) | `cases`, `appointments`, `clients`, `reminders`, `documents` | Phase_1_Architecture_Data_Model.md §4.2 |
| **Clients** | Internal client/person registry | `clients`, `appointments`, `cases` | Phase_1_Architecture_Data_Model.md §4.3 |
| **Audit Log Viewer** | Immutable audit trail viewing | `audit_events` | Phase_1_Architecture_Data_Model.md §4.7 |
| **Protocol Dashboard** | Day-of execution tracking (approved appointments only) | `appointments` (approved), `protocol_events` | Phase_1_Architecture_Data_Model.md §4.4 |
| **Notifications** | In-app alerts and reminders display | `notifications`, `reminders` | Phase_1_Architecture_Data_Model.md §4.6 |

---

## 2. Role Access Matrix

**Source:** Phase_1_RLS_Policy_Matrix.md (AUTHORITATIVE)

| Module | VP | Secretary | Protocol | RLS Reference |
|--------|:--:|:---------:|:--------:|---------------|
| Dashboard | Full | Read + Stats | — | RLS §3, §5, §7 |
| Appointments | C/R/U/Approve/Reject | C/R/U (limited) | R (approved only) | RLS §5 |
| Cases | C/R/U/Close | R only | — (NO ACCESS) | RLS §7 |
| Clients | C/R/U/D | C/R/U | — (NO ACCESS) | RLS §4 |
| Audit Log Viewer | R only | R (limited, own actions) | — (NO ACCESS) | RLS §12 |
| Protocol Dashboard | — | — | R/Execute | RLS §9 |
| Notifications | R/U (mark read) | R/U (mark read) | R/U (mark read) | RLS §11 |

**Legend:**
- C = Create
- R = Read
- U = Update
- D = Delete
- Execute = Status change on protocol_events

---

## 3. Permission Details per Module

### 3.1 Dashboard Module

| Role | Permissions | Constraints |
|------|-------------|-------------|
| VP | View all stats, all appointments, all cases, all reminders | Full visibility |
| Secretary | View stats, appointments (non-vp_only), reminder counts | No case details, no vp_only appointments |
| Protocol | — | NO ACCESS to Dashboard |

### 3.2 Appointments Module

| Role | Create | Read | Update | Delete | Approve/Reject |
|------|:------:|:----:|:------:|:------:|:--------------:|
| VP | ✓ | All | All | ✓ | ✓ |
| Secretary | ✓ | Non-vp_only | Own drafts | — | — |
| Protocol | — | Approved only | — | — | — |

### 3.3 Cases Module

| Role | Create | Read | Update | Close | Reopen |
|------|:------:|:----:|:------:|:-----:|:------:|
| VP | ✓ | All | All | ✓ | — (FORBIDDEN) |
| Secretary | — | All (read-only) | — | — | — |
| Protocol | — | — (NO ACCESS) | — | — | — |

### 3.4 Clients Module

| Role | Create | Read | Update | Delete |
|------|:------:|:----:|:------:|:------:|
| VP | ✓ | All | All | ✓ |
| Secretary | ✓ | All | All | — |
| Protocol | — | — (NO ACCESS) | — | — |

### 3.5 Audit Log Viewer

| Role | Read | Filter | Export |
|------|:----:|:------:|:------:|
| VP | All events | All filters | — (v1.0) |
| Secretary | Own actions only | Limited | — |
| Protocol | — (NO ACCESS) | — | — |

### 3.6 Protocol Dashboard

| Role | Read | Execute Status Change |
|------|:----:|:---------------------:|
| VP | — | — |
| Secretary | — | — |
| Protocol | Approved appointments (today) | ✓ (expected→arrived→assisted→completed/no_show) |

### 3.7 Notifications Module

| Role | Read | Mark as Read |
|------|:----:|:------------:|
| VP | Own notifications | ✓ |
| Secretary | Own notifications | ✓ |
| Protocol | Own notifications | ✓ |

---

## 4. Explicit OUT OF SCOPE per Module

| Module | OUT OF SCOPE (v1.0) |
|--------|---------------------|
| **Dashboard** | Case creation from dashboard, Protocol view, External data sources, Real-time updates |
| **Appointments** | External booking, Public access, Protocol editing, Google Calendar sync |
| **Cases** | Protocol access, Case reopening, Secretary write operations, File attachments upload |
| **Clients** | Protocol access, External users, Bulk import/export |
| **Audit Log Viewer** | Any modification, Secretary full access, Protocol access, Export functionality |
| **Protocol Dashboard** | Case access, Client notes, Appointment editing, Historical views |
| **Notifications** | External notifications (email/SMS), Push notifications, Notification preferences |

---

## 5. Entity Relationships per Module

### Dashboard
```
appointments ──┬── cases ──── reminders
               └── clients
```

### Appointments
```
appointments ──┬── appointment_attendees
               ├── clients
               └── protocol_events
```

### Cases
```
cases ──┬── appointments (source)
        ├── clients (via appointment)
        ├── reminders
        └── documents
```

### Clients
```
clients ──┬── appointments (history)
          └── cases (history, via appointments)
```

---

## 6. Guardian Rules Compliance

| Rule | Status |
|------|--------|
| No new roles | COMPLIANT — VP, Secretary, Protocol only |
| No scope expansion | COMPLIANT — modules strictly per Phase 1 |
| RLS alignment | COMPLIANT — all permissions per Phase_1_RLS_Policy_Matrix.md |
| Entity alignment | COMPLIANT — all entities per Phase_1_Architecture_Data_Model.md |
| Documentation first | COMPLIANT — no UI implementation |

---

## 7. Exit Criteria

- [x] All modules defined with purpose and entities
- [x] Role access matrix complete per Phase_1_RLS_Policy_Matrix.md
- [x] Permission details documented per role
- [x] OUT OF SCOPE explicit per module
- [x] Entity relationships documented
- [x] Guardian Rules compliance confirmed

---

**Status:** COMPLETE (Awaiting Phase 4 UI Implementation Authorization)
