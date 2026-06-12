/* ============================================================
   ALEX RIVERA — UX PORTFOLIO
   main.js — Interactions, Animations, Utilities
   ============================================================ */

'use strict';

/* ── UTILS ──────────────────────────────────────────────────── */
const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/* ── LOADER (case study pages only — welcome handles index) ──── */
(function initLoader() {
  const loader = qs('#loader');
  // Welcome screen on index.html is handled by initWelcome below
  if (!loader || loader.classList.contains('welcome')) return;

  document.body.style.overflow = 'hidden';

  const minTime = 2200;
  const start   = Date.now();

  function dismiss() {
    const elapsed = Date.now() - start;
    const delay   = Math.max(0, minTime - elapsed);
    setTimeout(() => {
      loader.classList.add('out');
      document.body.style.overflow = '';
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, delay);
  }

  if (document.readyState === 'complete') {
    dismiss();
  } else {
    window.addEventListener('load', dismiss, { once: true });
  }
})();


/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
(function initCursor() {
  const dot  = qs('#cursorDot');
  const ring = qs('#cursorRing');
  if (!dot || !ring) return;

  let mx = -200, my = -200;   // mouse position
  let rx = -200, ry = -200;   // ring position (lerped)

  // Hide on touch devices
  if ('ontouchstart' in window) {
    dot.style.display = ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring follow
  (function lerp() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerp);
  })();

  // Hover state
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .magnetic, [role="button"]')) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .magnetic, [role="button"]')) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '';
  });
})();


/* ── THEME TOGGLE ────────────────────────────────────────────── */
(function initTheme() {
  const btn  = qs('#themeBtn');
  const html = document.documentElement;

  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
})();


/* ── SCROLL PROGRESS BAR ─────────────────────────────────────── */
(function initScrollProgress() {
  const bar = qs('#scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();


/* ── NAV COMPACT ON SCROLL ───────────────────────────────────── */
(function initNav() {
  const nav = qs('#nav');
  if (!nav) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('compact', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ── TEXT SCRAMBLE ───────────────────────────────────────────── */
class TextScramble {
  constructor(el) {
    this.el     = el;
    this.orig   = el.textContent;
    this.chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·—/';
    this.raf    = null;
  }

  run() {
    cancelAnimationFrame(this.raf);
    const len   = this.orig.length;
    const steps = 10;
    let   frame = 0;

    const tick = () => {
      let out = '';
      for (let i = 0; i < len; i++) {
        const progress = frame / steps;
        if (progress > i / len) {
          out += this.orig[i];
        } else {
          out += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
      }
      this.el.textContent = out;
      if (frame < steps) {
        frame++;
        this.raf = requestAnimationFrame(tick);
      }
    };
    tick();
  }
}

(function initScramble() {
  qsa('.nav-link').forEach(link => {
    const ts = new TextScramble(link);
    link.addEventListener('mouseenter', () => ts.run());
    link.addEventListener('mouseleave', () => {
      cancelAnimationFrame(ts.raf);
      link.textContent = ts.orig;
    });
  });
})();


/* ── MAGNETIC BUTTONS ────────────────────────────────────────── */
(function initMagnetic() {
  const STRENGTH = 0.22;

  qsa('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      el.style.transform    = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
      el.style.transition   = 'transform .08s linear';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform  = 'translate(0, 0)';
      el.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
    });
  });
})();


/* ── SCROLL REVEAL (Intersection Observer) ───────────────────── */
(function initReveal() {
  const targets = qsa('.work-card, .p-step, .svc-card, .reveal-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, _) => {
      if (!entry.isIntersecting) return;

      // stagger siblings
      const siblings = [...entry.target.parentElement.children];
      const idx      = siblings.indexOf(entry.target);
      const delay    = clamp(idx * 100, 0, 500);

      setTimeout(() => entry.target.classList.add('in'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
})();


/* ── COUNTER ANIMATION ───────────────────────────────────────── */
(function initCounters() {
  const counters = qsa('.stat-n[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const dur    = 1400; // ms
      const start  = performance.now();

      // easeOutExpo
      const ease = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      const step = now => {
        const t   = clamp((now - start) / dur, 0, 1);
        const val = Math.round(ease(t) * target);
        el.textContent = val;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ── SECTION TITLE REVEAL ────────────────────────────────────── */
(function initTitleReveal() {
  const titles = qsa('.section-title');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'none';
      entry.target.style.filter    = 'blur(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  titles.forEach(t => {
    t.style.cssText = `
      opacity: 0;
      transform: translateY(28px);
      filter: blur(6px);
      transition: opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1), filter .85s cubic-bezier(.16,1,.3,1);
    `;
    observer.observe(t);
  });
})();


/* ── CONTACT TITLE LINE REVEAL ───────────────────────────────── */
(function initContactReveal() {
  const title = qs('.contact-title');
  if (!title) return;

  const masks = qsa('.line-mask', title);
  masks.forEach(m => {
    const inner = qs('.line-inner', m);
    if (inner) {
      inner.style.cssText = `
        display: block;
        transform: translateY(110%);
        transition: transform .95s cubic-bezier(.16,1,.3,1);
      `;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    masks.forEach((m, i) => {
      const inner = qs('.line-inner', m);
      if (inner) {
        setTimeout(() => { inner.style.transform = 'none'; }, i * 160);
      }
    });
    observer.unobserve(title);
  }, { threshold: 0.25 });

  observer.observe(title);
})();


/* ── HERO PARALLAX ───────────────────────────────────────────── */
(function initParallax() {
  const inner  = qs('.hero-inner');
  const bgText = qs('.hero-bg-text');
  if (!inner) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const vh = window.innerHeight;

      // Fade + float hero content as you scroll
      if (sy < vh) {
        const progress = sy / vh;
        inner.style.transform = `translateY(${sy * 0.12}px)`;
        inner.style.opacity   = String(clamp(1 - progress * 1.6, 0, 1));
      }

      // Opposite direction for watermark
      if (bgText && sy < vh) {
        bgText.style.transform = `translateY(calc(-50% + ${sy * 0.06}px))`;
      }

      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();


/* ── MARQUEE PAUSE ON HOVER ──────────────────────────────────── */
(function initMarquee() {
  const track = qs('.marquee-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


/* ── CURSOR TEXT ON WORK CARDS ───────────────────────────────── */
(function initWorkCursorText() {
  // On project hover, subtly shift ring colour
  qsa('.work-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const ring = qs('#cursorRing');
      if (ring) {
        ring.style.borderColor = 'var(--gold)';
        ring.style.transform   = 'translate(-50%, -50%) scale(1.4)';
      }
    });

    card.addEventListener('mouseleave', () => {
      const ring = qs('#cursorRing');
      if (ring) {
        ring.style.borderColor = '';
        ring.style.transform   = '';
      }
    });
  });
})();


/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────────── */
(function initAnchorScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ── TOOLS LIST HOVER RIPPLE ─────────────────────────────────── */
(function initToolsHover() {
  qsa('.tools-list span').forEach((span, i) => {
    span.style.transitionDelay = `${i * 30}ms`;
  });
})();


/* ── ACTIVE NAV HIGHLIGHT ────────────────────────────────────── */
(function initActiveNav() {
  const sections = qsa('section[id]');
  const links    = qsa('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(l => {
        const active = l.getAttribute('href') === `#${id}`;
        l.style.color = active ? 'var(--text)' : '';
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ── WELCOME SCREEN SEQUENCE ─────────────────────────────────── */
(function initWelcome() {
  const welcome = qs('#loader');
  if (!welcome || !welcome.classList.contains('welcome')) return;

  // Prevent any scroll while welcome is up
  document.body.style.overflow = 'hidden';

  // Fire the progress bar fill after a short delay
  const bar = qs('#welcomeBar');
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (bar) bar.classList.add('fill');
    }, 50);
  });

  // Dismiss sequence — wait for content to load + min display time
  const minTime = 2400;
  const start   = Date.now();

  function dismiss() {
    const elapsed = Date.now() - start;
    const wait    = Math.max(0, minTime - elapsed);
    setTimeout(() => {
      welcome.classList.add('out');
      document.body.style.overflow = '';
      welcome.addEventListener('transitionend', () => {
        welcome.remove();
      }, { once: true });
    }, wait);
  }

  if (document.readyState === 'complete') {
    dismiss();
  } else {
    window.addEventListener('load', dismiss, { once: true });
  }
})();


/* ── PAGE EXIT TRANSITION ────────────────────────────────────── */
(function initPageTransitions() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href) return;

    // Only internal same-origin links (not anchors, not external)
    if (
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      a.target === '_blank'
    ) return;

    e.preventDefault();
    document.body.classList.add('page-exit');

    setTimeout(() => {
      window.location.href = href;
    }, 340);
  });
})();


/* ── CURSOR SPOTLIGHT ────────────────────────────────────────── */
(function initSpotlight() {
  const spot = document.createElement('div');
  spot.className = 'cursor-spotlight';
  document.body.appendChild(spot);

  document.addEventListener('mousemove', e => {
    spot.style.left = e.clientX + 'px';
    spot.style.top  = e.clientY + 'px';
  });
})();


/* ── 3-D CARD TILT ───────────────────────────────────────────── */
(function initCardTilt() {
  const TILT  = 4;   // max degrees — refined, not carnival
  const SCALE = 1.012;

  qsa('.work-card').forEach(card => {
    let rafId;

    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left)  / r.width  - 0.5;
        const y  = (e.clientY - r.top)   / r.height - 0.5;
        card.style.transform    = `perspective(900px) rotateY(${x * TILT}deg) rotateX(${-y * TILT}deg) scale(${SCALE})`;
        card.style.transition   = 'transform .08s linear, opacity .75s var(--ease)';
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      card.style.transform  = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)';
      card.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), opacity .75s var(--ease)';
    });
  });
})();


/* ── AMBIENT HERO GLOWS (breathing) ──────────────────────────── */
(function initHeroGlows() {
  const hero = qs('.hero');
  if (!hero) return;

  const g1 = document.createElement('div');
  g1.className = 'hero-glow-pulse g1';
  const g2 = document.createElement('div');
  g2.className = 'hero-glow-pulse g2';

  hero.prepend(g2);
  hero.prepend(g1);
})();


/* ── TYPING CURSOR on hero title ─────────────────────────────── */
(function initHeroCursor() {
  const lastMask = qs('.hero-title .line-mask:last-child .line-inner');
  if (!lastMask) return;

  const cur = document.createElement('span');
  cur.className    = 'hero-cursor';
  cur.setAttribute('aria-hidden', 'true');
  lastMask.appendChild(cur);

  // Remove cursor on any scroll (it's served its purpose)
  window.addEventListener('scroll', () => cur.remove(), { once: true, passive: true });
})();


/* ── HERO MOUSE PARALLAX (subtle layers) ─────────────────────── */
(function initHeroMouseParallax() {
  const hero   = qs('.hero');
  const bgTxt  = qs('.hero-bg-text');
  if (!hero || !bgTxt) return;

  let rafId;

  hero.addEventListener('mousemove', e => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const r  = hero.getBoundingClientRect();
      const cx = (e.clientX - r.left)  / r.width  - 0.5;
      const cy = (e.clientY - r.top)   / r.height - 0.5;
      bgTxt.style.transform = `translateY(-50%) translate(${cx * -18}px, ${cy * -10}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    cancelAnimationFrame(rafId);
    bgTxt.style.transform = 'translateY(-50%)';
    bgTxt.style.transition = 'transform .8s var(--ease)';
    setTimeout(() => { bgTxt.style.transition = ''; }, 800);
  });
})();


/* ── HERO TITLE — PER-LETTER HOVER ───────────────────────────── */
(function initHeroLetters() {
  if ('ontouchstart' in window) return;

  qsa('.hero-title .line-inner').forEach(inner => {
    [...inner.childNodes].forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const frag = document.createDocumentFragment();
      [...node.textContent].forEach(ch => {
        if (ch.trim() === '') {
          frag.appendChild(document.createTextNode(ch));
        } else {
          const s = document.createElement('span');
          s.className = 'hero-char';
          s.textContent = ch;
          frag.appendChild(s);
        }
      });
      inner.replaceChild(frag, node);
    });
  });
})();


/* ── WORK CARD IMAGE PARALLAX (scroll-linked) ────────────────── */
(function initWorkParallax() {
  const imgs = qsa('.work-img .work-ph, .work-img .work-media');
  if (!imgs.length) return;

  let ticking = false;

  function update() {
    const vh = window.innerHeight;
    imgs.forEach(el => {
      const r = el.closest('.work-img').getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const center = r.top + r.height / 2;
      const offset = ((center - vh / 2) / vh) * -14; // px, subtle
      el.style.setProperty('--py', offset.toFixed(2) + 'px');
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
})();


/* ── BACK TO TOP ─────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-top magnetic';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      btn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();


/* ── CASE STUDY IMAGE REVEALS ────────────────────────────────── */
(function initImageReveals() {
  const imgs = qsa('.cs-section img, .cs-proto img, .cs-screens img, .cs-img-ph');
  if (!imgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  imgs.forEach(img => {
    img.classList.add('img-rvl');
    observer.observe(img);
  });
})();


/* ── CASE STUDY LIGHTBOX (click to zoom) ─────────────────────── */
(function initLightbox() {
  const imgs = qsa('.cs-section img, .cs-proto img, .cs-screens img');
  if (!imgs.length) return;

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = '<img alt="" /><div class="lightbox-cap"></div><button class="lightbox-x" aria-label="Close">×</button>';
  document.body.appendChild(box);

  const boxImg = qs('img', box);
  const boxCap = qs('.lightbox-cap', box);

  function open(src, alt) {
    boxImg.src = src;
    boxImg.alt = alt || '';
    boxCap.textContent = alt || '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
  }

  imgs.forEach(img => {
    img.classList.add('zoomable');
    img.addEventListener('click', () => open(img.currentSrc || img.src, img.alt));
  });

  box.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && box.classList.contains('open')) close();
  });
})();


/* ── CASE STUDY STAT COUNTERS ────────────────────────────────── */
(function initCsCounters() {
  const stats = qsa('.cs-stat-n, .cs-stat-big');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);

      const m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return; // non-numeric (e.g. "IRB") — leave as is

      const target = parseInt(m[1], 10);
      const suffix = m[2] || '';
      const dur    = 1200;
      const start  = performance.now();
      const ease   = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      const step = now => {
        const t = clamp((now - start) / dur, 0, 1);
        el.textContent = Math.round(ease(t) * target) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();


/* ── HERO VIDEO — REDUCED MOTION RESPECT ─────────────────────── */
(function initHeroVideo() {
  const video = qs('#heroVideo');
  if (!video) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }
})();


/* ── PHOTO BAND PARALLAX ─────────────────────────────────────── */
(function initPhotoBand() {
  const band = qs('.photo-band');
  const bg   = qs('.photo-band-bg');
  if (!band || !bg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function update() {
    const r  = band.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) { ticking = false; return; }
    const progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
    bg.style.setProperty('--pb', (progress * 60).toFixed(1) + 'px');
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
})();


/* ── CASE STUDY PROGRESS DOTS ────────────────────────────────── */
(function initCsProgressDots() {
  const sections = qsa('.cs-section, .cs-hero, .cs-proto');
  if (!sections.length) return;

  const container = document.createElement('nav');
  container.className = 'cs-progress-dots';
  container.setAttribute('aria-label', 'Section navigation');

  sections.forEach((sec, i) => {
    const dot = document.createElement('button');
    dot.className = 'cs-pd';
    dot.setAttribute('aria-label', `Section ${i + 1}`);
    dot.addEventListener('click', () => {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    container.appendChild(dot);
  });

  document.body.appendChild(container);

  const dots = qsa('.cs-pd', container);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = sections.indexOf(entry.target);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    });
    container.classList.add('visible');
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();
