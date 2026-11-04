"""Builds cases/*.html in the workflow-run style.

Edit the content in cases_content.py, then run:
    python3 site-src/cases-src/build_cases.py
"""
import html, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from cases_content import CASES, ORDER

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
KIND = {"ai": "k-ai", "hum": "k-hum", "ok": "k-ok", "": ""}


def esc(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    return re.sub(r"(?<![*\w])\*(?!\*)(.+?)\*(?!\w)", r"<em>\1</em>", s)


def att(s):
    return html.escape(s, quote=True)


def img(src, alt, cls=""):
    return f'<img src="{att(src)}" alt="{att(alt)}" loading="lazy"{f" class={cls}" if cls else ""}>'


def block(b):
    t = b[0]
    if t == "p":
        return f"<p>{esc(b[1])}</p>"
    if t == "why":
        return f'<div class="why"><b>{esc(b[2] if len(b) > 2 else "Why")}</b><span>{esc(b[1])}</span></div>'
    if t == "bul":
        return '<ul class="bul">' + "".join(f"<li>{esc(x)}</li>" for x in b[1]) + "</ul>"
    if t == "flow":
        return '<ol class="flowlist">' + "".join(f"<li><span>{esc(x)}</span></li>" for x in b[1]) + "</ol>"
    if t == "stats":
        return '<div class="stats">' + "".join(f'<div class="metric"><b>{esc(v)}</b><span>{esc(l)}</span></div>' for v, l in b[1]) + "</div>"
    if t == "quotes":
        return '<div class="quotes">' + "".join(f"<blockquote>{esc(q)}</blockquote>" for q in b[1]) + "</div>"
    if t == "fig":
        return f'<figure class="fig">{img(b[1], b[2])}<figcaption>{esc(b[3])}</figcaption></figure>'
    if t == "pair":
        return pair(b[1])
    if t == "chips":
        return '<div class="chips2">' + "".join(f"<span>{esc(x)}</span>" for x in b[1]) + "</div>"
    if t == "table":
        head = "".join(f"<th>{esc(h)}</th>" for h in b[1])
        rows = "".join("<tr>" + "".join(f"<td>{esc(c)}</td>" for c in r) + "</tr>" for r in b[2])
        return f'<table class="table"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'
    if t == "term":
        out = []
        for c, line in b[1]:
            out.append(f'<div><span class="p">{"$ " if c == "cmd" else "› "}</span><span class="{c}">{esc(line)}</span></div>')
        return '<div class="term">' + "".join(out) + "</div>"
    if t == "follow":
        pts = "".join(f"<li>{esc(p)}</li>" for p in b[2])
        im = img(b[3], b[4]) if len(b) > 3 and b[3] else ""
        return f'<div class="follow"><b class="t">{esc(b[1]).upper()}</b><ul>{pts}</ul>{im}</div>'
    if t == "bars":
        rows = []
        for label, val, mx, disp, alt in b[1]:
            w = f"{100 * val / mx:.1f}%"
            rows.append(f'<div><span>{esc(label)}</span><i class="{"alt" if alt else ""}" data-w="{w}"></i><em>{esc(disp)}</em></div>')
        return '<div class="bars">' + "".join(rows) + "</div>"
    if t == "cards":
        return '<div class="cards">' + "".join(f"<div><h3>{esc(h)}</h3><p>{esc(p)}</p></div>" for h, p in b[1]) + "</div>"
    if t == "queued":
        return '<div class="cards queued">' + "".join(f'<div><span class="t">queued · not built yet</span><h3>{esc(h)}</h3><p>{esc(p)}</p></div>' for h, p in b[1]) + "</div>"
    if t == "decs":
        return '<div class="decs">' + "".join(dec(d) for d in b[1]) + "</div>"
    raise ValueError(t)


def pair(items):
    return '<div class="pair">' + "".join(f"<figure>{img(s, a)}<figcaption>{esc(c)}</figcaption></figure>" for s, a, c in items) + "</div>"


def dec(d):
    top = f'<div class="dtop"><span>{esc(d.get("tag", "decision"))}</span>'
    if d.get("badge"):
        top += f'<span class="st {d["badge"]}">{esc(d.get("badge_text", d["badge"]))}</span>'
    top += "</div>"
    inst = f'<p class="inst"><b>instead of</b>{esc(d["instead"])}</p>' if d.get("instead") else ""
    res = ""
    if d.get("result") or d.get("principle"):
        res = '<div class="res">'
        if d.get("principle"):
            res += f'<span class="principle">{esc(d["principle"])}</span>'
        if d.get("result"):
            res += f'<p>{esc(d["result"])}</p>'
        res += "</div>"
    media = ""
    if d.get("img"):
        media = img(d["img"][0], d["img"][1])
    if d.get("pair"):
        media = pair(d["pair"])
    return f'<div class="dec" data-reveal><div>{top}<h3>{esc(d["title"])}</h3><p>{esc(d["text"])}</p>{inst}</div>{res}{media}</div>'


def page(c):
    cid = c["id"]
    i = ORDER.index(cid)
    prev_c, next_c = CASES[ORDER[i - 1]], CASES[ORDER[(i + 1) % len(ORDER)]]
    pipe = "".join(
        f'<li><a href="#{s["id"]}" class="{KIND[s.get("k", "")]}"><small>{i2 + 1:02d} · {esc(s["node"])}</small>{esc(s["label"])}</a></li>'
        for i2, s in enumerate(c["steps"])
    )
    steps = ""
    for i2, s in enumerate(c["steps"]):
        body = "".join(block(b) for b in s["blocks"])
        steps += (
            f'<section class="step {KIND[s.get("k", "")]}" id="{s["id"]}">'
            f'<div class="node"><span class="chip"><i>{i2 + 1:02d}</i>{esc(s["node"])}{" · AI" if s.get("k") == "ai" else " · me" if s.get("k") == "hum" else ""}</span><p>{esc(s.get("side", ""))}</p></div>'
            f'<div class="body" data-reveal><h2>{esc(s["title"])}</h2>{body}</div></section>'
        )
    metrics = "".join(f'<div class="metric"><b>{esc(v)}</b><span>{esc(l)}</span></div>' for v, l in c["metrics"])
    meta = "".join(f'<div><dt class="lbl">{esc(k)}</dt><dd>{esc(v)}</dd></div>' for k, v in c["meta"])
    links = "".join(f'<a class="ghost" href="{att(u)}" target="_blank" rel="noopener">{esc(l)} ↗</a>' for l, u in c.get("links", []))
    hero_img = f'<div class="himg">{img(c["hero"][0], c["hero"][1])}</div>' if c.get("hero") else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1280">
<title>{esc(c["seo_title"])} | Siddhi Manche</title>
<meta name="description" content="{att(c["lede"])}">
<link rel="canonical" href="https://siddhidesign.github.io/Portfolio/cases/{cid}.html">
<meta property="og:title" content="{att(c["seo_title"])} | Siddhi Manche">
<meta property="og:description" content="{att(c["lede"])}">
<link rel="icon" href="../assets/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400..700;1,14..32,400..700&family=Martian+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/run-case.css?v=1">
<style>:root{{--c:{c["color"]}}}</style>
<script src="../js/run-case.js?v=1"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="progress"></div>
<header class="bar">
  <nav class="crumb" aria-label="Breadcrumb"><a href="../index.html">siddhi</a><span class="s">/</span><a href="../index.html#runs">runs</a><span class="s">/</span><span class="id">#{esc(c["code"])}</span></nav>
  <nav class="tabs"><a href="../index.html#top">Workflow</a><a href="../index.html#runs">Runs</a><a href="../index.html#story">Versions</a><a href="../index.html#pipeline">Pipeline</a><a href="../index.html#rules">Rules</a></nav>
  <div class="tools"><button class="ibtn" id="themeBtn" aria-label="Toggle dark mode" title="Dark mode"><svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button><a class="cta" href="../index.html#contact">Start a run →</a></div>
</header>
<main id="main" class="wrap">
  <section class="rhero">
    <div>
      <div class="rtop"><span class="code">#{esc(c["code"])}</span><span>run {i + 1:02d} of {len(ORDER):02d}</span><span class="st {c["status"]}">{esc(c["status"])}</span><span>{esc(c["kind"])}</span></div>
      <h1>{esc(c["title"])}</h1>
      <p class="lede">{esc(c["lede"])}</p>
      <div class="fromto"><div><small>input · the problem</small><p>{esc(c["inp"])}</p></div><div class="ar">→</div><div><small>output · the result</small><p>{esc(c["out"])}</p></div></div>
      {f'<p class="note">{esc(c["note"])}</p>' if c.get("note") else ""}
    </div>
    <div>
      {hero_img}
      <div class="metrics">{metrics}</div>
      <dl class="meta">{meta}</dl>
      {f'<div class="links">{links}</div>' if links else ""}
    </div>
  </section>
  <nav class="pipe" aria-label="Steps of this run"><ol>{pipe}</ol></nav>
  {steps}
  <nav class="next" aria-label="More runs">
    <a href="{prev_c["id"]}.html"><small>← previous run · #{esc(prev_c["code"])}</small><b>{esc(prev_c["short"])}</b></a>
    <a href="{next_c["id"]}.html" style="text-align:right"><small>next run · #{esc(next_c["code"])} →</small><b>{esc(next_c["short"])}</b></a>
  </nav>
  <footer><span>© 2026 Siddhi Manche · Designed by me, built with an AI coding assistant</span><span><a href="mailto:manche.siddhi@gmail.com">Email</a> · <a href="https://www.linkedin.com/in/siddhi-manche/" target="_blank" rel="noopener">LinkedIn</a> · <a href="https://github.com/Siddhidesign" target="_blank" rel="noopener">GitHub</a></span><a class="ghost" href="../index.html#runs">All runs</a></footer>
</main>
</body>
</html>
"""


if __name__ == "__main__":
    for cid in ORDER:
        out = os.path.join(ROOT, "cases", cid + ".html")
        open(out, "w").write(page(CASES[cid]))
        print("wrote", out)
