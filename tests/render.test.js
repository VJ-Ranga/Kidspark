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
