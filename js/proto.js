/* Phone prototype shell. Each app registers a definition:
   ProtoShell.register('name', {
     state(shell)  -> initial state (must include screen and mode)
     view(state, shell) -> { html, tone }   html for the current screen
     actions: { name(value, el, event) }    called with this = shell
     input(name, value, el)                 optional, for typed fields
     modes: { key: label }, jumps: [[screen, label]], tour: [{ id, label, go }]
     onMode(mode)                           optional, with this = shell
   })
   A root element <div data-proto="name"> becomes the demo. Content inside
   the root is the no-JavaScript fallback and is replaced on boot. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var defs = {};
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>';
  var STATUS = '<span>13:13</span><span><svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.4 6.8a6.6 6.6 0 0 1 9.2 0l-1.3 1.3a4.8 4.8 0 0 0-6.6 0zM1 4.4a10 10 0 0 1 14 0l-1.3 1.3a8.2 8.2 0 0 0-11.4 0z"/></svg><svg viewBox="0 0 27 12" aria-hidden="true"><rect x=".5" y=".5" width="23" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2" y="2" width="18" height="8" rx="1.8"/><rect x="24.5" y="4" width="2" height="4" rx="1"/></svg></span>';

  function Shell(root, def) {
    this.root = root; this.def = def; this.d = root.dataset;
    this.done = {};
    this.s = def.state(this);
    if (this.d.mode) this.s.mode = this.d.mode;
    if (this.d.screen) this.s.screen = this.d.screen;
    this.build();
  }

  Shell.prototype.build = function () {
    var self = this, def = this.def, d = this.d, c = '';
    var modes = (d.modes || Object.keys(def.modes || {}).join(',')).split(',').filter(Boolean);
    var ctl = (d.controls || 'mode,jump,reset').split(',');
    this.root.classList.add('pr-demo');
    c += '<div class="pr-controls">';
    if (d.hint) c += '<span class="pr-hint" aria-hidden="true">' + esc(d.hint) + '</span>';
    if (ctl.indexOf('mode') > -1 && modes.length > 1) {
      c += '<div class="pr-seg" role="group" aria-label="Version"><span class="pr-seg-l" aria-hidden="true">Show</span>';
      modes.forEach(function (m) { c += '<button type="button" data-ctl="mode" data-v="' + m + '" aria-pressed="false">' + esc(def.modes[m]) + '</button>'; });
      c += '</div>';
    }
    var jumps = ctl.indexOf('jump') > -1 && def.jumps;
    if (jumps || ctl.indexOf('reset') > -1) {
      c += '<div class="pr-go" role="group" aria-label="' + (jumps ? 'Jump to a screen' : 'Prototype controls') + '">';
      if (jumps) def.jumps.forEach(function (j) { c += '<button type="button" data-ctl="go" data-v="' + j[0] + '">' + esc(j[1]) + '</button>'; });
      c += '<button type="button" data-ctl="reset" aria-label="Reset the prototype">↺ Reset</button></div>';
    }
    c += '</div><div class="pr-wrap' + (def.tour && d.tour !== 'off' ? '' : ' solo') + '">';
    c += '<div class="pr-phone" data-tone="light"' + (def.dark ? ' style="--pr-dark:' + def.dark + '"' : '') + '><div class="pr-status" aria-hidden="true">' + (def.time ? STATUS.replace('13:13', def.time) : STATUS) + '</div>';
    c += '<div class="pr-screen" role="region" tabindex="0" aria-label="' + esc(d.label || def.label || 'Interactive prototype') + '"><div class="pr-app"></div></div>';
    c += '<div class="pr-layer"><div class="pr-ov"></div><div class="pr-toast" role="status" aria-live="polite"></div><p class="sr" aria-live="polite" data-psay></p></div></div>';
    if (def.tour && d.tour !== 'off') {
      c += '<aside class="pr-tour" aria-label="Things to try"><h4>Things to try</h4><p>' + esc(def.tourIntro || 'Each one ticks itself off when you do it.') + '</p><div class="pr-bar" aria-hidden="true"><i></i></div><p class="pr-count" data-count></p><ul class="pr-tasks">';
      def.tour.forEach(function (t) { c += '<li data-task="' + t.id + '"><span class="box" aria-hidden="true">' + TICK + '</span><span class="t">' + esc(t.label) + '</span>' + (t.go ? '<button type="button" data-ctl="task" data-v="' + t.id + '">Show me</button>' : '') + '<span class="sr" data-state>, not done yet</span></li>'; });
      c += '</ul><p class="pr-cheer" data-cheer hidden>All done. That is the whole redesign, end to end.</p>' + (def.tourNote ? '<p class="pr-note">' + esc(def.tourNote) + '</p>' : '') + '<p class="sr" aria-live="polite" data-say></p></aside>';
    }
    c += '</div>';
    this.root.innerHTML = c;
    this.phone = this.root.querySelector('.pr-phone'); this.screen = this.root.querySelector('.pr-screen');
    this.app = this.root.querySelector('.pr-app'); this.layer = this.root.querySelector('.pr-layer');
    this.ov = this.root.querySelector('.pr-ov'); this.toastEl = this.root.querySelector('.pr-toast');
    this.root.addEventListener('click', function (e) { self.onClick(e); });
    this.root.addEventListener('input', function (e) { self.onInput(e, false); });
    this.root.addEventListener('change', function (e) { self.onInput(e, true); });
    this.root.addEventListener('keydown', function (e) { self.onKey(e); });
    this.render();
    this.updateTour();
  };

  Shell.prototype.render = function (focusKey) {
    var a = document.activeElement, k = focusKey || (a && this.app.contains(a) && a.getAttribute('data-k'));
    var out = this.def.view.call(this, this.s, this);
    if (typeof out === 'string') out = { html: out };
    this.app.innerHTML = out.html;
    this.phone.setAttribute('data-tone', out.tone || 'light');
    if (out.bar) this.phone.style.setProperty('--pr-bar', out.bar); else this.phone.style.removeProperty('--pr-bar');
    this.root.setAttribute('data-mode', this.s.mode || '');
    var s = this.s;
    this.root.querySelectorAll('[data-ctl="mode"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === s.mode)); });
    this.root.querySelectorAll('[data-ctl="go"]').forEach(function (b) { if (b.getAttribute('data-v') === s.screen) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    if (k) { var el = this.app.querySelector('[data-k="' + k + '"]'); if (el) el.focus({ preventScroll: true }); }
    if (this.def.after) this.def.after.call(this, this.s);
  };

  Shell.prototype.go = function (screen, extra) {
    if (extra) for (var k in extra) this.s[k] = extra[k];
    this.s.screen = screen;
    this.closeOv(true);
    this.screen.scrollTop = 0;
    this.render('h');
  };

  Shell.prototype.toast = function (msg) {
    var t = this.toastEl;
    t.innerHTML = '<i>' + TICK + '</i><span>' + esc(msg) + '</span>';
    t.classList.add('on'); clearTimeout(this._tt);
    this._tt = setTimeout(function () { t.classList.remove('on'); setTimeout(function () { if (!t.classList.contains('on')) t.innerHTML = ''; }, 400); }, 3600);
  };

  /* Quiet screen reader announcement (no visible toast) */
  Shell.prototype.say = function (msg) {
    var el = this.root.querySelector('[data-psay]'); if (!el) return;
    el.textContent = ''; setTimeout(function () { el.textContent = msg; }, 40);
  };

  /* Sheets slide up from the bottom; center: true makes a dialog. */
  Shell.prototype.open = function (html, o) {
    o = o || {};
    this.closeOv(true);
    this._opener = o.opener || document.activeElement;
    var id = 'pr-t-' + Math.random().toString(36).slice(2, 8);
    this.ov.innerHTML = '<div class="pr-scrim' + (o.center ? ' center' : '') + '" data-scrim><div class="pr-sheet" role="dialog" aria-modal="true" aria-labelledby="' + id + '" tabindex="-1">' + html.replace('data-title', 'id="' + id + '"') + '</div></div>';
    var f = this.ov.querySelector('[data-first]') || this.ov.querySelector('button, input, select, textarea');
    if (f) f.focus(); else this.ov.querySelector('.pr-sheet').focus();
  };
  Shell.prototype.closeOv = function (silent) {
    if (!this.ov || !this.ov.innerHTML) return;
    this.ov.innerHTML = '';
    if (!silent && this._opener && document.body.contains(this._opener)) this._opener.focus();
    else if (!silent) this.screen.focus();
  };

  Shell.prototype.tick = function (id) {
    if (!this.def.tour || this.done[id]) return;
    var t = this.def.tour.filter(function (x) { return x.id === id; })[0]; if (!t) return;
    this.done[id] = true; this.updateTour(t.label);
  };
  Shell.prototype.updateTour = function (justDone) {
    var tour = this.root.querySelector('.pr-tour'); if (!tour) return;
    var done = this.done, n = 0, total = this.def.tour.length;
    tour.querySelectorAll('[data-task]').forEach(function (li) { var on = !!done[li.getAttribute('data-task')]; li.classList.toggle('done', on); li.querySelector('[data-state]').textContent = on ? ', done' : ', not done yet'; if (on) n++; });
    tour.querySelector('.pr-bar i').style.setProperty('--p', Math.round(n / total * 100) + '%');
    tour.querySelector('[data-count]').textContent = n + ' of ' + total + ' done';
    tour.querySelector('[data-cheer]').hidden = n < total;
    if (justDone) tour.querySelector('[data-say]').textContent = 'Done: ' + justDone + '. ' + n + ' of ' + total + '.';
  };

  Shell.prototype.onClick = function (e) {
    var ctl = e.target.closest('[data-ctl]');
    if (ctl && this.root.contains(ctl)) {
      var c = ctl.getAttribute('data-ctl'), v = ctl.getAttribute('data-v');
      if (c === 'mode') { this.s.mode = v; if (this.def.onMode) this.def.onMode.call(this, v); this.closeOv(true); this.screen.scrollTop = 0; this.render(); }
      else if (c === 'go') { if (this.def.modes && this.def.jumpMode && this.s.mode !== this.def.jumpMode) this.s.mode = this.def.jumpMode; this.go(v); }
      else if (c === 'reset') { var keep = this.done; this.s = this.def.state(this); if (this.d.mode) this.s.mode = this.d.mode; this.done = keep; this.closeOv(true); this.screen.scrollTop = 0; this.render(); this.toast('Prototype reset.'); }
      else if (c === 'task') { var t = this.def.tour.filter(function (x) { return x.id === v; })[0]; if (t && t.go) { var tm = this.def.tourMode || this.def.jumpMode; if (tm && this.s.mode !== tm) { this.s.mode = tm; if (this.def.onMode) this.def.onMode.call(this, tm); } this.go(t.go, t.extra); this.screen.focus({ preventScroll: true }); var h = this.app.querySelector('[data-k="h"]'); if (h) h.focus({ preventScroll: true }); this.phone.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); } }
      return;
    }
    var sc = e.target.closest('[data-scrim]');
    if (sc && e.target === sc) { this.closeOv(); return; }
    var t2 = e.target.closest('[data-a]');
    if (!t2 || !this.root.contains(t2) || t2.disabled) return;
    var fn = this.def.actions[t2.getAttribute('data-a')];
    if (fn) fn.call(this, t2.getAttribute('data-v'), t2, e);
  };
  Shell.prototype.onInput = function (e, isChange) {
    var t = e.target, n = t.getAttribute && t.getAttribute('data-i');
    if (!n || !this.root.contains(t) || !this.def.input) return;
    this.def.input.call(this, n, t.type === 'checkbox' ? t.checked : t.value, t, isChange);
  };
  Shell.prototype.onKey = function (e) {
    if (e.key === 'Escape' && this.ov.innerHTML) { e.preventDefault(); this.closeOv(); return; }
    if (e.key === 'Tab' && this.ov.innerHTML) {
      var f = Array.prototype.slice.call(this.ov.querySelectorAll('button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'));
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  };

  function boot(el) { if (el.__pr) return el.__pr; var def = defs[el.getAttribute('data-proto')]; if (!def) return null; el.__pr = new Shell(el, def); return el.__pr; }
  function start() {
    var els = document.querySelectorAll('[data-proto]'), vh = window.innerHeight || 800;
    if (!('IntersectionObserver' in window)) { els.forEach(boot); return; }
    els.forEach(function (el) { if (el.getBoundingClientRect().top < vh + 400) boot(el); });
    var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { boot(en.target); io.unobserve(en.target); } }); }, { rootMargin: '400px 0px' });
    els.forEach(function (el) { if (!el.__pr) io.observe(el); });
  }
  /* Buttons elsewhere on the page can drive a prototype: data-pr-go="#id" data-screen data-mode */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pr-go]'); if (!b) return;
    var el = document.querySelector(b.getAttribute('data-pr-go')); if (!el) return;
    e.preventDefault();
    var sh = boot(el); if (!sh) return;
    if (b.dataset.mode) { sh.s.mode = b.dataset.mode; if (sh.def.onMode) sh.def.onMode.call(sh, b.dataset.mode); }
    var ex = null; try { ex = b.dataset.extra ? JSON.parse(b.dataset.extra) : null; } catch (err) { ex = null; }
    if (b.dataset.screen) sh.go(b.dataset.screen, ex); else sh.render();
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
  /* Coded before/after sliders: <figure class="pr-cmp"> with a range input */
  document.addEventListener('input', function (e) {
    var r = e.target;
    if (r && r.matches && r.matches('.pr-cmp input[type="range"]')) r.closest('.pr-cmp').style.setProperty('--pos', r.value + '%');
  });
  window.ProtoShell = {
    register: function (name, def) { defs[name] = def; },
    boot: boot, esc: esc, reduce: reduce,
    start: function () { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start(); }
  };
})();
