# Phase 4 — Darkone Component Mapping

**Status:** 🟡 PREPARATION (Implementation BLOCKED)  
**Date:** 2026-01-10  
**Governance:** STRICT — Darkone Admin 1:1 Only  

---

## Source References (Mandatory)

| Document | Location | Purpose |
|----------|----------|---------|
| DARKONE_ASSET_MAP.md | `/DARKONE_ASSET_MAP.md` | Primary component/asset source |
| README.md | `/README.md` | Guardian rules, conventions |
| CLONE_WORKFLOW.md | `/docs-standard/CLONE_WORKFLOW.md` | Layout constraints, SCSS rules |
| NEW_PROJECT_KICKOFF.md | `/docs-standard/NEW_PROJECT_KICKOFF.md` | Verification checklist |

---

## 1. Core Layout Components (FIXED — DO NOT MODIFY)

**Source:** CLONE_WORKFLOW.md §Layout Components

| Component | File Path | Status | Notes |
|-----------|-----------|--------|-------|
| AdminLayout | `src/layouts/AdminLayout.tsx` | FIXED | Main admin wrapper |
| AuthLayout | `src/layouts/AuthLayout.tsx` | FIXED | Authentication pages |
| Topbar | `src/layouts/Topbar.tsx` | FIXED | Header navigation |
| LeftSidebar | `src/layouts/LeftSidebar.tsx` | FIXED | Navigation menu |
| Footer | `src/layouts/Footer.tsx` | FIXED | Page footer |

**Constraint:** These layout components MUST NOT be modified per docs-standard/CLONE_WORKFLOW.md.

---

## 2. Reusable UI Components

**Source:** DARKONE_ASSET_MAP.md §2.1 Images, §2.4 Charts

| Purpose | Component | File Path | Classification |
|---------|-----------|-----------|----------------|
| Icon System | IconifyIcon | `src/components/wrapper/IconifyIcon.tsx` | CORE |
| Page Header | PageTitle | `src/components/PageTitle.tsx` | CORE |
| Card Container | ComponentContainerCard | `src/components/ComponentContainerCard.tsx` | CORE |
| Date Picker | CustomFlatpickr | `src/components/CustomFlatpickr.tsx` | CORE |
| Loading State | Spinner | `src/components/Spinner.tsx` | CORE |
| Loading State | Preloader | `src/components/Preloader.tsx` | CORE |
| Placeholder | ComingSoon | `src/components/ComingSoon.tsx` | PLACEHOLDER |

---

## 3. Dashboard Components

**Source:** DARKONE_ASSET_MAP.md §2.4 Charts

| Purpose | Component | File Path | Classification |
|---------|-----------|-----------|----------------|
| Stat Cards | Cards / StatCard pattern | `src/app/(admin)/dashboards/components/Cards.tsx` | CORE |
| Area Charts | Chart | `src/app/(admin)/dashboards/components/Chart.tsx` | CORE |
| Sales Charts | SaleChart | `src/app/(admin)/dashboards/components/SaleChart.tsx` | CORE |
| Country Map | WorldVectorMap | `src/components/VectorMap/WorldMap.tsx` | CORE |

---

## 4. Bootstrap Components (Native — No Customization)

**Source:** README.md §Guardian Rules — "No custom Bootstrap"

| Purpose | Bootstrap Component | Import Source |
|---------|---------------------|---------------|
| Cards | Card, CardBody, CardHeader | `react-bootstrap` |
| Tables | Table | `react-bootstrap` |
| Forms | Form, Form.Control, Form.Select, Form.Label | `react-bootstrap` |
| Buttons | Button | `react-bootstrap` |
| Modals | Modal | `react-bootstrap` |
| Badges | Badge | `react-bootstrap` |
| Dropdowns | Dropdown | `react-bootstrap` |
| Pagination | Pagination | `react-bootstrap` |
| Tabs | Tab, Tabs | `react-bootstrap` |
| Alerts | Alert | `react-bootstrap` |
| Spinners | Spinner | `react-bootstrap` |

**Constraint:** Use Bootstrap components AS-IS. No wrapper components, no custom styling overrides.

---

## 5. Icon System

**Source:** DARKONE_ASSET_MAP.md §2.2 Icons

| Icon Set | Prefix | Primary Usage | Example |
|----------|--------|---------------|---------|
| Boxicons | `bx:*` | UI elements, buttons | `bx:calendar` |
| Solar Icons | `solar:*` | Dashboard cards, widgets | `solar:user-bold` |
| Mingcute | `mingcute:*` | Menu icons, navigation | `mingcute:home-line` |

**Wrapper:** `src/components/wrapper/IconifyIcon.tsx` — MUST USE for all icons

**Usage Pattern:**
```tsx
import IconifyIcon from '@/components/wrapper/IconifyIcon';
<IconifyIcon icon="bx:calendar" />
```

---

## 6. SCSS Structure (DO NOT MODIFY)

**Source:** CLONE_WORKFLOW.md §SCSS Structure

| Path | Purpose | Status |
|------|---------|--------|
| `src/assets/scss/structure/` | Core layout styles | FIXED |
| `src/assets/scss/components/` | Component styling | FIXED |
| `src/assets/scss/config/` | Theme configuration | FIXED |
| `src/assets/scss/plugins/` | Plugin styles | USE AS-IS |

**Constraint:** No new SCSS files. Use existing structure only.

---

## 7. Module-to-Component Mapping

### 7.1 Dashboard Module

| UI Element | Darkone Component | Source |
|------------|-------------------|--------|
| Page wrapper | PageTitle + Card | DARKONE_ASSET_MAP.md §Core |
| Stat cards | StatCard pattern from Cards.tsx | DARKONE_ASSET_MAP.md §2.4 |
| Charts | Chart, SaleChart | DARKONE_ASSET_MAP.md §2.4 |
| Tables | react-bootstrap Table | Bootstrap native |

### 7.2 Appointments Module

| UI Element | Darkone Component | Source |
|------------|-------------------|--------|
| Page wrapper | PageTitle + Card | DARKONE_ASSET_MAP.md §Core |
| List view | react-bootstrap Table + Pagination | Bootstrap native |
| Detail view | Card + CardBody + Tabs | Bootstrap native |
| Forms | Form + react-hook-form + yup | Bootstrap + installed deps |
| Confirm dialogs | Modal | Bootstrap native |
| Status display | Badge | Bootstrap native |
| Date selection | CustomFlatpickr | DARKONE_ASSET_MAP.md §Core |
| Icons | IconifyIcon (bx:*) | DARKONE_ASSET_MAP.md §2.2 |

### 7.3 Cases Module

| UI Element | Darkone Component | Source |
|------------|-------------------|--------|
| Page wrapper | PageTitle + Card | DARKONE_ASSET_MAP.md §Core |
| List view | react-bootstrap Table + Pagination | Bootstrap native |
| Priority display | Badge with variant colors | Bootstrap native |
| Rich text notes | react-quill | Installed dependency |
| Timeline view | List with IconifyIcon | Bootstrap + DARKONE_ASSET_MAP.md §2.2 |

### 7.4 Clients Module

| UI Element | Darkone Component | Source |
|------------|-------------------|--------|
| Page wrapper | PageTitle + Card | DARKONE_ASSET_MAP.md §Core |
| List with search | Table + Form.Control | Bootstrap native |
| Detail with history | Card + Tabs | Bootstrap native |
| Forms | Form + react-hook-form + yup | Bootstrap + installed deps |

### 7.5 Audit Log Viewer

| UI Element | Darkone Component | Source |
|------------|-------------------|--------|
| Page wrapper | PageTitle + Card | DARKONE_ASSET_MAP.md §Core |
| Read-only table | Table + Pagination | Bootstrap native |
| Filters | Form.Select + CustomFlatpickr | Bootstrap + DARKONE_ASSET_MAP.md §Core |

### 7.6 Protocol Dashboard

| UI Element | Darkone Component | Source |
|------------|-------------------|--------|
| Page wrapper | PageTitle + Card | DARKONE_ASSET_MAP.md §Core |
| Simplified list | Table (read-only) | Bootstrap native |
| Status buttons | Button variants | Bootstrap native |
| Status display | Badge | Bootstrap native |

### 7.7 Notifications Module

| UI Element | Darkone Component | Source |
|------------|-------------------|--------|
| Dropdown list | Dropdown | Bootstrap native |
| Toast alerts | react-toastify | Installed dependency |
| Icons | IconifyIcon (bx:*, solar:*) | DARKONE_ASSET_MAP.md §2.2 |

---

## 8. Third-Party Libraries (Already Installed)

**Source:** package.json (verified)

| Library | Purpose | Used By Module |
|---------|---------|----------------|
| react-hook-form | Form state management | Appointments, Cases, Clients |
| yup | Form validation | Appointments, Cases, Clients |
| react-quill | Rich text editor | Cases (notes) |
| react-flatpickr | Date picker | Appointments, Audit Log |
| react-toastify | Toast notifications | All modules |
| apexcharts / react-apexcharts | Charts | Dashboard |
| jsvectormap | Maps | Dashboard (optional) |

---

## 9. Components EXPLICITLY NOT USED in v1.0

**Source:** DARKONE_ASSET_MAP.md §4 Core vs Demo Classification

| Component | File Path | Reason |
|-----------|-----------|--------|
| CanadaMap | `src/components/VectorMap/CanadaMap.tsx` | DEMO — not required |
| RussiaMap | `src/components/VectorMap/RussiaMap.tsx` | DEMO — not required |
| SpainMap | `src/components/VectorMap/SpainMap.tsx` | DEMO — not required |
| IraqVectorMap | `src/components/VectorMap/IraqVectorMap.tsx` | DEMO — not required |
| AllApexChart | Demo chart variants | DEMO — not required |
| Google Maps | google-maps-react | DEMO plugin — not required |
| Dropzone | react-dropzone | File upload not in v1.0 scope |
| FullCalendar | @fullcalendar/* | Calendar view not in v1.0 scope |
| Choices.js | choices.js | Advanced select not required |
| GridJS | gridjs-react | Simple Bootstrap tables used instead |

---

## 10. Logo Assets

**Source:** DARKONE_ASSET_MAP.md §2.1 Images

| Asset | Path | Usage |
|-------|------|-------|
| Logo (dark) | `src/assets/images/logo-dark.png` | Sidebar/topbar dark mode |
| Logo (light) | `src/assets/images/logo-light.png` | Sidebar/topbar light mode |
| Logo (small) | `src/assets/images/logo-sm.png` | Collapsed sidebar |
| Favicon | `public/favicon.ico` | Browser tab |

---

## 11. Guardian Rules Compliance

| Rule | Status | Evidence |
|------|--------|----------|
| Darkone Admin 1:1 only | COMPLIANT | All components from DARKONE_ASSET_MAP.md |
| No custom Bootstrap | COMPLIANT | Using react-bootstrap AS-IS |
| No custom icons | COMPLIANT | Iconify only (bx:*, solar:*, mingcute:*) |
| No new SCSS files | COMPLIANT | No SCSS changes in scope |
| No layout changes | COMPLIANT | AdminLayout, AuthLayout FIXED |

---

## 12. Exit Criteria

- [x] All modules mapped to existing Darkone components
- [x] Explicit file paths from repository verified
- [x] Source references explicit (DARKONE_ASSET_MAP.md, docs-standard/*)
- [x] Bootstrap usage confirmed AS-IS
- [x] Icon system mapped (Iconify only)
- [x] SCSS structure documented (no modifications)
- [x] NOT USED components listed with reasons
- [x] Guardian Rules compliance confirmed

---

**Status:** COMPLETE (Awaiting Phase 4 UI Implementation Authorization)
