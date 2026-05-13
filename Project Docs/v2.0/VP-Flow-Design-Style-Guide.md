# VP-Flow — Design Style Guide

**Status:** DRAFT
**TC:** TC-014 — Design Style Guide + Logo Set — Phase 1D
**Step:** 1 of 3 (Lane A, read-only documentation)
**Date:** 2026-05-12
**Authority:** Delroy (Devmart)

---

## 0. Source Files

This guide is extracted verbatim from the following Darkone SCSS sources. It does NOT introduce new tokens — it documents what exists.

| File | Purpose |
|---|---|
| `src/assets/scss/config/_variables.scss` | Base tokens (colors, typography, spacing, components) |
| `src/assets/scss/config/_variables-dark.scss` | Dark-mode token overrides |
| `src/assets/scss/config/_theme-mode.scss` | `:root` CSS custom properties, sidebar/topbar palettes |
| `src/assets/scss/pages/_authentication.scss` | Auth split-screen layout classes |

No `_custom.scss` file exists in `src/assets/scss/config/`.

The SCSS prefix is `$prefix: 'bs-'`. Every CSS custom property is therefore emitted as `--bs-*`.

> **Note on tinted/shaded values.** Bootstrap's `tint-color($c, P%)` mixes `$c` with `$white` at `P%` toward white; `shade-color($c, P%)` mixes with `$black` at `P%` toward black. The resolved hex values for `*-100…*-900` palettes, `*-text-emphasis`, `*-bg-subtle`, and `*-border-subtle` are computed at SCSS compile time. Where a token resolves dynamically, this guide lists the formula plus the base color so the value can be reproduced; exact compiled hex values for derived tints/shades require running the Sass compiler.

---

## 1. Color Palette

### 1.1 Grayscale (base hex values)

| SCSS token | Hex | Bootstrap CSS var |
|---|---|---|
| `$white` | `#ffffff` | `--bs-white` |
| `$gray-100` | `#f8f9fa` | `--bs-gray-100` |
| `$gray-200` | `#eef2f7` | `--bs-gray-200` |
| `$gray-300` | `#d8dfe7` | `--bs-gray-300` |
| `$gray-400` | `#b0b0bb` | `--bs-gray-400` |
| `$gray-500` | `#8486a7` | `--bs-gray-500` |
| `$gray-600` | `#687d92` | `--bs-gray-600` |
| `$gray-700` | `#424e5a` | `--bs-gray-700` |
| `$gray-800` | `#36404a` | `--bs-gray-800` |
| `$gray-900` | `#21252e` | `--bs-gray-900` |
| `$black` | `#000000` | `--bs-black` |

### 1.2 Brand & accent colors (base hex)

| SCSS token | Hex | Bootstrap CSS var |
|---|---|---|
| `$blue` | `#1a80f8` | `--bs-blue` |
| `$indigo` | `#53389f` | `--bs-indigo` |
| `$purple` | `#7e67fe` | `--bs-purple` |
| `$pink` | `#ff86c8` | `--bs-pink` |
| `$red` | `#ed321f` | `--bs-red` |
| `$orange` | `#f0934e` | `--bs-orange` |
| `$yellow` | `#fb9f68` | `--bs-yellow` |
| `$green` | `#21d760` | `--bs-green` |
| `$teal` | `#040505` | `--bs-teal` |
| `$cyan` | `#1ab0f8` | `--bs-cyan` |

### 1.3 Theme color mapping (light mode)

| Role token | = | Hex |
|---|---|---|
| `$primary` | `$purple` | `#7e67fe` |
| `$secondary` | `$gray-700` | `#424e5a` |
| `$success` | `$green` | `#21d760` |
| `$info` | `$cyan` | `#1ab0f8` |
| `$warning` | `$orange` | `#f0934e` |
| `$danger` | `$red` | `#ed321f` |
| `$light` | `$gray-200` | `#eef2f7` |
| `$dark` | `$gray-900` | `#21252e` |

Bootstrap CSS variables: `--bs-primary`, `--bs-secondary`, `--bs-success`, `--bs-info`, `--bs-warning`, `--bs-danger`, `--bs-light`, `--bs-dark`.

### 1.4 Color scales (100 → 900)

For every accent color (`blue`, `indigo`, `purple`, `pink`, `red`, `orange`, `yellow`, `green`, `teal`, `cyan`) the following scale is generated:

| Step | Formula |
|---|---|
| `*-100` | `tint-color($color, 80%)` |
| `*-200` | `tint-color($color, 60%)` |
| `*-300` | `tint-color($color, 40%)` |
| `*-400` | `tint-color($color, 20%)` |
| `*-500` | `$color` (base) |
| `*-600` | `shade-color($color, 20%)` |
| `*-700` | `shade-color($color, 40%)` |
| `*-800` | `shade-color($color, 60%)` |
| `*-900` | `shade-color($color, 80%)` |

### 1.5 Body, surfaces, links (light mode)

| Token | Hex / value | CSS var |
|---|---|---|
| `$body-bg` | `#f8f7fa` | `--bs-body-bg` |
| `$body-color` | `#5d7186` | `--bs-body-color` |
| `$body-secondary-color` | `$gray-600` → `#687d92` | `--bs-secondary-color` |
| `$body-secondary-bg` | `$white` → `#ffffff` | `--bs-secondary-bg` |
| `$body-tertiary-color` | `$gray-700` → `#424e5a` | `--bs-tertiary-color` |
| `$body-tertiary-bg` | `$gray-100` → `#f8f9fa` | `--bs-tertiary-bg` |
| `$body-emphasis-color` | `rgba(#5d7186, .75)` | `--bs-emphasis-color` |
| `$border-color` | `#eaedf1` | `--bs-border-color` |
| `$border-color-translucent` | `rgba(0,0,0,.175)` | `--bs-border-color-translucent` |
| `$link-color` | `$gray-500` → `#8486a7` | `--bs-link-color` |
| `$link-hover-color` | `shade-color($primary, 15%)` | `--bs-link-hover-color` |

### 1.6 Theme-derived semantic palettes (light)

| Token group | Formula |
|---|---|
| `*-text-emphasis` (primary, secondary, success, info, warning, danger) | `shade-color($color, 60%)` |
| `$light-text-emphasis`, `$dark-text-emphasis` | `$gray-700` (`#424e5a`) |
| `*-bg-subtle` | `tint-color($color, 80%)` |
| `$light-bg-subtle` | `mix($gray-100, $white)` |
| `$dark-bg-subtle` | `$gray-400` (`#b0b0bb`) |
| `*-border-subtle` | `tint-color($color, 60%)` |
| `$light-border-subtle` | `$gray-200` (`#eef2f7`) |
| `$dark-border-subtle` | `$gray-500` (`#8486a7`) |

---

## 2. Typography

### 2.1 Font family

| Token | Value |
|---|---|
| `$font-family-primary` | `"Play", sans-serif` |
| `$font-family-secondary` | `"Play", sans-serif` |
| `$font-family-sans-serif` | `$font-family-primary` |
| `$font-family-monospace` | `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` |
| `$font-family-base` | `var(--bs-font-sans-serif)` |
| `$font-family-code` | `var(--bs-font-monospace)` |

Font is loaded from Google Fonts at the top of `_variables.scss`:
`https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap`

### 2.2 Font size scale

| Token | Value | Notes |
|---|---|---|
| `$font-size-root` | `null` | Browser default (16px) |
| `$font-size-base` | `0.875rem` | Body text (≈14px @ 16px root) |
| `$font-size-sm` | `0.875rem * 0.9` = `0.7875rem` | |
| `$font-size-lg` | `1rem` | |
| `$small-font-size` | `0.75rem` | |
| `$sub-sup-font-size` | `.75em` | |
| `$lead-font-size` | `$font-size-base * 1.25` ≈ `1.09375rem` | |
| `$blockquote-font-size` | `$font-size-base * 1.25` ≈ `1.09375rem` | |
| `$initialism-font-size` | `0.75rem` | |
| `$legend-font-size` | `1.5rem` (= `$spacer`) | |

### 2.3 Heading sizes

| Token | Value |
|---|---|
| `$h1-font-size` | `2.25rem` |
| `$h2-font-size` | `1.875rem` |
| `$h3-font-size` | `1.5rem` |
| `$h4-font-size` | `1.125rem` |
| `$h5-font-size` | `0.9375rem` |
| `$h6-font-size` | `0.75rem` |
| `$headings-margin-bottom` | `10px` |
| `$headings-font-family` | `$font-family-secondary` |
| `$headings-font-weight` | `600` |
| `$headings-line-height` | `1.1` |
| `$headings-color` | `var(--bs-headings-color)` |

### 2.4 Display headings

| Token | Value |
|---|---|
| `$display-font-sizes.1` | `5rem` |
| `$display-font-sizes.2` | `4.5rem` |
| `$display-font-sizes.3` | `4rem` |
| `$display-font-sizes.4` | `3.5rem` |
| `$display-font-sizes.5` | `3rem` |
| `$display-font-sizes.6` | `2.5rem` |
| `$display-font-weight` | `300` |
| `$display-line-height` | `1.1` (inherits `$headings-line-height`) |

### 2.5 Font weights

| Token | Value |
|---|---|
| `$font-weight-lighter` | `lighter` |
| `$font-weight-light` | `300` |
| `$font-weight-normal` | `400` |
| `$font-weight-medium` | `500` |
| `$font-weight-semibold` | `600` |
| `$font-weight-bold` | `700` |
| `$font-weight-bolder` | `bolder` |
| `$font-weight-base` | `400` (= `$font-weight-normal`) |

### 2.6 Line heights

| Token | Value |
|---|---|
| `$line-height-base` | `1.5` |
| `$line-height-sm` | `1.25` |
| `$line-height-lg` | `2` |

---

## 3. Spacing

Devmart standard Bootstrap spacing scale, with a customized base spacer.

### 3.1 Spacer scale

| Key | Formula | Value |
|---|---|---|
| `$spacer` | base | `1.5rem` |
| `0` | `0` | `0` |
| `1` | `$spacer * .25` | `0.375rem` |
| `2` | `$spacer * .5` | `0.75rem` |
| `3` | `$spacer` | `1.5rem` |
| `4` | `$spacer * 1.5` | `2.25rem` |
| `5` | `$spacer * 3` | `4.5rem` |

> NOTE: `$spacer = 1.5rem` is a Devmart customization (Bootstrap default is `1rem`). This affects every utility class (`m-*`, `p-*`, gutters, margins) — values are 50% larger than vanilla Bootstrap.

### 3.2 Grid & layout

| Token | Value |
|---|---|
| `$grid-columns` | `12` |
| `$grid-gutter-width` | `$spacer` = `1.5rem` |
| `$grid-row-columns` | `6` |
| `$container-padding-x` | `$grid-gutter-width * 1` = `1.5rem` |

### 3.3 Breakpoints

| Name | Min-width |
|---|---|
| `xs` | `0` |
| `sm` | `576px` |
| `md` | `768px` |
| `lg` | `992px` |
| `xl` | `1200px` |
| `xxl` | `1400px` |

### 3.4 Container max-widths

| Breakpoint | Max-width |
|---|---|
| `sm` | `540px` |
| `md` | `720px` |
| `lg` | `960px` |
| `xl` | `1140px` |
| `xxl` | `1320px` |

### 3.5 Borders & radii

| Token | Value |
|---|---|
| `$border-width` | `1px` |
| `$border-style` | `solid` |
| `$border-color` | `#eaedf1` |
| `$border-radius` | `0.35rem` |
| `$border-radius-sm` | `0.25rem` |
| `$border-radius-lg` | `0.5rem` |
| `$border-radius-xl` | `1rem` |
| `$border-radius-xxl` | `2rem` |
| `$border-radius-pill` | `50rem` |

### 3.6 Shadows

| Token | Value |
|---|---|
| `$box-shadow` | `0px 3px 4px 0px rgba(0, 0, 0, 0.03)` |
| `$box-shadow-sm` | `0 .125rem .25rem rgba(0,0,0,.075)` |
| `$box-shadow-lg` | `0 5px 10px rgba(30, 32, 37, 0.12)` |
| `$box-shadow-inset` | `inset 0 1px 2px rgba(0,0,0,.075)` |

---

## 4. Dark Mode

Activated by `html[data-bs-theme="dark"]`. All overrides live in `_variables-dark.scss` and `_theme-mode.scss`.

### 4.1 Dark body, surfaces & text

| Token | Hex | CSS var |
|---|---|---|
| `$body-color-dark` | `#aab8c5` | `--bs-body-color` |
| `$body-bg-dark` | `#191e23` | `--bs-body-bg` |
| `$body-secondary-color-dark` | `#8391a2` | `--bs-secondary-color` |
| `$body-secondary-bg-dark` | `#1d2329` | `--bs-secondary-bg` |
| `$body-tertiary-color-dark` | `#f1f1f1` | `--bs-tertiary-color` |
| `$body-tertiary-bg-dark` | `#242b33` | `--bs-tertiary-bg` |
| `$body-emphasis-color-dark` | `#dee2e6` | `--bs-emphasis-color` |
| `$border-color-dark` | `#272f37` | `--bs-border-color` |
| `$border-color-translucent-dark` | `#8391a2` | `--bs-border-color-translucent` |
| `$headings-color-dark` | `$body-color-dark` → `#aab8c5` | `--bs-headings-color` |
| `$link-color-dark` | `#afb9cf` | `--bs-link-color` |
| `$link-hover-color-dark` | `shift-color(#afb9cf, -15%)` | `--bs-link-hover-color` |
| `$mark-color-dark` | `$body-color-dark` → `#aab8c5` | — |
| `$mark-bg-dark` | `$yellow-800` (= `shade-color($yellow, 60%)`) | — |

> A second `_variables.scss` block also sets `$body-dark-bg: #22282e` and `$body-dark-color: #aab8c5` — these are alternate dark-body tokens not directly used by `[data-bs-theme="dark"]`. The active dark body bg is `$body-bg-dark = #191e23`.

### 4.2 Dark theme-derived palettes

| Token group | Formula |
|---|---|
| `*-text-emphasis-dark` | `tint-color($color, 40%)` |
| `$light-text-emphasis-dark` | `$gray-100` (`#f8f9fa`) |
| `$dark-text-emphasis-dark` | `$gray-300` (`#d8dfe7`) |
| `*-bg-subtle-dark` | `rgba($color, 15%)` |
| `$light-bg-subtle-dark` | `rgba(var(--bs-light-rgb), .15)` |
| `$dark-bg-subtle-dark` | `rgba(var(--bs-dark-rgb), .15)` |
| `*-border-subtle-dark` | `shade-color($color, 40%)` |
| `$light-border-subtle-dark`, `$secondary-border-subtle-dark` | `$gray-700` (`#424e5a`) |
| `$dark-border-subtle-dark` | `$gray-500` (`#8486a7`) |
| `$form-valid-color-dark`, `$form-valid-border-color-dark` | `$green-300` (= `tint-color(#21d760, 40%)`) |
| `$form-invalid-color-dark`, `$form-invalid-border-color-dark` | `$red-300` (= `tint-color(#ed321f, 40%)`) |

### 4.3 Dark mode `:root` overrides (from `_theme-mode.scss`)

| CSS var | Value |
|---|---|
| `--bs-border-color` | `#272f37` (also `#2f3944` in first block) |
| `--bs-light` | `#242b33` (= `$body-tertiary-bg-dark`) |
| `--bs-dark` | `#f1f1f1` (= `$body-tertiary-color-dark`) |
| `--bs-headings-color` | `#aab8c5` |
| `--bs-input-border-color` | `#3a4551` |
| `--bs-input-focus-border-color` | `#4a5663` |

---

## 5. Component Tokens

### 5.1 Buttons

| Token | Value |
|---|---|
| `$btn-padding-y` | `0.5rem` |
| `$btn-padding-x` | `1.5rem` |
| `$btn-padding-y-sm` | `0.348rem` |
| `$btn-padding-x-sm` | `$spacer * .75` = `1.125rem` |
| `$btn-padding-y-lg` | `0.625rem` |
| `$btn-padding-x-lg` | `$spacer * 1.75` = `2.625rem` |
| `$btn-font-size` | `0.875rem` |
| `$btn-font-size-sm` | `0.7875rem` |
| `$btn-font-size-lg` | `1rem` |
| `$btn-font-weight` | `400` |
| `$btn-line-height` | `1.5` |
| `$btn-border-width` | `var(--bs-border-width)` = `1px` |
| `$btn-border-radius` | `0.35rem` |
| `$btn-border-radius-sm` | `0.25rem` |
| `$btn-border-radius-lg` | `0.5rem` |
| `$btn-box-shadow` | `0px 2px 6px 0px` |
| `$btn-disabled-opacity` | `0.65` |
| `$btn-focus-width` | `0.15rem` |
| `$btn-focus-box-shadow` | `0 0 0 0.15rem rgba($primary, .25)` |
| `$btn-transition` | `color .15s, background-color .15s, border-color .15s, box-shadow .15s ease-in-out` |
| `$btn-hover-bg-shade-amount` | `10%` |
| `$btn-active-bg-shade-amount` | `20%` |

`.btn-primary` resolves to background `#7e67fe`. `.btn-dark` to `#21252e`. Hover/active states use shade/tint formulas above.

### 5.2 Forms (inputs, selects, switches)

| Token | Value |
|---|---|
| `$input-padding-y` / `$input-padding-x` | `0.5rem` / `1.5rem` |
| `$input-font-size` | `0.875rem` |
| `$input-bg` | `var(--bs-secondary-bg)` |
| `$input-color` | `var(--bs-body-color)` |
| `$input-border-color` | `var(--bs-input-border-color)` = `#d8dfe7` (light) / `#3a4551` (dark) |
| `$input-focus-border-color` | `var(--bs-input-focus-border-color)` = `#b0b0bb` (light) / `#4a5663` (dark) |
| `$input-border-radius` | `0.35rem` |
| `$input-box-shadow` | `inset 0 1px 2px rgba(0,0,0,.075)` |
| `$input-focus-box-shadow` | `none` |
| `$input-placeholder-color` | `rgba(var(--bs-secondary-color-rgb), 0.6)` |
| `$form-label-margin-bottom` | `0.4rem` |
| `$form-label-font-weight` | `500` |
| `$form-check-input-width` | `1.112em` |
| `$form-switch-width` | `2em` |

Validation feedback:

| Token | Value |
|---|---|
| `$form-feedback-valid-color` | `$success` = `#21d760` |
| `$form-feedback-invalid-color` | `$danger` = `#ed321f` |

### 5.3 Cards

| Token | Value |
|---|---|
| `$card-spacer-y` / `$card-spacer-x` | `1.5rem` / `1.5rem` |
| `$card-title-spacer-y` | `0.75rem` |
| `$card-title-color` | `var(--bs-headings-color)` |
| `$card-border-width` | `var(--bs-border-width)` = `1px` |
| `$card-border-color` | `var(--bs-border-color)` |
| `$card-border-radius` | `var(--bs-border-radius)` = `0.35rem` |
| `$card-box-shadow` | `var(--bs-box-shadow)` |
| `$card-bg` | `var(--bs-secondary-bg)` |
| `$card-cap-bg` | `transparent` |
| `$card-cap-padding-y` | `1.125rem` (= `$card-spacer-y * .75`) |
| `$card-cap-padding-x` | `1.5rem` |
| `$card-group-margin` | `0.75rem` (= `$grid-gutter-width * .5`) |

### 5.4 Badges

| Token | Value |
|---|---|
| `$badge-font-size` | `0.75em` |
| `$badge-font-weight` | `600` |
| `$badge-color` | `#ffffff` |
| `$badge-padding-y` / `$badge-padding-x` | `3px` / `6px` |
| `$badge-border-radius` | `4px` |

### 5.5 Alerts

| Token | Value |
|---|---|
| `$alert-padding-y` / `$alert-padding-x` | `0.75rem` / `1.25rem` |
| `$alert-margin-bottom` | `1.25rem` |
| `$alert-border-radius` | `0.35rem` |
| `$alert-border-width` | `0` |
| `$alert-link-font-weight` | `700` |
| `$alert-bg-scale` | `-80%` |
| `$alert-border-scale` | `-72%` |
| `$alert-color-scale` | `40%` |

### 5.6 Pagination, modals, dropdowns

| Token | Value |
|---|---|
| `$pagination-padding-y` / `$pagination-padding-x` | `0.375rem` / `0.75rem` |
| `$pagination-bg` | `var(--bs-secondary-bg)` |
| `$pagination-active-bg` | `$primary` = `#7e67fe` |
| `$pagination-hover-bg` | `var(--bs-tertiary-bg)` |
| `$modal-content-bg` | `var(--bs-secondary-bg)` |
| `$dropdown-bg` | `var(--bs-secondary-bg)` |

### 5.7 Layout chrome (sidebar, topbar, footer)

Custom `:root` properties from `_theme-mode.scss`:

| CSS var | Default value |
|---|---|
| `--bs-logo-lg-height` | `26px` |
| `--bs-logo-sm-height` | `24px` |
| `--bs-sidebar-width` | `250px` |
| `--bs-sidebar-width-sm` | `75px` |
| `--bs-sidebar-item-icon-size` | `18px` |
| `--bs-sidebar-item-font-size` | `15px` |
| `--bs-sidebar-item-padding-x` / `-y` | `15px` / `10px` |
| `--bs-sidebar-item-margin-y` | `2px` |
| `--bs-topbar-height` | `70px` |
| `--bs-footer-height` | `60px` |

#### Sidebar palettes

| Mode | `--bs-sidebar-bg` | `-item-color` | `-item-hover-bg` | `-item-hover-color` | `-border-color` |
|---|---|---|---|---|---|
| `data-sidebar-color="light"` | `#ffffff` | `#6e708c` | `#f4f3f6` | `#3d4756` | `#eaedf1` |
| `data-sidebar-color="dark"` | `#393f4a` | `#afb9cf` | `#4697ce` | `#ffffff` | `#272f37` |
| Dark theme (both) | `#1d2329` | `#afb9cf` | `#2a3139` | `#ffffff` | `#272f37` |

#### Topbar palettes

| Mode | `--bs-topbar-bg` | `-item-color` | `-search-bg` |
|---|---|---|---|
| `data-topbar-color="light"` | `#ffffff` | `#707793` | `#f8f7fa` |
| `data-topbar-color="dark"` | `#393f4a` | `#afb9cf` | `#424957` |
| Dark theme (both) | `#1d2329` | `#afb9cf` | `#232a31` |

### 5.8 Focus ring

| Token | Value |
|---|---|
| `$focus-ring-width` | `0.15rem` |
| `$focus-ring-opacity` | `0.25` |
| `$focus-ring-color` | `rgba($primary, 0.25)` = `rgba(126, 103, 254, 0.25)` |
| `$focus-ring-box-shadow` | `0 0 0 0.15rem rgba(126,103,254,.25)` |

### 5.9 Transitions

| Token | Value |
|---|---|
| `$transition-base` | `all .2s ease-in-out` |
| `$transition-fade` | `opacity .15s linear` |
| `$transition-collapse` | `height .35s ease` |
| `$transition-collapse-width` | `width .35s ease` |

### 5.10 Z-index stack

| Layer | Value |
|---|---|
| `$zindex-dropdown` | `1000` |
| `$zindex-sticky` | `1020` |
| `$zindex-fixed` | `1030` |
| `$zindex-offcanvas-backdrop` | `1040` |
| `$zindex-offcanvas` | `1045` |
| `$zindex-modal-backdrop` | `1050` |
| `$zindex-modal` | `1055` |
| `$zindex-popover` | `1070` |
| `$zindex-tooltip` | `1080` |
| `$zindex-toast` | `1090` |

---

## 6. SCSS Token → CSS Variable Mapping

Selected high-traffic mappings (SCSS variable → emitted CSS custom property → resolved value in light mode).

| SCSS token | CSS variable | Light value | Dark value |
|---|---|---|---|
| `$primary` | `var(--bs-primary)` | `#7e67fe` | `#7e67fe` (unchanged) |
| `$secondary` | `var(--bs-secondary)` | `#424e5a` | `#424e5a` (unchanged) |
| `$success` | `var(--bs-success)` | `#21d760` | `#21d760` |
| `$info` | `var(--bs-info)` | `#1ab0f8` | `#1ab0f8` |
| `$warning` | `var(--bs-warning)` | `#f0934e` | `#f0934e` |
| `$danger` | `var(--bs-danger)` | `#ed321f` | `#ed321f` |
| `$light` | `var(--bs-light)` | `#eef2f7` | `#242b33` |
| `$dark` | `var(--bs-dark)` | `#21252e` | `#f1f1f1` |
| `$body-bg` | `var(--bs-body-bg)` | `#f8f7fa` | `#191e23` |
| `$body-color` | `var(--bs-body-color)` | `#5d7186` | `#aab8c5` |
| `$body-secondary-bg` | `var(--bs-secondary-bg)` | `#ffffff` | `#1d2329` |
| `$body-tertiary-bg` | `var(--bs-tertiary-bg)` | `#f8f9fa` | `#242b33` |
| `$border-color` | `var(--bs-border-color)` | `#eaedf1` | `#272f37` |
| `$link-color` | `var(--bs-link-color)` | `#8486a7` | `#afb9cf` |
| `$headings-color` | `var(--bs-headings-color)` | (inherits) | `#aab8c5` |
| `$font-family-primary` | `var(--bs-font-sans-serif)` | `"Play", sans-serif` | same |
| `$border-radius` | `var(--bs-border-radius)` | `0.35rem` | same |
| `$box-shadow` | `var(--bs-box-shadow)` | `0px 3px 4px 0px rgba(0,0,0,0.03)` | same |
| `$input-border-color` | `var(--bs-input-border-color)` | `#d8dfe7` | `#3a4551` |
| `$input-focus-border-color` | `var(--bs-input-focus-border-color)` | `#b0b0bb` | `#4a5663` |

---

## 7. Auth Split-Screen Classes

Defined in `src/assets/scss/pages/_authentication.scss`. Used by the v2.0 split-screen login / sign-up / reset-password / lock-screen layouts.

### 7.1 `body.authentication-bg`

| Property | Value |
|---|---|
| `background` | `var(--bs-body-bg)` |
| `.account-pages` `align-items` | `stretch` |
| `.account-pages` `display` | `flex` |
| `.account-pages` `min-height` | `100vh` |

### 7.2 `.auth-split` (root container)

| Property | Value |
|---|---|
| `display` | `flex` |
| `min-height` | `100vh` |
| `width` | `100%` |

### 7.3 `.auth-split-form` (left/form column)

| Property | Default | `@media (min-width: 992px)` |
|---|---|---|
| `flex` | `0 0 100%` | `0 0 60%` |
| `max-width` | `100%` | `60%` |
| `display` | `flex` | (inherit) |
| `align-items` / `justify-content` | `center` / `center` | (inherit) |
| `padding` | `2.5rem 1.5rem` | `3rem` |
| `background` | `var(--bs-body-bg)` | (inherit) |

`.auth-split-form-inner`: `width: 100%; max-width: 440px;`

### 7.4 `.auth-split-visual` (right/visual column)

Visible from `lg` (≥ 992px) only.

| Property | Value |
|---|---|
| `display` | `none` → `flex` at ≥992px |
| `flex` | `0 0 40%` (≥992px) |
| `max-width` | `40%` (≥992px) |
| `padding` | `3rem` (≥992px) |
| `align-items` / `justify-content` | `center` / `center` |
| `position` | `relative` |
| `overflow` | `hidden` |

**Background (layered):**

```
radial-gradient(circle at 20% 20%, rgba(#7e67fe, 0.55) 0%, transparent 55%),
radial-gradient(circle at 80% 80%, rgba(#53389f, 0.55) 0%, transparent 55%),
linear-gradient(135deg, #53389f 0%, #7e67fe 50%, #21252e 100%)
```

- Primary radial: `rgba($primary, 0.55)` = `rgba(126, 103, 254, 0.55)`
- Indigo radial: `rgba($indigo, 0.55)` = `rgba(83, 56, 159, 0.55)`
- Linear gradient stops: `$indigo` → `$primary` → `$gray-900` (`#53389f` → `#7e67fe` → `#21252e`)

**`::before` pseudo-overlay:** inline SVG icon pattern (documents, badges, shields, checkmarks, chat, calendar) at `stroke="#ffffff"`, `stroke-opacity="0.13"`, `stroke-width="1.4"`. Tiled at `background-size: 520px 520px`, `background-position: center`, `background-repeat: repeat`. `pointer-events: none`.

### 7.5 `.auth-split-visual-content` (centered content block)

| Property | Value |
|---|---|
| `position` | `relative` |
| `z-index` | `1` |
| `color` | `#ffffff` |
| `text-align` | `center` |
| `max-width` | `380px` |

### 7.6 `.auth-split-visual-brand` (large brand wordmark)

| Property | Value |
|---|---|
| `font-family` | `"Play", sans-serif` (= `$font-family-primary`) |
| `font-weight` | `700` |
| `font-size` | `2.5rem` |
| `letter-spacing` | `0.04em` |
| `margin-bottom` | `0.75rem` |
| `color` | `#ffffff` |

### 7.7 `.auth-split-visual-tagline`

| Property | Value |
|---|---|
| `font-size` | `0.95rem` |
| `font-weight` | `400` |
| `line-height` | `1.6` |
| `color` | `rgba(255, 255, 255, 0.85)` |
| `margin-bottom` | `0` |

### 7.8 `.auth-logo` (logo swap by theme)

| State | `.logo-dark` | `.logo-light` |
|---|---|---|
| Default (light theme) | `display: block` | `display: none` |
| `html[data-bs-theme="dark"]` | `display: none` | `display: block` |

`.logo-dark` is the dark-on-light logo shown in light mode; `.logo-light` is the light-on-dark logo shown when dark mode is active. (Step 3 will replace the current images these classes reference.)

---

## 8. Notes for Logo Design (Step 2 input)

The following values from this guide are the binding constraints for Step 2 (Cowork logo generation):

- **Primary brand color:** `#7e67fe` (`$primary` = `$purple`)
- **Secondary brand color:** `#53389f` (`$indigo`)
- **Dark background (logo must read on):** `#191e23` (`$body-bg-dark`)
- **Light background (logo must read on):** `#f8f7fa` (`$body-bg`) and `#ffffff`
- **Brand font for any wordmark:** `"Play"`, weight `700`, `letter-spacing 0.04em`
- **Logo height target (header):** `26px` (lg) / `24px` (sm) — see `--bs-logo-lg-height`, `--bs-logo-sm-height`
- **Brand display on split-screen visual panel:** wordmark `2.5rem`, weight `700`, white
- **PWA maskable safe zone:** center 80% of 512×512 canvas

---

**STATUS: DRAFT — Step 1 complete. Awaiting Delroy signal for Step 2 (Cowork logo design).**
