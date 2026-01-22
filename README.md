# VP-Flow

> **Internal Appointments and Case Management System for the Office of the Vice President of Suriname**

| Status | Version | Last Updated |
|--------|---------|--------------|
| ✅ Production | 1.0.0 | 2026-01-22 |

---

## Overview

VP-Flow is a centralized system for managing VP appointments, cases, and institutional workflows. Built on the Darkone Admin template with Supabase backend.

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| UI | Bootstrap 5 + Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth) |
| Template | Darkone Admin (1:1 compliance) |

---

## Project Structure

```
src/
├── app/(admin)/        # Protected admin modules
│   ├── appointments/   # Appointment management
│   ├── audit-logs/     # VP-only audit trail
│   ├── cases/          # Case management
│   ├── clients/        # Guest registry
│   ├── dashboards/     # Main dashboard
│   ├── notifications/  # Notification center
│   ├── settings/       # User settings
│   └── users/          # User management
├── app/(other)/        # Auth & error pages
├── components/         # Reusable components
├── context/            # React contexts
├── hooks/              # Custom hooks
├── integrations/       # Supabase client
├── layouts/            # Page layouts
└── routes/             # Router config
```

---

## Modules (v1.0)

| Module | Description | Access |
|--------|-------------|--------|
| Dashboard | KPI cards, activity widgets | All roles |
| Guests | Person/organization registry | VP, Secretary |
| Appointments | Scheduling & approval workflow | All roles |
| Cases | Priority-based case tracking | VP (full), Secretary (read) |
| Audit Logs | Immutable event history | VP only |
| Notifications | Real-time alerts | All roles |
| User Management | Role display | VP, Secretary |
| Settings | Profile & theme | All roles |

---

## Roles

| Role | Description |
|------|-------------|
| VP | Full authority - all modules, all operations |
| Secretary | Support - appointments, guests; read-only cases |
| Protocol | Execution - approved appointments only |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
| `SUPABASE_DB_URL` | Database connection URL |

---

## Quick Start

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Documentation

| Document | Location |
|----------|----------|
| Backend | `/docs/backend.md` |
| Architecture | `/docs/architecture.md` |
| Changelog | `/CHANGELOG.md` |
| Release Notes | `/RELEASE_NOTES_v1.0.md` |
| Project Docs | `/Project Docs/` |

---

## Security

- Row-Level Security (RLS) on all tables
- Role-based access control
- Closed case immutability
- Append-only audit logs
- Protocol isolation from sensitive data

---

## License

Proprietary - Office of the Vice President of Suriname

**Delivered by:** Devmart
