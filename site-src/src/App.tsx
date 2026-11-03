import { useCallback, useEffect, useState } from "react";
import { FLIGHTS } from "./data";
import Hero from "./components/Hero";
import { RunLog, Versions, DataIn, RunsGrid, RunsDeck, Rules, Approvals, Integrations, StartRun } from "./components/Workflow";

/* Story order, told as one workflow:
   1. Hero canvas ....... data in → AI → human check → result (the pitch in 5 seconds)
   2. Run log ........... one real analysis, step by step
   3. Version history ... developer → workflow designer → AI-assisted researcher → agentic AI UX
   4. Data in ........... research volume, and what AI does vs what I do
   5. Runs .............. every project at a glance, then one stacked card per run
   6. Rules engine ...... UX laws, tested on real projects
   7. Approvals ......... what managers and founders said
   8. Integrations ...... methods, tools, education
   9. Start a run ....... contact */

const TABS: [string, string][] = [["top", "Workflow"], ["story", "Versions"], ["pipeline", "Pipeline"], ["runs", "Runs"], ["rules", "Rules"], ["approvals", "Approvals"], ["integrations", "Integrations"]];

export default function App() {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("sm-theme") === "dark"; } catch { return false; } });
  const [hide, setHide] = useState(false);
  const [active, setActive] = useState("top");
  const [rail, setRail] = useState({ on: false, active: 0 });

  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; try { localStorage.setItem("sm-theme", dark ? "dark" : "light"); } catch {} }, [dark]);
  useEffect(() => {
    let last = scrollY;
    const on = () => {
      const y = scrollY; setHide(y > last && y > 240); last = y;
      let cur = "top"; document.querySelectorAll<HTMLElement>("main section[id]").forEach((s) => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) cur = s.id; });
      setActive(cur.startsWith("n-") ? "runs" : cur === "contact" ? "contact" : cur);
    };
    on(); addEventListener("scroll", on, { passive: true }); return () => removeEventListener("scroll", on);
  }, []);
  const onRail = useCallback((on: boolean, a: number) => setRail((r) => (r.on === on && r.active === a ? r : { on, active: a })), []);
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <header className={`bar ${hide ? "hide" : ""}`}>
        <a className="crumb" href="#top" onClick={go("top")}>siddhi <span className="s">/</span> portfolio <span className="s">/</span> main <span className="live"><i />open to roles</span></a>
        <nav className="tabs">{TABS.map(([id, l]) => <a key={id} href={`#${id}`} className={active === id ? "on" : ""} onClick={go(id)}>{l}</a>)}</nav>
        <div className="tools">
          <button className="ibtn" onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode" title="Dark mode"><svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg></button>
          <a className="cta" href="#contact" onClick={go("contact")}>Start a run →</a>
        </div>
      </header>
      <nav className={`rail ${rail.on ? "on" : ""}`} aria-label="Runs">
        {FLIGHTS.map((f, i) => <a key={f.id} href={`#n-${f.id}`} onClick={go(`n-${f.id}`)} className={rail.active === i ? "on" : ""} style={{ ["--c" as any]: f.color }} data-l={`#${f.code.replace(" ", "-")} · ${f.title}`} />)}
      </nav>
      <main>
        <Hero />
        <RunLog />
        <Versions />
        <DataIn />
        <RunsGrid />
        <RunsDeck onRail={onRail} />
        <Rules />
        <Approvals />
        <Integrations />
        <StartRun />
      </main>
    </>
  );
}
