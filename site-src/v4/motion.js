/* Portfolio motion: splash, staggered reveals, hero parallax, tilting section panels,
   tooltips, hover image previews, play-once videos, case-page reading progress.
   Everything is additive: with JavaScript off or reduced motion on, the page is complete and still. */
(() => {
  'use strict';
  const doc = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = () => matchMedia('(min-width: 901px)').matches;
  const isHome = document.body.classList.contains('home');

  /* ---- 1. Splash, home page, once per visit ---- */
  if (isHome && !reduced) {
    let seen = false;
    try { seen = sessionStorage.getItem('sm-splash') === '1'; sessionStorage.setItem('sm-splash', '1'); } catch (e) { seen = true; }
    if (!seen) {
      const s = document.createElement('div');
      s.className = 'splash';
      s.setAttribute('aria-hidden', 'true');
      s.innerHTML = '<svg viewBox="0 0 80 80"><circle class="sp-track" cx="40" cy="40" r="36"/><circle class="sp-ring" cx="40" cy="40" r="36"/>'
        + '<text x="40" y="51" text-anchor="middle" class="sp-base">SM</text>'
        + '<clipPath id="sp-clip"><rect class="sp-mask" x="0" y="18" width="80" height="48"/></clipPath>'
        + '<text x="40" y="51" text-anchor="middle" class="sp-fill" clip-path="url(#sp-clip)">SM</text></svg>';
      document.body.appendChild(s);
      doc.classList.add('splashing');
      setTimeout(() => { s.classList.add('out'); doc.classList.remove('splashing'); }, 1100);
      setTimeout(() => s.remove(), 1800);
    }
  }

  /* ---- 1b. Headline: 'messy' jumbles at the top of the page, snaps into line as you scroll or hover ---- */
  const heroBand = document.querySelector('.hero');
  if (heroBand && heroBand.querySelector('.w-messy') && !reduced) {
    const h1 = heroBand.querySelector('h1');
    const hint = document.createElement('span');
    hint.className = 'hint'; hint.setAttribute('aria-hidden', 'true'); hint.textContent = 'Scroll to clear it up ↓';
    h1.after(hint);
    let hover = false;
    const set = () => heroBand.classList.toggle('jumbled', scrollY < 40 && !hover);
    h1.addEventListener('mouseenter', () => { hover = true; set(); });
    h1.addEventListener('mouseleave', () => { hover = false; set(); });
    addEventListener('scroll', set, { passive: true });
    set();
  }

  /* ---- 2. Staggered reveals ---- */
  const groups = [
    // [selector, base delay ms, stagger ms, immediate]
    ['.hero .mega', 0, 0, true], ['.intro .h2', 220, 0, true], ['.intro .social', 300, 0, true], ['.intro .igrid p', 380, 80, true],
    ['.panel .eyebrow', 0, 0], ['.big', 90, 0], ['.bento .bcard', 0, 110],
    ['.more .mega', 0, 0], ['.more .caps', 100, 0], ['.tilt .bcard', 0, 140],
    ['.grey .mega', 0, 0], ['.how li', 0, 120], ['.tools-h', 0, 0], ['.marquee', 80, 0],
    ['#about .mega', 0, 0], ['#about .lead', 0, 90], ['#about .rule', 0, 70], ['.tl li', 0, 80], ['.aside', 140, 0],
    ['.contact .eyebrow', 0, 0], ['.contact .mega', 90, 0], ['.contact .social', 180, 0], ['.cside > *', 0, 90],
    // case pages
    ['.chead .back', 0, 0, true], ['.chead .mega', 60, 0, true], ['.chead .sub', 160, 0, true], ['.chead .pills', 220, 0, true], ['.cmeta', 300, 0, true],
    ['.cover', 0, 0], ['.sec .shead', 0, 0], ['.goals li', 0, 110], ['.phase', 0, 90], ['.viz', 0, 0], ['.cards li', 0, 90],
    ['.qcards li', 0, 90], ['.insight', 0, 0], ['.flow', 0, 120], ['.twist', 0, 0], ['.rej li', 0, 100], ['.gres li', 0, 90],
    ['.sec table', 0, 0], ['.sec .fig', 0, 0], ['.lesson', 0, 0], ['.nextp .bcard', 0, 120]
  ];
  const items = [];
  groups.forEach(([sel, base, step, now]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (el.classList.contains('rv')) return;
      el.classList.add('rv');
      el.style.setProperty('--d', (base + i * step) + 'ms');
      if (now) el.dataset.now = '1';
      items.push(el);
    });
  });
  const show = (el) => el.classList.add('in');
  if (reduced) items.forEach(show);
  else {
    // Reveal anything that has reached the lower part of the screen OR been scrolled past,
    // so fast scrolling or menu jumps never leave a section invisible.
    let pending = items.filter((el) => !el.dataset.now);
    const sweep = () => {
      if (!pending.length) return;
      const line = innerHeight * 0.92;
      pending = pending.filter((el) => { if (el.getBoundingClientRect().top < line) { show(el); return false; } return true; });
    };
    const wait = doc.classList.contains('splashing') ? 900 : 0;
    setTimeout(() => { items.filter((el) => el.dataset.now).forEach(show); sweep(); }, wait);
    let queued = false;
    const onSweep = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; sweep(); }); } };
    addEventListener('scroll', onSweep, { passive: true });
    addEventListener('resize', onSweep, { passive: true });
    addEventListener('load', onSweep);
  }

  /* ---- 3. Hero parallax + 4. tilting section panels (desktop) ---- */
  const hero = document.querySelector('.hero .mega');
  const panels = [...document.querySelectorAll('.more, .panel.grey, #about, .contact')];
  const rolls = new Map([[panels[0], 0.8], [panels[1], 0.6], [panels[2], 0.4], [panels[3], 0.5]]);
  let ticking = false;
  const frame = () => {
    ticking = false;
    if (reduced || !desktop()) {
      if (hero) hero.style.transform = '';
      panels.forEach((p) => { p.style.transform = ''; });
      return;
    }
    const vh = innerHeight;
    if (hero) hero.style.transform = 'translateY(' + Math.min(scrollY * 0.32, vh * 0.5).toFixed(1) + 'px)';
    panels.forEach((p) => {
      const r = p.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const d = (r.top + Math.min(r.height, vh) / 2) - vh / 2;
      const ty = Math.max(-80, Math.min(80, -d * 0.06));
      const rot = Math.max(-1.4, Math.min(1.4, (d / vh) * (rolls.get(p) || 0.5)));
      p.style.transform = 'translateY(' + ty.toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg)';
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  frame();

  /* ---- 5. Tooltips for icon buttons ([data-tip]) ---- */
  const tip = document.createElement('div');
  tip.className = 'tip'; tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);
  const tipOn = (el) => {
    const r = el.getBoundingClientRect();
    tip.textContent = el.dataset.tip;
    tip.style.left = (r.left + r.width / 2) + 'px';
    tip.style.top = (r.bottom + 10) + 'px';
    tip.classList.add('on');
  };
  const tipOff = () => tip.classList.remove('on');
  document.addEventListener('mouseover', (e) => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el) tipOn(el); });
  document.addEventListener('mouseout', (e) => { if (e.target.closest && e.target.closest('[data-tip]')) tipOff(); });
  document.addEventListener('focusin', (e) => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el && el.matches(':focus-visible')) tipOn(el); else tipOff(); });
  addEventListener('scroll', tipOff, { passive: true });

  /* ---- 6. Hover image previews ([data-preview]) ---- */
  if (!reduced && matchMedia('(hover: hover)').matches) {
    const pv = document.createElement('div');
    pv.className = 'peek'; pv.setAttribute('aria-hidden', 'true'); pv.innerHTML = '<img alt="">';
    document.body.appendChild(pv);
    const img = pv.querySelector('img');
    let active = null;
    const place = (x, y) => {
      const w = 260, h = 170, g = 24;
      let l = x + g, t = y - h / 2;
      if (l + w > innerWidth - 12) l = x - w - g;
      t = Math.max(12, Math.min(t, innerHeight - h - 12));
      pv.style.left = l + 'px'; pv.style.top = t + 'px';
    };
    document.addEventListener('mouseover', (e) => {
      const a = e.target.closest && e.target.closest('[data-preview]');
      if (!a) return;
      active = a; img.src = a.dataset.preview; place(e.clientX, e.clientY); pv.classList.add('on');
    });
    document.addEventListener('mousemove', (e) => {
      if (!active) return;
      if (!active.contains(e.target)) { active = null; pv.classList.remove('on'); return; }
      place(e.clientX, e.clientY);
    }, { passive: true });
    addEventListener('scroll', () => { active = null; pv.classList.remove('on'); }, { passive: true });
  }

  /* ---- 7. Videos play once when scrolled into view ---- */
  document.querySelectorAll('video[data-once]').forEach((v) => {
    v.muted = true;
    if (reduced) return;  // controls stay available; nothing plays by itself
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.disconnect(); v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => {});
    }), { threshold: 0.55 });
    io.observe(v);
  });

  /* ---- 8. Reading progress on case pages ---- */
  if (document.body.classList.contains('case')) {
    const bar = document.createElement('div');
    bar.className = 'readbar'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const upd = () => {
      const max = doc.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---- 9. Photo tilts toward the cursor ---- */
  const photo = document.querySelector('.aside img');
  if (photo && !reduced && matchMedia('(hover: hover)').matches) {
    const box = photo.parentElement;
    box.addEventListener('mousemove', (e) => {
      const r = photo.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      photo.style.transform = 'perspective(800px) rotateY(' + (x * 10).toFixed(1) + 'deg) rotateX(' + (-y * 10).toFixed(1) + 'deg) rotate(1deg)';
    });
    box.addEventListener('mouseleave', () => { photo.style.transform = ''; });
  }
})();
