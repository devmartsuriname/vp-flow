# v2.0 Phase 0: Scope Definition & Prioritization (CORRECTED)

## Correction Applied

OCR/Text Extraction removed from v2.0 scope and moved to Permanently Excluded. It is already listed as permanently excluded in `v2.0_Scope_Intake.md` Section 2, making its inclusion in v2.0 scope inconsistent.

## Deliverable

**File:** `Project Docs/v2.0/v2.0_Scope_Definition.md`

---

### 1. Scope Categories

**8 items** (down from 9 — OCR removed):

**Core Enhancements:**

- Push Notifications
- Email Notifications
- Notification Preferences

**UX Improvements:**

- Device-First UX
- Rich Text Notes
- Category Filtering

**System Extensions:**

- Document Templates
- Reopen Count Limits

### 2. Priority Classification


| Item                     | Category | Priority | Justification                    |
| ------------------------ | -------- | -------- | -------------------------------- |
| Push Notifications       | Core     | P1       | Real-time workflow awareness     |
| Email Notifications      | Core     | P1       | External notification channel    |
| Notification Preferences | Core     | P2       | Depends on P1 notifications      |
| Device-First UX          | UX       | P2       | Mobile/tablet experience         |
| Rich Text Notes          | UX       | P2       | Enhanced note-taking             |
| Document Templates       | System   | P2       | Standardized document creation   |
| Category Filtering       | UX       | P3       | Basic display already functional |
| Reopen Count Limits      | System   | P3       | Requires operational usage data  |


### 3. Scope Boundaries

**INCLUDED:** 8 deferred items above

**PERMANENTLY EXCLUDED:**

- Background Sync — KILLED (RLS bypass risk)
- Offline Write Access — KILLED (audit integrity)
- Signature Verification — out of scope
- Handwriting Export — no business need
- **OCR/Text Extraction — permanently excluded (third-party dependency, no business requirement)**
- External access portals, public portals, multi-tenant, calendar sync, AI/ML, chat, financial, HR modules

### 4. Risk Assessment (P1 Only)


| P1 Item             | RLS Risk | Workflow Risk | Dependencies                               |
| ------------------- | -------- | ------------- | ------------------------------------------ |
| Push Notifications  | LOW      | LOW           | Service worker, notification permissions   |
| Email Notifications | LOW      | LOW           | Email service (Edge Functions or external) |


### 5. Execution Constraints

- No breaking changes to v1.x data model
- All v1.x tables, RLS, triggers unchanged
- Additive schema only
- Backward compatibility mandatory
- Restore point discipline enforced

---

**NOTE — FINAL SCOPE RECONCILIATION (STRICT DEVSMART GOVERNANCE)**

---

## PURPOSE

Ensure 100% alignment between:

- v2.0 Scope Definition
- v2.0 Scope Intake

---

## REQUIRED CHECK

Before finalizing:

1. Confirm EXACT match:
  - Total items = 8
  - Same item names
  - Same categorization
2. Validate:
  - No duplicate items
  - No missing items
  - No renamed items
3. Confirm OCR:
  - Not present in Scope Definition
  - Not present in Deferred list
  - Present only in Permanently Excluded

---

## CONSTRAINTS

- No edits unless mismatch found
- No reclassification
- No additions

---

## STOP CONDITION

- Confirm alignment
- Proceed with execution

---

**Governance:**

- Documentation is law
- No assumptions
- Zero inconsistency tolerance

---

**Await Further Instructions**  
  
  
  
**Restore Points**

- **PRE:** `Project Restore Points/v2.0/RP-v2.0-Phase0-PRE.md`
- **POST:** `Project Restore Points/v2.0/RP-v2.0-Phase0-POST.md`

## Additional Required Update

**File:** `Project Docs/Governance/v2.0_Scope_Intake.md`

- Remove OCR/Text Extraction from Section 1 (Deferred Features) — it belongs only in Section 2 (Permanently Excluded), where it is already listed.
- Deferred count changes from 9 to 8.

## What is NOT touched

- No v1.x files
- No code, schema, RLS, or UI changes