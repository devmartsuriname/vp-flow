# TC-014 Step 3B — Start Commando voor Claude Code

Kopieer het commando blok hieronder en plak het in Claude Code.

---

## START COMMANDO

```
Je voert TC-014 Step 3B uit voor het VP-Flow project.

Governance: Devmart Guardian Rules v2.1 actief. Lees CLAUDE.md voor alle regels.

Task Contract: Task Contracts/v2.0/TC-014-DesignStyleGuide-LogoSet-Phase1D.md
(Boundary is uitgebreid na Step 3A audit — lees het TC opnieuw voor de actuele file boundary.)

Audit resultaten: logo-source/CLAUDE-CODE-START-STEP-3A.md (referenties + bevindingen)

---

STEP 3B — LOGO VERVANGING (Lane B — PRE restore point VERPLICHT vóór enig schrijven)

VOLGORDE IS STRIKT:

STAP 0 — PRE restore point
Maak aan: Project Restore Points/v2.0/RP_LogoSet_PRE_TC014.md
Documenteer: huidige staat van alle te wijzigen bestanden (paths, imports, icon namen).
Bevestig aanmaak aan Delroy. Begin pas daarna met schrijven.

STAP 1 — PNG genereren vanuit SVG bron
Bron: logo-source/vp-flow-icon-boxed.svg (512×512 high-res)
Gebruik sharp (installeer indien nodig: npm install sharp --save-dev) of rsvg-convert.
Genereer en schrijf naar public/:
  - public/favicon-16.png       (16×16)
  - public/favicon-32.png       (32×32)
  - public/icon-192.png         (192×192)
  - public/icon-512.png         (512×512)
  - public/icon-512-maskable.png (512×512 — zelfde als icon-512, content is al gecentreerd)

STAP 2 — SVG bestanden kopiëren naar public/
Kopieer vanuit logo-source/:
  - logo-source/vp-flow-logo-dark.svg  →  public/vp-flow-logo-dark.svg
  - logo-source/vp-flow-logo-light.svg →  public/vp-flow-logo-light.svg
  - logo-source/vp-flow-icon.svg       →  public/vp-flow-icon.svg

STAP 3 — vite.config.ts updaten
Wijzig ALLEEN de volgende waarden (geen andere config aanraken):
  - theme_color: '#1e3a5f' → '#7e67fe'
  - background_color: '#0f172a' → '#191e23'
  - icons array entry 0: src 'pwa-192x192.png' → 'icon-192.png'
  - icons array entry 1: src 'pwa-512x512.png' → 'icon-512.png'
  - icons array entry 2: src 'pwa-512x512.png', purpose 'maskable' → src 'icon-512-maskable.png'
  - includeAssets: voeg 'vp-flow-logo-dark.svg', 'vp-flow-logo-light.svg', 'vp-flow-icon.svg',
                       'favicon-16.png', 'favicon-32.png', 'icon-192.png', 'icon-512.png',
                       'icon-512-maskable.png' toe; verwijder 'pwa-192x192.png', 'pwa-512x512.png'

STAP 4 — index.html updaten
Wijzig ALLEEN:
  - meta name="theme-color" content="#1e3a5f" → content="#7e67fe"
  - link rel="apple-touch-icon" href="pwa-192x192.png" → href="icon-192.png"
  (manifest href blijft: manifest.webmanifest — gegenereerd door VitePWA)

STAP 5 — Auth componenten updaten (wrong-logo bug fix)
In elk van de volgende bestanden:
  - src/app/(other)/auth/sign-in/components/SignIn.tsx
  - src/app/(other)/auth/sign-up/components/SignUp.tsx
  - src/app/(other)/auth/reset-password/components/ResetPassword.tsx
  - src/app/(other)/auth/lock-screen/components/LockScreen.tsx

Vervang:
  import Logo from '@assets/images/vpflow-logo-light.png'
  →
  const Logo = '/vp-flow-logo-dark.svg'

En het img element: height={40} alt="VP-Flow" — behoud height en alt, verander alleen src.

NB: gebruik /vp-flow-logo-dark.svg (public/ pad via absolute URL) in plaats van een bundled import,
zodat het SVG rechtstreeks door de browser geserveerd wordt. Dit elimineert de bundler afhankelijkheid.

STAP 6 — LogoBox.tsx updaten (sidebar logo)
Bestand: src/components/wrapper/LogoBox.tsx
Vervang de drie PNG imports door SVG public/ paden:
  import logoDark from '@assets/images/vpflow-logo-dark.png'  →  const logoDark = '/vp-flow-logo-dark.svg'
  import logoLight from '@assets/images/vpflow-logo-light.png' →  const logoLight = '/vp-flow-logo-light.svg'
  import logoSm from '@assets/images/vpflow-logo-sm.png'       →  const logoSm = '/vp-flow-icon.svg'

img tags: behoud bestaande width/height attributen, update alleen src referenties.

STAP 7 — Error404.tsx updaten (boundary extension goedgekeurd door Delroy 2026-05-13)
Bestand: src/app/(other)/error-pages/pages-404/components/Error404.tsx
Vervang oude PNG imports door SVG public/ paden (zelfde patroon als LogoBox.tsx en auth componenten).

STAP 8 — sw-push.js updaten (boundary extension goedgekeurd door Delroy 2026-05-13)
Bestand: public/sw-push.js
Vervang:
  icon: 'pwa-192x192.png' → icon: 'icon-192.png'
  badge: 'pwa-192x192.png' → badge: 'icon-192.png'

STAP 9 — Oude bestanden verwijderen (ALLEEN na grep bevestiging)
Voor elk bestand hieronder: grep de hele codebase op referenties VOOR verwijdering.
Verwijder ALLEEN als grep 0 resultaten teruggeeft.

  public/favicon.ico
  public/pwa-192x192.png
  public/pwa-512x512.png
  src/assets/images/vpflow-logo-dark.png
  src/assets/images/vpflow-logo-light.png
  src/assets/images/vpflow-logo-sm.png

Rapporteer grep resultaten vóór elke verwijdering.

STAP 10 — Lint + build
  npm run lint  → moet exit 0 zijn
  npm run build → moet exit 0 zijn
Rapporteer resultaten.

STAP 11 — POST restore point
Maak aan: Project Restore Points/v2.0/RP_LogoSet_POST_TC014.md
Documenteer: wat gewijzigd, wat verwijderd, grep bevestigingen, lint/build resultaten.

STAP 12 — Stop en rapporteer
Toon:
  - Diff van alle gewijzigde bestanden (compact)
  - Bevestiging dat oude logo bestanden verwijderd zijn (of reden waarom niet)
  - Lint exit code
  - Build exit code
  - Pad naar POST restore point

Wacht op Delroy's signaal. Ga NIET zelfstandig verder.

---

BOUNDARIES (uit TC-014 + goedgekeurde extensions):
Toegestane nieuwe bestanden: zie TC-014 Step 3 Allowed New Files
Toegestane gewijzigde bestanden: zie TC-014 Step 3 Allowed Modified Files (inclusief extensions)
VERBODEN: migraties, RLS, edge functions, auth hooks, .claude/, Task Contracts/
AuthVisualPanel.tsx: NIET aanraken (tekst-only element, geen img — beslissing Delroy 2026-05-13)
```

---

## VERWACHT EINDRESULTAAT

Na Step 3B:
- Auth pagina's tonen correct VP-Flow logo (wrong-logo bug opgelost)
- Sidebar logo is bijgewerkt naar nieuwe SVG set
- PWA icons zijn vervangen (paars, nieuwe bestandsnamen)
- theme-color = #7e67fe, background_color = #191e23
- Oude navy logo bestanden verwijderd
- npm run lint → exit 0
- npm run build → exit 0
- PRE + POST restore points aanwezig
