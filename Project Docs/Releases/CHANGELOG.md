# VP-Flow CHANGELOG

All notable changes to VP-Flow are documented in this file.

---

## [1.1-A] - 2026-01-22

### 🎉 Documents Module & Case Re-opening

v1.1-A introduces the Documents Module for file management and enables VP-controlled case re-opening for closed cases.

---

### Added

#### Case Re-opening
- **Re-open Closed Cases** — VP can re-open closed cases with justification
- **Reopened Status** — New case status with distinct badge styling
- **Re-close Capability** — VP can close reopened cases with new resolution
- **Reopen Edit Tracking** — Edits during reopened state are audit-logged

#### Documents Module
- **Standalone Library** — Document management page at `/documents`
- **Upload Documents** — Attach files to Cases, Appointments, or Guests
- **View Documents** — Open files in new browser tab
- **Download Documents** — Save files locally
- **Deactivate Documents** — VP-only soft-delete capability
- **Entity Filtering** — Filter documents by type (Case/Appointment/Guest)

#### Integration
- **Case Detail** — Documents section with upload/view/download
- **Appointment Detail** — Documents section (VP/Secretary only)
- **Guest Detail** — New "Documents" tab with full functionality
- **Sidebar Navigation** — Documents menu item added

#### Audit Events
- `case_reopened` — Logged when VP re-opens closed case
- `case_reopen_edit` — Logged when reopened case is modified
- `case_reclosed` — Logged when reopened case is closed again
- `document_viewed` — Logged when document is opened
- `document_downloaded` — Logged when document is downloaded
- `document_deactivated` — Logged when VP deactivates document

---

### Security

| Area | Implementation |
|------|----------------|
| Documents Storage | Private bucket with VP/Secretary RLS |
| Protocol Isolation | Strictly blocked from all document access |
| Closed Cases | Read-only (uploads blocked) |
| Reopened Cases | Full edit access restored |
| VP-only Actions | Re-open, deactivate, re-close |

---

### Known Limitations

| Limitation | Reason |
|------------|--------|
| No document editing | Deferred to future version |
| No document versioning | Deferred to future version |
| Single file upload | Multiple file upload deferred |

---

## [1.0.0] - 2026-01-22

### 🎉 Initial Production Release

VP-Flow v1.0 delivers a complete internal appointments and case management system for the Office of the Vice President of Suriname.

---

### Features

#### Core Modules
- **Dashboard** — KPI cards, recent activity widgets, role-based visibility
- **Guests** — Person/organization registry with contact management
- **Appointments** — Full CRUD, approval workflow, attendee management
- **Cases** — Priority-based tracking, status lifecycle, VP-controlled closure
- **Audit Logs** — Immutable event history (VP-only access)
- **Notifications** — Bell icon with unread count, mark-as-read functionality
- **User Management** — Role display for VP, Secretary, Protocol
- **Settings** — Profile management, theme toggle, system information

#### Authentication & Authorization
- Email/password authentication via Supabase Auth
- Role-based access control (VP, Secretary, Protocol)
- Session persistence with automatic token refresh
- Protected route guards with loading states

#### Security
- Row-Level Security (RLS) on all tables
- Protocol isolation — no case access, no client notes
- Closed case immutability (database trigger enforced)
- Append-only audit logs (no UPDATE/DELETE permitted)
- Security-definer functions for role validation

---

### Security Findings Disposition

| Finding | Severity | Disposition |
|---------|----------|-------------|
| `appointment_attendees` exposure | ERROR | ✅ FIXED — Protocol VIEW excludes email/phone |
| `clients` table exposure | ERROR | FALSE POSITIVE — RLS correctly restricts access |
| `cases` no DELETE policy | WARN | INTENTIONAL — Cases cannot be deleted |
| `reminders` no user policies | WARN | INTENTIONAL — System-managed only |
| `notifications` no INSERT/DELETE | WARN | INTENTIONAL — System-created, user-read only |
| `audit_events` no UPDATE/DELETE | WARN | INTENTIONAL — Append-only by design |
| `documents` no UPDATE policy | WARN | DEFERRED — Feature not in v1.0 |

---

### Post-Launch Hygiene

- Removed "Coming Soon" placeholder from Settings → Notification Preferences
- Removed "Pricing" and "Help" from profile dropdown
- Deleted 4 unused Darkone demo data files
- Standardized table styles across all modules
- Consolidated icon imports to wrapper component

---

### Known Limitations (By Design)

| Limitation | Reason |
|------------|--------|
| Cases cannot be deleted | Audit trail integrity |
| Closed cases are immutable | Legal traceability |
| Cases cannot be re-opened | Deferred to v1.1-A |
| No document attachments UI | Deferred to v1.1-A |
| No external user accounts | Internal system only |

---

### Documentation

Created comprehensive documentation pack:
- `/docs/backend.md` — Supabase tables, RLS, roles
- `/docs/architecture.md` — Project structure, routing, contexts
- `/RELEASE_NOTES_v1.0.md` — User-facing capabilities
- `/README.md` — Updated with v1.0 production status

---

## Future Versions

See `/Project Docs/v1.1/` for planned enhancements:
- **v1.1-A**: Documents Module, Case Re-opening
- **v1.1-B**: Notes System, Dashboard Widgets
- **v1.1-C**: PWA Support, Handwriting Input

---

**Maintainers:** Devmart  
**Client:** Office of the Vice President of Suriname