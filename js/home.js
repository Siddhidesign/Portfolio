/* ============================================================
   SIDDHI MANCHE — homepage interactions (Swiss minimal)
   ============================================================ */

'use strict';

const qs  = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];

/* ── SCROLL REVEALS ─────────────────────────────────────────── */
(function initReveal() {
  const targets = qsa('.rv');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('in'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('rv'));
      const delay = Math.min(Math.max(siblings.indexOf(entry.target), 0) * 90, 450);
      setTimeout(() => entry.target.classList.add('in'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => obs.observe(t));
})();

/* ── MARQUEE — duplicate tracks for seamless loop ───────────── */
(function initMarquee() {
  qsa('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });
})();

/* ── ACCORDION ──────────────────────────────────────────────── */
(function initAccordion() {
  qsa('.acc').forEach(acc => {
    const head = qs('.acc-head', acc);
    const body = qs('.acc-body', acc);
    if (!head || !body) return;

    head.addEventListener('click', () => {
      const isOpen = acc.classList.contains('open');

      // close others
      qsa('.acc.open').forEach(other => {
        if (other === acc) return;
        other.classList.remove('open');
        qs('.acc-head', other).setAttribute('aria-expanded', 'false');
        qs('.acc-body', other).style.maxHeight = '0px';
      });

      acc.classList.toggle('open', !isOpen);
      head.setAttribute('aria-expanded', String(!isOpen));
      body.style.maxHeight = isOpen ? '0px' : body.scrollHeight + 'px';
    });
  });
})();

/* ── ACTIVE NAV LINK ────────────────────────────────────────── */
(function initActiveNav() {
  const links = qsa('.nav a.link');
  const map = new Map();

  links.forEach(l => {
    const sec = qs(l.getAttribute('href'));
    if (sec) map.set(sec, l);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const link = map.get(entry.target);
      if (link) link.classList.add('active');
    });
  }, { threshold: 0.25 });

  map.forEach((_, sec) => obs.observe(sec));
})();

/* ── DOCK — hide near footer ────────────────────────────────── */
(function initDock() {
  const dock   = qs('#dock');
  const footer = qs('.footer');
  if (!dock || !footer) return;

  const obs = new IntersectionObserver(entries => {
    dock.classList.toggle('hide', entries[0].isIntersecting);
  }, { threshold: 0.18 });

  obs.observe(footer);
})();

/* ── PHOTOBOOK — auto page-turn ─────────────────────────────── */
(function initPhotobook() {
  const book = qs('#photobook');
  if (!book) return;

  const pics  = Array.from(book.querySelectorAll('img'));
  const count = book.querySelector('.pb-count');
  if (pics.length < 2) return;

  const INTERVAL = 2600;
  let i = 0, timer = null, visible = false;

  function step() {
    const cur  = pics[i];
    const next = pics[(i + 1) % pics.length];

    cur.classList.remove('active');
    cur.classList.add('leaving');
    cur.addEventListener('animationend', () => cur.classList.remove('leaving'), { once: true });

    next.classList.add('active');
    i = (i + 1) % pics.length;

    if (count) count.textContent = String(i + 1).padStart(2, '0') + ' / ' + pics.length;
  }

  function start() { if (!timer && visible) timer = setInterval(step, INTERVAL); }
  function stop()  { clearInterval(timer); timer = null; }

  /* reduced motion: no auto-turn — tap/click flips a page instead */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    book.style.cursor = 'pointer';
    book.addEventListener('click', step);
    return;
  }

  /* only turn pages while the book is on screen */
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    visible ? start() : stop();
  }, { threshold: 0.25 }).observe(book);

  /* pause on hover so visitors can enjoy a photo in colour */
  book.addEventListener('mouseenter', stop);
  book.addEventListener('mouseleave', start);
})();

/* ── ROTATING ROLE TITLE (typewriter) ───────────────────────── */
(function initRoleRotate() {
  const el = qs('.role-rotate');
  if (!el) return;

  const roles = [
    'UI Designer',
    'UX Designer',
    'Product Designer',
    'UX Analyst',
    'UX Researcher',
    'Front End Developer',
  ];

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    // Cycle text without per-character animation.
    let i = 0;
    el.textContent = roles[0];
    setInterval(() => {
      i = (i + 1) % roles.length;
      el.textContent = roles[i];
    }, 2200);
    return;
  }

  const TYPE = 70;      // ms per character typed
  const ERASE = 40;     // ms per character erased
  const HOLD = 1400;    // ms to hold a full word
  const PAUSE = 350;    // ms before typing next word

  let idx = 1;          // "UX Designer" is pre-rendered in the HTML; erase it first
  let char = roles[idx].length;
  let deleting = true;

  function tick() {
    const word = roles[idx];
    if (deleting) {
      char--;
      el.textContent = word.slice(0, char);
      if (char === 0) {
        deleting = false;
        idx = (idx + 1) % roles.length;
        setTimeout(tick, PAUSE);
        return;
      }
      setTimeout(tick, ERASE);
    } else {
      char++;
      el.textContent = roles[idx].slice(0, char);
      if (char === roles[idx].length) {
        deleting = true;
        setTimeout(tick, HOLD);
        return;
      }
      setTimeout(tick, TYPE);
    }
  }

  setTimeout(tick, HOLD);
})();
