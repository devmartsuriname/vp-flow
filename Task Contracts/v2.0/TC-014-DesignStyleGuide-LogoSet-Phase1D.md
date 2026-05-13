# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Design Style Guide + Logo Set — Phase 1D
- **Project:** VP-Flow
- **Phase:** v2.0 Phase 1D
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Three sequential deliverables:

1. **Step 1 — Style Guide** (Claude Code, Lane A): Extract all design tokens from the Darkone SCSS files and produce `Project Docs/v2.0/VP-Flow-Design-Style-Guide.md` — the single authoritative reference for colors, typography, spacing, component tokens, dark/light mode values, and existing Bootstrap overrides.

2. **Step 2 — Logo Design** (Cowork, not Claude Code): Based on the Style Guide, Cowork generates a modern VP-Flow logo set in SVG. Delroy approves before any file is written. Deliverables: SVG light, SVG dark, favicon (16×16 + 32×32 PNG), app icon (192×192 + 512×512 PNG), PWA splash icon (512×512 PNG maskable). One unified visual identity — modern, not classic.

3. **Step 3 — Source of Truth Audit + Replacement** (Claude Code, Lane B): Claude Code identifies every location in the codebase where logos and icons are referenced (paths, sizes, formats), then replaces all instances with the new approved logo set. The current auth page shows the wrong logo — this must be corrected as part of this step.

---

## Execution Mode

[ ] SAFE MODE — bug fixes, narrow corrections, code review
[x] EXTENDED MODE — controlled feature work, bounded module expansion
[ ] FULL BUILD MODE — full implementation within approved PRD

---

## Risk Classification

[ ] LOW — single module, no data/auth impact
[x] MEDIUM — multi-file within module, potential side effects
[ ] HIGH — DB / auth / security / API contract / architecture / cross-module

**MEDIUM reason:** Steps 1 and audit portion of Step 3 are read-only (Lane A). Logo replacement in Step 3 (Lane B) touches `public/`, `index.html`, `manifest.json`, and auth/layout components simultaneously. No migrations, no RLS, no auth logic. Risk: incorrect path or format silently breaks PWA installability — must be verified with `npx vite preview` or equivalent after replacement.

---

## Step Definitions

### Step 1 — Style Guide (Lane A, Claude Code)

**Files to read:**
- `src/assets/scss/config/_variables.scss`
- `src/assets/scss/config/_variables-dark.scss`
- `src/assets/scss/config/_custom.scss` (if exists)
- `src/assets/scss/pages/_authentication.scss`
- Any other `_variables*.scss` files found in `src/assets/scss/`

**File to produce:**
- `Project Docs/v2.0/VP-Flow-Design-Style-Guide.md`

**Content required:**
- Color palette: all `$primary`, `$secondary`, `$indigo`, `$gray-*`, `$body-bg-dark`, Bootstrap CSS variable mappings
- Typography: font-family tokens, font-size scale, font-weight values
- Spacing: Bootstrap spacing scale in use, any custom spacing overrides
- Dark mode: all `_variables-dark.scss` overrides with resolved hex values
- Component tokens: buttons (`.btn-primary`, `.btn-dark`), cards, forms, badges, alerts
- SCSS token → CSS variable mapping table (e.g., `$primary` → `var(--bs-primary)` → `#7e67fe`)
- Auth split-screen classes (`.auth-split`, `.auth-split-form`, `.auth-split-visual`) — dimensions and color values

**Format:** Markdown with tables. No code to execute — read and document only.

**Stop after Step 1:** Produce the Style Guide, report to Delroy. Do not begin logo design or audit.

---

### Step 2 — Logo Design (Cowork, not Claude Code)

**Executor:** Cowork (Claude.ai), not Claude Code.

**Input:** VP-Flow-Design-Style-Guide.md (Step 1 output).

**Logo requirements:**
- Name: "VP-Flow"
- Style: modern, clean, government SaaS — not classic, not decorative
- Primary color: `#7e67fe` (purple)
- Dark variant: works on `#191e23` (dark body background)
- Light variant: works on white/light backgrounds
- No photographic elements, no person illustrations, no external assets

**Deliverables to generate (as SVG source + export instructions):**

| File | Format | Size | Usage |
|---|---|---|---|
| `vp-flow-logo-dark.svg` | SVG | Scalable | App header, dark backgrounds |
| `vp-flow-logo-light.svg` | SVG | Scalable | Light backgrounds, print |
| `favicon-16.png` | PNG | 16×16 | Browser tab (small) |
| `favicon-32.png` | PNG | 32×32 | Browser tab (retina) |
| `icon-192.png` | PNG | 192×192 | PWA homescreen icon |
| `icon-512.png` | PNG | 512×512 | PWA splash + app store |
| `icon-512-maskable.png` | PNG | 512×512 | Android adaptive icon (safe zone: center 80%) |

**Gate:** Delroy must explicitly approve the logo design before Step 3 begins. Cowork presents the SVG(s) for visual review in this conversation. No files are written until Delroy says "Goedgekeurd — implementeer logo".

---

### Step 3 — Source of Truth Audit + Replacement (Lane B, Claude Code)

**Sub-step 3A — Audit (read-only):**

Claude Code must locate and document every logo/icon reference in the codebase:
- `public/` directory: all `.ico`, `.png`, `.svg` files currently present
- `index.html`: all `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<meta>` image references
- `vite.config.ts` or `vite.config.js`: any asset references
- `public/manifest.json` or `vite-plugin-pwa` config: `icons` array entries
- `src/layouts/` and `src/components/`: any `<img src=...>` or logo component references
- `src/app/(other)/auth/` components: current logo usage (wrong logo detected here — document what it is and where)
- Any other `.tsx`/`.ts` files that reference logo paths

Produce an audit table:

| File | Reference | Current value | Required format | Required size | Action |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | REPLACE / REMOVE / KEEP |

**Stop after 3A:** Report audit to Delroy. Await signal before 3B.

**Sub-step 3B — Replacement (Lane B, requires PRE restore point):**

After Delroy approves the audit:

1. Create PRE restore point: `RP_LogoSet_PRE_TC014.md` in `/Project Restore Points/v2.0/`
2. Write all new logo/icon files to `public/` (SVGs + PNGs as approved in Step 2)
3. Update `index.html` references to match new file names
4. Update `manifest.json` icons array: `src`, `sizes`, `type`, `purpose` for each entry
5. Update auth components: replace current wrong logo with approved `vp-flow-logo-dark.svg` (or correct variant)
6. Update layout header logo reference if present
7. Remove any old logo files that are fully replaced (only if no other reference remains — confirm via grep before delete)
8. Run `npm run lint` → must exit 0
9. Run `npm run build` → must exit 0
10. Create POST restore point: `RP_LogoSet_POST_TC014.md`

---

## File Boundary

### Step 1 — Allowed New Files

- `Project Docs/v2.0/VP-Flow-Design-Style-Guide.md`

### Step 3 — Allowed New Files

- `public/vp-flow-logo-dark.svg`
- `public/vp-flow-logo-light.svg`
- `public/vp-flow-icon.svg`
- `public/favicon-16.png`
- `public/favicon-32.png`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon-512-maskable.png`

### Step 3 — Allowed Modified Files

- `index.html`
- `vite.config.ts` (manifest icons array, theme_color → #7e67fe, background_color → #191e23, includeAssets)
- `src/app/(other)/auth/sign-in/components/SignIn.tsx` (logo element only)
- `src/app/(other)/auth/sign-up/components/SignUp.tsx` (logo element only)
- `src/app/(other)/auth/reset-password/components/ResetPassword.tsx` (logo element only)
- `src/app/(other)/auth/lock-screen/components/LockScreen.tsx` (logo element only)
- `src/components/wrapper/LogoBox.tsx` (identified by audit as sidebar logo component)
- `src/app/(other)/error-pages/pages-404/components/Error404.tsx` (logo element only — boundary extended per Delroy 2026-05-13)
- `public/sw-push.js` (icon path update only — boundary extended per Delroy 2026-05-13, only if PWA files renamed)

### Step 3 — AuthVisualPanel.tsx

- `src/app/(other)/auth/components/AuthVisualPanel.tsx` — KEEP AS-IS. Text-only element, not an img. No change required per Delroy decision 2026-05-13.

### Step 3 — Allowed Deletions (only after audit confirms no remaining references)

- `public/favicon.ico` — replaced by favicon-16.png + favicon-32.png
- `public/pwa-192x192.png` — replaced by icon-192.png
- `public/pwa-512x512.png` — replaced by icon-512.png + icon-512-maskable.png
- `src/assets/images/vpflow-logo-dark.png` — replaced by SVG (only after LogoBox.tsx + Error404.tsx updated)
- `src/assets/images/vpflow-logo-light.png` — replaced by SVG (only after all auth + Error404 components updated)
- `src/assets/images/vpflow-logo-sm.png` — replaced by vp-flow-icon.svg (only after LogoBox.tsx updated)

### Forbidden (all steps)

- All `use*.ts` auth hook files
- All migration files
- RLS policies
- Edge Functions
- `.claude/`, `Project Docs/` (except Style Guide creation), `Project Restore Points/` (except new restore points), `Task Contracts/`
- Any file not listed in the audit or not explicitly approved by Delroy

---

## Pre-Execution Requirements

- Step 1: No restore point required (Lane A, read-only output)
- Step 2: No Claude Code execution — Cowork generates, Delroy approves
- Step 3A: No restore point required (read-only audit)
- Step 3B: PRE restore point **required** before any file is written or deleted

---

## Expected Output

- `VP-Flow-Design-Style-Guide.md` — complete design token reference
- Approved SVG logo set (light + dark) + PNG exports at all required sizes
- All codebase logo references updated to new unified set
- Auth page shows correct VP-Flow logo (no more wrong/old logo)
- PWA manifest icons array correct — installability maintained
- `npm run lint` exits 0, `npm run build` exits 0

---

## Verification Requirement

**After Step 1:**
1. Show path of produced Style Guide
2. Confirm all SCSS source files were read (list them)

**After Step 2 (Cowork → Delroy approval):**
1. Delroy says "Goedgekeurd — implementeer logo" before Step 3 begins

**After Step 3A:**
1. Show full audit table
2. Await Delroy signal

**After Step 3B:**
1. `npm run lint` exit 0
2. `npm run build` exit 0
3. Show diff of all modified files
4. Confirm old logo files removed only where no references remain
5. Show manifest.json icons array after update
6. POST restore point created

---

## Constraints

- Logo design (Step 2) happens in Cowork — Claude Code does NOT generate logo SVG content
- No logo file may be written before Delroy approves the design
- No file deletion without confirming zero remaining references via grep
- No hardcoded hex values in TSX files — use SCSS tokens or CSS variables for any color
- No new npm packages for logo rendering — SVG inline or `<img>` tag only
- PWA maskable icon must respect the safe zone: meaningful content in center 80% of the 512×512 canvas
- `npm run lint` must exit 0 before reporting complete

---

## Stop Conditions

- **After Step 1:** Stop, present Style Guide to Delroy, await signal
- **After Step 2 design review:** Stop, await "Goedgekeurd — implementeer logo" before any file write
- **After Step 3A audit:** Stop, present audit table, await Delroy signal before 3B
- **After Step 3B:** Stop, show lint/build + diff + POST restore point, deliver final report

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: COMPLETE — all steps done, lint 0, build 0, committed 2026-05-13
- Delroy response: [x] Override authorized — boundary extensions approved 2026-05-13

### Boundary Extensions (approved by Delroy 2026-05-13, post-audit)

| Decision | Choice |
|---|---|
| Error404.tsx | Extended into TC-014 scope — fix old logo refs |
| sw-push.js | Extended into TC-014 scope — update icon path if renamed |
| AuthVisualPanel.tsx | Keep text as-is — no img element, no change |
| theme-color + background_color | Update to #7e67fe + #191e23 (brand tokens) |
| PWA icon naming | New TC naming: icon-192.png, icon-512.png, icon-512-maskable.png |

---

## Validation Checklist

- [x] Objective is single and unambiguous per step
- [x] Execution mode: EXTENDED MODE
- [x] Risk classified: MEDIUM (Lane A + Lane B, no migrations, no RLS)
- [x] File boundaries explicit per step
- [x] Stop conditions defined — 4 gates
- [x] No field blank
- [x] PRE restore point required before Step 3B
- [x] Logo design gate: Delroy approval required before any file write
- [x] Audit before replacement — no blind overwrites
- [x] PWA maskable safe zone documented
- [x] Wrong auth logo explicitly called out as target for correction
- [x] No Claude Code logo generation — design is Cowork responsibility

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
