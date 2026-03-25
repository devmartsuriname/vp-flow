# VP-Flow — Change Control Protocol
**Version:** 1.0
**Effective Date:** 2026-03-25
**Status:** ACTIVE
**Governance Level:** Government / Cabinet-Critical

---

## 1. Purpose

This document defines the change control process for VP-Flow after the v1.x production freeze. All modifications to the frozen system require formal authorization.

---

## 2. Classification Matrix

| Severity | Definition | Response Time | Authority |
|----------|-----------|---------------|-----------|
| **Critical** | Security breach, data loss, system failure | Immediate | VP + Devmart |
| **High** | Workflow blocked, role access broken | 24 hours | VP approval required |
| **Low** | UI inconsistency, minor display issue | Next release | VP approval required |
| **Enhancement** | New feature, improvement, optimization | v2.0+ scope | VP approval required |

---

## 3. Change Request Process

### Step 1 — Request Submission
- Submitted by: VP, Secretary, or Devmart
- Format: Written description with impact assessment
- Classification: Must specify severity level

### Step 2 — Impact Assessment
- Devmart evaluates:
  - Files affected
  - Risk level (schema, RLS, UI, logic)
  - Restore point requirements

### Step 3 — VP Authorization
- VP reviews and approves or rejects
- No change proceeds without explicit VP approval
- Approval must be documented

### Step 4 — Controlled Execution
- Restore point created (PRE)
- Change applied within strict scope
- Post-execution restore point created (POST)

### Step 5 — Verification & Closure
- Change verified against requirements
- Documentation updated if applicable
- Change logged in version history

---

## 4. Authority Model

| Action | Authority |
|--------|-----------|
| Approve v1.x hotfix | VP only |
| Approve v2.0 feature | VP only |
| Submit change request | VP, Secretary, Devmart |
| Execute change | Devmart only |
| Verify change | VP + Devmart |

---

## 5. v1.x Hotfix Rules

1. **Restore points are MANDATORY** — no execution without PRE snapshot
2. **Scope-limited** — only the specific fix, nothing else
3. **No bundling** — one hotfix per change request
4. **Documentation update required** — if behavior changes
5. **Zero-risk validation** — must confirm no side effects

---

## 6. Prohibited Actions Under v1.x Freeze

- Feature additions
- Schema modifications (without Critical classification)
- RLS policy changes (without Critical classification)
- UI redesign
- Performance optimization
- Refactoring
- "Small improvements"

---

## 7. Escalation Path

1. Issue identified → Devmart classifies severity
2. Critical → Immediate VP notification + emergency protocol
3. Non-critical → Standard change request process
4. Enhancement → Deferred to v2.0 Scope Intake

---

**Document Authority:** VP-Flow Governance
**Enforcement:** Devmart Guardian Rules
