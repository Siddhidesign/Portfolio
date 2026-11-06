import { useEffect, useRef, useState } from "react";
import { HERO, PROFILE, SOURCES, HERO_THEMES } from "../data";
import { reducedMotion } from "../hooks/useHooks";
import { Stat } from "./Stat";

/** Renders "[ai]word[/ai]" and "[hum]word[/hum]" as colored italics */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[ai\].*?\[\/ai\]|\[hum\].*?\[\/hum\])/g);
  return <>{parts.map((p, i) => p.startsWith("[ai]") ? <em key={i} className="t-ai">{p.slice(4, -5)}</em>
    : p.startsWith("[hum]") ? <em key={i} className="t-hum">{p.slice(5, -6)}</em> : <span key={i}>{p}</span>)}</>;
}

/** Which theme a packet belongs to. */
const themeOf = (t: string) => (/order|broken|out of order|waited|Tax|SSN/.test(t) ? 0 : /card|payment|bounce|spend|friends/.test(t) ? 1 : 2);
/** How many of the example quotes and findings in this diagram fall under each theme. Derived from SOURCES, never invented. */
export const THEME_TOTALS = HERO_THEMES.map((_, k) => SOURCES.flatMap((s) => s.packets).filter((p) => themeOf(p.t) === k).length);

/* The hero canvas: research packets travel from sources into the AI node,
   themes get counted, a human check stamps them, and a result comes out. */
export default function Hero() {
  const cv = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  // The totals are shown from the first paint. Packets arriving only flash the theme they land in.
  const counts = THEME_TOTALS;
  const [bump, setBump] = useState(-1);
  const [stamp, setStamp] = useState(false);
  const [hit, setHit] = useState("");

  useEffect(() => {
    const c = cv.current!, s = svg.current!;
    const node = (id: string) => c.querySelector<HTMLElement>(`[data-id="${id}"]`)!;
    const box = (el: HTMLElement) => { const r0 = c.getBoundingClientRect(), r = el.getBoundingClientRect(); return { x: r.left - r0.left, y: r.top - r0.top, w: r.width, h: r.height }; };
    const paths: Record<string, SVGPathElement> = {};
    const edges: [string, string][] = [...SOURCES.map((x) => [x.id, "ai"] as [string, string]), ["ai", "hum"], ["hum", "out"]];
    const draw = () => {
      s.innerHTML = "";
      edges.forEach(([a, b]) => {
        const A = box(node(a)), B = box(node(b));
        let d: string;
        if (a === "ai" && b === "hum") d = `M${A.x + A.w / 2},${A.y + A.h} L${B.x + B.w / 2},${B.y}`;
        else { const x1 = A.x + A.w, y1 = A.y + A.h / 2, x2 = B.x, y2 = B.y + B.h / 2; d = `M${x1},${y1} C${x1 + 70},${y1} ${x2 - 70},${y2} ${x2},${y2}`; }
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", d); p.setAttribute("class", "wire"); s.appendChild(p); paths[a + b] = p;
      });
    };
    draw(); addEventListener("resize", draw);
    const still = reducedMotion();
    const live: HTMLElement[] = [];
    const fly = (key: string, text: string, cls: string, dur: number, done?: () => void) => {
      const p = paths[key]; if (!p) return; const L = p.getTotalLength(); const el = document.createElement("div");
      el.className = "packet " + cls; el.textContent = text; c.appendChild(el); live.push(el); const t0 = performance.now();
      const step = (t: number) => { const k = Math.min(1, (t - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, pt = p.getPointAtLength(e * L);
        el.style.left = pt.x + "px"; el.style.top = pt.y + "px"; if (k < 1) requestAnimationFrame(step); else { el.remove(); done?.(); } };
      requestAnimationFrame(step);
    };
    let i = 0, running = true;
    const tick = () => {
      if (!running || document.hidden) return;
      const src = SOURCES[i % SOURCES.length], pk = src.packets[Math.floor(i / SOURCES.length) % src.packets.length];
      setHit(src.id); setTimeout(() => setHit(""), 400);
      fly(src.id + "ai", pk.t, pk.kind, 1700, () => {
        const ti = themeOf(pk.t);
        setBump(ti); setTimeout(() => setBump(-1), 250);
        if (i % 3 === 0) fly("aihum", "theme →", "theme-p", 900, () => { setStamp(true); setTimeout(() => setStamp(false), 700); fly("humout", "verified", "ver", 1300); });
      });
      i++;
    };
    const id = still ? 0 : setInterval(tick, 800); if (!still) tick();
    return () => { running = false; clearInterval(id); removeEventListener("resize", draw); live.forEach((e) => e.remove()); };
  }, []);

  const tops = [56, 172, 288, 404];
  return (
    <section className="hero wrap" id="top">
      <div data-reveal className="in">
        <span className="tag">{HERO.kicker}</span>
        <h1><Rich text={HERO.title} /></h1>
        <p className="lede">{HERO.lede}</p>
        <div className="hstats">{HERO.stats.map(([b, l]) => <Stat key={l} v={b} l={l} />)}</div>
        <div className="me"><img src={PROFILE.photo} alt={PROFILE.photoAlt} onError={(e) => (e.currentTarget.style.display = "none")} /><div><b>{PROFILE.name}</b><span>M.S. Human-Centered Design · UM-Dearborn</span></div></div>
      </div>
      <div className="canvas" ref={cv} role="img" aria-label={`Diagram of how every project works. Data comes in: ${SOURCES.map((s) => `${s.big} ${s.label}`).join("; ")}. AI tags and clusters themes: ${HERO_THEMES.map((t, k) => `${t}, ${THEME_TOTALS[k]} examples`).join("; ")}. I verify every theme against the raw data. Output: 27% fewer order errors, shipped.`}>
        <div className="hd"><span>workflow.run · how every project works</span><span>live</span></div>
        <svg className="wires" ref={svg} aria-hidden="true" />
        {SOURCES.map((s, k) => (
          <div key={s.id} className={`node src ${hit === s.id ? "hit" : ""}`} data-id={s.id} style={{ left: 22, top: tops[k] }}>
            <small>data in</small><b>{s.big}</b><div className="l">{s.label}</div>
          </div>
        ))}
        <div className="node ai" data-id="ai" style={{ left: 250, top: 150 }}>
          <small><span className="spin">✦</span> AI · analyze</small>Tags and clusters themes
          {HERO_THEMES.map((t, k) => <div className="theme" key={t}><span>{t}</span><i className={bump === k ? "bump" : ""}>{counts[k]}</i></div>)}
        </div>
        <div className="node hum" data-id="hum" style={{ left: 250, top: 366 }}><small>me · verify</small>Every theme checked against the raw data<div className={`stamp ${stamp ? "show" : ""}`}>checked</div></div>
        <div className="node out" data-id="out" style={{ left: 498, top: 262 }}><small>output · shipped</small><b>27%</b><div className="l">fewer order errors</div></div>
        <div className="legend"><span><i style={{ background: "var(--card)", boxShadow: "0 0 0 1px var(--line)" }} />real quote</span><span><i style={{ background: "var(--ink)" }} />research finding</span></div>
      </div>
    </section>
  );
}
