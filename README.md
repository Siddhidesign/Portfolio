# Siddhi Manche, portfolio

Source for [siddhidesign.github.io/Portfolio](https://siddhidesign.github.io/Portfolio).

Hand-built in HTML, CSS and JavaScript. No framework, no build step. Push to `main` and GitHub Pages serves it.

## Structure

```
index.html            Homepage
css/site.css          The design system: day and night tokens, components, homepage and project page layouts
js/site.js            Day/night switch, live video play/pause, chat, dock, sliders, reveal
cases/*.html          Project pages (all use css/site.css and js/site.js; jaihind.html also has a small inline style block)

Coded product screens (each project's screens rebuilt in HTML, CSS and JavaScript)
css/jh-app.css        Jai Hind console: tokens, layouts, wireframe/before/after modes, desktop and phone
js/jh-app.js          Jai Hind console: dashboard, orders, customers, 4-step sales order
js/jh-research.js     Jai Hind research blocks: audit filter, persona tabs, journeys, style guide, components
css/proto.css         Phone prototype shell shared by IRS2GO, Money Anchor and EV: frame, controls,
js/proto.js           "Things to try" checklist, sheets, toasts, coded before/after slider
css/ir-app.css        IRS2GO redesign and the original app ("Old app" mode with problem pins)
js/ir-app.js
css/ma-app.css        Money Anchor: budget, AI chat and explanations, Design notes and Before fixes modes
js/ma-app.js
css/ev-app.css        EV charging: map, routes, stations, check-in and payment
js/ev-app.js
css/case-kit.css      Coded research and testing blocks used across case pages (sources, tables,
js/case-kit.js        tabbed charts, score scales, personas, funnels, flows, wireframes)
css/lab.css           Omkar resizable catalog recreation and FindMe component states playground
js/lab.js
css/codeview.css      Omkar "code + live preview": file tabs, highlighted excerpts, notes that run
js/codeview.js        their code in the preview, an inspector, phone/tablet/desktop sizes
omkar-rebuild/        Static export of my 2026 Next.js rebuild of the Omkar Labels site, shown in that preview

assets/live/          Looping preview videos (mp4) and their poster frames, one per project (used on the homepage)
assets/home/          Hero backgrounds, cut-out "things" and photo stickers (st-*), timeline polaroids (snap-*), chat avatar
assets/               Other images: real photos, hand-drawn sketches, fallbacks shown if JavaScript is off
.nojekyll             Tells Pages to serve files starting with underscores
```

The preview videos in `assets/live/` are rendered from real project screens with a small Python script (PIL plus ffmpeg, H.264, 1280x800, about 9 seconds, no audio, seamless loop).

## House rules

These are deliberate. Please do not "fix" them back.

- **Two typefaces, plus one hand for notes.** Instrument Serif for display, Inter for everything else. Caveat is used only for short handwritten notes, and a note never carries the only copy of a fact.
- **Day and night.** Every colour is a named token in `css/site.css`, defined once for day and once for night, with the measured contrast ratio written beside it. Every text pair passes WCAG 2.1 AA in both themes. The visitor's choice is remembered; the first visit follows the device setting. Add `?theme=night` or `?theme=day` to any URL to force one.
- **No em dashes or en dashes** in any copy.
- **Nothing can be hidden by a script failure.** Reveal animations only switch on once `js/site.js` is running, and the chat in the hero shows itself after seven seconds no matter what.
- **Anything that moves has a pause control**: every video has a Pause button, the logo strip has one too, and `prefers-reduced-motion` pauses all of it. Inside the prototypes nothing moves on its own except brief, user-started feedback (a spinner, a typing indicator, pins that pulse three times).
- **Keep the skip link and visible focus states.**
- **The FAQ works without JavaScript.** It is plain `<details>`, so every answer opens with a keyboard or a tap.
- **Screens are code, not screenshots.** Product screens are rebuilt in HTML, CSS and JavaScript from the Figma files, so visitors can use them. Real photos and hand-drawn sketches stay as images. Each prototype has an image fallback inside it for when JavaScript is off.
- **Coded replicas keep the product's own look** (its colors and the closest open font) inside their frame; the page around them keeps the site's two typefaces. Product grays are darkened where needed to pass AA.
- **Sample data is labeled as sample.** Nothing typed into a prototype is stored or sent. Sign-in, payments, calls and AI answers are simulated or scripted, and say so. No real phone numbers, emails or SSNs; brand logos are never drawn, only text wordmarks.
- **Internal links are relative.** No root-relative (`/path`) or absolute self-referencing URLs anywhere, which is what lets the domain change without edits. One exception: `omkar-rebuild/` is a Next.js static export, and Next.js writes root-relative paths, so it is built for `/Portfolio/omkar-rebuild/`. If the site moves to a custom domain, rebuild it with `basePath` set to `/omkar-rebuild`.
- **Code excerpts are real.** The Omkar excerpts are copied from the project by a script, with their real line numbers, never retyped. The page says plainly that the rebuild was made with an AI coding assistant.
- **The preview copy is labeled.** `omkar-rebuild/` differs from the project in six ways, all for static hosting or privacy: static export settings, forms that validate but send nothing, a generic quote confirmation, masked names, phone numbers and street addresses, a "portfolio preview, not the official site" banner with noindex, and sub-path URLs in `sitemap.xml` and `robots.txt`.

## Custom domain

Internal links are already relative, so moving the site to a custom domain needs no code changes beyond the steps below.

### 1. Add a CNAME file

Create a file named `CNAME` in the repository root containing only the domain, no protocol and no trailing slash:

```
siddhi.design
```

Alternatively, set the domain in **Settings → Pages → Custom domain** and GitHub will commit this file for you.

### 2. Add the DNS records at your registrar

**For an apex domain** (`siddhi.design`), add four `A` records pointing at the GitHub Pages servers:

| Type | Name | Value           |
|------|------|-----------------|
| A    | `@`  | 185.199.108.153 |
| A    | `@`  | 185.199.109.153 |
| A    | `@`  | 185.199.110.153 |
| A    | `@`  | 185.199.111.153 |

Add the four `AAAA` records too if your registrar supports IPv6:

| Type | Name | Value                  |
|------|------|------------------------|
| AAAA | `@`  | 2606:50c0:8000::153    |
| AAAA | `@`  | 2606:50c0:8001::153    |
| AAAA | `@`  | 2606:50c0:8002::153    |
| AAAA | `@`  | 2606:50c0:8003::153    |

**For a `www` subdomain**, add one `CNAME` record instead:

| Type  | Name  | Value                   |
|-------|-------|-------------------------|
| CNAME | `www` | `siddhidesign.github.io` |

Do not create a `CNAME` record on the apex (`@`). It conflicts with the other records the domain needs.

These IP addresses are the ones GitHub published most recently; confirm them against GitHub's own custom-domain documentation before you enter them, since they do change occasionally.

### 3. Turn on HTTPS

DNS takes anywhere from a few minutes to 24 hours to propagate. Once **Settings → Pages** shows the domain as verified, tick **Enforce HTTPS**. The certificate is issued automatically and is free.

### 4. Afterwards

- The old `siddhidesign.github.io/Portfolio` address keeps working and redirects to the new domain.
- Update the portfolio link on your résumé, LinkedIn and any live applications.
- Nothing in the HTML or CSS needs to change.

## Local preview

Because the pages use relative paths, opening `index.html` directly in a browser works. To match production more closely, serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Before pushing

1. Check HTML tags balance and CSS braces match.
2. Re-measure contrast on any colour pair you touched. AA is 4.5:1 for normal text.
3. Search for em and en dashes and remove them.
4. Confirm every image and link path resolves.
