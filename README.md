# Siddhi Manche, portfolio

Source for [siddhidesign.github.io/Portfolio](https://siddhidesign.github.io/Portfolio).

Plain HTML, CSS and JavaScript. No framework, no build step on the server. Push to `main` and GitHub Pages serves it.

Designed by Siddhi Manche and coded with Claude Code, an AI coding assistant. She reviews every change and tests it in the browser.

## Structure

```
index.html            Home: intro, about me, six case studies, journey, skills, contact
cases/*.html          One case study per project: the whole process step by step, with the
                      key decisions highlighted, results, "what I'd do now with AI", and feedback
cases/full/*.html     Long versions of each case study, with the interactive coded prototypes
css/store.css         Styles for the home page and case studies: day and night tokens, layout,
                      the step tracker, and small coded charts
js/store.js           Theme switch, image gallery, step tracker, like + feedback

Used only by the long versions in cases/full/
css/site.css, js/site.js                  The previous design system
css/jh-app.css, js/jh-app.js, js/jh-research.js
                                          Jai Hind console and research blocks
css/proto.css, js/proto.js                Phone prototype shell for IRS2GO, Money Anchor and EV
css/ir-app.css, css/ma-app.css, css/ev-app.css (and their js/)
                                          The coded product screens
css/case-kit.css, js/case-kit.js          Research and testing blocks
css/lab.css, js/lab.js                    Omkar catalog recreation and FindMe component playground
css/codeview.css, js/codeview.js          Omkar "code + live preview"
omkar-rebuild/                            Static export of my 2026 Next.js rebuild of the Omkar Labels site

assets/v2/            Phone screens and the audit board used in the case studies
assets/og/            Share-preview images
assets/               Project images, sketches and photos
.nojekyll             Tells Pages to serve files starting with underscores
```

## House rules

These are deliberate. Please do not "fix" them back.

- **One typeface, plus an accent.** Manrope for everything. Instrument Serif italic for a few accent words only.
- **Day and night.** Every color is a token in `css/store.css`, defined once for day and once for night. Every text pair passes WCAG 2.1 AA in both themes, checked with axe-core. The visitor's choice is remembered. Add `?theme=night` or `?theme=day` to any URL to force one.
- **No em dashes or en dashes** in any copy.
- **Nothing can be hidden by a script failure.** Without JavaScript every page reads in full, the step tracker is a plain list of links, and feedback falls back to an email link.
- **Only real numbers.** Every result is labeled Measured, Tested, Shipped, Built, Not yet tested, Concept or Pending. Team projects say they were team projects. "What I'd do now with AI" sections are ideas, not built work, and say so.
- **Feedback goes to email.** The like + feedback box posts to FormSubmit, which emails Siddhi. Nothing else is stored. FormSubmit needs a one-time activation from that inbox.
- **Keep the skip link and visible focus states.**
- **Internal links are relative.** No root-relative (`/path`) links, which is what lets the domain change without edits. One exception: `omkar-rebuild/` is a Next.js static export, and Next.js writes root-relative paths, so it is built for `/Portfolio/omkar-rebuild/`. If the site moves to a custom domain, rebuild it with `basePath` set to `/omkar-rebuild`.
- **Sample data is labeled as sample** inside the prototypes. No real phone numbers, emails or SSNs; brand logos are never drawn.

## Custom domain

Internal links are already relative, so moving the site to a custom domain needs no code changes beyond the steps below (and updating the canonical and share-preview URLs).

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

## Local preview

Because the pages use relative paths, opening `index.html` directly in a browser works. To match production more closely, serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Before pushing

1. Check HTML tags balance and CSS braces match.
2. Run axe-core (WCAG 2.1 AA) on every page in both themes, at desktop and phone widths.
3. Search for em and en dashes and remove them.
4. Confirm every image and link path resolves.
