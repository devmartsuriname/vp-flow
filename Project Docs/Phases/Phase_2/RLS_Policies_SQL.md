# VP-Flow RLS Policies SQL Specification

**Phase:** 2 - Implementation Planning  
**Document Type:** Row-Level Security Policy Definitions  
**Status:** DOCUMENTATION ONLY - NOT EXECUTED  
**Source:** Phase_1_RLS_Policy_Matrix.md

---

## 1. Overview

This document contains the complete SQL definitions for all Row-Level Security (RLS) policies in VP-Flow. These policies enforce role-based access control at the database level.

**CRITICAL:** This document contains SQL definitions for documentation purposes only. No SQL has been or will be executed until Phase 3 is authorized.

---

## 2. Security Definer Function

This function prevents RLS recursion by using SECURITY DEFINER to bypass RLS when checking roles.

```sql
-- has_role: Check if a user has a specific role
-- Uses SECURITY DEFINER to prevent infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- is_vp: Convenience function to check VP role
CREATE OR REPLACE FUNCTION public.is_vp(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'vp')
$$;

-- is_secretary: Convenience function to check Secretary role
CREATE OR REPLACE FUNCTION public.is_secretary(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'secretary')
$$;

-- is_protocol: Convenience function to check Protocol role
CREATE OR REPLACE FUNCTION public.is_protocol(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'protocol')
$$;

-- is_vp_or_secretary: Check if user is VP or Secretary
CREATE OR REPLACE FUNCTION public.is_vp_or_secretary(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'vp') OR public.has_role(_user_id, 'secretary')
$$;
```

---

## 3. Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
```

---

## 4. RLS Policies by Table

### 4.1 user_roles

```sql
-- VP can view all user roles
CREATE POLICY "VP can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_vp(auth.uid()));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only VP can insert roles (via admin functions)
CREATE POLICY "VP can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_vp(auth.uid()));

-- Only VP can update roles
CREATE POLICY "VP can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_vp(auth.uid()))
WITH CHECK (public.is_vp(auth.uid()));

-- Only VP can delete roles
CREATE POLICY "VP can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_vp(auth.uid()));
```

---

### 4.2 user_profiles

```sql
-- All authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- VP can update any profile
CREATE POLICY "VP can update any profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (public.is_vp(auth.uid()))
WITH CHECK (public.is_vp(auth.uid()));

-- Profiles are created via trigger on auth.users insert
CREATE POLICY "System can insert profiles"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());
```

---

### 4.3 clients

**CRITICAL:** Protocol role has NO access to clients table.

```sql
-- VP and Secretary can view all clients
CREATE POLICY "VP and Secretary can view clients"
ON public.clients
FOR SELECT
TO authenticated
USING (public.is_vp_or_secretary(auth.uid()));

-- VP and Secretary can create clients
CREATE POLICY "VP and Secretary can create clients"
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (public.is_vp_or_secretary(auth.uid()));

-- VP and Secretary can update clients
CREATE POLICY "VP and Secretary can update clients"
ON public.clients
FOR UPDATE
TO authenticated
USING (public.is_vp_or_secretary(auth.uid()))
WITH CHECK (public.is_vp_or_secretary(auth.uid()));

-- Only VP can delete clients
CREATE POLICY "VP can delete clients"
ON public.clients
FOR DELETE
TO authenticated
USING (public.is_vp(auth.uid()));

-- EXPLICIT DENIAL: Protocol cannot access clients
-- (Implicit via no policy granting access to protocol role)
```

---

### 4.4 appointments

```sql
-- VP can view all appointments
CREATE POLICY "VP can view all appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (public.is_vp(auth.uid()));

-- Secretary can view vp_secretary visibility appointments
CREATE POLICY "Secretary can view vp_secretary appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  public.is_secretary(auth.uid()) 
  AND visibility = 'vp_secretary'
);

-- Protocol can view only approved appointments (limited columns via view)
CREATE POLICY "Protocol can view approved appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  public.is_protocol(auth.uid()) 
  AND status = 'approved'
);

-- VP and Secretary can create appointments
CREATE POLICY "VP and Secretary can create appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (public.is_vp_or_secretary(auth.uid()));

-- VP can update any appointment
CREATE POLICY "VP can update any appointment"
ON public.appointments
FOR UPDATE
TO authenticated
USING (public.is_vp(auth.uid()))
WITH CHECK (public.is_vp(auth.uid()));

-- Secretary can update draft appointments they created
CREATE POLICY "Secretary can update own draft appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (
  public.is_secretary(auth.uid()) 
  AND created_by_user_id = auth.uid()
  AND status = 'draft'
)
WITH CHECK (
  public.is_secretary(auth.uid()) 
  AND status = 'draft'
);

-- VP can delete appointments
CREATE POLICY "VP can delete appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (public.is_vp(auth.uid()));
```

---

### 4.5 appointment_attendees

```sql
-- VP and Secretary can view attendees
CREATE POLICY "VP and Secretary can view attendees"
ON public.appointment_attendees
FOR SELECT
TO authenticated
USING (
  public.is_vp_or_secretary(auth.uid())
);

-- Protocol can view attendees for approved appointments
CREATE POLICY "Protocol can view attendees for approved appointments"
ON public.appointment_attendees
FOR SELECT
TO authenticated
USING (
  public.is_protocol(auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.id = appointment_id
    AND a.status = 'approved'
  )
);

-- VP and Secretary can manage attendees
CREATE POLICY "VP and Secretary can insert attendees"
ON public.appointment_attendees
FOR INSERT
TO authenticated
WITH CHECK (public.is_vp_or_secretary(auth.uid()));

CREATE POLICY "VP and Secretary can update attendees"
ON public.appointment_attendees
FOR UPDATE
TO authenticated
USING (public.is_vp_or_secretary(auth.uid()))
WITH CHECK (public.is_vp_or_secretary(auth.uid()));

CREATE POLICY "VP and Secretary can delete attendees"
ON public.appointment_attendees
FOR DELETE
TO authenticated
USING (public.is_vp_or_secretary(auth.uid()));
```

---

### 4.6 cases

**CRITICAL:** Protocol role has NO access to cases table. Cases are IMMUTABLE when closed.

```sql
-- VP can view all cases
CREATE POLICY "VP can view all cases"
ON public.cases
FOR SELECT
TO authenticated
USING (public.is_vp(auth.uid()));

-- Secretary can view cases (read-only)
CREATE POLICY "Secretary can view cases"
ON public.cases
FOR SELECT
TO authenticated
USING (public.is_secretary(auth.uid()));

-- ONLY VP can create cases
CREATE POLICY "Only VP can create cases"
ON public.cases
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_vp(auth.uid())
  AND owner_user_id = auth.uid()
);

-- VP can update non-closed cases
CREATE POLICY "VP can update non-closed cases"
ON public.cases
FOR UPDATE
TO authenticated
USING (
  public.is_vp(auth.uid())
  AND status != 'closed'
)
WITH CHECK (
  public.is_vp(auth.uid())
);

-- NO DELETE policy - cases cannot be deleted
-- (Closed cases are immutable - enforced via trigger)

-- EXPLICIT DENIAL: Protocol cannot access cases
-- (Implicit via no policy granting access to protocol role)
```

---

### 4.7 reminders

```sql
-- VP and Secretary can view reminders
CREATE POLICY "VP and Secretary can view reminders"
ON public.reminders
FOR SELECT
TO authenticated
USING (public.is_vp_or_secretary(auth.uid()));

-- System/Edge functions manage reminders (via service role)
-- No direct user insert/update/delete policies
```

---

### 4.8 notifications

```sql
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- System inserts notifications (via service role)
```

---

### 4.9 protocol_events

```sql
-- All authenticated users can view protocol events
CREATE POLICY "All can view protocol events"
ON public.protocol_events
FOR SELECT
TO authenticated
USING (true);

-- Protocol can create events for approved appointments
CREATE POLICY "Protocol can create events"
ON public.protocol_events
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_protocol(auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.id = appointment_id
    AND a.status = 'approved'
  )
);

-- Protocol can update their own events
CREATE POLICY "Protocol can update own events"
ON public.protocol_events
FOR UPDATE
TO authenticated
USING (
  public.is_protocol(auth.uid())
  AND updated_by_user_id = auth.uid()
)
WITH CHECK (
  public.is_protocol(auth.uid())
);
```

---

### 4.10 documents

```sql
-- VP and Secretary can view documents
CREATE POLICY "VP and Secretary can view documents"
ON public.documents
FOR SELECT
TO authenticated
USING (public.is_vp_or_secretary(auth.uid()));

-- VP and Secretary can create documents
CREATE POLICY "VP and Secretary can create documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (public.is_vp_or_secretary(auth.uid()));

-- VP can delete documents
CREATE POLICY "VP can delete documents"
ON public.documents
FOR DELETE
TO authenticated
USING (public.is_vp(auth.uid()));

-- EXPLICIT DENIAL: Protocol cannot access documents
-- (Implicit via no policy granting access to protocol role)
```

---

### 4.11 audit_events

**CRITICAL:** Audit log is APPEND-ONLY. No UPDATE or DELETE permitted for any role.

```sql
-- Only VP can view audit events
CREATE POLICY "Only VP can view audit events"
ON public.audit_events
FOR SELECT
TO authenticated
USING (public.is_vp(auth.uid()));

-- System inserts audit events (via service role or triggers)
-- No user INSERT policy

-- NO UPDATE POLICY - audit events cannot be modified
-- NO DELETE POLICY - audit events cannot be deleted
```

---

## 5. Closed Case Immutability Trigger

```sql
-- Trigger function to prevent updates on closed cases
CREATE OR REPLACE FUNCTION public.prevent_closed_case_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.status = 'closed' THEN
    RAISE EXCEPTION 'Closed cases cannot be modified';
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to cases table
CREATE TRIGGER trigger_prevent_closed_case_update
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_closed_case_update();
```

---

## 6. Audit Logging Triggers

```sql
-- Trigger function for audit logging
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _action audit_action;
  _before JSONB;
  _after JSONB;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    _action := 'create';
    _before := NULL;
    _after := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    -- Detect specific update types
    IF TG_TABLE_NAME = 'cases' AND OLD.status != NEW.status THEN
      _action := 'status_change';
    ELSIF TG_TABLE_NAME = 'cases' AND OLD.priority != NEW.priority THEN
      _action := 'priority_change';
    ELSIF TG_TABLE_NAME = 'cases' AND OLD.deadline_at IS DISTINCT FROM NEW.deadline_at THEN
      _action := 'deadline_change';
    ELSE
      _action := 'update';
    END IF;
    _before := to_jsonb(OLD);
    _after := to_jsonb(NEW);
  END IF;

  -- Insert audit record
  INSERT INTO public.audit_events (
    actor_user_id,
    entity_type,
    entity_id,
    action,
    before_state,
    after_state
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    _action,
    _before,
    _after
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Attach audit triggers to critical tables
CREATE TRIGGER audit_cases_changes
  AFTER INSERT OR UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_appointments_changes
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();
```

---

## 7. Storage Bucket Policies

```sql
-- Attachments bucket: VP and Secretary access
CREATE POLICY "VP and Secretary can access attachments"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'attachments'
  AND public.is_vp_or_secretary(auth.uid())
)
WITH CHECK (
  bucket_id = 'attachments'
  AND public.is_vp_or_secretary(auth.uid())
);

-- Client files bucket: VP and Secretary access
CREATE POLICY "VP and Secretary can access client files"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'client-files'
  AND public.is_vp_or_secretary(auth.uid())
)
WITH CHECK (
  bucket_id = 'client-files'
  AND public.is_vp_or_secretary(auth.uid())
);
```

---

## 8. RLS Policy Matrix Verification

| Table | VP SELECT | VP INSERT | VP UPDATE | VP DELETE | Sec SELECT | Sec INSERT | Sec UPDATE | Sec DELETE | Proto SELECT | Proto INSERT | Proto UPDATE | Proto DELETE |
|-------|-----------|-----------|-----------|-----------|------------|------------|------------|------------|--------------|--------------|--------------|--------------|
| user_roles | ✅ All | ✅ | ✅ | ✅ | ✅ Own | ❌ | ❌ | ❌ | ✅ Own | ❌ | ❌ | ❌ |
| user_profiles | ✅ | ✅ Own | ✅ All | ❌ | ✅ | ✅ Own | ✅ Own | ❌ | ✅ | ✅ Own | ✅ Own | ❌ |
| clients | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| appointments | ✅ All | ✅ | ✅ | ✅ | ✅ Visible | ✅ | ✅ Draft | ❌ | ✅ Approved | ❌ | ❌ | ❌ |
| appointment_attendees | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Approved | ❌ | ❌ | ❌ |
| cases | ✅ | ✅ | ✅ Non-closed | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| reminders | ✅ | System | System | System | ✅ | System | System | System | ❌ | ❌ | ❌ | ❌ |
| notifications | ✅ Own | System | ✅ Own | ❌ | ✅ Own | System | ✅ Own | ❌ | ✅ Own | System | ✅ Own | ❌ |
| protocol_events | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ Own | ❌ |
| documents | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| audit_events | ✅ | System | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 9. Document Status

| Item | Status |
|------|--------|
| Security definer functions | DOCUMENTED |
| RLS enable statements | DOCUMENTED |
| All table policies | DOCUMENTED |
| Immutability trigger | DOCUMENTED |
| Audit triggers | DOCUMENTED |
| Storage policies | DOCUMENTED |
| Policy matrix verification | DOCUMENTED |
| SQL Execution | NOT PERFORMED |

---

**Document Classification:** PHASE 2 - IMPLEMENTATION PLANNING  
**Execution Status:** DOCUMENTATION ONLY - AWAITING PHASE 3 AUTHORIZATION
