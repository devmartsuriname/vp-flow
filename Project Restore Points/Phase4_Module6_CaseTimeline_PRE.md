# Phase 4 — Module 6 PRE Restore Point
## Case Timeline / History (READ-ONLY)

**Created:** 2026-01-10
**Status:** BEFORE Module 6 Implementation
**Authorization:** APPROVED — Phase 4 Continuation

---

## 1. Completed Modules

| Module | Status | Date |
|--------|--------|------|
| Module 1: Clients | ✅ Complete | 2026-01-09 |
| Module 2: Appointments | ✅ Complete | 2026-01-09 |
| Module 3: Cases | ✅ Complete | 2026-01-09 |
| Module 4: Audit Logs | ✅ Complete | 2026-01-09 |
| Module 5: Notifications | ✅ Complete | 2026-01-10 |
| Module 6: Case Timeline | 🔄 Starting | 2026-01-10 |

---

## 2. Module 6 Scope

**Purpose:** Read-only chronological view of case lifecycle events

**Location:** Embedded section within Case Detail page

**Data Sources:**
- Case fields (all roles): created_at, opened_at, closed_at, updated_at
- Audit events (VP only): status_change, priority_change, deadline_change

**Role Access:**
- VP: Full timeline (case fields + audit events)
- Secretary: Basic timeline (case fields only, RLS blocks audit)
- Protocol: No access (blocked from Cases)

---

## 3. Files to Create

- src/app/(admin)/cases/hooks/useCaseTimeline.ts
- src/app/(admin)/cases/components/CaseTimelineEvent.tsx
- src/app/(admin)/cases/components/CaseTimeline.tsx

---

## 4. Files to Modify

- src/app/(admin)/cases/types.ts (add TimelineEvent type)
- src/app/(admin)/cases/hooks/index.ts (export new hook)
- src/app/(admin)/cases/components/index.ts (export new components)
- src/app/(admin)/cases/[id]/page.tsx (add timeline section)

---

## 5. Guardian Rules Compliance

- ✅ Darkone Admin 1:1 only
- ✅ No custom Bootstrap
- ✅ No custom icons (IconifyIcon bx:* only)
- ✅ No backend/schema changes
- ✅ No RLS changes
- ✅ No role expansion
- ✅ Read-only implementation

---

## 6. Rollback Instructions

If issues occur during implementation:
1. Revert all Module 6 file changes
2. Keep Modules 1-5 intact
3. Report failure with specific error details

---

**Restore Point Created By:** Lovable AI
**Governance Mode:** STRICT
