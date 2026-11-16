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
from content import SITE, HOW, TOOLS, WORDS, EXPERIENCE, PROJECTS, SIDE, CASES, ORDER, FEATURED
from story import STORY, FIGS
from figs import render as viz, CSS as VIZ_CSS
from artifacts import ARTIFACTS, SITENAV
SKETCHES = {
    "ir2go": ("assets/irs2go/irs2go-sketches-flow.webp", "Low-fidelity sketches of the IRS2Go refund, payment and tax help flows, redrawn for this page from the shipped screens."),
    "anchor": ("assets/moneyanchor/anchor-sketches-flow.webp", "Low-fidelity sketches of Money Anchor's budget, accounts, AI assistant, transactions, report and goals screens, redrawn for this page from the shipped screens."),
    "ev": ("assets/ev/ev-sketches-flow.webp", "Low-fidelity sketches of the EV charging app's trip planning, station check-in, battery health and payment screens, redrawn for this page from the shipped screens."),
}

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/preview5")
ROOT = Path(sys.argv[2] if len(sys.argv) > 2 else HERE.parents[1])
CSS = (HERE / "template.css").read_text() + (HERE / "site.css").read_text() + VIZ_CSS
JS = (HERE / "motion.js").read_text()
V = hashlib.md5((CSS + JS).encode()).hexdigest()[:8]
used = set()

RED, BLUE, YELLOW, GREEN = "#ef4f3e", "#4f7bf3", "#ffc92a", "#21b36b"
ACCENT = {"canvas": BLUE, "findme": RED, "jaihind": GREEN, "omkar": YELLOW, "anchor": RED,
          "ev": GREEN, "ir2go": BLUE, "research-lens": YELLOW, "magic-apron": RED, "fitcheck": BLUE}

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
<p class="hero-now"><b><i aria-hidden="true"></i>Now</b> Until now I made workflows easier for people. Today I work on how AI interacts with people: how an assistant shows its sources and leaves people in control. First up is <a href="work/research-lens.html">Research Lens</a>.</p>
<a class="text-link" href="#work">See my work {ARROW}</a></div>
{CUBE}
<div class="scroll-note" aria-hidden="true"><i></i> Scroll to explore</div></section>''')
    o.append(f'''<section class="statement" id="about"><p class="section-kicker">What I do</p>
<h2>Complexity doesn’t scare me.<br><span>It gives me something to solve.</span></h2>
<div class="statement-grid"><p>{rich(SITE["story"])}</p>
<div class="capabilities"><span>01</span><p>UX research</p><span>02</span><p>B2B workflow design</p><span>03</span><p>AI-assisted analysis</p><span>04</span><p>Front-end build</p></div></div></section>''')
    yrs = lambda ids: sorted({y for i in ids for y in re.findall(r"20\d\d", CASES[i].get("dates") or CASES[i]["year"])})
    fy = yrs(FEATURED)
    o.append(f'<section class="work" id="work"><div class="section-heading" id="projects"><h2 class="section-kicker">Work</h2><span>{fy[0]} to {fy[-1]}</span></div>')
    o += [project(cid, k) for k, cid in enumerate(FEATURED, 1)]
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

# Facts below are lifted from each case's own text in content.py (research, problem, meta). Nothing new.
AUDIENCE = {
    "canvas": ["UX students, 43 across 2 cohorts", "Faculty planning the new courses"],
    "findme": ["Engineers building FindMe screens", "Product and marketing teammates"],
    "jaihind": ["Sales associates and cashiers", "Store managers", "Tailors and fabric cutters", "Mewar stylists", "Purchasing and warehouse", "Accounts and HR", "The owner and head office"],
    "omkar": ["B2B buyers who check the catalog before they call"],
    "anchor": ["Young adults aged 20 to 32, the people we interviewed"],
    "ev": ["EV drivers in the US", "People new to EVs"],
    "ir2go": ["Taxpayers checking a refund", "Taxpayers making a payment", "People looking for free tax help"],
    "research-lens": ["UX researchers using AI to make sense of interviews"],
    "magic-apron": ["Shoppers asking a store's AI assistant for help"],
    "fitcheck": ["Shoppers using a retailer's AI assistant to choose between products", "Store associates who take the handoff"],
}
METHODS = {
    "canvas": ["50+ papers and reports, read with UM-GPT", "Feedback from 43 students", "8 presentations, 2 cohorts"],
    "findme": ["12+ interviews and usability tests in Maze", "Findings tagged in Dovetail"],
    "jaihind": ["5 stores visited by me, all 10 by the team", "35+ contextual inquiries and usability evaluations", "Every handoff mapped across 6 teams"],
    "anchor": ["40+ papers analyzed with AI", "10 budgeting apps benchmarked", "8 interviews", "4 focus groups, 16 people"],
    "ev": ["16,767 Google Maps reviews", "AI-assisted cleaning in Colab", "Studies since 2012", "5 charging apps compared"],
    "ir2go": ["150+ App Store reviews", "200+ Quora posts", "About 10 taxpayer interviews", "A survey", "Papers summarized with AI"],
    "magic-apron": ["Interview", "Screen recording", "Heuristic review"],
    "fitcheck": ["4 assistants recorded on the same task, 24 real steps", "Heuristic review against NN/g's chatbot guidelines", "Desk research: 2025 to 2026 usability studies and shopper surveys"],
}

# Headline research numbers, each taken from the case's own research text or scene line.
OBS = {
    "canvas": [("50+", "papers and industry reports reviewed"), ("43", "students gave feedback"), ("8", "presentations across 2 cohorts")],
    "findme": [("12+", "user interviews and usability tests supported")],
    "jaihind": [("5", "stores I visited"), ("10", "stores covered by our team"), ("35+", "contextual inquiries and usability evaluations")],
    "anchor": [("40+", "research papers analyzed with AI"), ("10", "budgeting apps benchmarked"), ("24", "people in interviews and focus groups")],
    "ev": [("16,767", "Google Maps reviews collected"), ("4.26", "Tesla's average rating, the highest"), ("5", "charging apps compared")],
    "ir2go": [("2.8", "App Store star rating"), ("45%", "of people quit before finishing a task"), ("None", "of the screens met WCAG 2.1 AA")],
    "fitcheck": [("54%", "of AI shoppers double-check everything it says (2026 survey)"), ("78%", "assume brands pay their way into AI picks (2026 survey)"), ("11%", "at most would let AI make the purchase (Gartner, Jan 2026)")],
}

def two(a, b): return f'<h2 class="k-title">{esc(a)} <em>{esc(b)}</em></h2>'

def device(src, alt, pre, lazy=True, cls=""):
    """Phone frame for tall screenshots, browser frame for wide ones (by the image's own shape)."""
    import struct
    w = h = 0
    try:
        from PIL import Image
        with Image.open(ROOT / src) as im: w, h = im.size
    except Exception: pass
    tall = h > w * 1.4
    kind = "k-phone" if tall else "k-browser"
    bar = '' if tall else '<span class="k-bar"><i></i><i></i><i></i></span>'
    return f'<figure class="k-device {kind} {cls}">{bar}<span class="k-screen">{img(src, alt, pre, lazy)}</span></figure>'

def figure(src, alt, pre):
    """A screenshot or image with its caption; tall phone screenshots go in a phone frame."""
    try:
        from PIL import Image
        with Image.open(ROOT / src) as im: w, h = im.size
    except Exception: w, h = 1, 1
    if h > w * 1.4:
        return f'<div class="k-solo">{device(src, alt, pre)}<p class="k-cap">{esc(alt)}</p></div>'
    return f'<figure class="fig">{img(src, alt, pre)}<figcaption>{esc(alt)}</figcaption></figure>'

def donuts(metrics):
    out = ""
    for v, l in metrics:
        m = re.fullmatch(r"[−-]?(\d+(?:\.\d+)?)%", v.strip())
        if not m: continue
        pct = min(100, float(m.group(1)))
        out += f'<figure class="donut" style="--p:{pct}"><span class="d-ring" aria-hidden="true"></span><figcaption><b>{esc(v)}</b>{esc(l)}</figcaption></figure>'
    return out


def art(cid, phase):
    """Render research artifacts found in Drive for one phase. Every block names its source."""
    out = ""
    for a in ARTIFACTS.get(cid, {}).get(phase, []):
        t, h = a["type"], f'<h3 class="k-h"><span></span>{esc(a["title"])}</h3>'
        note = f'<p class="a-note">{esc(a["note"])}</p>' if a.get("note") else ""
        src = f'<p class="a-src">Source: {esc(a["src"])}</p>'
        if t == "issues":
            body = '<div class="a-cols">' + "".join(f'<div class="a-col"><h4>{esc(n)}</h4><ul>{"".join(f"<li>{esc(x)}</li>" for x in xs)}</ul></div>' for n, xs in a["cols"]) + "</div>"
        elif t == "steps":
            body = '<div class="a-cols">'
            for n, xs in a["cols"]:
                li = "".join(f'<li{" class=bad" if f else ""}><span>{esc(s_)}</span>' + (f"<em>{esc(f)}</em>" if f else "") + "</li>" for s_, f in xs)
                body += f'<div class="a-col"><h4>{esc(n)} <small>{len(xs)} steps</small></h4><ol class="a-steps">{li}</ol></div>'
            body += "</div>"
        elif t == "scenarios":
            body = '<div class="k-cards">' + "".join(f'<article class="k-card a-persona"><span>{esc(k)}</span><h3>{esc(w)}</h3>' + (f"<p>{esc(x)}</p>" if x else "") + "</article>" for k, w, x in a["items"]) + "</div>"
        elif t == "matrix":
            hd = "".join(f'<th scope="col"><span>{esc(c_)}</span></th>' for c_ in a["cols"])
            rows = ""
            for g, items in a["groups"]:
                rows += f'<tr class="a-g"><th scope="rowgroup" colspan="{len(a["cols"]) + 1}">{esc(g)}</th></tr>'
                for n, vs in items:
                    rows += f'<tr><th scope="row">{esc(n)}</th>' + "".join('<td><b aria-label="yes">●</b></td>' if v else '<td><span class="sr">no</span></td>' for v in vs) + "</tr>"
            tot = [sum(vs[k] for _, it in a["groups"] for _, vs in it) for k in range(len(a["cols"]))]
            rows += '<tr class="a-tot"><th scope="row">Sources raising it</th>' + "".join(f"<td>{n}</td>" for n in tot) + "</tr>"
            body = f'<div class="a-scroll" tabindex="0" role="region" aria-label="{esc(a["title"])}"><table class="a-matrix"><thead><tr><th scope="col">Source</th>{hd}</tr></thead><tbody>{rows}</tbody></table></div>'
        elif t == "compare":
            body = "<table><thead><tr>" + "".join(f'<th scope="col">{esc(x)}</th>' for x in a["heads"]) + "</tr></thead><tbody>" + "".join(f'<tr><th scope="row">{esc(r_[0])}</th>' + "".join(f"<td>{esc(x)}</td>" for x in r_[1:]) + "</tr>" for r_ in a["rows"]) + "</tbody></table>"
        elif t == "map":
            body = '<ul class="a-map">' + "".join(f'<li><blockquote>“{esc(q_)}”</blockquote><span aria-hidden="true">→</span><p>{esc(d_)}</p></li>' for q_, d_ in a["rows"]) + "</ul>"
        elif t == "funnel":
            body = '<ol class="a-funnel">' + "".join(f'<li style="--w:{100 - 22 * k}%"><b>{esc(n)}</b><span>{esc(l)}</span></li>' for k, (n, l) in enumerate(a["steps"])) + "</ol>"
            body += '<p class="a-note">Research themes the ideas grew from:</p><ul class="k-chips">' + "".join(f"<li>{esc(x)}</li>" for x in a["chips"]) + "</ul>"
        elif t == "pair":
            body = '<div class="a-cols">' + "".join(f'<div class="a-col{" off" if k else ""}"><h4>{esc(n)}</h4><ul>' + "".join(f"<li>{esc(x)}</li>" for x in xs) + "</ul></div>" for k, (n, xs) in enumerate((a["a"], a["b"]))) + "</div>"
        elif t == "process":
            body = '<ol class="a-proc">' + "".join(f"<li><b>{esc(n)}</b><p>{esc(x)}</p></li>" for n, x in a["steps"]) + "</ol>"
        elif t == "ia":
            body = f'<div class="a-ia"><b>{esc(a["root"])}</b><ul>' + "".join(f"<li>{esc(k)}</li>" for k in a["kids"]) + "</ul></div>"
        elif t == "chips":
            body = '<ul class="k-chips">' + "".join(f"<li>{esc(x)}</li>" for x in a["items"]) + "</ul>"
        else:
            continue
        out += h + note + body + src
    return out


def sitenav(cid, pre):
    n = SITENAV.get(cid)
    if not n:
        return ""
    menu, tree = "", ""
    for top, kids in n["menu"]:
        kl = "".join(f"<li>{esc(x)}</li>" for x in kids)
        menu += f'<details class="sn-g"><summary>{esc(top)}</summary><ul>{kl}</ul></details>' if kids else f'<p class="sn-g">{esc(top)}</p>'
        tree += f"<li><b>{esc(top)}</b>" + (f"<ul>{kl}</ul>" if kids else "") + "</li>"
    pts = "".join(f'<article class="k-card"><span>{k:02d}</span><h3>{esc(a)}</h3><p>{esc(b)}</p></article>' for k, (a, b) in enumerate(n["points"], 1))
    return (f'<section class="k-sec">{two("Marketing Website", "Navigation")}'
            '<p class="k-intro">I also designed the navigation and information architecture of the public website. The pages have been restyled since, but the menu still runs on the structure below.</p>'
            f'<div class="sn-wrap"><div class="sn-phone" role="group" aria-label="Working copy of the site menu"><p class="sn-brand" aria-hidden="true">JAIHIND</p>{menu}<p class="a-note">Tap a group to open it.</p></div>'
            f'<div class="sn-tree"><h3 class="k-h"><span></span>Information architecture</h3><ul class="a-tree">{tree}</ul></div></div>'
            f'<h3 class="k-h"><span></span>How it helps people find things</h3><div class="k-cards">{pts}</div>'
            f'<p class="a-src">Source: the live menu on <a href="{n["url"]}" target="_blank" rel="noopener">jaihindretail.com<span class="sr"> (opens in a new tab)</span></a>, read November 2026.</p></section>')


def case(cid):
    c, pre = CASES[cid], "../"
    S, F = STORY.get(cid, {}), FIGS.get(cid, {})
    figs = lambda k: "".join(viz(x) for x in F.get(k, []))
    i = ORDER.index(cid); nxt = ORDER[(i + 1) % len(ORDER)]
    acc = ACCENT[cid]
    back = ("../index.html#projects" if cid not in EXPERIENCE else "../index.html#work", "All work")
    r = c.get("research") or {}
    o = [head(f'{plain(c["title"])} · {SITE["name"]}', c["tldr"][0][1] + " " + c["tldr"][2][1], pre, "case k-case", acc),
         '<main id="main" tabindex="-1" class="case-page">', nav(pre, back)]

    # Cover
    meta = dict(c["meta"])
    tools = meta.get("Tools") or meta.get("Stack") or meta.get("Methods")
    chips = [t.strip() for t in tools.split(",")] if tools else c.get("tags", [])
    dl = "".join(f"<div><dt>{esc(k)}</dt><dd>{esc(v)}</dd></div>" for k, v in c["meta"] if k not in ("Tools", "Stack", "Methods"))
    pic = device(c["cover"], c.get("cover_alt", ""), pre, False, "k-hero-dev") if c.get("cover") else (
        f'<div class="k-hero-type"><b>{esc(c["metrics"][0][0])}</b><span>{esc(c["metrics"][0][1])}</span></div>' if c.get("metrics") else "")
    o.append(f'''<header class="k-cover"><div class="k-arcs" aria-hidden="true"></div><div class="k-cover-copy">
<p class="k-pill">{esc(c["kind"])} · Case study {i + 1:02d}</p><h1>{rich(c["title"])}</h1><p class="k-lede">{esc(c["line"])}</p>
<ul class="k-tools" aria-label="Tools and methods">{"".join(f"<li>{esc(t)}</li>" for t in chips)}</ul>
<dl class="k-meta">{dl}</dl></div><div class="k-cover-pic">{pic}</div></header>''')

    # Problem statement / possible solution
    o.append(f'''<section class="k-sec k-center">{two("Problem", "Statement")}
<p class="k-scene">{esc(S.get("scene", ""))}</p>{"".join(f"<p>{rich(x)}</p>" for x in c["problem"])}</section>''')
    o.append(f'<section class="k-sec k-center">{two("Possible", "Solution")}<p>{esc(c["tldr"][1][1])}</p></section>')
    if S.get("goals"):
        o.append(f'''<section class="k-sec">{two("Objectives &", "Goals")}<div class="k-cards">{"".join(f'<article class="k-card"><span>{k:02d}</span><h3>{esc(a)}</h3><p>{esc(b)}</p></article>' for k, (a, b) in enumerate(S["goals"], 1))}</div></section>''')

    # Target audience + approach
    aud = AUDIENCE.get(cid, [])
    if aud or r.get("text"):
        o.append(f'''<section class="k-sec k-two">
<div>{two("Target", "Audience")}<ul class="k-panel">{"".join(f"<li>{esc(a)}</li>" for a in aud)}</ul></div>
<div>{two("The", "Approach")}<p>{esc(r.get("text") or S.get("scene_sub", ""))}</p></div></section>''')

    # My role
    role = [meta.get("Role", "")] + [x.strip() for x in (meta.get("I owned") or "").split(",") if x.strip()] + c.get("tags", [])
    seen = []; [seen.append(x[:1].upper() + x[1:]) for x in role if x and x[:1].upper() + x[1:] not in seen]
    o.append(f'<section class="k-band k-center">{two("My", "Role")}<ul class="k-chips">{"".join(f"<li>{esc(x)}</li>" for x in seen)}</ul></section>')

    # Design thinking process (only real items in each stage)
    findings = r.get("findings") or []
    stages = [("Empathize", METHODS.get(cid, [])),
              ("Define", ([S["insight"][0]] if S.get("insight") else []) + [g for g, _ in S.get("goals", [])][:3]),
              ("Ideate", [a for a, _ in c.get("rejected", [])][:3] + (["Low-fidelity sketches"] if ("sketch" in (r.get("img") or ("", ""))[1].lower() or cid in SKETCHES) else [])),
              ("Design", [d["title"] for d in c["decisions"]][:4]),
              ("Test", [g for g, _ in S.get("goal_results", [])][:4] or [a for a, _, _ in (c.get("results") or {}).get("rows", [])][:4])]
    stages = [(n, it) for n, it in stages if it]
    circ = "".join(f'''<li class="k-circle"><span class="k-dot">{k:02d}</span><h3>{n}</h3><ul>{"".join(f"<li>{esc(x)}</li>" for x in it)}</ul></li>''' for k, (n, it) in enumerate(stages, 1))
    o.append(f'''<section class="k-sec k-center">{two("Design Thinking", "Process")}
<p>How this project moved from the mess to a decision. Each stage lists only what was actually done.</p><ol class="k-process">{circ}</ol>
<div class="k-timeline" aria-label="Project timeline"><span class="k-t-k">Project timeline</span>
<div class="k-track">{"".join(f"<i>{n}</i>" for n, _ in stages)}</div><div class="k-t-ends"><span>{esc(meta.get("Timeline") or meta.get("Time") or c["year"])}</span><span>Phases in order, not to scale</span></div></div></section>''')

    # Empathize phase
    q = c.get("quotes", [])
    emp = ""
    if r.get("text"): emp += f'<h3 class="k-h"><span></span>Qualitative research</h3><p>{esc(r["text"])}</p>'
    if OBS.get(cid):
        emp += '<h3 class="k-h"><span></span>Observations</h3><div class="k-obs">' + "".join(f'<div><strong>{esc(v)}</strong><span>{esc(l)}</span></div>' for v, l in OBS[cid]) + "</div>"
    if q: emp += '<div class="k-quotes">' + "".join(f'<blockquote>“{esc(x)}”<cite>Research participant</cite></blockquote>' for x in q) + "</div>"
    if r.get("img") and "sketch" not in r["img"][1].lower():
        emp += figure(r["img"][0], r["img"][1], pre)
    for x in F.get("research", []):
        lab = "Competitive analysis" if x["kind"] == "table" else ("How the reviews were analyzed" if x["kind"] == "sift" else "Quantitative research")
        emp += f'<h3 class="k-h"><span></span>{lab}</h3>{viz(x)}'
    if S.get("videos"):
        emp += '<h3 class="k-h"><span></span>Field recordings</h3><div class="k-vids">' + "".join(f'<figure class="vid"><video src="{pre}{esc(v)}" data-once muted playsinline controls preload="metadata" aria-label="{esc(l)}"></video><figcaption>{esc(l)}</figcaption></figure>' for v, l in S["videos"]) + "</div>"
        used.update(v for v, _ in S["videos"])
    emp += art(cid, "empathize")
    if emp:
        o.append(f'<section class="k-sec">{two("Empathize", "Phase")}{emp}</section>')
    if findings:
        o.append(f'''<section class="k-insight"><h3>Key insights derived</h3><ol>{"".join(f"<li>{esc(f)}</li>" for f in findings)}</ol></section>''')

    # Define phase
    d = ""
    pf = figs("problem")
    if pf: d += f'<h3 class="k-h"><span></span>The problem in one picture</h3>{pf}'
    if c.get("problem_img"): d += figure(c["problem_img"][0], c["problem_img"][1], pre)
    pains = [(a, b, t) for a, b, t in S.get("flow_before", []) if t]
    if pains:
        d += '<h3 class="k-h"><span></span>Challenges users faced</h3><ul class="k-pains">' + "".join(f'<li><b>{esc(a)}</b><span>{esc(b)}</span><em>{esc(t)}</em></li>' for a, b, t in pains) + "</ul>"
    if S.get("insight"):
        nm, tx = S["insight"]
        d += f'<div class="k-principle"><span>The insight we designed around</span><p>{esc(nm)}</p><small>{esc(tx)}</small></div>'
    d += art(cid, "define")
    if d: o.append(f'<section class="k-sec">{two("Define", "Phase")}{d}</section>')

    # Task flow
    if S.get("flow_before"):
        def flow(name, steps, foot, cls):
            items = "".join(f'<li><b>{esc(a)}</b><small>{esc(t) if t else esc(b)}</small></li>' for a, b, t in steps)
            return f'<div class="k-flow {cls}"><h3 class="k-h"><span></span>{esc(name)}</h3><ol>{items}</ol><p class="k-flow-foot">{esc(foot)}</p></div>'
        o.append(f'''<section class="k-sec">{two("Task", "Flow")}{flow("Before: the old flow", S["flow_before"], S["flow_before_foot"], "old")}
{flow("After: the redesigned flow", S["flow_after"], S["flow_after_foot"], "new")}</section>''')

    # Ideate
    rej = c.get("rejected", [])[1:] if S.get("twist") else c.get("rejected", [])
    idea = ""
    if r.get("ideas"):
        idea += f'<h3 class="k-h"><span></span>Rough ideas</h3><figure class="fig"><div class="sk" tabindex="0" role="region" aria-label="Rough idea sketches, scrolls sideways">{img(r["ideas"][0], r["ideas"][1], pre)}</div><figcaption>{esc(r["ideas"][1])}</figcaption></figure>'
    if r.get("img") and "sketch" in r["img"][1].lower():
        idea += f'<h3 class="k-h"><span></span>{"Wireframes taking shape" if r.get("ideas") else "Low-fidelity sketches"}</h3><figure class="fig"><div class="sk" tabindex="0" role="region" aria-label="Low-fidelity sketches, scrolls sideways">{img(r["img"][0], r["img"][1], pre)}</div><figcaption>{esc(r["img"][1])}</figcaption></figure>'
    if cid in SKETCHES:
        sp, sa = SKETCHES[cid]
        idea += f'<h3 class="k-h"><span></span>Low-fidelity sketches</h3><figure class="fig"><div class="sk" tabindex="0" role="region" aria-label="Low-fidelity sketches, scrolls sideways">{img(sp, sa, pre)}</div><figcaption>{esc(sa)}</figcaption></figure>'
    if S.get("twist"):
        hl, tx = S["twist"]
        idea += f'<div class="k-twist"><span>Plot twist</span><h3>{esc(hl)}</h3><p>{esc(tx)}</p></div>'
    if rej:
        idea += '<h3 class="k-h"><span></span>Ideas I tested and dropped</h3><ul class="rej">' + "".join(f'<li><p class="k">Dropped</p><h4>{esc(a)}</h4><p>{esc(w)}</p></li>' for a, w in rej) + "</ul>"
    idea += art(cid, "ideate")
    if idea: o.append(f'<section class="k-sec">{two("Ideate", "Phase")}{idea}</section>')

    # High-fidelity design, annotated
    sols = S.get("solutions") or [(x["title"], x["why"]) for x in c["decisions"]]
    hi = ""
    for k, (hl, txt) in enumerate(sols, 1):
        dd = c["decisions"][k - 1] if k - 1 < len(c["decisions"]) else {}
        res = f'<p class="k-res">✓ {esc(dd["result"])}</p>' if dd.get("result") else ""
        if dd.get("img"):
            hi += f'''<div class="k-anno{" flip" if k % 2 == 0 else ""}"><div class="k-note"><span>{k:02d}</span><h3>{esc(hl)}</h3><p>{esc(txt)}</p>{res}</div>
{device(dd["img"][0], dd["img"][1], pre)}<p class="k-cap">{esc(dd["img"][1])}</p></div>'''
        else:
            hi += f'<div class="k-anno noimg"><div class="k-note"><span>{k:02d}</span><h3>{esc(hl)}</h3><p>{esc(txt)}</p>{res}</div></div>'
    sf = figs("solutions")
    o.append(f'''<section class="k-sec">{two("High-Fidelity", "Design")}<p class="k-intro">{esc(S.get("solutions_title", ""))}</p>
{f'<div class="k-figs">{sf}</div>' if sf else ""}{hi}{art(cid, "design")}</section>''')
    o.append(sitenav(cid, pre))

    # Test and results
    rs = c.get("results") or {}
    t = ""
    dn = donuts(c.get("metrics", []))
    big = "".join(f"<div><strong>{esc(v)}</strong><span>{esc(l)}</span></div>" for v, l in c.get("metrics", []) if not re.fullmatch(r"[−-]?\d+(?:\.\d+)?%", v.strip()))
    if dn: t += f'<div class="k-donuts">{dn}</div>'
    if big: t += f'<div class="case-results">{big}</div>'
    if S.get("goal_results"):
        t += '<h3 class="k-h"><span></span>Did it meet the goals?</h3><div class="k-cards">' + "".join(f'<article class="k-card"><h3>{esc(g)}</h3><p>{esc(v)}</p></article>' for g, v in S["goal_results"]) + "</div>"
    if rs.get("rows"):
        t += '<table><thead><tr><th scope="col">Measure</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>' + "".join(
            f'<tr><th scope="row">{esc(a)}</th><td>{esc(x) or "<span class=sr>not measured</span>"}</td><td><b>{esc(y)}</b></td></tr>' for a, x, y in rs["rows"]) + "</tbody></table>"
    if rs.get("note"): t += f'<p class="small">{esc(rs["note"])}</p>'
    t += art(cid, "test")
    t += figs("results")
    if rs.get("img"): t += figure(rs["img"][0], rs["img"][1], pre)
    if S.get("lesson"): t += f'<div class="learning"><span>What I learned</span><p>{esc(S["lesson"])}</p></div>'
    o.append(f'''<section class="k-sec k-results">{two("Test &", "Results")}<p class="k-intro">{esc(S.get("outcome_title", c["tldr"][2][1]))}</p>
{f'<p class="impact-sub">{esc(S["outcome_sub"])}</p>' if S.get("outcome_sub") else ""}{t}</section>''')

    fut = S.get("future") or [(f"Idea {k:02d}", x) for k, x in enumerate(c.get("next", []), 1)]
    if fut:
        o.append(f'''<section class="k-sec">{two("What’s", "Next")}<p class="fut-note">Ideas, not built.</p>
<div class="k-cards">{"".join(f'<article class="k-card"><span>{k:02d}</span><h3>{esc(a)}</h3><p>{esc(x)}</p></article>' for k, (a, x) in enumerate(fut, 1))}</div></section>''')
    if c.get("links"):
        o.append('<p class="case-links">' + "".join(f'<a href="{esc(u)}" target="_blank" rel="noopener">{esc(l)}<span class="sr"> (opens in a new tab)</span> {DIAG}</a>' for l, u in c["links"]) + "</p>")
    nc = CASES[nxt]
    o.append(f'''<section class="k-thanks"><div class="k-thanks-cube" aria-hidden="true">{mini()}</div><h2>Thank you for your time :)</h2>
<p>Questions or feedback on this case study? <a href="mailto:{SITE["email"]}">{esc(SITE["email"])}</a></p></section>
<section class="case-next" style="background:{ACCENT[nxt]}"><p class="case-kicker">Next project</p>
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
