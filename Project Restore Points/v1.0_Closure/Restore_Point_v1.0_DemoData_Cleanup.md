# Restore Point: v1.0 Demo Data Cleanup

## Metadata
- **Created:** 2026-01-16
- **Purpose:** Remove unused Darkone demo data files
- **Phase:** v1.0 Final Hygiene

## Files to Delete
| File | Reason |
|------|--------|
| `src/helpers/data.ts` | Zero imports in codebase |
| `src/assets/data/other.ts` | Only imported by helpers/data.ts |
| `src/assets/data/social.ts` | Only imported by helpers/data.ts |
| `src/assets/data/topbar.ts` | Only imported by helpers/data.ts |

## Files Preserved
| File | Reason |
|------|--------|
| `src/assets/data/menu-items.ts` | Active VP-Flow navigation |
| `src/types/data.ts` | Types cleanup conditional on build |

## Rollback Steps
1. Revert commit or restore files from git history
2. Run `npm run build` to verify restoration
3. Quick smoke test

## Verification Checklist
- [ ] Build passes after deletion
- [ ] No console errors
- [ ] Navigation works
- [ ] All VP-Flow modules accessible