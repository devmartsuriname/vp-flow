# Restore Point — v1.0 Profile Menu Cleanup

## Metadata
| Field | Value |
|-------|-------|
| Created | 2026-01-16T14:30:00Z |
| Purpose | Profile dropdown cleanup - remove Pricing/Help items |
| Status | PRE-CHANGE |

## Files Modified

| File | Change |
|------|--------|
| `src/components/layout/TopNavigationBar/components/ProfileDropdown.tsx` | Remove Pricing and Help dropdown items |

## Original Content (ProfileDropdown.tsx lines 35-42)
```tsx
<DropdownItem href="">
  <IconifyIcon icon="solar:wallet-outline" className="align-middle me-2 fs-18" />
  <span className="align-middle">Pricing</span>
</DropdownItem>
<DropdownItem href="">
  <IconifyIcon icon="solar:help-outline" className="align-middle me-2 fs-18" />
  <span className="align-middle">Help</span>
</DropdownItem>
```

## Expected Result
Profile dropdown contains ONLY:
- Welcome header
- My Account
- Lock screen
- Logout

## Rollback Steps
1. Restore ProfileDropdown.tsx from this restore point
2. Re-add the Pricing and Help DropdownItem blocks at lines 35-42
3. Verify dropdown renders correctly

## Verification Checklist
- [ ] Build passes (no TypeScript errors)
- [ ] Profile dropdown opens correctly
- [ ] Only authorized items visible
- [ ] Logout functions correctly