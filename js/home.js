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

/* ── PHOTOBOOK: auto-flip, pausable ────────────────────────── */
const stage = qs('#pbStage');
if (stage) {
  const imgs = qsa('img', stage);
  const cap = qs('#pbCap');
  const count = qs('#pbCount');
  const pauseBtn = qs('#pbPause');
  const base = cap.textContent;
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  let i = 0, timer = null;

  imgs.forEach(img => img.removeAttribute('hidden'));
  imgs[0].classList.add('on');

  const show = n => {
    imgs[i].classList.remove('on');
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add('on');
    const c = imgs[i].dataset.cap;
    cap.textContent = c ? c.toUpperCase() : base;
    count.textContent = String(i + 1).padStart(2, '0') + ' / ' + imgs.length;
  };

  const play = () => {
    if (timer) return;
    timer = setInterval(() => show(i + 1), 2600);
    pauseBtn.innerHTML = '&#10073;&#10073;';
    pauseBtn.setAttribute('aria-label', 'Pause photobook');
  };
  const stop = () => {
    clearInterval(timer); timer = null;
    pauseBtn.innerHTML = '&#9654;';
    pauseBtn.setAttribute('aria-label', 'Play photobook');
  };

  pauseBtn.addEventListener('click', () => (timer ? stop() : play()));
  // don't auto-advance for people who asked for less motion
  calm.matches ? stop() : play();
  calm.addEventListener('change', e => (e.matches ? stop() : play()));
}

/* ── FAQ: close others on open ─────────────────────────────── */
qsa('.faq-item').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) qsa('.faq-item[open]').forEach(o => { if (o !== d) o.open = false; });
  });
});
