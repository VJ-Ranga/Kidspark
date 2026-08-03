// Extended WCAG contrast gate for KidSpark design tokens.
// Tests every text-token / background-surface pair actually shipped in
// assets/css/kidspark.css, plus the original button-fill and pastel checks.
// PASS/FAIL per line; exits non-zero if any pair fails 4.5:1.

const textTokens = {
  ink:   "#1E293B",
  body:  "#475569",
  muted: "#556575",
};

const surfaces = {
  white:  "#FFFFFF",
  cream:  "#FFFBEB",
  amber:  "#FEF3C7",
  mint:   "#ECFDF5",
  sand:   "#F8FAFC",
  mintPastel:   "#DCFCE7",
  lilacPastel:  "#EDE9FE",
  peachPastel:  "#FFEDD5",
  skyPastel:    "#DBEAFE",
  blushPastel:  "#FCE7F3",
  butterPastel: "#FEF9C3",
};

const buttonFills = {
  indigo:     "#4338CA",
  indigoDark: "#3326A8",
  teal:       "#128070",
  tealDark:   "#0E6457",
};

const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = h => { const n = parseInt(h.slice(1), 16); return 0.2126 * lin(n >> 16 & 255) + 0.7152 * lin(n >> 8 & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

let fail = 0;
function line(label, fg, bg) {
  const r = ratio(fg, bg);
  const ok = r >= 4.5;
  if (!ok) fail++;
  console.log((ok ? "PASS" : "FAIL"), label.padEnd(28), r.toFixed(2) + ":1");
}

console.log("--- text tokens vs surfaces (--ks-ink / --ks-body / --ks-muted) ---");
for (const [tName, tHex] of Object.entries(textTokens)) {
  for (const [sName, sHex] of Object.entries(surfaces)) {
    line(`${tName} on ${sName}`, tHex, sHex);
  }
}

console.log("--- white text vs button fills ---");
for (const [bName, bHex] of Object.entries(buttonFills)) {
  line(`white on ${bName}`, "#FFFFFF", bHex);
}

console.log("--- error token vs white ---");
line("error on white", "#B3261E", "#FFFFFF");

process.exit(fail ? 1 : 0);
