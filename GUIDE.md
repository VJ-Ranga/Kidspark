# KidSpark at Home — Complete Build Guide

> **Your server already has:** PHP 8.3 ✅ MySQL 8.0 ✅  
> **Need to install:** Composer (one-time, 5 minutes)  
> **Existing websites:** NOT affected — KidSpark lives in its own folder and DB

---

## Table of Contents

1. [What You're Building](#1-what-youre-building)
2. [Server Setup — Install Composer](#2-server-setup--install-composer)
3. [Hestia CP — Add KidSpark as a New Website](#3-hestia-cp--add-kidspark-as-a-new-website)
4. [Install CodeIgniter 4](#4-install-codeigniter-4)
5. [Database Setup](#5-database-setup)
6. [Configure the .env File](#6-configure-the-env-file)
7. [Project File Structure](#7-project-file-structure)
8. [Data Models (Database Tables)](#8-data-models-database-tables)
9. [Build Phases — Step by Step](#9-build-phases--step-by-step)
10. [Admin Panel Plan](#10-admin-panel-plan)
11. [Security Checklist](#11-security-checklist)
12. [Deployment & Go-Live Checklist](#12-deployment--go-live-checklist)
13. [Quick Reference — Spark Commands](#13-quick-reference--spark-commands)
14. [Decisions You Need to Make](#14-decisions-you-need-to-make)
15. [PHP Web Security — Common Mistakes and How to Avoid Them](#15-php-web-security--common-mistakes-and-how-to-avoid-them)

---

## 1. What You're Building

A full multi-page website for **KidSpark at Home** — a parenting/education blog with:

- Public site: blog, articles, product picks, categories, newsletter, contact
- Admin panel: login-protected dashboard to manage all content
- Backend: **CodeIgniter 4** (PHP framework) + **MySQL**
- Frontend: Server-rendered PHP views using the KidSpark design we already built

**Homepage (`index.html`) is already done.** When CI4 is set up, that HTML becomes the homepage view.

### Site Map

| Page | URL | Status |
|---|---|---|
| Home | `/` | HTML built, needs CI4 wiring |
| Blog index | `/blog` | To build |
| Article detail | `/blog/{slug}` | To build |
| Learning Tips | `/learning-tips` | To build |
| Activities | `/activities` | To build |
| Parenting | `/parenting` | To build |
| Product Picks | `/product-picks` | To build |
| Product detail | `/product-picks/{slug}` | To build |
| About | `/about` | To build |
| Contact | `/contact` | To build |
| Newsletter confirm/unsubscribe | `/newsletter/{token}` | To build |
| Privacy Policy | `/privacy` | To build |
| Terms of Use | `/terms` | To build |
| Admin login | `/admin/login` | To build |
| Admin dashboard | `/admin` | To build |
| Admin: articles | `/admin/articles` | To build |
| Admin: products | `/admin/products` | To build |
| Admin: categories | `/admin/categories` | To build |
| Admin: subscribers | `/admin/subscribers` | To build |
| Admin: contact messages | `/admin/messages` | To build |
| 404 / error pages | — | To build |

---

## 2. Server Setup — Install Composer

Composer is the PHP package manager. You only install it once on the server and it works for all projects.

### SSH into your server first

```bash
ssh your-username@your-server-ip
```

### Install Composer (one command)

```bash
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

### Verify it worked

```bash
composer --version
# Should print: Composer version 2.x.x
```

**That's it. Composer is now installed globally. Your existing websites are not affected at all.**

---

## 3. Hestia CP — Add KidSpark as a New Website

> ⚠️ **Important:** Never install CI4 into an existing website's folder. Give KidSpark its own domain/subdomain in Hestia so it's completely isolated.

### Option A — Use a subdomain while building (recommended)

In Hestia CP:

1. Go to **Web** → **Add Web Domain**
2. Domain: `kidspark.yourdomain.com` (or `dev.kidspark.com` or anything you like)
3. Leave everything else default, click **Save**

Hestia creates `/home/YOUR_USER/web/kidspark.yourdomain.com/public_html/`

### Option B — Use the KID folder directly

If you want to use the existing `/var/www/KID/` folder:

1. In Hestia CP → **Web** → your domain → **Edit**
2. Change the **Document Root** to `/var/www/KID/public` (CI4's public folder)
3. Click **Save**

### ⚠️ Why the document root must be `/public`

CodeIgniter 4 has this folder structure:

```
kidspark/
├── app/            ← your code (NOT public)
├── system/         ← CI4 core (NOT public)
├── writable/       ← logs/cache (NOT public)
├── public/         ← the ONLY folder the web server should see
│   └── index.php
└── .env            ← secrets (NOT public)
```

If the document root points to the project root instead of `/public`, visitors can access your `.env` file and see your database password. **Always point Hestia to the `/public` subfolder.**

---

## 4. Install CodeIgniter 4

### Navigate to where you want the project

```bash
cd /var/www/KID
```

### Scaffold CI4 via Composer

```bash
composer create-project codeigniter4/appstarter . --no-dev
```

> The `.` at the end means "install in current folder." This will create all the CI4 folders inside `/var/www/KID/`.

### Verify the install

```bash
ls
# You should see: app/ composer.json public/ system/ writable/ etc.
```

### Copy the environment file

```bash
cp env .env
```

### Test it works (dev server)

```bash
php spark serve
# Visit http://localhost:8080 — you should see the CI4 welcome page
```

Press `Ctrl+C` to stop the dev server when done.

---

## 5. Database Setup

### Create a database and user (do this once)

Log into MySQL:

```bash
mysql -u root -p
```

Run these SQL commands:

```sql
CREATE DATABASE kidspark CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kidspark_user'@'localhost' IDENTIFIED BY 'CHANGE_THIS_TO_A_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON kidspark.* TO 'kidspark_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> ⚠️ Replace `CHANGE_THIS_TO_A_STRONG_PASSWORD` with a real strong password. Store it somewhere safe.

**Your other databases (for leopardtrails, etc.) are completely separate and untouched.**

---

## 6. Configure the .env File

Open `/var/www/KID/.env` and update these values:

```ini
# Change to development while building, production on go-live
CI_ENVIRONMENT = development

# App base URL — change to your actual domain
app.baseURL = 'http://kidspark.yourdomain.com/'

# Database — use the credentials you created above
database.default.hostname = localhost
database.default.database = kidspark
database.default.username = kidspark_user
database.default.password = CHANGE_THIS_TO_A_STRONG_PASSWORD
database.default.DBDriver = MySQLi
database.default.DBPrefix =

# Email (uses your existing Hestia mail server)
email.fromEmail = noreply@yourdomain.com
email.fromName  = KidSpark at Home
email.SMTPHost  = localhost
email.SMTPPort  = 587
```

> ✅ `.env` is already in `.gitignore` — it will never be committed to GitHub.

---

## 7. Project File Structure

After setup, the full folder layout will look like this:

```
/var/www/KID/
├── .env                          ← secrets, never commit this
├── app/
│   ├── Config/
│   │   ├── Routes.php            ← all URL routes defined here
│   │   ├── App.php               ← base URL, charset, etc.
│   │   └── Email.php             ← mail settings
│   ├── Controllers/
│   │   ├── Home.php              ← public homepage
│   │   ├── Blog.php              ← blog index + article detail
│   │   ├── Products.php          ← product picks pages
│   │   ├── Pages.php             ← about, contact, privacy, terms
│   │   ├── Newsletter.php        ← subscribe / confirm / unsubscribe
│   │   └── Admin/
│   │       ├── Auth.php          ← admin login/logout
│   │       ├── Dashboard.php     ← admin home
│   │       ├── Articles.php      ← CRUD
│   │       ├── Products.php      ← CRUD
│   │       ├── Categories.php    ← CRUD
│   │       ├── Subscribers.php   ← view + export
│   │       └── Messages.php      ← view contact submissions
│   ├── Models/
│   │   ├── CategoryModel.php
│   │   ├── ArticleModel.php
│   │   ├── ProductModel.php
│   │   ├── SubscriberModel.php
│   │   ├── ContactMessageModel.php
│   │   └── AdminUserModel.php
│   ├── Views/
│   │   ├── layouts/
│   │   │   ├── public.php        ← header + footer wrapper for public pages
│   │   │   └── admin.php         ← admin panel wrapper
│   │   ├── home/
│   │   │   └── index.php         ← homepage (converted from index.html)
│   │   ├── blog/
│   │   │   ├── index.php
│   │   │   └── article.php
│   │   ├── products/
│   │   │   ├── index.php
│   │   │   └── detail.php
│   │   ├── pages/
│   │   │   ├── about.php
│   │   │   ├── contact.php
│   │   │   ├── privacy.php
│   │   │   └── terms.php
│   │   ├── newsletter/
│   │   │   └── confirm.php
│   │   ├── admin/
│   │   │   ├── login.php
│   │   │   ├── dashboard.php
│   │   │   ├── articles/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── subscribers/
│   │   │   └── messages/
│   │   └── errors/
│   │       ├── html/error_404.php
│   │       └── html/error_500.php
│   └── Database/
│       ├── Migrations/           ← schema changes, version controlled
│       │   ├── 001_create_categories.php
│       │   ├── 002_create_articles.php
│       │   ├── 003_create_products.php
│       │   ├── 004_create_subscribers.php
│       │   ├── 005_create_contact_messages.php
│       │   └── 006_create_admin_users.php
│       └── Seeds/
│           ├── CategorySeeder.php  ← inserts the 6 default categories
│           └── AdminSeeder.php     ← inserts first admin user
├── public/
│   ├── index.php                 ← entry point (Hestia points here)
│   └── assets/
│       ├── css/
│       ├── js/
│       ├── images/
│       └── uploads/              ← article/product images go here
│           └── .htaccess         ← blocks PHP execution in uploads
├── writable/
│   ├── cache/
│   ├── logs/
│   └── session/
└── composer.json
```

---

## 8. Data Models (Database Tables)

These are the exact tables that will be created by the migrations:

### categories
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | e.g. "Learning & Development" |
| slug | VARCHAR(120), UNIQUE | e.g. "learning-development" |
| description | TEXT | short blurb |
| icon | VARCHAR(50) | SVG or icon class name |
| color | VARCHAR(20) | hex colour for the card accent |
| created_at | DATETIME | UTC |
| updated_at | DATETIME | UTC |

### articles
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| category_id | INT, FK → categories.id | |
| title | VARCHAR(200) | |
| slug | VARCHAR(220), UNIQUE | auto-generated from title |
| excerpt | TEXT | used on blog index cards |
| body | LONGTEXT | full article content |
| cover_image | VARCHAR(255) | path under `public/assets/uploads/` |
| tag_label | VARCHAR(50) | badge text e.g. "LEARNING TIPS" |
| read_minutes | TINYINT | e.g. 6 |
| meta_title | VARCHAR(70) | for `<title>` tag |
| meta_description | VARCHAR(160) | for meta description |
| status | ENUM('draft','published','archived') | only 'published' shows publicly |
| published_at | DATETIME | UTC, can be future-dated to schedule |
| created_at | DATETIME | UTC |
| updated_at | DATETIME | UTC |

### products
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| title | VARCHAR(200) | |
| slug | VARCHAR(220), UNIQUE | |
| description | TEXT | |
| image | VARCHAR(255) | |
| price | DECIMAL(8,2) | |
| rating | DECIMAL(2,1) | e.g. 4.8 |
| review_count | INT | |
| buy_url | VARCHAR(500) | affiliate/external link |
| status | ENUM('active','hidden') | |
| created_at | DATETIME | UTC |
| updated_at | DATETIME | UTC |

### subscribers
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| email | VARCHAR(255), UNIQUE | |
| token | VARCHAR(64), UNIQUE | used for confirm + unsubscribe links |
| status | ENUM('pending','subscribed','unsubscribed') | pending = awaiting double opt-in |
| subscribed_at | DATETIME | when they confirmed |
| unsubscribed_at | DATETIME | nullable |
| created_at | DATETIME | UTC |

### contact_messages
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | |
| email | VARCHAR(255) | |
| message | TEXT | |
| ip_address | VARCHAR(45) | for spam triage, stored, never shown |
| status | ENUM('new','read','archived') | |
| submitted_at | DATETIME | UTC |

### admin_users
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | |
| email | VARCHAR(255), UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt via password_hash() |
| role | ENUM('superadmin','editor') | for future multi-user support |
| last_login_at | DATETIME | nullable |
| created_at | DATETIME | UTC |

---

## 9. Build Phases — Step by Step

### Phase 1 — Content Backbone

**Goal:** CI4 installed, DB wired up, admin can log in and manage content.

#### Step 1: Enable CSRF globally

In `app/Config/Filters.php`, add `'csrf'` to the `$globals['before']` array.

#### Step 2: Run migrations

```bash
php spark migrate
```

This creates all 6 tables in your database.

#### Step 3: Seed default data

```bash
php spark db:seed CategorySeeder
php spark db:seed AdminSeeder
```

This inserts the 6 category rows and your first admin login.

#### Step 4: Admin auth (login/logout)

- Simple session-based login: email + password → `password_verify()` → start session
- A `AdminAuthFilter` filter checks for valid session on every `/admin/*` route
- Rate-limit: lock out IP after 5 failed attempts in 10 minutes (stored in session or cache)

#### Step 5: Admin CRUD screens (in this order)

1. **Categories** — list, create, edit, delete (articles need categories to exist first)
2. **Articles** — list, create, edit, delete; image upload; slug auto-generate; status toggle
3. **Products** — list, create, edit, delete; image upload; buy URL field

#### Step 6: Secure file uploads

Every image upload must:
- Validate MIME type (`image/jpeg`, `image/png`, `image/webp` only — no PHP files)
- Randomize the filename (`bin2hex(random_bytes(16)) . '.jpg'`)
- Store in `public/assets/uploads/`
- The uploads folder has an `.htaccess` that blocks PHP execution:

```apache
# public/assets/uploads/.htaccess
<FilesMatch "\.php$">
    Deny from all
</FilesMatch>
Options -ExecCGI
AddHandler cgi-script .php .pl .py .jsp .asp .sh .cgi
```

#### Step 7: Wire homepage to real data

Replace the hardcoded arrays in `Home.php` with Model queries:
- `CategoryModel::findAll()`
- `ArticleModel::getFeatured(3)` — latest 3 published articles
- `ProductModel::getFeatured(3)` — 3 active products

The homepage HTML stays identical; only the data source changes.

---

### Phase 2 — Public Content Pages

**Goal:** Visitors can browse and read everything.

#### Blog index (`/blog`)
- Paginated list, 9 articles per page
- Filter by category via query string `?category=parenting`
- Uses CI4's built-in Pager for pagination

#### Article detail (`/blog/{slug}`)
- Full article content
- Related articles (same category, 3 random)
- Social share buttons (need Open Graph meta tags)
- Each article has its own `<title>`, meta description, og:image

#### Category pages (`/learning-tips`, `/activities`, `/parenting`)
- All three reuse one view — just pass a different category slug
- Breadcrumb: Home → Category name

#### Product Picks (`/product-picks`)
- Grid of all active products
- Sort by price / rating (query string: `?sort=price`)
- "View Details" links to `/product-picks/{slug}`

#### Product detail (`/product-picks/{slug}`)
- Full description, image, rating, price
- "Buy Now" affiliate button links to `buy_url` (opens in new tab)

---

### Phase 3 — Engagement Features

**Goal:** Newsletter and contact form working end-to-end.

#### Contact form (`/contact`)

Flow:
1. Visitor submits name, email, message + hidden honeypot field
2. Server validates: CSRF token, required fields, valid email, honeypot empty
3. Rate limit: max 3 submissions per IP per hour
4. Store in `contact_messages` table with status = `new`
5. Send notification email to your inbox
6. Show "Thank you" confirmation

#### Newsletter (`/`) — site-wide form

Double opt-in flow:
1. Visitor submits email
2. Create subscriber row with status = `pending` and a random `token`
3. Send confirmation email: "Click here to confirm" → `/newsletter/confirm/{token}`
4. Visitor clicks link → status changes to `subscribed`, `subscribed_at` set
5. "You're in!" page shown

Unsubscribe:
- Every email you send includes `/newsletter/unsubscribe/{token}`
- Clicking it sets status = `unsubscribed`, `unsubscribed_at` set
- No login needed, no confirmation needed (CAN-SPAM / GDPR requirement)

#### Admin: Subscribers view (`/admin/subscribers`)
- Paginated table: email, status, subscribed_at
- Filter by status (pending / subscribed / unsubscribed)
- CSV export button (`?export=csv` — streams a downloadable file)

#### Admin: Messages view (`/admin/messages`)
- Paginated table: name, email, preview of message, submitted_at, status
- Click to read full message → marks as `read`
- Archive button → marks as `archived`

---

### Phase 4 — Polish & Launch

**Goal:** Everything production-ready.

1. **About page** — brand story, mission text (you provide copy or use placeholder)
2. **Privacy Policy page** — required for email collection; covers GDPR basics
3. **Terms of Use page** — basic terms
4. **404 page** — branded KidSpark not-found page
5. **500 error page** — friendly "something went wrong" page
6. **sitemap.xml** — auto-generated route listing all published articles and products
7. **robots.txt** — allow all except `/admin/`
8. **Caching** — CI4 page caching on homepage and blog index (5-minute TTL)
9. **Image lazy-loading** — `loading="lazy"` on all `<img>` tags below the fold
10. **Production .env** — flip `CI_ENVIRONMENT = production`, set real domain, HTTPS forced

---

## 10. Admin Panel Plan

The admin is a simple, clean panel — no external packages needed.

### URL structure

```
/admin               → dashboard (article count, subscriber count, message count)
/admin/login         → login form (only public admin page)
/admin/articles      → list all articles
/admin/articles/new  → create article form
/admin/articles/edit/{id}  → edit article
/admin/products      → list all products
/admin/products/new
/admin/products/edit/{id}
/admin/categories    → list + inline edit (only 6 rows, no pagination needed)
/admin/subscribers   → read-only list + CSV export
/admin/messages      → read contact submissions
```

### Admin auth flow

```
Visitor → /admin/* → AdminAuthFilter → session exists? 
    YES → allow through
    NO  → redirect to /admin/login
```

Login:
- Find admin_user by email
- `password_verify($submitted, $stored_hash)`
- If match: regenerate session ID, set `is_admin = true` in session
- If fail: increment fail counter; after 5 fails → lockout for 10 min

### Admin design

Keep the admin UI simple — plain white layout with the KidSpark brand colours for buttons and headings. No need for Bootstrap or external CSS; just clean functional forms.

---

## 11. Security Checklist

Run through this during every phase — not just at the end.

### CSRF
- [ ] Enabled globally in `app/Config/Filters.php`
- [ ] Every form has `<?= csrf_field() ?>`
- [ ] AJAX requests include the CSRF token in headers

### XSS / Output escaping
- [ ] Every `<?= $variable ?>` uses `esc($variable)` — example: `<?= esc($article->title) ?>`
- [ ] Article body field: either restrict to Markdown (safe) or run through HTMLPurifier before storing
- [ ] Never use `echo $userInput` directly

### SQL injection
- [ ] Use CI4 Query Builder / Model layer everywhere
- [ ] Never concatenate user input into a raw SQL string
- [ ] Validate all inputs with CI4's Validation library before touching the DB

### Admin auth
- [ ] Passwords hashed with `password_hash($pass, PASSWORD_BCRYPT)`
- [ ] Session cookie: httponly, samesite=Lax, secure (in production)
- [ ] Session regenerated on login: `session()->regenerate()`
- [ ] Login rate limiting (5 attempts → 10-min lockout)
- [ ] Admin filter on every `/admin/*` route

### File uploads
- [ ] MIME type validated (only image types)
- [ ] Filename randomized, never use original filename
- [ ] `.htaccess` in uploads dir blocks PHP execution
- [ ] Max file size enforced (e.g. 2MB)

### Public forms
- [ ] Honeypot field on contact + newsletter forms
- [ ] Per-IP rate limit on form submissions
- [ ] CSRF token on every form

### Production config
- [ ] `CI_ENVIRONMENT = production` (disables debug output, hides errors)
- [ ] `forceGlobalSecureRequests = true` (forces HTTPS)
- [ ] Debug toolbar disabled in production
- [ ] `.env` never committed to git

---

## 12. Deployment & Go-Live Checklist

When you're ready to push to the live server:

### Pre-deploy

- [ ] Dump the production DB: `mysqldump kidspark > backup_$(date +%Y%m%d).sql`
- [ ] Snapshot the uploads folder: `tar -czf uploads_$(date +%Y%m%d).tar.gz public/assets/uploads/`

### Deploy steps

```bash
# On your server
cd /var/www/KID
git pull origin main
composer install --no-dev --optimize-autoloader
php spark migrate
```

### Hestia CP settings

- [ ] Document root points to `/var/www/KID/public` (not project root)
- [ ] Let's Encrypt SSL enabled for the domain
- [ ] PHP version set to 8.1 or 8.3

### Post-deploy verification

- [ ] `CI_ENVIRONMENT = production` in `.env`
- [ ] `app.baseURL` matches the live domain (with https)
- [ ] CSRF enabled and working (submit a form, check it doesn't break)
- [ ] HTTPS redirect working (http:// → https://)
- [ ] Admin login works
- [ ] Newsletter email actually sends (send yourself a test)
- [ ] Contact form stores + sends notification email
- [ ] 404 page styled correctly (visit `/this-does-not-exist`)
- [ ] `/admin/` is NOT accessible without login
- [ ] sitemap.xml accessible at `/sitemap.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] Debug toolbar not visible in the browser
- [ ] No error details shown on any page (production mode hides them)

---

## 13. Quick Reference — Spark Commands

These are the terminal commands you'll use most during development:

```bash
# Start local dev server (while coding)
php spark serve

# Run all pending database migrations
php spark migrate

# Roll back last migration (undo)
php spark migrate:rollback

# Run a specific seeder
php spark db:seed CategorySeeder
php spark db:seed AdminSeeder

# Create a new migration file
php spark make:migration create_articles

# Create a new Model
php spark make:model ArticleModel

# Create a new Controller
php spark make:controller Blog

# Clear the CI4 cache
php spark cache:clear

# Check all routes registered in the app
php spark routes

# Check CI4 version
php spark --version
```

---

## 14. Decisions You Need to Make

Before Phase 1 can start, confirm these 5 things:

### 1. Domain / URL for KidSpark
What domain or subdomain will this site use?
- Example: `kidspark.yourdomain.com`, `www.kidspark.com`, `kidspark-home.com`
- This affects the `.env` `app.baseURL` and the Hestia virtual host setup

### 2. Content during build
- **"Use placeholder content"** → I'll write realistic placeholder articles/products so the site looks real while building
- **"I have real content"** → Share it and I'll build the seed files from your actual data

### 3. Admin accounts
- **Single admin** → One login, simpler code
- **Multiple with roles** → `superadmin` can do everything; `editor` can only manage articles (no user management)
- Recommendation: start with single admin; it's easy to add roles later

### 4. Article body format
This affects how articles are stored and displayed, and is a security decision:
- **Markdown** — Author writes `**bold**`, `# Heading` etc. Stored as plain text, rendered to HTML on display. Safest option, no XSS risk. Requires the `michelf/php-markdown` Composer package.
- **Plain text with line breaks** — Simplest. No formatting at all. Good for very simple content.
- **Rich text (WYSIWYG)** — Author sees a Word-like editor (TinyMCE). HTML is stored. Requires HTMLPurifier to sanitize. Most flexible but most complex.
- Recommendation: **Markdown** — gives formatting without security headaches

### 5. Newsletter delivery
- **Self-hosted only** — emails sent via your Hestia server's mail. No external service. Works fine for under ~1000 subscribers.
- **Sync to Mailchimp/Brevo** — subscriber emails also get added to an external list via API. Better deliverability for large lists, more work to set up.
- Recommendation: **Start self-hosted**, add Mailchimp/Brevo sync later if the list grows

---

## 15. PHP Web Security — Common Mistakes and How to Avoid Them

This section covers every major security mistake PHP developers make, with
bad vs. good code examples and the CI4-specific fix. Read this before writing
a single line of Phase 1 code.

---

### OWASP Top 10 mapped to this project

| # | Vulnerability | Risk for KidSpark | How we prevent it |
|---|---|---|---|
| A01 | Broken Access Control | Admin pages, draft articles, IDOR on edit routes | Auth filter, role map, always query by status |
| A02 | Cryptographic Failures | Passwords, newsletter tokens exposed | bcrypt, random_bytes(32) tokens, HTTPS |
| A03 | Injection (SQL / Command) | Any DB query with user input | CI4 Query Builder only, never raw SQL |
| A04 | Insecure Design | Guessable tokens, no rate limiting | Designed in from Phase 1 |
| A05 | Security Misconfiguration | Debug mode on in prod, .env exposed | production .env, doc root = /public |
| A06 | Outdated Components | Old CI4 / PHP version | composer update regularly |
| A07 | Auth Failures | Weak passwords, no lockout | bcrypt, 5-attempt lockout |
| A08 | Integrity Failures | File uploads executing as PHP | .htaccess blocks PHP in uploads/ |
| A09 | Logging Failures | No record of login attempts or errors | CI4 logger + admin login log |
| A10 | SSRF | buy_url field fetched server-side | Never fetch external URLs server-side |

---

### Mistake 1 — SQL Injection

The most classic PHP mistake. Happens when user input is pasted directly into a query.

**BAD — never do this:**
```php
// User types: ' OR '1'='1  → dumps the whole table
$slug = $_GET['slug'];
$query = "SELECT * FROM articles WHERE slug = '$slug'";
$db->query($query);
```

**GOOD — CI4 Query Builder escapes everything automatically:**
```php
// CI4 Query Builder — input is always parameterised
$article = $this->db->table('articles')
    ->where('slug', $slug)
    ->where('status', 'published')
    ->get()->getRowObject();
```

**Rule:** Never concatenate `$_GET`, `$_POST`, or any user value into a SQL string. Always use the Query Builder or Model layer.

---

### Mistake 2 — XSS (Cross-Site Scripting)

Happens when user-supplied text is printed to the page without escaping.
An attacker stores `<script>stealCookies()</script>` in a field, and every visitor who loads that page runs it.

**BAD:**
```php
echo $article->title;
// If title contains <script>...</script>, it runs in the visitor's browser
```

**GOOD — always use esc():**
```php
echo esc($article->title);
// Outputs: &lt;script&gt;...&lt;/script&gt; — harmless text
```

**Special case — article body (HTML content):**
```php
// If body contains intentional HTML (from a WYSIWYG editor):
// Run it through HTMLPurifier before storing, not on output
$purifier = new HTMLPurifier();
$safeBody = $purifier->purify($rawBody);
// Store $safeBody in DB — output it normally with echo
```

**Rule:** Every `echo $variable` in a view must be `echo esc($variable)`. The only exception is HTML you have already sanitized with HTMLPurifier before saving.

---

### Mistake 3 — Broken Access Control / IDOR

A logged-in editor visits `/admin/articles/edit/1` then changes the URL to `/admin/articles/edit/99`. If the controller just does `find($id)` without checking anything else, they can edit any article.

**BAD:**
```php
public function edit($id)
{
    $article = $this->articleModel->find($id); // trusts the URL blindly
    return view('admin/articles/edit', ['article' => $article]);
}
```

**GOOD — always validate the record exists and handle the miss:**
```php
public function edit($id)
{
    $article = $this->articleModel->find($id);

    if (!$article) {
        throw new \CodeIgniter\Exceptions\PageNotFoundException();
    }

    // If you have roles: also check the editor is allowed to touch this record
    return view('admin/articles/edit', ['article' => $article]);
}
```

**For public pages — draft articles must never be reachable:**
```php
// WRONG — a draft leaks if you know the slug
$article = $this->articleModel->where('slug', $slug)->first();

// CORRECT — always filter by status AND published_at
$article = $this->articleModel
    ->where('slug', $slug)
    ->where('status', 'published')
    ->where('published_at <=', date('Y-m-d H:i:s'))
    ->first();

if (!$article) {
    throw new \CodeIgniter\Exceptions\PageNotFoundException();
}
```

---

### Mistake 4 — CSRF (Cross-Site Request Forgery)

A malicious website tricks a logged-in admin into submitting a form on your site. Without CSRF protection, that form executes (deletes an article, changes a password, etc.).

**Enable globally in CI4 — do this in Phase 1, never skip it:**
```php
// app/Config/Filters.php
public array $globals = [
    'before' => [
        'csrf',  // ← add this line
    ],
];
```

**Every form must include the token:**
```php
<form method="post" action="/admin/articles/delete/<?= $article->id ?>">
    <?= csrf_field() ?>  <!-- ← always include this -->
    <button type="submit">Delete</button>
</form>
```

**AJAX requests — include the token in headers:**
```javascript
fetch('/newsletter/subscribe', {
    method: 'POST',
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: emailInput.value })
});
```

---

### Mistake 5 — Insecure File Uploads

The most dangerous mistake specific to this project. If an attacker uploads a `.php` file disguised as an image, and your server executes it, they have full server access.

**BAD — trusting the file extension or browser-reported type:**
```php
$file = $this->request->getFile('cover_image');
$file->move(WRITEPATH . 'uploads', $file->getName()); // original filename kept!
// Attacker uploads shell.php → it's now on your server and executable
```

**GOOD — full safe upload in CI4:**
```php
$file = $this->request->getFile('cover_image');

// 1. Validate MIME type by reading the file itself (not trusting the browser)
$allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!in_array($file->getMimeType(), $allowedMimes)) {
    return redirect()->back()->with('error', 'Only images are allowed.');
}

// 2. Validate size (2MB max)
if ($file->getSize() > 2 * 1024 * 1024) {
    return redirect()->back()->with('error', 'Image must be under 2MB.');
}

// 3. Generate a random filename — never use the original name
$newName = bin2hex(random_bytes(16)) . '.' . $file->getExtension();

// 4. Move to uploads directory
$file->move(ROOTPATH . 'public/assets/uploads/', $newName);
```

**Block PHP execution in the uploads directory (add this file):**
```apache
# public/assets/uploads/.htaccess
<FilesMatch "\.php$">
    Order Deny,Allow
    Deny from all
</FilesMatch>
Options -ExecCGI
RemoveHandler .php .phtml .php3 .php4 .php5
RemoveType .php .phtml
```

This means even if an attacker somehow gets a PHP file into that folder, the server refuses to execute it.

---

### Mistake 6 — Storing Passwords in Plain Text or Weak Hashes

**BAD — never store plain text or MD5/SHA1:**
```php
$user->password = $password;          // plain text
$user->password = md5($password);     // broken, cracked in seconds
$user->password = sha1($password);    // also broken
```

**GOOD — bcrypt via PHP's built-in function:**
```php
// When creating/updating a password:
$hash = password_hash($plainPassword, PASSWORD_BCRYPT);
// Store $hash in DB

// When verifying login:
if (password_verify($submittedPassword, $storedHash)) {
    // password is correct
}
```

bcrypt is slow by design — it takes ~100ms to hash. That's fine for login but makes brute-force attacks take years.

---

### Mistake 7 — Exposing Sensitive Error Messages in Production

In development, full error traces are useful. In production, they hand attackers a map of your server.

**BAD — production site showing:**
```
A PHP Error was encountered
Severity: Notice
Message: Undefined variable: article
Filename: /var/www/KID/app/Controllers/Blog.php
Line Number: 47
```

**GOOD — two changes:**

1. Set environment in `.env`:
```ini
CI_ENVIRONMENT = production
```

2. Never output raw exception details to the browser. CI4 hides them automatically in production mode and logs them to `writable/logs/` instead.

---

### Mistake 8 — Weak or Predictable Tokens

Newsletter confirm/unsubscribe links use a token in the URL. If that token is predictable, anyone can unsubscribe anyone else or forge confirmations.

**BAD — predictable tokens:**
```php
$token = md5($email);           // predictable, crackable
$token = base64_encode($email); // not even hashed, just encoded
$token = uniqid();              // only 15 hex chars, guessable
```

**GOOD — cryptographically random:**
```php
$token = bin2hex(random_bytes(32)); // 64 random hex characters
// Statistically impossible to guess
```

---

### Mistake 9 — No Rate Limiting on Forms

Without rate limiting, bots can:
- Submit your contact form thousands of times
- Flood your newsletter subscribers table with fake emails
- Brute-force the admin login

**Add a honeypot field (catches simple bots):**
```html
<!-- Hidden from real users via CSS, bots fill it in -->
<input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off">
```

```php
// Server-side: if honeypot is filled, silently discard
if (!empty($this->request->getPost('website'))) {
    return redirect()->back(); // don't tell the bot it was caught
}
```

**Per-IP rate limiting (catches persistent bots):**
```php
// Using CI4's Cache — max 3 contact submissions per IP per hour
$ip = $this->request->getIPAddress();
$key = 'contact_' . md5($ip);
$count = cache($key) ?? 0;

if ($count >= 3) {
    return redirect()->back()->with('error', 'Please wait before submitting again.');
}

cache()->save($key, $count + 1, 3600); // expires in 1 hour
```

---

### Mistake 10 — Open Redirects

The product picks page has a `buy_url` that links to external sites. Never redirect server-side through your domain.

**BAD:**
```php
// /goto?url=https://amazon.com/...
// Attacker changes to: /goto?url=https://phishing-site.com
public function goto()
{
    return redirect()->to($this->request->getGet('url')); // DANGEROUS
}
```

**GOOD — link directly in HTML, never proxy redirects:**
```html
<a href="<?= esc($product->buy_url) ?>" target="_blank" rel="noopener noreferrer">
    Buy Now
</a>
```

The link goes directly from the visitor's browser to the external site. Your server is never involved in the redirect.

---

### Mistake 11 — Security Misconfiguration (.env exposed, debug on)

If your Hestia document root is set to the project root instead of `/public`, visitors can access `/.env` directly in a browser and see your database password.

**Check:** visit `https://yourdomain.com/.env` in a browser.
- If you see text content → your document root is wrong. Fix Hestia to point to `/public`.
- If you get a 403 or 404 → you're safe.

**Also disable the CI4 debug toolbar in production:**
```ini
# .env
CI_ENVIRONMENT = production
# Toolbar automatically disables itself in production mode
```

---

### Mistake 12 — Not Validating on the Server

Client-side validation (HTML `required`, JavaScript checks) is for user experience only. Anyone can bypass it by sending a raw HTTP request. **Always validate on the server.**

**BAD — relying on HTML validation:**
```html
<input type="email" name="email" required>
<!-- Attacker bypasses this with curl and sends whatever they want -->
```

**GOOD — CI4 Validation on every form submission:**
```php
$rules = [
    'name'    => 'required|min_length[2]|max_length[100]',
    'email'   => 'required|valid_email|max_length[255]',
    'message' => 'required|min_length[10]|max_length[2000]',
];

if (!$this->validate($rules)) {
    return redirect()->back()
        ->withInput()
        ->with('errors', $this->validator->getErrors());
}
```

---

### Skill Areas You Need for a Secure PHP Project

These are the knowledge areas to build — not Claude skills, but developer skills:

| Skill Area | Why it matters for this project | Where to learn |
|---|---|---|
| **CI4 Query Builder** | Prevents SQL injection — you must use it for every DB query | codeigniter.com/user_guide |
| **CI4 Validation** | Server-side form validation — never trust client input | CI4 docs → Validation |
| **CI4 Filters** | How auth filters work to protect `/admin/*` routes | CI4 docs → Filters |
| **PHP `password_hash` / `password_verify`** | Correct password storage — 2 functions, used in one place | php.net/password-hash |
| **PHP `random_bytes`** | Generating secure tokens for newsletter links | php.net/random-bytes |
| **HTTP headers for security** | Content-Security-Policy, X-Frame-Options, etc. | owasp.org/www-project-secure-headers |
| **Session security** | httponly, samesite, secure flags on the session cookie | CI4 docs → Sessions |
| **HTMLPurifier** | If you use a WYSIWYG editor — sanitizes HTML before storing | htmlpurifier.org |
| **OWASP Top 10** | The standard checklist every web developer should know | owasp.org/Top10 |

### Composer packages to install for security

```bash
# If using Markdown for article body (recommended — avoids XSS from rich text)
composer require michelf/php-markdown

# If using WYSIWYG / rich text editor instead of Markdown
composer require ezyang/htmlpurifier

# Optional: for more powerful server-side validation rules
# (CI4's built-in validation covers most cases)
```

---

### Security Rules — Short Version (Pin This)

```
1.  Never concatenate user input into SQL               → always use Query Builder
2.  Never echo $variable without esc()                  → always echo esc($var)
3.  Never trust file uploads                            → validate MIME + randomize name
4.  Never store plain text or MD5 passwords             → always bcrypt
5.  Never use predictable tokens                        → always random_bytes(32)
6.  Never skip CSRF on forms                            → always csrf_field()
7.  Never access records without checking they exist    → always 404 if not found
8.  Never show errors in production                     → CI_ENVIRONMENT=production
9.  Never point doc root at project root                → always point to /public
10. Never validate only on the client                   → always validate server-side
```

If every page and form in the project follows these 10 rules, the site is clean.

---

## Summary — What You Need to Do Right Now

Just two things before we can start Phase 1:

```bash
# 1. Install Composer (takes 2 minutes)
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 2. Tell me your answers to the 5 decisions in Section 14
```

Once those are done, I'll scaffold the full CI4 project, create all the migrations, set up admin auth, and we'll work through the phases one by one.

---

*Last updated: June 2026 | Project: KidSpark at Home | Stack: CodeIgniter 4 + MySQL + PHP 8.3*
