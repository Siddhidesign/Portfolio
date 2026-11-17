# Portfolio reviews

Weekly review log for https://siddhidesign.github.io/Portfolio/. This branch (`portfolio-reviews`) only holds this file. It never touches the live site.

Tags: [Certain] checked directly, [Likely] strong evidence, [Guessing] judgment call.

---

## 2026-11-16 (week 2)

### The uncomfortable truth first

Some of the "process" on the site was made this month, not during the project, and one image implies an event that may not have happened. The JaiHind marker sketches (`assets/jaihind/jh-sketches-desktop-tablet.webp`) are rendered by a Python script (`site-src/v5/jh_paper.py`, commit `ec92986`, 2026-11-15) to look like marker on paper on a wooden desk, with heart and star stickers. The caption says "with dot-vote stickers on the team favourites." The project ended in Jul 2024. [Certain] The caption does say "Redrawn for this page", which is honest, but the stickers tell a reader a team vote happened on these sheets. [Certain] Money Anchor, EV and IRS2Go also show sketch flows "redrawn for this page from the shipped screens" (commit `a715d2d`). [Certain] A senior designer who asks "can you walk me through these sketches?" in an interview will find out in one question, and that can cost trust in every number on the site. [Likely] Current hiring advice points the other way: "If the process is interesting, show the Figma files: messy, in progress, honest" ([Tom Scott, Verified Insider](https://verifiedinsider.substack.com/p/faq-design-hiring-in-2026)).

Second truth: the resume is still a 404 on every page (checked today). [Certain]

### What changed since last review (2026-11-13)

A big three days. All on `main`, live site matches `main` on the home page byte for byte. [Certain]

- `2510095` (11-14): case studies rebuilt in the Figma case-study format (empathize, define, ideate, design, test).
- `a715d2d` (11-14): research artifacts from team decks and sheets added with sources; "redrawn" sketch flows on 5 cases; JaiHind "40%" replaced with measured order times; a "Now" line in the hero linking Research Lens.
- `274961a`, `6afe725`, `ec92986`, `42a924c` (11-15, PRs #1 to #4): JaiHind expanded with team, scope, 35+ contextual inquiries, 30+ requirements, "2 to 3 orders a day" to "7 to 8"; rendered rough-idea and marker sketches; old dashboard image removed.
- `ceacd45` (11-16): new Fit Check case (4 retail AI assistants, concept, untested), now the first card on the home page. Curriculum case moved from 1st to 6th.
- `84ca993`, `2bdcdc0` (11-16): "Design Quality" section on every case with annotated screens (visual, accessibility, design system).
- `700464e` (11-16): Fit Check images re-uploaded at about 3x the size (cover 131 KB to 400 KB).

### Status of earlier suggestions

| # | Suggestion (first raised) | Status | Evidence |
|---|---|---|---|
| 1 | Add resume.pdf (11-13) | Still open (week 2) | `resume.pdf` not in repo; live URL returns 404 today |
| 2 | Show moments where she checked AI output (11-13) | Still open (week 2) | No "what the AI said / what I found / what changed" block on any page. Fit Check's "wrong in six places" twist is about her own design versus published research, not about checking an AI. The EV preview box never shipped. |
| 3 | Reorder home or rebuild curriculum case (11-13) | Partly done | `ceacd45` moved curriculum to 6th. The page itself still has no findings, course names or artifact. New issue: the lead card is now an untested concept (see item 4 below). |
| 4 | Ship and link a Research Lens demo (11-13) | Still open (week 2) | Page still "Building, deploying next", no repo or demo link. The new "Now" line in the hero points visitors straight at this unfinished page. |
| 5 | Proof line in hero, "product designer" label (11-13) | Still open (week 2) | Hero unchanged: label "UX Researcher and Designer", no result in the first screen at 1440 px |
| s1 | FindMe 28% unexplained (11-13) | Still open | Still only in hero and summary, no method |
| s2 | Money Anchor lead with "6 of 8" (11-13) | Done | Home card and case hero both say "6 of 8 testers fully trusted" |
| s3 | Magic Apron empty "How I got there" (11-13) | Done | Section removed in the `2510095` rebuild |

### Site check (2026-11-16)

- Speed: every page loaded in 0.8 to 2.0 s from this test machine. [Certain] Home at 1440 px pulls about 1.05 MB after a full scroll; the largest file is the Fit Check cover at 400 KB, re-uploaded in `700464e`. Last week's 350 KB was likely measured without a full scroll, so the jump is partly method. [Likely]
- Accessibility (axe-core 4.10.2, WCAG 2 A/AA + best practice, 12 pages at 1440 px): one real new failure. The red "Design system used" label in the new Design Quality section is white on #ef4f3e, 3.58:1 at 11 px, below the 4.5:1 AA minimum, on 8 case pages. [Certain] It sits next to an annotation that praises small text passing AA, which a careful reviewer will notice. [Likely] axe also flagged text caught mid fade-in by the scroll reveal; those are timing artifacts, not real failures. [Likely]
- Mobile: no horizontal scroll at 390 px on any of the 12 pages. [Certain]
- Links: the only broken internal link is `resume.pdf` (404). [Certain]
- Case depth: Fit Check is the strongest new writing on the site. It names the 4 assistants, the 3 goals, a rejected idea with a reason, and says plainly "Nothing here has been tested with shoppers yet", with a concrete Wizard-of-Oz test plan. [Certain] That honesty is exactly right; it is the lead position that is the risk.

### Top improvements, ranked by impact on getting interviews

**1. Make every process image honest about when it was made. (Medium. Needs her.)**
What: for JaiHind, Money Anchor, EV and IRS2Go, use real artifacts from the time where they exist (photos of paper sketches, Figma frames, FigJam boards, the team decks already cited). Where nothing survives, either drop the sketch, or keep it as a clearly labeled diagram: "Reconstructed in Nov 2026 from the shipped screens to show the layouts we compared", with no desk, no stickers and no paper texture. Remove "dot-vote stickers on the team favourites" unless a dot vote happened on those layouts.
Why: see the uncomfortable truth above. Hiring managers now reward messy, real process over polish ([Verified Insider](https://verifiedinsider.substack.com/p/faq-design-hiring-in-2026)), and "Polish hides gaps" is literally the lesson in your own Fit Check case. One faked-looking artifact can discount the 27% and the 7 to 8 orders a day too. [Likely]
Ask her: Do you have any photo, Figma file or FigJam board of JaiHind sketches from 2023 to 2024? Did the team actually dot-vote? Same question for Money Anchor, EV and IRS2Go.

**2. Add the resume. (Small. Needs her: the PDF.) Week 2.**
What: put `resume.pdf` at the repo root on `main`. The hidden Resume links appear on their own.
Why: still the fastest fix with direct screening impact. [Certain] that it is missing. Will be escalated next week if still open.

**3. Show one real moment of checking AI, and make Research Lens checkable. (Medium. Needs her.) Week 2.**
What: merge last week's items 2 and 4 into one deliverable: a 3 to 5 minute screen recording (or a short annotated transcript) of you running a real query through Research Lens or UM-GPT on synthetic or consented data, catching something the AI got wrong or overcounted, and what you did. Embed it on the Research Lens page and link it from the hero's "Now" line. Add the repo link if it can be public.
Why: your hero promises "I check every finding myself", and the new "Now" line sends visitors to a page that says "building, deploying next" with nothing to try. [Certain] Current advice: "Record a 5-minute Loom of you working with AI, prompting, editing, making judgment calls. This is now more impressive than a polished Behance case study" ([Fountain Institute](https://www.thefountaininstitute.com/blog/senior-product-designers-hired)). Prototyping in code is now a core requirement at many AI-product companies ([AI Goodies review of postings](https://aigoodies.beehiiv.com/p/design-job-requirements-2026)). [Likely] that this is the single most differentiating addition for AI roles.
Ask her: Is Research Lens running end to end yet? Can the repo be public? One real time an AI theme or count was wrong and you caught it?

**4. Fix the first screen and the first card together. (Small. No new info needed for the hero; a decision from her on order.) Week 2 for the hero.**
What: (a) add one proof line under the hero paragraph using facts already on the site, for example "Shipped a portal for about 200 retail staff across 10 stores (27% fewer errors). Designed an AI budgeting coach 6 of 8 testers fully trusted." (b) Decide the lead card on purpose. For B2B roles, put JaiHind first (shipped, measured, field research). For AI roles, Fit Check first is defensible, but then put "Concept, not yet tested" on the card itself, not only inside the case.
Why: the first screen still shows no company, product or result. [Certain] Fit Check is one month old and untested, and "a beautiful redesign that shipped and moved no metrics is, from a hiring perspective, equivalent to a concept project" ([Fountain Institute](https://www.thefountaininstitute.com/blog/senior-product-designers-hired)). Your best B2B proof is now the third card, behind FindMe. [Certain] Relevance to the role beats everything else ([Verified Insider](https://verifiedinsider.substack.com/p/faq-design-hiring-in-2026)), so one order will not fit both audiences; a second home order or a role-specific link (for example `?for=b2b`) could, but that is optional. [Guessing]

**5. Fix the Design Quality contrast and shrink the Fit Check images. (Small. No new info needed.)**
What: darken the "Design system used" label background (for example to #c63a2b, which measures about 5.2:1 with white) in `site-src/v5/site.css`; re-export the 9 Fit Check images from `700464e` at the earlier sizes (the cover was 131 KB).
Why: a section that argues for accessibility should pass it. 3.58:1 on 8 pages. [Certain] Tripled image weight on the home page's first card for no visible gain at card size. [Likely]

### Smaller fixes (when touching these files)

- Curriculum case: still no findings, course names or artifact (last week's questions still stand). [Certain]
- FindMe: "28% more engagement on brand pages" still has no method or period. Ask her for the source. [Certain]
- Branch `obm-review-fixes` is still on the remote with unrelated history. Delete it or say why it stays. [Certain] that it exists.

### Trends that apply to her

Nothing citable was published this month that I could verify; these are the most recent credible pieces I found, so treat the dates as stated.

1. Real, messy process beats polished process. Tom Scott (Verified Insider, Feb 2026): "Pulling up Figma files that are days/weeks old, walking through concepts that aren't finished... can be more compelling than a polished case study," and designers who admit what could have been better "come across as more credible." Applies to item 1 above, and supports keeping Fit Check's honest "not tested" framing. [FAQ: Design Hiring in 2026](https://verifiedinsider.substack.com/p/faq-design-hiring-in-2026)
2. Show AI work as it happens, and build. Fountain Institute (Jun 2026) recommends a 5-minute recording of working with AI and making judgment calls; AI Goodies' review of postings at Anthropic, Linear, Notion, Stripe and others (May 2026) finds prototyping in code now a core requirement and UX research postings down about 71% since early 2022. Applies to items 3 and 4. [Fountain Institute](https://www.thefountaininstitute.com/blog/senior-product-designers-hired), [AI Goodies](https://aigoodies.beehiiv.com/p/design-job-requirements-2026)

### Status tracker

| # | Suggestion | First raised | Status |
|---|---|---|---|
| A | Make process images honest (real artifacts or clearly reconstructed, no fake dot votes) | 2026-11-16 | Open (new) |
| 1 | Add resume.pdf | 2026-11-13 | Open, week 2 |
| 2+4 | Real AI-checking moment plus checkable Research Lens demo (merged) | 2026-11-13 | Open, week 2 |
| 3 | Reorder home or rebuild curriculum case | 2026-11-13 | Partly done (reordered; curriculum page still thin) |
| 5 | Proof line in hero; deliberate lead card | 2026-11-13 | Open, week 2 |
| B | Design Quality label contrast; Fit Check image sizes | 2026-11-16 | Open (new) |
| s1 | FindMe 28% method | 2026-11-13 | Open |
| s2 | Money Anchor "6 of 8" | 2026-11-13 | Done |
| s3 | Magic Apron empty section | 2026-11-13 | Done |

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
