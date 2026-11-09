#!/usr/bin/env python3
"""Portfolio, bold editorial layout: heavy condensed headlines, rounded panels, bento cards,
stat tiles, phase cards on case pages. Content comes from ../v3/content.py (unchanged).

    python3 build.py OUT_DIR [ASSET_ROOT]
"""
import html, re, shutil, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "v3"))
from content import SITE, HOW, TOOLS, WORDS, EXPERIENCE, PROJECTS, SIDE, CASES, ORDER
sys.path.insert(0, str(HERE))
from story import STORY

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/preview4")
ROOT = Path(sys.argv[2] if len(sys.argv) > 2 else HERE.parents[1])
used = set()
import hashlib
CSSV = hashlib.md5((HERE / "site.css").read_bytes()).hexdigest()[:8]  # cache-busting: browsers fetch the new file when it changes

TINT = {"canvas": "#ECEAFF", "findme": "#E3F1EA", "jaihind": "#EEF1F6", "omkar": "#E2EAF8", "anchor": "#DCE3FF",
        "ev": "#D9EFE3", "ir2go": "#FCE3C6", "research-lens": "#ECEAFF", "magic-apron": "#FBE6DC"}

ICONS = {  # simple line icons, decorative
    "walk": '<path d="M13 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM10 8l-3 4 3 2v6M10 14l4 2 1 4M10 8l4 2 3 1"/>',
    "read": '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4ZM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6Z"/>',
    "check": '<path d="M4 12l5 5L20 6"/>',
    "chart": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    "in": '<path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7"/><rect x="3" y="3" width="18" height="18" rx="4"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
    "gh": '<path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6.1 1 5 1.3 5 1.3a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 3.5 8.5c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21"/>',
    "arrow": '<path d="M7 17 17 7M8 7h9v9"/>',
}
def icon(k, cls="ic"): return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[k]}</svg>'

def esc(s): return html.escape(s, quote=True)
def rich(s):
    s = esc(s); s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    return re.sub(r"(?<![*\w])\*(?!\*)(.+?)\*(?!\w)", r"<em>\1</em>", s)
def plain(s): return re.sub(r"\*+", "", s)
def img(src, alt, pre, lazy=True):
    used.add(src)
    return f'<img src="{pre}{esc(src)}" alt="{esc(alt)}"{" loading=\"lazy\"" if lazy else ""} decoding="async">'
def pills(ts): return '<ul class="pills">' + "".join(f"<li>{esc(t)}</li>" for t in ts) + "</ul>"

FONT = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Inter:ital,wght@0,400..600;1,400..600&display=swap" rel="stylesheet">'

def socials(pre, light=False):
    return f'''<div class="social{" light" if light else ""}"><a class="round" href="{SITE["linkedin"]}" target="_blank" rel="noopener" aria-label="LinkedIn (opens in a new tab)">{icon("in")}</a><a class="round" href="mailto:{SITE["email"]}" aria-label="Email {SITE["email"]}">{icon("mail")}</a><a class="round" href="{SITE["github"]}" target="_blank" rel="noopener" aria-label="GitHub (opens in a new tab)">{icon("gh")}</a><a class="pillbtn" href="{pre}{SITE["resume"]}" data-resume download="Siddhi-Manche-Resume.pdf">Resume<span class="sr"> (PDF)</span></a></div>'''

def head(title, desc, pre, page=""):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(desc)}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<link rel="icon" href="{pre}assets/favicon.svg">{FONT}<link rel="stylesheet" href="{pre}site.css?v={CSSV}"></head><body class="{page}">
<a class="skip" href="#main">Skip to content</a>
<nav class="dock" aria-label="Main"><a class="home" href="{pre}index.html">SM<span class="sr"> Siddhi Manche, home</span></a><a href="{pre}index.html#work">Experience</a><a href="{pre}index.html#projects">Projects</a><a href="{pre}index.html#about">About</a><a href="{pre}index.html#contact">Contact</a></nav>
<main id="main" tabindex="-1">'''

def foot(pre):
    return f'''</main>
<footer class="band contact" id="contact"><div class="wrap cgrid">
<div><p class="eyebrow light"><span class="sq" aria-hidden="true"></span>Get in touch</p>
<h2 class="mega">Let’s build something people trust.</h2>{socials(pre, True)}</div>
<div class="cside"><p>Open to UX research and product design roles in the US, especially B2B workflow tools and AI products. I reply within one working day.</p>
<a class="bigmail" href="mailto:{SITE["email"]}">{SITE["email"]} {icon("arrow")}</a></div></div>
<p class="wrap fine">Designed and built by Siddhi Manche, with an AI coding assistant. Plain HTML and CSS, hosted on GitHub Pages. © 2026</p></footer>
<script>fetch("{pre}{SITE["resume"]}",{{method:"HEAD"}}).then(function(r){{if(!r.ok)throw 0}}).catch(function(){{document.querySelectorAll("[data-resume]").forEach(function(a){{a.hidden=true}})}});</script>
</body></html>'''

def tile(cid, pre, lazy=True):
    c = CASES[cid]
    if c.get("cover"):
        return f'<div class="tile{" top" if c.get("cover_fit") == "top" else ""}" style="--tint:{TINT[cid]}">{img(c["cover"], c["cover_alt"], pre, lazy)}</div>'
    n, l = c.get("cover_text", (c["metrics"][0][0], c["metrics"][0][1]))
    return f'<div class="tile type" style="--tint:{TINT[cid]}" aria-hidden="true"><b>{esc(n)}</b><span>{esc(l)}</span></div>'

def card(cid, size, pre=""):
    c = CASES[cid]
    when = c.get("dates") or c["year"]
    who = f'{c["role"]} · {c["org"]}' if c.get("role") else c["org"]
    flag = "Building" if c.get("status") == "building" else "Concept" if c["org"] == "Concept" else ""
    return f'''<li class="bcard {size}"><a href="{pre}work/{cid}.html">{tile(cid, pre)}{f'<span class="flag">{flag}</span>' if flag else ""}
<div class="btext"><p class="meta">{esc(who)} · {esc(when)}</p><h3>{esc(c["card"])}</h3><p>{esc(c["line"])}</p>{pills(c["tags"])}</div>
<span class="go" aria-hidden="true">{icon("arrow")}</span></a></li>'''

def home():
    pre = ""
    xp = CASES
    jobs = "".join(f'<li><p class="d">{esc(xp[c]["dates"])}</p><div><h4>{esc(xp[c]["role"])} at {esc(xp[c]["org"])}</h4><p>{esc(xp[c]["line"])}</p></div></li>' for c in EXPERIENCE)
    how_icons = ["walk", "read", "check", "chart"]
    how = "".join(f'<li><span class="hi">{icon(how_icons[i])}</span><h3>{esc(a)}</h3><p>{esc(b)}</p></li>' for i, (a, b) in enumerate(HOW))
    tools = "".join(f'<div><h4>{esc(g)}</h4>{pills(xs)}</div>' for g, xs in TOOLS)
    words = "".join(f'<figure><blockquote>“{esc(q)}”</blockquote><figcaption><b>{esc(n)}</b> {esc(t)}</figcaption></figure>' for q, n, t in WORDS)
    title = plain(SITE["title"])
    return head(f'{SITE["name"]} · {SITE["role"]}', title + " " + plain(SITE["intro"][1]), pre, "home") + f'''
<section class="band hero" aria-labelledby="h"><div class="wrap"><h1 id="h" class="mega">{esc(title)}</h1></div></section>
<section class="panel intro" aria-labelledby="hi"><div class="wrap igrid">
  <div><h2 id="hi" class="h2">Hi! I’m Siddhi Manche</h2>{"".join(f"<p>{rich(p)}</p>" for p in SITE["intro"])}</div>
  {socials(pre)}
</div></section>
<section class="panel" id="work" aria-labelledby="xp"><div class="wrap">
  <p class="eyebrow"><span class="sq" aria-hidden="true"></span>Experience</p>
  <h2 id="xp" class="big">I design workflows from what people actually do.</h2>
  <ul class="bento">{card("canvas", "half")}{card("findme", "half")}{card("jaihind", "full")}{card("omkar", "full short")}</ul>
</div></section>
<section class="panel" id="projects" aria-labelledby="pj"><div class="wrap">
  <p class="eyebrow"><span class="sq" aria-hidden="true"></span>Projects</p>
  <h2 id="pj" class="big">Research-led projects, with AI in the loop.</h2>
  <ul class="bento">{card("anchor", "full")}{card("ev", "third")}{card("ir2go", "twothird")}</ul>
</div></section>
<section class="band more" aria-labelledby="mw"><div class="wrap">
  <h2 id="mw" class="mega sm">More work</h2><p class="caps">Side builds and concepts, on my own time.</p>
  <ul class="tilt">{"".join(card(c, "tcard") for c in SIDE)}</ul>
</div></section>
<section class="panel grey" aria-labelledby="hw"><div class="wrap">
  <h2 id="hw" class="mega sm dark">How I work</h2>
  <ol class="how">{how}</ol>
  <h3 class="caps dark tools-h">Tools I use</h3><div class="tools">{tools}</div>
</div></section>
<section class="panel" id="about" aria-labelledby="ab"><div class="wrap agrid">
  <div><h2 id="ab" class="mega sm dark">About</h2>
  {"".join(f"<p class='lead'>{rich(p)}</p>" for p in SITE["intro"])}
  <h3 class="caps dark rule">Education</h3>
  <ul class="tl"><li><p class="d">2024 to 2026</p><div><h4>M.S. Human-Centered Design and Engineering</h4><p>University of Michigan-Dearborn</p></div></li>
  <li><p class="d">2020 to 2024</p><div><h4>B.E. Electronics and Telecommunication</h4><p>Vidyalankar Institute of Technology, University of Mumbai</p></div></li></ul>
  <h3 class="caps dark rule">Work experience</h3><ul class="tl">{jobs}</ul></div>
  <div class="aside">{img(SITE["photo"], "Siddhi Manche", pre)}<div class="words">{words}</div></div>
</div></section>''' + foot(pre)

# ---------------- case pages ----------------
def case(cid):
    c, pre = CASES[cid], "../"
    i = ORDER.index(cid); nxt = [ORDER[(i + 1) % len(ORDER)], ORDER[(i + 2) % len(ORDER)]]
    o = [head(f'{plain(c["title"])} · {SITE["name"]}', c["tldr"][0][1] + " " + c["tldr"][2][1], pre, "case")]
    stats = "".join(f'<li><span class="k">{esc(l)}</span><b>{esc(v)}</b></li>' for v, l in c.get("metrics", [])[:4])
    o.append(f'''<header class="wrap chead">
<a class="back" href="../index.html#{"work" if cid in EXPERIENCE else "projects"}"><span aria-hidden="true">←</span> All work</a>
<h1 class="mega dark">{esc(plain(c["title"]))}</h1>
<p class="sub">{esc(c["org"])} · {esc(c["year"])} · {esc(c["kind"])}</p>{pills(c["tags"])}
<div class="cmeta"><div class="facts">{"".join(f'<div><p class="k">{esc(k)}</p><p>{esc(v)}</p></div>' for k, v in c["meta"])}
<div class="tldr"><h2 class="k2">TL;DR</h2><p>{esc(c["tldr"][0][1])} {esc(c["tldr"][2][1])}</p><h2 class="k2">What I did</h2><p>{esc(c["tldr"][1][1])}</p></div></div>
<ul class="stats">{stats}</ul></div></header>''')
    if c.get("cover"):
        o.append(f'<div class="wrap"><div class="cover{" top" if c.get("cover_fit") == "top" else ""}" style="--tint:{TINT[cid]}">{img(c["cover"], c["cover_alt"], pre, False)}</div></div>')
    if c.get("note"): o.append(f'<p class="wrap note">{esc(c["note"])}</p>')

    S = STORY.get(cid, {})
    n = 0
    def sec(label, title, side, body):
        nonlocal n; n += 1
        o.append(f'<section class="wrap sec"><div class="shead"><div><p class="eyebrow bar">{n:02d} · {esc(label)}</p><h2 class="h2">{esc(title)}</h2></div>{f"<p>{esc(side)}</p>" if side else ""}</div>{body}</section>')
    def fig(f, cap=None): return f'<figure class="fig">{img(f[0], f[1], pre)}<figcaption>{esc(cap or f[1])}</figcaption></figure>'

    # 01 Problem
    body = "".join(f'<p class="lead">{rich(p)}</p>' for p in c["problem"])
    if c.get("quotes"): body += '<ul class="qcards">' + "".join(f'<li>“{esc(q)}”</li>' for q in c["quotes"]) + "</ul>"
    if c.get("problem_img"): body += fig(c["problem_img"], "Before the redesign")
    sec("Problem", S.get("scene", c["tldr"][0][1]), S.get("scene_sub"), body)

    # 02 Goals
    if S.get("goals"):
        sec("Goals", "What it had to do", None, '<ul class="goals">' + "".join(f'<li><p class="k">Goal {k:02d}</p><h3>{esc(g)}</h3><p>{esc(d)}</p></li>' for k, (g, d) in enumerate(S["goals"], 1)) + "</ul>")

    # 03 Solutions
    sols = S.get("solutions") or [(d["title"], d["why"]) for d in c["decisions"]]
    b = ""
    for k, (hl, txt) in enumerate(sols, 1):
        d = c["decisions"][k - 1] if k - 1 < len(c["decisions"]) else {}
        hasimg = bool(d.get("img"))
        b += f'''<article class="phase{" noimg" if not hasimg else ""}"><div class="ptext"><p class="k">Solution {k:02d}</p><h3>{esc(hl)}</h3>
<p class="body">{esc(txt)}</p>{f'<p class="res">{icon("check")} {esc(d["result"])}</p>' if d.get("result") else ""}</div>
{f'<figure>{img(d["img"][0], d["img"][1], pre)}<figcaption>{esc(d["img"][1])}</figcaption></figure>' if hasimg else ""}</article>'''
    sec("Solutions", S.get("solutions_title", "Key decisions"), None, b)

    # 04 Research and design
    r = c.get("research") or {}
    b = ""
    if r.get("findings"): b += '<ul class="cards">' + "".join(f'<li><span class="num">{k:02d}</span><p>{esc(f)}</p></li>' for k, f in enumerate(r["findings"], 1)) + "</ul>"
    if S.get("insight"):
        nm, tx = S["insight"]
        b += f'<div class="insight"><p class="k">Key insight</p><h3>“{esc(nm)}”</h3><p>{esc(tx)}</p></div>'
    if r.get("img"): b += fig(r["img"])
    if S.get("flow_before"):
        def flow(name, steps, foot, cls):
            items = "".join(f'<li><span class="n">{k}</span><div><b>{esc(a)}</b><p>{esc(d)}</p>{f"<em>{esc(tag)}</em>" if tag else ""}</div></li>' for k, (a, d, tag) in enumerate(steps, 1))
            return f'<div class="flow {cls}"><p class="k">{esc(name)}</p><ol>{items}</ol><p class="foot">{esc(foot)}</p></div>'
        b += '<div class="flows">' + flow("Before · the old flow", S["flow_before"], S["flow_before_foot"], "old") + flow("After · the redesigned flow", S["flow_after"], S["flow_after_foot"], "new") + "</div>"
    if S.get("twist"):
        hl, tx = S["twist"]
        b += f'<div class="twist"><p class="k">Plot twist</p><h3>{esc(hl)}</h3><p>{esc(tx)}</p></div>'
    rej = c.get("rejected", [])[1:] if S.get("twist") else c.get("rejected", [])  # the twist already tells the first one
    if rej:
        b += '<h3 class="caps dark sub3">Ideas I dropped</h3><ul class="rej">' + "".join(f'<li><p class="k">Rejected</p><h3>{esc(a)}</h3><p>{esc(w)}</p></li>' for a, w in rej) + "</ul>"
    if b or r.get("text"):
        sec("Research and design", S.get("research_title", "How I got there"), r.get("text"), b)

    # 05 Reflection and outcome
    res = c.get("results") or {}
    b = ""
    if S.get("goal_results"): b += '<ul class="gres">' + "".join(f'<li><p class="k">{esc(g)}</p><b>{esc(v)}</b></li>' for g, v in S["goal_results"]) + "</ul>"
    if res.get("rows"):
        b += '<table><thead><tr><th scope="col">Measure</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>' + "".join(f'<tr><th scope="row">{esc(a)}</th><td>{esc(x) or "<span class=sr>not measured</span>"}</td><td><b>{esc(y)}</b></td></tr>' for a, x, y in res["rows"]) + "</tbody></table>"
    if res.get("note"): b += f'<p class="small">{esc(res["note"])}</p>'
    if res.get("img"): b += fig(res["img"])
    if S.get("lesson"): b += f'<p class="lesson"><b>The lesson:</b> {esc(S["lesson"])}</p>'
    sec("Reflection and outcome", S.get("outcome_title", c["tldr"][2][1]), S.get("outcome_sub"), b)

    # 06 Future scope
    fut = S.get("future") or [(f"Idea {k:02d}", x) for k, x in enumerate(c.get("next", []), 1)]
    if fut:
        sec("Future scope", "Where I'd take it next", "Ideas, not built.", '<ul class="goals">' + "".join(f'<li><p class="k">Future {k:02d}</p><h3>{esc(a)}</h3><p>{esc(x)}</p></li>' for k, (a, x) in enumerate(fut, 1)) + "</ul>")
    if c.get("links"):
        o.append('<p class="wrap links">' + " ".join(f'<a class="pillbtn" href="{esc(u)}" target="_blank" rel="noopener">{esc(l)}<span class="sr"> (opens in a new tab)</span> {icon("arrow")}</a>' for l, u in c["links"]) + "</p>")
    o.append(f'<section class="wrap nextp" aria-labelledby="np"><h2 id="np" class="h2">Next projects</h2><ul class="bento">{"".join(card(x, "half", pre) for x in nxt)}</ul></section>')
    o.append(foot(pre))
    return "\n".join(o)

def main():
    OUT.mkdir(parents=True, exist_ok=True); (OUT / "work").mkdir(exist_ok=True)
    (OUT / "index.html").write_text(home())
    for cid in ORDER: (OUT / "work" / f"{cid}.html").write_text(case(cid))
    shutil.copy(HERE / "site.css", OUT / "site.css")
    for src in used | {"assets/favicon.svg"}:
        d = OUT / src
        if d.resolve() == (ROOT / src).resolve(): continue
        d.parent.mkdir(parents=True, exist_ok=True); shutil.copy(ROOT / src, d)
    print(f"built home + {len(ORDER)} case pages into {OUT}, {len(used)} images")

if __name__ == "__main__":
    main()
