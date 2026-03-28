# CLAUDE.md

This file provides guidance for AI assistants working with this repository.

## Repository Overview

This is a static marketing website for "Cloud ITsolutions" — a web development and mobile app agency. It is a pure static HTML/CSS/JS site hosted on **GitHub Pages** with Jekyll used only as the build/deploy mechanism.

**Live site**: https://dkauzi.github.io/

## Technology Stack

- **HTML5** — 5 static pages, no templating engine
- **CSS3** — Bootstrap 4 grid + custom styles + third-party plugins
- **JavaScript** — jQuery 3.0.0 based, no build step or module bundler
- **Bootstrap 4** — Grid layout and UI components
- **GitHub Pages + Jekyll** — Static site hosting; Jekyll builds the site but no `.md` content or Liquid templates are used
- **GitHub Actions** — Automated deployment via `.github/workflows/jekyll-gh-pages.yml`

## Directory Structure

```
/
├── index.html          # Homepage (hero, services, testimonials, CTA)
├── about.html          # About the company
├── clients.html        # Client testimonials
├── ourwork.html        # Portfolio/project showcase
├── contact.html        # Contact form page
├── css/
│   ├── style.css       # Main stylesheet (imports all others)
│   ├── responsive.css  # Responsive breakpoints
│   └── *.css           # Third-party plugin stylesheets (do not edit)
├── js/
│   ├── custom.js       # Custom site JavaScript (the only file to edit)
│   └── *.js            # Third-party vendor scripts (do not edit)
├── images/             # Site images and assets
├── fonts/              # Poppins, Font Awesome, IcoMoon font files
└── .github/workflows/
    └── jekyll-gh-pages.yml  # CI/CD deployment pipeline
```

## Pages

| File | Purpose | Key Sections |
|---|---|---|
| `index.html` | Homepage | Hero carousel (5 slides), web dev section, mobile section, testimonials, contact CTA |
| `about.html` | Company info | About content, team/values |
| `clients.html` | Testimonials | Client review cards |
| `ourwork.html` | Portfolio | Project showcase grid |
| `contact.html` | Contact | Form (name, phone, email, message), contact info |

## Development Workflow

### Making Changes

There is no build step. Edit files directly:

1. Edit HTML pages for content changes
2. Edit `css/style.css` for custom styles
3. Edit `js/custom.js` for custom JavaScript

### Deployment

Pushing to the `main` branch automatically triggers the GitHub Actions workflow:
1. Jekyll builds the site from the root directory
2. Artifact is uploaded
3. GitHub Pages deploys to https://dkauzi.github.io/

There is no local development server configured. To preview locally:
```bash
# Option 1: Simple Python server
python3 -m http.server 8000

# Option 2: Jekyll (if Ruby/Bundler installed)
bundle exec jekyll serve
```

### Branch Strategy

- `main` — production branch; pushes trigger automatic deployment
- Feature branches — develop changes here, merge to `main` when ready

## Code Conventions

### HTML

- All pages share the same header/nav and footer structure — keep them consistent when editing
- Bootstrap grid: `.container-fluid > .row > .col-*` pattern
- Common class patterns:
  - `.loader_bg` / `.loader` — page preloader
  - `.titlepage` — section headers
  - `.main_form` — form containers
  - Section comments: `<!-- section name -->` ... `<!-- end section name -->`
- Navigation items: About Us, Our Clients, Our Work, Contact Us — update all pages when changing nav

### CSS

- **Edit only** `css/style.css` and `css/responsive.css` for custom changes
- Do not modify vendor CSS files in `css/`
- Responsive breakpoints in `responsive.css`:
  - `1200px+` — desktop
  - `992px–1199px` — large tablet
  - `768px–991px` — tablet
  - `576px–767px` — small tablet
  - `<576px` — mobile
- Typography: `font-family: 'Poppins'` for body text, `'Rajdhani'` or `'Raleway'` for headings
- Color palette uses hex values — search existing styles before adding new color values

### JavaScript

- **Edit only** `js/custom.js` for site-specific JavaScript
- Do not modify vendor JS files in `js/`
- Uses jQuery — all DOM operations use `$(...)` syntax
- Custom code is wrapped in `$(function() { ... })` (document-ready)
- `js/custom.js` handles: preloader fade, scroll-to-top button, FancyBox lightbox, carousel, sidebar toggle

## Third-Party Dependencies

All dependencies are vendored locally (no npm, no CDN for core libs):

| Library | Version | Purpose |
|---|---|---|
| jQuery | 3.0.0 | DOM, events, AJAX |
| Bootstrap | 4/5 | Grid, nav, UI components |
| Font Awesome | 4.0.3 | Icons |
| FancyBox | 2.1.5 | Image lightbox |
| Owl Carousel | — | Image carousels |
| Revolution Slider | — | Hero slider (large: `js/plugin.js` is 918KB) |
| Animate.css | — | CSS animations |
| Modernizr | — | Feature detection |
| jQuery Validate | — | Form validation |

**Note**: `js/custom.js` line 69 loads an external tracking script from `leostop.com`. Be aware of this when reviewing for privacy/security.

## Key Files to Know

| File | Why It Matters |
|---|---|
| `js/custom.js` | All custom JS — the only JS file to edit |
| `css/style.css` | Main CSS entry point — imports all others |
| `css/responsive.css` | All responsive/media query rules |
| `index.html` | Primary page; template pattern for all other pages |
| `.github/workflows/jekyll-gh-pages.yml` | Deployment pipeline |

## What Not to Do

- Do not modify files in `js/revolution/` — large third-party slider plugin
- Do not modify vendored CSS/JS libraries
- Do not add a `_config.yml` without understanding the Jekyll build — the workflow uses default Jekyll settings
- Do not add a `.gitignore` without checking that `_site/` would be excluded (it is generated by Jekyll)
- Do not add `node_modules/` — there is no Node.js build pipeline

## Adding New Pages

Follow this pattern when adding a new HTML page:

1. Copy an existing page (e.g., `about.html`) as a starting point
2. Keep the `<head>` CSS imports identical
3. Keep the header/navigation block identical
4. Keep the footer and script imports identical
5. Replace only the main content area between header and footer
6. Add the new page link to the `<nav>` in **all** existing pages
