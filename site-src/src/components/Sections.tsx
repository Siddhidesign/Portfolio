import { useEffect, useRef, useState } from "react";
import { AIRLINES, TOOLS, LOG, WORDS, THOUGHTS, STAMPS, BAGS, SKILL_GROUPS, INFO, PURPOSE, SEATS, CONTACT, PROFILE } from "../data";
import { sound } from "../hooks/useSound";
import { useClock, useInView } from "../hooks/useHooks";
import { Kicker, Reveal, SplitFlap } from "./Shared";
import ControlTower from "./ControlTower";

const pad = (n: number, l = 2) => String(n).padStart(l, "0");

function Head({ gate, label, title, lede }: { gate: string; label: string; title: string; lede?: string }) {
  return (<>
    <Reveal><Kicker gate={gate} label={label} /></Reveal>
    <Reveal delay={0.08}><h2 className="h2">{title}</h2></Reveal>
    {lede && <Reveal delay={0.16}><p className="lede">{lede}</p></Reveal>}
  </>);
}

/* ---------- Airlines flown (worked at) ---------- */
export function Airlines() {
  return (
    <section id="clearing"><div className="wrap">
      <Head gate="B" label="Airlines flown" title="Worked at" />
      <div className="airlines">
        {AIRLINES.map((a, i) => (
          <Reveal className="al" delay={0.08 * i} key={a.name + a.date}>
            {i === 0 && <span className="now">LATEST</span>}
            <div className="n">{pad(i + 1)}</div><h4>{a.name}</h4><p>{a.role}</p><p style={{ fontSize: 13, marginTop: 6 }}>{a.note}</p><div className="d">{a.date}</div>
          </Reveal>
        ))}
      </div>
      <Reveal className="instruments" delay={0.2}>
        <span className="lbl">COCKPIT TOOLS</span>
        {TOOLS.map((t, i) => <div className="gauge" key={t} style={{ ["--a" as any]: `${(i * 47) % 180 - 60}deg` }}><span>{t}</span></div>)}
      </Reveal>
    </div></section>
  );
}

/* ---------- Flight log (story): rows print one by one ---------- */
export function FlightLog() {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const [printed, setPrinted] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (!seen || printed >= LOG.length) return;
    const t = setTimeout(() => { setPrinted((p) => p + 1); sound.tone(900, 0.03, 0, "square", 0.02); }, printed === 0 ? 200 : 420);
    return () => clearTimeout(t);
  }, [seen, printed]);
  return (
    <section id="story"><div className="wrap">
      <Head gate="C" label="Flight log" title="Developer, then workflows, then research, then AI" lede="Every leg prints as you reach it. Open a line for the story behind it." />
      <Reveal className="logbook" delay={0.2}>
        <div className="lb-head">
          <div><small>Pilot</small><b>{PROFILE.name}</b></div><div><small>First departure</small><b>Mumbai</b></div>
          <div><small>Next destination</small><b>Agentic AI UX, B2B</b></div><div><small>Status</small><b style={{ color: "var(--sign)" }}>In flight</b></div>
        </div>
        <div className="lb-row" style={{ cursor: "default", font: "400 11px var(--f-mono)", letterSpacing: 1.6, color: "var(--muted)" }}><span>DATE</span><span>LEG</span><span style={{ textAlign: "right" }}>MILES EARNED</span><span /></div>
        <div ref={ref}>
          {LOG.map((l, i) => (
            <div key={l.leg}>
              <div className={`lb-row ${i < printed ? "inked" : "pending"} ${open === i ? "open" : ""}`} onClick={() => { setOpen(open === i ? null : i); sound.click(); }}>
                <span className="dt">{l.date}</span><span className="pt"><b>{l.leg}</b><span>{l.where}</span></span><span className="mi">{l.miles}</span><span className="tg">+</span>
              </div>
              <div className="lb-story" style={{ maxHeight: open === i ? 220 : 0 }}><h5>{l.leg}</h5><p>{l.story}</p></div>
            </div>
          ))}
        </div>
      </Reveal>
    </div></section>
  );
}

export function Lab() {
  return (
    <section id="laws"><div className="wrap">
      <Head gate="D" label="Control tower" title="UX laws, tested live" lede="Six principles I design by. Try each one, then see the real project where I used it and what testing showed." />
      <Reveal delay={0.2}><ControlTower /></Reveal>
    </div></section>
  );
}

/* ---------- Kind words: drag the top postcard aside ---------- */
export function Words() {
  const [order, setOrder] = useState(WORDS.map((_, i) => i));
  const [dx, setDx] = useState(0);
  const [gone, setGone] = useState(0);
  const start = useRef<number | null>(null);
  const cycle = (dir = 1) => { setOrder((o) => (dir > 0 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)])); sound.tone(600, 0.08); };
  const up = () => { if (start.current === null) return; start.current = null;
    if (Math.abs(dx) > 140) { setGone(dx > 0 ? 1 : -1); setTimeout(() => { setGone(0); setDx(0); cycle(1); }, 300); } else setDx(0); };
  return (
    <section id="words"><div className="wrap">
      <Head gate="E" label="Postcards" title="Kind words, sent from the road" />
      <div className="words-wrap">
        <Reveal delay={0.1}>
          <div className="pdeck">
            {[...order].reverse().map((idx, k) => {
              const depth = order.length - 1 - k, w = WORDS[idx], top = depth === 0;
              const tf = top ? (gone ? `translate(${gone * 900}px,-40px) rotate(${gone * 20}deg)` : `translate(${dx}px,${Math.abs(dx) * -0.05}px) rotate(${dx / 25}deg)`)
                : `translate(${depth * 10}px,${depth * 10}px) rotate(${depth * 1.4}deg)`;
              return (
                <div key={idx} className="postcard" style={{ transform: tf, zIndex: 10 - depth, opacity: top && gone ? 0 : 1, transition: top && start.current !== null ? "none" : undefined }}
                  onPointerDown={top ? (e) => { start.current = e.clientX; (e.target as HTMLElement).setPointerCapture(e.pointerId); } : undefined}
                  onPointerMove={top ? (e) => { if (start.current !== null) setDx(e.clientX - start.current); } : undefined}
                  onPointerUp={top ? up : undefined}>
                  <div className="msg"><q>{w.quote}</q><div className="who">{w.name}<span>{w.title}</span></div></div>
                  <div className="side">
                    <div className="stamp" style={{ ["--c" as any]: w.color }}>{w.stamp}<br /><small style={{ fontSize: 10 }}>AIRMAIL</small></div>
                    <div className="addr">To: {PROFILE.name}</div><div className="addr">Gate UX, Terminal Design</div><div className="addr">From: {w.from}</div><div className="addr">Via LinkedIn</div>
                  </div>
                  <div className="postmark">AIRMAIL<br />POST OFFICE<br />★</div>
                </div>
              );
            })}
          </div>
          <div className="deck-ctrl">
            <button className="btn" onClick={() => cycle(-1)}>Previous</button>
            <button className="btn solid" onClick={() => cycle(1)}>Next</button>
            <span className="count">{order[0] + 1} of {WORDS.length}</span>
          </div>
        </Reveal>
        <Reveal delay={0.2}><p className="lede" style={{ fontSize: 17 }}>Words from the people I’ve worked with. Drag the top postcard aside to read the next.</p></Reveal>
      </div>
    </div></section>
  );
}

/* ---------- Gate announcement (thought for the day) ---------- */
export function Announcement() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [idx, setIdx] = useState(new Date().getDate() % THOUGHTS.length);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }).toUpperCase();
  useEffect(() => { if (seen) sound.chime(); }, [seen, idx]);
  return (
    <section id="thought"><div className="wrap">
      <Head gate="F" label="Announcement" title="Thought for the day" lede="The lines I come back to when the work gets hard, on the board every terminal has." />
      <Reveal className="announce" delay={0.2}>
        <div ref={ref}>
          <div className="meta"><span>PA · TERMINAL UX</span><span>{today}</span></div>
          <div className="lines">{THOUGHTS[idx].map((line, i) => <SplitFlap key={idx + "-" + i} text={line} len={16} run={seen} />)}</div>
          <button className="btn" onClick={() => setIdx((i) => (i + 1) % THOUGHTS.length)}>Next announcement</button>
        </div>
      </Reveal>
    </div></section>
  );
}

/* ---------- Passport stamps (practice) ---------- */
export function Passport() {
  const [sel, setSel] = useState(0);
  const s = STAMPS[sel];
  return (
    <section id="gallery"><div className="wrap">
      <Head gate="G" label="Passport" title="Stamps collected along the way" lede="Cities that shaped how I work, and what I picked up between flights. Pick a stamp to read the story." />
      <Reveal className="passport" delay={0.2}>
        <div className="pp-page"><h3>VISAS AND ENTRIES</h3>
          <div className="stamps">{STAMPS.map((st, i) => (
            <button key={st.t} className={`pstamp ${st.sq ? "sq" : ""} ${i === sel ? "on" : ""}`} style={{ ["--c" as any]: st.color, ["--r" as any]: st.r }}
              onClick={() => { setSel(i); sound.tone(300, 0.15, 0, "triangle", 0.1); }}><span><b>{st.t}</b>{st.s}</span></button>))}</div>
        </div>
        <div className="pp-page"><h3>OBSERVATIONS</h3>
          <div className="pp-note"><small>{s.s}</small><h4>{s.t}</h4><p>{s.note}</p></div>
          <div className="mrz">P&lt;USAMANCHE&lt;&lt;SIDDHI&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />UXDESIGN&lt;RESEARCH&lt;HCDE&lt;2026&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
        </div>
      </Reveal>
    </div></section>
  );
}

/* ---------- Baggage claim (off the clock) ---------- */
export function BaggageClaim() {
  const [lb, setLb] = useState<number | null>(null);
  const bag = (b: (typeof BAGS)[number], i: number, dup = false) => (
    <div className="bag" key={(dup ? "d" : "") + i} style={{ ["--r" as any]: `${i % 2 ? 2.5 : -2}deg` }} onClick={() => { setLb(i); sound.click(); }}>
      <div className="ph" style={{ ["--g1" as any]: b.g1, ["--g2" as any]: b.g2 }}>Add public/{b.src}<img src={b.src} alt={b.caption} onError={(e) => e.currentTarget.remove()} /></div>
      <div className="ttag"><span>SM026 · {pad(i + 1, 3)}</span><span>BOM</span></div>
    </div>
  );
  return (
    <section id="me">
      <div className="wrap"><Head gate="H" label="Baggage claim" title="Off the clock" lede="Design on weekdays, everything else on weekends. Hover the belt to stop it, pick up a bag to see the photo." /></div>
      <Reveal className="wrap claim" delay={0.2}>
        <div className="claim-sign"><span>BAGGAGE CLAIM · CAROUSEL 3</span><span className="mono" style={{ fontSize: 14 }}>FLIGHT SM 2026</span></div>
        <div className="belt"><div className="track">{BAGS.map((b, i) => bag(b, i))}{BAGS.map((b, i) => bag(b, i, true))}</div></div>
      </Reveal>
      <div className={`lightbox ${lb !== null ? "show" : ""}`} onClick={() => setLb(null)}>
        {lb !== null && <div className="inner"><div className="ph" style={{ ["--g1" as any]: BAGS[lb].g1, ["--g2" as any]: BAGS[lb].g2 }}><img src={BAGS[lb].src} alt="" onError={(e) => e.currentTarget.remove()} /></div><p>{BAGS[lb].caption}</p></div>}
      </div>
    </section>
  );
}

/* ---------- Carry-on: skill tags with drag-and-throw physics ---------- */
export function CarryOn() {
  const binRef = useRef<HTMLDivElement>(null);
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  useEffect(() => {
    if (!seen) return;
    const bin = binRef.current!; const W = () => bin.clientWidth, H = () => bin.clientHeight;
    type T = { el: HTMLDivElement; x: number; y: number; vx: number; vy: number; w: number; h: number; rot: number; drag: boolean };
    const tags: T[] = [];
    SKILL_GROUPS.flatMap((g) => g.items.map((t) => [t, g.color] as const)).forEach(([t, c], i) => {
      const el = document.createElement("div"); el.className = "ltag"; el.textContent = t; el.style.setProperty("--c", c); bin.appendChild(el);
      const o: T = { el, x: 40 + Math.random() * (W() - 260), y: -60 - i * 35, vx: (Math.random() - 0.5) * 4, vy: 0, w: el.offsetWidth, h: el.offsetHeight, rot: (Math.random() - 0.5) * 20, drag: false };
      tags.push(o); let lx = 0, ly = 0, lt = 0;
      el.onpointerdown = (e) => { o.drag = true; el.setPointerCapture(e.pointerId); lx = e.clientX; ly = e.clientY; lt = performance.now(); sound.click(); };
      el.onpointermove = (e) => { if (!o.drag) return; const now = performance.now(), dt = Math.max(16, now - lt);
        o.x += e.clientX - lx; o.y += e.clientY - ly; o.vx = ((e.clientX - lx) / dt) * 16; o.vy = ((e.clientY - ly) / dt) * 16; lx = e.clientX; ly = e.clientY; lt = now; };
      el.onpointerup = () => { o.drag = false; };
    });
    let raf = 0;
    const loop = () => {
      tags.forEach((o) => {
        if (!o.drag) { o.vy += 0.5; o.x += o.vx; o.y += o.vy; o.vx *= 0.99;
          if (o.y + o.h > H() - 10) { o.y = H() - 10 - o.h; if (Math.abs(o.vy) > 3) sound.tone(180, 0.05, 0, "sine", 0.03); o.vy *= -0.35; o.vx *= 0.85; o.rot *= 0.9; }
          if (o.x < 10) { o.x = 10; o.vx *= -0.6; } if (o.x + o.w > W() - 10) { o.x = W() - 10 - o.w; o.vx *= -0.6; } if (o.y < -200) o.y = -200; }
        o.rot = Math.max(-25, Math.min(25, o.rot + o.vx * 0.3));
        o.el.style.transform = `translate(${o.x}px,${o.y}px) rotate(${o.rot}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); tags.forEach((t) => t.el.remove()); };
  }, [seen]);
  return (
    <section id="skills"><div className="wrap" ref={ref}>
      <Head gate="J" label="Carry-on" title="Packed for every trip" lede="Research, design and technical skills, tagged like luggage. Pick one up and throw it into the overhead bin." />
      <Reveal delay={0.2}><div className="bin" ref={binRef}><span className="bin-label">OVERHEAD BIN · DRAG AND THROW</span></div></Reveal>
      <div className="after-bin">
        {INFO.map((b, i) => (
          <Reveal className="info" delay={0.08 * i} key={b.title}><h4>{b.title}</h4><ul>{b.items.map(([t, d]) => <li key={t}><b>{t}</b>{d}</li>)}</ul></Reveal>
        ))}
      </div>
    </div></section>
  );
}

/* ---------- Check-in counter (contact) ---------- */
export function CheckIn() {
  const [pur, setPur] = useState(0), [seat, setSeat] = useState(0), [printedOut, setPrinted] = useState(false), [fill, setFill] = useState(0), [copied, setCopied] = useState(false);
  const raf = useRef<number | null>(null); const clock = useClock();
  const url = [`mailto:${CONTACT.email}?subject=${encodeURIComponent(PURPOSE[pur][0] + ": from your portfolio")}`, CONTACT.linkedin, CONTACT.github][seat];
  const down = () => { const t0 = performance.now(); setPrinted(false); sound.tone(400, 1.1, 0, "sine", 0.03);
    const step = () => { const p = Math.min(1, (performance.now() - t0) / 1100); setFill(p);
      if (p < 1) raf.current = requestAnimationFrame(step); else { raf.current = null; setFill(0); setPrinted(true); sound.chime(); } };
    raf.current = requestAnimationFrame(step); };
  const up = () => { if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; setFill(0); } };
  const Opts = ({ list, val, set }: { list: [string, string][]; val: number; set: (n: number) => void }) => (
    <div className="opts">{list.map(([a, b], i) => <button key={a} className={`opt ${i === val ? "on" : ""}`} onClick={() => { set(i); setPrinted(false); sound.click(); }}><b>{a}</b><span>{b}</span></button>)}</div>
  );
  return (
    <section id="contact"><div className="wrap">
      <Head gate="K" label="Check-in" title="Let’s check you in" lede="Open to AI UX and product design roles on B2B workflow tools, across the US. Pick a reason for travel, pick a seat for the channel, then hold to print." />
      <div className="counter">
        <Reveal className="kiosk" delay={0.1}><div className="kiosk-screen">
          <h4>1. PURPOSE OF TRAVEL</h4><Opts list={PURPOSE} val={pur} set={setPur} />
          <h4>2. PICK A SEAT, I PICK THE CHANNEL</h4><Opts list={SEATS} val={seat} set={setSeat} />
          <h4>3. HOLD TO PRINT</h4>
          <button className="holdbtn" onPointerDown={down} onPointerUp={up} onPointerLeave={up}
            onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat && !raf.current) { e.preventDefault(); down(); } }} onKeyUp={up}>
            <i style={{ width: `${fill * 100}%` }} /><span>HOLD TO PRINT BOARDING PASS</span>
          </button>
        </div></Reveal>
        <Reveal className="printer" delay={0.2}>
          <div className="slot-bar" />
          {!printedOut && <div className="printer-hint">YOUR BOARDING PASS PRINTS HERE ↑</div>}
          <div className={`printed ${printedOut ? "out" : ""}`}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: 2, color: "var(--muted)" }}>BOARDING PASS · SM 2026</div>
            <h5 style={{ margin: "8px 0 14px" }}>Welcome aboard</h5>
            <div className="row"><span>Passenger</span><b>YOU</b></div><div className="row"><span>Destination</span><b>SIDDHI MANCHE</b></div>
            <div className="row"><span>Purpose</span><b>{PURPOSE[pur][0].toUpperCase()}</b></div>
            <div className="row"><span>Seat</span><b>{SEATS[seat][0].toUpperCase()} · {SEATS[seat][1].toUpperCase()}</b></div>
            <a className="btn solid" style={{ marginTop: 18 }} href={url} target="_blank" rel="noopener">Proceed to gate →</a>
          </div>
          <div className="links">
            <a className="btn" href={`mailto:${CONTACT.email}`}>Email</a>
            <button className="btn" onClick={() => { navigator.clipboard?.writeText(CONTACT.email); setCopied(true); sound.click(); setTimeout(() => setCopied(false), 1800); }}>{copied ? "Copied ✓" : "Copy email"}</button>
            <a className="btn" href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a className="btn" href={CONTACT.github} target="_blank" rel="noopener">GitHub</a>
          </div>
        </Reveal>
      </div>
      <footer>
        <span>Designed and built by {PROFILE.name}. © {new Date().getFullYear()}</span>
        <span className="clk">{clock} ET</span>
        <a href="#top" className="btn">Back to top ↑</a>
      </footer>
    </div></section>
  );
}
