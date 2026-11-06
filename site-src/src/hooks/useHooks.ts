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

/** True when the visitor asked the OS for less motion. Safe on the server. */
export const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True when any part of the element is on screen right now. */
export const onScreen = (el: Element) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };

/**
 * Scroll to a section. Run cards are sticky and stacked, so the browser's own
 * scrollIntoView lands on whichever card is stuck on top, not the one asked for.
 * For "n-*" ids we work out the scroll position of that card in the stack instead.
 */
export function jumpTo(id: string, smooth = true) {
  const el = document.getElementById(id); if (!el) return false;
  let y: number;
  if (id.startsWith("n-") && el.parentElement) {
    const slots = [...el.parentElement.children] as HTMLElement[];
    const k = slots.indexOf(el), h = slots[0].offsetHeight;
    y = el.parentElement.getBoundingClientRect().top + scrollY + k * h - (70 + k * 6);
  } else y = id === "top" ? 0 : el.getBoundingClientRect().top + scrollY - 70;
  scrollTo({ top: Math.max(0, y), behavior: smooth && !reducedMotion() ? "smooth" : "auto" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
}
