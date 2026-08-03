/* Illustrated decoration set: scattered doodles and character stickers.
   Every shape uses a `d-*` class rather than a hard-coded fill, so the
   colours come from the design tokens in kidspark.css and stay editable
   in one place. Purely decorative — always rendered aria-hidden. */


/* Illustrated PNG stickers cut from the brand illustration sheet.
   These take precedence over the SVG fallbacks below. */
const IMG = {
  sun:      ['sun.png',         200, 202],
  cloud:    ['cloud.png',       240, 214],
  rainbow:  ['rainbow.png',     260, 195],
  balloon:  ['balloon.png',     300, 367],
  giraffe:  ['giraffe.png',     300, 413],
  dino:     ['croc.png',        340, 386],
  plane:    ['plane.png',       170, 211],
  starY:    ['star-yellow.png',  90,  85],
  starT:    ['star-teal.png',    78,  72],
  starP:    ['star-purple.png',  82,  76]
};

function imgTag(name) {
  const it = IMG[name];
  if (!it) return '';
  const [file, w, h] = it;
  return `<img src="assets/images/decor/${file}" width="${w}" height="${h}"
               alt="" aria-hidden="true" loading="lazy" decoding="async">`;
}

const S = (body, box = 24) =>
  `<svg viewBox="0 0 ${box} ${box}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

/* Only real illustration assets are used now — no hand-drawn shapes.
   These stay as empty maps so scatter()/character() fall through to imgTag(). */
export const DOODLE = {};
export const CHARACTER = {};

/* A scatter of doodles for one section. `spec` is a list of
   [name, tone, top%, left/right, size] entries. */
export function scatter(items) {
  return `<div class="ks-scatter" aria-hidden="true">${
    items.map(([name, tone, css]) =>
      `<span class="ks-doodle ks-doodle--${tone}" style="${css}">${imgTag(name) || DOODLE[name] || ''}</span>`
    ).join('')
  }</div>`;
}

export function character(name, className, css = '') {
  const art = imgTag(name) || CHARACTER[name];
  if (!art) return '';
  return `<span class="ks-char ${className}" style="${css}" aria-hidden="true">${art}</span>`;
}
