#!/usr/bin/env python3
"""Builds the minimal portfolio: index.html + work/<id>.html + site.css into an output folder.

    python3 build.py OUT_DIR [ASSET_ROOT]

ASSET_ROOT is the repo root that holds assets/ and cases/img/. Only the images
the pages use are copied, so the output folder works on its own.
"""
import html, re, shutil, sys
from pathlib import Path
from content import SITE, HOW, TOOLS, WORDS, EXPERIENCE, PROJECTS, SIDE, CASES, ORDER

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/preview")
ROOT = Path(sys.argv[2] if len(sys.argv) > 2 else Path(__file__).resolve().parents[2])
HERE = Path(__file__).resolve().parent
used = set()
import hashlib
CSSV = hashlib.md5((HERE / "site.css").read_bytes()).hexdigest()[:8]  # cache-busting: browsers fetch the new file when it changes

def esc(s): return html.escape(s, quote=True)
def rich(s):
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    return re.sub(r"(?<![*\w])\*(?!\*)(.+?)\*(?!\w)", r"<em>\1</em>", s)
def plain(s): return re.sub(r"\*+", "", s)
def img(src, alt, pre, cls="", lazy=True):
    used.add(src)
    return f'<img src="{pre}{esc(src)}" alt="{esc(alt)}"{" loading=\"lazy\"" if lazy else ""}{f" class=\"{cls}\"" if cls else ""} decoding="async">'

FONT = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400..600;1,14..32,400..600&display=swap" rel="stylesheet">'

def head(title, desc, pre):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(desc)}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<link rel="icon" href="{pre}assets/favicon.svg">{FONT}<link rel="stylesheet" href="{pre}site.css?v={CSSV}"></head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="topbar wrap"><a class="me" href="{pre}index.html">{esc(SITE["name"])}</a>
<nav aria-label="Main"><a href="{pre}index.html#work">Experience</a><a href="{pre}index.html#projects">Projects</a><a href="{pre}index.html#about">About</a><a href="{pre}{SITE["resume"]}" data-resume download="Siddhi-Manche-Resume.pdf">Resume</a><a href="mailto:{SITE["email"]}">Contact</a></nav></header>
<main id="main" tabindex="-1">'''

def foot(pre):
    return f'''</main>
<footer class="wrap foot" id="contact">
  <h2 class="lets">Let’s <em>talk</em>.</h2>
  <p class="mail"><a href="mailto:{SITE["email"]}">{SITE["email"]}</a></p>
  <ul class="links"><li><a href="{SITE["linkedin"]}" target="_blank" rel="noopener">LinkedIn<span class="sr"> (opens in a new tab)</span></a></li><li><a href="{SITE["github"]}" target="_blank" rel="noopener">GitHub<span class="sr"> (opens in a new tab)</span></a></li><li><a href="{pre}{SITE["resume"]}" data-resume download="Siddhi-Manche-Resume.pdf">Resume<span class="sr"> (PDF)</span></a></li></ul>
  <p class="fine">Designed and built by Siddhi Manche, with an AI coding assistant. © 2026</p>
</footer>
<script>fetch("{pre}{SITE["resume"]}",{{method:"HEAD"}}).then(function(r){{if(!r.ok)throw 0}}).catch(function(){{document.querySelectorAll("[data-resume]").forEach(function(a){{(a.closest("li")||a).hidden=true}})}});</script>
</body></html>'''

def tags(ts): return '<ul class="tags">' + "".join(f"<li>{esc(t)}</li>" for t in ts) + "</ul>"

# ---------------- home ----------------
def card(cid, big=False):
    c = CASES[cid]
    if c.get("cover"):
        vis = f'<div class="vis{" top" if c.get("cover_fit") == "top" else ""}">{img(c["cover"], c["cover_alt"], "")}</div>'
    else:
        n, l = c.get("cover_text", ("", ""))
        vis = f'<div class="vis type" aria-hidden="true"><b>{esc(n)}</b><span>{esc(l)}</span></div>'
    return f'''<li class="card{" big" if big else ""}"><a href="work/{cid}.html">{vis}
<p class="eyebrow">{esc(c["org"])} · {esc(c["year"])}</p><h3>{esc(c["card"])}</h3><p class="line">{esc(c["line"])}</p></a>{tags(c["tags"])}</li>'''

def tile(c, pre=""):
    if c.get("cover"):
        return f'<div class="vis{" top" if c.get("cover_fit") == "top" else ""}">{img(c["cover"], c["cover_alt"], pre)}</div>'
    n, l = c.get("cover_text", ("", ""))
    return f'<div class="vis type" aria-hidden="true"><b>{esc(n)}</b><span>{esc(l)}</span></div>'

def exp(cid):
    c = CASES[cid]
    return f'''<li class="job"><a href="work/{cid}.html"><p class="when">{esc(c["dates"])}</p>
<div class="what"><p class="eyebrow">{esc(c["role"])} · {esc(c["org"])}</p><h3>{esc(c["card"])}</h3><p class="line">{esc(c["line"])}</p></div>
{tile(c)}</a>{tags(c["tags"])}</li>'''

def home():
    pre = ""
    rows = "".join(f'''<li><a href="work/{cid}.html"><span class="yr">{esc(CASES[cid]["year"])}</span><span class="t">{esc(CASES[cid]["card"])}{' <span class="pill">building</span>' if CASES[cid].get("status") == "building" else ""}{' <span class="pill">concept</span>' if CASES[cid]["org"] == "Concept" else ""}</span><span class="l">{esc(CASES[cid]["line"])}</span><span class="arr" aria-hidden="true">→</span></a></li>''' for cid in SIDE)
    how = "".join(f'<li><span class="n">0{i+1}</span><h3>{esc(a)}</h3><p>{esc(b)}</p></li>' for i, (a, b) in enumerate(HOW))
    tools = "".join(f'<div><h3>{esc(g)}</h3><ul>' + "".join(f"<li>{esc(x)}</li>" for x in xs) + "</ul></div>" for g, xs in TOOLS)
    words = "".join(f'<figure><blockquote>“{esc(q)}”</blockquote><figcaption><b>{esc(n)}</b>{esc(t)}</figcaption></figure>' for q, n, t in WORDS)
    intro = "".join(f"<p>{rich(p)}</p>" for p in SITE["intro"])
    return head(f'{SITE["name"]} · {SITE["role"]}', plain(SITE["title"]) + " " + plain(SITE["intro"][1]), pre) + f'''
<section class="wrap hero" aria-labelledby="h">
  <div class="who">{img(SITE["photo"], "Siddhi Manche", "", lazy=False)}<p class="kicker">{esc(SITE["name"])}<br>{esc(SITE["role"])}</p></div>
  <h1 id="h">{rich(SITE["title"])}</h1>
  <div class="intro">{intro}</div>
  <p class="status"><span class="dot" aria-hidden="true"></span>{esc(SITE["status"])}</p>
</section>
<section class="wrap" id="work" aria-labelledby="xp">
  <div class="shead"><h2 id="xp">Experience <sup>({len(EXPERIENCE):02d})</sup></h2><p>Roles I was hired for, newest first.</p></div>
  <ul class="jobs">{"".join(exp(c) for c in EXPERIENCE)}</ul>
</section>
<section class="wrap" id="projects" aria-labelledby="pj">
  <div class="shead"><h2 id="pj">Projects <sup>({len(PROJECTS) + len(SIDE):02d})</sup></h2><p>Academic research projects, and things I build on my own.</p></div>
  <ul class="grid">{card(PROJECTS[0], True)}{"".join(card(c) for c in PROJECTS[1:])}</ul>
  <ul class="rows side">{rows}</ul>
</section>
<section class="wrap" id="about" aria-labelledby="hw">
  <div class="shead"><h2 id="hw">How I work</h2><p>Every project, the same order.</p></div>
  <ol class="how">{how}</ol>
  <div class="tools"><h3 class="sub">Tools I use</h3><div class="tgrid">{tools}</div></div>
</section>
<section class="wrap" aria-labelledby="ws">
  <div class="shead"><h2 id="ws">Kind words</h2></div>
  <div class="words">{words}</div>
</section>''' + foot(pre)

# ---------------- case ----------------
def case(cid):
    c, pre = CASES[cid], "../"
    i = ORDER.index(cid); nxt = ORDER[(i + 1) % len(ORDER)]
    out = [head(f'{plain(c["title"])} · {SITE["name"]}', c["tldr"][0][1] + " " + c["tldr"][2][1], pre)]
    out.append(f'''<article class="case">
<header class="wrap chead"><a class="back" href="../index.html#{'work' if cid in EXPERIENCE else 'projects'}"><span aria-hidden="true">←</span> All work</a>
<p class="eyebrow">{esc(c["org"])} · {esc(c["year"])} · {esc(c["kind"])}</p>
<h1>{rich(c["title"])}</h1>
<dl class="meta">{"".join(f"<div><dt>{esc(k)}</dt><dd>{esc(v)}</dd></div>" for k, v in c["meta"])}</dl></header>''')
    if c.get("cover"):
        out.append(f'<div class="wrap cover{" top" if c.get("cover_fit") == "top" else ""}">{img(c["cover"], c["cover_alt"], pre, lazy=False)}</div>')
    out.append('<section class="wrap tldr" aria-label="Summary"><dl>' + "".join(f"<div><dt>{esc(k)}</dt><dd>{esc(v)}</dd></div>" for k, v in c["tldr"]) + "</dl></section>")
    if c.get("metrics"):
        out.append('<section class="wrap nums" aria-label="Key numbers"><ul>' + "".join(f'<li><b>{esc(v)}</b><span>{esc(l)}</span></li>' for v, l in c["metrics"]) + "</ul></section>")
    if c.get("note"):
        out.append(f'<p class="wrap note">{esc(c["note"])}</p>')

    n = 0
    def sec(title, body):
        nonlocal n; n += 1
        out.append(f'<section class="wrap block"><h2><span>{n:02d}</span>{esc(title)}</h2><div class="body">{body}</div></section>')

    body = "".join(f"<p>{rich(p)}</p>" for p in c["problem"])
    if c.get("problem_img"): body += f'<figure class="fig">{img(c["problem_img"][0], c["problem_img"][1], pre)}<figcaption>Before</figcaption></figure>'
    if c.get("quotes"): body += '<ul class="quotes">' + "".join(f"<li>“{esc(q)}”</li>" for q in c["quotes"]) + "</ul>"
    sec("The problem", body)

    r = c.get("research")
    if r:
        b = f"<p>{rich(r['text'])}</p>"
        if r.get("findings"): b += '<h3 class="sub">What we found</h3><ul class="dots">' + "".join(f"<li>{esc(f)}</li>" for f in r["findings"]) + "</ul>"
        if r.get("img"): b += f'<figure class="fig">{img(r["img"][0], r["img"][1], pre)}</figure>'
        sec("Research", b)

    b = ""
    for k, d in enumerate(c["decisions"], 1):
        b += f'<div class="dec"><h3><span>{k}</span>{esc(d["title"])}</h3>'
        if d.get("img"): b += f'<figure class="fig">{img(d["img"][0], d["img"][1], pre)}</figure>'
        b += f'<p class="why"><b>Why</b>{esc(d["why"])}</p>'
        if d.get("result"): b += f'<p class="res"><span aria-hidden="true">✓</span> {esc(d["result"])}</p>'
        b += "</div>"
    sec("Key decisions", b)

    if c.get("rejected"):
        sec("What I rejected, and why", '<ul class="rej">' + "".join(f'<li><p class="tag">Rejected</p><p class="idea">{esc(a)}</p><p>{esc(w)}</p></li>' for a, w in c["rejected"]) + "</ul>")

    res = c.get("results")
    if res and (res.get("rows") or res.get("note") or res.get("img")):
        b = ""
        if res.get("rows"):
            b += '<table><thead><tr><th scope="col">Measure</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>' + "".join(f'<tr><th scope="row">{esc(a)}</th><td>{esc(x) or "<span class=sr>not measured</span>"}</td><td><b>{esc(y)}</b></td></tr>' for a, x, y in res["rows"]) + "</tbody></table>"
        if res.get("note"): b += f'<p class="small">{esc(res["note"])}</p>'
        if res.get("img"): b += f'<figure class="fig">{img(res["img"][0], res["img"][1], pre)}</figure>'
        sec("Results", b)

    if c.get("next"):
        sec("If I took it further", '<p class="label">Ideas, not built</p><ul class="dots">' + "".join(f"<li>{esc(x)}</li>" for x in c["next"]) + "</ul>")
    if c.get("links"):
        out.append('<p class="wrap more">' + " ".join(f'<a href="{esc(u)}" target="_blank" rel="noopener">{esc(l)}<span class="sr"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a>' for l, u in c["links"]) + "</p>")
    nc = CASES[nxt]
    out.append(f'<nav class="wrap nextp" aria-label="Next project"><a href="{nxt}.html"><span>Next project</span><b>{esc(nc["card"])}</b><span aria-hidden="true" class="arr">→</span></a></nav></article>')
    out.append(foot(pre))
    return "\n".join(out)

def main():
    OUT.mkdir(parents=True, exist_ok=True); (OUT / "work").mkdir(exist_ok=True)
    (OUT / "index.html").write_text(home())
    for cid in ORDER: (OUT / "work" / f"{cid}.html").write_text(case(cid))
    shutil.copy(HERE / "site.css", OUT / "site.css")
    for src in used:
        d = OUT / src
        if d.resolve() == (ROOT / src).resolve(): continue
        d.parent.mkdir(parents=True, exist_ok=True); shutil.copy(ROOT / src, d)
    print(f"built {len(ORDER)} case pages + home into {OUT}, {len(used)} images")

if __name__ == "__main__":
    main()
