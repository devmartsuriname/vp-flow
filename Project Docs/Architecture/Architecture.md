# VP-Flow — Architecture Summary

**Project:** VP-Flow  
**Client:** Office of the Vice President of Suriname  
**Document Type:** Consolidated Architecture Reference  
**Status:** Documentation Only

---

## Document Purpose

This document provides a readable, consolidated summary of the VP-Flow system architecture. It references the authoritative Phase 1 Architecture & Data Model document for complete technical specifications.

> **Authoritative Source:** `Phase_1_Architecture_Data_Model.md`

---

## System Context

VP-Flow is the **System of Record** for the Office of the Vice President, managing:
- Appointments with external parties
- Cases derived from appointments
- Client relationship history
- Institutional audit trail

```
┌─────────────────────────────────────────────────────────────┐
│                    OFFICE OF THE VP                          │
│  ┌─────────┐    ┌───────────┐    ┌──────────┐               │
│  │   VP    │    │ Secretary │    │ Protocol │               │
│  └────┬────┘    └─────┬─────┘    └────┬─────┘               │
│       │               │               │                      │
│       └───────────────┼───────────────┘                      │
│                       │                                      │
│                       ▼                                      │
│              ┌─────────────────┐                             │
│              │    VP-FLOW      │                             │
│              │ (System of Record)                            │
│              └────────┬────────┘                             │
│                       │                                      │
│         ┌─────────────┼─────────────┐                        │
│         ▼             ▼             ▼                        │
│    ┌─────────┐  ┌──────────┐  ┌──────────┐                  │
│    │ Clients │  │Appointments│ │  Cases   │                  │
│    └─────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Logical Components

### Core Modules

| Module | Description | Primary Users |
|--------|-------------|---------------|
| **Authentication** | Role-based login and session management | All |
| **Client Management** | Client profiles and relationship history | VP, Secretary |
| **Appointment Management** | Scheduling, approval, and tracking | All (role-differentiated) |
| **Case Management** | Case creation, workflow, and closure | VP, Secretary |
| **Protocol Dashboard** | Day-of execution view | Protocol only |
| **Notifications** | Alerts, reminders, escalations | System-driven |
| **Audit Logging** | Immutable action history | VP (view), System (write) |

### Supporting Services

| Service | Purpose |
|---------|---------|
| **Supabase Auth** | User authentication and role management |
| **Supabase Database** | PostgreSQL with RLS |
| **Supabase Edge Functions** | Notification dispatch, scheduling |
| **Supabase Storage** | Document attachments (future) |
| **Google Calendar** | Optional external sync |

---

## Data Model Overview

### Primary Entities

```
┌──────────────┐       ┌─────────────────┐       ┌────────────┐
│   CLIENTS    │───────│  APPOINTMENTS   │───────│   CASES    │
│              │  1:N  │                 │  1:N  │            │
│ - id         │       │ - id            │       │ - id       │
│ - name       │       │ - client_id     │       │ - appt_id  │
│ - type       │       │ - status        │       │ - status   │
│ - contact    │       │ - priority      │       │ - priority │
│ - notes      │       │ - datetime      │       │ - assigned │
└──────────────┘       │ - created_by    │       │ - closed_at│
                       │ - approved_by   │       └────────────┘
                       └─────────────────┘
```

### Key Relationships

- **Client → Appointments:** One client may have many appointments
- **Appointment → Cases:** One appointment may generate multiple cases (VP decision)
- **Cases are OPTIONAL:** Not all appointments result in cases
- **Cases are FINAL:** Once closed, cases cannot be reopened

### Supporting Entities

| Entity | Purpose |
|--------|---------|
| `audit_logs` | Append-only action history |
| `reminders` | Scheduled notification triggers |
| `notifications` | Delivered alerts and messages |

---

## Role Architecture

### VP (Vice President)
- **Authority:** Full system access
- **Unique Powers:** Appointment approval, case creation, case closure
- **Visibility:** All data

### Secretary
- **Authority:** Support role
- **Powers:** Create/edit appointments, view cases
- **Restrictions:** Cannot approve appointments, cannot create/close cases

### Protocol
- **Authority:** Execution role
- **Powers:** View APPROVED appointments only, track day-of execution
- **Restrictions:** NO case access, NO client notes access

```
         ┌─────────────────────────────────────────┐
         │              DATA ACCESS                │
         ├─────────────┬─────────────┬─────────────┤
         │     VP      │  Secretary  │  Protocol   │
┌────────┼─────────────┼─────────────┼─────────────┤
│Clients │   FULL      │    FULL     │    NONE     │
├────────┼─────────────┼─────────────┼─────────────┤
│Appts   │   FULL      │   READ/WRITE│  APPROVED   │
│        │             │  (no approve)│   ONLY      │
├────────┼─────────────┼─────────────┼─────────────┤
│Cases   │   FULL      │    READ     │    NONE     │
├────────┼─────────────┼─────────────┼─────────────┤
│Audit   │   READ      │    NONE     │    NONE     │
└────────┴─────────────┴─────────────┴─────────────┘
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript + Vite |
| **UI Framework** | Darkone Admin (1:1 compliant) |
| **Styling** | Bootstrap 5 + SCSS (isolated) |
| **Backend** | Supabase (Lovable Cloud) |
| **Database** | PostgreSQL with RLS |
| **Auth** | Supabase Auth |
| **Functions** | Supabase Edge Functions |

---

## Security Architecture

### Row-Level Security (RLS)
- All tables protected by RLS policies
- Policies enforce role-based access at database level
- Protocol isolation enforced via RLS (no case access)

### Audit Trail
- All critical actions logged to `audit_logs`
- Logs are append-only (no updates, no deletes)
- VP has read access to audit logs

### Data Isolation
- Closed cases are immutable
- Client notes hidden from Protocol role
- Sensitive fields protected by column-level access

---

## Integration Points

| Integration | Type | Status |
|-------------|------|--------|
| Google Calendar | Optional sync | Planned |
| Email Notifications | Edge Function | Planned |
| SMS Notifications | Edge Function | Future |

---

## Branding & Visual Identity

### Current State (v1.0)

VP-Flow branding is implemented as **fixed static assets**, manually designed outside Lovable.

### Asset Locations

| Asset | Path | Context |
|-------|------|---------|
| Logo (light content) | `src/assets/images/vpflow-logo-light.png` | Dark theme, auth screens |
| Logo (dark content) | `src/assets/images/vpflow-logo-dark.png` | Light theme |
| Logo (icon only) | `src/assets/images/vpflow-logo-sm.png` | Collapsed sidebar |
| Favicon | `public/favicon.ico` | Browser tab |

### Theme Mapping Rule

| Theme | Logo Version |
|-------|--------------|
| Dark Theme | LIGHT version (white/light content) |
| Light Theme | DARK version (dark content) |

### Branding Constraints

- Logos are fixed assets, not user-configurable in v1.0
- Aspect ratio must always be preserved
- No CSS scaling hacks or container stretching permitted
- Theme auto-selection handled by UI components

### Dynamic Configuration (DEFERRED)

The following features are **NOT IN SCOPE** for Phase 4/5:

- Settings → Branding tab
- Logo upload functionality
- Favicon upload functionality
- Runtime branding customization

**Target:** Dedicated future phase beyond v1.0

---

## Operational Constraints

| Constraint | Limit | Notes |
|------------|-------|-------|
| Storage per bucket | 1 GB default | Supabase tier dependent |
| Audit payload size | 10 KB max | Per event |
| Attachment file size | 10 MB max | Per file |
| Notification retention | 90 days | Auto-cleanup (future) |

---

## Module Dependency

```
Authentication
      │
      ▼
┌─────────────────────────────────────────┐
│              Core Modules               │
│  ┌───────────┐  ┌────────────────────┐  │
│  │  Clients  │◄─┤   Appointments     │  │
│  └───────────┘  └─────────┬──────────┘  │
│                           │             │
│                           ▼             │
│                    ┌────────────┐       │
│                    │   Cases    │       │
│                    └────────────┘       │
└─────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────┐
│           Supporting Services           │
│  Notifications │ Reminders │ Audit Logs │
└─────────────────────────────────────────┘
```

---

## References

- **Full Technical Specification:** `Phase_1_Architecture_Data_Model.md`
- **Workflow Diagrams:** `Phase_1_Workflow_State_Diagrams.md`
- **Access Policies:** `Phase_1_RLS_Policy_Matrix.md`
- **Notification Rules:** `Phase_1_Notification_SLA.md`
- **Scope Definition:** `Phase_0_Master_PRD.md`

---

## Current Phase Status

**Phase 4:** COMPLETE (2026-01-11)  
**Phase 5:** ✅ COMPLETE (2026-01-12)

**Protocol Access Note:** Per VP Office decision (2026-01-11), Protocol role access to `appointment_attendees` is restricted to non-sensitive metadata only (Option 2 enforced). Email and phone fields are blocked from Protocol view.

**Reference:** See `/Project Docs/Phase_4_Closure.md` for formal closure statement.

---

## v1.0 UI Cleanup (2026-01-16)

**Profile Dropdown Cleanup:**
- Removed "Pricing" menu item (demo content, not VP-Flow functionality)
- Removed "Help" menu item (demo content, not VP-Flow functionality)
- Retained: My Account, Lock screen, Logout

**Route Dropdown Clarification:**
- The route selector visible in preview mode is Lovable platform UI, not application code
- End users on vpflow.app do not see this selector
- No application code changes required

**Demo Data Cleanup (2026-01-16):**
- Deleted unused Darkone demo files:
  - `src/helpers/data.ts`
  - `src/assets/data/other.ts`
  - `src/assets/data/social.ts`
  - `src/assets/data/topbar.ts`
- Preserved: `src/assets/data/menu-items.ts` (active navigation)
- Types cleanup: NOT performed (no build pressure)

---

## Priority 3 Architecture Notes (2026-01-26)

**Handwriting & Pen Input (Priority 3-A) — PLANNING ONLY:**

### Planned Architecture Extension

```
┌─────────────────────────────────────────────────────────────┐
│                    NOTES MODULE (v1.1-B)                     │
│  ┌─────────────────┐                                        │
│  │      notes      │──────────────────┐                     │
│  │   (VP-only)     │                  │                     │
│  └─────────────────┘                  │                     │
│           │                           │                     │
│           ▼                           ▼                     │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │   note_links    │         │ note_handwriting│ ◄─ NEW    │
│  │  (entity links) │         │   (VP-only)     │           │
│  └─────────────────┘         └────────┬────────┘           │
│                                       │                     │
│                                       ▼                     │
│                              ┌─────────────────┐           │
│                              │  Storage Bucket │ ◄─ NEW    │
│                              │ note-handwriting│           │
│                              │   (Private)     │           │
│                              └─────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Technical Decisions (Locked)

| Decision | Value |
|----------|-------|
| Canvas Library | `perfect-freehand` |
| Rendering | Native HTML5 `<canvas>` |
| Storage Format | Vector stroke data (JSON) |
| Fallback | Raster PNG (if vector fails) |
| Access Control | VP-only (RLS enforced) |

### Status

**EXECUTION NOT AUTHORIZED** — Planning documentation only.

**Reference:** See `/Project Docs/Priority-3/` for complete specifications.

---

**Document Version:** 1.4  
**Created:** 2026-01-10  
**Updated:** 2026-01-26  
**Authority:** Devmart / Office of the Vice President