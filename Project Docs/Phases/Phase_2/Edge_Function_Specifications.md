# VP-Flow Edge Function Specifications

**Phase:** 2 - Implementation Planning  
**Document Type:** Edge Function Design  
**Status:** DOCUMENTATION ONLY - NOT EXECUTED  
**Source:** Backend.md, Phase_1_Notification_SLA.md

---

## 1. Overview

This document specifies all Edge Functions required for VP-Flow. Each function includes its purpose, triggers, inputs, outputs, and logic flow.

**CRITICAL:** This document contains function specifications for documentation purposes only. No code has been or will be executed until Phase 3 is authorized.

---

## 2. Common Configuration

### 2.1 CORS Headers (All Functions)

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### 2.2 Standard Response Format

```typescript
interface EdgeFunctionResponse {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
}
```

### 2.3 Required Secrets

| Secret Name | Purpose | Required By |
|-------------|---------|-------------|
| SMTP_HOST | Email server hostname | send-notification |
| SMTP_PORT | Email server port | send-notification |
| SMTP_USER | Email authentication | send-notification |
| SMTP_PASS | Email password | send-notification |
| GOOGLE_CALENDAR_CREDENTIALS | Google API auth | sync-calendar |
| GOOGLE_CALENDAR_ID | Target calendar ID | sync-calendar |

---

## 3. Edge Function Specifications

### 3.1 send-notification

**Purpose:** Dispatch notifications to users via in-app and/or email channels.

**Trigger:** Called by other functions or database triggers when notifications are needed.

**Authentication:** Service role (internal use only)

**Config (supabase/config.toml):**
```toml
[functions.send-notification]
verify_jwt = false
```

**Input Schema:**
```typescript
interface SendNotificationInput {
  user_id: string;           // Target user UUID
  notification_type: string;  // Type identifier
  payload: {
    title: string;
    message: string;
    entity_type?: string;
    entity_id?: string;
    priority?: 'high' | 'medium' | 'low';
  };
  channels: ('in_app' | 'email')[];  // Delivery channels
}
```

**Output Schema:**
```typescript
interface SendNotificationOutput {
  success: boolean;
  notification_id?: string;
  channels_sent: string[];
  error?: string;
}
```

**Logic Flow:**
```
1. Validate input
   ├── Check user_id exists in auth.users
   ├── Validate notification_type
   └── Validate payload structure

2. Check user active status
   └── Query user_profiles.is_active

3. For each channel in channels:
   ├── If 'in_app':
   │   └── INSERT into notifications table
   │       ├── user_id
   │       ├── type = notification_type
   │       ├── payload = JSON payload
   │       └── created_at = now()
   │
   └── If 'email':
       ├── Query user email from auth.users
       ├── Format email template
       └── Send via SMTP
           ├── Subject: payload.title
           ├── Body: payload.message
           └── Handle SMTP errors

4. Log delivery status

5. Return result
   ├── notification_id (from in_app insert)
   ├── channels_sent (successful channels)
   └── Any errors encountered
```

**Error Handling:**
- User not found: Return error, do not send
- User inactive: Return error, do not send
- Email send failure: Log error, continue with in_app
- Database error: Return error with details

---

### 3.2 schedule-reminder

**Purpose:** Create reminder entries based on case priority and deadline.

**Trigger:** Called when a case is created or deadline is updated.

**Authentication:** Service role (triggered by database)

**Config (supabase/config.toml):**
```toml
[functions.schedule-reminder]
verify_jwt = false
```

**Input Schema:**
```typescript
interface ScheduleReminderInput {
  case_id: string;
  priority: 'high' | 'medium' | 'low';
  deadline_at: string;  // ISO timestamp
}
```

**Output Schema:**
```typescript
interface ScheduleReminderOutput {
  success: boolean;
  reminders_created: number;
  reminder_times: string[];  // ISO timestamps
  error?: string;
}
```

**Reminder Schedule (per Phase_1_Notification_SLA.md):**

| Priority | Reminder Schedule |
|----------|-------------------|
| High | T-7 days, T-3 days, T-1 day, T-0 (day of) |
| Medium | T-3 days, T-1 day |
| Low | T-1 day (optional) |

**Logic Flow:**
```
1. Validate input
   ├── Check case_id exists
   ├── Validate priority value
   └── Parse deadline_at

2. Delete existing future reminders
   └── DELETE FROM reminders
       WHERE case_id = input.case_id
       AND scheduled_for > now()
       AND sent_at IS NULL

3. Calculate reminder times based on priority
   ├── High:
   │   ├── deadline - 7 days
   │   ├── deadline - 3 days
   │   ├── deadline - 1 day
   │   └── deadline (day of, morning)
   ├── Medium:
   │   ├── deadline - 3 days
   │   └── deadline - 1 day
   └── Low:
       └── deadline - 1 day

4. Filter out past reminder times
   └── Only schedule if scheduled_for > now()

5. Insert reminder records
   └── FOR EACH reminder_time:
       INSERT INTO reminders (
         case_id,
         type = 'upcoming_deadline',
         scheduled_for = reminder_time,
         channel = 'in_app'
       )

6. Return result
   ├── reminders_created count
   └── reminder_times array
```

**Error Handling:**
- Case not found: Return error
- Invalid deadline (past): Skip scheduling, return warning
- Database error: Return error with details

---

### 3.3 process-reminders

**Purpose:** Check for due reminders and trigger notifications.

**Trigger:** Scheduled (cron) - every 15 minutes.

**Authentication:** Service role

**Config (supabase/config.toml):**
```toml
[functions.process-reminders]
verify_jwt = false
```

**Input Schema:**
```typescript
// No input - runs on schedule
```

**Output Schema:**
```typescript
interface ProcessRemindersOutput {
  success: boolean;
  processed: number;
  errors: number;
  details: {
    reminder_id: string;
    status: 'sent' | 'failed';
    error?: string;
  }[];
}
```

**Logic Flow:**
```
1. Query due reminders
   └── SELECT r.*, c.title, c.priority, c.owner_user_id
       FROM reminders r
       JOIN cases c ON c.id = r.case_id
       WHERE r.scheduled_for <= now()
       AND r.sent_at IS NULL
       AND c.status != 'closed'

2. For each reminder:
   ├── Get case owner (VP)
   │
   ├── Determine notification channels
   │   ├── in_app (always)
   │   └── email (if high priority)
   │
   ├── Call send-notification
   │   ├── user_id = case.owner_user_id
   │   ├── notification_type = reminder.type
   │   ├── payload = {
   │   │     title: "Case Deadline Reminder",
   │   │     message: "Case '{case.title}' deadline approaching",
   │   │     entity_type: "case",
   │   │     entity_id: case.id,
   │   │     priority: case.priority
   │   │   }
   │   └── channels based on priority
   │
   ├── If high priority, also notify Secretary
   │   └── Query users with secretary role
   │       └── Send notification to each
   │
   ├── Update reminder.sent_at = now()
   │
   └── Log result

3. Handle overdue cases
   └── SELECT cases WHERE deadline_at < now()
       AND status NOT IN ('closed', 'parked')
       └── Create 'overdue' type reminders if not exists

4. Return summary
   ├── processed count
   ├── errors count
   └── per-reminder details
```

**Error Handling:**
- Notification send failure: Log, continue to next
- Database error: Log, return partial results
- Case closed during processing: Skip, mark as processed

---

### 3.4 sync-calendar

**Purpose:** Push approved appointments to Google Calendar.

**Trigger:** Called when an appointment is approved.

**Authentication:** Service role

**Config (supabase/config.toml):**
```toml
[functions.sync-calendar]
verify_jwt = false
```

**Input Schema:**
```typescript
interface SyncCalendarInput {
  appointment_id: string;
  action: 'create' | 'update' | 'delete';
}
```

**Output Schema:**
```typescript
interface SyncCalendarOutput {
  success: boolean;
  google_event_id?: string;
  action_performed: string;
  error?: string;
}
```

**Logic Flow:**
```
1. Validate input
   └── Check appointment_id exists

2. Retrieve appointment details
   └── SELECT * FROM appointments
       WHERE id = input.appointment_id
       JOIN clients ON appointments.client_id = clients.id

3. Authenticate with Google Calendar API
   ├── Load credentials from GOOGLE_CALENDAR_CREDENTIALS
   └── Obtain access token

4. Based on action:
   ├── 'create':
   │   └── Create event
   │       ├── summary = appointment.title
   │       ├── location = appointment.location
   │       ├── start = appointment.start_at
   │       ├── end = appointment.end_at
   │       ├── attendees = (from appointment_attendees)
   │       └── description = (formatted details)
   │
   ├── 'update':
   │   └── Update event using google_event_id
   │       └── Same fields as create
   │
   └── 'delete':
       └── Delete event using google_event_id

5. Update appointment record
   └── UPDATE appointments
       SET google_event_id = response.event_id,
           google_calendar_id = calendar_id
       WHERE id = input.appointment_id

6. Log sync status to audit

7. Return result
   ├── google_event_id
   └── action_performed
```

**Error Handling:**
- Authentication failure: Return error, do not update appointment
- API rate limit: Return error with retry suggestion
- Event not found (for update/delete): Log warning, proceed
- Network error: Return error with details

---

### 3.5 log-audit-event

**Purpose:** Write audit log entries (backup for trigger-based logging).

**Trigger:** Called by triggers or other functions when audit logging is needed.

**Authentication:** Service role

**Config (supabase/config.toml):**
```toml
[functions.log-audit-event]
verify_jwt = false
```

**Input Schema:**
```typescript
interface LogAuditEventInput {
  actor_user_id: string;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'status_change' | 'pdf_generate' | 'priority_change' | 'deadline_change';
  before_state?: object;
  after_state?: object;
}
```

**Output Schema:**
```typescript
interface LogAuditEventOutput {
  success: boolean;
  audit_id: string;
  error?: string;
}
```

**Logic Flow:**
```
1. Validate input
   ├── Check actor_user_id exists
   ├── Validate entity_type
   └── Validate action enum

2. Insert audit record
   └── INSERT INTO audit_events (
         actor_user_id,
         entity_type,
         entity_id,
         action,
         before_state,
         after_state,
         created_at
       ) VALUES (
         input.actor_user_id,
         input.entity_type,
         input.entity_id,
         input.action,
         input.before_state,
         input.after_state,
         now()
       )
       RETURNING id

3. Return result
   └── audit_id from insert
```

**Error Handling:**
- Validation failure: Return error
- Database error: Return error (critical - audit must succeed)

---

### 3.6 generate-case-pdf

**Purpose:** Generate PDF summary of a case for archival.

**Trigger:** Called by VP when closing a case or on demand.

**Authentication:** User JWT (VP only)

**Config (supabase/config.toml):**
```toml
[functions.generate-case-pdf]
verify_jwt = true
```

**Input Schema:**
```typescript
interface GenerateCasePdfInput {
  case_id: string;
}
```

**Output Schema:**
```typescript
interface GenerateCasePdfOutput {
  success: boolean;
  document_id?: string;
  storage_path?: string;
  error?: string;
}
```

**Logic Flow:**
```
1. Verify caller is VP
   └── Check user role via has_role function

2. Retrieve case details
   └── SELECT case with:
       ├── Appointment details
       ├── Client details
       ├── Status history (from audit_events)
       └── Notes

3. Generate PDF content
   ├── Header: VP Office letterhead
   ├── Case summary
   ├── Timeline of events
   ├── Notes (formatted)
   └── Footer with generation timestamp

4. Upload to storage
   └── Upload to 'attachments' bucket
       └── Path: cases/{case_id}/{timestamp}.pdf

5. Create document record
   └── INSERT INTO documents (
         entity_type = 'case',
         entity_id = case_id,
         storage_path,
         file_name,
         generated_by_user_id = auth.uid(),
         generated_at = now()
       )

6. Log audit event
   └── Call log-audit-event with action = 'pdf_generate'

7. Return result
   ├── document_id
   └── storage_path
```

**Error Handling:**
- Not VP: Return 403 Forbidden
- Case not found: Return 404
- PDF generation failure: Return error with details
- Storage upload failure: Return error

---

## 4. Database Triggers for Edge Functions

### 4.1 Case Deadline Trigger

```sql
-- Trigger to call schedule-reminder when case deadline changes
CREATE OR REPLACE FUNCTION public.trigger_schedule_reminder()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only trigger if deadline is set or changed
  IF NEW.deadline_at IS NOT NULL AND 
     (OLD.deadline_at IS NULL OR OLD.deadline_at != NEW.deadline_at) THEN
    
    -- Call edge function via pg_net (if available) or queue for processing
    PERFORM net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/schedule-reminder',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body := jsonb_build_object(
        'case_id', NEW.id,
        'priority', NEW.priority,
        'deadline_at', NEW.deadline_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_case_deadline_reminder
  AFTER INSERT OR UPDATE OF deadline_at, priority ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_schedule_reminder();
```

### 4.2 Appointment Approval Trigger

```sql
-- Trigger to call sync-calendar when appointment is approved
CREATE OR REPLACE FUNCTION public.trigger_calendar_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only trigger on status change to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    
    PERFORM net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/sync-calendar',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body := jsonb_build_object(
        'appointment_id', NEW.id,
        'action', 'create'
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_appointment_calendar_sync
  AFTER UPDATE OF status ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_calendar_sync();
```

---

## 5. Cron Job Configuration

### 5.1 Reminder Processing (supabase/config.toml)

```toml
# Process reminders every 15 minutes
[functions.process-reminders.schedule]
cron = "*/15 * * * *"
```

---

## 6. Edge Function File Structure

```
supabase/
├── config.toml
└── functions/
    ├── send-notification/
    │   └── index.ts
    ├── schedule-reminder/
    │   └── index.ts
    ├── process-reminders/
    │   └── index.ts
    ├── sync-calendar/
    │   └── index.ts
    ├── log-audit-event/
    │   └── index.ts
    └── generate-case-pdf/
        └── index.ts
```

---

## 7. Document Status

| Item | Status |
|------|--------|
| Function specifications | DOCUMENTED |
| Input/output schemas | DOCUMENTED |
| Logic flows | DOCUMENTED |
| Database triggers | DOCUMENTED |
| Cron configuration | DOCUMENTED |
| File structure | DOCUMENTED |
| Code Implementation | NOT PERFORMED |

---

**Document Classification:** PHASE 2 - IMPLEMENTATION PLANNING  
**Execution Status:** DOCUMENTATION ONLY - AWAITING PHASE 3 AUTHORIZATION
