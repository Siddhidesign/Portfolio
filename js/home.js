/* ============================================================
   SIDDHI MANCHE — homepage interactions (editorial redesign)
   ============================================================ */

'use strict';

const qs  = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];

/* ── NAV: border on scroll ─────────────────────────────────── */
const nav = qs('.topnav');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 10);
}, { passive: true });

/* ── NAV: active link ──────────────────────────────────────── */
/* only in-page anchors are selectors: a link out (Resume, mailto) is not */
const navLinks = qsa('.topnav-links a')
  .filter(a => (a.getAttribute('href') || '').startsWith('#'));
const sections = navLinks
  .map(a => { try { return qs(a.getAttribute('href')); } catch { return null; } })
  .filter(Boolean);

const navSpy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navSpy.observe(s));

/* ── SCROLL REVEALS ────────────────────────────────────────── */
const rv = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); }
  });
}, { threshold: 0.12 });
qsa('.rv').forEach(el => rv.observe(el));

/* ── MARQUEES: duplicate track for seamless loop ───────────── */
qsa('.marquee-track').forEach(track => {
  track.innerHTML += track.innerHTML;
});

/* ── FAQ: close others on open ─────────────────────────────── */
qsa('.faq-item').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) qsa('.faq-item[open]').forEach(o => { if (o !== d) o.open = false; });
  });
});

/* ── COUNT-UP STATS ────────────────────────────────────────── */
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = qsa('.count');
  const run = el => {
    const to = +el.dataset.to;
    const from = +(el.dataset.from || 0);
    const suffix = el.dataset.suffix || '';
    if (calm) { el.textContent = to + suffix; return; }
    const dur = 1100, t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
})();

/* ── SCROLL PROGRESS ───────────────────────────────────────── */
(() => {
  const bar = qs('#scrollBar');
  if (!bar) return;
  const set = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  };
  addEventListener('scroll', set, { passive: true });
  addEventListener('resize', set);
  set();
})();

/* ── COPY EMAIL ADDRESS ────────────────────────────────────── */
(() => {
  const btn = qs('#copyMail');
  if (!btn) return;
  const label = qs('.copy-label', btn);
  const original = label.textContent;
  btn.addEventListener('click', async () => {
    const mail = btn.dataset.mail;
    try {
      await navigator.clipboard.writeText(mail);
    } catch {
      // clipboard blocked (http, permissions): fall back to a selectable range
      const t = document.createElement('textarea');
      t.value = mail; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch {}
      t.remove();
    }
    label.textContent = 'Copied';
    btn.classList.add('is-done');
    setTimeout(() => { label.textContent = original; btn.classList.remove('is-done'); }, 2000);
  });
})();

/* ── HERO COLLAGE: gentle parallax ─────────────────────────── */
(() => {
  const cards = qsa('.hc');
  const hero = qs('.hero-collage');
  if (!hero || !cards.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (matchMedia('(hover: none)').matches) return;   // no parallax on touch

  const depth = [10, 6, 14, 8];
  addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    cards.forEach((c, i) => {
      const d = depth[i % depth.length];
      c.style.translate = `${(-x * d).toFixed(1)}px ${(-y * d * 0.5).toFixed(1)}px`;
    });
  }, { passive: true });
})();

/* ── CRAFT STRIP: duplicate for a seamless loop, pausable ──── */
(() => {
  const track = qs('.craft-track');
  const btn = qs('#craftPause');
  if (!track || !btn) return;
  track.innerHTML += track.innerHTML;          // second copy makes -50% seamless

  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render = () => {
    track.style.animationPlayState = paused ? 'paused' : 'running';
    btn.innerHTML = paused ? '&#9654;' : '&#10073;&#10073;';
    btn.setAttribute('aria-label', paused ? 'Play the craft strip' : 'Pause the craft strip');
  };
  render();
  btn.addEventListener('click', () => { paused = !paused; render(); });
})();
