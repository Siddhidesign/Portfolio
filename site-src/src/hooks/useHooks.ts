import { useEffect, useRef, useState } from "react";

/** Eastern Time clock, refreshed every 15s */
export function useClock() {
  const fmt = () => new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false });
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 15000); return () => clearInterval(id); }, []);
  return t;
}

/** Fires once when the element scrolls into view */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** Which section id is currently in the middle of the screen */
export function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return active;
}
