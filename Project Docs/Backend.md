# VP-Flow — Backend Conceptual Structure

**Project:** VP-Flow  
**Client:** Office of the Vice President of Suriname  
**Document Type:** Conceptual Backend Overview  
**Status:** Documentation Only — NO Database Schemas

---

## Document Purpose

This document outlines the conceptual backend structure for VP-Flow. It describes services, functions, and integration points WITHOUT providing database schemas or implementation code.

> **Note:** Database schemas are NOT included per governance rules. Schema design is a Phase 2 task.

---

## Backend Platform

VP-Flow uses **Lovable Cloud** (Supabase) as its backend infrastructure.

### Core Services

| Service | Purpose |
|---------|---------|
| **Database** | PostgreSQL with Row-Level Security |
| **Authentication** | User login, session management, role assignment |
| **Edge Functions** | Serverless logic for notifications, scheduling, integrations |
| **Storage** | File storage for attachments (future phase) |
| **Realtime** | Live updates for notifications (optional) |

---

## Authentication Approach

### Method
- Email/password authentication via Supabase Auth
- No external OAuth providers in v1.0
- Session-based authentication with secure tokens

### Role Management
- Roles stored in user metadata or dedicated roles table
- Three roles only: VP, Secretary, Protocol
- Role determines RLS policy application

### Session Handling
- Automatic session refresh
- Secure logout (token invalidation)
- Role checked on each protected route

```
┌─────────────────────────────────────────────────────┐
│                 AUTHENTICATION FLOW                  │
│                                                     │
│  User ──► Login Page ──► Supabase Auth ──► Session  │
│                              │                      │
│                              ▼                      │
│                       Role Retrieved                │
│                              │                      │
│              ┌───────────────┼───────────────┐      │
│              ▼               ▼               ▼      │
│         VP Dashboard   Secretary View   Protocol    │
│                                          Dashboard  │
└─────────────────────────────────────────────────────┘
```

---

## Database Conceptual Structure

### Entity Categories

**Primary Entities** (Core Business Objects)
- Clients
- Appointments
- Cases

**Supporting Entities** (System Operations)
- Audit Logs
- Reminders
- Notifications

**Reference Entities** (Enums/Lookups)
- Appointment statuses
- Case statuses
- Priority levels
- Client types

### Data Integrity Rules

| Rule | Enforcement |
|------|-------------|
| Referential integrity | Foreign key constraints |
| Status transitions | Application logic + triggers |
| Immutable closed cases | RLS + trigger prevention |
| Append-only audit logs | RLS (no UPDATE/DELETE) |

---

## Edge Functions

### Planned Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `send-notification` | On demand | Dispatch email/push notifications |
| `schedule-reminder` | Appointment created/updated | Create reminder entries |
| `process-reminders` | Scheduled (cron) | Check and send due reminders |
| `sync-calendar` | Appointment approved | Push to Google Calendar |
| `log-audit-event` | Internal call | Write to audit log |

### Function Architecture

```
┌────────────────────────────────────────────────────┐
│                  EDGE FUNCTIONS                     │
│                                                    │
│  ┌──────────────────┐    ┌─────────────────────┐  │
│  │ send-notification │    │  schedule-reminder  │  │
│  │                  │    │                     │  │
│  │ • Email dispatch │    │ • Calculate due time│  │
│  │ • Template render│    │ • Insert reminder   │  │
│  │ • Delivery track │    │ • Set priority      │  │
│  └──────────────────┘    └─────────────────────┘  │
│                                                    │
│  ┌──────────────────┐    ┌─────────────────────┐  │
│  │ process-reminders│    │    sync-calendar    │  │
│  │                  │    │                     │  │
│  │ • Query due items│    │ • Google Calendar   │  │
│  │ • Trigger notify │    │ • Create/update evt │  │
│  │ • Mark processed │    │ • Handle conflicts  │  │
│  └──────────────────┘    └─────────────────────┘  │
└────────────────────────────────────────────────────┘
```

---

## Storage Structure

### Buckets (Planned)

| Bucket | Purpose | Access |
|--------|---------|--------|
| `attachments` | Appointment/case documents | Role-based |
| `client-files` | Client-related files | VP, Secretary |

### Storage Policies
- RLS applied to storage buckets
- Files linked to parent records
- Protocol excluded from client files

---

## Integration Points

### Google Calendar (Optional)

| Aspect | Detail |
|--------|--------|
| Direction | VP-Flow → Google Calendar (one-way push) |
| Trigger | Appointment approved |
| Data | Appointment time, client name, purpose |
| Authentication | Service account or OAuth |

### Notification Channels

| Channel | Priority | Implementation |
|---------|----------|----------------|
| In-app | Primary | Database + Realtime |
| Email | Secondary | Edge Function + SMTP |
| SMS | Future | Edge Function + Provider |

### External Calendar Hierarchy
- VP-Flow is the **System of Record**
- External calendars receive copies only
- Conflicts resolved in favor of VP-Flow

---

## API Structure

### Supabase Client API
- Direct database access via Supabase JS client
- RLS enforces access control automatically
- No custom REST endpoints needed for CRUD

### Edge Function Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/functions/v1/send-notification` | POST | Trigger notification |
| `/functions/v1/sync-calendar` | POST | Push to Google Calendar |

### API Security
- All endpoints require valid session
- Edge functions validate caller role
- Rate limiting via Supabase

---

## Secrets Management

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `GOOGLE_CALENDAR_CREDENTIALS` | Calendar API access |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Email notifications |
| `SMS_API_KEY` | SMS provider (future) |

### Secret Handling
- Stored in Lovable Cloud secrets
- Accessed only by Edge Functions
- Never exposed to frontend

---

## Data Flow Patterns

### Appointment Creation
```
Secretary → Create Form → Insert to DB → Trigger Reminder Scheduling
                                      → Notification to VP (pending approval)
```

### Appointment Approval
```
VP → Approve Action → Update Status → Trigger Calendar Sync
                                    → Notification to Protocol
                                    → Notification to Secretary
```

### Case Creation
```
VP → Create Case from Appointment → Insert Case → Link to Appointment
                                                → Audit Log Entry
                                                → Notification to Secretary
```

### Case Closure
```
VP → Close Case → Update Status (FINAL) → Audit Log Entry
                                        → Case becomes READ-ONLY
```

---

## Performance Considerations

| Area | Approach |
|------|----------|
| Query optimization | Indexed foreign keys, status fields |
| Pagination | Cursor-based for lists |
| Caching | Client-side with React Query |
| Realtime | Selective subscriptions |

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Auth failure | Redirect to login |
| Permission denied | Toast + log attempt |
| Network error | Retry with backoff |
| Validation error | Form-level feedback |
| Edge function failure | Fallback + admin alert |

---

## References

- **Technical Architecture:** `Phase_1_Architecture_Data_Model.md`
- **Access Policies:** `Phase_1_RLS_Policy_Matrix.md`
- **Notification Timing:** `Phase_1_Notification_SLA.md`

---

**Document Version:** 1.0  
**Created:** 2026-01-10  
**Authority:** Devmart / Office of the Vice President
