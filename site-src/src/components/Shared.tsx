import { useEffect, useMemo, useState, type ReactNode, type CSSProperties } from "react";
import { useInView } from "../hooks/useHooks";

const CH = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-";

/** Split-flap characters that spin through the alphabet before settling */
export function SplitFlap({ text, len, run = true }: { text: string; len: number; run?: boolean }) {
  const target = text.toUpperCase().padEnd(len, " ").slice(0, len);
  const [chars, setChars] = useState(() => Array(len).fill(" "));
  useEffect(() => {
    if (!run) return;
    const timers = [...target].map((ch, i) => {
      let n = 0; const steps = 6 + Math.floor(Math.random() * 10) + i;
      const id = setInterval(() => {
        setChars((c) => { const next = [...c]; next[i] = n++ >= steps ? ch : CH[Math.floor(Math.random() * CH.length)]; return next; });
        if (n > steps) clearInterval(id);
      }, 45);
      return id;
    });
    return () => timers.forEach(clearInterval);
  }, [target, run]);
  return <span className="flaps">{chars.map((c, i) => <span className="flap" key={i}>{c}</span>)}</span>;
}

/** Fade-up on scroll. Children can stagger with the `delay` prop. */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div", style }: { children: ReactNode; delay?: number; className?: string; as?: any; style?: CSSProperties }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.15);
  return <Tag ref={ref} data-reveal className={`${className} ${seen ? "in" : ""}`} style={{ ...style, ["--d" as any]: `${delay}s` }}>{children}</Tag>;
}

export function Kicker({ gate, label }: { gate: string; label: string }) {
  return <span className="kicker"><span className="arrow">↗</span>Gate {gate} · {label}</span>;
}

/** Flight-route "guilloche": arcs that draw themselves in, plus a slowly turning compass rose */
export function Routes({ seed = 0, w = 850, h = 520 }: { seed?: number; w?: number; h?: number }) {
  const paths = useMemo(() => {
    let k = 0; const out: { d: string; k: number; dash?: boolean }[] = [];
    const rnd = (n: number) => { const x = Math.sin(seed * 999 + n * 77.7) * 10000; return x - Math.floor(x); };
    for (let j = 0; j < 7; j++) {
      const x1 = w * (0.05 + rnd(j) * 0.3), y1 = h * (0.65 + rnd(j + 9) * 0.3);
      const x2 = w * (0.6 + rnd(j + 3) * 0.38), y2 = h * (0.08 + rnd(j + 5) * 0.4);
      const cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - h * (0.15 + rnd(j + 7) * 0.35);
      out.push({ d: `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, k: k++, dash: j % 3 === 0 });
    }
    return out;
  }, [seed, w, h]);
  const cx = w * 0.82, cy = h * 0.7, R = Math.min(w, h) * 0.24;
  const ticks = Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2, r2 = i % 9 === 0 ? R * 0.78 : R * 0.9;
    return `M${(cx + Math.cos(a) * R).toFixed(1)} ${(cy + Math.sin(a) * R).toFixed(1)} L${(cx + Math.cos(a) * r2).toFixed(1)} ${(cy + Math.sin(a) * r2).toFixed(1)}`; }).join(" ");
  return (
    <svg className="routes" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      {paths.map((p) => <path key={p.k} pathLength={1} d={p.d} className={p.dash ? "dash" : ""} style={{ ["--k" as any]: p.k }} />)}
      <g className="rose"><path pathLength={1} style={{ ["--k" as any]: 8 }} d={`M${cx - R} ${cy} A${R} ${R} 0 1 0 ${cx + R} ${cy} A${R} ${R} 0 1 0 ${cx - R} ${cy}`} /><path pathLength={1} style={{ ["--k" as any]: 9 }} d={ticks} /></g>
      <g className="rose r2"><path pathLength={1} style={{ ["--k" as any]: 10 }} d={`M${cx} ${cy - R * 0.6} L${cx + R * 0.12} ${cy} L${cx} ${cy + R * 0.6} L${cx - R * 0.12} ${cy} Z M${cx - R * 0.6} ${cy} L${cx} ${cy - R * 0.12} L${cx + R * 0.6} ${cy} L${cx} ${cy + R * 0.12} Z`} /></g>
    </svg>
  );
}

export const Plane = ({ rot = 0 }: { rot?: number }) => (
  <svg viewBox="0 0 24 24"><path transform={`rotate(${rot} 12 12)`} d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>
);
