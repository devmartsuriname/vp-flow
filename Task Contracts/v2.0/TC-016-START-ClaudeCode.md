# TC-016 — Start Commando voor Claude Code

Kopieer het blok hieronder en plak het in Claude Code.

---

```
Je voert TC-016 uit voor het VP-Flow project als CLAUDE CODE agent.

Governance: Devmart Guardian Rules v2.1 actief. Lees .claude/CLAUDE.md voor project context.

Task Contract: Task Contracts/v2.0/TC-016-TemplateCleanup-DeadCode.md
Lees dit TC volledig voordat je begint.

---

JOUW ROL: Claude Code — Template & Dead Code Cleanup agent

Execution Mode: SAFE MODE
Risk: LOW — Lane A (geen PRE restore point vereist, wel POST restore point)
Governance: Devmart Guardian Rules v2.1

---

REPO ROOT:
  C:\Users\delro\OneDrive\Documents\Devmart Github Repos\vp-flow

---

TAKEN (in volgorde — volledige scope staat in TC-016):

1. VERIFICATIE EERST — scan imports vóór je iets verwijdert:
   Verifieer per bestand/map dat het niet geïmporteerd wordt door enig actief bestand.
   Als een "dead" file toch een import blijkt te hebben: STOP, rapporteer aan Delroy.

2. Verwijder dead template routes (alleen als verified dead):
   - src/app/(admin)/(layouts)/dark-mode/
   - src/app/(admin)/(layouts)/dark-sidenav/
   - src/app/(admin)/(layouts)/dark-topnav/
   - src/app/(admin)/(layouts)/hidden-sidenav/
   - src/app/(admin)/(layouts)/small-sidenav/

3. Verwijder dead component files (alleen als verified dead):
   - ThemeCustomizer, ComponentContainerCard, CustomFlatpickr (src/components/)
   - useModal, useFileUploader (src/hooks/)

4. Verwijder console.log / debugger statements uit src/:
   - Prioriteit: console.log('bvdfbgd', changeTheme) in DarkMode.tsx
   - Scan daarna alle overige console.log / console.error / debugger in src/
   - Uitzondering: statements binnen expliciete try/catch error-handling — laat staan

5. Fix '+' placeholder-artefacten boven filterkaart op list-pages:
   - src/app/(admin)/appointments/page.tsx
   - src/app/(admin)/cases/page.tsx
   - src/app/(admin)/documents/page.tsx
   - src/app/(admin)/notes/page.tsx
   - src/app/(admin)/incoming-post/page.tsx

6. Fix AdminLayout footer: voeg min-vh-100 flex toe zodat footer altijd onderaan staat
   - src/components/layout/AdminLayout.tsx (of equivalent pad)

7. Bouw validatie:
   npm run lint  → moet 0 errors geven
   npm run build → moet 0 errors geven

8. Schrijf POST restore point:
   Project Restore Points/RP_TemplateCleanup_POST_TC016.md

---

FILE BOUNDARY (strikt):

ALLOWED TO WRITE/DELETE:
  src/app/(admin)/(layouts)/dark-mode/      (verwijderen)
  src/app/(admin)/(layouts)/dark-sidenav/   (verwijderen)
  src/app/(admin)/(layouts)/dark-topnav/    (verwijderen)
  src/app/(admin)/(layouts)/hidden-sidenav/ (verwijderen)
  src/app/(admin)/(layouts)/small-sidenav/  (verwijderen)
  src/components/ThemeCustomizer            (verwijderen indien dead)
  src/components/ComponentContainerCard     (verwijderen indien dead)
  src/components/CustomFlatpickr            (verwijderen indien dead)
  src/hooks/useModal                        (verwijderen indien dead)
  src/hooks/useFileUploader                 (verwijderen indien dead)
  src/app/(admin)/appointments/page.tsx     (alleen '+' artefact)
  src/app/(admin)/cases/page.tsx            (alleen '+' artefact)
  src/app/(admin)/documents/page.tsx        (alleen '+' artefact)
  src/app/(admin)/notes/page.tsx            (alleen '+' artefact)
  src/app/(admin)/incoming-post/page.tsx    (alleen '+' artefact)
  src/components/layout/AdminLayout.tsx     (alleen min-vh-100 fix)
  console.log / debugger in src/            (verwijderen)

FORBIDDEN:
  Alle actief geïmporteerde bestanden buiten bovenstaande lijst
  src/context/ — niet aanraken
  Migraties aanmaken — verboden
  git push — verboden (Delroy pusht zelf)
  TC-017 of TC-018 scope — niet aanraken

---

STOP CONDITIONS:
  Stop als een "dead" file toch een actieve import blijkt te hebben.
  Rapporteer exact welk bestand en welke import. Wacht op Delroy's signaal.

NA AFLEVERING:
1. Toon lijst van verwijderde bestanden/mappen
2. Toon lijst van verwijderde console.log regels (bestand + regelnummer)
3. Toon npm run lint output (0 errors)
4. Toon npm run build output (0 errors)
5. Bevestig pad POST restore point
6. Stop — stuur "TC-016 compleet" naar Delroy
7. Wacht op Delroy's signaal. Start TC-017 NIET automatisch.
```
