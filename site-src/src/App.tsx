import { useCallback, useEffect, useRef, useState } from "react";
import { FLIGHTS, CONTACT } from "./data";
import { sound } from "./hooks/useSound";
import Deck from "./components/Deck";
import { Airlines, FlightLog, Lab, Words, Announcement, Passport, BaggageClaim, CarryOn, CheckIn } from "./components/Sections";
import { Plane } from "./components/Shared";

/* The story is one trip, told in the order a traveller lives it:
   1. Boarding pass ........ who I am, where I'm headed (identity + intent)
   2. Departures board ..... every project at a glance (scan before you commit)
   3. One pass per flight .. each project, problem → outcome (proof)
   4. Airlines flown ....... where I've worked (credibility)
   5. Flight log ........... how I got here (narrative)
   6. Control tower ........ how I think (principles you can try)
   7. Postcards ............ what others say (social proof)
   8. Announcement, passport, baggage claim ... who I am off the clock (personality)
   9. Carry-on ............. what I pack (skills)
  10. Check-in ............. your next step (one clear call to action) */

const NAV = [["work", "Work"], ["story", "Story"], ["laws", "UX lab"], ["words", "Words"], ["gallery", "Practice"], ["me", "Me"], ["skills", "Skills"], ["contact", "Contact"]];
const CHAPTERS: Record<string, string> = { top: "Boarding", route: "Itinerary", work: "Departures", clearing: "Airlines", story: "Flight log", laws: "Control tower", words: "Postcards", thought: "Announcement", gallery: "Passport", me: "Baggage claim", skills: "Carry-on", contact: "Check-in" };
const navFor = (id: string) => (id.startsWith("n-") || id === "clearing" || id === "work" || id === "route" ? "work" : id === "thought" ? "words" : id);

export default function App() {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("sm-theme") === "dark"; } catch { return false; } });
  const [soundOn, setSoundOn] = useState(false);
  const [help, setHelp] = useState(false);
  const [rail, setRail] = useState({ on: false, active: 0 });
  const [active, setActive] = useState("top");
  const [hideNav, setHideNav] = useState(false);
  const barRef = useRef<HTMLDivElement>(null), planeRef = useRef<SVGSVGElement>(null);

  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; try { localStorage.setItem("sm-theme", dark ? "dark" : "light"); } catch {} }, [dark]);
  useEffect(() => sound.subscribe(setSoundOn), []);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("ready"))); }, []);

  // header hides on scroll down, journey bar fills, current chapter tracked
  useEffect(() => {
    let last = scrollY;
    const on = () => { const y = scrollY; setHideNav(y > last && y > 200); last = y;
      const p = Math.min(1, y / Math.max(1, document.documentElement.scrollHeight - innerHeight));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`; if (planeRef.current) planeRef.current.style.left = `${p * 100}%`;
      let cur = "top"; document.querySelectorAll<HTMLElement>("main section[id]").forEach((s) => { if (s.getBoundingClientRect().top <= innerHeight * 0.5) cur = s.id; }); setActive(cur); };
    on(); addEventListener("scroll", on, { passive: true }); return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const order = NAV.map((n) => n[0]);
    const k = (e: KeyboardEvent) => { if ((e.target as HTMLElement).closest("input,textarea")) return;
      if (e.key === "Escape") setHelp(false); else if (e.key === "d" || e.key === "D") setDark((d) => !d);
      else if (e.key === "s" || e.key === "S") sound.toggle(); else if (/^[1-8]$/.test(e.key)) document.getElementById(order[+e.key - 1])?.scrollIntoView({ behavior: "smooth" }); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);

  const onRail = useCallback((on: boolean, a: number) => setRail((r) => (r.on === on && r.active === a ? r : { on, active: a })), []);
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); sound.click(); };
  const railItems = [{ id: "top", c: "var(--ink)", label: "Boarding pass" }, { id: "route", c: "#6B4FA0", label: "Itinerary" }, { id: "work", c: "#F5C518", label: "Departures" }, ...FLIGHTS.map((f) => ({ id: `n-${f.id}`, c: f.color, label: `${f.code} · ${f.title}` }))];

  return (
    <>
      <div className="journey"><div className="bar" ref={barRef} style={{ transform: "scaleX(0)" }} /><svg ref={planeRef} viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg></div>
      <header className={`nav ${hideNav ? "hide" : ""}`}>
        <a className="brand" href="#top" onClick={go("top")}><span className="mark"><Plane /></span>Siddhi Manche</a>
        <nav className="nav-links">{NAV.map(([id, label]) => <a key={id} href={`#${id}`} className={navFor(active) === id ? "on" : ""} onClick={go(id)}>{label}</a>)}</nav>
        <div className="nav-tools">
          {CONTACT.resume && <a className="icon-btn" href={CONTACT.resume} target="_blank" title="Résumé" aria-label="Open résumé"><svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M9 14h6M9 17h4" /></svg></a>}
          <button className="icon-btn" onClick={() => setHelp(true)} title="Shortcuts" aria-label="Keyboard shortcuts"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01" /></svg></button>
          <button className="icon-btn" aria-pressed={soundOn} onClick={() => sound.toggle()} title="Sound" aria-label="Toggle sound"><svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z" /><path className="on-only" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /><path className="off-only" d="m16 9 5 6m0-6-5 6" /></svg></button>
          <button className="icon-btn" onClick={() => { setDark((d) => !d); sound.click(); }} title="Night terminal" aria-label="Toggle dark mode"><svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg></button>
        </div>
      </header>

      <nav className={`rail ${rail.on ? "on" : ""}`} aria-label="Flights">
        {railItems.map((r, i) => <a key={r.id} href={`#${r.id}`} onClick={go(r.id)} className={rail.active === i ? "on" : ""} style={{ ["--c" as any]: r.c }} data-code={r.label} />)}
      </nav>

      <main>
        <Deck onRail={onRail} />
        <Airlines /><FlightLog /><Lab /><Words /><Announcement /><Passport /><BaggageClaim /><CarryOn /><CheckIn />
      </main>

      <div className="chapter" style={{ opacity: active === "top" ? 0 : 1 }}><b>NOW AT</b>{CHAPTERS[active.startsWith("n-") ? "work" : active] ?? "In flight"}</div>

      <div className={`modal ${help ? "show" : ""}`} onClick={(e) => e.target === e.currentTarget && setHelp(false)}>
        <div className="inner"><h3>Pilot shortcuts</h3><ul>
          <li>Toggle night terminal <kbd>D</kbd></li><li>Toggle sound <kbd>S</kbd></li><li>Flip the boarding pass <kbd>F</kbd></li>
          <li>Jump to sections <kbd>1</kbd>…<kbd>8</kbd></li><li>Close this <kbd>Esc</kbd></li></ul></div>
      </div>
    </>
  );
}
