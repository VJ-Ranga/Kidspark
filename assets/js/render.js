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
      <div class="ks-card__tags">
        ${product.age ? `<span class="ks-badge ks-badge--age">${escapeHtml(product.age)}</span>` : ''}
        <span class="ks-badge ks-badge--merchant">at ${escapeHtml(product.merchant.name)}</span>
      </div>
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
  <a href="blog-post.html?slug=${escapeHtml(article.slug)}">
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
      <a href="blog-post.html?slug=${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a>
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
