# PawTrainer — UI Design System

> Dog-training content site · Force-free, science-based positioning
> Designer deliverable for the Hugo + Cloudflare Pages build (see plan `swift-nebula-babbage.md`)

## 1. Design Foundations

### Color System (OKLCH, warm-tinted neutrals — never pure gray)
| Role | Token | Light | Dark |
|---|---|---|---|
| Page bg | `--paper` | `oklch(98% 0.014 85)` | `oklch(17% 0.014 70)` |
| Card | `--surface` | `oklch(99.2% 0.008 85)` | `oklch(21% 0.014 70)` |
| Text | `--ink` | `oklch(26% 0.022 60)` | `oklch(93% 0.01 85)` |
| 2nd text | `--ink-soft` | `oklch(46% 0.02 60)` | `oklch(79% 0.014 80)` |
| Meta | `--ink-faint` | `oklch(52% 0.018 60)` | `oklch(70% 0.012 80)` |
| **Brand** (sage) | `--brand` | `oklch(48% 0.095 155)` | `oklch(74% 0.10 155)` |
| **Accent** (amber) | `--accent` | `oklch(70% 0.135 65)` | `oklch(80% 0.125 70)` |
| Line | `--line` | `oklch(89% 0.016 80)` | `oklch(31% 0.015 75)` |

- **Brand** = sage/forest green → calm, nature, science, force-free.
- **Accent** = warm amber/ochre → CTA only (dog warmth/energy). Used as button bg with dark text for AA contrast. Not used as text on light bg (low contrast).
- Contrast: all text/line pairings verified ≥ 4.5:1 (WCAG AA). `--ink-faint` kept at 52% L to stay AA-safe on `--paper`.

### Typography
- **Display / headings**: `Fraunces` (optical sizing on, soft axis) — editorial, characterful, not Inter.
- **Body / article**: `Newsreader` — designed for long-form reading.
- **UI chrome** (nav, buttons, meta, tags): system sans stack (fast, native).
- Body 17px / line-height 1.7 · measure 68ch · fluid headings via `clamp()`.
- Only **2 webfonts** → protects LCP/RPM (speed is a ranking + revenue factor).

### Spacing (4px base, varied rhythm)
`--sp-1..9` = 4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 / 104 px. Sections breathe at `--sp-8` (72px).

### Radius & shadow
Radius: sm 8 / md 14 / lg 22 / pill 999. Shadows soft, low-opacity warm tint (not gray glow).

## 2. Component Library (built)
- **Header**: sticky, blur, nav links + search + theme toggle + mobile menu.
- **Buttons**: `.btn--primary` (amber CTA), `.btn--brand` (green), `.btn--ghost`.
- **Tags / pills**: `.tag`, `.tag--accent` (cluster labels).
- **Pillar cards**: 4 training clusters (Puppy / Behavior / Commands / Gear).
- **Post cards**: thumbnail + tag + meta + title + excerpt (lates grid).
- **Promise band**: force-free commitment block (brand-green fill).
- **Footer**: 4-col + legal bar.
- **Cookie consent**: GDPR banner, Accept/Manage, localStorage dismiss.
- **Article-only**: breadcrumb, TOC, `.prose` (68ch), **`.ad` AdSense slot** (labelled "Advertisement"), **`.affiliate` Amazon card** (sponsored/nofollow), **`.author-card`** (E-E-A-T bio + cert tag), related grid, medical disclaimer.

## 3. Responsive
- Mobile-first. Breakpoints: 900px (hero/promise collapse), 680px (nav→hamburger, footer 1-col, affiliate/author stack, cookie full-width).
- `clamp()` fluid type; no hidden critical functions on mobile.
- Touch targets ≥ 44px (buttons, icon-btns 42px, nav links padded).

## 4. Accessibility (WCAG AA)
- Contrast ≥ 4.5:1 body / 3:1 large & UI.
- Visible focus ring (3px brand) on all interactive elements.
- Semantic HTML5 (`header/nav/article/aside/footer`), ARIA labels on icon buttons & dialogs.
- `prefers-reduced-motion` disables transitions/animations.
- Zoom-safe (rem units, no `user-scalable=no`).

## 5. Monetization hooks (designed in)
- **AdSense**: `.ad` slot after first content block + before related; labelled per policy.
- **Affiliate**: `.affiliate` card with `rel="sponsored nofollow"`, price, star rating, disclosure note.

## 6. Files
- `styles.css` — tokens + all components (single source of truth)
- `index.html` — homepage (hero, clusters, promise, latest)
- `article.html` — article template (TOC, ad, affiliate, author, related)

## 7. Next steps for build
1. Port tokens/components into Hugo `layouts/` + `assets/css` (PaperMod-compatible or custom theme).
2. Replace gradient/SVG placeholders with real photos (Pinterest-ready 2:3 pins) + optimized WebP.
3. Inject AdSense/Ezoic snippet into `.ad` slots; wire affiliate IDs.
4. Add `sitemap.xml`, `robots.txt`, JSON-LD `Article` schema, GSC + GA4.
