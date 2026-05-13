# TC-014 Step 3A — Start Commando voor Claude Code

Kopieer de volledige tekst hieronder en plak hem in Claude Code om Step 3A te starten.

---

## START COMMANDO

```
Je voert TC-014 Step 3A uit voor het VP-Flow project.

Governance: Devmart Guardian Rules v2.1 actief. Lees CLAUDE.md voor alle regels.

Task Contract: Task Contracts/v2.0/TC-014-DesignStyleGuide-LogoSet-Phase1D.md

---

STEP 3A — SOURCE OF TRUTH AUDIT (read-only, Lane B — geen bestanden schrijven of verwijderen)

De logo set is goedgekeurd door Delroy en staat klaar in:
  logo-source/

Bestanden in logo-source/:
  - vp-flow-logo-dark.svg   → public/ (app header, dark bg)
  - vp-flow-logo-light.svg  → public/ (light bg, print)
  - vp-flow-icon-boxed.svg  → basis voor alle PNG exports (512×512 bron)
  - vp-flow-icon.svg        → standalone mark (optioneel gebruik)
  - vp-flow-logo-set.zip    → download archief (niet naar public/ kopiëren)

Jouw taak in Step 3A is UITSLUITEND een audit — lees bestanden, schrijf niets.

Scan en documenteer ALLE logo/icon referenties in de codebase op deze locaties:

1. public/ — alle .ico, .png, .svg bestanden die momenteel aanwezig zijn
2. index.html — alle <link rel="icon">, <link rel="apple-touch-icon">, <meta> image refs
3. vite.config.ts of vite.config.js — asset referenties
4. public/manifest.json of vite-plugin-pwa config — icons array entries
5. src/layouts/ en src/components/ — <img src=...> of logo component referenties
6. src/app/(other)/auth/ componenten — huidig logo gebruik (verkeerd logo gemeld — documenteer wat het is en waar)
7. Alle andere .tsx/.ts bestanden die logo paden refereren

Produceer een audit tabel in dit formaat:

| File | Reference | Current value | Required format | Required size | Action |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | REPLACE / REMOVE / KEEP |

Stop na de audit tabel. Rapporteer aan Delroy. Wacht op zijn signaal voor Step 3B.

Schrijf geen enkel bestand. Verwijder niets. Wijzig niets. Dit is een pure read-only scan.

Na de audit: maak een korte samenvatting van hoeveel bestanden aangepast moeten worden en welke de hoogste prioriteit hebben (auth pagina staat als eerste).
```

---

## VERWACHT RESULTAAT

Claude Code produceert een audit tabel met alle referenties.
Stop conditie: na de tabel wacht Claude Code op Delroy's signaal voor Step 3B.

## VOLGENDE STAP (na audit goedkeuring)

Wanneer Delroy "Goedgekeurd — start 3B" zegt, start Claude Code Step 3B:
- PRE restore point aanmaken
- PNG bestanden genereren vanuit logo-source/vp-flow-icon-boxed.svg (gebruik sharp of rsvg-convert)
- Alle logo/icon bestanden naar public/ kopiëren/vervangen
- index.html, manifest.json, auth componenten en layout header updaten
- npm run lint → exit 0
- npm run build → exit 0
- POST restore point aanmaken
