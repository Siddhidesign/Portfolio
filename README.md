# Siddhi Manche, portfolio

Source for [siddhidesign.github.io/Portfolio](https://siddhidesign.github.io/Portfolio).

Hand-built in HTML, CSS and JavaScript. No framework, no build step. Push to `main` and GitHub Pages serves it.

## Structure

```
index.html            Homepage
css/home.css          Homepage styles (loaded only by index.html)
css/style.css         Case study base
css/case-study.css    Case study layout
css/case-light.css    Light theme
css/case-theme.css    Case study override layer, loaded last
js/home.js            Homepage interactions
js/main.js            Case study interactions
cases/*.html          Case studies
assets/               Images, video, sketches, resume
.nojekyll             Tells Pages to serve files starting with underscores
```

`cases/jaihind.html` carries its own inline `<style>` block rather than using the shared case stylesheets.

## House rules

These are deliberate. Please do not "fix" them back.

- **Two typefaces only.** Instrument Serif for display, Inter for everything else, including the uppercase tracked label style.
- **Colour lives in named tokens** with the measured contrast ratio written beside each one in the stylesheet. Every text and background pair meets WCAG 2.1 AA. If you change a value, re-measure it.
- **No em dashes or en dashes** in any copy.
- **Reveal animations are gated behind a `.js` class** set by an inline script in `<head>`. Content is visible by default, so a JavaScript error cannot blank the page.
- **Anything that moves has a pause control**, and everything respects `prefers-reduced-motion`.
- **Keep the skip link and visible focus states.**
- **Internal links are relative.** No root-relative (`/path`) or absolute self-referencing URLs anywhere, which is what lets the domain change without edits.

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
