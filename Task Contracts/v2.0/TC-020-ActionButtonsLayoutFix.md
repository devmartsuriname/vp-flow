# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Action Buttons Layout Fix
- **Project:** VP-Flow
- **Phase:** v2.0 Pre-Deployment — Visual Polish
- **Phase Validator:** Delroy
- **Date:** 2026-05-15
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated

---

## Objective

Action buttons (view/edit/delete icons) in lijsttabellen zijn verticaal gestapeld in plaats van naast elkaar. Oorzaak: buttons/links zitten in een `<td>` zonder flex-wrapper. Fix: audit alle tabel-componenten, wrap aangetaste action buttons in een `d-flex gap-1 justify-content-end` container.

---

## Mandatory Challenge (Rule 7)

**Zwakke aanname:** het probleem zit alleen in AppointmentsTable.tsx. In werkelijkheid is het patroon waarschijnlijk copy-paste consistent over meerdere modules — Claude Code scant eerst alle tabelcomponenten vóór hij iets wijzigt.

**Ontbrekende constraint:** sommige tabellen hebben al een `text-end` op de `<td>` — de flex-wrapper moet daar mee samengaan (niet conflicteren). Gebruik `d-flex gap-1 justify-content-end` zodat zowel uitlijning als spacing correct is ongeacht bestaande td-klassen.

**Failure risico:** als de wrapper te breed wordt gerenderd kan de tabel horizontaal gaan scrollen op smalle schermen. Claude Code controleert of de bestaande `<td>` een vaste breedte of `text-end` heeft en past de wrapper daarop aan.

---

## Execution Mode

[x] SAFE MODE — pure CSS class toevoeging, geen logica

---

## Risk Classification

[x] LOW — Lane A. Geen restore point vereist.
- Geen logica-wijzigingen
- Geen hook-wijzigingen
- Geen migraties
- Geen RLS

---

## Scope Definition

### In Scope

**Stap 1 — Soft Audit (verplicht vóór schrijven):**

Scan alle tabel-componenten in `src/app/(admin)/` op action buttons in een `<td>` zonder `d-flex` wrapper. Documenteer exact welke bestanden aangetast zijn en op welke regels.

Te scannen locaties:
- `src/app/(admin)/appointments/components/AppointmentsTable.tsx`
- `src/app/(admin)/cases/`
- `src/app/(admin)/documents/`
- `src/app/(admin)/incoming-post/`
- `src/app/(admin)/clients/`
- `src/app/(admin)/notes/`
- `src/app/(admin)/notifications/`
- `src/app/(admin)/users/` (of User Management equivalent)

**Stap 2 — Fix (alleen na audit):**

Per aangetast bestand: wrap de action buttons in:
```tsx
<div className="d-flex gap-1 justify-content-end">
  {/* bestaande buttons/links */}
</div>
```

### Out of Scope

- Geen wijzigingen aan logica, hooks, routes, of context
- Geen styling anders dan de flex-wrapper
- Geen migraties
- TC-016, TC-017, TC-018, TC-019 scope — niet aanraken

---

## File Boundary

### Allowed to READ
- `src/` — volledig

### Allowed to WRITE
- Alleen tabel-componenten die het stacking-probleem hebben (vastgesteld na audit)

### Forbidden
- Alle bestanden buiten de aangetaste tabelcomponenten
- Geen git push (Delroy pusht zelf)

---

## Expected Output

- Audit rapport: welke bestanden hadden het probleem
- Per bestand: exact gewijzigde regels
- Action buttons in alle lijsttabellen staan naast elkaar (horizontaal)
- `npm run lint` → 0 errors
- `npm run build` → 0 errors

---

## Verification Requirement

Na aflevering bevestigt Claude Code:
1. Audit resultaat — lijst van aangetaste bestanden
2. Per bestand: welke regels gewijzigd
3. `npm run lint` output
4. `npm run build` output

---

## Stop Condition

Stop na: audit compleet, alle aangetaste bestanden gefixed, lint 0, build 0. Rapporteer aan Delroy. Wacht op signaal.

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
- [x] Risk classified: LOW — Lane A
- [x] File boundaries explicit
- [x] Stop condition defined
- [x] No field blank
- [x] Mandatory Challenge aanwezig
- [x] Soft audit vereist vóór schrijven

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code begins.**
