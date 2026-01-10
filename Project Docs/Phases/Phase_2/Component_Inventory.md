# VP-Flow Component Inventory

**Phase:** 2 - Implementation Planning  
**Document Type:** UI Component Mapping  
**Status:** DOCUMENTATION ONLY - NOT EXECUTED  
**Source:** Darkone Admin Template, Phase_1_Architecture_Data_Model.md

---

## 1. Overview

This document maps each VP-Flow feature to available Darkone Admin components. Only components that exist in the Darkone Admin template are referenced.

**CRITICAL:** No custom components, custom Bootstrap, or custom icons are permitted. All UI must use existing Darkone Admin components 1:1.

---

## 2. Darkone Admin Component Inventory

### 2.1 Layout Components

| Component | Path | Description |
|-----------|------|-------------|
| AdminLayout | /src/app/(admin)/layout.tsx | Main admin layout wrapper |
| AuthLayout | /src/app/(auth)/layout.tsx | Authentication pages layout |
| TopNavigationBar | /src/app/(admin)/layout.tsx | Top header navigation |
| VerticalNavigationBar | /src/components/layout/ | Sidebar navigation menu |
| Footer | /src/components/layout/ | Page footer |
| PageTitle | /src/components/ | Page header with breadcrumbs |

### 2.2 Base UI Components

| Component | Path | VP-Flow Usage |
|-----------|------|---------------|
| Card | /src/app/(admin)/base-ui/cards/ | Client cards, appointment cards, case cards |
| Modal / Dialog | @radix-ui/react-dialog | Confirmations, detail views, forms |
| Button | /src/components/ui/button | All action buttons |
| Alert | /src/app/(admin)/base-ui/alerts/ | Notifications, warnings, errors |
| Badge | /src/app/(admin)/base-ui/badge/ | Status indicators, priority tags |
| Tabs | @radix-ui/react-tabs | Detail page sections |
| Dropdown | @radix-ui/react-dropdown-menu | Action menus |
| Pagination | /src/app/(admin)/base-ui/paginations/ | List pagination |
| Progress | @radix-ui/react-progress | Case status progress |
| Toast | sonner / react-toastify | Success/error feedback |
| Spinner | /src/app/(admin)/base-ui/spinners/ | Loading states |
| Avatar | @radix-ui/react-avatar | User display |
| Breadcrumb | /src/app/(admin)/base-ui/breadcrumb/ | Navigation breadcrumbs |
| Accordion | @radix-ui/react-accordion | Collapsible sections |
| Tooltip | @radix-ui/react-tooltip | Hover information |
| Separator | @radix-ui/react-separator | Visual dividers |
| ScrollArea | @radix-ui/react-scroll-area | Scrollable containers |

### 2.3 Form Components

| Component | Path | VP-Flow Usage |
|-----------|------|---------------|
| Input | /src/components/ui/input | Text inputs |
| Textarea | /src/components/ui/ | Multi-line text |
| Select | @radix-ui/react-select | Dropdown selections |
| Checkbox | @radix-ui/react-checkbox | Boolean toggles |
| RadioGroup | @radix-ui/react-radio-group | Single selection groups |
| Switch | @radix-ui/react-switch | Toggle switches |
| Label | @radix-ui/react-label | Form labels |
| Form Validation | react-hook-form + zod | Input validation |
| Flatpickr | react-flatpickr | Date/time selection |
| React Quill | react-quill | Rich text editing (notes) |
| React Select | react-select | Searchable dropdowns |
| Dropzone | react-dropzone | File uploads |

### 2.4 Table Components

| Component | Path | VP-Flow Usage |
|-----------|------|---------------|
| Basic Table | /src/app/(admin)/tables/basic/ | Simple data lists |
| GridJS | gridjs-react | Advanced filtering, sorting, search |

### 2.5 Chart Components

| Component | Path | VP-Flow Usage |
|-----------|------|---------------|
| ApexCharts | react-apexcharts | Dashboard visualizations |
| Recharts | recharts | Alternative chart library |

### 2.6 Navigation Components

| Component | Path | VP-Flow Usage |
|-----------|------|---------------|
| NavigationMenu | @radix-ui/react-navigation-menu | Main navigation |
| Menubar | @radix-ui/react-menubar | Menu bars |
| ContextMenu | @radix-ui/react-context-menu | Right-click menus |

---

## 3. Module-to-Component Mapping

### 3.1 Authentication Module

| Feature | Components | Notes |
|---------|------------|-------|
| Login Page | AuthLayout, Card, Input, Button, Alert | Email/password login |
| Session Display | Avatar, Dropdown, Badge | User info in header |
| Logout | Button, Dialog | Confirmation modal |
| Role-based Routing | React Router protected routes | Redirect based on role |

**Page Structure:**
```
AuthLayout
└── Card
    ├── Logo/Title
    ├── Form
    │   ├── Input (email)
    │   ├── Input (password)
    │   └── Button (submit)
    └── Alert (errors)
```

---

### 3.2 Client Management Module

| Feature | Components | Notes |
|---------|------------|-------|
| Client List | AdminLayout, GridJS, Badge, Button | Searchable, sortable |
| Client Card | Card, Avatar, Badge | Summary view |
| Client Detail | Tabs, Card, Badge | Tabbed detail view |
| Client Form | Dialog, Input, Select, Textarea, Button | Create/edit modal |
| Client History | Accordion, Card, Badge | Timeline of appointments/cases |
| Client Search | Input, GridJS | Full-text search |

**List Page Structure:**
```
AdminLayout
├── PageTitle + Breadcrumb
├── Card (filters)
│   ├── Input (search)
│   ├── Select (type filter)
│   └── Button (reset)
├── GridJS (client table)
│   ├── Columns: Name, Type, Contact, Appointments, Actions
│   └── Pagination
└── Dialog (create/edit form)
```

**Detail Page Structure:**
```
AdminLayout
├── PageTitle + Breadcrumb
├── Card (client header)
│   ├── Avatar
│   ├── Display name, type
│   ├── Contact info
│   └── Action buttons
└── Tabs
    ├── Tab: Overview (Card with notes)
    ├── Tab: Appointments (GridJS)
    └── Tab: Cases (GridJS)
```

---

### 3.3 Appointment Management Module

| Feature | Components | Notes |
|---------|------------|-------|
| Appointment List | AdminLayout, GridJS, Badge, Button | Filtered by status |
| Appointment Card | Card, Badge, Button | Status-colored |
| Appointment Detail | Tabs, Card, Badge | Full appointment view |
| Appointment Form | Dialog, Input, Flatpickr, Select, React Quill, Button | Create/edit modal |
| Approval Workflow | Dialog, Button, Alert | VP approval actions |
| Status Transitions | Badge, Button, Dialog | Status change confirmations |
| Calendar View | FullCalendar | Optional calendar display |

**List Page Structure:**
```
AdminLayout
├── PageTitle + Breadcrumb
├── Card (filters)
│   ├── Input (search)
│   ├── Select (status filter)
│   ├── Flatpickr (date range)
│   └── Button (reset)
├── GridJS (appointment table)
│   ├── Columns: Title, Client, Date/Time, Status, Actions
│   └── Pagination
└── Dialog (create/edit form)
    ├── Input (title)
    ├── React Select (client - searchable)
    ├── Input (location)
    ├── Flatpickr (start date/time)
    ├── Flatpickr (end date/time)
    ├── React Quill (notes)
    └── Button (save)
```

**Detail Page Structure:**
```
AdminLayout
├── PageTitle + Breadcrumb
├── Card (appointment header)
│   ├── Title, Status Badge
│   ├── Client link
│   ├── Date/time, Location
│   └── Action buttons (Approve/Reject/Edit)
├── Tabs
│   ├── Tab: Details (Card with notes)
│   ├── Tab: Attendees (Table)
│   └── Tab: Cases (GridJS - if any)
└── Dialog (approval confirmation)
```

---

### 3.4 Case Management Module

| Feature | Components | Notes |
|---------|------------|-------|
| Case List | AdminLayout, GridJS, Badge, Progress, Button | Priority/status sorted |
| Case Card | Card, Badge, Progress | Priority-colored |
| Case Detail | Tabs, Card, Badge, Progress | Full case view |
| Case Form | Dialog, Input, Select, Flatpickr, React Quill, Button | Create modal (VP only) |
| Status Workflow | Badge, Button, Dialog | Status transitions |
| Priority Management | Badge, Select | Priority changes |
| Deadline Tracking | Badge, Alert | Deadline warnings |
| Case Closure | Dialog, Button, Alert | Closure confirmation |

**Dashboard Structure (VP):**
```
AdminLayout
├── PageTitle + Breadcrumb
├── Card (summary stats)
│   ├── Total cases by status (ApexCharts)
│   ├── Priority distribution (ApexCharts)
│   └── Upcoming deadlines count
├── Card (filters)
│   ├── Select (status)
│   ├── Select (priority)
│   └── Button (reset)
└── GridJS (case table)
    ├── Columns: Title, Client, Priority, Status, Deadline, Actions
    └── Pagination
```

**Detail Page Structure:**
```
AdminLayout
├── PageTitle + Breadcrumb
├── Card (case header)
│   ├── Title
│   ├── Priority Badge
│   ├── Status Badge + Progress
│   ├── Deadline
│   └── Action buttons (VP only)
├── Tabs
│   ├── Tab: Details
│   │   ├── Source appointment link
│   │   ├── Client link
│   │   └── Notes (React Quill readonly)
│   ├── Tab: Documents (Table + Dropzone)
│   └── Tab: History (Accordion timeline)
└── Dialog (close case confirmation)
```

---

### 3.5 Protocol Dashboard Module

| Feature | Components | Notes |
|---------|------------|-------|
| Today's Appointments | Card, Badge, Button | Simplified view |
| Appointment Card | Card, Badge | Minimal info (no notes) |
| Execution Tracking | Select, Button | Status updates |
| Arrival Logging | Button, Dialog | Quick actions |

**Dashboard Structure:**
```
AdminLayout
├── PageTitle (Today's Schedule)
├── Card (date selector)
│   └── Flatpickr (view different dates)
├── Cards (appointments)
│   ├── Card per appointment
│   │   ├── Title, Time, Location
│   │   ├── Attendees list
│   │   ├── Status Badge
│   │   └── Action buttons
│   └── (No notes, no client details - RLS enforced)
└── Dialog (status update)
    ├── Select (status)
    ├── Textarea (notes)
    └── Button (save)
```

---

### 3.6 Notification Module

| Feature | Components | Notes |
|---------|------------|-------|
| Notification Bell | Button, Badge, Dropdown | Header icon |
| Notification List | Dropdown, ScrollArea | Notification items |
| Notification Item | Card, Badge | Individual notification |
| Toast Notifications | sonner / react-toastify | Real-time feedback |

**Header Component:**
```
TopNavigationBar
└── Dropdown (notification bell)
    ├── Badge (unread count)
    └── ScrollArea
        ├── Notification items
        │   ├── Icon, Message
        │   ├── Time ago
        │   └── Read/unread indicator
        └── Link (view all)
```

---

### 3.7 Audit Logging Module (VP Only)

| Feature | Components | Notes |
|---------|------------|-------|
| Audit Log List | AdminLayout, GridJS | Filterable history |
| Log Entry Detail | Dialog, Card | Full event details |
| Entity History | Accordion | Per-entity audit trail |

**Audit Log Page Structure:**
```
AdminLayout
├── PageTitle + Breadcrumb
├── Card (filters)
│   ├── Select (entity type)
│   ├── Select (action type)
│   ├── Flatpickr (date range)
│   └── Button (reset)
├── GridJS (audit table)
│   ├── Columns: Timestamp, Actor, Entity, Action, Details
│   └── Pagination
└── Dialog (entry detail)
    ├── Before state (JSON display)
    └── After state (JSON display)
```

---

## 4. Shared Component Patterns

### 4.1 Page Layout Pattern

```
AdminLayout
├── TopNavigationBar
│   ├── Logo
│   ├── Navigation items
│   ├── Notification bell
│   └── User dropdown
├── VerticalNavigationBar (sidebar)
│   └── Menu items (role-based)
├── Main content area
│   ├── PageTitle + Breadcrumb
│   └── Page-specific content
└── Footer
```

### 4.2 List Page Pattern

```
Card (filters)
├── Search input
├── Filter selects
└── Reset button

GridJS (data table)
├── Column headers (sortable)
├── Data rows
│   └── Action buttons per row
└── Pagination

Dialog (create/edit form)
├── Form fields
├── Validation errors
└── Submit/cancel buttons
```

### 4.3 Detail Page Pattern

```
Card (entity header)
├── Primary info
├── Status/priority badges
└── Action buttons

Tabs
├── Tab 1: Primary details
├── Tab 2: Related entities
└── Tab 3: History/timeline

Dialog (confirmations)
├── Confirmation message
└── Action buttons
```

### 4.4 Status Badge Color Mapping

| Status/Priority | Color Token | Usage |
|-----------------|-------------|-------|
| Draft | `muted` / gray | Pending initial action |
| Pending | `warning` / yellow | Awaiting approval |
| Approved | `success` / green | Approved/active |
| Rejected | `destructive` / red | Rejected/cancelled |
| High Priority | `destructive` / red | Urgent items |
| Medium Priority | `warning` / yellow | Normal priority |
| Low Priority | `muted` / gray | Low priority |
| Closed | `secondary` / blue | Completed items |
| Overdue | `destructive` / red | Past deadline |

---

## 5. Navigation Structure

### 5.1 VP Navigation

```
Dashboard (home)
├── Clients
│   ├── All Clients
│   └── Add Client
├── Appointments
│   ├── All Appointments
│   ├── Pending Approval
│   └── Add Appointment
├── Cases
│   ├── All Cases
│   ├── High Priority
│   └── Dashboard
├── Audit Log
└── Settings (future)
```

### 5.2 Secretary Navigation

```
Dashboard (home)
├── Clients
│   ├── All Clients
│   └── Add Client
├── Appointments
│   ├── All Appointments
│   └── Add Appointment
└── Cases (read-only)
    └── All Cases
```

### 5.3 Protocol Navigation

```
Today's Schedule (home)
├── Upcoming Appointments
└── Completed Today
```

---

## 6. Component Restrictions

### 6.1 Forbidden Customizations

| Category | Restriction |
|----------|-------------|
| Bootstrap | NO custom Bootstrap classes |
| Icons | NO custom icon sets - use Iconify/Lucide only |
| Colors | NO custom color definitions - use design tokens |
| Fonts | NO custom fonts - use Darkone defaults |
| Layouts | NO custom layout structures |
| Components | NO components not in Darkone inventory |

### 6.2 Required Patterns

| Pattern | Requirement |
|---------|-------------|
| Forms | Must use react-hook-form + zod |
| Tables | Must use GridJS for advanced features |
| Modals | Must use Radix Dialog |
| Notifications | Must use sonner/react-toastify |
| Date/Time | Must use Flatpickr |
| Rich Text | Must use React Quill |

---

## 7. Document Status

| Item | Status |
|------|--------|
| Layout components mapped | DOCUMENTED |
| Base UI components mapped | DOCUMENTED |
| Form components mapped | DOCUMENTED |
| Table components mapped | DOCUMENTED |
| Module-to-component mapping | DOCUMENTED |
| Navigation structure | DOCUMENTED |
| Component restrictions | DOCUMENTED |
| UI Implementation | NOT PERFORMED |

---

**Document Classification:** PHASE 2 - IMPLEMENTATION PLANNING  
**Execution Status:** DOCUMENTATION ONLY - AWAITING PHASE 3 AUTHORIZATION
