# VP-Flow Workflow Desk Reference Poster
**Format:** A4 (210mm × 297mm) | **Orientation:** Portrait | **Version:** 1.3 | **Date:** 2026-01-25

---

## Print-Ready A4 Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                              ┃
┃                         VP-FLOW WORKFLOW REFERENCE                           ┃
┃                  Office of the Vice President of Suriname                    ┃
┃                                                                              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                ┃                                            ┃
┃   APPOINTMENT LIFECYCLE        ┃   CASE LIFECYCLE                           ┃
┃                                ┃                                            ┃
┃        ┌─────────┐             ┃        ┌─────────┐                         ┃
┃        │  DRAFT  │             ┃        │  DRAFT  │                         ┃
┃        └────┬────┘             ┃        └────┬────┘                         ┃
┃             │ submit           ┃             │ open                         ┃
┃             ▼                  ┃             ▼                              ┃
┃       ┌──────────┐             ┃        ┌─────────┐                         ┃
┃       │PENDING_VP│             ┃        │  OPEN   │◄────────┐               ┃
┃       └─────┬────┘             ┃        └────┬────┘         │               ┃
┃      ┌──────┴──────┐           ┃             │ start        │ unpark        ┃
┃      │             │           ┃             ▼              │               ┃
┃      ▼             ▼           ┃      ┌────────────┐        │               ┃
┃ ┌────────┐   ┌──────────┐      ┃      │IN_PROGRESS │────────┤               ┃
┃ │APPROVED│   │ REJECTED │      ┃      └─────┬──────┘        │               ┃
┃ └────┬───┘   └──────────┘      ┃         ┌──┴──┐      ┌─────┴───┐           ┃
┃      │                         ┃         │     │      │ PARKED  │           ┃
┃   ┌──┴──────────┐              ┃         ▼     └──────┴─────────┘           ┃
┃   │             │              ┃    ┌─────────┐                             ┃
┃   ▼             ▼              ┃    │ CLOSED  │ ◄── FINAL                   ┃
┃ ┌─────────┐ ┌───────────┐      ┃    └─────────┘                             ┃
┃ │COMPLETED│ │RESCHEDULED│      ┃                                            ┃
┃ └─────────┘ └───────────┘      ┃   ⚠ Re-open requires VP justification      ┃
┃       │           │            ┃                                            ┃
┃       ▼           ▼            ┃   States: Draft, Open, InProgress,         ┃
┃  ┌──────────┐                  ┃           Parked, Closed                   ┃
┃  │CANCELLED │                  ┃                                            ┃
┃  └──────────┘                  ┃   Key Rule:                                ┃
┃                                ┃   "Only VP can create and close cases"     ┃
┃  States: Draft, PendingVP,     ┃                                            ┃
┃  Approved, Rejected,           ┃                                            ┃
┃  Rescheduled, Cancelled,       ┃                                            ┃
┃  Completed                     ┃                                            ┃
┃                                ┃                                            ┃
┃  Key Rule:                     ┃                                            ┃
┃  "Only VP can approve/reject"  ┃                                            ┃
┃                                ┃                                            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                              ┃
┃   PROTOCOL EXECUTION                          ROLE AUTHORITY                 ┃
┃                                                                              ┃
┃        ┌──────────┐                     ┌────────────────────────────────┐   ┃
┃        │ EXPECTED │                     │  VP   │ Full Authority         │   ┃
┃        └────┬─────┘                     │       │ • Approve/Reject Appts │   ┃
┃       ┌─────┴─────┐                     │       │ • Create/Close Cases   │   ┃
┃       │           │                     │       │ • Access All Modules   │   ┃
┃       ▼           ▼                     ├───────┼────────────────────────┤   ┃
┃  ┌─────────┐  ┌─────────┐               │  SEC  │ Support Role           │   ┃
┃  │ ARRIVED │  │ NO_SHOW │               │       │ • Create Appointments  │   ┃
┃  └────┬────┘  └─────────┘               │       │ • Read Cases (No CRUD) │   ┃
┃       │                                 │       │ • Manage Guests        │   ┃
┃       ▼                                 ├───────┼────────────────────────┤   ┃
┃  ┌──────────┐                           │ PROT  │ Execute Only           │   ┃
┃  │ ASSISTED │                           │       │ • Approved Appts Only  │   ┃
┃  └────┬─────┘                           │       │ • Day-of Tracking      │   ┃
┃       │                                 │       │ • No Case Access       │   ┃
┃       ▼                                 └───────┴────────────────────────┘   ┃
┃  ┌───────────┐                                                               ┃
┃  │ COMPLETED │                          Symbol Key:                          ┃
┃  └───────────┘                          ● Full Access                        ┃
┃                                         ◐ Limited/Read-Only                  ┃
┃  States: Expected, Arrived,             ○ No Access                          ┃
┃          Assisted, NoShow, Completed                                         ┃
┃                                                                              ┃
┃  Key Rule:                                                                   ┃
┃  "Only approved appointments visible"                                        ┃
┃                                                                              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                              ┃
┃   INTEGRATED WORKFLOW SEQUENCE                                               ┃
┃                                                                              ┃
┃   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐   ┃
┃   │Secretary│───▶│   VP    │───▶│ System  │───▶│Protocol │───▶│   VP    │   ┃
┃   │ Creates │    │Approves │    │ Notifies│    │Executes │    │ Creates │   ┃
┃   │  Appt   │    │         │    │         │    │         │    │  Case   │   ┃
┃   └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘   ┃
┃                                                                              ┃
┃   Draft ──▶ PendingVP ──▶ Approved ──▶ Expected ──▶ Completed ──▶ Case Open ┃
┃                                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                        VP-Flow v1.3 | Case Management System
                     INTERNAL USE ONLY — Government of Suriname
```

---

## Poster Specifications

| Property | Value |
|----------|-------|
| **Size** | A4 (210mm × 297mm / 8.27" × 11.69") |
| **Orientation** | Portrait |
| **Margins** | 10mm all sides |
| **Font** | Monospace (Consolas, Monaco, or Courier New) |
| **Font Size** | 8pt for diagrams, 10pt for headers |
| **Line Spacing** | 1.0 (single) |
| **Colors** | Monochrome (print-friendly) |
| **Paper** | 120gsm+ matte or satin finish |

---

## Quadrant Layout

| Quadrant | Content | Key Information |
|----------|---------|-----------------|
| **Top-Left** | Appointment Lifecycle | 7 states, VP approval gate |
| **Top-Right** | Case Lifecycle | 6 states, closure finality |
| **Bottom-Left** | Protocol Execution | 5 states, day-of tracking |
| **Bottom-Right** | Role Authority | VP/SEC/PROT permissions |
| **Footer Strip** | Integrated Sequence | End-to-end workflow flow |

---

## Workflow State Summary

### Appointment States (7)
| State | Description | Transitions To |
|-------|-------------|----------------|
| Draft | Initial creation | PendingVP |
| PendingVP | Awaiting VP decision | Approved, Rejected |
| Approved | VP confirmed | Completed, Rescheduled, Cancelled |
| Rejected | VP declined | — (terminal) |
| Rescheduled | Date/time changed | Approved, Cancelled |
| Cancelled | Permanently cancelled | — (terminal) |
| Completed | Successfully executed | — (terminal) |

### Case States (6)
| State | Description | Transitions To |
|-------|-------------|----------------|
| Draft | Initial creation | Open |
| Open | Active, unassigned | InProgress, Parked |
| InProgress | Work underway | Closed, Parked |
| Parked | Temporarily suspended | Open, InProgress |
| Closed | Resolution complete | — (terminal*) |

*Re-opening requires VP justification per v1.3-B

### Protocol States (5)
| State | Description | Transitions To |
|-------|-------------|----------------|
| Expected | Appointment day, awaiting arrival | Arrived, NoShow |
| Arrived | Guest checked in | Assisted |
| Assisted | VP meeting in progress | Completed |
| NoShow | Guest did not arrive | — (terminal) |
| Completed | Protocol execution finished | — (terminal) |

---

## Print & Lamination Instructions

### Printing
1. **Paper:** Use 120-160gsm matte or satin paper
2. **Orientation:** Portrait
3. **Scaling:** 100% (do not fit to page)
4. **Color Mode:** Grayscale or Black & White
5. **Quality:** High/Best

### Lamination
1. **Pouch Size:** A4 (216mm × 303mm)
2. **Thickness:** 80-125 micron (recommended: 100 micron)
3. **Finish:** Matte (reduces glare) or Gloss (durability)
4. **Temperature:** Per laminator specifications

### Mounting
1. Use removable adhesive strips or poster tack
2. Mount at eye level near workstation
3. Avoid direct sunlight to prevent fading
4. Replace if edges curl or text fades

---

## Source Authority

All workflow diagrams extracted from:
- **Phase 1 — Workflow & State Diagrams** (authoritative)
- **v1.3-B Case Re-Opening Addendum** (supplemental)

---

## Document Control

| Field | Value |
|-------|-------|
| **Classification** | Internal Use Only |
| **Version** | 1.3 |
| **Created** | 2026-01-26 |
| **Authority** | Office of the Vice President |
| **Prepared By** | Devmart |

---

*End of Document*
