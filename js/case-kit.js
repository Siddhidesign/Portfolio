/* Case kit: small behaviors for the coded research blocks on the case
   pages. Everything is readable without JavaScript; this only adds
   switching between panels and a gentle reveal on score scales. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function init() {
    /* Toggle groups: buttons with aria-pressed switch [data-panel] blocks */
    document.querySelectorAll('[data-cx-tabs]').forEach(function (g) {
      var box = document.getElementById(g.getAttribute('data-cx-tabs')); if (!box) return;
      function show(v) {
        box.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== v; });
        g.querySelectorAll('button[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); });
      }
      box.classList.add('tabbed');
      var first = g.querySelector('[aria-pressed="true"]') || g.querySelector('button[data-v]');
      if (first) show(first.getAttribute('data-v'));
      g.addEventListener('click', function (e) { var b = e.target.closest('button[data-v]'); if (b) show(b.getAttribute('data-v')); });
    });
    /* ARIA tabs: role="tablist" with role="tab" buttons and role="tabpanel" panels */
    document.querySelectorAll('[data-cx-tablist]').forEach(function (g) {
      var box = document.getElementById(g.getAttribute('data-cx-tablist')); if (!box) return;
      var tabs = [].slice.call(g.querySelectorAll('[role="tab"]'));
      function show(v, focus) {
        box.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== v; });
        tabs.forEach(function (b) { var on = b.getAttribute('data-v') === v; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      }
      box.classList.add('tabbed');
      var first = g.querySelector('[aria-selected="true"]') || tabs[0];
      if (first) show(first.getAttribute('data-v'));
      g.addEventListener('click', function (e) { var b = e.target.closest('[role="tab"]'); if (b) show(b.getAttribute('data-v')); });
      g.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(document.activeElement); if (i < 0) return;
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (j === null) return;
        e.preventDefault(); show(tabs[(j + tabs.length) % tabs.length].getAttribute('data-v'), true);
      });
    });
    /* Filter a comparison table down to the rows with gaps */
    document.querySelectorAll('[data-cx-gaps]').forEach(function (b) {
      var t = document.getElementById(b.getAttribute('data-cx-gaps')), out = document.getElementById(b.getAttribute('data-cx-out'));
      if (!t) return;
      var all = t.querySelectorAll('tbody tr').length, gaps = t.querySelectorAll('tbody tr.has-no').length;
      function say(on) { if (out) out.textContent = on ? 'Showing the ' + gaps + ' features where some apps fall short.' : 'Showing all ' + all + ' features.'; }
      say(false);
      b.addEventListener('click', function () { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); t.classList.toggle('gaps', on); say(on); });
    });
    /* Score scales slide into place once, when they scroll into view */
    document.querySelectorAll('[data-cx-sus]').forEach(function (el) {
      if (reduce || !('IntersectionObserver' in window)) return;
      el.classList.add('wait');
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { el.classList.remove('wait'); io.disconnect(); } }); }, { threshold: 0.4 });
      io.observe(el);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
