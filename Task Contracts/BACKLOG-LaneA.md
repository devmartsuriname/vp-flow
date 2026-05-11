# VP-Flow — Lane A Backlog

Items goedgekeurd door Delroy als "later op te ruimen" — geen urgentie, geen risico.
Elk item wordt een mini Lane A TC wanneer Delroy het prioriteit geeft.

---

## BACKLOG-001 — Lege Col slot Settings pagina (Protocol)

**Gevonden tijdens:** TC-001 uitvoering (2026-05-11)
**Delroy beslissing:** Acceptabel voor nu — cosmétisch alleen
**Detail:** PushNotificationToggle returnt `null` voor Protocol, maar de `<Col lg={6}>` wrapper in `settings/page.tsx` blijft zichtbaar als lege slot in het grid. Geen functioneel probleem, geen governance risico.
**Fix:** Wrap de `<Col lg={6}>` rond PushNotificationToggle in een conditionele render — alleen renderen voor VP en Secretary.
**File:** `src/app/(admin)/settings/page.tsx`
**Lane:** A (non-functional layout fix, geen RLS, geen migratie)
**Blocker:** Geen

---

## BACKLOG-002 — Pre-existing peer dependency conflict

**Gevonden tijdens:** TC-001 npm install (2026-05-11)
**Detail:** `google-maps-react@^2.0.6` conflicteert met `react@16.14.0`. Tijdelijk opgelost met `--legacy-peer-deps`. Pre-existing — niet geïntroduceerd door TC-001.
**Fix:** Evalueer of google-maps-react nog nodig is (Google Calendar sync is KILLED). Mogelijk simpelweg verwijderen.
**Lane:** B (package.json aanpassing)
**Blocker:** Geen — maar evalueer voor Phase 6

---

## BACKLOG-003 — Pre-existing lint errors

**Gevonden tijdens:** TC-001 validatie (2026-05-11)
**Detail:** Repo-wide `npm run lint` heeft pre-existing errors buiten TC-001 scope. Niet geadresseerd per Scope Discipline (Rule 1).
**Fix:** Aparte lint-cleanup TC nodig.
**Lane:** A/B (afhankelijk van errors)
**Blocker:** Geen — maar aanbevolen voor Phase 6

---

## BACKLOG-004 — Untracked governance/doc files

**Gevonden tijdens:** TC-001 commit (2026-05-11)
**Detail:** Grote set governance en doc bestanden aangemaakt door Devmart (Cowork) zijn nog untracked in git: `.claude/`, `Task Contracts/README.md`, `Task Contracts/v2.0/`, `Project Docs/Reports/*(2026-05-11)`, `Project Restore Points/PHASE-GATE.md`, etc.
**Fix:** Aparte commit om alle governance scaffolding te stagen.
**Lane:** A (geen code — alleen governance files)
**Blocker:** Geen — maar doe dit voor TC-002 of erna

