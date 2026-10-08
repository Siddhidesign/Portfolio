/* Code + live preview (cases/omkar.html, the Omkar Labels rebuild).
   File tabs, copy buttons, a preview that scales to phone, tablet or desktop
   size, and six notes that run their code in the preview. The preview is on
   the same site, so a note can open its menu, submit its form or read its
   page head. Without JavaScript every file shows in full and the preview
   still loads; nothing here is needed to read the page. */
(function () {
  'use strict';
  var root = document.querySelector('[data-cv]');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $$(sel, scope) { return Array.prototype.slice.call((scope || root).querySelectorAll(sel)); }

  /* ── 1. File tabs (ARIA tabs: arrows, Home, End) ─────────── */
  var tabs = $$('.cv-tab');
  function panelFor(tab) { return document.getElementById(tab.getAttribute('aria-controls')); }
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panelFor(t).hidden = !on;
    });
    var strip = tab.parentNode, l = tab.offsetLeft, r = l + tab.offsetWidth;
    if (l < strip.scrollLeft || r > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = Math.max(0, l - 16);
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (j === null) return;
      e.preventDefault();
      selectTab(tabs[(j + tabs.length) % tabs.length], true);
    });
  });
  if (tabs.length) selectTab(tabs[0]);

  /* ── 2. Copy an excerpt (without line numbers) ──────────── */
  $$('.cv-copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = $$('.cv-l', b.closest('.cv-panel')).map(function (l) {
        var c = l.cloneNode(true);
        $$('.cv-n, .cv-pin', c).forEach(function (x) { x.parentNode.removeChild(x); });
        return c.textContent;
      }).join('\n');
      function done(ok) { b.textContent = ok ? 'Copied' : 'Copy failed'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  });

  /* ── 3. The preview: device sizes, address bar, inspector ── */
  var frame = root.querySelector('.cv-frame'), stage = root.querySelector('.cv-stage');
  var urlEl = root.querySelector('[data-cv-url]'), openEl = root.querySelector('.cv-open'), out = root.querySelector('.cv-out-t');
  var BASE = frame.getAttribute('data-base');
  var DEV = { phone: [390, 844, 'Phone'], tablet: [768, 1024, 'Tablet'], desktop: [1440, 900, 'Desktop'] };
  var dev = 'desktop';

  function fit() {
    var d = DEV[dev], w = stage.clientWidth || 600;
    var maxH = Math.max(380, Math.min(640, window.innerHeight * 0.7));
    var s = Math.min(1, w / d[0], maxH / d[1]);
    stage.style.setProperty('--cv-w', d[0] + 'px');
    stage.style.setProperty('--cv-h', d[1] + 'px');
    stage.style.setProperty('--cv-s', String(s));
    stage.style.setProperty('--cv-sh', Math.round(d[1] * s) + 'px');
    stage.style.setProperty('--cv-x', Math.max(0, Math.round((w - d[0] * s) / 2)) + 'px');
  }
  function setDev(name) {
    dev = name;
    $$('[data-dev]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-dev') === name)); });
    fit();
  }
  $$('[data-dev]').forEach(function (b) {
    b.addEventListener('click', function () {
      setDev(b.getAttribute('data-dev'));
      say(DEV[dev][2] + ' size: ' + DEV[dev][0] + ' by ' + DEV[dev][1] + ' pixels, scaled to fit.');
    });
  });
  window.addEventListener('resize', fit);
  setDev(stage.clientWidth < 560 ? 'phone' : 'desktop'); // on a phone, start at phone size so the preview is readable

  function win() {
    try { var w = frame.contentWindow; return w && w.document && w.document.documentElement ? w : null; } catch (e) { return null; }
  }
  function syncUrl() {
    var w = win(), path = '';
    if (w) { var m = w.location.pathname.match(/omkar-rebuild\/(.*)$/); path = m ? m[1] : ''; }
    urlEl.textContent = 'omkar-rebuild/' + path;
    openEl.href = BASE + path;
  }
  frame.addEventListener('load', syncUrl);

  function say(text) { out.textContent = text; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function until(test, ms) {
    return new Promise(function (resolve) {
      var t0 = Date.now();
      (function tick() {
        var v = null;
        try { v = test(); } catch (e) { v = null; }
        if (v || Date.now() - t0 > (ms || 4000)) resolve(v); else setTimeout(tick, 50);
      })();
    });
  }
  function go(path) {
    return new Promise(function (resolve) {
      var done = false;
      function finish() { if (done) return; done = true; frame.removeEventListener('load', finish); resolve(); }
      frame.addEventListener('load', finish);
      frame.setAttribute('loading', 'eager');
      frame.src = BASE + path;
      setTimeout(finish, 9000);
    });
  }
  /* React handlers only work once the page has hydrated; React marks hydrated nodes. */
  function hydrated(el) {
    return until(function () { return el && Object.keys(el).some(function (k) { return k.indexOf('__reactProps') === 0; }) && el; }, 6000);
  }
  function label(d, el) {
    if (!el || el === d.body) return 'the page';
    var aria = el.getAttribute('aria-label'); if (aria) return aria;
    if (el.id) { var l = d.querySelector('label[for="' + el.id + '"]'); if (l) return l.textContent.replace(/\s*\*\s*$/, '').trim(); }
    return (el.textContent || el.tagName).trim().slice(0, 40);
  }
  function tag(el, names) {
    return '<' + el.tagName.toLowerCase() + names.map(function (a) { var v = el.getAttribute(a); return v === null ? '' : ' ' + a + '="' + v + '"'; }).join('') + '>';
  }

  var marked = [];
  function mark(els, w) {
    marked.forEach(function (el) { try { el.removeAttribute('data-cv-mark'); } catch (e) {} });
    marked = (els || []).filter(Boolean);
    var d = w.document;
    if (!d.getElementById('cv-mark-css') && d.head) {
      var st = d.createElement('style');
      st.id = 'cv-mark-css';
      st.textContent = '[data-cv-mark]{outline:3px solid #0069c2 !important;outline-offset:3px !important;box-shadow:0 0 0 7px rgba(0,105,194,.18) !important}';
      d.head.appendChild(st);
    }
    marked.forEach(function (el) { el.setAttribute('data-cv-mark', ''); });
    if (marked[0]) {
      var r = marked[0].getBoundingClientRect();
      w.scrollTo({ top: Math.max(0, r.top + w.scrollY - w.innerHeight / 3), behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  /* ── 4. The six notes ───────────────────────────────────── */
  var NOTES = {
    1: { ex: 'menu', dev: 'phone', path: '', run: function (d, w) {
      var btn = d.querySelector('button[aria-label="Open menu"]');
      if (!btn) return 'The menu button only shows at phone and tablet sizes.';
      return hydrated(btn).then(function () {
        btn.focus({ preventScroll: true });
        btn.click();
        return until(function () { var m = d.getElementById('site-menu'); return m && m.open; });
      }).then(function () {
        var menu = d.getElementById('site-menu'), close = d.querySelector('[aria-label="Close menu"]');
        if (close) close.focus({ preventScroll: true });
        menu.addEventListener('close', function () {
          setTimeout(function () { say('The menu closed. Focus went back to: ' + label(d, d.activeElement) + '.'); }, 30);
        }, { once: true });
        mark([], w);
        return 'dialog#site-menu is open, as a modal\nfocus is on: ' + label(d, d.activeElement) + '\nthe page behind the menu is inert\n\nPress Esc in the preview: the menu closes and focus goes back to "Open menu".';
      });
    } },
    2: { ex: 'hook', dev: 'desktop', path: 'request-a-quote/', run: function (d, w) {
      var form = d.querySelector('form[aria-label="Quote request"]'), submit = form && form.querySelector('button[type="submit"]');
      if (!submit) return 'The quote form did not load.';
      return hydrated(form).then(function () {
        submit.click();
        return until(function () { return d.querySelectorAll('[aria-invalid="true"]').length; });
      }).then(function () {
        var bad = Array.prototype.slice.call(d.querySelectorAll('[aria-invalid="true"]'));
        var focused = d.activeElement && d.activeElement !== d.body ? d.activeElement : bad[0];
        mark([focused], w);
        return 'Stopped in the browser. Nothing was sent.\n' + bad.length + ' fields need attention: ' + bad.map(function (el) { return label(d, el); }).join(', ') + '\nfocus moved to: ' + label(d, focused);
      });
    } },
    3: { ex: 'fields', dev: 'desktop', path: 'request-a-quote/', run: function (d, w) {
      var form = d.querySelector('form[aria-label="Quote request"]'), email = form && form.querySelector('[name="email"]');
      if (!email) return 'The quote form did not load.';
      return hydrated(form).then(function () {
        email.value = 'asha@';
        form.querySelector('button[type="submit"]').click();
        return until(function () { return email.getAttribute('aria-invalid') === 'true'; });
      }).then(function () {
        var ids = (email.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        var msgs = ids.map(function (id) { var p = d.getElementById(id); return p ? '<p id="' + id + '">' + p.textContent.trim() + '</p>' : ''; }).join('\n');
        mark([email, d.getElementById(ids[0])], w);
        return 'Typed "asha@" in Email and sent the form:\n' + tag(email, ['id', 'type', 'aria-invalid', 'aria-describedby']) + '\n' + msgs + '\n\nThe field points to its message by id, so a screen reader reads both together.';
      });
    } },
    4: { ex: 'faq', dev: 'desktop', path: 'how-to-order/', run: function (d, w) {
      var all = Array.prototype.slice.call(d.querySelectorAll('details[name]'));
      if (all.length < 2) return 'The FAQ did not load.';
      var group = all[0].getAttribute('name');
      var items = all.filter(function (x) { return x.getAttribute('name') === group; });
      items[1].querySelector('summary').click();
      return wait(80).then(function () {
        mark([items[1]], w);
        var exclusive = !items[0].open;
        return '<details name="' + group + '">\n' + items.map(function (x, i) {
          return '  ' + (i + 1) + '. ' + (x.open ? 'open    ' : 'closed  ') + x.querySelector('summary').textContent.trim();
        }).join('\n') + '\n\n' + (exclusive
          ? 'Opening question 2 closed question 1. The browser did that: no JavaScript involved.'
          : 'This browser keeps both open: it does not support one-at-a-time details groups yet. The FAQ still works.');
      });
    } },
    5: { ex: 'seo', dev: 'desktop', path: '', run: function (d, w) {
      function get(sel, attr) { var el = d.querySelector(sel); return el ? el.getAttribute(attr) : '(none)'; }
      var data = {};
      try { data = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent); } catch (e) {}
      mark([], w);
      return 'title: ' + d.title +
        '\ndescription: ' + get('meta[name="description"]', 'content') +
        '\ncanonical: ' + get('link[rel="canonical"]', 'href') +
        '\nrobots: ' + get('meta[name="robots"]', 'content') + ' (this preview copy only)' +
        '\nJSON-LD: ' + (data['@type'] || '?') + ', founded ' + (data.foundingDate || '?') + ', ' + (data.contactPoint || []).length + ' contact points, ' + (data.address || []).length + ' addresses';
    } },
    6: { ex: 'css', dev: null, path: null, run: function (d, w) {
      var next = { desktop: 'tablet', tablet: 'phone', phone: 'desktop' }[dev];
      setDev(next);
      return wait(150).then(function () {
        var cs = w.getComputedStyle(d.documentElement);
        function v(n) { return cs.getPropertyValue(n).trim(); }
        mark([], w);
        return DEV[next][2] + ', ' + DEV[next][0] + ' pixels wide:\n  --gutter: ' + v('--gutter') + '\n  --section-y: ' + v('--section-y') + '\n  --container: ' + v('--container') + '\n\nShow it again for the next size.';
      });
    } }
  };

  function activate(n) {
    var note = NOTES[n];
    $$('.cv-note').forEach(function (li) { li.classList.toggle('is-on', li.getAttribute('data-note') === String(n)); });
    var tab = document.getElementById('cv-tab-' + note.ex);
    selectTab(tab);
    $$('.cv-l.is-on').forEach(function (l) { l.classList.remove('is-on'); });
    var pre = panelFor(tab).querySelector('.cv-pre');
    var lines = $$('.cv-l', pre).filter(function (l) { return (' ' + (l.getAttribute('data-notes') || '') + ' ').indexOf(' ' + n + ' ') > -1; });
    lines.forEach(function (l) { l.classList.add('is-on'); });
    if (lines[0]) pre.scrollTop = Math.max(0, lines[0].offsetTop - 28);
  }
  function bringIntoView() {
    var panes = root.querySelector('.cv-panes'), r = panes.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.55) panes.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  }

  var current = 0;
  function run(n, fromNote) {
    var id = ++current, note = NOTES[n];
    activate(n);
    if (fromNote) bringIntoView();
    if (note.dev) setDev(note.dev);
    var w0 = win();
    var ready = note.path === null && w0 && w0.document.querySelector('main') ? Promise.resolve() : go(note.path || '');
    say('Loading the preview…');
    return ready.then(function () {
      if (id !== current) return null;
      var w = win();
      if (!w) return 'Open this page on the live site to run the note. The preview can only be driven from the same website.';
      return until(function () { return w.document.readyState === 'complete' && w.document.querySelector('main'); }, 5000)
        .then(function () { return note.run(w.document, w); });
    }).then(function (msg) {
      if (id === current && msg) say(msg);
    }).catch(function () {
      if (id === current) say('This note could not run. The preview still works by hand.');
    });
  }

  $$('.cv-try[data-run], .cv-pin').forEach(function (b) {
    b.addEventListener('click', function () { run(+b.getAttribute('data-run'), b.classList.contains('cv-try')); });
  });
  $$('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () {
      var path = b.getAttribute('data-go'), id = ++current;
      bringIntoView();
      say('Loading ' + path + '…');
      go(path).then(function () {
        if (id !== current) return;
        var w = win();
        if (!w) { say('Open this page on the live site to see ' + path + '.'); return; }
        var locs = Array.prototype.slice.call(w.document.getElementsByTagName('loc')).map(function (l) { return '  ' + l.textContent; });
        say(path + ', generated at build time by app/sitemap.ts:\n' + locs.join('\n'));
      });
    });
  });
})();
