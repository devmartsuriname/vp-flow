# VP-Flow Priority 3 — Scope Definition (LOCKED)

**Project:** VP-Flow (Appointments & Case Management System)  
**Client:** Office of the Vice President of Suriname  
**Document Type:** Scope Definition — LOCKED DECISIONS  
**Status:** PLANNING COMPLETE — NOT AUTHORIZED FOR EXECUTION  
**Date:** 2026-01-26  
**Baseline:** v1.0-v1.3 + Priority 1-2 COMPLETE & FROZEN

---

## Executive Summary

Priority 3 represents a **controlled expansion** of VP-Flow's operational capabilities. This document locks all scope decisions for Priority 3 planning and establishes formal boundaries for execution.

**EXECUTION STATUS: NOT AUTHORIZED**

---

## Section 1: Locked Decisions

### 1.1 Canvas Library Selection

| Decision | Value | Rationale |
|----------|-------|-----------|
| **Library** | `perfect-freehand` | Lightweight, pen-friendly stroke smoothing, minimal dependency surface vs react-konva |
| **Rendering** | Native `<canvas>` element | No heavyweight scene graph; direct canvas rendering with perfect-freehand stroke generation |
| **Fallback** | Mouse/touch input | Same canvas, degraded pressure sensitivity |

### 1.2 Storage Strategy

| Decision | Value | Rationale |
|----------|-------|-----------|
| **Primary Format** | Vector stroke data (JSON) | Resolution-independent; preserves stroke order and pressure; smaller file size |
| **Fallback Format** | Raster image (PNG/WebP) | Used only if vector rendering fails on target device |
| **Storage Location** | Supabase Storage (private bucket) | VP-only signed URL access; RLS enforced |

### 1.3 Execution Authorization

| Phase | Status |
|-------|--------|
| Priority 3-A (Handwriting) | **NOT AUTHORIZED** — Planning only |
| Priority 3-B (Device-First UX) | **DEFERRED** — v1.4+ consideration |
| Priority 3-C (Notifications UI) | **DEFERRED** — Low priority enhancement |

---

## Section 2: In Scope (Priority 3-A)

| Feature | Module | Status |
|---------|--------|--------|
| Handwriting canvas input | Notes | PLANNED |
| Vector stroke storage | Notes | PLANNED |
| `note_handwriting` table | Database | PLANNED |
| VP-only RLS policies | Database | PLANNED |
| Audit triggers (handwriting events) | Database | PLANNED |
| Lazy loading of handwriting artifacts | Notes | PLANNED |
| Storage bucket (private, VP-only) | Supabase Storage | PLANNED |

---

## Section 3: Out of Scope (Priority 3)

| Feature | Status | Rationale |
|---------|--------|-----------|
| OCR / handwriting-to-text | PROHIBITED | Third-party service; complexity; governance risk |
| Handwriting search | PROHIBITED | Requires OCR |
| Handwriting export | PROHIBITED | Not authorized |
| Multi-user handwriting | PROHIBITED | Notes are VP-only |
| Eraser / stroke-level editing | PROHIBITED | Per v1.1-C UI rules |
| Gesture-based commands | PROHIBITED | Per v1.1-C UI rules |
| Email notifications | PROHIBITED | External channel |
| Push notifications | PROHIBITED | External channel; security review required |
| SMS notifications | PROHIBITED | External channel |
| Background sync | KILLED | Security risk — RLS bypass |
| Offline write access | KILLED | Security risk — audit integrity |
| Document templates | DEFERRED | v1.4+ consideration |
| External document sharing | PROHIBITED | Security/governance risk |
| Public document links | PROHIBITED | No external access in v1.x |

---

## Section 4: Already Implemented (No Work Required)

| Feature | Version | Status |
|---------|---------|--------|
| Document lifecycle (draft/final/archived) | v1.3-A | FROZEN |
| Document versioning (immutable history) | v1.3-A | FROZEN |
| Case linkage rules | v1.3-A | FROZEN |
| Document audit trail | v1.3-A | FROZEN |
| Document role-based permissions | v1.3-A | FROZEN |
| Notification categorization | v1.3-C | FROZEN |
| Extended notification triggers | v1.3-C | FROZEN |
| Deadline warnings (48h case, 24h appointment) | Priority 1 | FROZEN |
| Overdue case notifications | Priority 1 | FROZEN |
| Global Search (read-only) | Priority 1 | FROZEN |

---

## Section 5: Deferred (Not Priority 3)

| Feature | Target | Notes |
|---------|--------|-------|
| Device-First UX optimization | v1.4+ | Touch targets, responsive refinements |
| Notification category filtering UI | v1.4+ | Low priority enhancement |
| "Unread only" notification filter | v1.4+ | Optional enhancement |
| Reopen count limits | v1.4+ | Awaiting usage data |

---

## Section 6: Phase Split

### Priority 3-A: Handwriting & Pen Input (CORE)

**Scope:**
1. Storage bucket creation (private, VP-only)
2. `note_handwriting` table + RLS policies
3. Audit triggers for handwriting events
4. Canvas input component (using `perfect-freehand`)
5. Note detail page integration
6. Lazy loading and performance optimization

**Complexity:** HIGH  
**Status:** NOT AUTHORIZED FOR EXECUTION

### Priority 3-B: Device-First UX (DEFERRED)

**Scope:**
1. Touch-optimized hit targets
2. Responsive layout refinements
3. Pen-friendly controls

**Status:** DEFERRED to v1.4+

### Priority 3-C: Notification Enhancements (DEFERRED)

**Scope:**
1. Category filtering UI
2. "Unread only" filter toggle

**Status:** DEFERRED — Low priority

---

## Section 7: Guardian Rules Compliance

| Rule | Priority 3 Approach |
|------|---------------------|
| Documentation is authoritative | This document governs all Priority 3 decisions |
| No assumptions | All decisions explicitly documented |
| No silent scope expansion | Explicit OUT OF SCOPE section |
| Darkone Admin 1:1 | Canvas component follows existing patterns |
| Restore point discipline | Pre/post for each sub-phase (when authorized) |
| No schema changes unless justified | `note_handwriting` table justified |
| Protocol isolation | No Protocol access to handwriting |

---

## Section 8: Authorization Gate

**This document LOCKS Priority 3 scope decisions.**

**Execution of Priority 3-A requires:**
1. Explicit authorization from project governance
2. Completion of "Ready for Execution" checklist
3. Device testing environment availability

---

**Document Status:** PLANNING COMPLETE — FORMALLY CLOSED  
**Execution Status:** NOT AUTHORIZED  
**Next Step:** Await explicit authorization for Priority 3-A execution

---

## EXECUTION GATE (MANDATORY)

> **No code, schema, storage, RLS, or UI changes are permitted without explicit authorization for Priority 3-A execution.**

This document is **LOCKED** and **AUTHORITATIVE**. Any modification requires formal governance approval.

---

**Document Version:** 1.0  
**Created:** 2026-01-26  
**Closed:** 2026-01-26  
**Authority:** Devmart / Office of the Vice President
