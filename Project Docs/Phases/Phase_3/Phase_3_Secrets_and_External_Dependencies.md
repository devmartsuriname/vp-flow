# Phase 3 — Secrets and External Dependencies

**Document:** Phase_3_Secrets_and_External_Dependencies.md  
**Location:** /Project Docs/Phases/Phase_3/  
**Created:** 2026-01-10  
**Status:** PRE-EXECUTION READINESS  
**Purpose:** Define all secrets and external dependencies required for Phase 3 execution

---

## 1. Executive Summary

This document catalogs all secrets and external dependencies required for VP-Flow Phase 3 execution. It establishes:

- Complete inventory of required secrets
- Readiness status for each secret
- Classification as BLOCKING or NON-BLOCKING
- Configuration procedures for pending items

**Current Readiness:** ✅ READY FOR MVP EXECUTION  
**Blocking Items:** Phase 3 Authorization (governance only)  
**Non-Blocking Items:** SMTP secrets, Google Calendar secrets (optional features)

---

## 2. Secrets Inventory

### 2.1 Core Supabase Secrets (System-Provided)

| Secret Name | Purpose | Status | Required For | Blocking? |
|-------------|---------|--------|--------------|-----------|
| `SUPABASE_URL` | Database/API endpoint | ✅ READY | All backend operations | **YES** |
| `SUPABASE_PUBLISHABLE_KEY` | Client authentication | ✅ READY | Frontend auth | **YES** |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin/service operations | ✅ READY | Edge Functions | **YES** |
| `SUPABASE_DB_URL` | Direct database connection | ✅ READY | Migrations | **YES** |

**Note:** All Supabase core secrets are automatically provided by the connected Supabase project.

### 2.2 Email Notification Secrets (Pending)

| Secret Name | Purpose | Status | Required For | Blocking? |
|-------------|---------|--------|--------------|-----------|
| `SMTP_HOST` | Email server hostname | ⏳ PENDING | `send-notification` Edge Function | **NO** |
| `SMTP_PORT` | Email server port | ⏳ PENDING | `send-notification` Edge Function | **NO** |
| `SMTP_USER` | Email authentication username | ⏳ PENDING | `send-notification` Edge Function | **NO** |
| `SMTP_PASS` | Email authentication password | ⏳ PENDING | `send-notification` Edge Function | **NO** |
| `SMTP_FROM` | Default sender address | ⏳ PENDING | `send-notification` Edge Function | **NO** |

**Note:** Email notifications are optional for MVP. System can operate without email delivery.

### 2.3 Google Calendar Secrets (Pending)

| Secret Name | Purpose | Status | Required For | Blocking? |
|-------------|---------|--------|--------------|-----------|
| `GOOGLE_CALENDAR_CREDENTIALS` | Google API service account | ⏳ PENDING | `sync-calendar` Edge Function | **NO** |
| `GOOGLE_CALENDAR_ID` | Target calendar identifier | ⏳ PENDING | `sync-calendar` Edge Function | **NO** |

**Note:** Google Calendar sync is an optional feature. VP-Flow is the system of record; calendar sync is one-way push only.

---

## 3. Secrets Classification

### 3.1 Mandatory for Execution Start

These secrets MUST be available before first SQL execution:

| Secret | Status | Verification |
|--------|--------|--------------|
| `SUPABASE_URL` | ✅ READY | System-provided |
| `SUPABASE_PUBLISHABLE_KEY` | ✅ READY | System-provided |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ READY | System-provided |
| `SUPABASE_DB_URL` | ✅ READY | System-provided |

**Result:** All mandatory secrets are READY.

### 3.2 Optional — Can Be Enabled Post-MVP

These secrets can be configured after initial deployment:

| Secret Group | Feature | Impact if Missing |
|--------------|---------|-------------------|
| `SMTP_*` | Email notifications | Users won't receive email reminders (in-app only) |
| `GOOGLE_*` | Calendar sync | No external calendar updates (VP-Flow remains source of truth) |

**Result:** Missing optional secrets do NOT block execution.

---

## 4. External Dependencies

### 4.1 Dependency Status Matrix

| Dependency | Type | Status | Required For | Blocking? |
|------------|------|--------|--------------|-----------|
| Supabase Project | Database/Backend | ✅ CONNECTED | All operations | **YES** |
| Supabase Auth | Authentication | ✅ AVAILABLE | User login, session management | **YES** |
| Supabase Edge Functions | Serverless compute | ✅ AVAILABLE | Business logic, integrations | **YES** |
| Supabase Storage | File storage | ✅ AVAILABLE | Document attachments | **YES** |
| SMTP Server | Email service | ⏳ NOT CONFIGURED | Email notifications | **NO** |
| Google Calendar API | External API | ⏳ NOT CONFIGURED | Calendar sync | **NO** |
| Darkone Admin Template | UI Components | ✅ AVAILABLE | Frontend implementation | **YES** |

### 4.2 Dependency Notes

- **Supabase:** Fully connected and operational. Project ID: `xjkkumclqqnjngnttabf`
- **SMTP:** Can use any SMTP provider (e.g., SendGrid, Mailgun, Amazon SES). Configuration optional.
- **Google Calendar:** Requires Google Cloud project with Calendar API enabled. Configuration optional.
- **Darkone Admin:** Available in repository under `/archive/Darkone-React_v1.0/`. Components ready for use.

---

## 5. Execution Start Criteria Checklist

### 5.1 BLOCKING Items (Must Be Ready Before First SQL)

| # | Criterion | Status | Verification Method |
|---|-----------|--------|---------------------|
| 1 | Supabase project connected | ✅ CONFIRMED | Project ID visible in config |
| 2 | Supabase core secrets available | ✅ CONFIRMED | Listed in Supabase secrets |
| 3 | Phase 3 Authorization granted | ⛔ PENDING | Explicit user approval required |
| 4 | Pre-execution restore point created | ⏳ AT START | First action upon authorization |

### 5.2 NON-BLOCKING Items (Can Proceed Without)

| # | Criterion | Status | Impact if Missing |
|---|-----------|--------|-------------------|
| 1 | SMTP secrets configured | ⏳ PENDING | Email notifications disabled |
| 2 | Google Calendar secrets configured | ⏳ PENDING | Calendar sync disabled |
| 3 | VP Office formal acknowledgment | 📋 GOVERNANCE | No technical impact |

### 5.3 Execution Readiness Summary

```
┌─────────────────────────────────────────────────────────────┐
│                 EXECUTION READINESS STATUS                  │
├─────────────────────────────────────────────────────────────┤
│  Technical Readiness:     ✅ READY                          │
│  Secrets Readiness:       ✅ READY (core) / ⏳ PENDING (opt) │
│  Documentation Readiness: ✅ COMPLETE                       │
│  Authorization Status:    ⛔ PENDING                        │
├─────────────────────────────────────────────────────────────┤
│  OVERALL STATUS: READY FOR EXECUTION UPON AUTHORIZATION    │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. First Authorized Execution Action

### 6.1 Step 0: Pre-Execution Restore Point

**Action:** Create restore point documentation

**Location:** `/Project Restore Points/2026-MM-DD_Phase_3_execution_pre.md`

**Why This Step is Safe:**
- Creates recovery checkpoint before any changes
- Does not modify database, code, or configuration
- Follows established Restore Point Discipline
- Provides rollback capability if subsequent steps fail

**Verification Before Proceeding:**
- [ ] Restore point file exists with correct naming
- [ ] File contains accurate pre-execution state
- [ ] Confirmation documented that no execution has occurred yet

### 6.2 Step 1: Execute Phase A — Enum Types

**Action:** Execute migrations A1.1 through A1.11 (enum type creation)

**Migrations in Order:**
1. A1.1 — `CREATE TYPE app_role`
2. A1.2 — `CREATE TYPE client_type`
3. A1.3 — `CREATE TYPE appointment_status`
4. A1.4 — `CREATE TYPE appointment_visibility`
5. A1.5 — `CREATE TYPE case_status`
6. A1.6 — `CREATE TYPE case_priority`
7. A1.7 — `CREATE TYPE reminder_type`
8. A1.8 — `CREATE TYPE reminder_channel`
9. A1.9 — `CREATE TYPE protocol_status`
10. A1.10 — `CREATE TYPE document_entity_type`
11. A1.11 — `CREATE TYPE audit_action`

**Why This Step is Safe as Entry Point:**
- Enums have no dependencies on existing data
- Enums cannot break existing schema (purely additive)
- Failure can be cleanly rolled back with `DROP TYPE`
- Success verification is deterministic

**Verification SQL:**
```sql
SELECT typname FROM pg_type 
WHERE typname IN (
  'app_role', 'client_type', 'appointment_status', 
  'appointment_visibility', 'case_status', 'case_priority',
  'reminder_type', 'reminder_channel', 'protocol_status',
  'document_entity_type', 'audit_action'
);
-- Expected result: 11 rows
```

**STOP Condition:**
- If any enum creation fails → STOP
- Document error in restore point
- Await guidance before retry

---

## 7. Secrets Configuration Procedure

### 7.1 When to Configure Optional Secrets

| Secret Group | Configure When | Instructions |
|--------------|----------------|--------------|
| SMTP_* | Email notifications needed | See Section 7.2 |
| GOOGLE_* | Calendar sync needed | See Section 7.3 |

### 7.2 SMTP Configuration Steps

1. Navigate to Supabase Dashboard → Settings → Edge Functions → Secrets
2. Add the following secrets:
   - `SMTP_HOST`: Your SMTP server hostname
   - `SMTP_PORT`: Usually 587 (TLS) or 465 (SSL)
   - `SMTP_USER`: Authentication username
   - `SMTP_PASS`: Authentication password
   - `SMTP_FROM`: Default sender email address
3. Verify by deploying and testing `send-notification` Edge Function
4. Check Edge Function logs for successful email delivery

### 7.3 Google Calendar Configuration Steps

1. Create Google Cloud project (or use existing)
2. Enable Google Calendar API
3. Create service account with Calendar access
4. Download service account JSON credentials
5. Navigate to Supabase Dashboard → Settings → Edge Functions → Secrets
6. Add secrets:
   - `GOOGLE_CALENDAR_CREDENTIALS`: Full JSON credential content
   - `GOOGLE_CALENDAR_ID`: Target calendar ID (e.g., `primary` or specific calendar)
7. Share target calendar with service account email
8. Verify by deploying and testing `sync-calendar` Edge Function

---

## 8. Compliance Statement

| Boundary | Status |
|----------|--------|
| NO SQL execution | ✅ CONFIRMED |
| NO table creation | ✅ CONFIRMED |
| NO RLS modification | ✅ CONFIRMED |
| NO Edge Function deployment | ✅ CONFIRMED |
| NO UI changes | ✅ CONFIRMED |
| NO Supabase data changes | ✅ CONFIRMED |
| Documentation only | ✅ CONFIRMED |

---

## 9. Document Control

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-01-10 | Lovable AI | Initial creation |

---

**END OF DOCUMENT**
