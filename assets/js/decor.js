/* Illustrated decoration set: scattered doodles and character stickers.
   Every shape uses a `d-*` class rather than a hard-coded fill, so the
   colours come from the design tokens in kidspark.css and stay editable
   in one place. Purely decorative — always rendered aria-hidden. */

const S = (body, box = 24) =>
  `<svg viewBox="0 0 ${box} ${box}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

/* ---------- small scattered doodles ---------- */

export const DOODLE = {
  star4: S('<path class="d-fill" d="M12 1c1 6 4 9 10 11-6 2-9 5-10 11-1-6-4-9-10-11 6-2 9-5 10-11Z"/>'),

  star5: S('<path class="d-stroke" stroke-width="1.6" stroke-linejoin="round" d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z"/>'),

  squiggle: S('<path class="d-stroke" stroke-width="1.8" stroke-linecap="round" d="M2 16c3-6 5 4 8-2s5 4 8-2"/>'),

  spiral: S('<path class="d-stroke" stroke-width="1.6" stroke-linecap="round" d="M12 12a3 3 0 1 1 3 3 5 5 0 0 1-5-5 7 7 0 0 1 7-7"/>'),

  dots: S('<circle class="d-fill" cx="6" cy="6" r="2"/><circle class="d-fill" cx="14" cy="10" r="1.6"/><circle class="d-fill" cx="8" cy="16" r="1.3"/>'),

  heart: S('<path class="d-fill" d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z"/>'),

  flower: S('<circle class="d-stroke" stroke-width="1.5" cx="12" cy="6" r="3.2"/><circle class="d-stroke" stroke-width="1.5" cx="12" cy="18" r="3.2"/><circle class="d-stroke" stroke-width="1.5" cx="6" cy="12" r="3.2"/><circle class="d-stroke" stroke-width="1.5" cx="18" cy="12" r="3.2"/>'),

  plane: S('<path class="d-stroke" stroke-width="1.6" stroke-linejoin="round" d="M2 12 22 3l-6 18-3.5-7L2 12Z"/><path class="d-stroke" stroke-width="1.6" d="m12.5 14 9.5-11"/>'),

  confetti: S('<rect class="d-fill" x="3" y="4" width="3" height="6" rx="1.4" transform="rotate(-20 3 4)"/><rect class="d-fill2" x="14" y="9" width="3" height="6" rx="1.4" transform="rotate(25 14 9)"/><rect class="d-fill" x="8" y="16" width="3" height="5" rx="1.4" transform="rotate(-8 8 16)"/>'),

  arc: S('<path class="d-stroke" stroke-width="1.8" stroke-linecap="round" d="M3 18a9 9 0 0 1 18 0"/>')
};

/* ---------- character stickers ---------- */

export const CHARACTER = {
  sun: S(`
    <circle class="c-sun" cx="30" cy="30" r="14"/>
    <g class="c-sun-ray" stroke-width="3" stroke-linecap="round">
      <path d="M30 6v5M30 49v5M6 30h5M49 30h5M13 13l3.5 3.5M43.5 43.5 47 47M47 13l-3.5 3.5M16.5 43.5 13 47"/>
    </g>
    <circle class="c-eye" cx="25" cy="28" r="1.8"/><circle class="c-eye" cx="35" cy="28" r="1.8"/>
    <path class="c-smile" stroke-width="2" stroke-linecap="round" d="M25 34c2.5 2.5 7.5 2.5 10 0"/>
    <circle class="c-blush" cx="21" cy="33" r="2.4"/><circle class="c-blush" cx="39" cy="33" r="2.4"/>`, 60),

  cloud: S(`
    <path class="c-cloud" d="M16 44c-7 0-12-5-12-11s5-11 12-11c2-7 8-12 16-12s15 5 16 13c6 1 10 6 10 11 0 6-5 10-11 10H16Z"/>
    <circle class="c-eye" cx="26" cy="34" r="2"/><circle class="c-eye" cx="40" cy="34" r="2"/>
    <path class="c-smile" stroke-width="2.2" stroke-linecap="round" d="M27 39c3 3 9 3 12 0"/>
    <circle class="c-blush" cx="21" cy="38" r="3"/><circle class="c-blush" cx="45" cy="38" r="3"/>`, 68),

  rainbow: S(`
    <path class="r1" stroke-width="6" stroke-linecap="round" d="M6 46a26 26 0 0 1 52 0"/>
    <path class="r2" stroke-width="6" stroke-linecap="round" d="M15 46a17 17 0 0 1 34 0"/>
    <path class="r3" stroke-width="6" stroke-linecap="round" d="M24 46a8 8 0 0 1 16 0"/>`, 64),

  balloon: S(`
    <path class="b-body" d="M30 6c11 0 19 8 19 19 0 12-13 22-19 30C24 47 11 37 11 25 11 14 19 6 30 6Z"/>
    <path class="b-stripe" d="M30 6c4 0 6 9 6 19s-2 22-6 30c-4-8-6-20-6-30S26 6 30 6Z"/>
    <rect class="b-basket" x="25" y="55" width="10" height="8" rx="2"/>
    <path class="b-rope" stroke-width="1.6" d="M25 55l3-6M35 55l-3-6"/>`, 68),

  giraffe: S(`
    <rect class="g-neck" x="30" y="20" width="14" height="42" rx="7"/>
    <ellipse class="g-body" cx="34" cy="72" rx="26" ry="17"/>
    <rect class="g-leg" x="16" y="80" width="8" height="18" rx="4"/>
    <rect class="g-leg" x="44" y="80" width="8" height="18" rx="4"/>
    <ellipse class="g-head" cx="40" cy="18" rx="16" ry="13"/>
    <ellipse class="g-snout" cx="48" cy="22" rx="8" ry="6"/>
    <circle class="c-eye" cx="38" cy="14" r="2.2"/>
    <circle class="g-spot" cx="28" cy="66" r="4"/><circle class="g-spot" cx="42" cy="74" r="5"/><circle class="g-spot" cx="22" cy="78" r="3.4"/>
    <path class="g-horn" stroke-width="3" stroke-linecap="round" d="M34 6v-4M44 6v-4"/>
    <circle class="g-horn-tip" cx="34" cy="2" r="2.4"/><circle class="g-horn-tip" cx="44" cy="2" r="2.4"/>`, 100),

  dino: S(`
    <path class="d-body" d="M20 78c-8 0-14-7-14-16 0-14 11-26 26-26 14 0 24 9 26 21 8 2 14 8 14 15 0 4-3 6-7 6H20Z"/>
    <path class="d-spike" d="M28 36l5-9 5 9zM40 34l5-9 5 9zM52 38l5-8 4 9z"/>
    <rect class="d-leg" x="22" y="72" width="9" height="16" rx="4"/>
    <rect class="d-leg" x="48" y="72" width="9" height="16" rx="4"/>
    <circle class="c-eye" cx="20" cy="52" r="2.4"/>
    <path class="c-smile" stroke-width="2" stroke-linecap="round" d="M14 60c3 2 7 2 10 0"/>
    <circle class="d-belly" cx="40" cy="66" r="3"/>`, 90),

  panda: S(`
    <circle class="p-ear" cx="18" cy="16" r="9"/><circle class="p-ear" cx="52" cy="16" r="9"/>
    <circle class="p-head" cx="35" cy="34" r="24"/>
    <ellipse class="p-patch" cx="26" cy="32" rx="7" ry="8"/>
    <ellipse class="p-patch" cx="44" cy="32" rx="7" ry="8"/>
    <circle class="p-eye" cx="26" cy="33" r="2.6"/><circle class="p-eye" cx="44" cy="33" r="2.6"/>
    <ellipse class="p-nose" cx="35" cy="42" rx="3.4" ry="2.4"/>
    <path class="c-smile" stroke-width="2" stroke-linecap="round" d="M30 47c3 3 7 3 10 0"/>`, 70),

  train: S(`
    <rect class="t-car" x="4" y="30" width="26" height="18" rx="4"/>
    <rect class="t-car2" x="34" y="26" width="24" height="22" rx="4"/>
    <rect class="t-cab" x="60" y="18" width="22" height="30" rx="5"/>
    <rect class="t-window" x="66" y="24" width="10" height="9" rx="2"/>
    <rect class="t-chimney" x="84" y="12" width="7" height="12" rx="2"/>
    <circle class="t-wheel" cx="12" cy="52" r="6"/><circle class="t-wheel" cx="26" cy="52" r="6"/>
    <circle class="t-wheel" cx="42" cy="52" r="6"/><circle class="t-wheel" cx="56" cy="52" r="6"/>
    <circle class="t-wheel" cx="72" cy="52" r="6"/>`, 100),

  tree: S(`
    <rect class="tr-trunk" x="26" y="46" width="10" height="26" rx="4"/>
    <circle class="tr-leaf" cx="31" cy="30" r="20"/>
    <circle class="tr-leaf2" cx="19" cy="40" r="13"/>
    <circle class="tr-leaf2" cx="43" cy="40" r="13"/>`, 72),

  bush: S(`
    <circle class="tr-leaf2" cx="16" cy="34" r="14"/>
    <circle class="tr-leaf" cx="34" cy="28" r="18"/>
    <circle class="tr-leaf2" cx="52" cy="34" r="14"/>`, 68),

  bloom: S(`
    <rect class="f-stem" x="16" y="26" width="4" height="26" rx="2"/>
    <circle class="f-petal" cx="18" cy="14" r="7"/>
    <circle class="f-petal" cx="8" cy="22" r="7"/>
    <circle class="f-petal" cx="28" cy="22" r="7"/>
    <circle class="f-heart" cx="18" cy="22" r="5"/>`, 40)
};

/* A scatter of doodles for one section. `spec` is a list of
   [name, tone, top%, left/right, size] entries. */
export function scatter(items) {
  return `<div class="ks-scatter" aria-hidden="true">${
    items.map(([name, tone, css]) =>
      `<span class="ks-doodle ks-doodle--${tone}" style="${css}">${DOODLE[name] || ''}</span>`
    ).join('')
  }</div>`;
}

export function character(name, className, css = '') {
  const svg = CHARACTER[name];
  if (!svg) return '';
  return `<span class="ks-char ${className}" style="${css}" aria-hidden="true">${svg}</span>`;
}
