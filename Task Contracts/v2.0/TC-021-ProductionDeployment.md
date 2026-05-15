# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Production Deployment — Hostinger + GitHub Auto-Deploy
- **Project:** VP-Flow
- **Phase:** v2.0 Deployment
- **Phase Validator:** Delroy
- **Date:** 2026-05-15
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated

---

## Objective

Configureer VP-Flow voor productie-deployment naar Hostinger (vpflow.app). Produceert:
1. `.htaccess` voor SPA-routing op Apache (Hostinger shared hosting)
2. Verificatie van `vite.config.ts` productie-instellingen
3. GitHub Actions workflow voor automatische deployment naar Hostinger bij push naar `main`
4. Productie environment variabelen checklist voor Delroy

**Deployment stack:** React + Vite SPA → build naar `dist/` → Hostinger `public_html/`
**Database:** Supabase (extern, ongewijzigd)
**Domain:** vpflow.app (nameservers wijzen al naar Hostinger)

---

## Mandatory Challenge (Rule 7)

**Zwakke aanname:** Hostinger's Node.js hosting werkt identiek aan een standaard VPS. In werkelijkheid is dit shared hosting met Apache — de `dist/` bestanden gaan naar `public_html/` en SPA-routing vereist een `.htaccess` die alle requests naar `index.html` stuurt. Zonder dit werken directe URL-navigaties niet in productie.

**Ontbrekende constraint:** De Supabase productie-URL en anon key moeten als environment variabelen beschikbaar zijn tijdens de Hostinger build. Dit zijn SECRETS — ze mogen NOOIT in de repo staan. Claude Code documenteert welke env vars nodig zijn; Delroy vult ze in via Hostinger hPanel → Advanced → Environment Variables.

**Failure risico:** GitHub Actions heeft een deployment secret (Hostinger API token of SSH key) nodig. Als die niet geconfigureerd is kan de workflow niet deployen. Claude Code schrijft de workflow en documenteert exact welke GitHub Secrets Delroy moet aanmaken — Claude Code voert deze stap NIET zelf uit.

---

## Execution Mode

[x] EXTENDED MODE — multi-file configuratie + CI/CD workflow

---

## Risk Classification

[x] MEDIUM — productie-configuratie, geen DB/RLS wijzigingen
- Geen migraties
- Geen RLS-wijzigingen
- Geen auth-logica
- Secrets worden NIET in repo opgeslagen — alleen gedocumenteerd voor Delroy
- PRE restore point vereist

---

## Scope Definition

### Stap 1 — Soft Audit (verplicht eerst)

Claude Code scant en rapporteert de huidige staat van:
- `vite.config.ts` — base URL, build output dir, PWA config
- `.env` / `.env.production` / `.env.example` — welke env vars bestaan er al?
- `public/` map — is `.htaccess` al aanwezig?
- `package.json` — build script, preview script
- `.github/workflows/` — bestaat er al een deployment workflow?
- `dist/` in `.gitignore` — bevestig dat dist niet in de repo staat

### Stap 2 — .htaccess aanmaken

Maak `public/.htaccess` aan voor Apache SPA-routing:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

Dit zorgt dat alle routes (bijv. `/appointments`, `/notes`) correct naar `index.html` worden gestuurd op Hostinger Apache.

### Stap 3 — vite.config.ts verificeren

Controleer:
- `base: '/'` (of correct pad)
- `build.outDir: 'dist'`
- `build.emptyOutDir: true`
- PWA plugin correct geconfigureerd voor productie

Wijzig alleen als iets aantoonbaar fout staat. Rapporteer wat gevonden is.

### Stap 4 — GitHub Actions workflow aanmaken

Maak `.github/workflows/deploy.yml` aan:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to Hostinger via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ftp.vpflow.app
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
          exclude: |
            **/.git*
            **/.git*/**
            **/node_modules/**
```

### Stap 5 — Secrets checklist produceren

Claude Code schrijft een markdown document `Project Docs/v2.0/Deployment-Secrets-Checklist.md` met exact welke secrets Delroy moet instellen:

**GitHub Repository Secrets** (Settings → Secrets → Actions):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- `FTP_USERNAME` — Hostinger FTP username (u620352774)
- `FTP_PASSWORD` — Hostinger FTP wachtwoord

**Supabase Dashboard** (Authentication → URL Configuration):
- Site URL instellen op `https://vpflow.app`
- Redirect URLs toevoegen: `https://vpflow.app/**`

### Out of Scope

- Geen database migraties
- Geen RLS wijzigingen
- Geen auth-logica
- Geen secrets invullen (dat doet Delroy zelf)
- Geen DNS-wijzigingen (nameservers wijzen al naar Hostinger)
- Geen Supabase Edge Function deployment (apart TC indien nodig)

---

## File Boundary

### Allowed to READ
- `src/` volledig
- `vite.config.ts`
- `package.json`
- `.env*` bestanden (alleen lezen, nooit schrijven)
- `public/`
- `.github/`

### Allowed to WRITE
- `public/.htaccess` (nieuw)
- `.github/workflows/deploy.yml` (nieuw)
- `Project Docs/v2.0/Deployment-Secrets-Checklist.md` (nieuw)
- `vite.config.ts` — alleen als er aantoonbare productie-configuratiefouten zijn

### Forbidden
- `.env` bestanden schrijven of aanpassen
- Secrets hardcoden in enig bestand
- Supabase migraties
- git push (Delroy pusht zelf)
- FTP-credentials in code

---

## Expected Output

- `public/.htaccess` aangemaakt
- `.github/workflows/deploy.yml` aangemaakt
- `Project Docs/v2.0/Deployment-Secrets-Checklist.md` aangemaakt
- Audit rapport van huidige configuratie
- `npm run lint` → 0 errors
- `npm run build` → 0 errors
- PRE + POST restore point

---

## Verification Requirement

Na aflevering bevestigt Claude Code:
1. Audit resultaat — huidige config state
2. `.htaccess` inhoud bevestigd
3. `deploy.yml` aangemaakt — exacte workflow stappen
4. Secrets checklist pad
5. `npm run build` output (0 errors)
6. Pad PRE + POST restore points

---

## Handmatige stappen voor Delroy (na TC-021)

Claude Code kan deze stappen NIET uitvoeren — Delroy doet dit zelf:

1. GitHub → Repository Settings → Secrets → Actions → voeg toe:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `FTP_USERNAME` (u620352774)
   - `FTP_PASSWORD`

2. Supabase Dashboard → Authentication → URL Configuration:
   - Site URL: `https://vpflow.app`
   - Redirect URLs: `https://vpflow.app/**`

3. Push naar `main` → GitHub Actions deployt automatisch naar Hostinger

---

## Stop Condition

Stop na: audit compleet, .htaccess aangemaakt, deploy.yml aangemaakt, secrets checklist aangemaakt, lint 0, build 0, POST restore point. Rapporteer aan Delroy. Wacht op signaal.

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode: EXTENDED MODE
- [x] Risk classified: MEDIUM
- [x] File boundaries explicit
- [x] Stop condition defined
- [x] No field blank
- [x] Mandatory Challenge aanwezig
- [x] Lane B — PRE + POST restore point vereist
- [x] Secrets worden NIET in repo opgeslagen
- [x] Handmatige stappen voor Delroy expliciet gedocumenteerd

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code begins.**
