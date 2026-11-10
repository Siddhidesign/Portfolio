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

  /* ---- 1c. Hero cube: starts scrambled; scrolling plays the solve, one real layer turn at a time ---- */
  const cubeArt = document.querySelector('.cube-art');
  if (cubeArt) {
    const cube = cubeArt.querySelector('.cube'), stage = cubeArt.querySelector('.cube-stage');
    // CSS axes: x right, y down, z toward viewer. U=-y white, D=+y yellow, F=+z green, B=-z blue, R=+x red, L=-x orange
    const COL = { px: '#FF5A5F', nx: '#FF9F43', ny: '#FFFFFF', py: '#FFD84D', pz: '#3DDC97', nz: '#4DA3FF' };
    const FACES = [['px', 'rotateY(90deg)'], ['nx', 'rotateY(-90deg)'], ['ny', 'rotateX(90deg)'], ['py', 'rotateX(-90deg)'], ['pz', ''], ['nz', 'rotateY(180deg)']];
    const I = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const mul = (A, B) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
    const app = (A, v) => A.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
    const rot = (ax, t) => { const c = Math.cos(t), s = Math.sin(t);
      return ax === 0 ? [[1, 0, 0], [0, c, -s], [0, s, c]] : ax === 1 ? [[c, 0, s], [0, 1, 0], [-s, 0, c]] : [[c, -s, 0], [s, c, 0], [0, 0, 1]]; };
    const snap = (A) => A.map((r) => r.map(Math.round));
    const cubies = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      const el = document.createElement('div'); el.className = 'cubie';
      FACES.forEach(([k, tf]) => {
        const out = (k === 'px' && x === 1) || (k === 'nx' && x === -1) || (k === 'py' && y === 1) || (k === 'ny' && y === -1) || (k === 'pz' && z === 1) || (k === 'nz' && z === -1);
        const f = document.createElement('i'); f.style.transform = tf + ' translateZ(calc(var(--s) / 2))';
        if (out) f.style.setProperty('--c', COL[k]); else f.className = 'in';
        el.appendChild(f);
      });
      cube.appendChild(el); cubies.push({ el, p0: [x, y, z] });
    }
    // [axis, layer, quarter turns]. Scramble once; the solve is the exact reverse.
    const SCRAMBLE = [[1, -1, 1], [0, 1, 1], [2, 1, -1], [0, -1, -1], [1, 1, 1], [2, -1, 1], [0, 1, -1], [1, -1, -1]];
    const SOLVE = SCRAMBLE.slice().reverse().map(([a, l, d]) => [a, l, -d]);
    const turn = (st, [a, l, d], t) => { const R = rot(a, d * t);
      return st.map((c) => c.p[a] === l ? { p: app(R, c.p), R: mul(R, c.R) } : c); };
    const full = (st, mv) => turn(st, mv, Math.PI / 2).map((c) => ({ p: c.p.map(Math.round), R: snap(c.R) }));
    let start = cubies.map((c) => ({ p: c.p0.slice(), R: I() }));
    SCRAMBLE.forEach((mv) => { start = full(start, mv); });
    const states = [start]; SOLVE.forEach((mv) => states.push(full(states[states.length - 1], mv)));
    let shown = -1, prog = 0, tilt = { x: 0, y: 0 }, tgoal = { x: 0, y: 0 };
    const ease = (f) => f < .5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
    const draw = (q) => {
      const k = Math.min(SOLVE.length, Math.floor(q)), f = q - k;
      const st = k < SOLVE.length && f > 0.001 ? turn(states[k], SOLVE[k], ease(f) * Math.PI / 2) : states[k];
      st.forEach((c, i) => { const R = c.R, p = c.p;
        cubies[i].el.style.transform = 'matrix3d(' + [R[0][0], R[1][0], R[2][0], 0, R[0][1], R[1][1], R[2][1], 0, R[0][2], R[1][2], R[2][2], 0].map((n) => n.toFixed(4)).join(',') +
          ',' + (S * p[0]).toFixed(2) + ',' + (S * p[1]).toFixed(2) + ',' + (S * p[2]).toFixed(2) + ',1)'; });
      cubeArt.classList.toggle('solved', q >= SOLVE.length - 0.001);
    };
    let S = 80;
    const size = () => { S = Math.round(cubeArt.clientWidth / 4.6); cubeArt.style.setProperty('--s', S + 'px'); if (shown >= 0) draw(shown); };
    size(); addEventListener('resize', size);
    // Input: auto-solve over 10s on load; drag / sideways scroll / slider take over.
    const N = SOLVE.length, range = cubeArt.querySelector('input');
    let goal = 0, lastInput = -1e9, t0 = performance.now(), dragX = null, prev = 0;
    const clamp = (v) => Math.max(0, Math.min(N, v));
    const setGoal = (v, fromUser) => { goal = clamp(v); if (fromUser) lastInput = performance.now(); range.value = Math.round(goal); };
    range.addEventListener('input', () => setGoal(+range.value, true));
    cubeArt.addEventListener('pointerdown', (e) => { if (e.target === range) return; dragX = e.clientX; cubeArt.setPointerCapture(e.pointerId); cubeArt.classList.add('grab'); });
    cubeArt.addEventListener('pointermove', (e) => { if (dragX === null) return;
      setGoal(goal + (e.clientX - dragX) / (cubeArt.clientWidth * 0.9) * N, true); dragX = e.clientX; });
    const end = () => { dragX = null; cubeArt.classList.remove('grab'); };
    cubeArt.addEventListener('pointerup', end); cubeArt.addEventListener('pointercancel', end);
    cubeArt.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); setGoal(goal + e.deltaX / 500 * N, true); }, { passive: false });
    if (reduced) {
      const step = () => { const q = Math.round(goal); if (q !== shown) { shown = q; draw(q); } requestAnimationFrame(step); };
      draw(0); shown = 0; requestAnimationFrame(step);
    } else {
      addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse' || dragX !== null) return;
        tgoal.x = (e.clientY / innerHeight - .5) * -14; tgoal.y = (e.clientX / innerWidth - .5) * 22; }, { passive: true });
      const loop = (now) => {
        // Auto-solve: 1.2s after load, and again 1.5s after anyone leaves it unsolved. Full solve takes 10s.
        const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
        if (dragX === null && goal < N && now - t0 > 1200 && now - lastInput > 1500) setGoal(goal + dt * N / 10);
        if (document.querySelector('.hero').getBoundingClientRect().bottom > 0) {
          prog += (goal - prog) * 0.1; if (Math.abs(goal - prog) < 0.002) prog = goal;
          if (prog !== shown) { shown = prog; draw(prog); }
          tilt.x += (tgoal.x - tilt.x) * .08; tilt.y += (tgoal.y - tilt.y) * .08;
          stage.style.transform = 'rotateX(' + (-26 + tilt.x).toFixed(2) + 'deg) rotateY(' + (-38 + tilt.y).toFixed(2) + 'deg)';
        }
        requestAnimationFrame(loop);
      };
      draw(0); requestAnimationFrame((n) => { prev = n; loop(n); });
    }
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

  /* ---- 8. Reading progress on case pages: a 3x3 cube face that fills sticker by sticker ---- */
  if (document.body.classList.contains('case')) {
    const rf = document.createElement('div');
    rf.className = 'readface'; rf.setAttribute('aria-hidden', 'true');
    rf.innerHTML = '<i></i>'.repeat(9);
    document.body.appendChild(rf);
    const cells = [...rf.children];
    const upd = () => {
      const max = doc.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, scrollY / max) : 0;
      const k = p > 0.995 ? 9 : Math.floor(p * 9);
      cells.forEach((c, i) => c.classList.toggle('on', i < k));
      rf.classList.toggle('done', k === 9);
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---- 8b. Sift: 16,767 reviews sifted into a fair 400-review sample, then averaged ---- */
  document.querySelectorAll('.viz-sift').forEach((fig) => {
    const cv = fig.querySelector('canvas'), ctx = cv.getContext('2d');
    const groups = JSON.parse(fig.dataset.groups), G = groups.length, PER = 80;
    const btns = [...fig.querySelectorAll('.sf-steps button')], LAST = btns.length - 1;
    let W = 0, H = 0, step = 0, timer = null, seen = false, raf = null;
    const rnd = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    // 900 dots: the first 400 are the real sample (80 per network); the rest only appear in the illustrative steps.
    const N = 900, dots = [];
    for (let i = 0; i < N; i++) {
      const sample = i < G * PER;
      dots.push({ g: sample ? Math.floor(i / PER) : Math.floor(rnd() * G), k: sample ? i % PER : -1, sample,
        drop: sample ? 99 : (rnd() < .45 ? 1 : rnd() < .5 ? 2 : 4),   // step at which a non-sample dot leaves
        rx: rnd(), ry: rnd(), x: 0, y: 0, a: 0, c: [138, 138, 150] });
    }
    const hex = (h) => [1, 3, 5].map((j) => parseInt(h.slice(j, j + 2), 16));
    const GC = groups.map((g) => hex(g[2]));
    const size = () => { const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1;
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const colX = (g) => W * (0.12 + g * 0.76 / (G - 1));
    const target = (p, t) => {
      const pad = 26;
      if (step >= 4 && p.sample) {                       // real sample: 5 columns of 8 x 10
        const cw = Math.min(9, (W * 0.13) / 8), col = p.k % 8, row = Math.floor(p.k / 8);
        const base = H - 44, full = H - 110;
        const hgt = step === 5 ? groups[p.g][1] / 5 * full : 10 * cw;
        return { x: colX(p.g) + (col - 3.5) * cw, y: base - (row + .5) * (hgt / 10), a: 1, c: GC[p.g] };
      }
      if (step >= p.drop || step >= 4) return { x: p.x, y: p.y + 6, a: 0, c: p.c };
      if (step === 3) {                                   // tagged: drift toward each network's zone
        const zx = colX(p.g), wob = Math.sin(t / 900 + p.rx * 9) * 4;
        return { x: zx + (p.rx - .5) * W * 0.13 + wob, y: pad + p.ry * (H - pad * 2), a: .9, c: GC[p.g] };
      }
      const j = step === 0 ? 7 : 3;                       // the messy cloud jitters; it calms as it gets cleaned
      return { x: pad + p.rx * (W - pad * 2) + Math.sin(t / 300 + p.ry * 40) * j, y: pad + p.ry * (H - pad * 2) + Math.cos(t / 340 + p.rx * 40) * j,
        a: step === 0 ? .55 : .75, c: [150, 150, 162] };
    };
    const draw = (t, snap) => {
      ctx.clearRect(0, 0, W, H);
      if (step === 5) groups.forEach((g, i) => {          // bar backs
        const full = H - 110, h = g[1] / 5 * full, w = Math.min(9, (W * 0.13) / 8) * 8 + 10;
        ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(colX(i) - w / 2, H - 44 - h, w, h);
      });
      dots.forEach((p) => { const q = target(p, t), k = snap ? 1 : .09;
        p.x += (q.x - p.x) * k; p.y += (q.y - p.y) * k; p.a += (q.a - p.a) * k; p.c = p.c.map((v, j) => v + (q.c[j] - v) * k);
        if (p.a < .02) return;
        ctx.globalAlpha = p.a; ctx.fillStyle = 'rgb(' + p.c.map(Math.round).join(',') + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, step >= 4 && p.sample ? Math.min(3.2, Math.min(9, (W * 0.13) / 8) * .42) : (W < 560 ? 1.8 : 2.4), 0, 7); ctx.fill(); });
      ctx.globalAlpha = 1;
      if (step >= 3) { ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'center';
        groups.forEach((g, i) => { ctx.fillStyle = 'rgba(255,255,255,.75)';
          ctx.fillText(W < 560 && g[0].length > 10 ? g[0].split(' ')[0] : g[0], colX(i), H - 20);
          if (step === 5) { const full = H - 110; ctx.font = '800 16px system-ui, sans-serif'; ctx.fillStyle = '#fff';
            ctx.fillText(g[1].toFixed(2), colX(i), H - 52 - g[1] / 5 * full); ctx.font = '600 12px system-ui, sans-serif'; } }); }
      ctx.textAlign = 'left'; ctx.font = '700 12px system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.55)';
      ctx.fillText(step < 4 ? 'ILLUSTRATION, NOT TO SCALE' : step === 4 ? '400 REVIEWS · 1 DOT EACH' : 'AVERAGE RATING OUT OF 5', 16, 24);
    };
    const go = (i) => { step = Math.max(0, Math.min(LAST, i));
      btns.forEach((b, j) => b.toggleAttribute('aria-current', false) || (j === step && b.setAttribute('aria-current', 'step')));
      if (reduced) draw(0, true); };
    const play = (from) => { clearInterval(timer); go(from);
      if (reduced) { go(LAST); return; }
      timer = setInterval(() => { if (step >= LAST) { clearInterval(timer); return; } go(step + 1); }, 2400); };
    btns.forEach((b) => b.addEventListener('click', () => { clearInterval(timer); go(+b.dataset.i); }));
    fig.querySelector('.sf-play').addEventListener('click', () => play(0));
    size(); dots.forEach((p) => { const q = target(p, 0); p.x = q.x; p.y = q.y; });
    addEventListener('resize', () => { size(); draw(performance.now(), true); });
    go(0);
    const loop = (t) => { draw(t, false); raf = requestAnimationFrame(loop); };
    if (reduced) draw(0, true); else raf = requestAnimationFrame(loop);
    new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting && !seen) { seen = true; play(0); } }), { threshold: .45 }).observe(fig);
  });

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
