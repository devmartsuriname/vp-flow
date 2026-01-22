# Changelog

All notable changes to VP-Flow are documented in this file.

---

## [1.0.0] - 2026-01-22

### 🎉 Initial Release

VP-Flow v1.0 is the first production release of the internal appointments and case management system for the Office of the Vice President of Suriname.

### Features

#### Core Modules
- **Dashboard**: KPI cards, recent activity widgets, role-based visibility
- **Guests**: Full CRUD for persons and organizations (formerly "Clients")
- **Appointments**: Create, approve, reject, reschedule appointments with attendees
- **Cases**: VP-created case management with priority and status lifecycle
- **Audit Logs**: Immutable event trail with VP-only access
- **Notifications**: Real-time alerts with unread counts and mark-as-read
- **User Management**: Read-only user list with role badges
- **Settings**: Profile info, theme preferences, system information

#### Authentication
- Supabase Auth integration with email/password
- Role-based access control (VP, Secretary, Protocol)
- Session persistence with auto-refresh
- Protected route guards

#### Security
- Row-Level Security (RLS) on all tables
- Protocol isolation from cases and sensitive data
- Closed case immutability enforced by database trigger
- Append-only audit logs
- Security-definer functions to prevent RLS recursion

### Security Remediation

| Finding | Disposition |
|---------|-------------|
| `appointments_public_exposure` | FALSE POSITIVE - RLS restricts access |
| `cases_missing_delete_policy` | INTENTIONAL - Maintains audit trail |
| `appointment_attendees_email_phone_exposure` | FALSE POSITIVE - Masked for Protocol |

### Hygiene

- Removed all "Coming Soon" placeholders
- Removed demo data and unused menu items
- Removed Pricing/Help links from profile menu
- Removed unused Darkone demo files
- Unified "Client" → "Guest" terminology throughout UI

### Polish

- Responsive design verified (Desktop/Tablet/Mobile)
- Consistent table patterns with `table-responsive`
- Theme toggle (light/dark mode)
- Module-by-module smoke testing passed

---

## Future Versions

See `/Project Docs/v1.1/` for planned enhancements:
- v1.1-A: Documents Module, Case Re-opening
- v1.1-B: Notes System, Additional Dashboard Widgets
- v1.1-C: PWA Support, Handwriting Input

---

**Maintained by:** Devmart  
**Client:** Office of the Vice President of Suriname
