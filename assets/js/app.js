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
  initNewsletter();

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
