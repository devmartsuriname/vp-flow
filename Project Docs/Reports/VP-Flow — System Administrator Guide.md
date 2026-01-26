# VP-Flow System Administrator Guide

**Version:** 1.3  
**Date:** 2026-01-26  
**Classification:** Internal Use Only — Technical Staff  
**Authority:** Office of the Vice President

---

## 1. Introduction

### 1.1 Purpose

This guide provides technical procedures for system administrators managing the VP-Flow application. It covers essential tasks including user management, backup verification, security monitoring, and troubleshooting escalation paths.

### 1.2 Target Audience

- IT personnel with Supabase dashboard access
- VP-Flow administrators with technical responsibilities
- Development partner (Devmart) support staff

### 1.3 Prerequisites

- Supabase dashboard access credentials
- VP role in VP-Flow (for audit log access)
- Understanding of PostgreSQL and RLS concepts
- Access to this documentation and related files

### 1.4 Emergency Contacts

| Role | Contact | Availability |
|------|---------|--------------|
| VP Office | _________________ | Business hours |
| IT Administrator | _________________ | Business hours |
| Devmart Support | _________________ | Per SLA |
| Supabase Support | support@supabase.io | 24/7 |

---

## 2. System Architecture Overview

### 2.1 Platform Summary

| Component | Technology |
|-----------|------------|
| Frontend | React + TypeScript + Vite |
| UI Framework | Darkone Admin (React-Bootstrap) |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| Authentication | Supabase Auth (email/password) |
| Storage | Supabase Storage (documents bucket) |
| Hosting | Lovable deployment |

### 2.2 Architecture Diagram

```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   vpflow.app    │
│  (React SPA)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│              Supabase                    │
├─────────────────┬───────────────────────┤
│  Supabase Auth  │  PostgreSQL (RLS)     │
├─────────────────┼───────────────────────┤
│ Edge Functions  │  Storage (documents)  │
└─────────────────┴───────────────────────┘
```

### 2.3 Key URLs

| Resource | URL |
|----------|-----|
| Production App | vpflow.app |
| Supabase Dashboard | supabase.com/dashboard/project/[project-id] |
| SQL Editor | /sql/new |
| Authentication | /auth/users |
| Edge Functions | /functions |
| Storage | /storage/buckets |

---

## 3. User Management Procedures

### 3.1 Creating a New User Account

**Steps:**
1. Navigate: Supabase Dashboard > Authentication > Users
2. Click **Add User** > **Create new user**
3. Enter email address
4. Set initial password (or select "Send invite")
5. Click **Create user**
6. User profile auto-created via `handle_new_user` trigger
7. Proceed to role assignment (Procedure 3.2)

**Verification:**
```sql
-- Confirm user profile exists
SELECT id, full_name, is_active, created_at 
FROM user_profiles 
WHERE id = '<user_id>';
```

---

### 3.2 Assigning User Role (VP Only)

**Valid Roles:** `vp`, `secretary`, `protocol`

**Steps:**
1. Identify user_id from auth.users or user_profiles table
2. Navigate: Supabase Dashboard > SQL Editor
3. Execute role assignment:

```sql
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
  '<user_id>',
  '<role>'::app_role,
  '<vp_user_id>'
);
```

**Verification:**
```sql
-- Confirm role assignment
SELECT ur.user_id, ur.role, up.full_name, ur.created_at
FROM user_roles ur
JOIN user_profiles up ON ur.user_id = up.id
WHERE ur.user_id = '<user_id>';
```

---

### 3.3 Changing a User Role

**Steps:**
1. Navigate: Supabase Dashboard > SQL Editor
2. Execute role update:

```sql
UPDATE public.user_roles
SET role = '<new_role>'::app_role
WHERE user_id = '<user_id>';
```

**Note:** Role changes take effect on next login or session refresh.

---

### 3.4 Deactivating a User

**Steps:**
1. Navigate: Supabase Dashboard > SQL Editor
2. Execute deactivation:

```sql
UPDATE public.user_profiles
SET is_active = false, updated_at = now()
WHERE id = '<user_id>';
```

**Note:** User retains auth credentials but is marked inactive. Consider removing role assignment if permanent deactivation.

---

### 3.5 Removing User Role

**Steps:**
1. Navigate: Supabase Dashboard > SQL Editor
2. Execute role removal:

```sql
DELETE FROM public.user_roles 
WHERE user_id = '<user_id>';
```

**Warning:** User loses all role-based access immediately.

---

### 3.6 Password Reset

**Steps:**
1. Navigate: Supabase Dashboard > Authentication > Users
2. Locate user by email
3. Click user row to open details
4. Click **Send password recovery**
5. User receives reset email

---

## 4. Backup Verification Procedures

### 4.1 Supabase Automatic Backups

| Feature | Details |
|---------|---------|
| Point-in-time recovery | Enabled (Pro tier) |
| Backup frequency | Continuous (transaction log) |
| Retention | Per Supabase tier configuration |

---

### 4.2 Verifying Backup Status

**Steps:**
1. Navigate: Supabase Dashboard > Settings > Database
2. Review **Backups** section
3. Confirm last backup timestamp
4. Note backup retention policy
5. Document verification in maintenance log

---

### 4.3 Manual Data Export

**Steps:**
1. Navigate: Supabase Dashboard > SQL Editor
2. Run export queries per critical table:

```sql
-- Export appointments
SELECT * FROM appointments ORDER BY created_at DESC;

-- Export cases
SELECT * FROM cases ORDER BY created_at DESC;

-- Export clients
SELECT * FROM clients ORDER BY created_at DESC;

-- Export audit events (VP access required)
SELECT * FROM audit_events ORDER BY performed_at DESC;
```

3. Export results as CSV/JSON using download button
4. Store securely per data retention policy

---

### 4.4 Document Storage Backup

**Steps:**
1. Navigate: Supabase Dashboard > Storage > documents bucket
2. Review file listing
3. Download critical files manually if needed
4. Note: Supabase storage included in automatic backup scope

---

## 5. Security Monitoring

### 5.1 Reviewing Audit Logs (VP Only)

**In-Application:**
1. Login as VP
2. Navigate: VP-Flow > Audit Logs module
3. Review recent entries for anomalies
4. Filter by entity type, action, user, date range

**Via SQL Editor:**
```sql
-- Recent audit events
SELECT 
  performed_at,
  action,
  entity_type,
  entity_id,
  performed_by,
  new_values
FROM audit_events
ORDER BY performed_at DESC
LIMIT 100;
```

---

### 5.2 Checking Authentication Logs

**Steps:**
1. Navigate: Supabase Dashboard > Authentication > Logs
2. Review login attempts (success/failure)
3. Identify suspicious patterns:
   - Repeated failures from same email
   - Unusual IP addresses
   - Login attempts at odd hours
4. Cross-reference with audit_events if needed

---

### 5.3 RLS Policy Verification

**Steps:**
1. Navigate: Supabase Dashboard > SQL Editor
2. Run policy check:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

3. Verify all tables have expected RLS policies
4. Compare against documented RLS matrix (Security.md)

---

### 5.4 Security Function Verification

```sql
-- Verify security functions exist and are SECURITY DEFINER
SELECT 
  proname AS function_name,
  prosecdef AS security_definer
FROM pg_proc
WHERE proname IN ('is_vp', 'is_secretary', 'is_protocol', 'is_vp_or_secretary', 'has_role');
```

All functions should show `security_definer = true`.

---

## 6. System Health Checks

### 6.1 Database Connection Test

```sql
-- Simple connection test
SELECT 1 AS connection_ok, now() AS server_time;
```

Confirm query returns result with current timestamp.

---

### 6.2 Table Row Counts

```sql
-- Health check: Row counts for core tables
SELECT 
  'appointments' AS table_name, COUNT(*) AS row_count FROM appointments
UNION ALL
SELECT 'cases', COUNT(*) FROM cases
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'user_profiles', COUNT(*) FROM user_profiles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'audit_events', COUNT(*) FROM audit_events
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;
```

---

### 6.3 Edge Function Health

**Steps:**
1. Navigate: Supabase Dashboard > Edge Functions
2. Review function list (if any deployed)
3. Check **Deployments** tab for recent activity
4. Review **Logs** tab for errors

---

### 6.4 Storage Bucket Check

**Steps:**
1. Navigate: Supabase Dashboard > Storage
2. Verify **documents** bucket exists
3. Check bucket policies (should be private)
4. Review usage statistics

---

## 7. Troubleshooting Escalation Paths

### 7.1 Escalation Levels

| Level | Scope | Resolver | Trigger |
|-------|-------|----------|---------|
| L1 | User self-service | End user | — |
| L2 | Internal support | VP/Secretary | Self-service fails |
| L3 | System admin | IT Admin | Database fix required |
| L4 | Development | Devmart | Code change required |
| L5 | Infrastructure | Supabase | Platform issue |

---

### 7.2 Escalation Matrix

| Issue Type | L1 | L2 | L3 | L4 | L5 |
|------------|:--:|:--:|:--:|:--:|:--:|
| Login failure | ✓ | ✓ | ✓ | ✓ | ✓ |
| Permission denied | ✓ | ✓ | ✓ | — | — |
| Data not saving | ✓ | ✓ | ✓ | ✓ | — |
| Page not loading | ✓ | — | ✓ | ✓ | ✓ |
| Security incident | — | ✓ | ✓ | ✓ | ✓ |
| System outage | — | — | ✓ | ✓ | ✓ |
| Feature request | — | ✓ | — | ✓ | — |

---

### 7.3 Escalation Procedure

1. **Gather Information:**
   - Timestamp of issue
   - User(s) affected
   - Exact error message (screenshot if possible)
   - Steps to reproduce
   - Browser/device information

2. **Document in Maintenance Log:**
   - Issue description
   - Troubleshooting steps taken
   - Resolution or escalation decision

3. **Escalate with Context:**
   - Include all gathered information
   - Reference maintenance log entry
   - Specify urgency level

---

## 8. Common Issues & Resolutions

### 8.1 User Cannot Login

**Checklist:**
- [ ] Is user in auth.users? (Supabase > Auth > Users)
- [ ] Is user_profiles record present?
- [ ] Is user_profiles.is_active = true?
- [ ] Is user_roles record present?
- [ ] Has password been set/reset?

**Resolution:**
```sql
-- Check user status
SELECT 
  up.id,
  up.full_name,
  up.is_active,
  ur.role
FROM user_profiles up
LEFT JOIN user_roles ur ON up.id = ur.user_id
WHERE up.id = '<user_id>';
```

---

### 8.2 User Sees "Permission Denied"

**Checklist:**
- [ ] Does user have role assigned?
- [ ] Is role correct for the action?
- [ ] Is RLS policy functioning?

**Resolution:**
```sql
-- Verify user role
SELECT user_id, role FROM user_roles WHERE user_id = '<user_id>';

-- Test RLS function
SELECT 
  is_vp('<user_id>') AS is_vp,
  is_secretary('<user_id>') AS is_secretary,
  is_protocol('<user_id>') AS is_protocol;
```

---

### 8.3 Data Appears Missing

**Checklist:**
- [ ] Is user logged in with valid session?
- [ ] Does RLS allow access for user's role?
- [ ] Are filters applied that hide data?
- [ ] Is data in correct status for role visibility?

**Resolution:** Clear filters, verify role access matches expected data visibility per RLS matrix.

---

### 8.4 Notifications Not Appearing

**Checklist:**
- [ ] Is notifications table populated for user?
- [ ] Is user_id correct in notification record?
- [ ] Are notification triggers firing?

**Resolution:**
```sql
-- Check notifications for user
SELECT id, title, message, is_read, created_at
FROM notifications
WHERE user_id = '<user_id>'
ORDER BY created_at DESC
LIMIT 10;
```

---

### 8.5 Documents Not Uploading

**Checklist:**
- [ ] Is documents storage bucket accessible?
- [ ] Does user have VP or Secretary role?
- [ ] Is file size within limits?
- [ ] Is storage quota available?

**Resolution:** Check Supabase Storage dashboard for bucket status and policies.

---

## 9. Maintenance Procedures

### 9.1 Application Update Deployment

**Steps:**
1. Changes made in Lovable platform (development)
2. Test in preview environment
3. Click **Publish** to deploy to vpflow.app
4. Verify deployment via browser hard refresh (Ctrl+Shift+R)
5. Test critical paths post-deployment:
   - [ ] Login works
   - [ ] Dashboard loads
   - [ ] Appointments module accessible
   - [ ] Cases module accessible (VP/Secretary)

---

### 9.2 Database Migration Execution

**Steps:**
1. Migrations proposed via Lovable platform
2. **Review SQL carefully before approval**
3. Approve migration in Lovable UI
4. Verify schema changes in Supabase dashboard
5. Test affected functionality
6. Document migration in maintenance log

---

### 9.3 Clearing Browser Cache (User Instruction)

**Provide to users:**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Alternative: Clear browser cache manually via settings
- Purpose: Load latest deployed application assets

---

## 10. Reference Information

### 10.1 Key Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| user_profiles | User display names, active status | VP/Sec view all, users view own |
| user_roles | Role assignments (vp, secretary, protocol) | VP full access, users view own |
| appointments | Appointment records | VP/Sec full, Protocol approved only |
| cases | Case records | VP/Sec only, no Protocol access |
| clients | Guest/client records | VP/Sec only |
| audit_events | Immutable action log | VP read only, VP/Sec insert |
| notifications | User notifications | Users own only |
| documents | Document metadata | VP/Sec only |
| notes | VP private notes | VP own only |

---

### 10.2 Security Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `is_vp(user_id)` | Check VP role | boolean |
| `is_secretary(user_id)` | Check Secretary role | boolean |
| `is_protocol(user_id)` | Check Protocol role | boolean |
| `is_vp_or_secretary(user_id)` | Check VP or Secretary | boolean |
| `has_role(user_id, role)` | Check specific role | boolean |
| `get_vp_user_id()` | Get VP's user_id | uuid |

---

### 10.3 Role Capabilities Summary

| Capability | VP | Secretary | Protocol |
|------------|:--:|:---------:|:--------:|
| View all appointments | ✓ | ✓ | Approved only |
| Create appointments | ✓ | ✓ | ✗ |
| Approve/reject appointments | ✓ | ✗ | ✗ |
| View cases | ✓ | ✓ | ✗ |
| Create cases | ✓ | ✗ | ✗ |
| Close/reopen cases | ✓ | ✗ | ✗ |
| View audit logs | ✓ | ✗ | ✗ |
| Manage users | ✓ | ✗ | ✗ |
| Track protocol events | ✓ | ✓ | ✓ |

---

## 11. Document Control

| Property | Value |
|----------|-------|
| Document | VP-Flow System Administrator Guide |
| Version | 1.3 |
| Created | 2026-01-26 |
| Classification | Internal Use Only — Technical Staff |
| Authority | Office of the Vice President |
| Related Docs | User Quick Start Guide, Training Checklist, Security.md |

---

## Appendix A: Quick Reference SQL Commands

```sql
-- List all users with roles
SELECT 
  up.id,
  up.full_name,
  up.is_active,
  ur.role,
  up.created_at
FROM user_profiles up
LEFT JOIN user_roles ur ON up.id = ur.user_id
ORDER BY up.created_at DESC;

-- Count records by status (appointments)
SELECT status, COUNT(*) 
FROM appointments 
GROUP BY status 
ORDER BY status;

-- Count records by status (cases)
SELECT status, COUNT(*) 
FROM cases 
GROUP BY status 
ORDER BY status;

-- Recent audit activity
SELECT 
  performed_at,
  action,
  entity_type,
  performed_by
FROM audit_events
ORDER BY performed_at DESC
LIMIT 20;

-- Active sessions today
SELECT COUNT(DISTINCT performed_by) AS active_users_today
FROM audit_events
WHERE performed_at >= CURRENT_DATE;
```

---

**END OF DOCUMENT**
