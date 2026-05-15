# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Template & Dead Code Cleanup
- **Project:** VP-Flow
- **Phase:** v2.0 Pre-Phase 2 — Cleanup
- **Phase Validator:** Delroy
- **Date:** 2026-05-16
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Verwijder alle Bootstrap Darkone template dead code, dead component files, de productie console.log, en normaliseer de page-header padding zodat de codebase schoon is vóór Phase 2 UX-werk begint.

---

## Mandatory Challenge (Rule 7)

**Zwakke aanname:** De template demo-routes zijn "gewoon ongebruikt" — maar als een van de (layouts)/dark-* routes nog ergens in een import of lazy-load zit, breekt het verwijderen de build. Claude Code moet eerst verifiëren dat elke file echt niet geïmporteerd wordt vóór verwijdering.

**Ontbrekende constraint:** Er is geen definitie van wat "page-header padding normaliseren" precies inhoudt. Constraint: alleen de `+` placeholder-artefacten (ongerenderde IconifyIcon / leeg element boven de filterkaart) oplossen op list-pages — geen brede spacing-refactor.

**Failure risico:** Een dead file die toch transitief geïmporteerd wordt veroorzaakt een build-error. Stop condition: `npm run lint && npm run build` moet 0 errors geven vóór aflevering.

---

## Execution Mode

[x] SAFE MODE — code cleanup, geen feature work, geen data/auth aanraking

---

## Risk Classification

[x] LOW — geen DB, geen auth, geen RLS, geen API contract wijziging
- Alleen src/ bestanden die aantoonbaar niet geïmporteerd zijn
- Build-validatie verplicht na elke verwijdering

---

## Scope Definition

### In Scope

1. **Verwijder dead template routes** — de volgende mappen volledig verwijderen mits niet geïmporteerd:
   - `src/app/(admin)/(layouts)/dark-mode/`
   - `src/app/(admin)/(layouts)/dark-sidenav/`
   - `src/app/(admin)/(layouts)/dark-topnav/`
   - `src/app/(admin)/(layouts)/hidden-sidenav/`
   - `src/app/(admin)/(layouts)/small-sidenav/`

2. **Verwijder dead component files** — mits niet geïmporteerd door enig actief bestand:
   - `src/components/ThemeCustomizer` (of equivalent pad)
   - `src/components/ComponentContainerCard` (of equivalent pad)
   - `src/components/CustomFlatpickr` (of equivalent pad)
   - `src/hooks/useModal` (of equivalent pad)
   - `src/hooks/useFileUploader` (of equivalent pad)

3. **Verwijder productie console.log:**
   - `src/app/(admin)/(layouts)/dark-mode/components/DarkMode.tsx:8` — `console.log('bvdfbgd', changeTheme)`
   - Scan ook alle overige `console.log` / `console.error` / `debugger` statements in `src/` en verwijder ze — tenzij ze onderdeel zijn van een expliciete error-handling flow met een try/catch

4. **Fix `+` placeholder-artefacten in list-page headers:**
   - Verwijder of herstel het ongerenderde element dat `+` toont boven de filterkaart op: `appointments/page.tsx`, `cases/page.tsx`, `documents/page.tsx`, `notes/page.tsx`, `incoming-post/page.tsx`
   - Scope: alleen het specifieke element verwijderen, geen layout-herstructurering

5. **Fix `min-vh-100` flex op AdminLayout** zodat de footer op korte pagina's (Cases empty, Documents empty, User Management) altijd onderaan staat — `layouts/AdminLayout.tsx`

### Out of Scope

- Geen wijzigingen aan `src/components/` bestanden die actief geïmporteerd zijn
- Geen spacing of padding aanpassingen buiten de `+` artefacten en AdminLayout footer
- Geen wijzigingen aan SCSS/CSS tokens of Bootstrap variabelen
- Geen wijzigingen aan routes/index.tsx buiten dead-route verwijdering
- Geen migraties, RLS, edge functions, auth
- TC-017 en TC-018 scope — pagination en Settings komen in aparte TC's

---

## File Boundary

### Allowed to READ
- `src/` — volledig (om imports te verifiëren)
- `package.json`, `vite.config.ts`

### Allowed to WRITE / DELETE
- `src/app/(admin)/(layouts)/dark-mode/` — verwijderen
- `src/app/(admin)/(layouts)/dark-sidenav/` — verwijderen
- `src/app/(admin)/(layouts)/dark-topnav/` — verwijderen
- `src/app/(admin)/(layouts)/hidden-sidenav/` — verwijderen
- `src/app/(admin)/(layouts)/small-sidenav/` — verwijderen
- `src/components/ThemeCustomizer`, `ComponentContainerCard`, `CustomFlatpickr` — verwijderen indien confirmed dead
- `src/hooks/useModal`, `useFileUploader` — verwijderen indien confirmed dead
- `src/app/(admin)/appointments/page.tsx` — alleen `+` artefact
- `src/app/(admin)/cases/page.tsx` — alleen `+` artefact
- `src/app/(admin)/documents/page.tsx` — alleen `+` artefact
- `src/app/(admin)/notes/page.tsx` — alleen `+` artefact
- `src/app/(admin)/incoming-post/page.tsx` — alleen `+` artefact
- `src/components/layout/AdminLayout.tsx` (of equivalent) — alleen `min-vh-100` fix
- Alle `console.log`/`debugger` in `src/` — verwijderen

### Forbidden
- Geen enkel bestand dat actief geïmporteerd is en niet in de bovenstaande lijst staat
- Geen migraties aanmaken
- Geen git push (Delroy pusht zelf)

---

## Expected Output

- Alle genoemde dead files verwijderd
- 0 `console.log` / `debugger` statements in productiecode
- `+` artefacten weg op alle 5 list-pages
- Footer altijd onderaan op korte pagina's
- `npm run lint` → 0 errors
- `npm run build` → 0 errors
- POST restore point aangemaakt

---

## Verification Requirement

Na aflevering bevestigt Claude Code:
1. Lijst van verwijderde bestanden/mappen
2. Lijst van verwijderde console.log regels (bestand + regelnummer)
3. `npm run lint` output (0 errors)
4. `npm run build` output (0 errors)
5. Pad van POST restore point

---

## Constraints

- Verifieer elke file met grep/import-scan vóór verwijdering — niet op aanname verwijderen
- Als een "dead" file toch een import blijkt te hebben: STOP, rapporteer aan Delroy, wacht op signaal
- Geen enkele actieve functionaliteit mag breken
- Lane A — geen PRE restore point vereist, wel POST restore point

---

## Stop Condition

Stop na: lint 0, build 0, POST restore point aangemaakt. Rapporteer aan Delroy. Wacht op signaal. Start TC-017 NIET automatisch.

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode: SAFE MODE
- [x] Risk classified: LOW
- [x] File boundaries explicit
- [x] Stop condition defined
- [x] No field blank
- [x] Mandatory Challenge aanwezig

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code begins.**
