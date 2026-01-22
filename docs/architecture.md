# VP-Flow Architecture Documentation

**Version:** 1.0  
**Last Updated:** 2026-01-22

---

## Overview

VP-Flow is a React-based internal appointments and case management system for the Office of the Vice President of Suriname.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Bootstrap 5 + Tailwind CSS + SCSS |
| UI Template | Darkone Admin (1:1 compliance) |
| State | React Query (TanStack Query) |
| Backend | Supabase (PostgreSQL + Auth) |
| Icons | Iconify |
| Charts | ApexCharts |

---

## Project Structure

```
src/
├── app/                    # Route-based pages
│   ├── (admin)/           # Protected admin modules
│   │   ├── appointments/  # Appointment CRUD
│   │   ├── audit-logs/    # VP-only audit trail
│   │   ├── cases/         # Case management
│   │   ├── clients/       # Guest registry
│   │   ├── dashboards/    # Main dashboard
│   │   ├── notifications/ # Notification list
│   │   ├── settings/      # User settings
│   │   └── users/         # User management
│   └── (other)/           # Public routes
│       ├── auth/          # Authentication pages
│       └── error-pages/   # Error handling
├── assets/                # Static assets
│   ├── data/             # Menu configuration
│   ├── images/           # Logos and images
│   └── scss/             # Darkone styles
├── components/            # Reusable components
│   ├── layout/           # TopNav, Sidebar, Footer
│   └── ui/               # Shared UI components
├── context/               # React contexts
│   └── useAuthContext    # Authentication state
├── hooks/                 # Custom React hooks
├── integrations/          # External services
│   └── supabase/         # Supabase client + types
├── layouts/               # Page layout wrappers
│   ├── AdminLayout       # Protected layout
│   └── AuthLayout        # Public auth layout
├── routes/                # Router configuration
│   ├── index.tsx         # Route definitions
│   └── router.tsx        # Route guards
└── types/                 # TypeScript definitions
```

---

## Routing

### Route Configuration

Routes are defined in `src/routes/index.tsx` and rendered by `src/routes/router.tsx`.

### Protected Routes (Admin)

All routes under `/` (except `/auth/*`) require authentication:
- Unauthenticated users → redirect to `/auth/sign-in`
- Session hydration handled by loading guard

### Route List (v1.0)

| Path | Module | Role Access |
|------|--------|-------------|
| `/dashboards` | Dashboard | All |
| `/clients` | Guests | VP, Secretary |
| `/appointments` | Appointments | All |
| `/cases` | Cases | VP, Secretary (read-only) |
| `/audit-logs` | Audit Logs | VP only |
| `/notifications` | Notifications | All |
| `/users` | User Management | VP, Secretary |
| `/settings` | Settings | All |

---

## Authentication

### Flow
1. User submits credentials at `/auth/sign-in`
2. Supabase Auth validates and returns session
3. `AuthProvider` stores session + fetches user role from `user_roles`
4. Protected routes become accessible

### Session Persistence
- Sessions persist via Supabase's `autoRefreshToken`
- Router waits for `isLoading: false` before routing decisions
- Hard refresh triggers session rehydration

### Role Resolution
```tsx
// useAuthContext provides:
{
  user: User | null,
  session: Session | null,
  role: 'vp' | 'secretary' | 'protocol' | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  signOut: () => Promise<void>
}
```

---

## State Management

### React Query
- Server state cached and managed by TanStack Query
- Stale time configured per query type
- Automatic refetching on window focus

### Context Providers
- `AuthProvider`: Authentication state
- `ThemeContext`: Dark/light mode preference

---

## UI Framework Compliance

VP-Flow maintains **1:1 Darkone Admin compliance**:

| Requirement | Status |
|-------------|--------|
| Bootstrap 5 components | ✅ Required |
| Iconify icons only | ✅ Enforced |
| SCSS structure preserved | ✅ Maintained |
| No custom UI systems | ✅ Compliant |
| Layout components unchanged | ✅ Frozen |

---

## Performance Considerations

- **Lazy Loading**: All admin pages use `React.lazy()` for code splitting
- **Query Caching**: React Query prevents redundant API calls
- **Session Guard**: Prevents flash of login page on refresh

---

**Document Status:** v1.0 FROZEN
