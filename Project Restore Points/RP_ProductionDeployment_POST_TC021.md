# RP — Production Deployment POST (TC-021)

**Date:** 2026-05-15
**TC:** TC-021 — Production Deployment Hostinger + GitHub Auto-Deploy
**Lane:** B (MEDIUM)
**Mode:** EXTENDED
**Status:** DRAFT — awaiting Delroy "Goedgekeurd"

## Files Created
1. `public/.htaccess` — Apache SPA rewrite rules
2. `.github/workflows/deploy.yml` — GitHub Actions CI/CD workflow
3. `Project Docs/v2.0/Deployment-Secrets-Checklist.md` — manual steps for Delroy

## Files NOT Modified
- `vite.config.ts` — audit confirmed production config correct (base '/', outDir 'dist', PWA OK)
- `package.json` — build scripts already correct
- `.env*` — never touched (TC forbidden)
- Any source code in `src/`
- Any migration in `supabase/migrations/`

## Verification Results

### Audit Summary
- vite.config.ts: production-ready, no changes needed
- package.json: `build`, `lint`, `preview` scripts present
- public/.htaccess: was missing — created
- .github/workflows/: directory created with deploy.yml
- dist/ ignored in .gitignore ✓
- `.env` NOT in .gitignore — flagged in PRE restore point (out of TC scope)

### .htaccess Content (4 lines)
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### deploy.yml Steps
1. Checkout (`actions/checkout@v4`)
2. Setup Node.js 20 with npm cache (`actions/setup-node@v4`)
3. `npm ci`
4. `npm run build` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` injected via secrets
5. FTP deploy via `SamKirkland/FTP-Deploy-Action@v4.3.5` — server `ftp.vpflow.app`, local `./dist/`, remote `/public_html/`, excludes `.git*` and `node_modules`

All credentials use `${{ secrets.* }}` placeholders. Zero secret values in repo.

### Lint
- `npm run lint` → **0 errors**, 7 pre-existing warnings (accepted via TC-009)

### Build
- `npm run build` → **0 errors**, built in 10.63s
- PWA: 115 precache entries (1859.03 KiB)
- `dist/.htaccess` confirmed copied from `public/` to `dist/` by Vite

## Manual Steps Pending (Delroy)
See `Project Docs/v2.0/Deployment-Secrets-Checklist.md`:
1. Add 4 GitHub Secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `FTP_USERNAME`, `FTP_PASSWORD`
2. Supabase: Site URL `https://vpflow.app` + Redirect `https://vpflow.app/**`
3. Push to `main` → workflow auto-deploys

## Risk Note
- `.env` is not listed in `.gitignore`. Verify `.env` is not tracked before push.
- FTP credentials never appear in repo; only in GitHub Secrets.
- No DB / RLS / auth-logic changes.

## Write Verification
- Task: TC-021 Production Deployment Hostinger + GitHub Auto-Deploy
- TC ID: TC-021
- Lane: B
- Approval timestamp: Delroy approved TC prior to execution (2026-05-15)
- Files modified: 3 created (none modified)
- Files touched count: 3
- What changed: SPA Apache rewrite rules + CI/CD workflow + secrets documentation
- Validation: lint 0 errors, build 0 errors, .htaccess present in dist/
- Hook failures: None
- Agent review outcomes: Not required (Lane B; devmart-reviewer optional, Delroy review next)
- Scope creep incidents: None
- Risk remaining: Low — manual secret entry pending Delroy; .env gitignore flagged
