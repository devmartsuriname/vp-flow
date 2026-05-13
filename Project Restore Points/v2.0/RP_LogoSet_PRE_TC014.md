# RP_LogoSet_PRE_TC014 — Pre-Execution Restore Point

**TC:** TC-014 — Design Style Guide + Logo Set — Phase 1D, Step 3B
**Lane:** B (PRE restore point required)
**Date:** 2026-05-13
**Authority:** Delroy (Devmart)
**Status:** DRAFT — captured before Step 3B execution

---

## Purpose

Snapshot of every file/asset that Step 3B will modify, replace, or delete. Allows full rollback if execution fails or is rejected.

---

## 1. Files & assets currently in `public/`

| Path | Type | Note |
|---|---|---|
| `public/favicon.ico` | binary | Legacy navy favicon — TARGET FOR DELETION (replaced by `favicon-16.png` + `favicon-32.png`) |
| `public/placeholder.svg` | SVG | Lovable default placeholder — KEEP, unrelated |
| `public/pwa-192x192.png` | PNG | Legacy navy PWA 192 — TARGET FOR DELETION (replaced by `icon-192.png`) |
| `public/pwa-512x512.png` | PNG | Legacy navy PWA 512 — TARGET FOR DELETION (replaced by `icon-512.png` + `icon-512-maskable.png`) |
| `public/robots.txt` | text | KEEP, unrelated |
| `public/sw-push.js` | JS | Push service worker — currently references `/pwa-192x192.png` (icon + badge), TO BE UPDATED |

## 2. Bundled image assets in `src/assets/images/`

| Path | Type | Note |
|---|---|---|
| `src/assets/images/vpflow-logo-dark.png` | PNG | Legacy navy wordmark (dark variant) — TARGET FOR DELETION after refs removed |
| `src/assets/images/vpflow-logo-light.png` | PNG | Legacy navy wordmark (light variant) — TARGET FOR DELETION |
| `src/assets/images/vpflow-logo-sm.png` | PNG | Legacy navy small mark — TARGET FOR DELETION |

## 3. Source files referencing legacy logos (current state)

### 3.1 `index.html` (relevant lines)
```html
<meta name="theme-color" content="#1e3a5f" />
<link rel="apple-touch-icon" href="/pwa-192x192.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

### 3.2 `vite.config.ts` (relevant block)
```ts
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico'],
  manifest: {
    name: 'VP-Flow',
    short_name: 'VP-Flow',
    description: 'Appointment and Case Management System for the Office of the Vice President',
    theme_color: '#1e3a5f',
    background_color: '#0f172a',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    icons: [
      { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  },
  ...
})
```

### 3.3 `public/sw-push.js` (relevant)
```js
icon: '/pwa-192x192.png',
badge: '/pwa-192x192.png',
```

### 3.4 Auth components — current logo imports

| File | Current import | img element |
|---|---|---|
| `src/app/(other)/auth/sign-in/components/SignIn.tsx` (line 1, 25) | `import Logo from '@/assets/images/vpflow-logo-light.png'` | `<img src={Logo} height={40} alt="VP-Flow" />` |
| `src/app/(other)/auth/sign-up/components/SignUp.tsx` (line 2, 96) | `import Logo from '@/assets/images/vpflow-logo-light.png'` | `<img src={Logo} height={40} alt="VP-Flow" />` |
| `src/app/(other)/auth/reset-password/components/ResetPassword.tsx` (line 1, 32) | `import Logo from '@/assets/images/vpflow-logo-light.png'` | `<img src={Logo} height={40} alt="VP-Flow" />` |
| `src/app/(other)/auth/lock-screen/components/LockScreen.tsx` (line 2, 34) | `import Logo from '@/assets/images/vpflow-logo-light.png'` | `<img src={Logo} height={40} alt="VP-Flow" />` |

### 3.5 `src/components/wrapper/LogoBox.tsx` — current imports
```tsx
import logoDark from '@/assets/images/vpflow-logo-dark.png'
import logoLight from '@/assets/images/vpflow-logo-light.png'
import logoSm from '@/assets/images/vpflow-logo-sm.png'
```
- `<img width={24} height={24} src={logoSm} className="logo-sm" alt="VP-Flow logo" />`
- `<img width={114} height={28} src={logoDark} className="logo-lg" alt="VP-Flow" />` (in `.logo-dark` Link)
- `<img width={114} height={28} src={logoLight} className="logo-lg" alt="VP-Flow" />` (in `.logo-light` Link)

### 3.6 `src/app/(other)/error-pages/pages-404/components/Error404.tsx` — current imports
```tsx
import logoDark from '@/assets/images/vpflow-logo-dark.png'
import logoLight from '@/assets/images/vpflow-logo-light.png'
```
- `<img src={logoDark} height={32} alt="logo dark" />`
- `<img src={logoLight} height={28} alt="logo light" />`

### 3.7 `src/app/(other)/auth/components/AuthVisualPanel.tsx`

NOT MODIFIED by TC-014 (Delroy decision 2026-05-13). Text-only brand element `<div className="auth-split-visual-brand">VP-Flow</div>` is preserved.

---

## 4. New files to be created (Step 3B targets)

| Path | Source | Size |
|---|---|---|
| `public/vp-flow-logo-dark.svg` | copy of `logo-source/vp-flow-logo-dark.svg` | scalable |
| `public/vp-flow-logo-light.svg` | copy of `logo-source/vp-flow-logo-light.svg` | scalable |
| `public/vp-flow-icon.svg` | copy of `logo-source/vp-flow-icon.svg` | scalable |
| `public/favicon-16.png` | rendered from `logo-source/vp-flow-icon-boxed.svg` via `sharp` | 16×16 |
| `public/favicon-32.png` | rendered from `logo-source/vp-flow-icon-boxed.svg` via `sharp` | 32×32 |
| `public/icon-192.png` | rendered from `logo-source/vp-flow-icon-boxed.svg` via `sharp` | 192×192 |
| `public/icon-512.png` | rendered from `logo-source/vp-flow-icon-boxed.svg` via `sharp` | 512×512 |
| `public/icon-512-maskable.png` | rendered from `logo-source/vp-flow-icon-boxed.svg` via `sharp` (content already in safe zone) | 512×512 |

---

## 5. Boundary

Allowed-modified files for Step 3B (per TC-014 + Delroy boundary extensions 2026-05-13):
- `index.html`
- `vite.config.ts`
- `public/sw-push.js` (boundary extension)
- `src/app/(other)/auth/sign-in/components/SignIn.tsx`
- `src/app/(other)/auth/sign-up/components/SignUp.tsx`
- `src/app/(other)/auth/reset-password/components/ResetPassword.tsx`
- `src/app/(other)/auth/lock-screen/components/LockScreen.tsx`
- `src/components/wrapper/LogoBox.tsx`
- `src/app/(other)/error-pages/pages-404/components/Error404.tsx` (boundary extension)

Forbidden: migrations, RLS, edge functions, auth hooks, `.claude/`, `Task Contracts/`, `AuthVisualPanel.tsx`.

---

## 6. Rollback procedure

If Step 3B fails or is rejected by Delroy:
1. `git restore` modified files (or revert commit if committed).
2. Restore `public/favicon.ico`, `public/pwa-192x192.png`, `public/pwa-512x512.png` from git (only if deleted).
3. Restore `src/assets/images/vpflow-logo-*.png` from git (only if deleted).
4. Delete any newly-created files in `public/` (the `vp-flow-*.svg` and `favicon-*.png` / `icon-*.png` set).

Git is the authoritative rollback source.

---

**STATUS: PRE restore point captured. Step 3B execution authorized to begin.**
