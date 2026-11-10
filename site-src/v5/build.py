#!/usr/bin/env python3
"""Portfolio in the Rubik-cube template look Siddhi made in Figma Make: cream paper, ink, four cube
colours, Space Grotesk + DM Sans, big editorial sections. Content is unchanged: ../v3/content.py and
../v4/story.py. Nothing here adds facts; it only lays the existing ones out.

    python3 build.py OUT_DIR [ASSET_ROOT]
"""
import hashlib, html, json, re, shutil, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "v3")); sys.path.insert(0, str(HERE.parent / "v4"))
from content import SITE, HOW, TOOLS, WORDS, EXPERIENCE, PROJECTS, SIDE, CASES, ORDER
from story import STORY, FIGS
from figs import render as viz, CSS as VIZ_CSS

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/preview5")
ROOT = Path(sys.argv[2] if len(sys.argv) > 2 else HERE.parents[1])
CSS = (HERE / "template.css").read_text() + (HERE / "site.css").read_text() + VIZ_CSS
JS = (HERE / "motion.js").read_text()
V = hashlib.md5((CSS + JS).encode()).hexdigest()[:8]
used = set()

RED, BLUE, YELLOW, GREEN = "#ef4f3e", "#4f7bf3", "#ffc92a", "#21b36b"
ACCENT = {"canvas": BLUE, "findme": RED, "jaihind": GREEN, "omkar": YELLOW, "anchor": RED,
          "ev": GREEN, "ir2go": BLUE, "research-lens": YELLOW, "magic-apron": RED}

def esc(s): return html.escape(str(s), quote=True)
def rich(s):
    s = esc(s); s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    return re.sub(r"(?<![*\w])\*(?!\*)(.+?)\*(?!\w)", r"<em>\1</em>", s)
def plain(s): return re.sub(r"\*+", "", s)
def img(src, alt, pre, lazy=True):
    used.add(src)
    return f'<img src="{pre}{esc(src)}" alt="{esc(alt)}"{" loading=\"lazy\"" if lazy else ""} decoding="async">'

def mini(): return '<span class="mini-cube" aria-hidden="true">' + "".join(f'<i style="background:{c}"></i>' for c in (RED, YELLOW, BLUE, "#F7F4EC")) + "</span>"
def mark(): return '<span class="case-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>'
ARROW, DIAG = '<span aria-hidden="true">→</span>', '<span aria-hidden="true">↗</span>'

FONT = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">')

def head(title, desc, pre, cls="", accent=None):
    style = f' style="--green:{accent};--face:{accent}"' if accent else ""
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(desc)}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<script>document.documentElement.classList.add("js")</script><link rel="icon" href="{pre}assets/favicon.svg">{FONT}
<link rel="stylesheet" href="{pre}site.css?v={V}"></head><body class="{cls}"{style}>
<a class="skip" href="#main">Skip to content</a>'''

def tail(pre):
    return f'''<script>fetch("{pre}{SITE["resume"]}",{{method:"HEAD"}}).then(function(r){{if(!r.ok)throw 0}}).catch(function(){{document.querySelectorAll("[data-resume]").forEach(function(a){{a.hidden=true}})}});</script>
<script src="{pre}motion.js?v={V}" defer></script></body></html>'''

def nav(pre, back=None):
    if back:
        return f'''<nav class="case-nav" aria-label="Main"><a class="case-brand" href="{pre}index.html">{mark()} {esc(SITE["name"])}</a>
<a class="case-back" href="{back[0]}"><span aria-hidden="true">←</span> {esc(back[1])}</a></nav>'''
    return f'''<nav class="nav-shell" aria-label="Main"><a class="brand" href="{pre}index.html" aria-label="{esc(SITE["name"])}, home">{mini()}<span>{esc(SITE["name"])}</span></a>
<div class="nav-links"><a href="{pre}index.html#work">Work</a><a href="{pre}about.html">About</a><a href="{pre}{SITE["resume"]}" data-resume>Resume</a>
<a class="nav-cta" href="mailto:{SITE["email"]}">Let’s talk {DIAG}</a></div></nav>'''

def socials():
    return (f'<a href="{SITE["linkedin"]}" target="_blank" rel="noopener">LinkedIn<span class="sr"> (opens in a new tab)</span></a>'
            f'<a href="{SITE["github"]}" target="_blank" rel="noopener">GitHub<span class="sr"> (opens in a new tab)</span></a>')

def big_footer(pre):
    return f'''<footer id="contact"><div class="footer-cube">{mini()}</div>
<p class="section-kicker">Have a tricky problem?</p>
<h2>Let’s figure it<br>out <em>together.</em></h2>
<p class="foot-note">{esc(SITE["status"])}, especially B2B workflow tools and AI products.</p>
<a href="mailto:{SITE["email"]}">{esc(SITE["email"])} {DIAG}</a>
<div class="footer-bottom"><span>Designed and built by Siddhi Manche, with an AI coding assistant. © 2026</span>
<div>{socials()}<a href="{pre}{SITE["resume"]}" data-resume>Resume</a><a href="#main">Back to top ↑</a></div></div></footer>'''

def case_footer(pre):
    return f'''<footer class="case-footer"><a href="{pre}index.html">{mark()} {esc(SITE["name"])}</a>
<span>Designed and built by Siddhi Manche, with an AI coding assistant.</span>
<a href="mailto:{SITE["email"]}">Let’s talk {DIAG}</a></footer>'''

STEPS = [t for t, _ in HOW]
CUBE = '''<div class="cube-art" data-steps="''' + esc(json.dumps(STEPS)) + '''"><p class="cube-step" aria-hidden="true"></p><div class="cube-stage" aria-hidden="true"><div class="cube"></div></div>
<label class="cube-ctl"><span aria-hidden="true">Messy</span><input type="range" min="0" max="8" step="1" value="0" aria-label="Solve the cube. Right solves, left scrambles."><span aria-hidden="true">Clear</span></label></div>'''

def project(cid, n, pre=""):
    c = CASES[cid]
    m = c.get("metrics", [])
    big = f'<div><strong>{esc(m[0][0])}</strong><span>{esc(m[0][1])}</span></div>' if m else ""
    who = c.get("role") or c["kind"]
    shot = (f'<span class="pv-shot">{img(c["cover"], "", pre)}</span>' if c.get("cover") else
            f'<span class="pv-type"><b>{esc(m[0][0])}</b><span>{esc(m[0][1])}</span><i>{esc(c["kind"])}</i></span>' if m else "")
    return f'''<article class="project"><a class="project-visual" href="{pre}work/{cid}.html" style="background:{ACCENT[cid]}" tabindex="-1" aria-hidden="true">
<span class="project-number">{n:02d}</span>{shot}</a>
<div class="project-copy"><div class="project-meta"><span>{esc(c["org"])}</span><span>{esc(c.get("dates") or c["year"])}</span></div>
<h3><a href="{pre}work/{cid}.html">{esc(c["card"])}</a></h3><p class="pc-role">{esc(who)}</p><p>{esc(c["line"])}</p>
<div class="project-foot"><a href="{pre}work/{cid}.html" aria-hidden="true" tabindex="-1">View case study {DIAG}</a>{big}</div></div></article>'''

def home():
    pre = ""
    o = [head(f'{SITE["name"]} · {SITE["role"]}', SITE["lede"], pre, "home"), '<main id="main" tabindex="-1">', nav(pre)]
    o.append(f'''<section class="hero" id="top"><div class="hero-copy">
<p class="eyebrow"><span></span> {esc(SITE["role"])} · Open to US roles</p>
<h1>{rich(SITE["title"])}</h1>
<p class="hero-intro">{esc(SITE["lede"])}</p>
<a class="text-link" href="#work">See my work {ARROW}</a></div>
{CUBE}
<div class="scroll-note" aria-hidden="true"><i></i> Scroll to explore</div></section>''')
    o.append(f'''<section class="statement" id="about"><p class="section-kicker">What I do</p>
<h2>Complexity doesn’t scare me.<br><span>It gives me something to solve.</span></h2>
<div class="statement-grid"><p>{rich(SITE["story"])}</p>
<div class="capabilities"><span>01</span><p>UX research</p><span>02</span><p>B2B workflow design</p><span>03</span><p>AI-assisted analysis</p><span>04</span><p>Front-end build</p></div></div></section>''')
    yrs = lambda ids: sorted({y for i in ids for y in re.findall(r"20\d\d", CASES[i].get("dates") or CASES[i]["year"])})
    ey, py = yrs(EXPERIENCE), yrs(PROJECTS)
    o.append(f'<section class="work" id="work"><div class="section-heading"><h2 class="section-kicker">Experience</h2><span>{ey[0]} to {ey[-1]}</span></div>')
    o += [project(cid, k) for k, cid in enumerate(EXPERIENCE, 1)]
    o.append(f'<div class="section-heading sh2" id="projects"><h2 class="section-kicker">Projects</h2><span>{py[0]} to {py[-1]}</span></div>')
    o += [project(cid, k) for k, cid in enumerate(PROJECTS, len(EXPERIENCE) + 1)]
    side = "".join(f'''<li><a href="work/{cid}.html" style="--a:{ACCENT[cid]}"><span class="sp-k">{esc(CASES[cid]["kind"])} · {esc(CASES[cid]["year"])}</span>
<strong>{esc(CASES[cid]["card"])}</strong><span class="sp-l">{esc(CASES[cid]["line"])}</span><em>Read it {DIAG}</em></a></li>''' for cid in SIDE)
    o.append(f'<div class="section-heading sh2"><h2 class="section-kicker">Side projects</h2><span>Self-initiated</span></div><ul class="side-list">{side}</ul></section>')
    tiles = [RED, YELLOW, BLUE, GREEN]
    cards = "".join(f'''<div class="process-card"><span>{k:02d}</span><div class="tile" style="background:{tiles[k-1]}"><i></i><i></i><i></i><i></i></div>
<h3>{esc(t)}</h3><p>{esc(d)}</p></div>''' for k, (t, d) in enumerate(HOW, 1))
    o.append(f'''<section class="process"><p class="section-kicker">How I work</p>
<div class="process-title"><h2>Messy in.<br><em>Clear out.</em></h2>
<p>AI helps me read at scale. I check every finding myself, then design the fix.</p></div>
<div class="process-grid">{cards}</div></section>''')
    o.append("</main>" + big_footer(pre) + tail(pre))
    return "\n".join(o)

def about():
    pre = ""
    o = [head(f'About · {SITE["name"]}', SITE["lede"], pre, "about"), '<main id="main" tabindex="-1" class="about-page">', nav(pre)]
    o.append(f'''<header class="about-hero"><p class="case-kicker">About me</p>
<h1>Research first.<br><em>Clear by design.</em></h1>
<div class="about-intro"><div>{"".join(f"<p>{rich(p)}</p>" for p in SITE["intro"])}</div>
<figure class="about-photo">{img(SITE["photo"], "Siddhi Manche at her M.S. graduation.", pre, False)}
<i class="portrait-tile tile-red"></i><i class="portrait-tile tile-blue"></i><i class="portrait-tile tile-yellow"></i></figure></div></header>''')
    vals = "".join(f'''<article><span>{k:02d}</span><i class="value-shape value-shape-{k}"></i><h3>{esc(t)}</h3><p>{esc(d)}</p></article>''' for k, (t, d) in enumerate(HOW, 1))
    o.append(f'''<section class="about-values"><div class="about-values-title"><p class="case-kicker">How I work</p><h2>How I show up.</h2></div>
<div class="values-list">{vals}</div></section>''')
    rows = "".join(f'''<div><span>{esc(CASES[c]["dates"])}</span><strong><a href="work/{c}.html">{esc(CASES[c]["org"])}</a></strong><p>{esc(CASES[c]["role"])}</p><small>{esc(CASES[c]["kind"])}</small></div>''' for c in EXPERIENCE)
    o.append(f'<section class="about-experience"><h2 class="case-kicker">Experience</h2><div class="experience-list">{rows}</div></section>')
    tools = "".join(f'<div class="tool-group"><h3>{esc(g)}</h3><ul>{"".join(f"<li>{esc(t)}</li>" for t in ts)}</ul></div>' for g, ts in TOOLS)
    o.append(f'<section class="about-tools"><div><p class="case-kicker">Tools</p><h2>What I work with.</h2></div><div class="tools-grid">{tools}</div></section>')
    words = "".join(f'<blockquote class="word-card"><p>“{esc(q)}”</p><cite><b>{esc(n)}</b>{esc(r)}</cite></blockquote>' for q, n, r in WORDS)
    o.append(f'<section class="about-words"><div><p class="case-kicker">Kind words</p><h2>From people<br>I’ve worked with.</h2></div><div class="words-grid">{words}</div></section>')
    o.append(f'''<section class="about-cta"><p class="case-kicker">Let’s make something clearer</p>
<h2>Have a messy problem?<br><em>I’d love to hear it.</em></h2><a href="mailto:{SITE["email"]}">{esc(SITE["email"])} {DIAG}</a></section>''')
    o.append("</main>" + case_footer(pre) + tail(pre))
    return "\n".join(o)

def case(cid):
    c, pre = CASES[cid], "../"
    S, F = STORY.get(cid, {}), FIGS.get(cid, {})
    figs = lambda k: "".join(viz(x) for x in F.get(k, []))
    i = ORDER.index(cid); nxt = ORDER[(i + 1) % len(ORDER)]
    acc = ACCENT[cid]
    back = ("../index.html#projects" if cid not in EXPERIENCE else "../index.html#work", "All work")
    o = [head(f'{plain(c["title"])} · {SITE["name"]}', c["tldr"][0][1] + " " + c["tldr"][2][1], pre, "case", acc),
         f'<main id="main" tabindex="-1" class="case-page">', nav(pre, back)]
    dl = "".join(f"<div><dt>{esc(k)}</dt><dd>{esc(v)}</dd></div>" for k, v in c["meta"])
    o.append(f'''<header class="case-hero"><div class="case-hero-label"><span>Case study · {i + 1:02d}</span><span>{esc(c["kind"])} · {esc(c["year"])}</span></div>
<h1>{rich(c["title"])}</h1>
<div class="case-hero-intro"><p>{esc(c["line"])}</p><dl>{dl}</dl></div></header>''')
    if c.get("cover"): o.append(f'''<section class="case-showcase cs-img" aria-label="Cover"><div class="showcase-grid"></div>
<figure class="cs-shot{" top" if c.get("cover_fit") == "top" else ""}">{img(c["cover"], c.get("cover_alt", ""), pre, False)}</figure></section>''')
    res = "".join(f"<div><strong>{esc(v)}</strong><span>{esc(l)}</span></div>" for v, l in c.get("metrics", []))
    o.append(f'''<section class="case-summary"><p class="case-kicker">The short version</p>
<h2>{esc(c["tldr"][2][1])}</h2>
<div class="case-summary-grid"><p><b>The problem.</b> {esc(c["tldr"][0][1])}</p><p><b>What I did.</b> {esc(c["tldr"][1][1])}</p></div>
{f'<div class="case-results">{res}</div>' if res else ""}</section>''')

    n = 0
    def kick(label):
        nonlocal n; n += 1
        return f'<p class="case-kicker">{n:02d} · {esc(label)}</p>'

    # 01 Challenge (dark)
    q = c.get("quotes", [])
    body = "".join(f"<p>{rich(p)}</p>" for p in c["problem"])
    quote = f'<blockquote>“{esc(q[0])}”<cite>Research participant</cite></blockquote>' if q else ""
    side = figs("problem")
    if S.get("videos"):
        side += "".join(f'<figure class="vid"><video src="{pre}{esc(v)}" data-once muted playsinline controls preload="metadata" aria-label="{esc(l)}"></video><figcaption>{esc(l)}</figcaption></figure>' for v, l in S["videos"])
        used.update(v for v, _ in S["videos"])
    if c.get("problem_img"):
        side += f'<figure class="dark-fig">{img(c["problem_img"][0], c["problem_img"][1], pre)}<figcaption>Before the redesign</figcaption></figure>'
    extra = "".join(f"<li>“{esc(x)}”</li>" for x in q[1:])
    o.append(f'''<section class="case-challenge"><div class="challenge-copy">{kick("The challenge")}<h2>{esc(S.get("scene", c["tldr"][0][1]))}</h2>{body}{quote}
{f'<ul class="more-quotes">{extra}</ul>' if extra else ""}</div><div class="challenge-side">{side}</div></section>''')

    # 02 Goals (optional)
    if S.get("goals"):
        g = "".join(f'<article class="goal"><span style="background:{acc}">{k:02d}</span><h3>{esc(a)}</h3><p>{esc(d)}</p></article>' for k, (a, d) in enumerate(S["goals"], 1))
        o.append(f'<section class="case-goals">{kick("The goals")}<h2>What it had to do.</h2><div class="goals-grid">{g}</div></section>')

    # 03 Finding the pattern
    r = c.get("research") or {}
    colors = [RED, YELLOW, BLUE, GREEN]
    cards = "".join(f'<article class="insight-card"><span style="background:{colors[(k - 1) % 4]}">{k:02d}</span><p>{esc(f)}</p></article>' for k, f in enumerate(r.get("findings", []), 1))
    b = f'<div class="insights-grid">{cards}</div>' if cards else ""
    if S.get("insight"):
        nm, tx = S["insight"]
        b += f'<div class="case-principle"><span>Key insight</span><div><p>{esc(nm)}</p><p class="cp-sub">{esc(tx)}</p></div></div>'
    b += figs("research")
    if r.get("img"): b += f'<figure class="fig">{img(r["img"][0], r["img"][1], pre)}<figcaption>{esc(r["img"][1])}</figcaption></figure>'
    if S.get("flow_before"):
        def flow(name, steps, foot, cls):
            items = "".join(f'<li><span class="n">{k}</span><div><b>{esc(a)}</b><p>{esc(d)}</p>{f"<em>{esc(t)}</em>" if t else ""}</div></li>' for k, (a, d, t) in enumerate(steps, 1))
            return f'<div class="flow {cls}"><p class="k">{esc(name)}</p><ol>{items}</ol><p class="foot">{esc(foot)}</p></div>'
        b += '<div class="flows">' + flow("Before", S["flow_before"], S["flow_before_foot"], "old") + flow("After", S["flow_after"], S["flow_after_foot"], "new") + "</div>"
    if S.get("twist"):
        hl, tx = S["twist"]
        b += f'<div class="twist"><p class="k">Plot twist</p><h3>{esc(hl)}</h3><p>{esc(tx)}</p></div>'
    rej = c.get("rejected", [])[1:] if S.get("twist") else c.get("rejected", [])
    if rej:
        b += '<h3 class="sub-k">Ideas I dropped</h3><ul class="rej">' + "".join(f'<li><p class="k">Rejected</p><h4>{esc(a)}</h4><p>{esc(w)}</p></li>' for a, w in rej) + "</ul>"
    if b or r.get("text"):
        o.append(f'''<section class="case-research"><div class="case-section-head">{kick("Finding the pattern")}</div>
<div class="research-head"><h2>{esc(S.get("research_title", "How I got there"))}</h2>{f"<p>{esc(r['text'])}</p>" if r.get("text") else ""}</div>{b}</section>''')

    # 04 Solution (dark, coloured stages)
    sols = S.get("solutions") or [(d["title"], d["why"]) for d in c["decisions"]]
    stage_cols = [acc, YELLOW if acc != YELLOW else BLUE, "#F7F4EC"]
    stages = ""
    for k, (hl, txt) in enumerate(sols, 1):
        d = c["decisions"][k - 1] if k - 1 < len(c["decisions"]) else {}
        pic = f'<figure class="stage-shot">{img(d["img"][0], d["img"][1], pre)}<figcaption>{esc(d["img"][1])}</figcaption></figure>' if d.get("img") else ""
        resl = f'<p class="stage-res">✓ {esc(d["result"])}</p>' if d.get("result") else ""
        stages += f'''<div class="solution-stage{" noimg" if not pic else ""}" style="background:{stage_cols[(k - 1) % 3]}"><div class="solution-copy"><span>{k:02d} · Solution</span>
<h3>{esc(hl)}</h3><p>{esc(txt)}</p>{resl}</div>{pic}</div>'''
    sf = figs("solutions")
    o.append(f'''<section class="case-solution"><div class="solution-intro">{kick("The solution")}<h2>{esc(S.get("solutions_title", "Key decisions"))}</h2>
<p>{esc(c["tldr"][1][1])}</p></div>{f'<div class="light-figs">{sf}</div>' if sf else ""}{stages}</section>''')

    # 05 Impact
    rs = c.get("results") or {}
    b = figs("results")
    if S.get("goal_results"):
        b += '<div class="impact-grid">' + "".join(f'<div><span class="ig-k">{esc(g)}</span><p class="ig-v">{esc(v)}</p></div>' for g, v in S["goal_results"]) + "</div>"
    if rs.get("rows"):
        b += '<table><thead><tr><th scope="col">Measure</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>' + "".join(
            f'<tr><th scope="row">{esc(a)}</th><td>{esc(x) or "<span class=sr>not measured</span>"}</td><td><b>{esc(y)}</b></td></tr>' for a, x, y in rs["rows"]) + "</tbody></table>"
    if rs.get("note"): b += f'<p class="small">{esc(rs["note"])}</p>'
    if rs.get("img"): b += f'<figure class="fig">{img(rs["img"][0], rs["img"][1], pre)}<figcaption>{esc(rs["img"][1])}</figcaption></figure>'
    if S.get("lesson"): b += f'<div class="learning"><span>What I learned</span><p>{esc(S["lesson"])}</p></div>'
    o.append(f'''<section class="case-impact">{kick("The impact")}<h2>{esc(S.get("outcome_title", c["tldr"][2][1]))}</h2>
{f'<p class="impact-sub">{esc(S["outcome_sub"])}</p>' if S.get("outcome_sub") else ""}{b}</section>''')

    # 06 Next
    fut = S.get("future") or [(f"Idea {k:02d}", x) for k, x in enumerate(c.get("next", []), 1)]
    if fut:
        f = "".join(f'<article><span>{k:02d}</span><h3>{esc(a)}</h3><p>{esc(x)}</p></article>' for k, (a, x) in enumerate(fut, 1))
        o.append(f'<section class="case-future">{kick("What’s next")}<h2>Where I’d take it next.</h2><p class="fut-note">Ideas, not built.</p><div class="future-grid">{f}</div></section>')
    if c.get("links"):
        o.append('<p class="case-links">' + "".join(f'<a href="{esc(u)}" target="_blank" rel="noopener">{esc(l)}<span class="sr"> (opens in a new tab)</span> {DIAG}</a>' for l, u in c["links"]) + "</p>")
    nc = CASES[nxt]
    o.append(f'''<section class="case-next" style="background:{ACCENT[nxt]}"><p class="case-kicker">Next project</p>
<a href="{nxt}.html"><span>{esc(nc["org"])} · {esc(nc["kind"])}</span><strong>{esc(nc["card"])} {DIAG}</strong></a></section>''')
    o.append("</main>" + case_footer(pre) + tail(pre))
    return "\n".join(o)

def main():
    OUT.mkdir(parents=True, exist_ok=True); (OUT / "work").mkdir(exist_ok=True)
    (OUT / "index.html").write_text(home())
    (OUT / "about.html").write_text(about())
    for cid in ORDER: (OUT / "work" / f"{cid}.html").write_text(case(cid))
    (OUT / "site.css").write_text(CSS); (OUT / "motion.js").write_text(JS)
    for src in used | {"assets/favicon.svg"}:
        d = OUT / src
        if d.resolve() == (ROOT / src).resolve(): continue
        d.parent.mkdir(parents=True, exist_ok=True); shutil.copy(ROOT / src, d)
    print(f"built home + about + {len(ORDER)} case pages into {OUT}, {len(used)} images")

if __name__ == "__main__":
    main()
