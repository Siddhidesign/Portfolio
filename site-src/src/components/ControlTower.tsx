import type React from "react";
import { useMemo, useRef, useState } from "react";
import { sound } from "../hooks/useSound";

type Law = { name: string; def: string; tryIt: string; page: string; Demo: () => React.JSX.Element };

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
function Doherty() {
  const [o, setO] = useState<{ t: string; ok: boolean }>({ t: "", ok: true });
  const go = (ms: number) => { setO({ t: "Processing…", ok: false }); setTimeout(() => { setO({ t: `Checked in after ${ms} ms`, ok: true }); sound.tone(1000, 0.1); }, ms); };
  return (<><div className="dm-row"><button className="dm-btn" onClick={() => go(80)}>Check in (80 ms)</button><button className="dm-btn" onClick={() => go(1600)}>Check in (1,600 ms)</button></div>
    <div className="dm-out" style={{ color: o.ok ? "var(--ok)" : "var(--muted)" }}>{o.t}</div></>);
}
function VonR() {
  const codes = ["UA210", "DL884", "AA101", "SM026", "WN455", "B6120", "AS330", "NK902"]; const [o, setO] = useState("Your flight is SM026. Click it.");
  return (<><div className="mini-board">{codes.map((c) => <span key={c} className={c === "SM026" ? "vr" : ""} onClick={() => { setO(c === "SM026" ? "Found it instantly. The odd one out wins attention." : "Not this one."); sound.click(); }}>{c}</span>)}</div>
    <div className="dm-out">{o}</div></>);
}

const LAWS: Law[] = [
  { name: "Jakob’s law", def: "People expect your product to work like the ones they already use.", tryIt: "Familiar flows feel instant. Reorder the steps and people slow down.", page: "A familiar top navigation and a standard boarding pass layout.", Demo: Jakob },
  { name: "Fitts’s law", def: "The time to reach a target depends on its size and distance.", tryIt: "Click both boarding buttons and compare your time.", page: "Big pill buttons and a full-width print button at check-in.", Demo: Fitts },
  { name: "Hick’s law", def: "The more choices you show, the longer a decision takes.", tryIt: "Find gate C3 in a short list, then in a long one.", page: "Check-in asks three small questions, never one big form.", Demo: Hick },
  { name: "Miller’s law", def: "People hold roughly seven, plus or minus two, items in working memory.", tryIt: "Which confirmation code is easier to remember?", page: "Flight codes and stats are chunked into short groups.", Demo: Miller },
  { name: "Doherty threshold", def: "Productivity soars when a system responds in under 400 ms.", tryIt: "Press both buttons. Feel the difference.", page: "Every click here responds immediately, before it animates.", Demo: Doherty },
  { name: "Von Restorff effect", def: "The item that looks different is the one people remember.", tryIt: "Find your flight on the mini board.", page: "The flight that is boarding glows on the departures board.", Demo: VonR },
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
        <div className="why"><div><small>Try it</small><p>{L.tryIt}</p></div><div><small>On this page</small><p>{L.page}</p></div></div>
      </div>
    </div>
  );
}
