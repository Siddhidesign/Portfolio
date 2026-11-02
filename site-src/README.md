# Homepage source (airport theme)

React + TypeScript + Vite. This folder builds the homepage of siddhidesign.github.io/Portfolio/.
The case study pages in `../cases/` are plain HTML and are not touched by this build.

## Edit content
Everything on the homepage lives in **`src/data.ts`**.

## Preview and publish
```bash
cd site-src
npm install          # first time only
npm run dev          # preview at http://localhost:5173
npm run build        # writes ../index.html and ../app/
```
Then commit and push. GitHub Pages serves the repo root, so the new build is live a minute later.

- Résumé button: put `resume.pdf` in `site-src/public/` and set `resume: "resume.pdf"` in `src/data.ts`
- Baggage claim photos: put `1.jpg` … `6.jpg` in `site-src/public/photos/`, edit captions in `BAGS`

## Old homepage
The previous homepage is saved as the git tag `old-portfolio-2026-11-02`.
