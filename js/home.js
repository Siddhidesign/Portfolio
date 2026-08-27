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

/* ── FILTER WORK BY METHOD / INDUSTRY ──────────────────────── */
(() => {
  const btns = qsa('.filter');
  const cards = qsa('.card[data-tags]');
  const status = qs('#filterStatus');
  if (!btns.length || !cards.length) return;

  // fill each chip's count from the actual card tags, so they can never drift
  btns.forEach(b => {
    const key = b.dataset.filter;
    const n = key === 'all'
      ? cards.length
      : cards.filter(c => c.dataset.tags.split(' ').includes(key)).length;
    b.querySelector('.filter-n').textContent = n;
    if (n === 0) b.hidden = true;
  });

  const apply = key => {
    let shown = 0;
    cards.forEach(card => {
      const match = key === 'all' || card.dataset.tags.split(' ').includes(key);
      if (match) shown++;
      card.classList.toggle('is-out', !match);
      // wait for the fade before removing from layout
      if (match) {
        card.classList.remove('is-hidden');
      } else {
        setTimeout(() => {
          if (card.classList.contains('is-out')) card.classList.add('is-hidden');
        }, 320);
      }
    });
    const label = btns.find(b => b.dataset.filter === key).textContent.replace(/\s+\d+$/, '').trim();
    status.textContent = key === 'all'
      ? `Showing all ${shown} projects`
      : `Showing ${shown} project${shown === 1 ? '' : 's'} tagged ${label}`;
  };

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    apply(btn.dataset.filter);
  }));
})();
