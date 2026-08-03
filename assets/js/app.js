import { KS_CURRENCY, KS_CATEGORIES, KS_PRODUCTS, KS_ARTICLES, KS_TESTIMONIALS } from './data.js';
import {
  filterProducts, productCard, categoryCard,
  articleCard, testimonialCard, emptyState, escapeHtml
} from './render.js';
import { headerHtml, footerHtml, whatsappHtml } from './layout.js';

/* ---------- generic mounting ---------- */

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

const compactCard = (fn) => (item) => fn(item).replace('class="ks-card"', 'class="ks-card ks-card--compact"');

/* ---------- chrome ---------- */

function initChrome() {
  const active = (location.pathname.split('/').pop() || 'index.html');
  const header = document.querySelector('.ks-header');
  const footer = document.querySelector('.ks-footer');
  if (header) header.innerHTML = headerHtml(active);
  if (footer) footer.innerHTML = footerHtml();
  if (!document.querySelector('.ks-wa')) {
    document.body.insertAdjacentHTML('beforeend', whatsappHtml());
  }
  initMobileMenu();
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

/* ---------- newsletter (no backend yet — say so honestly) ---------- */

function initNewsletter() {
  const form = document.getElementById('ks-news-form');
  const input = document.getElementById('ks-news-email');
  const note = document.getElementById('ks-news-note');
  if (!form || !input || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      note.textContent = 'Enter a valid email address.';
      note.dataset.state = 'error';
      input.focus();
      return;
    }
    note.textContent = 'Signup is not connected yet — this form goes live with the backend.';
    note.dataset.state = 'pending';
  });
}

/* ---------- home ---------- */

function initHome() {
  if (!document.getElementById('ks-categories')) return;

  mount('ks-categories', KS_CATEGORIES, categoryCard, 'Categories are on their way.');

  mount('ks-picks',
    filterProducts(KS_PRODUCTS, { filter: p => p.featured, limit: 3 }),
    compactCard(p => productCard(p, KS_CURRENCY)),
    'Our picks are being updated.');

  mount('ks-reads',
    KS_ARTICLES.slice(0, 3),
    compactCard(articleCard),
    'New articles are coming soon.');

  mount('ks-deals',
    filterProducts(KS_PRODUCTS, { filter: p => p.deal, limit: 3 }),
    p => productCard(p, KS_CURRENCY),
    'No deals running this week — check back soon.');

  const guide = KS_ARTICLES.find(a => a.featured);
  if (guide) {
    mount('ks-guide-picks',
      filterProducts(KS_PRODUCTS, { filter: p => p.category === guide.categoryId, limit: 3 }),
      compactCard(p => productCard(p, KS_CURRENCY)),
      'Picks for this guide are being updated.');
  }

  mount('ks-testimonials', KS_TESTIMONIALS, testimonialCard, 'Parent stories coming soon.');
}

/* ---------- filterable listing (shop + blog) ---------- */

function initListing(config) {
  const grid = document.getElementById(config.gridId);
  const chips = document.getElementById(config.chipsId);
  const count = document.getElementById(config.countId);
  if (!grid || !chips) return;

  const params = new URLSearchParams(location.search);
  let active = params.get('cat') || 'all';
  if (!KS_CATEGORIES.some(c => c.id === active)) active = 'all';

  const options = [{ id: 'all', name: 'Everything' }, ...KS_CATEGORIES];
  chips.innerHTML = options.map(o =>
    `<button class="ks-chip" type="button" data-cat="${escapeHtml(o.id)}"
       aria-pressed="${o.id === active}">${escapeHtml(o.name)}</button>`
  ).join('');

  function draw() {
    const items = active === 'all'
      ? config.all
      : config.all.filter(i => config.categoryOf(i) === active);

    grid.innerHTML = items.length
      ? items.map(config.render).join('')
      : emptyState(config.emptyMessage);

    if (count) {
      count.textContent = `${items.length} ${items.length === 1 ? config.noun : config.nounPlural}`;
    }

    chips.querySelectorAll('.ks-chip').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.cat === active));
    });
  }

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('.ks-chip');
    if (!btn) return;
    active = btn.dataset.cat;
    const url = new URL(location.href);
    if (active === 'all') url.searchParams.delete('cat');
    else url.searchParams.set('cat', active);
    history.replaceState({}, '', url);
    draw();
  });

  draw();
}

function initShop() {
  initListing({
    gridId: 'ks-shop-grid', chipsId: 'ks-shop-chips', countId: 'ks-shop-count',
    all: KS_PRODUCTS,
    categoryOf: p => p.category,
    render: p => productCard(p, KS_CURRENCY),
    noun: 'pick', nounPlural: 'picks',
    emptyMessage: 'No picks in this category yet. Try another.'
  });
}

function initBlog() {
  initListing({
    gridId: 'ks-blog-grid', chipsId: 'ks-blog-chips', countId: 'ks-blog-count',
    all: KS_ARTICLES,
    categoryOf: a => a.categoryId,
    render: articleCard,
    noun: 'article', nounPlural: 'articles',
    emptyMessage: 'No articles in this category yet. Try another.'
  });
}

/* ---------- contact ---------- */

function initContact() {
  const form = document.getElementById('ks-contact-form');
  if (!form) return;
  const note = document.getElementById('ks-contact-note');

  const rules = {
    'contact-name':    v => v.trim().length >= 2 || 'Enter your name.',
    'contact-email':   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    'contact-message': v => v.trim().length >= 10 || 'Tell us a little more — at least 10 characters.'
  };

  function validateField(id) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input || !error) return true;
    const result = rules[id](input.value);
    error.textContent = result === true ? '' : result;
    input.setAttribute('aria-invalid', result === true ? 'false' : 'true');
    return result === true;
  }

  Object.keys(rules).forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('blur', () => validateField(id));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      note.textContent = 'Check the highlighted fields above.';
      note.dataset.state = 'error';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    note.textContent = 'Looks good. Sending is not connected yet — this form goes live with the backend.';
    note.dataset.state = 'ok';
  });
}

/* ---------- article detail ---------- */

function initArticle() {
  const root = document.getElementById('ks-post');
  if (!root) return;

  const slug = new URLSearchParams(location.search).get('slug');
  const article = KS_ARTICLES.find(a => a.slug === slug);

  if (!article) {
    root.innerHTML = `
      <div class="ks-wrap ks-post__notfound">
        <h1>We couldn't find that article</h1>
        <p>It may have moved, or the link may be out of date.</p>
        <a class="ks-btn ks-btn--primary" href="blog.html">Back to the blog</a>
      </div>`;
    return;
  }

  document.title = `${article.title} — KidSpark at Home`;
  const desc = document.getElementById('ks-post-desc');
  if (desc) desc.setAttribute('content', article.excerpt);

  const paragraphs = (article.body && article.body.length ? article.body : [article.excerpt])
    .map(p => `<p>${escapeHtml(p)}</p>`).join('');

  root.innerHTML = `
    <div class="ks-post__hero">
      <div class="ks-wrap">
        <a class="ks-post__crumb" href="blog.html">&larr; All articles</a>
        <div class="ks-post__meta">
          <span class="ks-badge">${escapeHtml(article.category)}</span>
          <span class="ks-badge ks-badge--merchant">${escapeHtml(article.readMinutes)} min read</span>
        </div>
        <h1 class="ks-post__title">${escapeHtml(article.title)}</h1>
      </div>
      <div class="ks-wrap">
        <figure class="ks-post__figure">
          <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.alt)}"
               width="1200" height="600" fetchpriority="high">
        </figure>
      </div>
    </div>
    <div class="ks-wrap ks-post__body">${paragraphs}</div>`;

  const related = filterProducts(KS_PRODUCTS, { filter: p => p.category === article.categoryId, limit: 3 });
  if (related.length) {
    const wrap = document.getElementById('ks-post-related-wrap');
    mount('ks-post-related', related, p => productCard(p, KS_CURRENCY), '');
    if (wrap) wrap.hidden = false;
  }
}

/* ---------- boot ---------- */

/* ---------- scroll reveal ---------- */

/* Content starts hidden so it can animate in, which makes revealing it
   load-bearing: if it ever fails, the page just looks empty. So before
   hiding anything, confirm the browser is actually running animation
   frames. Where it is not (reduced-motion, background/headless contexts),
   the hiding class is dropped outright and everything is simply visible —
   no transition is ever started that could freeze half-finished. */
function initReveal() {
  const targets = Array.from(document.querySelectorAll('.ks-reveal'));
  if (!targets.length) return;

  const unhide = () => targets.forEach(el => el.classList.remove('ks-reveal'));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    unhide();
    return;
  }

  let framesRun = false;
  requestAnimationFrame(() => { framesRun = true; });

  setTimeout(() => {
    if (!framesRun) { unhide(); return; }
    startScrollReveal(targets, unhide);
  }, 150);
}

function startScrollReveal(targets, unhide) {
  let pending = targets;

  const inView = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  };

  const check = () => {
    pending = pending.filter(el => {
      if (!inView(el)) return true;
      el.classList.add('is-in');
      return false;
    });
    if (!pending.length) stop();
  };

  let last = 0;
  const onScroll = () => {
    const now = Date.now();
    if (now - last < 80) return;
    last = now;
    check();
  };

  function stop() {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  check();

  /* Final backstop, in case the scroll path ever stalls. */
  setTimeout(() => { unhide(); stop(); }, 4000);
}

function init() {
  initChrome();
  initNewsletter();
  initHome();
  initArticle();
  initShop();
  initBlog();
  initContact();
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
