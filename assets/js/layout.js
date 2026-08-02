/* Shared chrome for every page. One definition, so the header and footer
   can never drift apart between pages. When this moves to CodeIgniter these
   become app/Views/partials/header.php and footer.php. */

import { escapeHtml } from './render.js';

const NAV = [
  { href: 'index.html',   label: 'Home' },
  { href: 'shop.html',    label: 'Shop' },
  { href: 'blog.html',    label: 'Blog' },
  { href: 'about.html',   label: 'About' },
  { href: 'contact.html', label: 'Contact' }
];

function navLinks(active, extraClass = '') {
  return NAV.map(item => {
    const current = item.href === active ? ' aria-current="page"' : '';
    return `<a class="ks-nav__link${extraClass}" href="${item.href}"${current}>${escapeHtml(item.label)}</a>`;
  }).join('');
}

export function headerHtml(active) {
  return `
<div class="ks-wrap ks-header__inner">
  <a class="ks-logo" href="index.html">KidSpark<span>at Home</span></a>

  <nav class="ks-nav" aria-label="Main">${navLinks(active)}</nav>

  <div class="ks-header__actions">
    <a class="ks-btn ks-btn--primary" href="index.html#newsletter">Join free</a>
    <button class="ks-hamburger" id="ks-menu-btn" type="button"
            aria-expanded="false" aria-controls="ks-mobile-nav" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</div>

<nav class="ks-mobile-nav" id="ks-mobile-nav" aria-label="Mobile" hidden>${navLinks(active)}</nav>`;
}

export function footerHtml() {
  return `
<div class="ks-wrap">
  <div class="ks-footer__grid">
    <div>
      <a class="ks-logo" href="index.html">KidSpark<span>at Home</span></a>
      <p>Practical play ideas and honest product picks for babies and toddlers.</p>
    </div>
    <div>
      <h4>Shop</h4>
      <a href="shop.html?cat=toys">Toys &amp; Games</a>
      <a href="shop.html?cat=books">Books &amp; Stories</a>
      <a href="shop.html?cat=stem">STEM &amp; Learning</a>
      <a href="shop.html?cat=art">Art &amp; Craft</a>
    </div>
    <div>
      <h4>Read</h4>
      <a href="blog.html">All articles</a>
      <a href="blog.html?cat=stem">Learning tips</a>
      <a href="blog.html?cat=art">Activities</a>
      <a href="blog.html?cat=baby">Parenting</a>
    </div>
    <div>
      <h4>KidSpark</h4>
      <a href="about.html">About us</a>
      <a href="contact.html">Contact</a>
      <a href="disclosure.html">Affiliate disclosure</a>
      <a href="privacy.html">Privacy policy</a>
      <a href="terms.html">Terms of use</a>
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
</div>`;
}

export function whatsappHtml() {
  return `
<a class="ks-wa" href="https://wa.me/" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.1c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 1c.3.1.5.2.5.4.1.1.1.7-.1 1.2z"/></svg>
</a>`;
}
