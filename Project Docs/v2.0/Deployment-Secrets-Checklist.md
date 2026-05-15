# Deployment Secrets Checklist — VP-Flow Production

**TC:** TC-021
**Date:** 2026-05-15
**Authority:** Delroy
**Scope:** Manual steps Delroy must complete after TC-021. Claude Code does NOT execute these.

---

## 1. GitHub Repository Secrets

Path: GitHub → Repository → Settings → Secrets and variables → Actions → New repository secret

Add the following four secrets (names must match `deploy.yml` exactly):

| Secret Name | Value | Source |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (https://<project-ref>.supabase.co) | Supabase Dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon / public key | Supabase Dashboard → Project Settings → API |
| `FTP_USERNAME` | `u620352774` | Hostinger hPanel → Files → FTP Accounts |
| `FTP_PASSWORD` | Hostinger FTP password | Hostinger hPanel → Files → FTP Accounts |

**Rules:**
- NEVER commit these values to the repository.
- NEVER share these values via chat, email, or screenshots.
- If a secret leaks: rotate immediately (regenerate FTP password in hPanel, rotate Supabase anon key only if absolutely necessary — anon key is public-safe but URL+key pair should remain controlled).

---

## 2. Supabase Dashboard Configuration

Path: Supabase Dashboard → Authentication → URL Configuration

| Setting | Value |
|---|---|
| Site URL | `https://vpflow.app` |
| Redirect URLs | `https://vpflow.app/**` |

Save changes. This allows magic links, password reset emails, and OAuth callbacks to redirect to the production domain.

---

## 3. Hostinger FTP Verification (optional pre-flight)

Before pushing to `main`, verify FTP credentials work:

1. Open FileZilla or any FTP client.
2. Host: `ftp.vpflow.app` — User: `u620352774` — Password: (from hPanel).
3. Connect. You should see `public_html/`.
4. Disconnect. The workflow handles actual upload.

---

## 4. First Deployment

1. Confirm all 4 GitHub Secrets are saved.
2. Confirm Supabase URL Configuration is saved.
3. Push any commit to `main` (or merge a PR into `main`).
4. GitHub → Actions tab → watch the "Deploy to Hostinger" workflow run.
5. On success: visit `https://vpflow.app`. Hard-refresh (Ctrl+Shift+R) to bypass cache.
6. Test SPA routing: navigate to `https://vpflow.app/appointments` directly. `.htaccess` should serve `index.html` and the router takes over.

---

## 5. Rollback

If the deployment breaks production:

1. GitHub → Actions → identify the bad commit.
2. `git revert <bad-commit>` on `main`.
3. Push the revert — the workflow will redeploy the previous good state.
4. Alternatively: re-upload a known-good `dist/` build via FTP manually.

---

## 6. What Claude Code Did NOT Do

- Did NOT add any secret value to any file.
- Did NOT read `.env` contents.
- Did NOT push to GitHub.
- Did NOT change Supabase configuration.
- Did NOT change DNS or Hostinger hPanel settings.
- Did NOT execute any FTP transfer.

All of the above are manual steps owned by Delroy.
