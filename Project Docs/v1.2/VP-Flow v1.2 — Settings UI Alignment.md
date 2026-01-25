# VP-Flow v1.2 — Settings UI Alignment

## Document Metadata
| Field | Value |
|-------|-------|
| **Project** | VP-Flow |
| **Document Type** | Technical Specification |
| **Module** | Settings |
| **Version** | v1.2 |
| **Status** | APPROVED |
| **Created** | 2026-01-25 |

---

## 1. Current State

| Component | Current Value | Required Change |
|-----------|---------------|-----------------|
| Version label | `1.0.0` | Update to `1.2.0` |
| Environment label | `Production` | No change |
| PWA status | Not displayed | Add read-only indicator |
| Theme preferences | Functional | No change |
| Profile information | Functional | No change |

---

## 2. Version Labeling Rules

### 2.1 Display Format

| Rule | Specification |
|------|---------------|
| Format | `v{major}.{minor}.{patch}` |
| Example | `v1.2.0` |
| Display location | SystemInfoCard component |
| Badge style | `bg-soft-primary text-primary` |

### 2.2 Source File

**File:** `src/app/(admin)/settings/constants.ts`

```typescript
// Current (v1.0)
export const APP_INFO: Omit<SystemInfo, 'currentDate' | 'lastLogin'> = {
  appName: 'VP-Flow',
  version: '1.0.0',  // ← UPDATE TO '1.2.0'
  environment: 'Production',
}

// Target (v1.2)
export const APP_INFO: Omit<SystemInfo, 'currentDate' | 'lastLogin'> = {
  appName: 'VP-Flow',
  version: '1.2.0',  // ← UPDATED
  environment: 'Production',
}
```

### 2.3 Version Update Policy

| Rule | Specification |
|------|---------------|
| Update trigger | Manual per release |
| Auto-detection | NOT IMPLEMENTED |
| Git tag sync | NOT IMPLEMENTED |
| package.json sync | NOT IMPLEMENTED |

---

## 3. PWA Status Indicator

### 3.1 Display Specification

| Property | Value |
|----------|-------|
| Location | SystemInfoCard, after Environment row |
| Label | "Install Mode" |
| Possible values | `Installed` (standalone) or `Browser` (regular) |
| Badge style (Installed) | `bg-soft-success text-success` |
| Badge style (Browser) | `bg-soft-secondary text-secondary` |
| Editability | Read-only (no user interaction) |

### 3.2 Detection Logic

```typescript
// PWA detection utility
const isPWAInstalled = (): boolean => {
  // Check display-mode media query
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }
  
  // iOS Safari standalone mode
  if ((navigator as any).standalone === true) {
    return true
  }
  
  return false
}
```

### 3.3 Component Update

**File:** `src/app/(admin)/settings/components/SystemInfoCard.tsx`

Add after Environment ListGroup.Item (line 47):

```tsx
<ListGroup.Item className="d-flex justify-content-between align-items-center">
  <span className="text-muted">Install Mode</span>
  <Badge bg={isPWAInstalled ? 'soft-success' : 'soft-secondary'} 
         className={isPWAInstalled ? 'text-success' : 'text-secondary'}>
    {isPWAInstalled ? 'Installed' : 'Browser'}
  </Badge>
</ListGroup.Item>
```

### 3.4 PWA Indicator Requirements

| Requirement | Specification |
|-------------|---------------|
| Real-time update | NOT REQUIRED (static on page load) |
| Install prompt | NOT IN SCOPE (browser handles) |
| Uninstall guidance | NOT IN SCOPE |

---

## 4. Environment Labeling

### 4.1 Current Implementation (No Changes)

| Environment | Badge Color | Text Color |
|-------------|-------------|------------|
| Production | `soft-success` | `text-success` |
| Development | `soft-warning` | `text-warning` |

### 4.2 Source Configuration

```typescript
// constants.ts
environment: 'Production',  // Hardcoded; no runtime detection
```

### 4.3 Environment Detection

| Feature | Status |
|---------|--------|
| Auto-detect from URL | NOT IMPLEMENTED |
| Auto-detect from env vars | NOT IMPLEMENTED |
| Manual configuration | CURRENT (hardcoded) |

---

## 5. Explicit Exclusions

### 5.1 Prohibited Features

| Feature | Status | Rationale |
|---------|--------|-----------|
| Feature toggles | PROHIBITED | Governance constraint |
| Feature flags | PROHIBITED | Governance constraint |
| A/B testing controls | PROHIBITED | Governance constraint |
| Debug mode toggle | PROHIBITED | Security constraint |

### 5.2 Deferred Features

| Feature | Status | Earliest Version |
|---------|--------|------------------|
| Notification preferences | NOT IN v1.2 | v1.3+ |
| Language/locale settings | NOT IN v1.2 | v1.3+ |
| Timezone settings | NOT IN v1.2 | v1.3+ |
| Data export settings | NOT IN v1.2 | v1.3+ |

---

## 6. Implementation Checklist

| Task | File | Status |
|------|------|--------|
| Update version to `1.2.0` | `src/app/(admin)/settings/constants.ts` | PENDING |
| Add PWA detection utility | `src/app/(admin)/settings/utils/` | PENDING |
| Add PWA indicator to SystemInfoCard | `src/app/(admin)/settings/components/SystemInfoCard.tsx` | PENDING |
| Verify Darkone styling compatibility | — | PENDING |

---

## 7. UI Mockup (Text-Based)

```
┌─────────────────────────────────────────────────┐
│ System Information                              │
├─────────────────────────────────────────────────┤
│ Application              VP-Flow                │
│ Version                  [v1.2.0]               │
│ Environment              [Production]           │
│ Install Mode             [Installed]            │  ← NEW
│ Current Date             Saturday, January 25   │
│ Current Time             10:30 AM               │
│ Session Started          Jan 25, 2026 9:00 AM   │
│ 🛡 Admin Access          [Full System Access]   │
└─────────────────────────────────────────────────┘
```

---

## 8. Darkone Compatibility

### 8.1 Component Constraints

| Constraint | Enforcement |
|------------|-------------|
| Use existing ListGroup.Item pattern | ✓ |
| Use existing Badge component | ✓ |
| No custom CSS additions | ✓ |
| No layout changes | ✓ |

### 8.2 Styling Rules

| Element | Class |
|---------|-------|
| Row label | `text-muted` |
| Row value | `fw-medium` |
| Badge (primary) | `bg-soft-primary text-primary` |
| Badge (success) | `bg-soft-success text-success` |
| Badge (secondary) | `bg-soft-secondary text-secondary` |

---

## Cross-References

- `VP-Flow v1.2 — Scope Confirmation.md`
- `src/app/(admin)/settings/constants.ts` — Version source
- `src/app/(admin)/settings/components/SystemInfoCard.tsx` — Display component
- `Project Docs/v1.1-C/` — PWA implementation reference
