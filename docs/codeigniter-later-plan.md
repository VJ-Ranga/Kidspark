# CodeIgniter Later Plan

## Context

The current project looks like a static frontend/demo handoff, not an existing PHP or CodeIgniter application. There is no `composer.json`, CodeIgniter app structure, or existing PHP backend in the workspace.

If we decide to use CodeIgniter later, the current static HTML/CSS/JS work will need to be moved into a new CodeIgniter 4 project structure.

## What We Discussed

- CodeIgniter can be used if this project needs a PHP backend.
- The current `index.html` or handoff files would become CodeIgniter views.
- Static assets such as CSS, JavaScript, images, and uploads should move into `public/assets/`.
- Reusable page sections like header, footer, navigation, and layout wrappers should become shared view partials.
- If the site needs editable content, we will need a database and either an admin panel or backend forms.

## Basic Requirements

- PHP 8.1 or newer
- Composer
- CodeIgniter 4
- MySQL or MariaDB if dynamic content is needed
- Apache or Nginx configured to serve the CodeIgniter `public/` directory

## Proposed CodeIgniter Structure

```text
app/
  Controllers/
  Models/
  Views/
    layouts/
    partials/
public/
  assets/
    css/
    js/
    images/
writable/
.env
composer.json
```

## Later Implementation Plan

1. Confirm whether this should be a simple dynamic website or a site with an admin panel.
2. Install a fresh CodeIgniter 4 project.
3. Configure `.env`, base URL, and database if needed.
4. Move the current frontend into CodeIgniter views.
5. Move assets into `public/assets/`.
6. Create routes and controllers for public pages.
7. Add models and database migrations only if dynamic content is required.
8. Add validation, CSRF protection, and secure form handling for any user input.
9. Test locally before deployment.

## Open Decision

Before starting CodeIgniter work, decide:

- Simple dynamic website only
- Website with an admin panel for editing content
- Full custom system with users, roles, database management, and backend workflows

## Status

CodeIgniter work is parked for later. No implementation has started yet.
