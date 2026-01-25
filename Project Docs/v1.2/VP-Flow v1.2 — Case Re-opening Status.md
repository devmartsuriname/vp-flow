# VP-Flow v1.2 — Case Re-opening Status

## Document Metadata
| Field | Value |
|-------|-------|
| **Project** | VP-Flow |
| **Document Type** | Module Status Report |
| **Module** | Cases (Re-opening) |
| **Version** | v1.2 |
| **Status** | COMPLETE (v1.1-A) — Documentation Only |
| **Created** | 2026-01-25 |

---

## 1. Implementation Status

| Component | Status | Version Implemented |
|-----------|--------|---------------------|
| `reopened` status enum value | COMPLETE | v1.1-A |
| VP-only transition enforcement | COMPLETE | v1.1-A |
| Justification capture (vp_notes) | COMPLETE | v1.1-A |
| ReopenModal UI component | COMPLETE | v1.1-A |
| Database trigger (validate_case_reopen) | COMPLETE | v1.1-A |
| Audit events (reopened/edit/reclosed) | COMPLETE | v1.1-A |

---

## 2. Authorization Rules

### 2.1 Role Permissions

| Action | VP | Secretary | Protocol |
|--------|----|-----------|-----------
| View closed cases | ✓ | ✓ | ✗ |
| Reopen closed case | ✓ | ✗ | ✗ |
| Edit reopened case | ✓ | ✗ | ✗ |
| View reopened case | ✓ | ✓ | ✗ |
| Close reopened case | ✓ | ✗ | ✗ |

### 2.2 RLS Enforcement

| Policy | Table | Expression |
|--------|-------|------------|
| VP can update cases | cases | `is_vp(auth.uid())` — covers reopen |
| VP/Secretary can view cases | cases | `is_vp_or_secretary(auth.uid())` |

### 2.3 Application-Layer Enforcement

```typescript
// useReopenCase.ts - Line 27
if (existingCase?.status !== 'closed') {
  throw new Error('Only closed cases can be re-opened')
}
```

---

## 3. Required Reason Input

### 3.1 Justification Capture

| Field | Implementation |
|-------|----------------|
| Input source | ReopenModal textarea |
| Field name | `justification` |
| Storage location | Appended to `vp_notes` |
| Format | `[Re-opened {timestamp}]: {justification}` |
| Required | Optional (not enforced) |

### 3.2 Storage Example

```
[Re-opened 2026-01-25T10:30:00.000Z]: Client requested additional review of submitted documents.
```

### 3.3 Existing Notes Preservation

```typescript
// useReopenCase.ts - Lines 44-49
const reopenNote = `[Re-opened ${timestamp}]: ${justification.trim()}`
const existingNotes = currentCase?.vp_notes || ''
updateData.vp_notes = existingNotes 
  ? `${existingNotes}\n\n${reopenNote}` 
  : reopenNote
```

---

## 4. Status Flow Interaction

### 4.1 Valid Transitions TO Reopened

| From Status | To Status | Authorized By |
|-------------|-----------|---------------|
| `closed` | `reopened` | VP only |

### 4.2 Valid Transitions FROM Reopened

| From Status | To Status | Authorized By |
|-------------|-----------|---------------|
| `reopened` | `in_progress` | VP only |
| `reopened` | `parked` | VP only |
| `reopened` | `closed` | VP only (re-closure) |

### 4.3 Status Flow Diagram

```
                    ┌─────────────┐
                    │   closed    │
                    └──────┬──────┘
                           │ VP only
                           ▼
                    ┌─────────────┐
                    │  reopened   │
                    └──────┬──────┘
                           │ VP only
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐
       │in_progress│ │  parked   │ │  closed   │
       └───────────┘ └───────────┘ └───────────┘
                                   (re-closure)
```

---

## 5. Audit Requirements (Existing)

### 5.1 Audit Actions

| Audit Action | Trigger Condition | Status |
|--------------|-------------------|--------|
| `case_reopened` | `closed` → `reopened` | IMPLEMENTED |
| `case_reopen_edit` | Any field update while `status = 'reopened'` | IMPLEMENTED |
| `case_reclosed` | `reopened` → `closed` | IMPLEMENTED |

### 5.2 Audit Event Payload

```typescript
// case_reopened
{
  action: 'case_reopened',
  entity_type: 'case',
  entity_id: case.id,
  performed_by: auth.uid(),
  old_values: { status: 'closed' },
  new_values: { 
    status: 'reopened',
    vp_notes: '[Re-opened ...]: justification'
  }
}
```

### 5.3 Database Trigger

```sql
-- validate_case_reopen trigger (exists)
-- Enforces: only VP can transition closed → reopened
-- Logs: case_reopened audit event
```

---

## 6. UI Components (Existing)

| Component | Location | Purpose |
|-----------|----------|---------|
| ReopenModal | `src/app/(admin)/cases/components/` | Reopen confirmation dialog |
| useReopenCase | `src/app/(admin)/cases/hooks/` | Reopen mutation hook |
| CaseDetailActions | `src/app/(admin)/cases/components/` | Action buttons (includes Reopen) |

### 6.1 ReopenModal Behavior

1. Displayed when user clicks "Reopen Case" on closed case
2. Shows warning about reopening implications
3. Optional justification textarea
4. Confirm/Cancel buttons
5. On confirm: calls `useReopenCase` mutation
6. Success: toast notification, modal closes, UI refreshes

---

## 7. Explicit Exclusions (v1.2)

| Feature | Status | Rationale |
|---------|--------|-----------|
| Maximum reopen limits | NOT IMPLEMENTED | Deferred to v1.3+ per governance |
| Reopen count tracking | NOT IMPLEMENTED | Not required for v1.2 |
| Secretary reopen history visibility | NOT IMPLEMENTED | Role boundary constraint |
| Mandatory justification enforcement | NOT IMPLEMENTED | Optional by design |
| Automated reopen notifications | IN v1.2 | Via Notifications module |

---

## 8. v1.2 Changes

**MINIMAL CHANGES TO CASE RE-OPENING IN v1.2**

The Case Re-opening workflow is feature-complete as delivered in v1.1-A.

The only re-opening-related change in v1.2 is:
- Notification trigger on case reopen (see Notifications spec)
- Notification trigger on case status change (covers re-closure)

---

## 9. Security Considerations

### 9.1 Immutability of Closed Cases

| Principle | Implementation |
|-----------|----------------|
| Closed cases are FINAL | Only VP can transition out of `closed` |
| Audit trail preserved | All reopen actions logged immutably |
| No data loss | Original closure data preserved |

### 9.2 Reopen Justification

| Principle | Implementation |
|-----------|----------------|
| Accountability | Justification appended with timestamp |
| Traceability | `performed_by` captured in audit |
| Non-destructive | Appended to existing notes, never replaces |

---

## Cross-References

- `VP-Flow v1.2 — Scope Confirmation.md`
- `VP-Flow v1.2 — Notifications Technical Spec.md` — Reopen notifications
- `Project Docs/v1.1-A/` — Original implementation documentation
- `Project Docs/v1.3/VP-Flow v1.3 — Skipped & Deferred Features (Authoritative Record).md` — Advanced re-opening features
- `src/app/(admin)/cases/hooks/useReopenCase.ts` — Hook implementation
