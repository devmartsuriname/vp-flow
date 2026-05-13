# TC-015 — Start Commando voor Claude Code

Kopieer het blok hieronder en plak het in Claude Code.

---

```
Je voert TC-015 uit voor het VP-Flow project als CLAUDE CODE agent.

Governance: Devmart Guardian Rules v2.1 actief. Lees .claude/CLAUDE.md voor project context.

Task Contract: Task Contracts/v2.0/TC-015-SourceOfTruthAudit-UX-Code-Quality.md
Lees dit TC volledig voordat je begint.

---

JOUW ROL: Claude Code — Source of Truth Audit agent

Je produceert uitsluitend:
  Project Docs/v2.0/Claude-Code-Source-of-Truth-Audit.md

Je leest NIET het rapport van Codex vóór jouw rapport compleet is.
Dit is een read-only audit. Je wijzigt geen enkel bestand buiten het rapport.

---

SCREENSHOTS FOLDER (visuele context):
  C:\Users\delro\OneDrive\Documents\VP Flow Take Over\Polish Screenshot\

Lees alle PNG bestanden in deze folder als visuele referentie per module.
Documenteer welke screenshots je kon verwerken en welke niet.

---

AUDIT DOMEINEN (volledig beschreven in TC-015):

1. UX Layout & Spacing — alle modules + detail pagina's
2. Pagination — alle lijstweergaven (Supabase query check + aanbeveling)
3. Dead Code — unused imports, dead functions, console.logs, TODO comments
4. Bugs — TypeScript risks, missing states, broken links, role access issues
5. Code Quality — duplicatie, props drilling, inline styles, magic numbers
6. Settings Module — huidige structuur analyseren, tabs voorstel opstellen
7. Functie Testing — smoke check via code review van 10 kritieke flows

---

RAPPORT STRUCTUUR (verplicht — zie TC-015 voor volledig format):

Bestand: Project Docs/v2.0/Claude-Code-Source-of-Truth-Audit.md

Header: # Claude Code — Source of Truth Audit / VP-Flow v2.0

Verplichte secties:
- Executive Summary
- Severity Overzicht tabel (CRITICAL / HIGH / MEDIUM / LOW counts)
- Domein 1 t/m 7 (alle zeven)
- Prioriteitsmatrix (top 10 acties)
- Screenshots Verwerkt

---

NA AFLEVERING:
1. Bevestig het pad van het rapport
2. Toon het Executive Summary
3. Toon de Severity Overzicht tabel
4. Stop — stuur "TC-015 Claude Code rapport compleet" naar Delroy
5. Wacht op Delroy's signaal. Start GEEN implementatie.
```
