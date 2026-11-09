"""Explanatory diagrams built in HTML/CSS (no image files): scenario comparisons, step flows,
pipelines, funnels, bar charts, feature tables and small UI sketches. Real text, so they stay
sharp, match the site, and screen readers can read them."""
import html

def e(s): return html.escape(str(s), quote=True)

def wrap(kind, title, inner, cap=None):
    return (f'<figure class="viz viz-{kind}"><p class="viz-t">{e(title)}</p>{inner}'
            + (f'<figcaption>{e(cap)}</figcaption>' if cap else "") + "</figure>")

def scenario(title, left, right, cap=None):
    """Two panels side by side, like 'even split vs item split'. Each side:
    dict(label, rows=[(text, tag)], verdict, good=False). tag is optional."""
    def side(s, good):
        rows = "".join(f'<li><span>{e(t)}</span>{f"<em>{e(g)}</em>" if g else ""}</li>' for t, g in s["rows"])
        return (f'<div class="sc {"good" if good else "bad"}"><p class="sc-l">{e(s["label"])}</p>'
                f'<ul>{rows}</ul><p class="sc-v">{e(s["verdict"])}</p></div>')
    return wrap("scenario", title, f'<div class="sc-grid">{side(left, False)}<span class="sc-vs" aria-hidden="true">vs</span>{side(right, True)}</div>', cap)

def steps(title, items, cap=None):
    """Numbered flow left to right: [(label, sub)]."""
    li = "".join(f'<li><span class="st-n">{i}</span><b>{e(a)}</b><span class="st-s">{e(b)}</span></li>' for i, (a, b) in enumerate(items, 1))
    return wrap("steps", title, f'<ol class="st">{li}</ol>', cap)

def pipeline(title, items, end=None, cap=None):
    """Boxes joined by arrows: [(big, label)]; optional end=(big, label) highlighted."""
    allit = items + ([end] if end else [])
    li = "".join(f'<li class="{"end" if end and i == len(allit) - 1 else ""}"><b>{e(a)}</b><span>{e(b)}</span></li>' for i, (a, b) in enumerate(allit))
    return wrap("pipe", title, f'<ol class="pp">{li}</ol>', cap)

def funnel(title, items, cap=None):
    """Narrowing bars: [(value, label)], widths shrink step by step."""
    n = len(items)
    li = "".join(f'<li style="--w:{100 - i * (55 / max(n - 1, 1)):.0f}%"><b>{e(v)}</b><span>{e(l)}</span></li>' for i, (v, l) in enumerate(items))
    return wrap("funnel", title, f'<ol class="fn">{li}</ol>', cap)

def bars(title, items, maxv, ref=None, cap=None, unit=""):
    """Horizontal bars: [(label, value, display, highlight)]. ref=(value, label) draws a marker line."""
    rows = "".join(f'<li class="{"hl" if h else ""}"><span class="bl">{e(l)}</span><span class="bt"><span class="bf" style="width:{v / maxv * 100:.1f}%"></span>'
                   + (f'<span class="ref" style="left:{ref[0] / maxv * 100:.1f}%"></span>' if ref else "")
                   + f'</span><b>{e(d)}{e(unit)}</b></li>' for l, v, d, h in items)
    legend = f'<p class="bref"><span aria-hidden="true"></span>{e(ref[1])}</p>' if ref else ""
    return wrap("bars", title, f'<ul class="br">{rows}</ul>{legend}', cap)

def table(title, cols, rows, cap=None):
    """Feature comparison. Cells: True → yes, False → no, str → as written. First col is the feature."""
    def cell(v, j):
        if v is True: return '<td class="y"><span aria-hidden="true">✓</span><span class="sr">Yes</span></td>'
        if v is False: return '<td class="n"><span aria-hidden="true">—</span><span class="sr">No</span></td>'
        return f'<td class="p">{e(v)}</td>'
    head = "".join(f'<th scope="col"{" class=us" if j == len(cols) - 1 else ""}>{e(c)}</th>' for j, c in enumerate(cols))
    body = "".join(f'<tr><th scope="row">{e(r[0])}</th>' + "".join(cell(v, j) for j, v in enumerate(r[1:])) + "</tr>" for r in rows)
    return wrap("table", title, f'<div class="tw" tabindex="0" role="region" aria-label="{e(title)}"><table class="ft"><thead><tr><th scope="col">Feature</th>{head}</tr></thead><tbody>{body}</tbody></table></div>', cap)

def drift(title, cap=None):
    """Three slightly different buttons vs one component with states."""
    inner = ('<div class="sc-grid"><div class="sc bad"><p class="sc-l">Before: the same button, three ways</p>'
             '<div class="dr"><span class="b1">Save</span><span class="b2">Save</span><span class="b3">Save</span></div>'
             '<p class="sc-v">Small drift, every sprint</p></div><span class="sc-vs" aria-hidden="true">vs</span>'
             '<div class="sc good"><p class="sc-l">After: one component, every state defined</p>'
             '<div class="dr ok"><span>Default</span><span class="hv">Hover</span><span class="fc">Focus</span><span class="ds">Disabled</span><span class="ld">Loading</span></div>'
             '<p class="sc-v">Button / Primary / Medium / Default</p></div></div>')
    return wrap("scenario", title, inner, cap)

def anatomy(title, parts, cap=None):
    li = '<span class="an-s" aria-hidden="true">/</span>'.join(f'<span class="an"><b>{e(a)}</b><small>{e(b)}</small></span>' for a, b in parts)
    return wrap("anatomy", title, f'<div class="anat">{li}</div>', cap)

def menu(title, cap=None):
    """IRS2Go home: 7 equal menu items vs 3 clear choices."""
    old = "".join('<span class="mi"></span>' for _ in range(7))
    new = "".join(f'<span class="mc">{e(x)}</span>' for x in ["Refunds", "Payments", "Tax Help"])
    inner = (f'<div class="sc-grid"><div class="sc bad"><p class="sc-l">Old home screen</p><div class="mn">{old}</div><p class="sc-v">7 equal menu items</p></div>'
             f'<span class="sc-vs" aria-hidden="true">vs</span><div class="sc good"><p class="sc-l">Redesigned home screen</p><div class="mn new">{new}</div><p class="sc-v">3 clear choices</p></div></div>')
    return wrap("scenario", title, inner, cap)

def render(spec):
    spec = dict(spec); kind = spec.pop("kind")
    return {"scenario": scenario, "steps": steps, "pipeline": pipeline, "funnel": funnel, "bars": bars,
            "table": table, "drift": drift, "anatomy": anatomy, "menu": menu}[kind](**spec)

CSS = """
/* ---------- explanatory diagrams ---------- */
.viz{background:#fff;border:1px solid var(--line);border-radius:24px;padding:28px 30px;margin:24px 0}
.viz-t{font-family:var(--display);font-stretch:85%;font-weight:800;font-size:20px;line-height:1.15;margin-bottom:20px}
.viz figcaption{font-size:13px;color:var(--mute);margin-top:16px;display:flex;gap:8px}
.viz figcaption::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--brand);margin-top:7px;flex:none}
.sc-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:stretch}
.sc{border-radius:18px;padding:20px 22px;display:flex;flex-direction:column}
.sc.bad{background:#F6F5F3;border:1.5px dashed #C9C7C2}
.sc.good{background:var(--brand-soft);border:1.5px solid var(--brand)}
.sc-l{font-size:11.5px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:var(--ink2);margin-bottom:12px}
.sc ul{display:grid;gap:8px;flex:1}
.sc li{display:flex;justify-content:space-between;gap:10px;align-items:center;background:#fff;border-radius:10px;padding:9px 12px;font-size:14.5px}
.sc li em{font-style:normal;font-size:10.5px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;border-radius:99px;padding:2px 8px;white-space:nowrap}
.sc.bad li em{background:#FBE4DE;color:#8E2E17}
.sc.good li em{background:var(--brand);color:#fff}
.sc-v{margin-top:14px;font-family:var(--display);font-stretch:85%;font-weight:800;font-size:19px;line-height:1.15}
.sc.good .sc-v{color:var(--brand-ink)}
.sc-vs{align-self:center;font-family:var(--display);font-weight:900;font-size:18px;color:var(--mute);text-transform:uppercase}
.st{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:12px;counter-reset:s}
.st li{position:relative;background:var(--brand-soft);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:4px}
.st li:not(:last-child)::after{content:"→";position:absolute;right:-12px;top:22px;font-weight:800;color:var(--brand-ink);z-index:1}
.st-n{width:28px;height:28px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;font-size:12.5px;font-weight:800;margin-bottom:6px}
.st b{font-size:15px;line-height:1.25}
.st-s{font-size:13.5px;color:var(--ink2)}
.pp{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch}
.pp li{flex:1 1 140px;position:relative;border:1.5px solid var(--line);border-radius:16px;padding:14px 16px;background:#FAFAF8}
.pp li:not(:last-child)::after{content:"→";position:absolute;right:-11px;top:50%;transform:translateY(-50%);font-weight:800;color:var(--mute);background:#fff;line-height:1}
.pp b{display:block;font-family:var(--display);font-stretch:80%;font-weight:800;font-size:24px;line-height:1.05}
.pp span{font-size:13.5px;color:var(--ink2)}
.pp li.end{background:var(--brand);border-color:var(--brand);color:#fff}
.pp li.end span{color:#fff}
.fn{display:grid;gap:8px}
.fn li{width:var(--w);min-width:240px;background:var(--brand-soft);border-left:4px solid var(--brand);border-radius:0 12px 12px 0;padding:10px 16px;display:flex;gap:14px;align-items:baseline}
.fn li:last-child{background:var(--brand);color:#fff}
.fn b{font-family:var(--display);font-stretch:80%;font-weight:800;font-size:24px;min-width:64px}
.fn span{font-size:14.5px}
.br{display:grid;gap:12px}
.br li{display:grid;grid-template-columns:170px 1fr 72px;gap:14px;align-items:center}
.bl{font-size:14px;color:var(--ink2)}
.bt{position:relative;height:28px;background:#F1F0EC;border-radius:8px}
.bf{position:absolute;inset:0 auto 0 0;background:#BDB8F7;border-radius:8px}
.br li.hl .bf{background:var(--brand)}
.ref{position:absolute;top:-4px;bottom:-4px;width:2px;background:var(--ink)}
.br b{font-family:var(--display);font-stretch:80%;font-weight:800;font-size:20px}
.bref{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink2);margin-top:12px}
.bref span{width:2px;height:16px;background:var(--ink)}
.tw{overflow-x:auto}
.ft{width:100%;border-collapse:collapse;border:0;border-radius:0}
.ft th,.ft td{padding:12px 14px;border-bottom:1px solid var(--line);font-size:14.5px;text-align:left}
.ft thead th{font-size:11.5px;font-weight:800;letter-spacing:.9px;text-transform:uppercase;color:var(--ink2);background:none}
.ft thead th.us{color:var(--brand-ink)}
.ft td.y{color:#17633E;font-weight:800;font-size:17px}
.ft td.n{color:var(--mute)}
.ft td.p{font-size:13.5px;color:var(--ink2)}
.ft td:last-child{background:var(--brand-soft)}
.dr{display:flex;flex-wrap:wrap;gap:10px;flex:1;align-content:flex-start}
.dr span{font-size:13.5px;font-weight:600;color:#fff;background:var(--ink);padding:8px 16px}
.dr .b1{border-radius:6px}.dr .b2{border-radius:14px;padding:10px 20px;background:#2A2A30}.dr .b3{border-radius:3px;padding:6px 12px;font-size:12.5px}
.dr.ok span{border-radius:10px;background:var(--brand)}
.dr.ok .hv{background:var(--brand-ink)}
.dr.ok .fc{outline:3px solid var(--ink);outline-offset:2px}
.dr.ok .ds{background:#D9D6F5;color:var(--ink2)}
.dr.ok .ld{background:var(--brand);opacity:1}
.dr.ok .ld::before{content:"◌ ";}
.anat{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.an{display:flex;flex-direction:column;background:var(--brand-soft);border-radius:12px;padding:10px 16px}
.an b{font-family:var(--display);font-stretch:85%;font-weight:800;font-size:20px}
.an small{font-size:12px;color:var(--ink2)}
.an-s{font-size:26px;color:var(--mute);font-weight:300}
.mn{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;flex:1;align-content:flex-start}
.mi{height:46px;border-radius:10px;background:#fff;border:1px solid #DAD8D3}
.mn.new{grid-template-columns:1fr}
.mc{background:#fff;border-radius:12px;padding:14px;font-weight:700;border:1.5px solid var(--brand)}
@media (max-width:860px){
  .viz{padding:20px}
  .sc-grid{grid-template-columns:1fr}.sc-vs{justify-self:center}
  .st{grid-auto-flow:row}.st li:not(:last-child)::after{content:"↓";right:auto;left:50%;top:auto;bottom:-14px}
  .br li{grid-template-columns:1fr 64px}.bl{grid-column:1/-1}
  .pp li:not(:last-child)::after{display:none}
}
"""
