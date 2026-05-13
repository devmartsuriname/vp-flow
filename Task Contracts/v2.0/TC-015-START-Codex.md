# TC-015 — Start Commando voor Codex CLI

Kopieer het blok hieronder en plak het in Codex CLI.

---

```
Je voert TC-015 uit voor het VP-Flow project als CODEX agent.

Governance: Devmart Guardian Rules v2.1 actief.
Project context staat in: .claude/CLAUDE.md

Task Contract: Task Contracts/v2.0/TC-015-SourceOfTruthAudit-UX-Code-Quality.md
Lees dit TC volledig voordat je begint.

---

JOUW ROL: Codex CLI — Source of Truth Audit agent

Je produceert uitsluitend:
  Project Docs/v2.0/Codex-Source-of-Truth-Audit.md

Je leest NIET het rapport van Claude Code vóór jouw rapport compleet is.
Dit is een read-only audit. Je wijzigt geen enkel bestand buiten het rapport.

---

PROJECT STACK:
  React + Vite + TypeScript
  Supabase (PostgreSQL + RLS)
  Bootstrap + SCSS (Darkone template)
  PWA (VitePWA)
  Repo root: C:\Users\delro\OneDrive\Documents\Devmart Github Repos\vp-flow

SCREENSHOTS FOLDER (visuele context):
  C:\Users\delro\OneDrive\Documents\VP Flow Take Over\Polish Screenshot\

Lees alle PNG bestanden in deze folder als visuele referentie per module.
Documenteer welke screenshots je kon verwerken en welke niet.

---

AUDIT DOMEINEN (volledig beschreven in TC-015):

1. UX Layout & Spacing — alle modules + detail pagina's
   Modules: Dashboard, Guests, Appointments, Cases, Documents, Notes,
   Incoming Post, Audit Logs, Notifications, User Management, Settings, Auth pages

2. Pagination — alle lijstweergaven
   Check per lijst: heeft de Supabase query een .limit() of .range()?
   Schat maximaal aantal records in productie.
   Rapporteer: PAGINATION_NEEDED / INFINITE_SCROLL / ACCEPTABLE

3. Dead Code
   - Ongebruikte imports (.tsx + .ts)
   - Dode componenten en functies
   - console.log / debugger statements
   - Uitgecommentarieerde blokken >5 regels
   - TODO / FIXME / HACK comments
   - Bestanden niet geïmporteerd door enig ander bestand

4. Bugs
   - TypeScript 'as any' en non-null assertions zonder guard
   - Missing loading states op async operations
   - Missing empty states op lijstcomponenten
   - Missing error boundaries
   - useEffect cleanup ontbrekend
   - Formulieren zonder verplichte veld validatie
   - Broken link targets (Link to / navigate)
   - UI elementen zichtbaar voor verkeerde rol

5. Code Quality
   - Duplicatie >10 regels in meerdere bestanden
   - Props drilling 3+ niveaus
   - Inline styles (style={{...}}) in TSX
   - Hardcoded strings die constanten zouden moeten zijn
   - useEffect dependency problemen
   - Magic numbers zonder comment
   - Componenten >300 regels

6. Settings Module (speciale analyse)
   Huidige secties inventariseren. Hoeveel scroll-hoogte?
   Rol-afhankelijke zichtbaarheid per sectie.
   Voorstel voor tab structuur.
   Complexiteit van refactor.
   Bestaande tab component in project?

7. Functie Testing (smoke check via code review — geen live uitvoering)
   Verifieer implementatie van 10 kritieke flows:
   - Appointment aanmaken → insert → audit log
   - Appointment goedkeuren → notificatie → audit log
   - Case aanmaken vanuit Appointment → link correct
   - Document uploaden → storage + RLS
   - Note met rich text → content_format = 'html'
   - Push notificatie trigger → Edge Function
   - Email notificatie → preference check → CORS
   - Lock screen → session preserved
   - Audit log → elke kritieke actie
   - Incoming Post archivering → immutability trigger
   Status per flow: VERIFIED / PARTIAL / NOT_VERIFIED / BROKEN

---

RAPPORT STRUCTUUR (verplicht):

Bestand: Project Docs/v2.0/Codex-Source-of-Truth-Audit.md

Header: # Codex CLI — Source of Truth Audit / VP-Flow v2.0

Verplichte secties:
- Executive Summary (3-5 zinnen)
- Severity Overzicht tabel (CRITICAL / HIGH / MEDIUM / LOW counts)
- Domein 1 t/m 7 (alle zeven, volledig uitgewerkt)
- Prioriteitsmatrix (top 10 acties, gesorteerd op severity × impact)
- Screenshots Verwerkt (welke PNG's gelezen, welke niet)

Severity schaal (verplicht — geen andere termen):
  CRITICAL — broken functionality, data loss risk, security issue
  HIGH — user-facing bug, significant UX blocker, dead code >50 lines
  MEDIUM — UX verbetering, pagination ontbreekt op >20 items, code smell
  LOW — minor spacing, cosmetic, linting style

---

NA AFLEVERING:
1. Bevestig het pad van het rapport
2. Toon het Executive Summary
3. Toon de Severity Overzicht tabel
4. Stop — rapporteer "TC-015 Codex rapport compleet" aan Delroy
5. Wacht op Delroy's signaal. Start GEEN implementatie.
```
