import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import {
  FLIGHTS, PIPES, RUN_STATUS, EV_FOLLOWUP, QUEUED, VERSIONS, PROBLEM, RUNLOG, RECORDER, WORDS, SKILL_GROUPS, INFO,
  CONTACT, PROFILE, PURPOSE, type Flight,
} from "../data";
import { useClock, useInView } from "../hooks/useHooks";
import ControlTower from "./ControlTower";
import { Rich } from "./Hero";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function Reveal({ children, delay = 0, className = "", style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.12);
  return <div ref={ref} data-reveal className={`${className} ${seen ? "in" : ""}`} style={{ ...style, ["--d" as any]: `${delay}s` }}>{children}</div>;
}
function Head({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
  return (<><Reveal><span className="tag">{tag}</span></Reveal><Reveal delay={0.06}><h2><Rich text={title} /></h2></Reveal>{sub && <Reveal delay={0.12}><p className="sub">{sub}</p></Reveal>}</>);
}

/* ---------------- run log: types itself out ---------------- */
export function RunLog() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4);
  const [shown, setShown] = useState<{ c: string; t: string }[]>([]);
  useEffect(() => {
    if (!seen) return; let li = 0, ci = 0; let timer = 0;
    const step = () => {
      if (li >= RUNLOG.length) return;
      const [c, t] = RUNLOG[li]; ci++;
      setShown((s) => { const n = s.slice(0, li); n[li] = { c, t: t.slice(0, ci) }; return n; });
      if (ci >= t.length) { li++; ci = 0; timer = window.setTimeout(step, 260); } else timer = window.setTimeout(step, 16);
    };
    step(); return () => clearTimeout(timer);
  }, [seen]);
  return (
    <div className="wrap" ref={ref}>
      <div className="log" aria-label="Run log of the EV review analysis">
        {shown.map((l, i) => <div key={i}><span className="p">{l.c === "cmd" ? "$ " : "› "}</span><span className={l.c}>{l.t}</span></div>)}
        <span className="cursor" />
      </div>
    </div>
  );
}

/* ---------------- version history: the career story ---------------- */
export function Versions() {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  return (
    <section className="sec wrap" id="story">
      <Head tag="pipeline · version history" title="Same designer, [ai]four[/ai] versions." sub="I didn’t start with AI. Each version kept what the last one learned." />
      <Reveal delay={0.15}><div className="problem"><b>THE PROBLEM</b><p>{PROBLEM}</p></div></Reveal>
      <div className="commits" ref={ref}>
        <div className="fill" style={{ height: seen ? "calc(100% - 20px)" : 0 }} />
        {[...VERSIONS].reverse().map((v, i) => (
          <Reveal key={v.v} delay={0.1 * i} className={`commit ${i === 0 ? "head" : ""}`}>
            <div className="v">{v.v}<span>{v.years}</span><em className="vt" style={{ fontStyle: "normal" }}>{i === 0 ? "HEAD" : v.tag}</em></div>
            <div><h3>{v.title}</h3><p className="msg">"{v.msg}"</p><p className="learn">{v.learned}</p></div>
            <div className="st"><b>{v.stat[0]}</b><span>{v.stat[1]}</span></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- data in: research volume + AI/human split ---------------- */
function Counter({ n, plus, run }: { n: number; plus: boolean; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => { if (!run) return; const t0 = performance.now(); let raf = 0;
    const step = () => { const p = Math.min(1, (performance.now() - t0) / 1400); setV(Math.round(n * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf); }, [n, run]);
  return <b>{v.toLocaleString("en-US")}{plus ? "+" : ""}</b>;
}
export function DataIn() {
  const [ref, seen] = useInView<HTMLDivElement>(0.25);
  const [step, setStep] = useState(1);
  const st = RECORDER.steps[step];
  const counters = RECORDER.counters.map((c, i) => (i === 0 ? { ...c, n: 16767, plus: false, label: "EV driver reviews in one dataset, cleaned in Google Colab" } : c));
  return (
    <section className="sec wrap" id="pipeline">
      <Head tag="pipeline · data in" title="Research first, at [ai]any scale[/ai]." sub="AI does the heavy reading across large sets. I set the questions, check every finding, and turn it into the problem worth solving." />
      <div className="srcgrid" ref={ref}>
        <Reveal className="counters">
          {counters.map((c, i) => i === 0 ? (
            <a key={c.label} className="c feat" href="#n-ev"><Counter n={c.n} plus={c.plus} run={seen} /><span>{c.label}</span><em>{c.src} · see the run →</em></a>
          ) : (<div key={c.label} className="c"><Counter n={c.n} plus={c.plus} run={seen} /><span>{c.label}</span><em>{c.src}</em></div>))}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="steps">
            {RECORDER.steps.map((x, i) => (
              <button key={x.k} className={i === step ? "on" : ""} onClick={() => setStep(i)}><span>{String(i + 1).padStart(2, "0")}</span>{x.k.toLowerCase()}{x.ai && <i>AI</i>}</button>
            ))}
          </div>
          <div className="stepcard" key={step}>
            <div className="split">
              <div className={`who ai ${st.ai ? "" : "none"}`}><small>AI DOES</small><p>{st.ai || "Nothing. This step is mine."}</p></div>
              <div className="who me"><small>I DO</small><p>{st.me}</p></div>
            </div>
            <p className="ex"><b>FROM MY WORK</b>{st.ex}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- runs: overview grid ---------------- */
export function RunsGrid() {
  return (
    <section className="sec wrap" id="runs">
      <Head tag={`runs · ${FLIGHTS.length} projects`} title="Every project is a [ai]run[/ai]." sub="The same pipeline every time: data in, analysis, a human check, design, then a number. Open a run to see each step." />
      <div className="runs">
        {FLIGHTS.map((f, i) => (
          <Reveal key={f.id} delay={0.05 * i} style={{ display: "flex" }}>
            <a className="run" href={`#n-${f.id}`} style={{ flex: 1 }}>
              <div className="top"><span>#{f.code.replace(" ", "-")}</span><span className={`st ${RUN_STATUS[f.id]}`}>{RUN_STATUS[f.id]}</span></div>
              <h3>{f.title}</h3>
              <div className="mini">{PIPES[f.id].map((n, k) => (<span key={k} style={{ display: "contents" }}>{k > 0 && <em />}<span className={n[2]}>{n[0].toLowerCase()}</span></span>))}</div>
              <div className="metric"><b>{f.stats[0][0]}</b><span>{f.stats[0][1]}</span></div>
            </a>
          </Reveal>
        ))}
        <Reveal delay={0.4} style={{ display: "flex" }}>
          <div className="run queued" style={{ flex: 1 }}>
            <div className="top"><span>#{QUEUED.code}</span><span className="st queued">{QUEUED.status}</span></div>
            <h3>{QUEUED.title}</h3>
            <p>{QUEUED.desc}</p>
            <div className="mini">{QUEUED.pipe.map((n, k) => (<span key={k} style={{ display: "contents" }}>{k > 0 && <em />}<span className={n === "agent" ? "ai" : n === "approve" ? "hum" : ""}>{n}</span></span>))}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- runs: stacked detail deck ---------------- */
export function RunsDeck({ onRail }: { onRail: (on: boolean, active: number) => void }) {
  const deckRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const deck = deckRef.current!;
    const slots = [...deck.querySelectorAll<HTMLElement>(":scope > .slot")];
    const lifts = slots.map((s) => s.querySelector<HTMLElement>(".lift")!);
    const dims = lifts.map((l) => l.querySelector<HTMLElement>(".dim"));
    const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const G = { top: 0, h: 1 };
    const measure = () => {
      G.h = slots[0].getBoundingClientRect().height || innerHeight; G.top = deck.getBoundingClientRect().top + scrollY;
      lifts.forEach((l) => { const f = l.querySelector<HTMLElement>(".fit"); if (f) l.style.setProperty("--fit", String(clamp((innerHeight - 110) / f.offsetHeight, 0.6, 1))); });
    };
    const slotTop = (k: number, y: number) => Math.min(Math.max(70 + k * 6, G.top + k * G.h - y), G.top + (slots.length - 1) * G.h - y);
    const onScroll = () => {
      const y = scrollY, vh = innerHeight, n = slots.length, H = G.h; let act = 0;
      for (let i = 0; i < n; i++) {
        const p = i < n - 1 && !still() ? clamp(1 - (slotTop(i + 1, y) - 70) / H, 0, 1) : 0;
        const k = i + 3, f = k < n ? clamp((slotTop(k, y) - 70 - k * 6) / (H - k * 6), 0, 1) : 1;
        slots[i].style.opacity = f < 1 ? f.toFixed(3) : ""; slots[i].classList.toggle("gone", f <= 0);
        lifts[i].style.transform = p > 0 ? `translateY(${-p * 3}vh) scale(${1 - p * 0.07}) rotate(${(i % 2 ? 1 : -1) * p * 1.4}deg)` : "";
        if (dims[i]) dims[i]!.style.opacity = p > 0 ? (p * 0.4).toFixed(3) : "";
        if (slotTop(i, y) <= vh * 0.5) act = i;
      }
      const dt = G.top - y, db = dt + n * G.h; onRail(dt < vh * 0.5 && db > vh * 0.6, act);
    };
    let tick = false; const sc = () => { if (!tick) { tick = true; requestAnimationFrame(() => { onScroll(); tick = false; }); } };
    const rs = () => { measure(); onScroll(); };
    measure(); onScroll(); addEventListener("scroll", sc, { passive: true }); addEventListener("resize", rs); addEventListener("load", rs);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("print"); io.unobserve(e.target); } }), { threshold: 0.45 });
    lifts.forEach((l) => io.observe(l));
    return () => { removeEventListener("scroll", sc); removeEventListener("resize", rs); removeEventListener("load", rs); io.disconnect(); };
  }, [onRail]);
  return (
    <div className="deck wrap" ref={deckRef}>
      {FLIGHTS.map((f, i) => (
        <section className="slot" id={`n-${f.id}`} key={f.id} style={{ ["--i" as any]: i }} aria-label={f.title}>
          <div className="lift"><div className="fit"><RunDetail f={f} i={i} /></div></div>
        </section>
      ))}
    </div>
  );
}
function RunDetail({ f, i }: { f: Flight; i: number }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <article className="detail" style={{ ["--c" as any]: f.color }}>
      <i className="dim" />
      <div>
        <div className="d-top"><span className="code">#{f.code.replace(" ", "-")}</span><span>run {pad(i + 1)} of {pad(FLIGHTS.length)}</span><span className={`st ${RUN_STATUS[f.id]}`}>{RUN_STATUS[f.id]}</span></div>
        <h3>{f.title}</h3>
        <div className="d-tag">{f.tagline}</div>
        <div className="fromto"><div><small>input · the problem</small><p>{f.from}</p></div><div className="ar">→</div><div><small>output · the result</small><p>{f.to}</p></div></div>
        <p className="d-desc">{f.desc}</p>
        <div className="flow">{PIPES[f.id].map((n, k) => <div key={k} className={`n ${n[2]}`} style={{ ["--k" as any]: k }}><small>{n[0]}{n[2] === "ai" ? " · AI" : n[2] === "hum" ? " · me" : ""}</small>{n[1]}</div>)}</div>
        {f.id === "ev" && <div className="followup"><b>{EV_FOLLOWUP.label.toUpperCase()}</b><ul>{EV_FOLLOWUP.points.map((p) => <li key={p}>{p}</li>)}</ul></div>}
        <div className="methods">{f.methods.map((m) => <span key={m}>{m}</span>)}</div>
      </div>
      <aside className="d-side">
        {f.image && <div className={`d-img ${f.image.endsWith(".svg") ? "logo" : ""}`}><img src={f.image} alt="" loading="lazy" onError={(e) => e.currentTarget.parentElement!.remove()} /></div>}
        {f.stats.slice(0, 2).map(([v, l]) => <div className="dstat" key={l}><b>{v}</b><span>{l}</span></div>)}
        <a className="cta" href={f.link} target="_blank" rel="noopener">Open the full case study →</a>
      </aside>
    </article>
  );
}

/* ---------------- rules engine ---------------- */
export function Rules() {
  return (
    <section className="sec wrap" id="rules">
      <Head tag="rules engine · UX laws" title="Rules I design by, [hum]tested[/hum]." sub="Try each rule yourself, then see the real project where it was applied and what happened." />
      <Reveal delay={0.15}><ControlTower /></Reveal>
    </section>
  );
}

/* ---------------- approvals ---------------- */
export function Approvals() {
  return (
    <section className="sec wrap" id="approvals">
      <Head tag="approvals · from people I worked with" title="Signed off by the [ai]team[/ai]." />
      <div className="approvals">
        {WORDS.map((w, i) => (
          <Reveal key={w.name} delay={0.1 * i} className="appr">
            <div className="top"><span>#{w.stamp}-review</span><span className="st shipped">approved</span></div>
            <p className="q">“{w.quote}”</p>
            <div className="by"><span className="ok">✓</span><div><b>{w.name}</b><span>{w.title}</span></div></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- integrations ---------------- */
export function Integrations() {
  return (
    <section className="sec wrap" id="integrations">
      <Head tag="integrations · methods and tools" title="What I run [ai]with[/ai]." />
      <div className="integ">
        {SKILL_GROUPS.map((g, i) => (
          <Reveal key={g.label} delay={0.06 * i} className="ig" style={{ ["--c" as any]: g.color }}>
            <h4><i />{g.label}</h4><div className="chips">{g.items.map((s) => <span key={s}>{s}</span>)}</div>
          </Reveal>
        ))}
      </div>
      <div className="edu">
        {INFO.flatMap((b) => b.items.map(([t, d]) => (<Reveal key={t}><small>{b.title}</small><b>{t}</b><span>{d}</span></Reveal>)))}
      </div>
    </section>
  );
}

/* ---------------- start a run: contact ---------------- */
const CHANNELS: [string, string][] = [["Email", CONTACT.email], ["LinkedIn", "siddhi-manche"], ["GitHub", "Siddhidesign"]];
export function StartRun() {
  const [pur, setPur] = useState(0), [ch, setCh] = useState(0), [ran, setRan] = useState(false), [copied, setCopied] = useState(false);
  const clock = useClock();
  const url = [`mailto:${CONTACT.email}?subject=${encodeURIComponent(PURPOSE[pur][0] + ": from your portfolio")}`, CONTACT.linkedin, CONTACT.github][ch];
  return (
    <section className="sec wrap" id="contact">
      <Head tag="start a run · contact" title="Let’s start a [hum]run[/hum]." sub="Open to UX research and product design roles at data-driven teams, especially B2B workflow tools, across the US. I reply within one working day." />
      <div className="start">
        <Reveal className="panel">
          <h4>1 · PURPOSE</h4>
          <div className="opts">{PURPOSE.map(([a, b], i) => <button key={a} className={`opt ${i === pur ? "on" : ""}`} onClick={() => { setPur(i); setRan(false); }}><b>{a}</b><span>{b}</span></button>)}</div>
          <h4>2 · CHANNEL</h4>
          <div className="opts">{CHANNELS.map(([a, b], i) => <button key={a} className={`opt ${i === ch ? "on" : ""}`} onClick={() => { setCh(i); setRan(false); }}><b>{a}</b><span style={{ wordBreak: "break-all" }}>{b}</span></button>)}</div>
          <button className="runbtn" onClick={() => setRan(true)}>▶ Run</button>
        </Reveal>
        <Reveal delay={0.1} className="out">
          <div><span className="p">$ </span>start-run --purpose {PURPOSE[pur][0].toLowerCase()} --via {CHANNELS[ch][0].toLowerCase()}</div>
          {ran ? (<>
            <div><span className="p">› </span>routing to Siddhi Manche…</div>
            <div className="ok">› ready. <a href={url} target="_blank" rel="noopener">open {CHANNELS[ch][0]} →</a></div>
            <div><span className="p">› </span>{CHANNELS[ch][1]}</div>
          </>) : <div className="p">› waiting for ▶ Run</div>}
          <div className="links">
            <a href={`mailto:${CONTACT.email}`}>Email</a>
            <button onClick={() => { navigator.clipboard?.writeText(CONTACT.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {}); }}>{copied ? "Copied ✓" : "Copy email"}</button>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a href={CONTACT.github} target="_blank" rel="noopener">GitHub</a>
          </div>
        </Reveal>
      </div>
      <footer><span>Designed and built by {PROFILE.name}, with an AI coding assistant. © {new Date().getFullYear()}</span><span className="clk">{clock} ET</span><a className="ghost" href="#top">Back to top ↑</a></footer>
    </section>
  );
}
