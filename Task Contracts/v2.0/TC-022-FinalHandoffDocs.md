# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Final Handoff Documentation — MD Source Files
- **Project:** VP-Flow
- **Phase:** v2.0 Handoff
- **Phase Validator:** Delroy
- **Date:** 2026-05-15
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated

---

## Objective

Genereer alle handoff-documentatie als Markdown bronbestanden in `Project Docs/v2.0/Handoff/`, gebaseerd op een volledige codebase-scan — zodat Cowork (Claude.ai) deze kan omzetten naar professionele PDF documenten met VP-Flow huisstijl.

---

## Mandatory Challenge (Rule 7)

**Zwakke aanname:** documentatie kan worden geschreven zonder de live codebase te lezen. Fout — Claude Code scant eerst alle routes, componenten, RLS-policies en rol-restricties vóór hij iets schrijft. Geen aannames over features — alleen wat aantoonbaar in de code staat.

**Ontbrekende constraint:** de MD-bestanden zijn bronbestanden voor PDF-conversie, niet voor GitHub-rendering. Ze moeten clean prose zijn (geen overmatige headers, geen GitHub-specifieke markdown). Cowork converteert ze naar PDF met VP-Flow branding.

**Failure risico:** als Claude Code docs schrijft vanuit geheugen in plaats van de live code, klopt de feature-beschrijving niet met de werkelijke app. Soft audit vóór elk document is verplicht.

---

## Execution Mode

[x] EXTENDED MODE — multi-document generatie vanuit codebase-scan

---

## Risk Classification

[x] LOW — Lane A. Alleen schrijven naar `Project Docs/v2.0/Handoff/`. Geen codewijzigingen. Geen restore point vereist.

---

## Scope Definition

### Stap 1 — Codebase Audit (verplicht vóór schrijven)

Scan en documenteer intern (niet als output):
- Alle routes in `src/app/(admin)/` — welke pagina's bestaan
- Alle rol-checks (`isVP`, `isSecretary`, `isProtocol`) in de codebase
- Alle tabelcomponenten — welke data zichtbaar is per module
- `src/app/auth/` — sign-in, forgot password flows
- Settings tabs en welke tabs per rol zichtbaar zijn
- Notificatie-systeem (push + email + voorkeuren)
- PWA-functionaliteit (installeerbaar, offline guard)
- Supabase URL en app URL voor correcte links in docs

### Stap 2 — Genereer de volgende 7 MD-bestanden

**DOC-01: Gebruikershandleiding VP (VP User Manual)**
Bestand: `Project Docs/v2.0/Handoff/DOC-01-UserManual-VP.md`
Inhoud:
- Inloggen en wachtwoord vergeten
- Dashboard overzicht
- Afspraken: aanmaken, goedkeuren, afwijzen, bekijken
- Zaken: aanmaken, bekijken, sluiten, heropenen
- Documenten: uploaden, bekijken, archiveren
- Notities: aanmaken met rich text, handschrift (VP-only)
- Binnenkomende post: bekijken, archiveren
- Meldingen: push en e-mail voorkeuren
- Instellingen: profiel, thema, systeeminfo, e-mail config, push notificaties
- Audit log: bekijken

**DOC-02: Gebruikershandleiding Secretaris**
Bestand: `Project Docs/v2.0/Handoff/DOC-02-UserManual-Secretary.md`
Inhoud:
- Inloggen
- Dashboard
- Afspraken: aanmaken en bekijken (geen goedkeuring)
- Zaken: bekijken
- Documenten: uploaden en bekijken
- Notities: aanmaken en bekijken
- Binnenkomende post: verwerken
- Meldingen: voorkeuren
- Instellingen: profiel, thema

**DOC-03: Gebruikershandleiding Protocol**
Bestand: `Project Docs/v2.0/Handoff/DOC-03-UserManual-Protocol.md`
Inhoud:
- Inloggen
- Dashboard
- Afspraken: alleen goedgekeurde bekijken
- Meldingen: voorkeuren
- Instellingen: profiel, thema, systeeminfo

**DOC-04: Systeemoverzicht (Executive Summary)**
Bestand: `Project Docs/v2.0/Handoff/DOC-04-SystemOverview.md`
Inhoud:
- Wat is VP-Flow (doel, context)
- Rolmodel: VP / Secretaris / Protocol
- Hoofdmodules en hun functie (tabel)
- Technische stack (React, Supabase, Hostinger)
- URL: https://vpflow.app
- Contactgegevens: Devmart Suriname

**DOC-05: Technische Documentatie**
Bestand: `Project Docs/v2.0/Handoff/DOC-05-TechnicalDocs.md`
Inhoud:
- Tech stack: React 18 + Vite + TypeScript + Supabase (PostgreSQL + RLS)
- Architectuur: client-side SPA, server-side RLS, Edge Functions
- Deployment: GitHub → GitHub Actions → FTP → Hostinger (vpflow.app)
- Supabase Edge Functions: push notificaties, e-mail
- PWA: service worker, installeerbaar op iOS/Android/Desktop
- Environment variables (namen, geen waarden)
- Build commando: `npm run build`
- Repo: https://github.com/devmartsuriname/vp-flow

**DOC-06: Beheerdershandleiding (Admin Guide)**
Bestand: `Project Docs/v2.0/Handoff/DOC-06-AdminGuide.md`
Inhoud:
- Gebruikersbeheer: aanmaken, rol toewijzen, deactiveren (VP-only)
- Rollen en rechten overzicht (tabel)
- Supabase Dashboard toegang (wat te beheren, wat niet aan te raken)
- Hostinger hPanel: bestanden, FTP, domeinen
- GitHub Actions: deployment monitoren, re-run bij fout
- Secrets beheer (GitHub + Supabase Vault)
- Wat nooit te wijzigen zonder Devmart (frozen RLS, migraties)

**DOC-07: Release Notes v2.0**
Bestand: `Project Docs/v2.0/Handoff/DOC-07-ReleaseNotes-v2.0.md`
Inhoud:
- Versie: 2.0 — datum: 2026-05-15
- Nieuwe features in v2.0 (TC-005 t/m TC-021)
- Bekende beperkingen / uitgestelde items (Phase 2)
- Contactinfo voor support: Devmart Suriname

---

## Schrijfrichtlijnen voor alle MD-bestanden

- Taal: **Nederlands** (doelgroep: VP-kantoor Suriname)
- Stijl: formeel, helder, geen technisch jargon in gebruikersdocs
- Structuur: clean prose + geordende lijsten waar nodig
- Geen overmatige headers — maximaal H1/H2/H3
- Correcte URL overal: **https://vpflow.app**
- Geen placeholder tekst — alleen wat aantoonbaar in de code staat
- Elk document begint met: Documenttitel, Versie (2.0), Datum (2026-05-15), Opgesteld door (Devmart Suriname)

---

## File Boundary

### Allowed to READ
- `src/` — volledig
- `supabase/` — volledig
- `.github/workflows/`
- `package.json`
- `vite.config.ts`

### Allowed to WRITE
- `Project Docs/v2.0/Handoff/DOC-01-UserManual-VP.md`
- `Project Docs/v2.0/Handoff/DOC-02-UserManual-Secretary.md`
- `Project Docs/v2.0/Handoff/DOC-03-UserManual-Protocol.md`
- `Project Docs/v2.0/Handoff/DOC-04-SystemOverview.md`
- `Project Docs/v2.0/Handoff/DOC-05-TechnicalDocs.md`
- `Project Docs/v2.0/Handoff/DOC-06-AdminGuide.md`
- `Project Docs/v2.0/Handoff/DOC-07-ReleaseNotes-v2.0.md`

### Forbidden
- Geen codewijzigingen
- Geen migraties
- Geen git push (Delroy pusht zelf)
- Geen bestanden buiten `Project Docs/v2.0/Handoff/`

---

## Expected Output

7 Markdown bestanden in `Project Docs/v2.0/Handoff/`, elk:
- Volledig uitgeschreven (geen placeholders)
- Gebaseerd op codebase-scan
- Klaar voor PDF-conversie door Cowork

---

## Verification Requirement

Na aflevering bevestigt Claude Code:
1. Lijst van alle 7 gegenereerde bestanden + pad
2. Per document: welke codebase-bronnen gebruikt (welke componenten/routes gescand)
3. Eventuele features die NIET gedocumenteerd zijn omdat ze niet in de code stonden

---

## Stop Condition

Stop na: alle 7 MD-bestanden aangemaakt en gevuld. Rapporteer aan Delroy. Wacht op signaal voor PDF-conversie door Cowork.

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
- [x] Risk classified: LOW — Lane A
- [x] File boundaries explicit
- [x] Stop condition defined
- [x] No field blank
- [x] Mandatory Challenge aanwezig
- [x] Schrijfrichtlijnen gedefinieerd
- [x] 7 documenten expliciet gespecificeerd met inhoud

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code begins.**
