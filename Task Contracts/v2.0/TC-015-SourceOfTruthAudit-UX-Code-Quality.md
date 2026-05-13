# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Source of Truth Audit — UX Polish, Code Quality & Bug Detection
- **Project:** VP-Flow
- **Phase:** v2.0 Pre-Phase 2 Audit
- **Phase Validator:** Delroy
- **Date:** 2026-05-13
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Produce two independent Source of Truth Audit reports — one by Claude Code, one by Codex CLI — covering UX/layout polish, pagination needs, dead code, bugs, code quality, and function coverage across all VP-Flow modules, using both the codebase and the screenshots provided by Delroy in the Polish Screenshot folder. Reports are read-only deliverables. No implementation may begin until Delroy reviews both reports and approves a follow-up TC.

---

## Mandatory Challenge (Rule 7)

**Zwakke aanname:** De audit gaat ervan uit dat de screenshots in `C:\Users\delro\OneDrive\Documents\VP Flow Take Over\Polish Screenshot` de huidige staat van de UI representeren. Als een module recent is bijgewerkt (TC-014 logo set), kunnen sommige screenshots verouderd zijn — agents moeten de code als primaire bron behandelen en screenshots als visuele context.

**Ontbrekende constraint:** Er is nog geen uniforme severity schaal vastgesteld voor bevindingen. Beide agents gebruiken de volgende schaal om rapporten vergelijkbaar te houden:
- **CRITICAL** — broken functionality, data loss risk, security issue
- **HIGH** — user-facing bug, significant UX blocker, dead code >50 lines
- **MEDIUM** — UX verbetering, pagination ontbreekt op >20 items, code smell
- **LOW** — minor spacing issue, cosmetic, linting style

**Failure risico:** Als één agent PNG bestanden niet kan lezen, valt hij terug op code-only analyse. Dit is acceptabel — de agent documenteert welke screenshots hij kon verwerken en welke niet. Code analyse is altijd de authoritative bron.

---

## Execution Mode

[x] SAFE MODE — read-only audit, no code changes, documentation output only

---

## Risk Classification

[x] LOW — read-only audit across all modules, geen database of auth aanraking, geen bestanden gewijzigd

---

## Dual-Agent Execution

Deze TC wordt door **twee agents onafhankelijk** uitgevoerd:

| Agent | Rapport naam | Output pad |
|---|---|---|
| Claude Code | `Claude-Code-Source-of-Truth-Audit.md` | `Project Docs/v2.0/Claude-Code-Source-of-Truth-Audit.md` |
| Codex CLI | `Codex-Source-of-Truth-Audit.md` | `Project Docs/v2.0/Codex-Source-of-Truth-Audit.md` |

Elke agent werkt onafhankelijk. Geen agent mag het rapport van de ander lezen vóór zijn eigen rapport compleet is. Na aflevering van beide rapporten beslist Delroy over de vervolgstap.

---

## Screenshots Context

**Folder:** `C:\Users\delro\OneDrive\Documents\VP Flow Take Over\Polish Screenshot`

Delroy heeft screenshots gemaakt van alle modules en detail pagina's. Gebruik deze als visuele referentie voor layout, spacing, en UX bevindingen. Behandel PNG bestanden die niet gelezen kunnen worden als skipped — documenteer welke je wel en niet kon verwerken. Code blijft de authoritative bron.

---

## Audit Domeinen (verplicht voor beide agents)

### Domein 1 — UX Layout & Spacing

Controleer per module:
- Ongebruikte whitespace / padding die de UI vergroot zonder waarde
- Inconsistente card spacing, tabel spacing, of form padding
- Elementen die buiten het zichtbare gebied vallen op standaard viewport (1280px, 768px)
- Inconsistent gebruik van Bootstrap utility classes (bijv. p-4 naast custom padding)
- Elk scherm vergelijken met de bijbehorende screenshot

Modules te controleren:
- Dashboard
- Guests (lijst + detail pagina)
- Appointments (lijst + detail pagina)
- Cases (lijst + detail pagina + reopen flow)
- Documents (lijst + detail + upload)
- Notes (lijst + detail + rich text editor)
- Incoming Post (lijst + detail)
- Audit Logs (lijst)
- Notifications (lijst + bell dropdown)
- User Management
- Settings (zie Domein 6 — aparte behandeling)
- Auth pagina's (sign-in, sign-up, reset-password, lock-screen)

### Domein 2 — Pagination

Voor elke lijstweergave: controleer of er een paginering mechanisme aanwezig is.

Rapporteer voor elke lijst:
- Huidige staat: `NONE / PARTIAL / COMPLETE`
- Geschat maximaal aantal records in productie (orde van grootte)
- Aanbeveling: `PAGINATION_NEEDED / INFINITE_SCROLL / ACCEPTABLE`
- Huidige query: heeft de Supabase query een `.limit()` of `.range()`?

Prioriteer lijsten die in productie >50 records kunnen bereiken:
- Audit Logs (hoogste prioriteit — onbegrensd in theorie)
- Appointments
- Cases
- Documents
- Incoming Post
- Guests

### Domein 3 — Dead Code

Scan op:
- Ongebruikte imports in .tsx en .ts bestanden
- Componenten gedefinieerd maar nooit geïmporteerd
- Functies gedefinieerd maar nooit aangeroepen
- Console.log, console.error, debugger statements die in productie zijn gebleven
- Uitgecommentarieerde code blokken >5 regels
- TODO / FIXME / HACK comments
- Bestanden in src/ die niet geïmporteerd worden door enig ander bestand

Rapporteer per bevinding: bestand, regel, type (UNUSED_IMPORT / DEAD_FUNCTION / DEBUG_LOG / DEAD_FILE / TODO_COMMENT), severity.

### Domein 4 — Bug Detection

Controleer op:
- TypeScript errors die op runtime door kunnen slippen (type assertions `as any`, niet-null assertions `!` zonder guard)
- Missing loading states: zijn alle async operations voorzien van een loading indicator?
- Missing empty states: tonen alle lijsten een "geen items" staat als de query leeg teruggeeft?
- Missing error boundaries: welke modules hebben geen error fallback bij een mislukte fetch?
- Race conditions: useEffect hooks met cleanup functies die ontbreken
- Formulieren zonder validatie op verplichte velden
- Links die naar niet-bestaande routes verwijzen (controleer alle `<Link to=...>` en `navigate(...)` calls)
- Role-based access: zijn er UI elementen zichtbaar voor rollen die er geen toegang toe hebben?

### Domein 5 — Code Quality

Scan op:
- Herhaalde code blokken die gerefactored kunnen worden naar een herbruikbaar component (duplicatie >10 regels in meerdere bestanden)
- Props drilling meer dan 2 niveaus diep (data die door 3+ componenten wordt doorgegeven)
- Inline styles in TSX (gebruik van `style={{...}}`) die vervangen kunnen worden door SCSS tokens
- Hardcoded strings die in een constanten bestand thuishoren (labels, berichten, URL paths)
- useEffect dependency arrays: ontbrekende dependencies of onnodige dependencies
- Magic numbers (hardcoded getallen zonder uitleg, bijv. `height={40}` zonder comment)
- Componenten groter dan 300 regels die gesplitst kunnen worden

### Domein 6 — Settings Module (speciale behandeling)

De Settings module heeft momenteel een lange scroll-based layout. Delroy wil tabs per onderdeel.

Analyseer de huidige Settings structuur:
- Welke secties zijn er? (Profile, Theme, Notifications, System Info, etc.)
- Hoeveel scroll-hoogte heeft de huidige pagina?
- Welke secties zijn per rol zichtbaar (VP / Secretary / Protocol)?
- Is er een bestaand tab component in het project dat hergebruikt kan worden?

Rapporteer:
- Voorgestelde tab structuur (welke tabs, in welke volgorde)
- Complexiteit van de refactor (LOW / MEDIUM / HIGH)
- Bestanden die aangepast moeten worden
- Risico op rollen-zichtbaarheid (welke tabs zijn rol-afhankelijk)

### Domein 7 — Functie Testing (smoke check via code review)

Verifieer via code review (geen live execution) of de volgende kritieke flows correct zijn geïmplementeerd:

| Flow | Check |
|---|---|
| Appointment aanmaken (Secretary) | Form → Supabase insert → redirect → audit log |
| Appointment goedkeuren (VP) | Status update → notification trigger → audit log |
| Case aanmaken vanuit Appointment | Link correct → case_id teruggekoppeld |
| Document uploaden | Storage bucket path + RLS check |
| Note aanmaken met rich text | content_format = 'html' correct opgeslagen |
| Push notificatie trigger | Edge Function correct aangeroepen na status change |
| Email notificatie trigger | Preference check → Edge Function → CORS header correct |
| Lock screen activatie | Session preserved, re-auth werkt |
| Audit log entry | Elke kritieke actie genereert een record |
| Incoming Post archivering | Immutability trigger actief |

Rapporteer per flow: `VERIFIED / PARTIAL / NOT_VERIFIED / BROKEN` + locatie van de relevante code.

---

## Rapport Structuur (verplicht voor beide agents)

Elk rapport moet deze structuur volgen:

```
# [Agent Naam] — Source of Truth Audit
# VP-Flow v2.0 — Datum: [datum]

## Executive Summary
[3-5 zinnen: algemene bevinding, hoogste risico's, aanbeveling]

## Severity Overzicht
| Severity | Aantal bevindingen |
|---|---|
| CRITICAL | X |
| HIGH | X |
| MEDIUM | X |
| LOW | X |

## Domein 1 — UX Layout & Spacing
[Per module: bevindingen met severity, bestand/component, beschrijving]

## Domein 2 — Pagination
[Per lijst: tabel met huidige staat + aanbeveling]

## Domein 3 — Dead Code
[Per bevinding: bestand, regel, type, severity]

## Domein 4 — Bugs
[Per bevinding: beschrijving, locatie, severity, reproduceerbaar via code review: ja/nee]

## Domein 5 — Code Quality
[Per bevinding: beschrijving, locatie, severity, refactor complexiteit]

## Domein 6 — Settings Module
[Analyse + voorgestelde tab structuur + complexiteit]

## Domein 7 — Functie Testing
[Tabel per flow met status + locatie]

## Prioriteitsmatrix
[Top 10 aanbevolen acties gesorteerd op severity × impact]

## Screenshots Verwerkt
[Lijst van screenshots die verwerkt zijn / niet konden worden gelezen]
```

---

## File Boundary

### Allowed to READ (beide agents)

- `src/` — alle bestanden (lezen, niet schrijven)
- `public/` — lezen
- `supabase/migrations/` — lezen (voor schema begrip)
- `vite.config.ts`, `index.html`, `package.json` — lezen
- `C:\Users\delro\OneDrive\Documents\VP Flow Take Over\Polish Screenshot\` — lezen (screenshots)
- `Project Docs/v2.0/VP-Flow-Design-Style-Guide.md` — lezen (design tokens referentie)
- `.claude/CLAUDE.md` — lezen (project context)

### Allowed to WRITE (beide agents)

- `Project Docs/v2.0/Claude-Code-Source-of-Truth-Audit.md` (Claude Code only)
- `Project Docs/v2.0/Codex-Source-of-Truth-Audit.md` (Codex only)

### Forbidden (alle agents)

- Geen enkel src/ bestand wijzigen
- Geen migraties aanmaken
- Geen git commits (rapporten opslaan is voldoende)
- Geen bestanden verwijderen
- Elkaars rapport lezen vóór eigen rapport compleet is

---

## Pre-Execution Requirements

- Geen restore point vereist — read-only audit
- Beide agents starten onafhankelijk — geen coördinatie tussen sessies
- Elke agent leest dit TC volledig vóór de audit begint

---

## Expected Output

- `Project Docs/v2.0/Claude-Code-Source-of-Truth-Audit.md` — compleet rapport inclusief alle 7 domeinen
- `Project Docs/v2.0/Codex-Source-of-Truth-Audit.md` — compleet rapport inclusief alle 7 domeinen
- Beide rapporten volgen de verplichte rapport structuur
- Delroy leest beide rapporten en beslist over vervolgstap

---

## Verification Requirement

**Na aflevering door elke agent:**
1. Bevestig het pad van het rapport
2. Toon het Executive Summary
3. Toon de Severity Overzicht tabel
4. Stop — wacht op Delroy's signaal

---

## Constraints

- Audit is strikt read-only — geen enkele code of config wijziging
- Beide rapporten zijn DRAFT tot Delroy "Goedgekeurd" zegt
- Severity schaal is verplicht (CRITICAL / HIGH / MEDIUM / LOW) — geen andere termen
- Screenshots folder is context, niet authoritative — code is de bron van waarheid
- Agents rapporteren wat ze zien, niet wat ze zouden willen implementeren
- Geen suggesties buiten de 7 audit domeinen

---

## Stop Conditions

- **Elke agent:** Stop na oplevering van het rapport. Toon executive summary + severity overzicht. Wacht op Delroy.
- **Geen agent** start implementatie op basis van eigen audit bevindingen zonder een nieuw goedgekeurd TC.

---

## Override Log

- Violation detected: —
- Instruction in conflict: 3 conflicts geïdentificeerd (Conflict A/B/C) — awaiting Delroy decision
- Execution status: COMPLETE — beide agents geleverd 2026-05-13. Cowork visuele audit geleverd 2026-05-13.
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous (audit only, two independent reports)
- [x] Execution mode: SAFE MODE (read-only)
- [x] Risk classified: LOW (no writes to src/, no migrations, no auth)
- [x] File boundaries explicit (read all src/, write only two report files)
- [x] Stop conditions defined — elke agent stopt na rapport + summary
- [x] No field blank
- [x] Dual-agent structure duidelijk — onafhankelijke uitvoering, unieke rapport namen
- [x] Rapport structuur verplicht — vergelijkbaarheid gewaarborgd
- [x] Screenshots folder path vermeld
- [x] Settings module speciaal behandeld (Domein 6)
- [x] Severity schaal uniform (CRITICAL / HIGH / MEDIUM / LOW)
- [x] Mandatory Challenge aanwezig (Rule 7)

---

## Geleverde Rapporten

| Agent | Bestand | Datum | Severity (C/H/M/L) |
|---|---|---|---|
| Claude Code | `Project Docs/v2.0/Claude-Code-Source-of-Truth-Audit.md` | 2026-05-13 | 2/9/16/14 |
| Codex CLI | `Project Docs/v2.0/Codex-Source-of-Truth-Audit.md` | 2026-05-13 | 1/6/20/14 |
| Cowork | `Project Docs/v2.0/Cowork-Visual-Audit.md` | 2026-05-13 | 0/5/9/15 |
| Geconsolideerd | `Project Docs/v2.0/TC-015-Geconsolideerde-Audit.md` | 2026-05-13 | — |

**Open conflicts:** A (content_format) · B (Audit Logs severity) · C (Sidebar role filtering) — wacht op Delroy

---

**STATUS: COMPLETE (read-only audit) — Wacht op Delroy's beslissing op 3 conflicts vóór Phase 2 TC's worden opgesteld.**
