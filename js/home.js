/* ============================================================
   SIDDHI MANCHE — homepage interactions (editorial redesign)
   ============================================================ */

'use strict';

const qs  = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];

/* ── NAV: border on scroll ─────────────────────────── */
const nav = qs('.topnav');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 10);
}, { passive: true });

/* ── NAV: active link ─────────────────────────────── */
const navLinks = qsa('.topnav-links a');
const sections = navLinks
  .map(a => qs(a.getAttribute('href')))
  .filter(Boolean);

const navSpy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navSpy.observe(s));

/* ── SCROLL REVEALS ───────────────────────────────── */
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

/* ── PHOTOBOOK: auto-flip ───────────────────────────── */
const stage = qs('#pbStage');
if (stage) {
  const imgs = qsa('img', stage);
  const cap = qs('#pbCap');
  const count = qs('#pbCount');
  const base = cap.textContent;
  let i = 0;

  imgs.forEach(img => img.removeAttribute('hidden'));
  imgs[0].classList.add('on');

  setInterval(() => {
    imgs[i].classList.remove('on');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('on');
    const c = imgs[i].dataset.cap;
    cap.textContent = c ? c.toUpperCase() : base;
    count.textContent = String(i + 1).padStart(2, '0') + ' / ' + imgs.length;
  }, 2600);
}

/* ── FAQ: close others on open ───────────────────────── */
qsa('.faq-item').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) qsa('.faq-item[open]').forEach(o => { if (o !== d) o.open = false; });
  });
});
