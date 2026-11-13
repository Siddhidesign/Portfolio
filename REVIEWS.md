# Portfolio reviews

Weekly review log for https://siddhidesign.github.io/Portfolio/. This branch (`portfolio-reviews`) only holds this file. It never touches the live site.

Tags: [Certain] checked directly, [Likely] strong evidence, [Guessing] judgment call.

---

## 2026-11-13 (week 1)

### The uncomfortable truth first

Your strongest promise is not proven anywhere. The hero says "AI helps me read at scale, but I check every finding myself." No case study shows a single moment where you checked an AI finding and it was wrong, or where checking changed a decision. To a hiring manager for AI products, that line currently reads as a slogan, not a skill. [Certain] And the Resume button in the nav, footer and About page returns a 404 on every page. [Certain]

### What changed since last week

This is the first review, so there is no earlier list to grade. Changes in `main` over the last 8 days (all 2026-11-09):

- `7425777` and `8362a6e`: full redesign into the cube template (new `site-src/v5/build.py`, new CSS and motion). All 9 case pages re-rendered.
- `302f49c`: new headline, "A research-led designer who turns messy experiences into clear ones."
- `c8abb2e`, `55dbad8`: intro now ends on checking AI findings and designing the fix.
- `4092f73`: interaction layer (splash, scroll reveals, parallax, dock, previews).
- Live site matches a local build of `main` byte for byte on the home page. [Certain]
- Note: branch `obm-review-fixes` (2026-10-24) has unrelated history to `main` and was never merged. It looks like a stale preview. Delete it or say if it still matters. [Likely]

### Site check (2026-11-13)

- Speed and weight: pages load in about 0.4 to 1.4 s from this test machine. Home about 350 KB at desktop, 100 KB at mobile. Magic Apron is the heaviest at about 1.6 MB (two research videos). Fine. [Certain]
- Accessibility: axe-core 4.10 (WCAG 2 A/AA plus best practice) found 0 violations on all 11 pages at 1440 px, and on home at 390 px. Images have alt text. Reduced motion shows all content at once. [Certain]
- Mobile: no horizontal scroll at 390 px on any page. [Certain]
- Missing: `resume.pdf` is not in the repo. Resume links in nav, footer and About are hidden by script until it exists, so nothing looks broken, but there is no resume to open. Each page logs one 404 from the existence check. [Certain]
- Not reviewed: per the build session, a case-page section map, magnetic buttons, a View bubble, and an EV "Where I checked the AI" box exist in a preview that is not live yet. This review covers only what is live on `main`. [Certain]
- Empty sections: Research Lens and Magic Apron both have a "How I got there" heading with nothing (or only a plot twist) under it. [Certain]

### Top improvements, ranked by impact on getting interviews

**1. Add the resume. (Small. Needs her: the PDF.)**
What: add `resume.pdf` at the repo root. The hidden links will then appear on their own.
Why: recruiters and ATS-driven screeners usually want the resume before a case study. Right now a recruiter on the site has no way to get one without emailing you. [Certain] that it is missing, [Likely] that it costs screens.

**2. Prove "I check every finding myself" with real moments. (Medium. Needs her.)**
Progress note: the build session says an EV "Where I checked the AI" box exists in a preview and is waiting on a real example from you. Good start. It needs the real example, then the same block in Money Anchor and the curriculum case.
What: in Money Anchor, EV and the curriculum case, add one short block each: "What the AI said / What I found when I checked / What changed." Show the AI theme next to the raw quotes or numbers. Even one case where the AI was right but overcounted (your own Research Lens point about three quotes from one person) is strong.
Why: it is your headline claim and the core of the AI-product pitch. Current guidance says hiring managers want to see AI as a partner "without losing your judgment" ([Everyday UX, Mar 2026](https://www.everydayux.net/ux-portfolios-2026/)). Right now there is zero evidence of that judgment on the site. [Certain] that it is missing, [Likely] that it is the most persuasive addition you can make.
Ask her: Can you name one time AI (UM-GPT, Colab, Claude) produced a theme or number you rejected or corrected? What was it, and what did you do instead?

**3. Stop leading with your thinnest case. (Medium. Needs her for the rebuild.)**
What: the first card on the home page is the curriculum research. That page has no findings at all: no gap you found, no names of the 2 new courses, no artifact, no image. It is all counts (50+ papers, 43 students). Either move JaiHind (shipped B2B tool, 27% fewer errors) and Money Anchor (AI trust, IRB study) to the top, or rebuild the curriculum page with 3 actual findings, the course names, and one board or slide.
Why: hiring managers often open only the first case. JaiHind and Money Anchor already show problem, research, rejected ideas, outcomes and next steps. The curriculum page does not. [Certain] about the gap, [Likely] about the skim behavior.
Ask her: What were the 2 courses called and are they on the catalog? What were the top 3 gaps you found? Can you show one affinity board or recommendation slide (blurred if needed)?

**4. Finish Research Lens and show it working. (Medium to large. Needs her: repo status.)**
What: link the repo (or a public demo), add a short screen recording or transcript of one real query that returns participant IDs and the NOT SUPPORTED section, and fill the empty "How I got there" section. Use synthetic or consented data.
Why: AI product design postings now ask for building, not just prompting. Sigma Computing's Senior Product Designer, AI role asks for "recent hands-on AI tooling experience, not just prompting, but building" and "experience writing evals, agents, prompt libraries, or skills" ([posting](https://job-boards.greenhouse.io/sigmacomputing/jobs/7767897003)). Research Lens is exactly that kind of proof, but today it is "building, deploying next" with no link, so it cannot be checked. [Certain] that it has no link, [Likely] that a working demo would set you apart from other early-career candidates.
Ask her: Is the repo public or can it be? Is there a dataset you can show (synthetic or consented)?

**5. Put proof in the first screen, and lean "product designer". (Small. No new info needed.)**
What: under the hero paragraph, add one line of proof using facts already on the site, for example: "Shipped an order portal for ~200 retail staff (27% fewer errors). Designed an AI budgeting coach 6 of 8 testers fully trusted." Consider "Product designer, research-led" as the role label instead of "UX Researcher and Designer".
Why: at 1440 px the first screen is a headline and a Rubik's cube, with no company, product or result visible. The value is clear in tone but not in evidence. [Certain] On the label: US user researcher hiring is down about 66% from 2022 and research tasks are being folded into product design specs ([UX Research + AI, Nov 12 2026](https://uxroh.substack.com/p/reading-lennys-job-market-data-as)). Leading with "designer who researches" matches more open roles. [Likely]

### Smaller fixes (do when touching these files)

- FindMe: "28% more engagement on brand pages" appears in the hero but nowhere in the body. Say what was measured, over what period, and what you changed that drove it. Ask her for the source. [Certain] that it is unexplained.
- Money Anchor: "75% fully trusted the AI (6 of 8)". A percentage on 8 people reads as overclaiming. Lead with "6 of 8". [Likely]
- Magic Apron: "How I got there" has only a plot twist. One or two sentences on method would close it. [Certain]

### Trends this month that apply to her

1. UXR roles are shrinking, design roles are absorbing research. About 1,800 US user researchers hired in the past year, down 66% from 2022, and product and design specs increasingly include research. Implication: pitch as a product designer with unusually strong research, not as a researcher. [UX Research + AI, Nov 12 2026](https://uxroh.substack.com/p/reading-lennys-job-market-data-as)
2. AI design roles want builders with judgment. Postings ask for hands-on building, evals and released work, and portfolio advice stresses showing judgment over AI rather than AI use. Implication: items 2 and 4 above. [Sigma Computing, Senior Product Designer, AI](https://job-boards.greenhouse.io/sigmacomputing/jobs/7767897003), [Everyday UX](https://www.everydayux.net/ux-portfolios-2026/)

### Status tracker

| # | Suggestion | First raised | Status |
|---|---|---|---|
| 1 | Add resume.pdf (links auto-hide until then) | 2026-11-13 | Open |
| 2 | Show AI-checking moments in AI cases | 2026-11-13 | Open (EV box in preview, needs her example) |
| 3 | Reorder home or rebuild curriculum case | 2026-11-13 | Open |
| 4 | Ship and link Research Lens demo | 2026-11-13 | Open |
| 5 | Proof line in hero, product designer label | 2026-11-13 | Open |
