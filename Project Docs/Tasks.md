# VP-Flow — Task Breakdown

**Project:** VP-Flow  
**Client:** Office of the Vice President of Suriname  
**Document Type:** Phased Task Identification  
**Status:** Documentation Only — NO Execution

---

## Document Purpose

This document provides a structured, phase-gated breakdown of implementation tasks for VP-Flow. Tasks are identified and organized; this document does NOT authorize execution.

---

## Phase 2 — Implementation Planning

### 2.1 Database Schema Design
- [ ] Design `clients` table schema
- [ ] Design `appointments` table schema
- [ ] Design `cases` table schema
- [ ] Design `audit_logs` table schema
- [ ] Design `reminders` table schema
- [ ] Design `notifications` table schema
- [ ] Define all foreign key relationships
- [ ] Document enum types (status fields, priority levels)

### 2.2 RLS Policy Implementation Planning
- [ ] Map RLS policies to `clients` table
- [ ] Map RLS policies to `appointments` table
- [ ] Map RLS policies to `cases` table
- [ ] Map RLS policies to `audit_logs` table
- [ ] Define role-based access functions
- [ ] Document Protocol isolation rules

### 2.3 Authentication & Authorization Planning
- [ ] Define user roles in auth system (VP, Secretary, Protocol)
- [ ] Plan role assignment workflow
- [ ] Document session management approach

### 2.4 Edge Function Planning
- [ ] Plan notification dispatch function
- [ ] Plan reminder scheduling function
- [ ] Plan Google Calendar sync function (optional integration)
- [ ] Plan audit logging helper functions

### 2.5 UI Component Inventory
- [ ] Identify required Darkone components for each module
- [ ] Map components to PRD features
- [ ] Document component customization boundaries (Darkone 1:1 only)

---

## Phase 3 — Core Module Implementation

### 3.1 Authentication Module
- [ ] Implement login page
- [ ] Implement role-based routing
- [ ] Implement session persistence
- [ ] Implement logout functionality

### 3.2 Client Management Module
- [ ] Implement client list view
- [ ] Implement client detail view
- [ ] Implement client create/edit forms
- [ ] Implement client search
- [ ] Implement client history timeline

### 3.3 Appointment Management Module
- [ ] Implement appointment list view (with filters)
- [ ] Implement appointment detail view
- [ ] Implement appointment create form (Secretary)
- [ ] Implement appointment edit form (Secretary)
- [ ] Implement appointment approval workflow (VP only)
- [ ] Implement appointment status transitions
- [ ] Implement calendar integration display

### 3.4 Case Management Module
- [ ] Implement case list view (VP, Secretary only)
- [ ] Implement case detail view
- [ ] Implement case creation from appointment (VP only)
- [ ] Implement case status workflow
- [ ] Implement case closure (VP only, FINAL)
- [ ] Implement case assignment

### 3.5 Protocol Dashboard
- [ ] Implement approved appointments list (today's focus)
- [ ] Implement day-of execution tracking
- [ ] Ensure NO case visibility
- [ ] Ensure NO client notes visibility

### 3.6 Notification & Reminder System
- [ ] Implement reminder trigger logic
- [ ] Implement notification display
- [ ] Implement escalation rules
- [ ] Implement SLA tracking

### 3.7 Audit Logging
- [ ] Implement audit log writes on critical actions
- [ ] Implement audit log viewer (VP only)
- [ ] Ensure append-only behavior

---

## Phase 4 — Testing & Refinement

### 4.1 Functional Testing
- [ ] Test all CRUD operations per module
- [ ] Test role-based access (positive and negative cases)
- [ ] Test state transitions (appointments, cases)
- [ ] Test notification delivery
- [ ] Test reminder scheduling

### 4.2 Security Testing
- [ ] Verify RLS policies block unauthorized access
- [ ] Verify Protocol cannot access cases
- [ ] Verify closed cases are immutable
- [ ] Verify audit logs are append-only

### 4.3 Integration Testing
- [ ] Test Google Calendar sync (if enabled)
- [ ] Test end-to-end appointment-to-case flow
- [ ] Test notification escalation paths

### 4.4 User Acceptance Testing
- [ ] VP workflow validation
- [ ] Secretary workflow validation
- [ ] Protocol workflow validation

---

## Phase 5 — QA & Hardening

**AUTHORIZATION STATUS:** NOT AUTHORIZED — AWAITING VP OFFICE APPROVAL

> **Gate Requirement:** Explicit written authorization required before executing any Phase 5 tasks.

### Phase 5A: QA & Regression Hardening
**Status:** NOT AUTHORIZED

- [ ] Comprehensive role-based access testing (VP/Secretary/Protocol)
- [ ] Verify Protocol cannot access Cases or Settings
- [ ] Verify Secretary cannot approve appointments or create cases
- [ ] Verify closed case immutability across all entry points
- [ ] Test all module routes with each role (positive/negative)
- [ ] Verify audit log append-only behavior
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verification
- [ ] Error handling and edge case coverage
- [ ] Network error/timeout graceful degradation

### Phase 5B: Controlled Consolidation
**Status:** NOT AUTHORIZED

- [ ] Unify role-fetching logic (`useUserRole` vs `useAuthContext().role`)
- [ ] Consolidate duplicated `EmptyState` components into shared component
- [ ] Consolidate `STATUS_BADGE_VARIANTS` into single source of truth
- [ ] Standardize Protocol redirect destinations (currently inconsistent)
- [ ] Review and clean up unused imports/exports
- [ ] Audit module loading states for consistency

### Phase 5C: Security Hardening
**Status:** NOT AUTHORIZED

- [x] Decision: appointment_attendees Protocol access → **OPTION 2 ENFORCED** (2026-01-11)
- [ ] Implement appointment_attendees Option 2 restriction (RLS VIEW or column enforcement)
- [ ] Implement documents UPDATE policy (when feature activated)
- [ ] Consider notifications DELETE policy for user convenience
- [ ] Final security scan verification (all ERRORs resolved or documented)
- [ ] RLS policy review against Phase 1 matrix

---

## Phase 6 — Deployment & Handover

### 6.1 Deployment Preparation
- [ ] Production environment configuration
- [ ] Secrets management verification
- [ ] Database migration scripts finalized

### 6.2 Documentation Handover
- [ ] User guides per role
- [ ] Admin documentation
- [ ] Troubleshooting guide

### 6.3 Training
- [ ] VP orientation
- [ ] Secretary training
- [ ] Protocol training

---

## Task Governance

- Tasks are derived from Phase 0 PRD and Phase 1 Architecture
- NO tasks may be added without explicit authorization
- Each task must map to documented requirements
- Execution requires phase gate approval

---

## Status Legend

- [ ] Not Started
- [~] In Progress
- [x] Complete
- [!] Blocked

**Current Phase:** Phase 4 COMPLETE  
**Execution Status:** Phase 5 NOT AUTHORIZED — AWAITING VP OFFICE APPROVAL

---

**Document Version:** 1.1  
**Updated:** 2026-01-11  
**Authority:** Devmart / Office of the Vice President
