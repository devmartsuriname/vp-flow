# RP — Production Deployment PRE (TC-021)

**Date:** 2026-05-15
**TC:** TC-021 — Production Deployment Hostinger + GitHub Auto-Deploy
**Lane:** B (MEDIUM)
**Mode:** EXTENDED

## Current State (before execution)

### vite.config.ts
- Default `base` ('/') — correct for vpflow.app root deployment
- Default `build.outDir` ('dist') — correct
- PWA plugin configured: autoUpdate, manifest, workbox with navigateFallback '/index.html'
- No explicit production-vs-development build switches beyond `mode === "development" && componentTagger()` (lovable-tagger excluded from prod build — correct)
- No production config errors detected — no changes required

### package.json
- `build`: `vite build` — present
- `lint`: `eslint .` — present
- `preview`: `vite preview` — present

### public/
- Existing assets: logos, icons, favicons, sw-push.js, robots.txt, placeholder.svg
- `.htaccess` NOT present — must be created

### .github/workflows/
- Directory does not exist — no deployment workflow present

### .env*
- `.env` exists in repo root (not read — Forbidden)
- `.env.example` NOT present
- `.gitignore` does NOT list `.env` explicitly — risk flagged for Delroy; out of TC-021 scope

### .gitignore
- `dist` ignored ✓
- `node_modules` ignored ✓
- `.claude/settings.local.json` ignored ✓
- `.env` NOT in .gitignore — see Risk below

## Files to be created
- `public/.htaccess`
- `.github/workflows/deploy.yml`
- `Project Docs/v2.0/Deployment-Secrets-Checklist.md`

## Files NOT modified
- `vite.config.ts` — no production config errors
- `package.json` — build scripts already correct
- All source files in `src/`
- All migration files
- All `.env*` files (forbidden by TC)

## Risk Note
- `.env` is not listed in `.gitignore`. Verify `.env` is not tracked by git before pushing to remote. Out of TC-021 scope but flagged per Rule 6 exception (security risk).
- FTP credentials never appear in repo — only in GitHub Secrets.
