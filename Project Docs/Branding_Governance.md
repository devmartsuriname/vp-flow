# VP-Flow — Branding Governance

**Project:** VP-Flow  
**Client:** Office of the Vice President of Suriname  
**Document Type:** Branding Standards & Governance  
**Status:** APPROVED  
**Created:** 2026-01-11

---

## Document Purpose

This document defines branding standards, current implementation status, and deferred functionality for the VP-Flow application. It serves as the authoritative reference for all branding-related decisions.

---

## 1. Current Branding Implementation (Phase 4)

### 1.1 Logo Assets

VP-Flow logos are:
- **Manually designed** outside Lovable
- **Fixed static assets**, not user-configurable
- **Located in:** `src/assets/images/`

### 1.2 Asset Inventory

| Asset | File | Theme/Context |
|-------|------|---------------|
| Logo (light content) | `vpflow-logo-light.png` | Dark theme, dark backgrounds, auth screens on dark cards |
| Logo (dark content) | `vpflow-logo-dark.png` | Light theme, light backgrounds |
| Icon only | `vpflow-logo-sm.png` | Collapsed sidebar (both themes) |
| Favicon | `public/favicon.ico` | Browser tab |

### 1.3 Theme-to-Logo Mapping (MANDATORY)

| Application Theme | Logo Version to Use | Reason |
|-------------------|---------------------|--------|
| **Dark Theme** | LIGHT version (`vpflow-logo-light.png`) | Light/white content is visible on dark backgrounds |
| **Light Theme** | DARK version (`vpflow-logo-dark.png`) | Dark content is visible on light backgrounds |

**Rule:** This mapping applies EVERYWHERE — sidebar, navigation, auth screens, any branded surface.

---

## 2. Usage Rules (NON-NEGOTIABLE)

### 2.1 Dark Theme Context
- Use `vpflow-logo-light.png` (light-colored content) EVERYWHERE
- Applies to:
  - Admin sidebar (expanded + collapsed)
  - Top navigation
  - Auth / Sign-in / Forgot Password screens
  - Any dark-background surface

### 2.2 Light Theme Context
- Use `vpflow-logo-dark.png` (dark-colored content) EVERYWHERE
- Applies to:
  - Admin sidebar (expanded + collapsed)
  - Top navigation
  - Auth / Sign-in / Forgot Password screens
  - Any light-background surface

### 2.3 Logo Handling Constraints
- Logos must **NEVER** be stretched
- Aspect ratio must **ALWAYS** be preserved
- Sidebar logo uses a dedicated, correctly sized horizontal version
- Collapsed sidebar uses the icon-only variant (`vpflow-logo-sm.png`)
- Auth screens may use a vertical-safe composition
- **NO** CSS scaling hacks or container stretching

### 2.4 Logo Dimensions

| Variant | Logical Size | Retina Size (2x) | Purpose |
|---------|--------------|------------------|---------|
| Horizontal (lg) | 114×28 px | 228×56 px | Expanded sidebar |
| Icon only (sm) | 24×24 px | 48×48 px | Collapsed sidebar |

---

## 3. Favicon

### 3.1 Current State
- Static file: `public/favicon.ico`
- VP-Flow branded icon

### 3.2 Deferred
- Favicon upload/configuration is **NOT** available in v1.0
- Will be addressed in a future branding configuration phase

---

## 4. Deferred Branding Configuration (Future Phase)

### 4.1 Settings → Branding Tab (NOT IN SCOPE)

The following features are intentionally **EXCLUDED** from Phase 4 and Phase 5:

| Feature | Description | Status |
|---------|-------------|--------|
| Branding Tab | Settings → Branding configuration screen | DEFERRED |
| Logo Upload (Light) | Upload custom logo for dark theme | DEFERRED |
| Logo Upload (Dark) | Upload custom logo for light theme | DEFERRED |
| Favicon Upload | Upload custom browser favicon | DEFERRED |
| Preview Support | Real-time preview for sidebar and auth screen | DEFERRED |
| Storage Strategy | Decision between static assets vs Supabase Storage | DEFERRED |

### 4.2 Phase Boundary

| Phase | Branding Configuration Status |
|-------|-------------------------------|
| Phase 4 | **EXCLUDED** |
| Phase 5 | **EXCLUDED** |
| Future Phase (TBD) | Targeted for implementation |

### 4.3 Storage Strategy (When Implemented)

| Option | Approach | Trade-offs |
|--------|----------|------------|
| Option A | Static assets (current) | Simple, requires rebuild for changes |
| Option B | Supabase Storage bucket | Dynamic, no rebuild required, requires RLS policies |

**Decision:** DEFERRED until future phase authorization.

---

## 5. Guardian Rules Compliance

| Rule | Compliance |
|------|------------|
| No dynamic branding in v1.0 | ✓ COMPLIANT — Branding is fixed |
| All logos documented | ✓ COMPLIANT — See Section 1.2 |
| Usage rules defined | ✓ COMPLIANT — See Section 2 |
| Deferred items marked | ✓ COMPLIANT — See Section 4 |
| Phase boundary explicit | ✓ COMPLIANT — Not Phase 4, not Phase 5 |

---

## 6. References

- **Phase 4 Closure:** `Phase_4_Closure.md` (Branding Asset Specification section)
- **Architecture:** `Architecture.md` (Branding & Visual Identity section)
- **Backend:** `Backend.md` (Branding Storage section)

---

**Document Status:** APPROVED  
**Created:** 2026-01-11  
**Authority:** Devmart / Office of the Vice President
