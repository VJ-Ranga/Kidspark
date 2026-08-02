# KidSpark Storefront Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `/var/www/KID/index.html` as a real, responsive, accessible affiliate storefront homepage for KidSpark at Home, balancing shop and blog content 50/50.

**Architecture:** A static site with no backend. Content lives in `assets/js/data.js`; pure string-building functions live in `assets/js/render.js`; `assets/js/app.js` is thin DOM glue that mounts rendered HTML into `index.html`. Splitting pure rendering from DOM mounting means the logic where bugs actually hide — HTML escaping, filtering, price formatting — is unit-testable in Node with zero dependencies, while the DOM layer stays trivial enough to verify by eye in a browser.

**Tech Stack:** Hand-written HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript ES modules. Node 22 built-in test runner (`node --test`) for pure logic. ImageMagick for image resizing. Python `http.server` on port 3000 for preview (already configured in `.claude/launch.json`). No frameworks, no build step, no package dependencies.

**Spec:** `docs/superpowers/specs/2026-08-02-kidspark-storefront-homepage-design.md`

## Global Constraints

- **No cart, no checkout, no payment code anywhere.** Every product links out to a third-party merchant.
- **Every outbound merchant link** carries `target="_blank" rel="sponsored nofollow noopener"`.
- **Design tokens are mandatory.** No hardcoded hex values in component CSS — every color, radius, shadow and space references a custom property from `:root`.
- **Body text minimum 17px at line-height 1.7.** Tap targets minimum 48×48px.
- **Text contrast minimum 4.5:1** everywhere, including pastel category cards.
- **All motion honours `prefers-reduced-motion`.**
- **Every `<img>`** has descriptive `alt`, explicit `width` and `height`, and `loading="lazy"` except the hero image.
- **Every interpolated string is HTML-escaped** before insertion. No exceptions, even for data we control.
- **Soft geometry:** 24px card radii, 999px pill buttons. No sharp corners.
- **No aggressive retail styling.** No red sale badges, no countdown urgency, no `SALE!!` copy.
- **Fonts:** Baloo 2 (headings), Nunito (body). Already loaded via Google Fonts in the existing `index.html` — carry that `<link>` over.
- **Container:** 1280px max-width. **Breakpoints:** 1080px, 1080→860px, 860→600px.
- **Preview command:** the project's dev server is started via the `KidSpark` config in `.claude/launch.json` (serves `/var/www/KID` on port 3000). Use the preview tooling, never a raw background shell.
- **Commit after every task.** Repo is at `/var/www/KID`, initialized at commit `e4af891`.

## Deviations from the spec, and why

The spec's §4 file structure lists `assets/js/app.js` as the single script. This plan splits it into `assets/js/render.js` (pure, testable) + `assets/js/app.js` (DOM glue), and adds `tests/render.test.js`. This is a refinement in service of spec §9's verification goals — it makes the escaping rule enforceable by a test rather than by inspection. Everything else follows the spec as written.

## File structure

| File | Responsibility |
|---|---|
| `assets/css/kidspark.css` | Design tokens, then components built on them. The only stylesheet. |
| `assets/js/data.js` | Content only: currency, categories, products, articles, testimonials. No logic. |
| `assets/js/render.js` | Pure functions: escape, format, filter, build HTML strings. No DOM access, no imports from `app.js`. |
| `assets/js/app.js` | Mounts rendered strings into the DOM, wires the mobile menu. No HTML string building. |
| `assets/images/` | Downloaded photography, plus `CREDITS.md`. |
| `tests/render.test.js` | Node unit tests for `render.js`. |
| `styleguide.html` | Renders every token and component. Proof-of-progress checkpoint. |
| `index.html` | The storefront homepage. Static markup for the shell; empty mount points for data-driven sections. |
| `index-blog.html` | The current homepage, archived unchanged. |

---

### Task 1: Design system and styleguide

**Files:**
- Create: `assets/css/kidspark.css`
- Create: `styleguide.html`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties and component classes used by every later task — `.ks-wrap`, `.ks-btn` (with `--primary`, `--outline`, `--merchant` modifiers), `.ks-card`, `.ks-badge`, `.ks-section-head`, `.ks-cat-card` (with `--mint`, `--lilac`, `--peach`, `--sky`, `--blush`, `--butter` modifiers), `.ks-empty`.

- [ ] **Step 1: Create the folder structure**

```bash
mkdir -p /var/www/KID/assets/css /var/www/KID/assets/js /var/www/KID/tests
mkdir -p /var/www/KID/assets/images/{hero,products,blog,testimonials}
```

- [ ] **Step 2: Write the token layer of `assets/css/kidspark.css`**

```css
/* ============================================================
   KidSpark at Home — design system
   Tokens first. Components below reference tokens only.
   ============================================================ */

:root {
  /* Brand */
  --ks-indigo:       #4338CA;
  --ks-indigo-dark:  #3326A8;
  --ks-teal:         #17A08D;
  --ks-teal-dark:    #178072;

  /* Surfaces */
  --ks-cream:  #FFF6E9;
  --ks-amber:  #FFE8C2;
  --ks-mint:   #E3F4F0;
  --ks-sand:   #F7F5EF;
  --ks-white:  #FFFFFF;
  --ks-border: #ECE7DC;

  /* Category pastels */
  --ks-pastel-mint:   #DFF3EE;
  --ks-pastel-lilac:  #EDE7FB;
  --ks-pastel-peach:  #FFE9D6;
  --ks-pastel-sky:    #E4EEFB;
  --ks-pastel-blush:  #FBE4E9;
  --ks-pastel-butter: #FBF0D2;

  /* Text */
  --ks-ink:   #21263A;
  --ks-body:  #5B6373;
  --ks-muted: #7B8394;

  /* Functional — not brand, not retail */
  --ks-error:    #B3261E;  /* form validation only; 4.5:1 on white */
  --ks-whatsapp: #25D366;  /* WhatsApp's own brand green, fixed by them */

  /* Type */
  --ks-font-head: 'Baloo 2', system-ui, sans-serif;
  --ks-font-body: 'Nunito', system-ui, sans-serif;
  --ks-text-h1:    clamp(34px, 5vw, 54px);
  --ks-text-h2:    clamp(26px, 3.4vw, 36px);
  --ks-text-h3:    22px;
  --ks-text-body:  17px;
  --ks-text-small: 15px;
  --ks-text-tiny:  13px;
  --ks-leading:    1.7;

  /* Space — 4px base */
  --ks-s1: 4px;   --ks-s2: 8px;   --ks-s3: 12px;  --ks-s4: 16px;
  --ks-s5: 24px;  --ks-s6: 32px;  --ks-s7: 48px;  --ks-s8: 64px;
  --ks-s9: 88px;

  /* Shape */
  --ks-radius-card: 24px;
  --ks-radius-img:  18px;
  --ks-radius-pill: 999px;

  /* Soft, warm-tinted shadows */
  --ks-shadow-sm: 0 4px 14px rgba(91, 76, 46, 0.07);
  --ks-shadow-md: 0 10px 28px rgba(91, 76, 46, 0.10);
  --ks-shadow-lg: 0 18px 44px rgba(91, 76, 46, 0.13);

  /* Layout */
  --ks-container: 1280px;
  --ks-gutter: 32px;

  --ks-tap: 48px;
  --ks-ease: cubic-bezier(.22,.61,.36,1);
}

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }

body {
  font-family: var(--ks-font-body);
  font-size: var(--ks-text-body);
  line-height: var(--ks-leading);
  color: var(--ks-body);
  background: var(--ks-white);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--ks-font-head);
  color: var(--ks-ink);
  line-height: 1.2;
  margin: 0;
}
h1 { font-size: var(--ks-text-h1); font-weight: 800; }
h2 { font-size: var(--ks-text-h2); font-weight: 700; }
h3 { font-size: var(--ks-text-h3); font-weight: 700; }

a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; display: block; }
::selection { background: var(--ks-amber); }

:focus-visible {
  outline: 3px solid var(--ks-indigo);
  outline-offset: 3px;
  border-radius: var(--ks-s1);
}

.ks-wrap {
  max-width: var(--ks-container);
  margin: 0 auto;
  padding: 0 var(--ks-gutter);
}

.ks-sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
```

- [ ] **Step 3: Append the component layer to `assets/css/kidspark.css`**

```css
/* ---------- Buttons: three variants, one shape ---------- */

.ks-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--ks-s2);
  min-height: var(--ks-tap);
  padding: var(--ks-s3) var(--ks-s5);
  border-radius: var(--ks-radius-pill);
  font-family: var(--ks-font-body);
  font-size: var(--ks-text-body);
  font-weight: 700;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background-color .2s var(--ks-ease),
              border-color .2s var(--ks-ease),
              color .2s var(--ks-ease),
              transform .2s var(--ks-ease);
}
.ks-btn:active { transform: translateY(1px); }
.ks-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

.ks-btn--primary { background: var(--ks-indigo); color: var(--ks-white); }
.ks-btn--primary:hover:not(:disabled) { background: var(--ks-indigo-dark); }

.ks-btn--outline {
  background: transparent; color: var(--ks-ink);
  border-color: var(--ks-border);
}
.ks-btn--outline:hover:not(:disabled) {
  border-color: var(--ks-indigo); color: var(--ks-indigo);
}

/* Merchant = outbound affiliate links ONLY. Never used elsewhere. */
.ks-btn--merchant { background: var(--ks-teal); color: var(--ks-white); }
.ks-btn--merchant:hover:not(:disabled) { background: var(--ks-teal-dark); }

.ks-btn--block { width: 100%; }

/* ---------- Cards ---------- */

.ks-card {
  background: var(--ks-white);
  border: 1px solid var(--ks-border);
  border-radius: var(--ks-radius-card);
  overflow: hidden;
  display: flex; flex-direction: column;
  transition: box-shadow .25s var(--ks-ease), transform .25s var(--ks-ease);
}
.ks-card:hover { box-shadow: var(--ks-shadow-md); transform: translateY(-3px); }
.ks-card__media { position: relative; aspect-ratio: 4 / 3; background: var(--ks-sand); }
.ks-card__media img { width: 100%; height: 100%; object-fit: cover; }
.ks-card__body { padding: var(--ks-s5); display: flex; flex-direction: column; gap: var(--ks-s3); flex: 1; }
.ks-card__title { font-size: var(--ks-text-h3); }
.ks-card__blurb { font-size: var(--ks-text-small); margin: 0; }
.ks-card__foot { margin-top: auto; display: flex; flex-direction: column; gap: var(--ks-s3); }

/* ---------- Badges ---------- */

.ks-badge {
  display: inline-flex; align-items: center; gap: var(--ks-s1);
  padding: var(--ks-s1) var(--ks-s3);
  border-radius: var(--ks-radius-pill);
  font-size: var(--ks-text-tiny); font-weight: 700;
  background: var(--ks-mint); color: var(--ks-ink);
}
.ks-badge--merchant { background: var(--ks-sand); color: var(--ks-body); }
.ks-badge--value    { background: var(--ks-amber); color: var(--ks-ink); }
.ks-badge--float    { position: absolute; top: var(--ks-s3); left: var(--ks-s3); }

/* ---------- Price ---------- */

.ks-price { display: flex; align-items: baseline; gap: var(--ks-s2); }
.ks-price__now { font-family: var(--ks-font-head); font-size: 22px; font-weight: 700; color: var(--ks-ink); }
.ks-price__was { font-size: var(--ks-text-small); color: var(--ks-muted); text-decoration: line-through; }

/* ---------- Section heading ---------- */

.ks-section-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: var(--ks-s4); margin-bottom: var(--ks-s6);
}
.ks-section-head__eyebrow {
  font-size: var(--ks-text-small); font-weight: 800;
  color: var(--ks-teal); text-transform: uppercase; letter-spacing: .06em;
  margin: 0 0 var(--ks-s2);
}
.ks-section-head__link { font-weight: 700; color: var(--ks-indigo); white-space: nowrap; }
.ks-section-head__link:hover { color: var(--ks-indigo-dark); }

/* ---------- Category cards ---------- */

.ks-cat-card {
  display: flex; flex-direction: column; gap: var(--ks-s3);
  padding: var(--ks-s5);
  min-height: 148px;
  border-radius: var(--ks-radius-card);
  color: var(--ks-ink);
  transition: box-shadow .25s var(--ks-ease), transform .25s var(--ks-ease);
}
.ks-cat-card:hover { box-shadow: var(--ks-shadow-md); transform: translateY(-3px); }
.ks-cat-card__name { font-family: var(--ks-font-head); font-size: 19px; font-weight: 700; }
.ks-cat-card__count { font-size: var(--ks-text-small); color: var(--ks-body); }
.ks-cat-card__icon { width: 40px; height: 40px; }

.ks-cat-card--mint   { background: var(--ks-pastel-mint); }
.ks-cat-card--lilac  { background: var(--ks-pastel-lilac); }
.ks-cat-card--peach  { background: var(--ks-pastel-peach); }
.ks-cat-card--sky    { background: var(--ks-pastel-sky); }
.ks-cat-card--blush  { background: var(--ks-pastel-blush); }
.ks-cat-card--butter { background: var(--ks-pastel-butter); }

/* ---------- Empty state ---------- */

.ks-empty {
  padding: var(--ks-s7) var(--ks-s5);
  text-align: center;
  color: var(--ks-muted);
  background: var(--ks-sand);
  border-radius: var(--ks-radius-card);
}

/* ---------- Motion ---------- */

@keyframes ksFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.ks-float { animation: ksFloat 6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Write `styleguide.html`**

A single page with `<head>` loading the Google Fonts `<link>` (copy lines 7–9 of the existing `index.html`) and `assets/css/kidspark.css`. Body contains, inside `.ks-wrap`, these labelled sections:

1. **Colors** — a swatch grid. One tile per token in `:root` under Brand, Surfaces, Category pastels and Text. Each tile shows the token name and hex as text on the swatch.
2. **Type** — h1, h2, h3, body paragraph, small, tiny — each labelled with its token name and rendered size.
3. **Buttons** — all three variants, each shown in default, hover (use a `:hover` note), disabled, and `--block` states.
4. **Cards** — one `.ks-card` with media, title, blurb, price with `was`, merchant badge and a merchant button.
5. **Badges** — all four badge variants.
6. **Category cards** — all six pastel modifiers, each with a placeholder inline SVG icon, name and count.
7. **Empty state** — one `.ks-empty`.

Write the markup by hand. No JavaScript on this page.

- [ ] **Step 5: Verify contrast on every pastel pairing**

Run this check — it computes WCAG contrast of `--ks-ink` (#21263A) against each pastel:

```bash
cd /var/www/KID && node -e '
const ink="#21263A";
const pastels={mint:"#DFF3EE",lilac:"#EDE7FB",peach:"#FFE9D6",sky:"#E4EEFB",blush:"#FBE4E9",butter:"#FBF0D2",
  cream:"#FFF6E9",amber:"#FFE8C2",sand:"#F7F5EF",white:"#FFFFFF"};
const lin=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};
const lum=h=>{const n=parseInt(h.slice(1),16);return 0.2126*lin(n>>16&255)+0.7152*lin(n>>8&255)+0.0722*lin(n&255)};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05)};
let fail=0;
for(const [k,v] of Object.entries(pastels)){
  const r=ratio(ink,v);
  const ok=r>=4.5; if(!ok)fail++;
  console.log((ok?"PASS":"FAIL"), k.padEnd(8), v, r.toFixed(2)+":1");
}
// also check button fills against white text
for(const [k,v] of Object.entries({indigo:"#4338CA",indigoDark:"#3326A8",teal:"#17A08D",tealDark:"#178072"})){
  const r=ratio("#FFFFFF",v); const ok=r>=4.5; if(!ok)fail++;
  console.log((ok?"PASS":"FAIL"), ("white/"+k).padEnd(14), v, r.toFixed(2)+":1");
}
process.exit(fail?1:0);
'
```

Expected: every line prints `PASS`, exit code 0.

If any line prints `FAIL`, darken that token in `:root` until it passes, then re-run. Do not proceed with a failing token.

- [ ] **Step 6: View the styleguide**

Start the preview server using the `KidSpark` configuration from `.claude/launch.json`, navigate to `http://localhost:3000/styleguide.html`, and confirm:
- Fonts render as Baloo 2 (headings) and Nunito (body), not fallbacks.
- All six pastel cards are visually distinct.
- Browser console is clean.

Take a screenshot to share as the progress checkpoint.

- [ ] **Step 7: Commit**

```bash
cd /var/www/KID && git add assets/css/kidspark.css styleguide.html && git commit -m "feat: KidSpark design system tokens, components, and styleguide page"
```

---

### Task 2: Source and optimize real photography

**Files:**
- Create: `assets/images/hero/*.jpg`, `assets/images/products/*.jpg`, `assets/images/blog/*.jpg`, `assets/images/testimonials/*.jpg`
- Create: `assets/images/CREDITS.md`

**Interfaces:**
- Consumes: nothing.
- Produces: image files at the exact paths listed in Step 2's table. Task 3's `data.js` references these paths verbatim.

**Note:** category cards use inline SVG icons, not photographs — no category images are needed.

- [ ] **Step 1: Understand the sourcing method**

Pexels and Unsplash both permit commercial use with no required attribution. Neither is accessible by keyword search without an API key, so:

1. Use web search to find a specific Pexels or Unsplash **photo page** matching the subject (e.g. `pexels wooden stacking toy photo`).
2. Fetch that page and extract the direct CDN image URL (`images.pexels.com/photos/<id>/...` or `images.unsplash.com/photo-<id>`).
3. Download with an explicit width parameter.
4. Record the photo page URL in `CREDITS.md`.

Subjects must match the design direction: warm natural light, unposed, diverse families, real children and parents. Reject glossy studio stock.

- [ ] **Step 2: Download the 18 required images**

| Path | Subject | Width |
|---|---|---|
| `hero/hero-play.jpg` | Mother and toddler playing together on a rug, warm light | 1200 |
| `products/p1-rainbow-stacker.jpg` | Wooden rainbow stacking toy | 600 |
| `products/p2-board-books.jpg` | Stack of children's board books | 600 |
| `products/p3-magnetic-tiles.jpg` | Colourful magnetic building tiles | 600 |
| `products/p4-paint-set.jpg` | Children's paints and brushes | 600 |
| `products/p5-balance-bike.jpg` | Toddler balance bike | 600 |
| `products/p6-suction-bowls.jpg` | Toddler feeding bowls / mealtime | 600 |
| `products/p7-activity-cube.jpg` | Soft fabric baby activity toy | 600 |
| `products/p8-alphabet-puzzle.jpg` | Wooden alphabet puzzle | 600 |
| `products/p9-counting-bears.jpg` | Colourful counting/sorting manipulatives | 600 |
| `products/p10-science-kit.jpg` | Child doing a simple science experiment | 600 |
| `blog/a1-stem-play.jpg` | Child concentrating on a building toy | 800 |
| `blog/a2-reading.jpg` | Parent reading to a child | 800 |
| `blog/a3-indoor-craft.jpg` | Child doing craft indoors | 800 |
| `blog/a4-routine.jpg` | Calm toddler mealtime or bedtime | 800 |
| `testimonials/t1.jpg` | Portrait, woman, warm and natural | 200 |
| `testimonials/t2.jpg` | Portrait, woman, warm and natural | 200 |
| `testimonials/t3.jpg` | Portrait, woman or man, warm and natural | 200 |

Download each with `curl -sSL -o <path> "<cdn-url>"`.

- [ ] **Step 3: Verify every file is a real image, not an error page**

```bash
cd /var/www/KID/assets/images && \
find . -name '*.jpg' | sort | while read f; do
  info=$(identify -format '%m %wx%h' "$f" 2>/dev/null) || { echo "BROKEN $f"; continue; }
  size=$(stat -c%s "$f")
  if [ "$size" -lt 10000 ]; then echo "TOO SMALL $f ($size bytes)"; else echo "OK $f $info $((size/1024))KB"; fi
done; echo "count: $(find . -name '*.jpg' | wc -l)"
```

Expected: 18 `OK` lines, no `BROKEN` or `TOO SMALL`, `count: 18`.

Any file that fails: delete it, find a different photo, download again, re-run.

**Fallback if a specific subject cannot be sourced after three attempts:** generate a soft pastel placeholder locally rather than blocking, and mark it in `CREDITS.md` as `PLACEHOLDER — needs real photo`:

```bash
convert -size 600x450 xc:'#FBF0D2' -gravity center \
  -pointsize 26 -fill '#21263A' -annotate 0 'Product photo\ncoming soon' \
  assets/images/products/<name>.jpg
```

- [ ] **Step 4: Generate responsive variants and strip metadata**

```bash
cd /var/www/KID/assets/images && \
for f in products/*.jpg blog/*.jpg hero/*.jpg; do
  base="${f%.jpg}"
  convert "$f" -strip -quality 82 "$f"
  convert "$f" -strip -resize 400x -quality 82 "${base}-400.jpg"
done && \
echo "total: $(du -sh . | cut -f1)"
```

Expected: completes without error. Total under 3MB — if it exceeds that, lower quality to 75 and re-run.

- [ ] **Step 5: Write `assets/images/CREDITS.md`**

```markdown
# Image credits

All photography sourced from Pexels and Unsplash. Both licenses permit
commercial use with no attribution required. Sources are recorded here as a
provenance record.

Product photographs are stand-ins pending real product shots from the client.

| File | Source | Photographer | License |
|---|---|---|---|
| hero/hero-play.jpg | <photo page URL> | <name> | Pexels |
| ... | | | |
```

Fill one row per downloaded file with the real page URL and photographer name captured in Step 2.

- [ ] **Step 6: Commit**

```bash
cd /var/www/KID && git add assets/images && git commit -m "feat: add sourced photography with credits and responsive variants"
```

---

### Task 3: Content data and pure render functions (TDD)

**Files:**
- Create: `assets/js/data.js`
- Create: `assets/js/render.js`
- Create: `tests/render.test.js`

**Interfaces:**
- Consumes: image paths from Task 2.
- Produces, from `data.js`: `KS_CURRENCY`, `KS_CATEGORIES`, `KS_PRODUCTS`, `KS_ARTICLES`, `KS_TESTIMONIALS`.
  Produces, from `render.js`: `escapeHtml(str) → string`, `formatPrice(amount, currency) → string`, `filterProducts(products, {filter, limit}) → array`, `srcsetFor(imagePath, fullWidth) → string`, `productCard(product, currency) → string`, `categoryCard(category) → string`, `articleCard(article) → string`, `testimonialCard(t) → string`, `emptyState(message) → string`.

- [ ] **Step 1: Write `tests/render.test.js` — the failing tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml, formatPrice, filterProducts, srcsetFor,
  productCard, categoryCard, articleCard, testimonialCard, emptyState
} from '../assets/js/render.js';

const p = {
  id: 'p1', slug: 'test-toy', title: 'Test Toy',
  image: 'assets/images/products/p1.jpg', alt: 'A test toy',
  blurb: 'A blurb.', price: 24.99, wasPrice: null,
  merchant: { name: 'Amazon', url: 'https://example.com/x' },
  category: 'toys', badge: null, featured: true, deal: false
};

test('escapeHtml neutralises all five HTML metacharacters', () => {
  assert.equal(escapeHtml(`<script>"x"&'y'</script>`),
    '&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;');
});

test('escapeHtml handles null and undefined without throwing', () => {
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
});

test('escapeHtml stringifies numbers', () => {
  assert.equal(escapeHtml(42), '42');
});

test('formatPrice renders two decimals with the currency symbol', () => {
  assert.equal(formatPrice(24.9, 'USD'), '$24.90');
  assert.equal(formatPrice(1250, 'LKR'), 'Rs 1,250.00');
});

test('filterProducts returns everything when given no options', () => {
  assert.equal(filterProducts([p, { ...p, id: 'p2' }], {}).length, 2);
});

test('filterProducts applies the predicate then the limit', () => {
  const items = [
    { ...p, id: 'a', featured: true },
    { ...p, id: 'b', featured: true },
    { ...p, id: 'c', featured: false }
  ];
  const out = filterProducts(items, { filter: x => x.featured, limit: 1 });
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 'a');
});

test('filterProducts tolerates a null list', () => {
  assert.deepEqual(filterProducts(null, {}), []);
});

test('productCard escapes a malicious title', () => {
  const html = productCard({ ...p, title: '<img src=x onerror=alert(1)>' }, 'USD');
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;img src=x'));
});

test('productCard marks every merchant link as sponsored and safe', () => {
  const html = productCard(p, 'USD');
  assert.ok(html.includes('rel="sponsored nofollow noopener"'));
  assert.ok(html.includes('target="_blank"'));
});

test('productCard shows the was-price only when one exists', () => {
  assert.ok(!productCard(p, 'USD').includes('ks-price__was'));
  assert.ok(productCard({ ...p, wasPrice: 32 }, 'USD').includes('ks-price__was'));
});

test('productCard includes width, height, alt and lazy loading', () => {
  const html = productCard(p, 'USD');
  assert.ok(html.includes('width='));
  assert.ok(html.includes('height='));
  assert.ok(html.includes('alt="A test toy"'));
  assert.ok(html.includes('loading="lazy"'));
});

test('srcsetFor builds the 400w variant path from a base image path', () => {
  assert.equal(
    srcsetFor('assets/images/products/p1.jpg', 600),
    'assets/images/products/p1-400.jpg 400w, assets/images/products/p1.jpg 600w'
  );
});

test('productCard serves a responsive srcset', () => {
  const html = productCard(p, 'USD');
  assert.ok(html.includes('srcset='));
  assert.ok(html.includes('p1-400.jpg 400w'));
  assert.ok(html.includes('sizes='));
});

test('categoryCard applies the pastel modifier class', () => {
  const html = categoryCard({ id: 'toys', name: 'Toys', tone: 'mint', count: 12, icon: '<svg></svg>', href: '/shop' });
  assert.ok(html.includes('ks-cat-card--mint'));
  assert.ok(html.includes('Toys'));
});

test('articleCard escapes the title and links to the slug', () => {
  const html = articleCard({ slug: 'my-post', title: '<b>Hi</b>', excerpt: 'x',
    image: 'i.jpg', alt: 'a', category: 'Play', readMinutes: 6 });
  assert.ok(html.includes('&lt;b&gt;Hi&lt;/b&gt;'));
  assert.ok(html.includes('/blog/my-post'));
});

test('testimonialCard escapes the quote', () => {
  const html = testimonialCard({ name: 'A', role: 'Mum of two', quote: '<x>', image: 't.jpg' });
  assert.ok(html.includes('&lt;x&gt;'));
});

test('emptyState escapes its message', () => {
  assert.ok(emptyState('<b>none</b>').includes('&lt;b&gt;none&lt;/b&gt;'));
  assert.ok(emptyState('none').includes('ks-empty'));
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd /var/www/KID && node --test tests/
```

Expected: FAIL — cannot find module `../assets/js/render.js`.

- [ ] **Step 3: Write `assets/js/render.js`**

```js
/* Pure render helpers. No DOM access. Safe to import in Node. */

const CURRENCY_SYMBOLS = { USD: '$', LKR: 'Rs ', EUR: '€', GBP: '£' };

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatPrice(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  const n = Number(amount) || 0;
  return symbol + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function filterProducts(products, { filter, limit } = {}) {
  if (!Array.isArray(products)) return [];
  let out = filter ? products.filter(filter) : products.slice();
  if (limit) out = out.slice(0, limit);
  return out;
}

/* Task 2 generates a -400.jpg variant beside every product/blog/hero image. */
export function srcsetFor(imagePath, fullWidth) {
  const base = String(imagePath).replace(/\.jpg$/, '');
  return `${base}-400.jpg 400w, ${imagePath} ${fullWidth}w`;
}

export function productCard(product, currency) {
  const was = product.wasPrice
    ? `<span class="ks-price__was">${escapeHtml(formatPrice(product.wasPrice, currency))}</span>`
    : '';
  const badge = product.badge
    ? `<span class="ks-badge ks-badge--value ks-badge--float">${escapeHtml(product.badge)}</span>`
    : '';
  return `
<article class="ks-card">
  <div class="ks-card__media">
    ${badge}
    <img src="${escapeHtml(product.image)}"
         srcset="${escapeHtml(srcsetFor(product.image, 600))}"
         sizes="(max-width: 600px) 100vw, (max-width: 1080px) 50vw, 300px"
         alt="${escapeHtml(product.alt)}"
         width="600" height="450" loading="lazy">
  </div>
  <div class="ks-card__body">
    <h3 class="ks-card__title">${escapeHtml(product.title)}</h3>
    <p class="ks-card__blurb">${escapeHtml(product.blurb)}</p>
    <div class="ks-card__foot">
      <div class="ks-price">
        <span class="ks-price__now">${escapeHtml(formatPrice(product.price, currency))}</span>
        ${was}
      </div>
      <span class="ks-badge ks-badge--merchant">at ${escapeHtml(product.merchant.name)}</span>
      <a class="ks-btn ks-btn--merchant ks-btn--block"
         href="${escapeHtml(product.merchant.url)}"
         target="_blank" rel="sponsored nofollow noopener">
        View on ${escapeHtml(product.merchant.name)}
        <span aria-hidden="true">↗</span>
        <span class="ks-sr-only">(opens in a new tab)</span>
      </a>
    </div>
  </div>
</article>`;
}

export function categoryCard(category) {
  return `
<a class="ks-cat-card ks-cat-card--${escapeHtml(category.tone)}" href="${escapeHtml(category.href)}">
  <span class="ks-cat-card__icon" aria-hidden="true">${category.icon}</span>
  <span class="ks-cat-card__name">${escapeHtml(category.name)}</span>
  <span class="ks-cat-card__count">${escapeHtml(category.count)} picks</span>
</a>`;
}

export function articleCard(article) {
  return `
<article class="ks-card">
  <a href="/blog/${escapeHtml(article.slug)}">
    <div class="ks-card__media">
      <img src="${escapeHtml(article.image)}"
           srcset="${escapeHtml(srcsetFor(article.image, 800))}"
           sizes="(max-width: 600px) 100vw, 400px"
           alt="${escapeHtml(article.alt)}"
           width="800" height="600" loading="lazy">
    </div>
  </a>
  <div class="ks-card__body">
    <span class="ks-badge">${escapeHtml(article.category)}</span>
    <h3 class="ks-card__title">
      <a href="/blog/${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a>
    </h3>
    <p class="ks-card__blurb">${escapeHtml(article.excerpt)}</p>
    <span class="ks-card__foot">${escapeHtml(article.readMinutes)} min read</span>
  </div>
</article>`;
}

export function testimonialCard(t) {
  return `
<figure class="ks-card ks-testimonial">
  <blockquote class="ks-testimonial__quote">${escapeHtml(t.quote)}</blockquote>
  <figcaption class="ks-testimonial__who">
    <img src="${escapeHtml(t.image)}" alt="" width="56" height="56" loading="lazy">
    <span>
      <strong>${escapeHtml(t.name)}</strong>
      <small>${escapeHtml(t.role)}</small>
    </span>
  </figcaption>
</figure>`;
}

export function emptyState(message) {
  return `<p class="ks-empty">${escapeHtml(message)}</p>`;
}
```

Note: `category.icon` is intentionally **not** escaped — it holds trusted inline SVG authored in `data.js`, never user input. This is the single exception to the escaping rule and it is deliberate.

- [ ] **Step 4: Run the tests to verify they pass**

```bash
cd /var/www/KID && node --test tests/
```

Expected: all 17 tests PASS, exit code 0.

- [ ] **Step 5: Write `assets/js/data.js`**

```js
/* Content for the KidSpark homepage.
   When this moves to CodeIgniter, each array becomes a database table. */

export const KS_CURRENCY = 'USD';   // TODO(client): confirm USD or LKR

const ICON = {
  toys:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>',
  books:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 5v14l8-2 8 2V5l-8 2z"/><path d="M12 7v12"/></svg>',
  stem:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3"/><path d="M8 3h8"/></svg>',
  art:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 0 18c1 0 2-1 2-2s-1-2 0-3 3 0 4-1a9 9 0 0 0-6-12z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/></svg>',
  outdoor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="7" r="3"/><path d="M6 21l3-7h6l3 7M9 14v-3M15 14v-3"/></svg>',
  baby:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 15c1 1 5 1 6 0"/></svg>'
};

export const KS_CATEGORIES = [
  { id: 'toys',    name: 'Toys & Games',     tone: 'mint',   count: 24, icon: ICON.toys,    href: '/shop?cat=toys' },
  { id: 'books',   name: 'Books & Stories',  tone: 'lilac',  count: 18, icon: ICON.books,   href: '/shop?cat=books' },
  { id: 'stem',    name: 'STEM & Learning',  tone: 'peach',  count: 21, icon: ICON.stem,    href: '/shop?cat=stem' },
  { id: 'art',     name: 'Art & Craft',      tone: 'sky',    count: 15, icon: ICON.art,     href: '/shop?cat=art' },
  { id: 'outdoor', name: 'Outdoor & Active', tone: 'blush',  count: 12, icon: ICON.outdoor, href: '/shop?cat=outdoor' },
  { id: 'baby',    name: 'Baby Essentials',  tone: 'butter', count: 19, icon: ICON.baby,    href: '/shop?cat=baby' }
];

/* TODO(client): replace merchant.url values with real affiliate links,
   and prices with current merchant prices. */
export const KS_PRODUCTS = [
  { id:'p1', slug:'wooden-rainbow-stacker', title:'Wooden Rainbow Stacker',
    image:'assets/images/products/p1-rainbow-stacker.jpg', alt:'Wooden rainbow stacking arches in soft colours',
    blurb:'Open-ended play that grows with them from 1 to 5.', price:24.99, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'toys', badge:null, featured:true, deal:false },

  { id:'p2', slug:'board-book-set', title:'First Words Board Book Set',
    image:'assets/images/products/p2-board-books.jpg', alt:'Stack of colourful chunky board books',
    blurb:'Ten chunky books built to survive real toddlers.', price:19.50, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'books', badge:null, featured:true, deal:false },

  { id:'p3', slug:'magnetic-tile-starter', title:'Magnetic Tile Starter Set',
    image:'assets/images/products/p3-magnetic-tiles.jpg', alt:'Translucent coloured magnetic building tiles',
    blurb:'The one toy our testers kept coming back to.', price:39.99, wasPrice:null,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'stem', badge:null, featured:true, deal:false },

  { id:'p4', slug:'washable-paint-set', title:'Washable Toddler Paint Set',
    image:'assets/images/products/p4-paint-set.jpg', alt:'Pots of childrens paint with brushes',
    blurb:'Genuinely washable. We checked, on a sofa.', price:14.75, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'art', badge:null, featured:true, deal:false },

  { id:'p5', slug:'toddler-balance-bike', title:'Toddler Balance Bike',
    image:'assets/images/products/p5-balance-bike.jpg', alt:'Small wooden balance bike for toddlers',
    blurb:'Skips stabilisers entirely. Ages 2 to 5.', price:58.00, wasPrice:72.00,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'outdoor', badge:'Best value', featured:false, deal:true },

  { id:'p6', slug:'suction-bowl-set', title:'Silicone Suction Bowl Set',
    image:'assets/images/products/p6-suction-bowls.jpg', alt:'Silicone toddler bowls in pastel colours',
    blurb:'Stays on the table. Mostly.', price:16.20, wasPrice:21.00,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'baby', badge:'Best value', featured:false, deal:true },

  { id:'p7', slug:'soft-activity-cube', title:'Soft Cloth Activity Cube',
    image:'assets/images/products/p7-activity-cube.jpg', alt:'Soft fabric baby activity cube',
    blurb:'Quiet, washable, and good for the pram.', price:12.99, wasPrice:17.50,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'baby', badge:'Best value', featured:false, deal:true },

  { id:'p8', slug:'alphabet-puzzle-board', title:'Wooden Alphabet Puzzle Board',
    image:'assets/images/products/p8-alphabet-puzzle.jpg', alt:'Wooden alphabet puzzle with coloured letters',
    blurb:'Letters they can hold while they learn them.', price:18.40, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'stem', badge:null, featured:false, deal:false },

  { id:'p9', slug:'counting-bears', title:'Counting Bears & Sorting Cups',
    image:'assets/images/products/p9-counting-bears.jpg', alt:'Colourful counting bears with sorting cups',
    blurb:'Sorting, counting, and one very long car journey.', price:22.00, wasPrice:null,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'stem', badge:null, featured:false, deal:false },

  { id:'p10', slug:'first-science-kit', title:'My First Science Lab Kit',
    image:'assets/images/products/p10-science-kit.jpg', alt:'Child doing a simple colour-mixing science experiment',
    blurb:'Six experiments using things you already own.', price:31.90, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'stem', badge:null, featured:false, deal:false }
];

export const KS_ARTICLES = [
  { slug:'stem-toys-that-build-focus', title:'Play That Actually Builds Focus',
    excerpt:'Not every "educational" toy earns the label. Here is what to look for, and what to skip.',
    image:'assets/images/blog/a1-stem-play.jpg', alt:'Child concentrating on a building toy',
    category:'STEM & Learning', categoryId:'stem', readMinutes:8, featured:true },

  { slug:'ten-minutes-a-day-reading', title:'Ten Minutes a Day: Reading Habits That Stick',
    excerpt:'A small, repeatable routine beats an ambitious one you abandon by Thursday.',
    image:'assets/images/blog/a2-reading.jpg', alt:'Parent reading a picture book with a child',
    category:'Books & Stories', categoryId:'books', readMinutes:6, featured:false },

  { slug:'rainy-afternoon-rescue', title:'Rainy Afternoon Rescue: 12 Indoor Activities',
    excerpt:'Twelve things to do with what is already in your kitchen drawer.',
    image:'assets/images/blog/a3-indoor-craft.jpg', alt:'Child making a craft project indoors',
    category:'Art & Craft', categoryId:'art', readMinutes:5, featured:false },

  { slug:'sleep-snacks-and-sanity', title:'Sleep, Snacks and Sanity',
    excerpt:'A toddler routine built for real days, not the ones in the parenting books.',
    image:'assets/images/blog/a4-routine.jpg', alt:'Toddler eating calmly at a small table',
    category:'Baby Essentials', categoryId:'baby', readMinutes:7, featured:false }
];

/* TODO(client): PLACEHOLDER testimonials — written copy, not real customers.
   These MUST be replaced with genuine, permissioned quotes before the site
   goes live. Publishing invented testimonials is a real legal and trust risk. */
export const KS_TESTIMONIALS = [
  { name:'Placeholder name', role:'Mum of two, Colombo',
    quote:'Placeholder testimonial copy awaiting a real, permissioned quote from the client.',
    image:'assets/images/testimonials/t1.jpg' },
  { name:'Placeholder name', role:'Dad of a 3-year-old',
    quote:'Placeholder testimonial copy awaiting a real, permissioned quote from the client.',
    image:'assets/images/testimonials/t2.jpg' },
  { name:'Placeholder name', role:'Mum of three, Kandy',
    quote:'Placeholder testimonial copy awaiting a real, permissioned quote from the client.',
    image:'assets/images/testimonials/t3.jpg' }
];
```

- [ ] **Step 6: Verify data integrity against the files on disk**

```bash
cd /var/www/KID && node -e '
import("./assets/js/data.js").then(async d => {
  const fs = await import("node:fs");
  let bad = 0;
  const imgs = [
    ...d.KS_PRODUCTS.map(p => p.image),
    ...d.KS_ARTICLES.map(a => a.image),
    ...d.KS_TESTIMONIALS.map(t => t.image)
  ];
  for (const i of imgs) if (!fs.existsSync(i)) { console.log("MISSING", i); bad++; }
  const cats = new Set(d.KS_CATEGORIES.map(c => c.id));
  for (const p of d.KS_PRODUCTS) if (!cats.has(p.category)) { console.log("BAD CATEGORY", p.id, p.category); bad++; }
  const feat = d.KS_ARTICLES.filter(a => a.featured);
  if (feat.length !== 1) { console.log("EXPECTED exactly 1 featured article, got", feat.length); bad++; }
  const guidePicks = d.KS_PRODUCTS.filter(p => p.category === feat[0]?.categoryId);
  if (guidePicks.length < 3) { console.log("EDITORS GUIDE needs >=3 products in", feat[0]?.categoryId, "got", guidePicks.length); bad++; }
  console.log(bad ? "FAILED: " + bad : "OK: images, categories, featured article, guide picks all valid");
  process.exit(bad ? 1 : 0);
});
'
```

Expected: `OK: images, categories, featured article, guide picks all valid`, exit 0.

- [ ] **Step 7: Commit**

```bash
cd /var/www/KID && git add assets/js/data.js assets/js/render.js tests/render.test.js && git commit -m "feat: content data and tested pure render functions"
```

---

### Task 4: Page shell — header, hero, footer

**Files:**
- Create: `index-blog.html` (copy of current `index.html`)
- Modify: `index.html` (full rewrite)
- Create: `assets/js/app.js`
- Modify: `assets/css/kidspark.css` (append header/hero/footer styles)

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: mount-point IDs that Tasks 5–7 fill — `#ks-categories`, `#ks-featured`, `#ks-articles`, `#ks-guide-picks`, `#ks-deals`, `#ks-testimonials`. `app.js` exports nothing; it self-initialises on `DOMContentLoaded`.

- [ ] **Step 1: Archive the existing homepage**

```bash
cd /var/www/KID && git mv index.html index-blog.html && git commit -m "chore: archive blog homepage as index-blog.html"
```

- [ ] **Step 2: Write `index.html` — head and shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KidSpark at Home — Toys, Books and Ideas Parents Actually Trust</title>
<meta name="description" content="Hand-picked toys, books and learning kits for babies and toddlers, chosen and tested by parents. Plus practical play and routine guides.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/kidspark.css">
<script type="module" src="assets/js/app.js"></script>
</head>
<body>

<a class="ks-skip" href="#main">Skip to content</a>

<header class="ks-header">
  <div class="ks-wrap ks-header__inner">
    <a class="ks-logo" href="/">KidSpark<span>at Home</span></a>

    <nav class="ks-nav" aria-label="Main">
      <a class="ks-nav__link" href="/shop">Shop</a>
      <a class="ks-nav__link" href="/shop?cat=toys">Toys</a>
      <a class="ks-nav__link" href="/shop?cat=books">Books</a>
      <a class="ks-nav__link" href="/shop?cat=stem">Learning</a>
      <a class="ks-nav__link" href="/blog">Blog</a>
      <a class="ks-nav__link" href="/about">About</a>
    </nav>

    <div class="ks-header__actions">
      <a class="ks-btn ks-btn--primary" href="#newsletter">Join free</a>
      <button class="ks-hamburger" id="ks-menu-btn" type="button"
              aria-expanded="false" aria-controls="ks-mobile-nav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <nav class="ks-mobile-nav" id="ks-mobile-nav" aria-label="Mobile" hidden>
    <a class="ks-nav__link" href="/shop">Shop</a>
    <a class="ks-nav__link" href="/shop?cat=toys">Toys</a>
    <a class="ks-nav__link" href="/shop?cat=books">Books</a>
    <a class="ks-nav__link" href="/shop?cat=stem">Learning</a>
    <a class="ks-nav__link" href="/blog">Blog</a>
    <a class="ks-nav__link" href="/about">About</a>
  </nav>
</header>

<main id="main">

  <section class="ks-hero">
    <div class="ks-wrap ks-hero__grid">
      <div class="ks-hero__copy">
        <p class="ks-hero__eyebrow">Chosen by parents, tested by toddlers</p>
        <h1>Toys and books<br>worth the space<br>they take up.</h1>
        <p class="ks-hero__sub">
          We try things at home with real children, then recommend the small
          number that survive. No sponsored lists, no filler.
        </p>
        <div class="ks-hero__btns">
          <a class="ks-btn ks-btn--primary" href="#featured">Browse our picks</a>
          <a class="ks-btn ks-btn--outline" href="#articles">Read the guides</a>
        </div>
        <p class="ks-hero__disclosure">
          Some links earn us a small commission. It never changes what we recommend
          or what you pay. <a href="/disclosure">How this works</a>.
        </p>
      </div>
      <div class="ks-hero__media">
        <img src="assets/images/hero/hero-play.jpg"
             srcset="assets/images/hero/hero-play-400.jpg 400w, assets/images/hero/hero-play.jpg 1200w"
             sizes="(max-width: 860px) 100vw, 600px"
             alt="A mother and her toddler playing together with wooden toys on a rug"
             width="1200" height="900" fetchpriority="high">
      </div>
    </div>
  </section>

  <!-- Tasks 5-7 fill these sections -->

</main>

<footer class="ks-footer">
  <div class="ks-wrap">
    <div class="ks-footer__grid">
      <div>
        <a class="ks-logo" href="/">KidSpark<span>at Home</span></a>
        <p>Practical play ideas and honest product picks for babies and toddlers.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <a href="/shop?cat=toys">Toys &amp; Games</a>
        <a href="/shop?cat=books">Books &amp; Stories</a>
        <a href="/shop?cat=stem">STEM &amp; Learning</a>
        <a href="/shop?cat=art">Art &amp; Craft</a>
      </div>
      <div>
        <h4>Read</h4>
        <a href="/blog">All articles</a>
        <a href="/learning-tips">Learning tips</a>
        <a href="/activities">Activities</a>
        <a href="/parenting">Parenting</a>
      </div>
      <div>
        <h4>KidSpark</h4>
        <a href="/about">About us</a>
        <a href="/contact">Contact</a>
        <a href="/disclosure">Affiliate disclosure</a>
        <a href="/privacy">Privacy policy</a>
      </div>
    </div>
    <div class="ks-footer__base">
      <p>
        KidSpark at Home is a participant in affiliate programmes. We may earn a
        commission on qualifying purchases made through links on this site, at no
        extra cost to you.
      </p>
      <p>&copy; 2026 KidSpark at Home.</p>
    </div>
  </div>
</footer>

<a class="ks-wa" href="https://wa.me/" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.1c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 1c.3.1.5.2.5.4.1.1.1.7-.1 1.2z"/></svg>
</a>

</body>
</html>
```

Note the `<!-- Tasks 5-7 fill these sections -->` comment — later tasks replace that line.

- [ ] **Step 3: Append header, hero and footer styles to `assets/css/kidspark.css`**

Write CSS for these classes using only tokens:

- `.ks-skip` — visually hidden until `:focus`, then pinned top-left with an indigo background.
- `.ks-header` — `position: sticky; top: 0; z-index: 50;` white at 86% alpha with `backdrop-filter: saturate(1.4) blur(10px)`, bottom border `--ks-border`.
- `.ks-header__inner` — flex, space-between, `min-height: 72px`, gap `--ks-s5`.
- `.ks-logo` — Baloo 2, 24px, 800, `--ks-ink`; the nested `<span>` renders as a separate line in `--ks-teal` at 13px, uppercase, letter-spacing `.08em`.
- `.ks-nav` — flex, gap `--ks-s5`, font-weight 700, `font-size: var(--ks-text-small)`.
- `.ks-nav__link:hover` — `--ks-indigo`.
- `.ks-hamburger` — `--ks-tap` square, transparent, no border, three 2px `--ks-ink` bars; `display: none` above 860px.
- `.ks-mobile-nav` — column of links, `--ks-s4` padding, top border, background white; each link `min-height: var(--ks-tap)`, flex-centered vertically.
- `.ks-hero` — `background: linear-gradient(165deg, var(--ks-cream) 0%, var(--ks-amber) 100%)`, padding `--ks-s9` top and bottom, `overflow: hidden`.
- `.ks-hero__grid` — `display: grid; grid-template-columns: 1fr 1fr; gap: var(--ks-s7); align-items: center;`
- `.ks-hero__eyebrow` — like `.ks-section-head__eyebrow`.
- `.ks-hero__sub` — `font-size: 19px; max-width: 46ch;`
- `.ks-hero__btns` — flex, gap `--ks-s3`, margin-top `--ks-s6`.
- `.ks-hero__disclosure` — `--ks-text-small`, `--ks-muted`, margin-top `--ks-s5`; its `<a>` is `--ks-indigo` and underlined.
- `.ks-hero__media img` — `border-radius: var(--ks-radius-card); box-shadow: var(--ks-shadow-lg);`
- `.ks-footer` — `background: var(--ks-sand)`, top border, padding `--ks-s8` top / `--ks-s6` bottom.
- `.ks-footer__grid` — `grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: var(--ks-s6);` Each column's `h4` is Baloo 2 17px with `margin-bottom: var(--ks-s3)`; each `<a>` is `display: block; padding: var(--ks-s2) 0; font-size: var(--ks-text-small);` and hovers to `--ks-indigo`.
- `.ks-footer__base` — top border, `margin-top: var(--ks-s6)`, `padding-top: var(--ks-s5)`, `--ks-text-small`, `--ks-muted`.
- `.ks-wa` — fixed bottom-right 28px, 56px circle, `background: var(--ks-whatsapp)`, flex-centered, `box-shadow: 0 6px 20px rgba(37,211,102,.45)`, scales to 1.08 on hover.

Then the responsive rules:

```css
@media (max-width: 1080px) {
  .ks-footer__grid { grid-template-columns: 1.4fr 1fr 1fr; }
  .ks-footer__grid > div:last-child { grid-column: span 3; }
}
@media (max-width: 860px) {
  .ks-nav { display: none; }
  .ks-hamburger { display: inline-flex; }
  .ks-hero__grid { grid-template-columns: 1fr; gap: var(--ks-s6); }
  .ks-hero { padding: var(--ks-s7) 0; }
}
@media (max-width: 600px) {
  :root { --ks-gutter: 20px; }
  .ks-hero__btns { flex-direction: column; }
  .ks-hero__btns > .ks-btn { width: 100%; }
  .ks-footer__grid { grid-template-columns: 1fr 1fr; }
  .ks-footer__grid > div:last-child { grid-column: span 2; }
}
```

- [ ] **Step 4: Write `assets/js/app.js`**

```js
import { KS_CURRENCY, KS_CATEGORIES, KS_PRODUCTS, KS_ARTICLES, KS_TESTIMONIALS } from './data.js';
import {
  filterProducts, productCard, categoryCard,
  articleCard, testimonialCard, emptyState
} from './render.js';

/* Mount rendered HTML into an element, with an empty state and a guard so one
   failing section cannot stop the others rendering. */
function mount(id, items, renderItem, emptyMessage) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    el.innerHTML = items && items.length
      ? items.map(renderItem).join('')
      : emptyState(emptyMessage);
  } catch (err) {
    console.error(`[KidSpark] failed to render #${id}`, err);
    el.innerHTML = emptyState(emptyMessage);
  }
}

function initMobileMenu() {
  const btn = document.getElementById('ks-menu-btn');
  const nav = document.getElementById('ks-mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    nav.hidden = open;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      btn.click();
      btn.focus();
    }
  });
}

function init() {
  initMobileMenu();

  mount('ks-categories', KS_CATEGORIES, categoryCard,
    'Categories are on their way.');

  mount('ks-featured',
    filterProducts(KS_PRODUCTS, { filter: p => p.featured, limit: 4 }),
    p => productCard(p, KS_CURRENCY),
    'Our featured picks are being updated.');

  mount('ks-deals',
    filterProducts(KS_PRODUCTS, { filter: p => p.deal, limit: 3 }),
    p => productCard(p, KS_CURRENCY),
    'No deals running this week — check back soon.');

  mount('ks-articles',
    KS_ARTICLES.filter(a => !a.featured).slice(0, 3),
    articleCard,
    'New articles are coming soon.');

  const guide = KS_ARTICLES.find(a => a.featured);
  if (guide) {
    mount('ks-guide-picks',
      filterProducts(KS_PRODUCTS, { filter: p => p.category === guide.categoryId, limit: 3 }),
      p => productCard(p, KS_CURRENCY),
      'Picks for this guide are being updated.');
  }

  mount('ks-testimonials', KS_TESTIMONIALS, testimonialCard,
    'Parent stories coming soon.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

- [ ] **Step 5: Verify the shell in the browser**

Start the preview server (`KidSpark` config) and open `http://localhost:3000/`. Confirm:
- Header is sticky, hero gradient renders, hero image loads, footer renders.
- Console shows no errors (mount points don't exist yet — `mount()` returns early, which is correct and silent).
- At 600px width the hamburger appears; clicking it opens the mobile nav; `Escape` closes it; `aria-expanded` flips both times.

- [ ] **Step 6: Commit**

```bash
cd /var/www/KID && git add index.html assets/js/app.js assets/css/kidspark.css && git commit -m "feat: storefront page shell with header, hero, footer and mobile nav"
```

---

### Task 5: Shop half — categories, featured picks, deals

**Files:**
- Modify: `index.html` (replace the `<!-- Tasks 5-7 fill these sections -->` comment)
- Modify: `assets/css/kidspark.css` (append grid styles)

**Interfaces:**
- Consumes: `.ks-section-head`, `.ks-cat-card`, `.ks-card` from Task 1; mount logic from Task 4.
- Produces: the `#ks-categories`, `#ks-featured` and `#ks-deals` mount points, now live.

- [ ] **Step 1: Replace the placeholder comment in `index.html` with three sections**

```html
  <section class="ks-section ks-wrap" id="categories">
    <div class="ks-section-head">
      <div>
        <p class="ks-section-head__eyebrow">Shop by age and interest</p>
        <h2>What are you looking for?</h2>
      </div>
      <a class="ks-section-head__link" href="/shop">All categories →</a>
    </div>
    <div class="ks-grid ks-grid--cats" id="ks-categories"></div>
  </section>

  <section class="ks-section ks-wrap" id="featured">
    <div class="ks-section-head">
      <div>
        <p class="ks-section-head__eyebrow">Tested at home</p>
        <h2>This month's featured picks</h2>
      </div>
      <a class="ks-section-head__link" href="/shop">See all picks →</a>
    </div>
    <div class="ks-grid ks-grid--4" id="ks-featured"></div>
  </section>

  <section class="ks-section ks-section--soft" id="deals">
    <div class="ks-wrap">
      <div class="ks-section-head">
        <div>
          <p class="ks-section-head__eyebrow">Worth a look this week</p>
          <h2>Best value right now</h2>
        </div>
      </div>
      <div class="ks-grid ks-grid--3" id="ks-deals"></div>
    </div>
  </section>
```

- [ ] **Step 2: Append grid and section styles to `assets/css/kidspark.css`**

```css
.ks-section { padding: var(--ks-s9) 0; }
.ks-section--soft { background: var(--ks-cream); }

.ks-grid { display: grid; gap: var(--ks-s4); }
.ks-grid--cats { grid-template-columns: repeat(6, 1fr); gap: var(--ks-s5); }
.ks-grid--4    { grid-template-columns: repeat(4, 1fr); }
.ks-grid--3    { grid-template-columns: repeat(3, 1fr); }

@media (max-width: 1080px) {
  .ks-grid--cats { grid-template-columns: repeat(3, 1fr); }
  .ks-grid--4    { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 860px) {
  .ks-grid--3 { grid-template-columns: repeat(2, 1fr); }
  .ks-section { padding: var(--ks-s7) 0; }
}
@media (max-width: 600px) {
  .ks-grid--cats { grid-template-columns: repeat(2, 1fr); }
  .ks-grid--4, .ks-grid--3 { grid-template-columns: 1fr; }
  .ks-section-head { flex-direction: column; align-items: flex-start; }
}
```

- [ ] **Step 3: Verify in the browser**

Reload `http://localhost:3000/`. Confirm:
- Six pastel category cards render with visible SVG icons.
- Four featured product cards render with image, title, blurb, price, merchant badge and a teal button.
- Three deal cards render, each showing a struck-through was-price and a "Best value" badge.
- Console is clean.

- [ ] **Step 4: Verify every merchant link carries the required attributes**

```bash
cd /var/www/KID && node -e '
import("./assets/js/data.js").then(async d => {
  const r = await import("./assets/js/render.js");
  let bad = 0;
  for (const p of d.KS_PRODUCTS) {
    const html = r.productCard(p, d.KS_CURRENCY);
    if (!html.includes(`rel="sponsored nofollow noopener"`)) { console.log("MISSING rel:", p.id); bad++; }
    if (!html.includes(`target="_blank"`)) { console.log("MISSING target:", p.id); bad++; }
  }
  console.log(bad ? "FAILED: " + bad : "OK: all " + d.KS_PRODUCTS.length + " products have compliant outbound links");
  process.exit(bad ? 1 : 0);
});
'
```

Expected: `OK: all 10 products have compliant outbound links`, exit 0.

- [ ] **Step 5: Commit**

```bash
cd /var/www/KID && git add index.html assets/css/kidspark.css && git commit -m "feat: shop sections — categories, featured picks and best-value deals"
```

---

### Task 6: Blog half — latest articles and editor's guide

**Files:**
- Modify: `index.html` (insert two sections)
- Modify: `assets/css/kidspark.css` (append guide-split styles)

**Interfaces:**
- Consumes: `articleCard`, `productCard` and the mount logic from Task 4.
- Produces: `#ks-articles` and `#ks-guide-picks` mount points, now live.

**Placement matters:** insert the articles section **between** `#featured` and `#deals`, and the guide section **after** `#deals`. That produces the alternating shop / blog / shop / blog rhythm the spec calls for.

- [ ] **Step 1: Insert the articles section between `#featured` and `#deals`**

```html
  <section class="ks-section ks-wrap" id="articles">
    <div class="ks-section-head">
      <div>
        <p class="ks-section-head__eyebrow">From the blog</p>
        <h2>Ideas you can use this afternoon</h2>
      </div>
      <a class="ks-section-head__link" href="/blog">All articles →</a>
    </div>
    <div class="ks-grid ks-grid--3" id="ks-articles"></div>
  </section>
```

- [ ] **Step 2: Insert the editor's guide section after `#deals`**

```html
  <section class="ks-section ks-wrap" id="guide">
    <div class="ks-guide">
      <article class="ks-guide__feature">
        <p class="ks-section-head__eyebrow">Editor's guide</p>
        <h2>Play That Actually Builds Focus</h2>
        <p>
          Not every toy labelled "educational" earns the label. We spent a term
          watching which ones held attention past the first afternoon — and
          which went quietly into the cupboard.
        </p>
        <p>
          The short version: fewer moving parts, more ways to be wrong. Here is
          what that looks like in practice, and the three sets that came out best.
        </p>
        <a class="ks-btn ks-btn--primary" href="/blog/stem-toys-that-build-focus">
          Read the full guide
        </a>
      </article>
      <div class="ks-guide__picks">
        <h3>The three that won</h3>
        <div class="ks-grid ks-grid--3" id="ks-guide-picks"></div>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Append guide styles to `assets/css/kidspark.css`**

```css
.ks-guide {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: var(--ks-s7);
  align-items: start;
  background: var(--ks-mint);
  border-radius: var(--ks-radius-card);
  padding: var(--ks-s7);
}
.ks-guide__feature > * + * { margin-top: var(--ks-s4); }
.ks-guide__feature .ks-btn { margin-top: var(--ks-s5); }
.ks-guide__picks > h3 { margin-bottom: var(--ks-s5); }
.ks-guide__picks .ks-grid { gap: var(--ks-s3); }

@media (max-width: 1080px) {
  .ks-guide { grid-template-columns: 1fr; gap: var(--ks-s6); }
}
@media (max-width: 600px) {
  .ks-guide { padding: var(--ks-s5); }
  .ks-guide__picks .ks-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Verify in the browser**

Reload. Confirm:
- Three article cards render with category badge, title, excerpt and read time.
- The guide section shows the mint panel with the feature copy on the left and three STEM product cards on the right.
- Section order top to bottom is: hero → categories → featured → **articles** → deals → **guide**.
- Console is clean.

- [ ] **Step 5: Commit**

```bash
cd /var/www/KID && git add index.html assets/css/kidspark.css && git commit -m "feat: blog sections — latest articles and editor's guide split"
```

---

### Task 7: Close — testimonials and newsletter

**Files:**
- Modify: `index.html` (insert two sections after `#guide`)
- Modify: `assets/css/kidspark.css` (append testimonial and newsletter styles)

**Interfaces:**
- Consumes: `testimonialCard` and the mount logic from Task 4.
- Produces: the `#ks-testimonials` mount point, now live. Completes the page.

- [ ] **Step 1: Insert both sections after `#guide`, before `</main>`**

```html
  <section class="ks-section ks-section--mint" id="testimonials">
    <div class="ks-wrap">
      <div class="ks-section-head ks-section-head--center">
        <div>
          <p class="ks-section-head__eyebrow">Parent stories</p>
          <h2>What families tell us</h2>
        </div>
      </div>
      <div class="ks-grid ks-grid--3" id="ks-testimonials"></div>
    </div>
  </section>

  <section class="ks-section ks-wrap" id="newsletter">
    <div class="ks-news">
      <div class="ks-news__copy">
        <h2>One email a week. Nothing else.</h2>
        <p>
          A short note with what we tried, what worked, and anything genuinely
          worth buying. Unsubscribe in one click.
        </p>
      </div>
      <form class="ks-news__form" id="ks-news-form" novalidate>
        <label class="ks-sr-only" for="ks-news-email">Your email address</label>
        <input class="ks-news__input" id="ks-news-email" type="email" name="email"
               placeholder="you@example.com" required autocomplete="email">
        <button class="ks-btn ks-btn--primary" type="submit">Join free</button>
        <p class="ks-news__note" id="ks-news-note" role="status"></p>
      </form>
    </div>
  </section>
```

- [ ] **Step 2: Add the form handler to `assets/js/app.js`**

Add this function and call it from `init()` immediately after `initMobileMenu();`:

```js
/* No backend yet. Validate, then tell the truth about what happened —
   never fake a success message for a signup that was not stored. */
function initNewsletter() {
  const form = document.getElementById('ks-news-form');
  const input = document.getElementById('ks-news-email');
  const note = document.getElementById('ks-news-note');
  if (!form || !input || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      note.textContent = 'Please enter a valid email address.';
      note.dataset.state = 'error';
      input.focus();
      return;
    }
    note.textContent = 'Signup is not connected yet — this form goes live with the backend.';
    note.dataset.state = 'pending';
  });
}
```

- [ ] **Step 3: Append testimonial and newsletter styles to `assets/css/kidspark.css`**

```css
.ks-section--mint { background: var(--ks-mint); }
.ks-section-head--center { justify-content: center; text-align: center; }

.ks-testimonial { padding: var(--ks-s6); gap: var(--ks-s5); background: var(--ks-white); }
.ks-testimonial:hover { transform: none; }
.ks-testimonial__quote {
  margin: 0; font-size: 18px; font-style: italic; color: var(--ks-ink);
}
.ks-testimonial__who { display: flex; align-items: center; gap: var(--ks-s3); }
.ks-testimonial__who img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
.ks-testimonial__who strong { display: block; color: var(--ks-ink); }
.ks-testimonial__who small { color: var(--ks-muted); }

.ks-news {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--ks-s7);
  background: linear-gradient(135deg, var(--ks-cream) 0%, var(--ks-amber) 100%);
  border-radius: var(--ks-radius-card);
  padding: var(--ks-s7);
}
.ks-news__copy p { max-width: 44ch; margin: var(--ks-s3) 0 0; }
.ks-news__form { display: flex; flex-wrap: wrap; gap: var(--ks-s3); align-items: center; }
.ks-news__input {
  min-height: var(--ks-tap);
  min-width: 280px;
  padding: 0 var(--ks-s5);
  font-size: var(--ks-text-body);
  border: 2px solid var(--ks-border);
  border-radius: var(--ks-radius-pill);
  background: var(--ks-white);
  color: var(--ks-ink);
}
.ks-news__input:focus { border-color: var(--ks-indigo); outline: none; }
.ks-news__note { flex-basis: 100%; margin: 0; font-size: var(--ks-text-small); }
.ks-news__note[data-state="error"]   { color: var(--ks-error); }
.ks-news__note[data-state="pending"] { color: var(--ks-body); }

@media (max-width: 860px) {
  .ks-news { flex-direction: column; align-items: flex-start; padding: var(--ks-s6); }
}
@media (max-width: 600px) {
  .ks-news__form { width: 100%; }
  .ks-news__input { width: 100%; min-width: 0; }
  .ks-news__form .ks-btn { width: 100%; }
}
```

Note: `--ks-error` is used only for form validation text. It is a functional color, never a retail/sale color.

- [ ] **Step 4: Verify in the browser**

Reload. Confirm:
- Three testimonial cards render on the mint band with round avatars.
- Submitting an invalid email shows the validation message and focuses the input.
- Submitting a valid email shows the honest "not connected yet" message.
- Console is clean.

- [ ] **Step 5: Commit**

```bash
cd /var/www/KID && git add index.html assets/js/app.js assets/css/kidspark.css && git commit -m "feat: testimonials and newsletter sections"
```

---

### Task 8: Verification and polish pass

**Files:**
- Modify: any file needing a fix found during this pass.

**Interfaces:**
- Consumes: the complete page from Tasks 1–7.
- Produces: a verified page and a written verification report.

- [ ] **Step 1: Run the full automated check suite**

```bash
cd /var/www/KID && node --test tests/ && echo "--- data integrity ---" && node -e '
import("./assets/js/data.js").then(async d => {
  const fs = await import("node:fs");
  let bad = 0;
  for (const i of [...d.KS_PRODUCTS.map(p=>p.image), ...d.KS_ARTICLES.map(a=>a.image), ...d.KS_TESTIMONIALS.map(t=>t.image)])
    if (!fs.existsSync(i)) { console.log("MISSING", i); bad++; }
  console.log(bad ? "FAILED" : "OK all images present"); process.exit(bad?1:0);
});
'
```

Expected: all tests pass, `OK all images present`.

- [ ] **Step 2: Check every internal link target is either built or a known future page**

```bash
cd /var/www/KID && grep -oE 'href="[^"#][^"]*"' index.html | sed 's/href="//;s/"//' | sort -u
```

Review the output by hand. Every entry must be one of: an `assets/` path that exists, a `https://` external URL, or a documented future route (`/shop`, `/blog`, `/about`, `/contact`, `/disclosure`, `/privacy`, `/learning-tips`, `/activities`, `/parenting`). Anything else is a typo — fix it.

- [ ] **Step 3: Responsive pass**

At each of 1440, 1080, 860 and 600px, resize the preview and confirm:
- No horizontal scrollbar on the page body.
- No text overlapping or clipped.
- Grids collapse per the breakpoint rules in Tasks 5 and 6.
- At 600px, all buttons are full-width and tap targets are at least 48px.

Take a screenshot at 1440px and at 600px.

- [ ] **Step 4: Keyboard and accessibility pass**

- Tab from the top: the skip link appears first and works.
- Every link and button shows a visible focus ring.
- The mobile menu opens with Enter, closes with Escape, and `aria-expanded` tracks correctly.
- Tab order follows visual order — no jumps.
- Confirm exactly one `<h1>`:

```bash
cd /var/www/KID && grep -c '<h1' index.html
```
Expected: `1`

- [ ] **Step 5: Confirm the empty-state path works**

Temporarily edit `assets/js/data.js` to set `export const KS_TESTIMONIALS = [];`, reload, confirm the testimonials section shows "Parent stories coming soon." styled as `.ks-empty` rather than collapsing. Then revert:

```bash
cd /var/www/KID && git checkout assets/js/data.js
```

- [ ] **Step 6: Check page weight**

```bash
cd /var/www/KID && echo "images: $(du -sh assets/images | cut -f1)" && \
echo "css: $(du -h assets/css/kidspark.css | cut -f1)" && \
echo "js: $(du -ch assets/js/*.js | tail -1 | cut -f1)" && \
echo "html: $(du -h index.html | cut -f1)"
```

Images should total under 3MB. If not, re-run the Task 2 Step 4 optimization at quality 75.

- [ ] **Step 7: Confirm the console is clean**

Load the page fresh, read all console messages and all network requests. Expected: zero errors, zero 404s.

- [ ] **Step 8: Write the verification report and commit**

Create `docs/superpowers/plans/2026-08-02-verification-report.md` recording, with actual output pasted in: unit test results, contrast check results, outbound-link check results, image weight, breakpoints checked, keyboard pass result, and console state. State plainly anything that did not pass.

```bash
cd /var/www/KID && git add -A && git commit -m "test: full verification pass on storefront homepage"
```

---

## Handoff notes

**Launch blockers — must be resolved before this page goes public:**

1. **Testimonials are placeholder copy.** `KS_TESTIMONIALS` contains written filler, not real quotes. Publishing invented testimonials on a live commercial site is a trust and legal problem. Replace with genuine permissioned quotes, or delete the section.
2. **Affiliate URLs are merchant homepages, not affiliate links.** No commission is earned until real affiliate IDs are in place.
3. **Prices are illustrative** and must be reconciled with real merchant prices.
4. **Currency is set to USD** in one place (`KS_CURRENCY`). Confirm with the client and change that single line if it should be LKR.
5. **WhatsApp float links to a bare `https://wa.me/`** with no number. Add the real number.
6. **Product photographs are stand-ins** from stock, not the actual products.

**CodeIgniter migration, when the time comes:** each `<section>` in `index.html` becomes a file in `app/Views/partials/`; the four `data.js` arrays become four tables; each `mount()` call becomes a `foreach` in a view; `assets/` moves to `public/assets/`. The escaping in `render.js` becomes `esc()` in the PHP views — it is the same discipline, and it matters more once the data comes from a database. `GUIDE.md` holds the server-specific install steps.
