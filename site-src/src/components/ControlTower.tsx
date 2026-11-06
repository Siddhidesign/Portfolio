import type React from "react";
import { useMemo, useRef, useState } from "react";
import { sound } from "../hooks/useSound";
import { FLIGHTS, LAB_PROOF } from "../data";
import { Stat, onColor } from "./Stat";

type Law = { id: string; name: string; def: string; tryIt: string; page: string; Demo: () => React.JSX.Element };

function Jakob() {
  const flows: [string, string[]][] = [["FAMILIAR ORDER FLOW", ["Find customer", "Add items", "Check stock", "Confirm", "Invoice"]], ["NOVEL ORDER FLOW", ["Invoice", "Confirm", "Find customer", "Check stock", "Add items"]]];
  return (<><div className="dm-row">{flows.map(([k, v]) => <div className="dm-col" key={k}><p className="h6">{k}</p><ol className="dm-row" aria-label={k.toLowerCase()}>{v.map((s, j) => <li className="dm-btn" key={s} style={{ cursor: "default", listStyle: "none" }}>{j + 1}. {s}</li>)}</ol></div>)}</div>
    <div className="dm-out" aria-live="polite">Same five steps. Only one order matches how staff already work.</div></>);
}
function Fitts() {
  const t0 = useRef(performance.now()); const [res, setRes] = useState<Record<string, number>>({});
  const hit = (k: string) => { setRes((r) => ({ ...r, [k]: Math.round(performance.now() - t0.current) })); t0.current = performance.now(); sound.click(); };
  return (<div onMouseEnter={() => (t0.current = performance.now())} onFocus={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) t0.current = performance.now(); }}>
    <div className="dm-row" style={{ justifyContent: "space-between", alignItems: "flex-end", height: 130 }}>
      <button className="dm-btn" style={{ padding: "2px 6px", fontSize: 10 }} onClick={() => hit("s")} aria-label="Approve, small target">approve</button>
      <button className="btn solid" style={{ padding: "22px 60px", fontSize: 18 }} onClick={() => hit("b")} aria-label="Approve order, big target">APPROVE ORDER</button>
    </div><div className="dm-out" aria-live="polite">Small target: {res.s ?? "--"} ms · Big target: {res.b ?? "--"} ms</div></div>);
}
function Hick() {
  const short = ["A1", "B2", "C3"]; const long = useMemo(() => ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"].sort(() => Math.random() - 0.5), []);
  const [list, setList] = useState<string[] | null>(null); const [out, setOut] = useState("Find store C3 as fast as you can."); const t0 = useRef(0);
  const run = (l: string[]) => { setList(l); t0.current = performance.now(); };
  return (<><div className="dm-row"><button className="dm-btn" onClick={() => run(short)}>Start: 3 stores</button><button className="dm-btn" onClick={() => run(long)}>Start: 16 stores</button></div>
    <div className="dm-row" style={{ marginTop: 14 }} role="group" aria-label="Stores">{list?.map((g) => <button key={g} className="dm-btn" onClick={() => { if (g === "C3") { setOut(`${list.length} stores: found C3 in ${Math.round(performance.now() - t0.current)} ms`); sound.tone(1200, 0.1); } else sound.tone(200, 0.1, 0, "sawtooth", 0.03); }}>{g}</button>)}</div>
    <div className="dm-out" aria-live="polite">{out}</div></>);
}
function Miller() {
  return (<><div className="dm-row">
    <div className="dm-col"><p className="h6">UNCHUNKED</p><div className="mono" style={{ fontSize: 28, letterSpacing: 2 }}>QX7R2KM94T</div></div>
    <div className="dm-col"><p className="h6">CHUNKED</p><div className="mono" style={{ fontSize: 28, letterSpacing: 2 }}>QX7 · R2K · M94T</div></div>
  </div><div className="dm-out">Same ten characters. Grouping them makes them stick.</div></>);
}
function Prevent() {
  const [late, setLate] = useState(""), [lateErr, setLateErr] = useState(""), [now, setNow] = useState("");
  const ok = /^\d{5}$/.test(now);
  return (<div className="dm-row" style={{ alignItems: "flex-start", gap: 24 }}>
    <div className="dm-col"><p className="h6">ERROR AFTER THE FACT</p><div className="field-demo">
      <label htmlFor="zip-late">Store ZIP code</label><input id="zip-late" value={late} className={lateErr ? "bad" : ""} aria-invalid={!!lateErr} aria-describedby="zip-late-err" onChange={(e) => { setLate(e.target.value); setLateErr(""); }} />
      <button className="dm-btn" onClick={() => { setLateErr(/^\d{5}$/.test(late) ? "" : "Submission failed. Please review the form."); sound.tone(/^\d{5}$/.test(late) ? 1000 : 200, 0.1); }}>Submit</button>
      <span className="err" id="zip-late-err" role="alert">{lateErr}</span></div></div>
    <div className="dm-col"><p className="h6">PREVENTED UP FRONT</p><div className="field-demo">
      <label htmlFor="zip-now">Store ZIP code</label><span className="hint" id="zip-now-hint">5 digits, for example 43215</span>
      <input id="zip-now" aria-describedby="zip-now-hint zip-now-err" aria-invalid={!!now && !ok} value={now} inputMode="numeric" maxLength={5} className={now && !ok ? "bad" : ""} onChange={(e) => setNow(e.target.value.replace(/\D/g, ""))} />
      <button className="dm-btn" disabled={!ok} style={{ opacity: ok ? 1 : 0.45 }} onClick={() => sound.tone(1000, 0.1)}>Submit{ok && <span aria-hidden="true"> ✓</span>}</button>
      <span className="err" id="zip-now-err" aria-live="polite">{now && !ok ? `${5 - now.length} more digit${5 - now.length === 1 ? "" : "s"}` : ""}</span></div></div>
  </div>);
}
function VonR() {
  const codes = ["PO-210", "PO-884", "PO-101", "SM-026", "PO-455", "PO-612", "PO-330", "PO-902"]; const [o, setO] = useState("Your order is SM-026. Click it.");
  return (<><div className="mini-board" role="group" aria-label="Order board">{codes.map((c) => <button type="button" key={c} className={c === "SM-026" ? "vr" : ""} onClick={() => { setO(c === "SM-026" ? "Found it instantly. The odd one out wins attention." : "Not this one."); sound.click(); }}>{c}</button>)}</div>
    <div className="dm-out" aria-live="polite">{o}</div></>);
}

const LAWS: Law[] = [
  { id: "jakob", name: "Jakob’s law", def: "People expect your product to work like the ones they already use.", tryIt: "Same five steps, two orders. Which one could you do without thinking?", page: "A top bar and tabs that work like the tools you use every day.", Demo: Jakob },
  { id: "fitts", name: "Fitts’s law", def: "The time to reach a target depends on its size and distance.", tryIt: "Click both approve buttons and compare your time.", page: "Big buttons, and a full-width Run button in Start a run.", Demo: Fitts },
  { id: "hick", name: "Hick’s law", def: "The more choices you show, the longer a decision takes.", tryIt: "Find store C3 in a short list, then in a long one.", page: "Start a run asks two small choices, never one long form.", Demo: Hick },
  { id: "miller", name: "Miller’s law", def: "People hold only a handful of items in working memory, so chunk information into small groups.", tryIt: "Which confirmation code is easier to remember?", page: "Run codes and stats are chunked into short groups.", Demo: Miller },
  { id: "vonr", name: "Von Restorff effect", def: "The item that looks different is the one people remember.", tryIt: "Find your order on the mini board.", page: "AI steps glow purple and human checks glow orange in every run.", Demo: VonR },
  { id: "prevent", name: "Error prevention", def: "Stop the mistake before it happens, instead of explaining it afterwards.", tryIt: "Type a ZIP code into both fields. One waits to tell you; one never lets you get it wrong.", page: "Start a run shows exactly where it will send you before anything opens.", Demo: Prevent },
];

export default function ControlTower() {
  const [i, setI] = useState(0); const L = LAWS[i];
  return (
    <div className="tower">
      <div className="law-list" role="group" aria-label="UX laws">{LAWS.map((l, j) => <button key={l.name} className={j === i ? "on" : ""} aria-pressed={j === i} aria-controls="law-card" onClick={() => { setI(j); sound.click(); }}><span aria-hidden="true">{String(j + 1).padStart(2, "0")}</span>{l.name}</button>)}</div>
      <div className="law-card" key={i} id="law-card">
        <div className="num">LAW {String(i + 1).padStart(2, "0")} OF {String(LAWS.length).padStart(2, "0")}</div>
        <h3>{L.name}</h3><p className="def">{L.def}</p>
        <div className="demo"><L.Demo /></div>
        <p className="try"><b>TRY IT</b>{L.tryIt}</p>
        <Proof id={L.id} />
        <p className="page-note"><b>ON THIS PAGE</b>{L.page}</p>
      </div>
    </div>
  );
}

/** "Tried and tested": where this law shows up in a real project, and what happened */
function Proof({ id }: { id: string }) {
  const entry = LAB_PROOF[id]; if (!entry) return null;
  const { proof: p, also } = entry;
  const f = FLIGHTS.find((x) => x.id === p.flight)!;
  const a = also && FLIGHTS.find((x) => x.id === also.flight);
  return (
    <div className="proof" style={{ ["--c" as any]: f.color, ["--on" as any]: onColor(f.color) }}>
      <div className="proof-head"><small>TRIED AND TESTED</small><span className="code">{f.code}</span><b>{f.title}</b><span className={`badge ${p.badge}`}>{p.badgeText}</span></div>
      <div className="proof-body">
        <Stat className="proof-stat" v={p.stat} l={p.statLabel} />
        <p>{p.did}</p>
      </div>
      <div className="proof-foot">
        <span>{a ? <>{a.id === f.id ? "Also: " : <>Also in <b style={{ color: "var(--ink)" }}>{a.title}</b>: </>}{also!.text}</> : null}</span>
        {f.link && <a href={f.link} target="_blank" rel="noopener">Read the case study<span className="sr"> for {f.title} (opens in a new tab)</span> <span aria-hidden="true">→</span></a>}
      </div>
    </div>
  );
}
