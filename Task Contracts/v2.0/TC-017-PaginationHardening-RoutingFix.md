# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Pagination Hardening + Routing Bug Fix
- **Project:** VP-Flow
- **Phase:** v2.0 Pre-Phase 2 — Scalability
- **Phase Validator:** Delroy
- **Date:** 2026-05-16
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Implementeer server-side pagination op alle onbegrensde lijstweergaven, vervang de Notifications dropdown unbounded fetch door een server-side limit, en herstel de routing bug waarbij directe URL-navigatie naar `/notes` en `/audit-logs` doorverwijst naar `/dashboards`.

---

## Mandatory Challenge (Rule 7)

**Zwakke aanname:** Alle lijsten gebruiken dezelfde Supabase query-structuur en kunnen uniform gepagineerd worden. In werkelijkheid kunnen sommige hooks `useQuery` (TanStack), andere `useEffect + supabase.from()` gebruiken — de pagination implementatie moet per hook aangepast worden, niet via één generieke wrapper.

**Ontbrekende constraint:** Er is geen UI-design gespecificeerd voor de paginering controls. Constraint: gebruik de bestaande Bootstrap pagination component als die in het project aanwezig is, anders een minimale `Prev / Page X of Y / Next` implementatie in lijn met de huidige card/table stijl. Geen custom UI-componenten bouwen.

**Failure risico:** De routing bug kan veroorzaakt worden door een race condition in de auth loading-state. Als de fix de auth-flow raakt (bijv. ProtectedRoute), valt dit in Lane C en moet Delroy opnieuw bevestigen vóór uitvoering. Claude Code stopt en rapporteert als de root cause in auth/session code zit.

---

## Execution Mode

[x] EXTENDED MODE — multi-file feature work, bounded scope per module

---

## Risk Classification

[x] MEDIUM — meerdere hooks en pagina-componenten aangepast, potentiële side effects op data-fetching
- Geen DB-migraties
- Geen RLS-wijzigingen
- Geen auth-logica aanraken (tenzij routing bug root cause — zie Challenge)
- PRE restore point vereist vóór uitvoering

---

## Scope Definition

### In Scope

**1. Server-side pagination — prioriteitsvolgorde:**

| Lijst | Hook | Prioriteit |
|---|---|---|
| Audit Logs | `useAuditLogs.ts` | 1 — heeft al `.limit(100)`, toevoegen cursor + total count + UI |
| Appointments | `useAppointments.ts` | 2 |
| Incoming Post | `useIncomingPosts.ts` | 3 |
| Cases | `useCases.ts` | 4 |
| Documents | `useDocuments.ts` | 5 |
| Notes | `useNotes.ts` | 6 |
| Notifications (pagina) | `useNotifications.ts` | 7 |
| Guests | `useClients.ts` | 8 |

Per lijst: voeg `.range(from, to)` toe aan de Supabase query + `.count('exact')` voor total count + paginering UI (Prev/Next + "Showing X–Y of Z") op de bijbehorende page component.

**2. Notifications dropdown fix:**
- `TopNavigationBar/Notifications.tsx` (of equivalent): vervang de unbounded fetch door een Supabase query met `.limit(5)` direct op de query — niet `.slice(0, 5)` na een full fetch

**3. Routing bug fix — directe URL-navigatie:**
- Herstel het probleem waarbij `/notes` en `/audit-logs` bij directe URL-navigatie (page refresh, bookmark, extern link) doorverwijzen naar `/dashboards`
- Root cause vaststellen: waarschijnlijk een race condition in `ProtectedRoute` waarbij auth loading-state nog niet compleet is bij directe load, waarna de guard redirect
- Fix: loading-state check toevoegen zodat de route wacht op auth-resolution vóór redirect
- **STOP als de root cause in auth/session bestanden zit (bijv. `AuthContext`, `useSession`, Supabase auth hooks)** — rapporteer aan Delroy, wacht op Lane C herbevestiging

### Out of Scope

- Geen infinite scroll implementatie — alleen klassieke Prev/Next pagination
- Geen aanpassingen aan de Global Search pagination (al correct met `.limit(MAX_RESULTS_PER_CATEGORY)`)
- Geen aanpassingen aan Dashboard recent-widgets (al correct met `.limit(limit)`)
- Geen User Management pagination — `ACCEPTABLE` per audit (10–500 users)
- Geen UI-redesign van de lijstpagina's buiten de paginering controls
- Geen Settings, auth, migraties, RLS, edge functions
- TC-016 en TC-018 scope

---

## File Boundary

### Allowed to READ
- `src/` — volledig

### Allowed to WRITE
- `src/app/(admin)/audit-logs/` — hooks + page component
- `src/app/(admin)/appointments/` — hooks + page/table component
- `src/app/(admin)/incoming-post/` — hooks + page/table component
- `src/app/(admin)/cases/` — hooks + page/table component
- `src/app/(admin)/documents/` — hooks + page/table component
- `src/app/(admin)/notes/` — hooks + page/table component
- `src/app/(admin)/notifications/` — hooks + page/table component
- `src/app/(admin)/clients/` — hooks + page/table component
- `src/components/layout/TopNavigationBar/` — alleen Notifications dropdown
- `src/routes/index.tsx` of `src/components/ProtectedRoute.tsx` — alleen routing bug fix (NIET als root cause in auth/session zit)

### Forbidden
- `src/context/AuthContext.tsx`, `useAuthContext.tsx`, `useSession` — niet aanraken tenzij Delroy Lane C herbevestigt
- Supabase auth hooks — niet aanraken
- Alle bestanden buiten de bovenstaande lijst
- Geen migraties aanmaken
- Geen git push (Delroy pusht zelf)

---

## Expected Output

- Alle 8 lijsten hebben server-side pagination met Prev/Next UI en "Showing X–Y of Z" label
- Notifications dropdown gebruikt `.limit(5)` op query niveau
- Directe URL-navigatie naar `/notes` en `/audit-logs` werkt correct (geen redirect naar dashboard)
- `npm run lint` → 0 errors
- `npm run build` → 0 errors
- PRE restore point aangemaakt vóór uitvoering
- POST restore point aangemaakt na uitvoering

---

## Verification Requirement

Na aflevering bevestigt Claude Code:
1. Per lijst: hook-naam, toegevoegde `.range()` + `.count()`, page-size keuze
2. Notifications dropdown: bevestiging query-level limit
3. Routing bug: root cause omschrijving + fix locatie
4. `npm run lint` output
5. `npm run build` output
6. Pad PRE + POST restore points

---

## Constraints

- Page size: 20 records per pagina als standaard voor alle lijsten (tenzij bestaande UX anders dicteert)
- Audit Logs: behoud de bestaande `.limit(100)` logica NIET — vervang door echte cursor-based pagination
- Paginering UI: gebruik bestaand Bootstrap component indien aanwezig in het project
- Routing fix: als root cause in auth-layer zit → STOP, rapporteer, wacht op Delroy
- Geen enkele bestaande filter-functionaliteit mag breken door de pagination toevoeging

---

## Stop Condition

Stop na: alle 8 lijsten gepagineerd, dropdown fixed, routing bug opgelost, lint 0, build 0, POST restore point aangemaakt. Rapporteer aan Delroy. Wacht op signaal. Start TC-018 NIET automatisch.

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

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code begins.**
