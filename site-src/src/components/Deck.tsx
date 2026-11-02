import { useEffect, useMemo, useRef, useState } from "react";
import { FLIGHTS, PROFILE, PROCESS, HERO_STATS, PILLARS, DESTINATION, type Flight, type Pillar } from "../data";
import { sound } from "../hooks/useSound";
import { useClock } from "../hooks/useHooks";
import { Plane, Routes, SplitFlap, Kicker } from "./Shared";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const STATUS = { board: ["BOARDING", "board-s"], landed: ["LANDED", "landed"], ontime: ["ON TIME", "ontime"] } as const;

/* =========================================================
   The stacked deck: hero pass, departures board, then one
   sticky slot per flight. Each new card slides over the last,
   which sinks, tilts and dims. Same mechanics as the reference.
   ========================================================= */
export default function Deck({ onRail }: { onRail: (on: boolean, active: number) => void }) {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const deck = deckRef.current!;
    const slots = [...deck.querySelectorAll<HTMLElement>(":scope > .slot")];
    const lifts = slots.map((s) => s.querySelector<HTMLElement>(".lift")!);
    const dims = lifts.map((l) => [...l.querySelectorAll<HTMLElement>(".dim")]);
    const feat = deck.querySelector<HTMLElement>(".feat");
    const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const G = { top: 0, h: 1 };
    const measure = () => {
      G.h = slots[0].getBoundingClientRect().height || innerHeight;
      G.top = deck.getBoundingClientRect().top + scrollY;
      lifts.forEach((l) => { const inner = l.querySelector<HTMLElement>(".fit"); if (!inner) return;
        l.style.setProperty("--fit", String(clamp((innerHeight - 110) / inner.offsetHeight, 0.6, 1))); });
    };
    const slotTop = (k: number, y: number) => Math.min(Math.max(k * 5, G.top + k * G.h - y), G.top + (slots.length - 1) * G.h - y);

    const onScroll = () => {
      const y = scrollY, vh = innerHeight, n = slots.length, H = G.h; let act = 0;
      for (let i = 0; i < n; i++) {
        const p = i < n - 1 && !still() ? clamp(1 - slotTop(i + 1, y) / H, 0, 1) : 0;   // how covered this card is
        const k = i + 3, f = k < n ? clamp((slotTop(k, y) - k * 5) / (H - k * 5), 0, 1) : 1; // fade once 3 cards cover it
        const S = slots[i]; S.style.opacity = f < 1 ? f.toFixed(3) : ""; S.classList.toggle("hide-slot", f <= 0);
        const L = lifts[i];
        L.style.transform = p > 0 ? `translateY(${-p * 3}vh) scale(${1 - p * 0.08}) rotate(${(i % 2 ? 1 : -1) * p * 1.8}deg)` : "";
        dims[i].forEach((d) => (d.style.opacity = p > 0 ? (p * 0.45).toFixed(3) : ""));
        if (i === 0 && feat) feat.style.opacity = p > 0 ? (1 - p).toFixed(3) : "";
        if (slotTop(i, y) <= vh * 0.5) act = i;
      }
      const dt = G.top - y, db = dt + n * G.h;
      onRail(dt < vh * 0.4 && db > vh * 0.6, act);
    };

    let ticking = false;
    const sc = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } };
    const rs = () => { measure(); onScroll(); };
    measure(); onScroll();
    addEventListener("scroll", sc, { passive: true }); addEventListener("resize", rs); addEventListener("load", rs);

    // print the route lines the first time each card is half visible
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("print"); io.unobserve(e.target); } }), { threshold: 0.5 });
    lifts.forEach((l) => io.observe(l));

    // specular light follows the cursor across each card
    const move = (e: MouseEvent) => { const el = (e.target as HTMLElement).closest<HTMLElement>(".face,.ticket"); if (!el) return;
      const r = el.getBoundingClientRect(); el.style.setProperty("--sx", ((e.clientX - r.left) / r.width) * 100 + "%"); el.style.setProperty("--sy", ((e.clientY - r.top) / r.height) * 100 + "%"); };
    deck.addEventListener("mousemove", move);
    return () => { removeEventListener("scroll", sc); removeEventListener("resize", rs); removeEventListener("load", rs); io.disconnect(); deck.removeEventListener("mousemove", move); };
  }, [onRail]);

  return (
    <div className="deck" ref={deckRef}>
      <section className="slot hero" id="top" style={{ ["--i" as any]: 0 }}><div className="lift"><div className="fit"><BoardingPass /></div></div></section>
      <section className="slot board-slot" id="route" style={{ ["--i" as any]: 1 }}><div className="lift"><div className="fit"><Itinerary /></div></div></section>
      <section className="slot board-slot" id="work" style={{ ["--i" as any]: 2 }}><div className="lift"><div className="fit"><Departures /></div></div></section>
      {FLIGHTS.map((f, i) => (
        <section className="slot" id={`n-${f.id}`} key={f.id} style={{ ["--i" as any]: i + 3 }} aria-label={f.title}>
          <div className="lift"><div className="fit"><Ticket f={f} i={i} /></div></div>
        </section>
      ))}
    </div>
  );
}

/* ---------------- Hero boarding pass ---------------- */
function BoardingPass() {
  const [flipped, setFlipped] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [msg, setMsg] = useState(false);
  const clock = useClock();
  const micro = "SIDDHI MANCHE · DEV ✈ WORKFLOW DESIGN ✈ AI RESEARCH ✈ AGENTIC AI UX · B2B WORKFLOW OPTIMIZATION · ".repeat(12);
  const bars = useMemo(() => { let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    return Array.from({ length: 58 }, () => ({ w: 1 + Math.floor(r() * 3.2), m: r() > 0.6 ? 2 : 0 })); }, []);

  const flip = () => { setFlipped((f) => !f); sound.tone(500, 0.12); sound.tone(700, 0.12, 0.1); };
  const scan = () => { setScanning(false); requestAnimationFrame(() => setScanning(true)); sound.tone(1800, 0.08, 0, "square", 0.04);
    setTimeout(() => { setMsg(true); sound.tone(1200, 0.12); sound.tone(1600, 0.18, 0.12); }, 1300); setTimeout(() => { setMsg(false); setScanning(false); }, 4200); };
  useEffect(() => { const k = (e: KeyboardEvent) => { if ((e.key === "f" || e.key === "F") && !(e.target as HTMLElement).closest("input,textarea")) flip(); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);

  return (
    <>
      <div className="pass-scene">
        <div className={`pass ${flipped ? "flipped" : ""} ${scanning ? "scanning" : ""}`}>
          <div className="scanbar" />
          <div className="face front">
            <i className="dim" /><i className="spec" />
            <div className="airline-band" />
            <div className="micro t">{micro}</div><div className="micro b">{micro}</div>
            <div className="main">
              <Routes seed={1} />
              <div className="serial mono in-seq d1">SM&nbsp;2026</div>
              <div className="porthole in-seq" title="Hover to lower the shade">
                <div className="glass">
                  <div className="cloud" style={{ width: 90, height: 26, top: "22%", animationDuration: "16s" }} />
                  <div className="cloud" style={{ width: 60, height: 18, top: "48%", animationDuration: "22s", animationDelay: "-8s" }} />
                  <div className="cloud" style={{ width: 120, height: 30, top: "70%", animationDuration: "28s", animationDelay: "-14s" }} />
                  <div className="initials">SM</div>
                  <img src={PROFILE.photo} alt={PROFILE.photoAlt} onError={(e) => e.currentTarget.remove()} />
                  <div className="shade" />
                </div>
                <div className="specimen">BOARDING</div>
              </div>
              <div className="details">
                <div className="role in-seq d1">{PROFILE.role}</div>
                <h1 className="name in-seq d2">{PROFILE.name}</h1>
                <div className="route in-seq d2">
                  <div className="ap"><b>{PROFILE.from.code}</b><span>{PROFILE.from.city}</span></div>
                  <div className="path"><Plane rot={90} /></div>
                  <div className="ap"><b>{PROFILE.to.code}</b><span>{PROFILE.to.city}</span></div>
                </div>
                <p className="promise in-seq d3">{PROFILE.headline}</p>
                <div className="fields in-seq d3">
                  {HERO_STATS.map(([v, l]) => { const [k, rest] = l.split(": "); return <div className="field" key={l} title={rest}><small>{k}</small><b>{v}</b><em>{rest}</em></div>; })}
                </div>
                <div className="sig in-seq">{PROFILE.name}</div>
                <div className="sig-line in-seq d4">VIA WORKFLOW DESIGN AND AI RESEARCH. VALID FOR B2B ACROSS THE US.</div>
                <div className="cta-row in-seq d5">
                  <button className="btn" onClick={scan}>Scan pass</button>
                  <button className="btn solid" onClick={flip}>Turn over</button>
                </div>
              </div>
            </div>
            <div className="stub in-seq">
              <div className="holo"><Plane /></div>
              <h4>BOARDING PASS</h4>
              <div><h4>PASSENGER</h4><div style={{ font: "400 20px var(--f-sign)" }}>{PROFILE.surnameFirst}</div></div>
              <div className="grid2"><div><h4>FROM</h4><div className="big">{PROFILE.from.code}</div></div><div><h4>TO</h4><div className="big">{PROFILE.to.code}</div></div></div>
              <div><h4>VIA</h4><div style={{ font: "400 18px var(--f-mono)" }}>WFD ✈ UXR</div></div>
              <div className="grid2"><div><h4>BOARDS</h4><div style={{ font: "400 18px var(--f-mono)" }}>NOW</div></div><div><h4>FOCUS</h4><div style={{ font: "400 18px var(--f-mono)" }}>B2B</div></div></div>
              <div className="barcode">{bars.map((b, i) => <i key={i} style={{ width: b.w, marginRight: b.m }} />)}</div>
            </div>
          </div>
          <div className="face back">
            <i className="dim" />
            <div className="fine">
              <div>
                <h3>How I fly</h3>
                <ol>{PROCESS.map(([t, d]) => <li key={t}><b>{t}.</b> {d}</li>)}</ol>
                <button className="btn solid" style={{ marginTop: 22 }} onClick={flip}>Turn back</button>
              </div>
              <div className="allow">
                <h4 className="mono" style={{ fontSize: 12, letterSpacing: 2, color: "var(--muted)", marginBottom: 10 }}>THE ROUTE</h4>
                <div className="pp-routes">{PILLARS.map((p) => <p key={p.id} style={{ ["--c" as any]: p.color }}><b>{p.code} · {p.label}</b>{p.line}</p>)}</div>
                <h4 className="mono" style={{ fontSize: 12, letterSpacing: 2, color: "var(--muted)", margin: "14px 0 6px" }}>BAGGAGE ALLOWANCE</h4>
                <ul>
                  <li><span>Order errors cut, Jai Hind</span><b>27%</b></li>
                  <li><span>Systems replaced</span><b>5 → 1</b></li>
                  <li><span>Library components, FindMe</span><b>25+</b></li>
                  <li><span>IRS2Go SUS score</span><b>31.3 → 78.25</b></li>
                  <li><span>Testers who fully trusted the AI</span><b>6 of 8</b></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={`scan-msg ${msg ? "show" : ""}`}>✓ PASS VALID · {PROFILE.status.toUpperCase()}</div>
      </div>
      <div className="feat">
        <div className="chip"><span><i className="dot" />Status</span><b>Open to work</b></div>
        <div className="chip"><span>Flights on board</span><b>{FLIGHTS.length}</b></div>
        <div className="chip"><span>Eastern time</span><b>{clock}</b></div>
      </div>
    </>
  );
}

/* ---------------- The route: developer to agentic AI UX ---------------- */
function Itinerary() {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(ref.current!); return () => io.disconnect(); }, []);
  return (
    <div ref={ref} className={`itin ${go ? "go" : ""}`}>
      <div className="board-title">
        <div><Kicker gate="A" label="Itinerary" /><h2 className="h2">From developer to agentic AI UX</h2></div>
        <p className="itin-lede">I didn’t start with AI. I started by building websites, then learned workflows on the shop floor, then studied research in depth. AI made each of those stronger.</p>
      </div>
      <div className="legs">
        <div className="legpath"><i /><svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)" /></svg></div>
        {PILLARS.map((p, i) => (
          <a key={p.id} className="leg" href="#work" style={{ ["--c" as any]: p.color, ["--d" as any]: `${0.25 + i * 0.35}s` }}>
            <div className="leg-top"><span className="leg-n">LEG {i + 1}</span><span className="leg-y">{p.years}</span></div>
            <div className="leg-code">{p.code}</div>
            <div className="leg-label">{p.label}</div>
            <p className="leg-line">{p.line}</p>
            <p className="leg-learned"><b>LEARNED</b>{p.learned}</p>
            <div className="leg-stat"><b>{p.stat[0]}</b><span>{p.stat[1]}</span></div>
          </a>
        ))}
      </div>
      <div className="dest"><span>FINAL DESTINATION</span><b>{DESTINATION}</b></div>
    </div>
  );
}

/* ---------------- Departures board ---------------- */
function Departures() {
  const clock = useClock();
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [route, setRoute] = useState<Pillar | "all">("all");
  useEffect(() => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(ref.current!); return () => io.disconnect(); }, []);
  return (
    <div ref={ref}>
      <i className="dim" style={{ borderRadius: 28, zIndex: 20 }} />
      <div className="board-title">
        <div><Kicker gate="A" label="Departures" /><h2 className="h2">Every flight on the route</h2></div>
        <div className="routes-pick">
          <button className={route === "all" ? "on" : ""} onClick={() => { setRoute("all"); sound.click(); }}><b>All flights</b><span>In story order</span></button>
          {PILLARS.map((p) => (
            <button key={p.id} className={route === p.id ? "on" : ""} style={{ ["--c" as any]: p.color }} onClick={() => { setRoute(p.id); sound.click(); }}>
              <b><i />{p.code} · {p.label}</b><span>{p.years}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="board" style={{ position: "relative" }}>
        <div className="board-head"><h3>DEPARTURES</h3><div className="clock">{clock}</div></div>
        <div className="brow head"><span>FLIGHT</span><span>DESTINATION</span><span>LEG</span><span>GATE</span><span>STATUS</span></div>
        {FLIGHTS.map((f) => (
          <a key={f.id} className={`brow ${f.status === "board" ? "hl" : ""} ${route !== "all" && !f.pillars.includes(route) ? "off" : ""}`} href={`#n-${f.id}`} onMouseEnter={sound.click}>
            <SplitFlap text={f.code.replace(" ", "")} len={6} run={run} />
            <SplitFlap text={f.title.replace(/[^A-Za-z0-9 -]/g, "")} len={22} run={run} />
            <span className="pills">{f.pillars.map((p) => { const P = PILLARS.find((x) => x.id === p)!; return <em key={p} style={{ ["--c" as any]: P.color }}>{P.short}</em>; })}</span>
            <SplitFlap text={f.gate} len={3} run={run} />
            <span className={`status ${STATUS[f.status][1]}`}>{STATUS[f.status][0]}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------------- One flight = one project ---------------- */
function Ticket({ f, i }: { f: Flight; i: number }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <article className="ticket" style={{ ["--c" as any]: f.color }}>
      <i className="dim" /><i className="spec" />
      <div className="t-main">
        <Routes seed={i + 3} />
        <div className="gate"><small>GATE</small><b>{f.gate}</b></div>
        <div className="t-top"><span className="code">{f.code}</span><span>{pad(i + 1)} / {pad(FLIGHTS.length)}</span><span className="tag">{f.type.toUpperCase()}</span>{f.pillars.map((p) => { const P = PILLARS.find((x) => x.id === p)!; return <span key={p} className="ptag" style={{ ["--pc" as any]: P.color }}>{P.short}</span>; })}</div>
        <h3 className="t-title">{f.title}</h3>
        <div className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{f.tagline}</div>
        <div className="t-route">
          <div className="p"><span className="lbl">Departed from</span>{f.from}</div>
          <div className="arr">✈</div>
          <div className="p"><span className="lbl">Landed at</span>{f.to}</div>
        </div>
        <p className="t-desc">{f.desc}</p>
        <div className="methods">{f.methods.map((m) => <span key={m}>{m}</span>)}</div>
      </div>
      <aside className="t-stub">
        {f.image && <div className={`t-img ${f.image.endsWith(".svg") ? "logo" : ""}`}><img src={f.image} alt="" loading="lazy" onError={(e) => e.currentTarget.parentElement!.remove()} /></div>}
        {f.stats.slice(0, 3).map(([v, l]) => <div className="stat" key={l}><b>{v}</b><span>{l}</span></div>)}
        <a className="btn" href={f.link} target="_blank" rel="noopener">Board this case study →</a>
      </aside>
    </article>
  );
}
