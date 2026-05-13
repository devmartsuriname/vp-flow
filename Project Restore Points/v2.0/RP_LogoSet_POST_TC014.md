# RP_LogoSet_POST_TC014 — Post-Execution Restore Point

**TC:** TC-014 — Design Style Guide + Logo Set — Phase 1D, Step 3B
**Lane:** B
**Date:** 2026-05-13
**Authority:** Delroy (Devmart)
**Status:** DRAFT — captured immediately after Step 3B execution

---

## 1. Summary

Replaced the entire legacy navy logo/icon set with the approved purple-brand SVG/PNG set generated from `logo-source/`. All PWA, favicon, apple-touch-icon, sidebar, auth-screen, and 404-page logo references now resolve to the new assets. PWA manifest theme and background colors updated to brand tokens (`#7e67fe` / `#191e23`).

---

## 2. Files created

### 2.1 `public/` — new assets

| File | Type | Size | Source |
|---|---|---|---|
| `public/vp-flow-logo-dark.svg` | SVG | scalable | copied from `logo-source/vp-flow-logo-dark.svg` |
| `public/vp-flow-logo-light.svg` | SVG | scalable | copied from `logo-source/vp-flow-logo-light.svg` |
| `public/vp-flow-icon.svg` | SVG | scalable | copied from `logo-source/vp-flow-icon.svg` |
| `public/favicon-16.png` | PNG | 16×16 | rendered from `logo-source/vp-flow-icon-boxed.svg` (sharp, density 384) |
| `public/favicon-32.png` | PNG | 32×32 | rendered from `logo-source/vp-flow-icon-boxed.svg` |
| `public/icon-192.png` | PNG | 192×192 | rendered from `logo-source/vp-flow-icon-boxed.svg` |
| `public/icon-512.png` | PNG | 512×512 | rendered from `logo-source/vp-flow-icon-boxed.svg` |
| `public/icon-512-maskable.png` | PNG | 512×512 | rendered from `logo-source/vp-flow-icon-boxed.svg` (content already centered) |

### 2.2 `scripts/` — helper script

| File | Purpose |
|---|---|
| `scripts/generate-icons.mjs` | Node + `sharp` script that rasterizes `vp-flow-icon-boxed.svg` to the five PNG sizes. Re-runnable: `node scripts/generate-icons.mjs`. |

### 2.3 `package.json` — dev dependency added

- `sharp@^x.x` added to `devDependencies` (installed with `--legacy-peer-deps` to resolve `google-maps-react` peer conflict).

---

## 3. Files modified

| File | Change |
|---|---|
| `vite.config.ts` | `includeAssets` expanded to list new SVG + PNG set, removed legacy `'favicon.ico'`. Manifest `theme_color`: `#1e3a5f` → `#7e67fe`. `background_color`: `#0f172a` → `#191e23`. Icons array entries updated to `/icon-192.png`, `/icon-512.png`, `/icon-512-maskable.png`. |
| `index.html` | `<meta name="theme-color">`: `#1e3a5f` → `#7e67fe`. `<link rel="apple-touch-icon">`: `/pwa-192x192.png` → `/icon-192.png`. |
| `public/sw-push.js` | Push notification `icon` and `badge`: `/pwa-192x192.png` → `/icon-192.png`. |
| `src/app/(other)/auth/sign-in/components/SignIn.tsx` | `import Logo from '@/assets/images/vpflow-logo-light.png'` → `const Logo = '/vp-flow-logo-dark.svg'`. img unchanged. |
| `src/app/(other)/auth/sign-up/components/SignUp.tsx` | Same pattern as SignIn. |
| `src/app/(other)/auth/reset-password/components/ResetPassword.tsx` | Same pattern. |
| `src/app/(other)/auth/lock-screen/components/LockScreen.tsx` | Same pattern. |
| `src/components/wrapper/LogoBox.tsx` | Three PNG imports replaced with public-path constants: `'/vp-flow-logo-dark.svg'`, `'/vp-flow-logo-light.svg'`, `'/vp-flow-icon.svg'`. img attrs preserved (width 24/114, height 24/28). |
| `src/app/(other)/error-pages/pages-404/components/Error404.tsx` | Two PNG imports replaced with public-path constants for dark + light SVGs. img attrs preserved (height 32 / 28). |

---

## 4. Files deleted (after grep confirmation)

Pre-deletion grep confirmed zero remaining runtime/code references. All other hits were in `Project Docs/` (stale docs — see §7), `Task Contracts/`, `logo-source/` instruction files, the PRE restore point, and `archive/**` (excluded).

| File | Reason |
|---|---|
| `public/favicon.ico` | Replaced by `favicon-16.png` + `favicon-32.png` (referenced via PWA manifest + browser auto-discovery from precache) |
| `public/pwa-192x192.png` | Replaced by `icon-192.png` |
| `public/pwa-512x512.png` | Replaced by `icon-512.png` + `icon-512-maskable.png` |
| `src/assets/images/vpflow-logo-dark.png` | Replaced by `/vp-flow-logo-dark.svg` |
| `src/assets/images/vpflow-logo-light.png` | Replaced by `/vp-flow-logo-light.svg` |
| `src/assets/images/vpflow-logo-sm.png` | Replaced by `/vp-flow-icon.svg` |

---

## 5. Validation

| Check | Result |
|---|---|
| `npm run lint` | **EXIT 0** — 0 errors, 12 warnings (all pre-existing per TC-009 acceptance) |
| `npm run build` | **EXIT 0** — built in 15.14s. Vite PWA generated 111-entry precache (`dist/sw.js`, `dist/workbox-*.js`). |
| `dist/manifest.webmanifest` | Contains correct `theme_color: #7e67fe`, `background_color: #191e23`, and three icons referencing `/icon-192.png`, `/icon-512.png`, `/icon-512-maskable.png`. |
| `dist/` asset presence | Confirmed: `favicon-16.png`, `favicon-32.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `vp-flow-logo-dark.svg`, `vp-flow-logo-light.svg`, `vp-flow-icon.svg`. |
| Grep for old asset names (excluding `archive/**`, `Project Docs/**`, `Task Contracts/**`, `logo-source/**`, this RP and its PRE counterpart) | Zero matches in active code. |

---

## 6. Files NOT touched (per TC boundary)

- `src/app/(other)/auth/components/AuthVisualPanel.tsx` — text-only `<div>` brand element, Delroy decision 2026-05-13 to keep as text.
- All migration files, RLS policies, edge functions, auth hooks, `.claude/`, `Task Contracts/`.

---

## 7. Flags for Delroy (Rule 6 operational findings)

1. **Stale documentation references** in `Project Docs/Architecture/Architecture.md`, `Project Docs/Architecture/Backend.md`, and `Project Docs/Governance/Branding_Governance.md` still mention `vpflow-logo-*.png` and `favicon.ico`. These files are out of TC-014 file boundary and are owned by Cowork. A follow-up doc-update TC is recommended to refresh these references to the new asset names.
2. **`sharp` dev dependency** was added via `--legacy-peer-deps` due to a pre-existing peer conflict with `google-maps-react`. No production-runtime impact (dev-only). The icon-regeneration script `scripts/generate-icons.mjs` is now part of the repo and can be re-run on any future logo refresh.
3. **PWA install verification** was not performed in this Lane B execution — recommend testing PWA installability (Chrome DevTools → Application → Manifest) before the next deployment to confirm the maskable icon safe-zone renders correctly on Android.

---

## 8. Rollback procedure

`git restore` the modified files and `git checkout HEAD -- public/favicon.ico public/pwa-192x192.png public/pwa-512x512.png src/assets/images/vpflow-logo-*.png` to revert deletions. Remove `public/vp-flow-*.svg`, `public/favicon-*.png`, `public/icon-*.png`, `scripts/generate-icons.mjs` if rejecting the new set. Revert `sharp` from `devDependencies` and run `npm install --legacy-peer-deps`.

---

---

## 9. Correction pass — variant swap (2026-05-13, post-visual-review)

**Issue reported by Delroy:** Visual check showed wrong logo variants in light/dark mode. Auth pages and dashboard sidebar rendered light-content (white-text) logos on light backgrounds, making the wordmark nearly invisible.

**Root cause:** Two inverted naming conventions:
- File names (`vp-flow-logo-dark.svg` / `-light.svg`) follow the **"for use on X background"** convention. `vp-flow-logo-dark.svg` contains **white** text → for **dark** backgrounds. `vp-flow-logo-light.svg` contains **`#21252e`** dark text → for **light** backgrounds.
- Bootstrap/Darkone SCSS classes (`.logo-dark` / `.logo-light` inside `.auth-logo` and `.logo-box`) follow the **opposite** convention: `.logo-dark` is **shown in light theme** (Darkone's "dark-on-light" wordmark), `.logo-light` is **shown in dark theme**.

**Fix applied:**

| File | Change |
|---|---|
| `src/components/wrapper/LogoBox.tsx` | Swapped: `logoDark` now points at `/vp-flow-logo-light.svg`, `logoLight` at `/vp-flow-logo-dark.svg`. `logoSm` unchanged. |
| `src/app/(other)/error-pages/pages-404/components/Error404.tsx` | Same swap as LogoBox. |
| `src/app/(other)/auth/sign-in/components/SignIn.tsx` | Removed single `const Logo`. Replaced single-img markup with dual-class pattern (`.logo-dark` Link → `vp-flow-logo-light.svg`, `.logo-light` Link → `vp-flow-logo-dark.svg`) so both light + dark modes render the correct contrast variant. |
| `src/app/(other)/auth/sign-up/components/SignUp.tsx` | Same dual-class fix. |
| `src/app/(other)/auth/reset-password/components/ResetPassword.tsx` | Same dual-class fix. |
| `src/app/(other)/auth/lock-screen/components/LockScreen.tsx` | Same dual-class fix. |

**Validation after correction:**
- `npm run lint` → **EXIT 0**
- `npm run build` → **EXIT 0**

The dual-class auth-logo pattern is supported by existing SCSS at `src/assets/scss/pages/_authentication.scss` lines 100-120 (`.auth-logo .logo-dark` / `.logo-light` visibility swap under `html[data-bs-theme="dark"]`).

---

**STATUS: Step 3B execution complete (with variant-swap correction). Awaiting Delroy signal.**
