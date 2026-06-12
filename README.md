# Alex Rivera — UX Designer Portfolio

New York aesthetics · Dark/Light Mode · Fully static · GitHub Pages ready

## Deploy to GitHub Pages

1. Create a new repo on GitHub (e.g. `my-portfolio`)
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "initial portfolio"
   git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git
   git push -u origin main
   ```
3. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. Your portfolio goes live at `https://YOUR_USERNAME.github.io/my-portfolio`

## Customise

| What | Where |
|------|-------|
| Name / title | `index.html` — `<title>` tag + nav logo + hero headline |
| Email | `index.html` — `.contact-email` link |
| Project images | Replace `.work-ph` divs with `<img>` tags |
| Social links | `index.html` — `.contact-socials` section |
| Accent colour | `css/style.css` — `--gold` variable in `:root` |
| Stats numbers | `index.html` — `data-count` attributes on `.stat-n` |
