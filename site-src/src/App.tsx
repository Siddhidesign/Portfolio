import { useCallback, useEffect, useState } from "react";
import { FLIGHTS, CONTACT } from "./data";
import { jumpTo } from "./hooks/useHooks";
import Hero from "./components/Hero";
import { RunLog, Versions, DataIn, RunsGrid, RunsDeck, Rules, Approvals, Integrations, StartRun } from "./components/Workflow";

/* Story order, told as one workflow:
   1. Hero canvas ....... data in → AI → human check → result (the pitch in 5 seconds)
   2. Run log ........... one real analysis, step by step
   3. Runs .............. every project at a glance, then one stacked card per run
                          (up top, so recruiters reach the work first)
   4. Version history ... developer → workflow designer → AI-assisted researcher → agentic AI UX
   5. Data in ........... research volume, and what AI does vs what I do
   6. Rules engine ...... UX laws, tested on real projects
   7. Approvals ......... what managers and founders said
   8. Integrations ...... methods, tools, education
   9. Start a run ....... contact */

const TABS: [string, string][] = [["top", "Workflow"], ["runs", "Runs"], ["story", "Versions"], ["pipeline", "Pipeline"], ["rules", "Rules"], ["approvals", "Approvals"], ["integrations", "Integrations"]];

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
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (jumpTo(id)) history.pushState(null, "", `#${id}`); };

  // Every in-page link goes through jumpTo, so stacked run cards land on the right card.
  // A page opened with #n-ma (or any #id) lands there too, once React has rendered it.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null; if (!a) return;
      const id = decodeURIComponent(a.hash.slice(1)); if (!id) return;
      if (jumpTo(id)) { e.preventDefault(); history.pushState(null, "", `#${id}`); }
    };
    const onPop = () => { const id = decodeURIComponent(location.hash.slice(1)); if (id) jumpTo(id, false); };
    document.addEventListener("click", onClick);
    addEventListener("popstate", onPop);
    const first = decodeURIComponent(location.hash.slice(1));
    let t = 0;
    if (first) { jumpTo(first, false); t = window.setTimeout(() => jumpTo(first, false), 400); } // again after fonts and images settle
    return () => { document.removeEventListener("click", onClick); removeEventListener("popstate", onPop); clearTimeout(t); };
  }, []);

  // Hide the resume link if the file has not been added yet, so nobody hits a 404.
  const [resume, setResume] = useState(!!CONTACT.resume);
  useEffect(() => { if (!CONTACT.resume) return; fetch(CONTACT.resume, { method: "HEAD" }).then((r) => setResume(r.ok)).catch(() => setResume(false)); }, []);
  useEffect(() => { document.querySelectorAll<HTMLElement>("[data-resume]").forEach((el) => (el.hidden = !resume)); }, [resume]);

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); const m = document.getElementById("main"); m?.focus(); }}>Skip to content</a>
      <header className={`bar ${hide ? "hide" : ""}`}>
        <a className="crumb" href="#top" onClick={go("top")}>siddhi <span className="s">/</span> portfolio <span className="s">/</span> main <span className="live"><i />open to roles</span></a>
        <nav className="tabs" aria-label="Sections">{TABS.map(([id, l]) => <a key={id} href={`#${id}`} className={active === id ? "on" : ""} aria-current={active === id ? "true" : undefined} onClick={go(id)}>{l}</a>)}</nav>
        <div className="tools">
          <button className="ibtn" onClick={() => setDark((d) => !d)} aria-label="Dark mode" aria-pressed={dark} title="Dark mode"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg></button>
          {CONTACT.resume && <a className="ghost" href={CONTACT.resume} download="Siddhi-Manche-Resume.pdf" data-resume>Resume<span className="sr"> (PDF)</span></a>}
          <a className="cta" href="#contact" onClick={go("contact")}>Start a run <span aria-hidden="true">→</span></a>
        </div>
      </header>
      <nav className={`rail ${rail.on ? "on" : ""}`} aria-label="Runs" aria-hidden={!rail.on}>
        {FLIGHTS.map((f, i) => <a key={f.id} href={`#n-${f.id}`} onClick={go(`n-${f.id}`)} className={rail.active === i ? "on" : ""} aria-current={rail.active === i ? "true" : undefined} aria-label={`Run ${i + 1}: ${f.title}`} tabIndex={rail.on ? 0 : -1} style={{ ["--c" as any]: f.color }} data-l={`#${f.code.replace(" ", "-")} · ${f.title}`} />)}
      </nav>
      <main id="main" tabIndex={-1}>
        <Hero />
        <RunLog />
        <RunsGrid />
        <RunsDeck onRail={onRail} />
        <Versions />
        <DataIn />
        <Rules />
        <Approvals />
        <Integrations />
        <StartRun />
      </main>
    </>
  );
}
