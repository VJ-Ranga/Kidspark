# KidSpark at Home — Affiliate Storefront Homepage

**Date:** 2026-08-02
**Status:** Approved, ready for implementation planning

---

## 1. Goal

Rewrite `/var/www/KID/index.html` as an affiliate product storefront homepage for KidSpark at Home, balancing shop content and blog content roughly 50/50.

KidSpark does not sell anything directly. Every product is a curated recommendation that links out to a third-party merchant (Amazon, Daraz, etc.). There is no cart, no checkout, and no payment handling anywhere in this project.

The page is a real production page, not a throwaway demo: real photography, real render logic, working links, accessible and responsive.

## 2. Decisions

| Question | Decision |
|---|---|
| Store type | Affiliate / product picks. No cart, no checkout, no payments. |
| Page slot | Rewrite `index.html`. Archive the current blog homepage as `index-blog.html`. |
| Shop vs blog balance | 50/50 — product sections and article sections alternate down the page. |
| Product card content | Image, title, one-line blurb, price, merchant badge, outbound button. No rating, no age tag, no wishlist. |
| Data source | `assets/js/data.js`, rendered by `assets/js/app.js`. |
| Homepage filtering | None. Filtering belongs on the future `/shop` page. |
| Build order | Front-end groundwork first (structure, CSS system, images, data), then page sections. |
| Images | Downloaded locally from Pexels/Unsplash, optimized, stored in `assets/images/`. |
| Backend | CodeIgniter 4 is **not** installed as part of this work. |

## 3. Design system

### 3.1 Direction

Baby-friendly and mom-friendly. The existing KidSpark palette is already warm; this is a deliberate softening, not a repaint.

- **Soft geometry.** 24px card radii, pill buttons, rounded photo corners. No sharp corners anywhere.
- **Calm palette.** Cream and amber base with mint, blush and powder-blue pastel accents. Indigo recedes to CTAs and links only, so the page reads gentle rather than corporate.
- **Soft warm-tinted shadows.** Low opacity, wide spread. No hard drop shadows.
- **No aggressive retail styling.** "Best value this week", never red `SALE 50% OFF!!` badges. Trust over urgency — that is what converts parents.
- **One-handed phone use is the primary case.** A mother holding a baby is the primary reader. Minimum 48×48px tap targets, 17px body text at 1.7 line-height, full-width buttons on mobile, thumb-reachable navigation.
- **Gentle motion only.** Slow float and fade, honouring `prefers-reduced-motion`.
- **Unposed, warm photography.** Natural light, real parents and children, diverse families. Not glossy stock grins.

### 3.2 Tokens

Carried over from the existing `index.html` inline styles, extended with pastels.

| Token | Value | Use |
|---|---|---|
| `--ks-indigo` | `#4338CA` | Primary CTA, links |
| `--ks-indigo-dark` | `#3326A8` | Primary hover/active |
| `--ks-teal` | `#17A08D` | Merchant/outbound buttons |
| `--ks-teal-dark` | `#178072` | Merchant hover/active |
| `--ks-cream` | `#FFF6E9` | Hero gradient start, soft section backgrounds |
| `--ks-amber` | `#FFE8C2` | Hero gradient end, highlights |
| `--ks-mint` | `#E3F4F0` | Testimonial band |
| `--ks-sand` | `#F7F5EF` | Footer |
| `--ks-border` | `#ECE7DC` | Hairlines, card borders |
| `--ks-body` | `#5B6373` | Body text |
| `--ks-ink` | `#21263A` | Headings |
| `--ks-pastel-mint` | `#DFF3EE` | Category card 1 |
| `--ks-pastel-lilac` | `#EDE7FB` | Category card 2 |
| `--ks-pastel-peach` | `#FFE9D6` | Category card 3 |
| `--ks-pastel-sky` | `#E4EEFB` | Category card 4 |
| `--ks-pastel-blush` | `#FBE4E9` | Category card 5 |
| `--ks-pastel-butter` | `#FBF0D2` | Category card 6 |

Category card text and icons use `--ks-ink` on these pastels. Each pairing is contrast-verified during groundwork; any that falls below 4.5:1 has its pastel darkened until it passes.

- **Type:** Baloo 2 (headings, 500–800), Nunito (body, 400–800). Body minimum 17px, line-height 1.7.
- **Spacing:** 4px base scale.
- **Container:** 1280px max width.
- **Breakpoints:** 1080px, 860px, 600px.
- **Radii:** 24px cards, 999px pills.

### 3.3 Button system

Three variants only, sharing one radius, padding scale, and hover/active/focus/disabled pattern:

1. **Primary** — indigo fill, white text. Main page CTAs.
2. **Outline** — transparent with border. Secondary actions.
3. **Merchant** — teal fill. Used on every outbound affiliate link, and nowhere else, so an outbound click is always visually identifiable.

All three carry a visible `:focus-visible` ring.

## 4. File structure

```
/var/www/KID/
  index.html                  rewritten storefront homepage
  index-blog.html             current homepage, archived (not deleted)
  styleguide.html             design system proof page
  assets/
    css/kidspark.css          tokens + all components
    js/data.js                categories, products, articles, testimonials
    js/app.js                 render functions
    images/
      CREDITS.md              source URL + license for every file
      hero/  products/  categories/  blog/  testimonials/
```

**Deviation from global preferences, accepted:** the user's global instructions specify Bootstrap 5 + Font Awesome + Poppins inside a `demo/` folder. This project already uses hand-rolled CSS, Baloo 2 + Nunito, inline SVG icons, and files at the project root, and `GUIDE.md` commits to that. The project convention wins. This was raised with the user and approved.

## 5. Page structure

Sections in order. Shop and blog alternate.

1. **Header** — logo, nav, search, "Join free" CTA, hamburger + mobile nav. No cart icon.
2. **Hero** — shop-led headline, two CTAs (Browse picks / Read the blog), photograph, and a trust strip carrying the affiliate disclosure.
3. **Shop by category** — 6 cards, pastel variants.
4. **Featured picks** — 4 product cards.
5. **Latest from the blog** — 3 article cards.
6. **This week's best value** — 3 deal cards with was/now pricing.
7. **Editor's guide** — split layout: one long-form guide teaser beside 3 related picks. The teaser is the article in `data.js` flagged `featured: true`; the three picks are products whose `category` matches that article's category. This section is what makes the 50/50 read as intentional rather than two sites stapled together.
8. **Testimonials** — mint band, carried over from the existing design.
9. **Newsletter** — carried over.
10. **Footer** — carried over, plus an affiliate disclosure line and a disclosure link.
11. **WhatsApp float** — carried over.

The existing heart/favourite buttons are removed rather than left non-functional, since wishlist was ruled out of scope.

## 6. Data and rendering

`assets/js/data.js` defines four arrays. Product shape:

```js
{ id, slug, title, image, alt, blurb, price, currency, wasPrice, merchant: { name, url }, category, badge }
```

`assets/js/app.js` exposes:

- `renderProducts(mount, { filter, limit })`
- `renderCategories(mount)`
- `renderArticles(mount, { limit })`
- `renderTestimonials(mount)`

Sections 4, 6 and 7 all call `renderProducts` with different filters — one card component, three placements.

**Rules:**

- Every interpolated string is HTML-escaped on insert. The data is ours today, but it comes from a database later, and the habit belongs in the code from the start.
- Every section has an empty state. If `data.js` fails to load or an array is empty, the section renders a short message rather than collapsing to a blank gap.
- Render calls are wrapped so one failing section cannot prevent the others from rendering.
- Outbound merchant links carry `target="_blank" rel="sponsored nofollow noopener"`.

## 7. Images

Sourced from Pexels and Unsplash. Both licenses permit commercial use without required attribution.

- Downloaded to `assets/images/`, never hotlinked.
- Resized to actual display widths, with `srcset` variants so phones do not download desktop-sized files.
- Every `<img>` has descriptive `alt` text and explicit `width`/`height` to prevent layout shift.
- `assets/images/CREDITS.md` records the source URL and license for every file, as a provenance record even though attribution is not required.

## 8. Accessibility

- One `<h1>`, semantic `<header>`/`<nav>`/`<section>`/`<footer>`, logical heading order.
- 4.5:1 minimum text contrast, verified — including on every pastel category card.
- Visible `:focus-visible` on all interactive elements.
- Mobile menu operable by keyboard, with correct `aria-expanded` state.
- `aria-label` on all icon-only buttons.
- Prices and badges are real text, never baked into images.
- `prefers-reduced-motion` disables float and fade animations.

## 9. Verification

There is no test framework in this project. Verification is manual and evidence-based, run against the existing preview server (`.claude/launch.json`, port 3000):

1. Page loads with a clean browser console — no errors, no failed requests.
2. Every section renders with its real data.
3. Layout checked at 1440, 1080, 860 and 600px.
4. Full keyboard tab pass, including the mobile menu.
5. Contrast spot-check on pastel cards and both button fills.
6. Outbound links confirmed to carry `target="_blank" rel="sponsored nofollow noopener"`.
7. Empty state confirmed by temporarily emptying a data array.
8. Total image weight checked and reported.

Screenshots are shared as proof of the finished page.

## 10. CodeIgniter 4 migration path

CI4 is deliberately deferred. Nothing built here is throwaway:

- Each numbered section in §5 becomes one file in `app/Views/partials/`.
- The four `data.js` arrays become four database tables.
- Each `renderX()` loop becomes a `foreach` in a PHP view.
- `assets/` moves to `public/assets/` unchanged.

CI4 gets installed when something static files genuinely cannot do arrives: newsletter signups that must persist, the contact form, the admin panel, or enough pages that a shared header/footer becomes necessary. `GUIDE.md` holds the server-specific install steps.

## 11. Scope

**In scope:** the homepage only, plus the groundwork it needs — asset structure, CSS design system, downloaded images, `data.js`, `app.js`, and `styleguide.html`.

**Out of scope:** the `/shop` listing page, product detail pages, the blog index, any other page, the CodeIgniter install, any backend, any payment functionality.

## 12. Open items — waiting on client

Placeholders are used for all of these, clearly marked and swappable in one line each:

- Real product list
- Affiliate / associate IDs for each merchant
- Currency — LKR or USD
- Merchant list (Amazon, Daraz, others)
- Real product photography
- WhatsApp number for the float button

## 13. Build order

Groundwork first, then the page in showable slices. Each slice is something that can be looked at, not a fragment.

**Groundwork**
1. Asset folder structure.
2. `kidspark.css` — tokens, then components built on them.
3. Images downloaded, resized, credited.
4. `data.js` populated and wired to those images.
5. `styleguide.html` — every colour, type size, button state and card variant on one page. This is the proof-of-progress checkpoint, and where the look is settled before it is built into nine sections.

**Page**
6. Shell — header, hero, footer.
7. Shop half — categories, featured picks, best-value deals.
8. Blog half — latest articles, editor's guide split.
9. Close — testimonials, newsletter, WhatsApp float.
10. Polish — responsive, keyboard, contrast, console, image weight.
