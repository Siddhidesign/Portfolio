import type React from "react";
import { useMemo, useRef, useState } from "react";
import { sound } from "../hooks/useSound";
import { FLIGHTS, LAB_PROOF } from "../data";

type Law = { id: string; name: string; def: string; tryIt: string; page: string; Demo: () => React.JSX.Element };

function Jakob() {
  const flows: [string, string[]][] = [["FAMILIAR CHECK-IN", ["Find booking", "Select seat", "Bags", "Pay", "Boarding pass"]], ["NOVEL CHECK-IN", ["Pay", "Boarding pass", "Find booking", "Bags", "Select seat"]]];
  return (<><div className="dm-row">{flows.map(([k, v]) => <div className="dm-col" key={k}><h6>{k}</h6><div className="dm-row">{v.map((s, j) => <span className="dm-btn" key={s} style={{ cursor: "default" }}>{j + 1}. {s}</span>)}</div></div>)}</div>
    <div className="dm-out">Same five steps. Only one order matches what travellers already know.</div></>);
}
function Fitts() {
  const t0 = useRef(performance.now()); const [res, setRes] = useState<Record<string, number>>({});
  const hit = (k: string) => { setRes((r) => ({ ...r, [k]: Math.round(performance.now() - t0.current) })); t0.current = performance.now(); sound.click(); };
  return (<div onMouseEnter={() => (t0.current = performance.now())}>
    <div className="dm-row" style={{ justifyContent: "space-between", alignItems: "flex-end", height: 130 }}>
      <button className="dm-btn" style={{ padding: "2px 6px", fontSize: 10 }} onClick={() => hit("s")}>board</button>
      <button className="btn solid" style={{ padding: "22px 60px", fontSize: 18 }} onClick={() => hit("b")}>BOARD NOW</button>
    </div><div className="dm-out">Small target: {res.s ?? "--"} ms · Big target: {res.b ?? "--"} ms</div></div>);
}
function Hick() {
  const short = ["A1", "B2", "C3"]; const long = useMemo(() => ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"].sort(() => Math.random() - 0.5), []);
  const [list, setList] = useState<string[] | null>(null); const [out, setOut] = useState("Find gate C3 as fast as you can."); const t0 = useRef(0);
  const run = (l: string[]) => { setList(l); t0.current = performance.now(); };
  return (<><div className="dm-row"><button className="dm-btn" onClick={() => run(short)}>Start: 3 gates</button><button className="dm-btn" onClick={() => run(long)}>Start: 16 gates</button></div>
    <div className="dm-row" style={{ marginTop: 14 }}>{list?.map((g) => <button key={g} className="dm-btn" onClick={() => { if (g === "C3") { setOut(`${list.length} gates: found C3 in ${Math.round(performance.now() - t0.current)} ms`); sound.tone(1200, 0.1); } else sound.tone(200, 0.1, 0, "sawtooth", 0.03); }}>{g}</button>)}</div>
    <div className="dm-out">{out}</div></>);
}
function Miller() {
  return (<><div className="dm-row">
    <div className="dm-col"><h6>UNCHUNKED</h6><div className="mono" style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>QX7R2KM94T</div></div>
    <div className="dm-col"><h6>CHUNKED</h6><div className="mono" style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>QX7 · R2K · M94T</div></div>
  </div><div className="dm-out">Same ten characters. Grouping them makes them stick.</div></>);
}
function Prevent() {
  const [late, setLate] = useState(""), [lateErr, setLateErr] = useState(""), [now, setNow] = useState("");
  const ok = /^\d{5}$/.test(now);
  return (<div className="dm-row" style={{ alignItems: "flex-start", gap: 24 }}>
    <div className="dm-col"><h6>ERROR AFTER THE FACT</h6><div className="field-demo">
      <label>Gate ZIP code</label><input value={late} className={lateErr ? "bad" : ""} onChange={(e) => { setLate(e.target.value); setLateErr(""); }} />
      <button className="dm-btn" onClick={() => { setLateErr(/^\d{5}$/.test(late) ? "" : "Submission failed. Please review the form."); sound.tone(/^\d{5}$/.test(late) ? 1000 : 200, 0.1); }}>Submit</button>
      <span className="err">{lateErr}</span></div></div>
    <div className="dm-col"><h6>PREVENTED UP FRONT</h6><div className="field-demo">
      <label>Gate ZIP code</label><span className="hint">5 digits, for example 43215</span>
      <input value={now} inputMode="numeric" maxLength={5} className={now && !ok ? "bad" : ""} onChange={(e) => setNow(e.target.value.replace(/\D/g, ""))} />
      <button className="dm-btn" disabled={!ok} style={{ opacity: ok ? 1 : 0.45 }} onClick={() => sound.tone(1000, 0.1)}>{ok ? "Submit ✓" : "Submit"}</button>
      {now && !ok && <span className="err">{5 - now.length} more digit{5 - now.length === 1 ? "" : "s"}</span>}</div></div>
  </div>);
}
function VonR() {
  const codes = ["UA210", "DL884", "AA101", "SM026", "WN455", "B6120", "AS330", "NK902"]; const [o, setO] = useState("Your flight is SM026. Click it.");
  return (<><div className="mini-board">{codes.map((c) => <span key={c} className={c === "SM026" ? "vr" : ""} onClick={() => { setO(c === "SM026" ? "Found it instantly. The odd one out wins attention." : "Not this one."); sound.click(); }}>{c}</span>)}</div>
    <div className="dm-out">{o}</div></>);
}

const LAWS: Law[] = [
  { id: "jakob", name: "Jakob’s law", def: "People expect your product to work like the ones they already use.", tryIt: "Same five steps, two orders. Which one could you do without thinking?", page: "A familiar top navigation and a standard boarding pass layout.", Demo: Jakob },
  { id: "fitts", name: "Fitts’s law", def: "The time to reach a target depends on its size and distance.", tryIt: "Click both boarding buttons and compare your time.", page: "Big pill buttons, and a full-width print button at check-in.", Demo: Fitts },
  { id: "hick", name: "Hick’s law", def: "The more choices you show, the longer a decision takes.", tryIt: "Find gate C3 in a short list, then in a long one.", page: "Check-in asks three small questions, never one big form.", Demo: Hick },
  { id: "miller", name: "Miller’s law", def: "People hold only a handful of items in working memory, so chunk information into small groups.", tryIt: "Which confirmation code is easier to remember?", page: "Flight codes and stats are chunked into short groups.", Demo: Miller },
  { id: "vonr", name: "Von Restorff effect", def: "The item that looks different is the one people remember.", tryIt: "Find your flight on the mini board.", page: "The flight that is boarding glows on the departures board.", Demo: VonR },
  { id: "prevent", name: "Error prevention", def: "Stop the mistake before it happens, instead of explaining it afterwards.", tryIt: "Type a ZIP code into both fields. One waits to tell you; one never lets you get it wrong.", page: "Check-in won’t print until you hold the button, so nothing sends by accident.", Demo: Prevent },
];

export default function ControlTower() {
  const [i, setI] = useState(0); const L = LAWS[i];
  return (
    <div className="tower">
      <div className="law-list">{LAWS.map((l, j) => <button key={l.name} className={j === i ? "on" : ""} onClick={() => { setI(j); sound.click(); }}><span>{String(j + 1).padStart(2, "0")}</span>{l.name}</button>)}</div>
      <div className="law-card" key={i}>
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
    <div className="proof" style={{ ["--c" as any]: f.color }}>
      <div className="proof-head"><small>TRIED AND TESTED</small><span className="code">{f.code}</span><b>{f.title}</b><span className={`badge ${p.badge}`}>{p.badgeText}</span></div>
      <div className="proof-body">
        <div className="proof-stat"><b>{p.stat}</b><span>{p.statLabel}</span></div>
        <p>{p.did}</p>
      </div>
      <div className="proof-foot">
        <span>{a ? <>{a.id === f.id ? "Also: " : <>Also in <b style={{ color: "var(--ink)" }}>{a.title}</b>: </>}{also!.text}</> : null}</span>
        <a href={f.link} target="_blank" rel="noopener">Read the case study →</a>
      </div>
    </div>
  );
}
