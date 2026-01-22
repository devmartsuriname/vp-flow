# VP-FLOW v1.1-B — RESTORE POINT
## RP-v1.1-B-B6.4.1-PRE-MENU-FIX

**Created**: 2026-01-22
**Phase**: B6.4.1 — Notes Menu Visibility Fix
**Status**: PRE-EXECUTION

---

## Purpose

Snapshot before implementing Notes menu visibility fix to hide the Notes 
sidebar entry from non-VP users (Secretary, Protocol).

---

## Current State

### Files to be Modified
| File | Current State |
|------|---------------|
| `src/components/layout/VerticalNavigationBar/page.tsx` | Uses static `getMenuItems()` without role filtering |
| `src/assets/data/menu-items.ts` | Notes menu item present (line 40-44) |

### Issue Being Fixed
- Notes menu item visible to all authenticated users
- Security is enforced at page/RLS level, but UX shows menu to non-VP users
- Violation of UI governance (VP-only access)

---

## Rollback Instructions

If rollback required:
1. Revert `src/components/layout/VerticalNavigationBar/page.tsx` to pass unfiltered menu items
2. No changes needed to menu-items.ts (static data unchanged)

---

## Guardian Compliance

| Rule | Status |
|------|--------|
| No schema changes | ✓ ENFORCED |
| No RLS changes | ✓ ENFORCED |
| No audit changes | ✓ ENFORCED |
| Darkone Admin patterns | ✓ ENFORCED |
| Existing role patterns | ✓ WILL USE |
