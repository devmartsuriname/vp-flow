# Phase 3 — Execution Plan

**Document Type:** Supabase-First Execution Flow  
**Phase:** 3 - Core Implementation  
**Status:** 🟡 READY FOR EXECUTION (Pending Authorization)  
**Execution Platform:** SUPABASE (NOT Lovable Cloud)

---

## 1. Execution Platform Confirmation

**CONFIRMED:** All backend execution will run via **Supabase** (external project).

| Configuration | Value |
|---------------|-------|
| Supabase Project ID | `xjkkumclqqnjngnttabf` |
| Connection Status | ✅ CONNECTED |
| Lovable Cloud | ❌ NOT USED |
| Client Library | `@supabase/supabase-js` installed |

---

## 2. Supabase-First Execution Flow

Execution follows a strict sequence aligned with `Migration_Sequence.md`:

```
┌─────────────────────────────────────────────────────────┐
│                    PHASE 3 EXECUTION                     │
│                   (Supabase Platform)                    │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  DATABASE     │  │  SECURITY     │  │  BACKEND      │
│  SCHEMA       │  │  LAYER        │  │  FUNCTIONS    │
└───────────────┘  └───────────────┘  └───────────────┘
        │                  │                  │
        │                  │                  │
        ▼                  ▼                  ▼
   Enums + Tables     RLS Policies      Edge Functions
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ▼
                    ┌───────────────┐
                    │  UI LAYER     │
                    │  (Darkone 1:1)│
                    └───────────────┘
```

---

## 3. Step-by-Step Execution Order

### Step 1: Pre-Execution Setup

**Action:** Verify Supabase connection and configure secrets

| Task | Command / Action | Verification |
|------|-----------------|--------------|
| 1.1 | Verify Supabase client works | Test query returns no error |
| 1.2 | Configure SMTP secrets | Add to Supabase Edge Function secrets |
| 1.3 | Configure Google Calendar secrets | Add to Supabase Edge Function secrets |
| 1.4 | Create restore point | `/Project Restore Points/2026-MM-DD_Phase_3_pre.md` |

**STOP CONDITION:** Do not proceed if secrets cannot be configured.

---

### Step 2: Phase A — Enum Types (Migrations A1.1-A1.11)

**Action:** Create all 11 enum types

| Migration | Enum | SQL Summary |
|-----------|------|-------------|
| A1.1 | `app_role` | `'vp', 'secretary', 'protocol'` |
| A1.2 | `client_type` | `'person', 'organization'` |
| A1.3 | `appointment_status` | 7 values |
| A1.4 | `appointment_visibility` | `'vp_secretary', 'vp_only'` |
| A1.5 | `case_status` | 5 values |
| A1.6 | `case_priority` | `'high', 'medium', 'low'` |
| A1.7 | `reminder_type` | 2 values |
| A1.8 | `reminder_channel` | 2 values |
| A1.9 | `protocol_status` | 5 values |
| A1.10 | `document_entity_type` | `'case'` |
| A1.11 | `audit_action` | 6 values |

**Verification:** 
```sql
SELECT typname FROM pg_type WHERE typname LIKE 'app_%' OR typname LIKE 'case_%' OR typname LIKE 'appointment_%';
```

**STOP CONDITION:** If any enum creation fails, STOP and debug before continuing.

---

### Step 3: Phase B — Security Functions (Migrations B1.1-B1.5)

**Action:** Create role-checking functions

| Migration | Function | Purpose |
|-----------|----------|---------|
| B1.1 | `has_role()` | Core role check (SECURITY DEFINER) |
| B1.2 | `is_vp()` | VP convenience check |
| B1.3 | `is_secretary()` | Secretary convenience check |
| B1.4 | `is_protocol()` | Protocol convenience check |
| B1.5 | `is_vp_or_secretary()` | Combined check |

**Verification:**
```sql
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE 'is_%';
```

**STOP CONDITION:** Functions MUST exist before creating tables that use them.

---

### Step 4: Phase C — User Domain Tables (Migrations C1.1-C1.2)

**Action:** Create user-related tables

| Migration | Table | Key Columns |
|-----------|-------|-------------|
| C1.1 | `user_roles` | `user_id`, `role` (FK to auth.users) |
| C1.2 | `user_profiles` | `id` (PK = auth.users.id), `full_name`, `is_active` |

**Verification:**
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_roles', 'user_profiles');
```

**STOP CONDITION:** Tables MUST exist and have correct foreign keys before proceeding.

---

### Step 5: Phase D — Business Domain Tables (Migrations D1.1-D1.4)

**Action:** Create core business tables in dependency order

| Order | Migration | Table | Dependencies |
|-------|-----------|-------|--------------|
| 1 | D1.1 | `clients` | `client_type` enum |
| 2 | D1.2 | `appointments` | `clients`, status/visibility enums |
| 3 | D1.3 | `appointment_attendees` | `appointments` |
| 4 | D1.4 | `cases` | `clients`, `appointments`, status/priority enums |

**Verification:**
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('clients', 'appointments', 'appointment_attendees', 'cases');
```

**STOP CONDITION:** Each table MUST complete before dependent tables are created.

---

### Step 6: Phase E — Supporting Tables (Migrations E1.1-E1.5)

**Action:** Create supporting/auxiliary tables

| Migration | Table | Purpose |
|-----------|-------|---------|
| E1.1 | `reminders` | Case deadline reminders |
| E1.2 | `notifications` | User notification queue |
| E1.3 | `protocol_events` | Protocol execution tracking |
| E1.4 | `documents` | Case document metadata |
| E1.5 | `audit_events` | Immutable audit log |

**Verification:**
```sql
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Expected: 11 tables
```

**STOP CONDITION:** All 11 tables MUST exist before enabling RLS.

---

### Step 7: Phase F — Indexes (Migrations F1.1-F1.14)

**Action:** Create performance indexes

| Count | Target Tables |
|-------|--------------|
| 14 | All tables with high-query columns |

**Verification:**
```sql
SELECT indexname FROM pg_indexes WHERE schemaname = 'public';
```

**STOP CONDITION:** Optional — can proceed if index creation fails (performance impact only).

---

### Step 8: Phase G — Enable RLS (Migrations G1.1-G1.11)

**Action:** Enable Row-Level Security on all 11 tables

```sql
ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;
```

**Verification:**
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- All should show rowsecurity = true
```

**STOP CONDITION:** RLS MUST be enabled on ALL tables before applying policies.

---

### Step 9: Phase H — RLS Policies (Migrations H1.1-H5.11)

**Action:** Apply all RLS policies per `RLS_Policies_SQL.md`

| Policy Group | Tables | Policy Count |
|--------------|--------|--------------|
| H1 | user_roles | 5 |
| H2 | user_profiles | 4 |
| H3 | clients | 4 |
| H4 | appointments | 7 |
| H5 | appointment_attendees | 5 |
| H6 | cases | 4 |
| H7 | reminders | 1 |
| H8 | notifications | 2 |
| H9 | protocol_events | 3 |
| H10 | documents | 3 |
| H11 | audit_events | 1 |

**Verification:**
```sql
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
```

**CRITICAL VERIFICATION:**
- ✅ Protocol has NO access to `cases` table
- ✅ Protocol has NO access to `clients` table
- ✅ Protocol can ONLY see `approved` appointments
- ✅ Closed cases cannot be updated

**STOP CONDITION:** RLS policies MUST be verified for security compliance before proceeding.

---

### Step 10: Phase I — Triggers (Migrations I1.1-I3.2)

**Action:** Create security and audit triggers

| Migration | Trigger | Purpose |
|-----------|---------|---------|
| I1.1 | `prevent_closed_case_update()` | Case immutability |
| I1.2 | `trigger_prevent_closed_case_update` | Attach to cases |
| I2.1 | `log_audit_event()` | Audit logging function |
| I2.2 | `audit_cases_changes` | Case audit trigger |
| I2.3 | `audit_appointments_changes` | Appointment audit trigger |
| I2.4 | Updated timestamp triggers | All tables |

**Verification:**
```sql
SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public';
```

**STOP CONDITION:** Closed case immutability trigger is MANDATORY before any UI work.

---

### Step 11: Phase J — Storage (Migrations J1.1-J2.2)

**Action:** Create storage buckets and policies

| Bucket | Purpose | Access |
|--------|---------|--------|
| `attachments` | Case attachments | VP/Secretary only |
| `client-files` | Client documents | VP/Secretary only |

**Verification:** Check Supabase Storage dashboard

**STOP CONDITION:** Storage policies MUST deny Protocol access.

---

### Step 12: Phase K — Edge Functions (Migrations K1.1-K1.6)

**Action:** Deploy Edge Functions per `Edge_Function_Specifications.md`

| Function | Purpose | Secrets Required |
|----------|---------|------------------|
| `send-notification` | Notification dispatch | SMTP_* |
| `schedule-reminder` | Reminder scheduling | None |
| `process-reminders` | Cron-based processing | None |
| `sync-calendar` | Google Calendar sync | GOOGLE_* |
| `log-audit-event` | Backup audit logging | None |
| `generate-case-pdf` | PDF generation | None |

**Verification:** Check Edge Function logs for each deployment

**STOP CONDITION:** Edge Functions MUST be tested before UI integration.

---

### Step 13: UI Implementation (Darkone 1:1)

**Action:** Implement UI modules per `Component_Inventory.md`

| Order | Module | Dependencies |
|-------|--------|--------------|
| 1 | Authentication | All backend ready |
| 2 | Dashboard | Auth complete |
| 3 | Client Management | Auth complete |
| 4 | Appointment Management | Clients complete |
| 5 | Case Management | Appointments complete |
| 6 | Protocol Dashboard | Appointments complete |
| 7 | Notifications | All modules ready |
| 8 | Settings & Profile | All modules ready |

**STOP CONDITION:** Each module MUST be verified against Darkone Admin before proceeding.

---

## 4. Mandatory Verification After Each Step

| Step | Verification Required | Pass Criteria |
|------|----------------------|---------------|
| 2 | Enum existence check | All 11 enums created |
| 3 | Function existence check | All 5 functions created |
| 4-6 | Table existence check | All 11 tables created |
| 7 | Index existence check | Performance indexes present |
| 8 | RLS enabled check | All tables have RLS |
| 9 | Policy security check | Role isolation verified |
| 10 | Trigger functionality test | Closed case update blocked |
| 11 | Storage access test | Protocol access denied |
| 12 | Edge Function logs check | No errors on invocation |
| 13 | UI rendering check | Darkone 1:1 compliance |

---

## 5. Explicit STOP Conditions

Execution MUST STOP if any of the following occur:

| Condition | Action |
|-----------|--------|
| Migration SQL fails | Debug, fix, retry |
| RLS policy creates recursion | Use SECURITY DEFINER pattern |
| Protocol can access cases | Critical security fix required |
| Closed case can be updated | Trigger implementation error |
| Edge Function fails to deploy | Check secrets, check logs |
| Darkone component not found | Stop, review Component_Inventory.md |
| Any Guardian Rule violation | Stop, escalate to governance |

---

## 6. Rollback Procedures

If execution must be rolled back:

### 6.1 Edge Function Rollback
```
Delete deployed functions in Supabase dashboard
```

### 6.2 Database Rollback (DESTRUCTIVE)
```sql
-- WARNING: This drops all data
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### 6.3 Partial Rollback (Per Phase)
See `Migration_Sequence.md` Section 4 for reverse-order rollback.

---

## 7. Post-Execution Checklist

After Phase 3 completion:

- [ ] All 11 tables created
- [ ] All RLS policies applied
- [ ] All triggers functional
- [ ] All Edge Functions deployed
- [ ] Storage buckets configured
- [ ] UI modules implemented (Darkone 1:1)
- [ ] Protocol isolation verified
- [ ] Closed case immutability verified
- [ ] Audit logging functional
- [ ] Restore point created: `Phase_3_post.md`

---

## 8. Guardian Rules During Execution

| Rule | Enforcement |
|------|-------------|
| Documentation is law | All code must match Phase 2 specs |
| No assumptions | Stop and ask if unclear |
| Darkone 1:1 | No custom components allowed |
| Restore Points | Required before and after each module |
| No scope creep | Implement only what is documented |
| Audit everything | Log all critical actions |
| Stop on ambiguity | Do not guess implementation |

---

## 9. Secrets Required Before Execution

| Secret Name | Purpose | Configured |
|-------------|---------|------------|
| SUPABASE_URL | Supabase connection | ✅ Yes |
| SUPABASE_PUBLISHABLE_KEY | Client auth | ✅ Yes |
| SUPABASE_SERVICE_ROLE_KEY | Admin operations | ✅ Yes |
| SUPABASE_DB_URL | Direct DB access | ✅ Yes |
| SMTP_HOST | Email server | ⏳ PENDING |
| SMTP_PORT | Email port | ⏳ PENDING |
| SMTP_USER | Email auth | ⏳ PENDING |
| SMTP_PASS | Email password | ⏳ PENDING |
| GOOGLE_CALENDAR_CREDENTIALS | Calendar API | ⏳ PENDING |
| GOOGLE_CALENDAR_ID | Target calendar | ⏳ PENDING |

---

**Document Status:** READY FOR EXECUTION (Pending Authorization)  
**Execution Platform:** SUPABASE  
**Next Action:** Obtain Phase 3 Authorization
