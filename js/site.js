/* Site behaviour: theme switch, live videos, chat, dock, sliders, reveal.
   Every feature is wrapped on its own, so one failure cannot take the page down.
   Content never depends on this file: without it, everything is simply visible. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function each(sel, fn, scope) { Array.prototype.forEach.call((scope || document).querySelectorAll(sel), fn); }
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn(e); } }

  /* ── Day / night ───────────────────────────────────────── */
  safe(function () {
    var meta = document.querySelector('meta[name="theme-color"]');
    function paint(t) {
      root.setAttribute('data-theme', t);
      if (meta) meta.setAttribute('content', t === 'night' ? '#0e1319' : '#f7f7f7');
      each('[data-theme-toggle]', function (b) {
        var night = t === 'night';
        // The name starts with the word on screen (WCAG 2.5.3, Label in Name).
        b.setAttribute('aria-label', night ? 'Night mode. Switch to day mode' : 'Day mode. Switch to night mode');
        b.setAttribute('aria-pressed', night ? 'true' : 'false');
        var ic = b.querySelector('.ic'); if (ic) ic.textContent = night ? '☾' : '☀';
        var tx = b.querySelector('.tx'); if (tx) tx.textContent = night ? 'Night' : 'Day';
      });
    }
    paint(root.getAttribute('data-theme') || 'day');
    each('[data-theme-toggle]', function (b) {
      b.addEventListener('click', function () {
        var t = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
        paint(t);
        try { localStorage.setItem('theme', t); } catch (e) {}
      });
    });
  });

  /* ── Live videos: play when on screen, pause control on each ─ */
  safe(function () {
    var vids = Array.prototype.slice.call(document.querySelectorAll('video[data-live]'));
    if (!vids.length) return;
    function label(v) {
      var b = v.parentNode.querySelector('.vbtn'); if (!b) return;
      var playing = !v.paused;
      b.innerHTML = playing ? '<span aria-hidden="true">&#10073;&#10073;</span> Pause' : '<span aria-hidden="true">&#9654;</span> Play';
      b.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + (v.getAttribute('aria-label') || 'video'));
    }
    function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () { label(v); }); }
    vids.forEach(function (v) {
      v.muted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.addEventListener('play', function () { label(v); });
      v.addEventListener('pause', function () { label(v); });
      var b = v.parentNode.querySelector('.vbtn');
      if (b) b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (v.paused) { v.dataset.user = 'play'; play(v); } else { v.dataset.user = 'pause'; v.pause(); }
      });
      label(v);
    });
    if (reduce || !('IntersectionObserver' in window)) { vids.forEach(function (v) { v.pause(); label(v); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { if (v.dataset.user !== 'pause') play(v); }
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { io.observe(v); });
  });

  /* ── Chat: messages arrive one at a time ─────────────────── */
  safe(function () {
    var chat = document.querySelector('.chat');
    if (!chat) return;
    var bubbles = Array.prototype.slice.call(chat.querySelectorAll('.bubble'));
    var typing = chat.querySelector('.typing');
    function done() { bubbles.forEach(function (b) { b.classList.add('is-in'); }); if (typing) typing.classList.add('is-gone'); root.classList.add('chat-done'); }
    if (reduce) { done(); return; }
    var i = 0;
    (function next() {
      if (i >= bubbles.length) { if (typing) typing.classList.add('is-gone'); root.classList.add('chat-done'); return; }
      var b = bubbles[i];
      if (typing) { b.parentNode.insertBefore(typing, b); typing.classList.remove('is-gone'); typing.classList.add('is-in'); }
      setTimeout(function () {
        if (typing) typing.classList.remove('is-in');
        b.classList.add('is-in'); i++;
        setTimeout(next, 420);
      }, i === 0 ? 500 : 650);
    })();
  });

  /* ── Ticker pause ────────────────────────────────────────── */
  safe(function () {
    each('.ticker', function (t) {
      var btn = t.parentNode.querySelector('.tick-btn');
      function set(paused) {
        t.classList.toggle('is-paused', paused);
        if (btn) { btn.textContent = paused ? 'Play' : 'Pause'; btn.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' the scrolling list'); }
      }
      set(!!reduce);
      if (btn) btn.addEventListener('click', function () { set(!t.classList.contains('is-paused')); });
    });
  });

  /* ── Dock + work/play switch follow the section in view ──── */
  safe(function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.dock a[href^="#"]'));
    var byId = {};
    links.forEach(function (a) { var id = a.getAttribute('href').slice(1); if (id) byId[id] = a; });
    var ids = Object.keys(byId);
    var knob = document.querySelector('.knob');
    var sw = Array.prototype.slice.call(document.querySelectorAll('.switch a'));
    if (!('IntersectionObserver' in window) || !ids.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-on'); a.removeAttribute('aria-current'); });
        var a = byId[en.target.id];
        if (a) { a.classList.add('is-on'); a.setAttribute('aria-current', 'true'); }
        if (knob && (en.target.id === 'work' || en.target.id === 'play')) {
          var play = en.target.id === 'play';
          knob.classList.toggle('is-play', play);
          sw.forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('href') === (play ? '#play' : '#work')); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    if (knob) knob.addEventListener('click', function () {
      var target = document.getElementById(knob.classList.contains('is-play') ? 'work' : 'play');
      if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ── Before / after drag sliders ────────────────────────── */
  safe(function () {
    each('[data-compare]', function (root) {
      var range = root.querySelector('.csx-range'); if (!range) return;
      var set = function (v) { root.style.setProperty('--pos', v + '%'); };
      set(range.value);
      range.addEventListener('input', function () { set(range.value); });
    });
  });

  /* ── Reveal on scroll (only once this script is running) ─── */
  safe(function () {
    if (reduce || !('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.rv');
    if (!els.length) return;
    root.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    each('.rv', function (el) { io.observe(el); });
  });
})();
