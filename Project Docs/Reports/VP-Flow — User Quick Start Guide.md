# VP-Flow User Quick Start Guide
**Version:** 1.3  
**Date:** 2026-01-26  
**Classification:** Internal Use Only  
**Authority:** Office of the Vice President of Suriname

---

## Introduction

This guide provides step-by-step instructions for common daily tasks in VP-Flow. Procedures are organized by role to help you quickly find relevant information.

### Role Overview

| Role | Primary Responsibilities |
|------|-------------------------|
| **VP** | Full authority: approve appointments, create/close cases, manage all records |
| **Secretary** | Support role: create guests, create/submit appointments, view cases (read-only) |
| **Protocol** | Execution role: view approved appointments, track day-of arrivals |

### Navigation Basics

- **Sidebar Menu:** Access all modules (Dashboard, Appointments, Cases, Guests, etc.)
- **Header:** Notifications bell, user profile, logout
- **Breadcrumbs:** Navigate back through page hierarchy

---

## Secretary Tasks

### Task 2.1 — Registering a New Guest

1. Navigate: **Sidebar > Guests > Create Guest**
2. Select **Guest Type**:
   - *Person* — Individual visitor
   - *Organization* — Company, institution, or group
3. Complete name fields:
   - Person: **First Name**, **Last Name** (both required)
   - Organization: **Organization Name** (required), **Contact Person** (optional)
4. Add contact information:
   - **Email** (optional)
   - **Phone** (optional)
5. Complete address:
   - **Address Line 1** (street address)
   - **Address Line 2** (optional)
   - **City**
   - **District** (dropdown selection)
6. Add **Notes** (internal, optional)
7. Click **Create Guest** button
8. ✓ Confirmation: Redirects to guest detail page

---

### Task 2.2 — Creating an Appointment Request

1. Navigate: **Sidebar > Appointments > Create Appointment**
2. Select **Guest** from dropdown (search by typing name)
3. Complete required fields:
   - **Subject** — Brief description of appointment purpose
   - **Scheduled Date** — Click calendar, select future date
   - **Scheduled Time** — Select from time picker
   - **Duration** — Choose: 15 / 30 / 45 / 60 / 90 / 120 minutes
4. Optional fields:
   - **Location** — Where meeting will occur
   - **Description** — Detailed agenda or notes
5. Set **Visibility**:
   - *VP & Secretary* (default) — Both roles can view
   - *VP Only* — Restricted to VP access
6. Click **Create Appointment** button
7. ✓ Status: Created as *Draft*

---

### Task 2.3 — Submitting Appointment for VP Approval

1. Navigate: **Appointments** > Click appointment row to open
2. Verify all details are complete and accurate
3. Click **Submit for Approval** button
4. ✓ Status changes: *Draft* → *Pending VP*
5. VP receives notification of pending request

---

### Task 2.4 — Viewing Cases (Read-Only)

1. Navigate: **Sidebar > Cases**
2. View case list with status, priority, deadline
3. Click case row to view details
4. Note: Secretary cannot create, edit, or close cases

---

## VP Tasks

### Task 3.1 — Reviewing Pending Appointments

1. Navigate: **Dashboard** (shows pending items) or **Appointments**
2. Look for appointments with status *Pending VP*
3. Click appointment row to view full details
4. Review: Guest information, Date/Time, Subject, Description

---

### Task 3.2 — Approving an Appointment

1. Open appointment detail page (status must be *Pending VP*)
2. Review all details carefully
3. Click **Approve** button
4. Confirmation modal appears
5. Click **Confirm Approval**
6. ✓ Status changes: *Pending VP* → *Approved*
7. Protocol role can now see this appointment

---

### Task 3.3 — Rejecting an Appointment

1. Open appointment detail page
2. Click **Reject** button
3. Rejection modal appears
4. Enter **Rejection Reason** (required, minimum 10 characters)
5. Click **Confirm Rejection**
6. ✓ Status changes: *Pending VP* → *Rejected*
7. Secretary notified of rejection with reason

---

### Task 3.4 — Creating a Case

1. Navigate: **Sidebar > Cases > Create Case**
2. Complete required fields:
   - **Title** — Descriptive case name
3. Complete optional fields:
   - **Description** — Detailed case information
   - **Priority** — Select: Low / Medium / High
   - **Deadline** — Future date for completion target
   - **Linked Appointment** — Select from completed appointments
4. Add **VP Notes** (private, visible only to VP)
5. Click **Create Case** button
6. ✓ Status: Created as *Draft*

---

### Task 3.5 — Managing Case Lifecycle

**Opening a Case:**
1. Open case detail page (status: *Draft*)
2. Click **Open Case** button
3. ✓ Status changes: *Draft* → *Open*

**Starting Work:**
1. Open case detail page (status: *Open*)
2. Click **Start Work** button
3. ✓ Status changes: *Open* → *In Progress*

**Parking a Case (Temporary Hold):**
1. Open case detail page (status: *In Progress*)
2. Click **Park** button
3. ✓ Status changes: *In Progress* → *Parked*

**Resuming Work:**
1. Open case detail page (status: *Parked*)
2. Click **Resume** button
3. ✓ Status changes: *Parked* → *In Progress*

**Closing a Case:**
1. Open case detail page (status: *In Progress*)
2. Click **Close Case** button
3. Modal appears requiring resolution summary
4. Enter **Resolution Summary** (required)
5. Click **Confirm Close**
6. ✓ Status changes: *In Progress* → *Closed*
7. **IMPORTANT:** Closed cases are FINAL

---

### Task 3.6 — Re-opening a Closed Case (VP Only)

1. Open closed case detail page
2. Click **Re-open Case** button
3. Modal appears requiring justification
4. Enter **Re-open Justification** (required, minimum 10 characters)
5. Click **Confirm Re-open**
6. ✓ Status changes: *Closed* → *Open*
7. Re-open history tracked in case audit log

---

### Task 3.7 — Adding VP Notes

VP Notes are private annotations visible only to the VP role.

1. Available on: Appointment detail, Case detail
2. Locate **VP Notes** section (bottom of form)
3. Enter private notes in text area
4. Click **Update** or **Save** to persist
5. Notes are encrypted from Secretary and Protocol roles

---

## Protocol Tasks

### Task 4.1 — Viewing Today's Approved Appointments

1. Navigate: **Dashboard** or **Appointments**
2. Only *Approved* appointments are visible to Protocol
3. View appointment details: Guest, Time, Location
4. Note: Protocol cannot see Draft, Pending, or Rejected appointments

---

### Task 4.2 — Day-of Execution Tracking

1. Monitor expected arrivals on scheduled date
2. Update arrival status as guests arrive:
   - *Expected* → Guest is scheduled
   - *Arrived* → Guest has checked in
   - *Assisted* → Meeting in progress
   - *Completed* → Meeting finished
   - *No Show* → Guest did not appear
3. Protocol cannot access case data or sensitive notes

---

## Common Tasks (All Roles)

### Task 5.1 — Checking Notifications

1. Click **Bell Icon** in page header
2. Dropdown shows unread notifications
3. Click notification to navigate to source
4. Notifications mark as read automatically

---

### Task 5.2 — Searching Records

1. Navigate to list page (Appointments, Cases, Guests)
2. Use **Search Bar** at top of list
3. Enter: guest name, appointment subject, or case title
4. Results filter in real-time as you type
5. Clear search to reset view

---

### Task 5.3 — Using Filters

1. Available on: Appointments list, Cases list
2. Click **Filter** dropdown or icons
3. Filter options:
   - **Status** — Filter by workflow state
   - **Priority** — Filter by urgency level (Cases)
   - **Date Range** — Filter by scheduled/created date
4. Multiple filters can be combined
5. Click **Clear** to reset all filters

---

### Task 5.4 — Viewing Audit History

1. Navigate to detail page (Appointment, Case, Guest)
2. Scroll to **History** or **Timeline** section
3. View chronological list of changes
4. Each entry shows: Action, User, Timestamp

---

## Quick Reference Tables

### Status Flow Summary

| Object | Start | Submit | Approve | Work | Complete |
|--------|-------|--------|---------|------|----------|
| Appointment | Draft | Pending VP | Approved | — | Completed |
| Case | Draft | Open | — | In Progress | Closed |

### Role Permissions Matrix

| Action | VP | Secretary | Protocol |
|--------|:--:|:---------:|:--------:|
| Create Guest | ✓ | ✓ | ✗ |
| Edit Guest | ✓ | ✓ | ✗ |
| Create Appointment | ✓ | ✓ | ✗ |
| Submit Appointment | ✓ | ✓ | ✗ |
| Approve/Reject Appointment | ✓ | ✗ | ✗ |
| View All Appointments | ✓ | ✓ | ✗ |
| View Approved Appointments | ✓ | ✓ | ✓ |
| Create Case | ✓ | ✗ | ✗ |
| Edit Case | ✓ | ✗ | ✗ |
| Close Case | ✓ | ✗ | ✗ |
| Re-open Case | ✓ | ✗ | ✗ |
| View Cases | ✓ | Read-only | ✗ |
| Manage Documents | ✓ | ✗ | ✗ |
| View Audit Logs | ✓ | ✗ | ✗ |

### Priority Levels

| Level | Color | Use When |
|-------|-------|----------|
| Low | Green | Routine matters, flexible deadline |
| Medium | Yellow | Standard priority, normal processing |
| High | Red | Urgent matters, requires immediate attention |

---

## Troubleshooting

### Common Issues

**"I can't find a guest"**
- Check spelling (partial name search is supported)
- Try searching by organization name for organizations
- Verify guest was created successfully

**"Appointment won't submit"**
- Ensure all required fields are complete (Guest, Subject, Date, Time, Duration)
- Check that scheduled date is in the future
- Verify you have Secretary or VP role

**"Case won't close"**
- Resolution summary is required — enter closing notes
- Case must be in *In Progress* status to close
- Only VP role can close cases

**"Button is disabled"**
- Action may not be allowed for your role
- Object may be in wrong status for that action
- Check role permissions matrix above

**"I can't see certain appointments"**
- Protocol role only sees *Approved* appointments
- Some appointments may be marked *VP Only* visibility
- Check with VP if you need access

### Getting Help

- **Technical Issues:** Contact system administrator
- **Process Questions:** Refer to Workflow Desk Reference Poster
- **Role Changes:** Request through VP authorization

---

## Document Control

| Property | Value |
|----------|-------|
| Document | VP-Flow User Quick Start Guide |
| Version | 1.3 |
| Created | 2026-01-26 |
| Classification | Internal Use Only |
| Authority | Office of the Vice President |
| Reference | VP-Flow Workflow Desk Reference Poster |

---

*End of Quick Start Guide*
