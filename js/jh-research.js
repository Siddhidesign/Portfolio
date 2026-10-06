/* Jai Hind page: behaviour for the coded research, flows and style guide.
   Without this file everything is still visible: all personas, all journey
   stages and the full audit table simply show at once. */
(function () {
  'use strict';
  function each(sel, fn, root) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn(e); } }

  /* Audit: filter by impact */
  safe(function () {
    each('[data-jr-filter]', function (g) {
      var table = document.querySelector(g.getAttribute('data-jr-filter')); if (!table) return;
      var live = g.closest('.jr').querySelector('[data-jr-count]');
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var v = b.getAttribute('data-v'), n = 0;
        each('button', function (x) { x.setAttribute('aria-pressed', String(x === b)); }, g);
        each('tbody tr', function (tr) { var on = v === 'all' || tr.getAttribute('data-sev') === v; tr.hidden = !on; if (on) n++; }, table);
        if (live) live.textContent = 'Showing ' + n + ' finding' + (n === 1 ? '' : 's') + '.';
      });
    });
  });

  /* Tabs (personas, journeys): one panel at a time, arrow keys move between tabs */
  safe(function () {
    each('.jr [role="tablist"]', function (list) {
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
      list.hidden = false;
      var grid = panels[0] && panels[0].parentNode; if (grid && grid.classList.contains('jr-pgrid')) grid.classList.add('tabbed');
      function select(i, focus) {
        tabs.forEach(function (t, j) { var on = i === j; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (panels[j]) panels[j].hidden = !on; });
        if (focus) tabs[i].focus();
      }
      select(0);
      list.addEventListener('click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) select(tabs.indexOf(t)); });
      list.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(document.activeElement); if (i < 0) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
  });

  /* Journey maps: pick a stage to see its pain point and opportunity */
  safe(function () {
    each('[data-jr-journey]', function (j) {
      j.addEventListener('click', function (e) {
        var b = e.target.closest('.jr-stage'); if (!b) return;
        var i = b.getAttribute('data-i');
        each('.jr-stage', function (x) { x.setAttribute('aria-pressed', String(x === b)); }, j);
        each('.jr-detail', function (d) { d.hidden = d.getAttribute('data-i') !== i; }, j);
      });
    });
  });

  /* Swatches: tap to copy the hex value */
  safe(function () {
    each('#jr-style', function (box) {
      var live = box.querySelector('[data-jr-copied]');
      box.addEventListener('click', function (e) {
        var b = e.target.closest('[data-copy]'); if (!b) return;
        var hex = b.getAttribute('data-copy'), name = b.querySelector('b') ? b.querySelector('b').textContent : '';
        var done = function () { b.classList.add('copied'); setTimeout(function () { b.classList.remove('copied'); }, 1600); if (live) live.textContent = 'Copied ' + name + ' ' + hex; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(hex).then(done, done); else done();
      });
    });
  });

  /* Live components board */
  safe(function () {
    each('.jr-board', function (board) {
      board.addEventListener('click', function (e) {
        var p = e.target.closest('.jr-pill, .jr-tabsdemo .jh-tab');
        if (p) { each('button', function (x) { x.setAttribute('aria-pressed', String(x === p)); }, p.parentNode); }
      });
      var ctl = board.querySelector('[data-jr-ctl]'), q = 0;
      var icon = function (d) { return '<svg class="ji" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + d + '</svg>'; };
      function draw(focusSel) {
        if (!ctl) return;
        ctl.innerHTML = q ? '<span class="jh-stepper" role="group" aria-label="Polo Shirt- Brown quantity"><button type="button" data-q="-1" aria-label="Remove one">' + icon('<path d="M5 12h14"/>') + '</button><span aria-live="polite">' + q + ' added</span><button type="button" data-q="1" aria-label="Add one more">' + icon('<path d="M12 5v14M5 12h14"/>') + '</button></span>'
          : '<button type="button" class="jh-add" data-q="1">' + icon('<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h3l2.6 11.6a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 8H6.4"/>') + 'Add to Cart</button>';
        if (focusSel) { var f = ctl.querySelector(focusSel); if (f) f.focus(); }
      }
      if (ctl) { draw(); ctl.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (!b) return; var d = +b.getAttribute('data-q'), was = q; q = Math.max(0, q + d); draw(q === 0 ? '.jh-add' : (was === 0 ? '[data-q="1"]' : '[data-q="' + d + '"]')); }); }
      var pager = board.querySelector('[data-jr-pager]'), cap = board.querySelector('[data-jr-page]'), page = 1;
      function pg(focus) {
        if (!pager) return;
        var items = page <= 3 ? ['prev', 1, 2, 3, 'gap', 12, 'next'] : page >= 10 ? ['prev', 1, 'gap', 10, 11, 12, 'next'] : ['prev', 1, 'gap', page, 'gap', 12, 'next'];
        pager.innerHTML = items.map(function (it) {
          if (it === 'gap') return '<span aria-hidden="true">…</span>';
          if (it === 'prev') return '<button type="button" data-p="prev" aria-label="Previous page">' + icon('<path d="m15 18-6-6 6-6"/>') + '</button>';
          if (it === 'next') return '<button type="button" data-p="next" aria-label="Next page">' + icon('<path d="m9 18 6-6-6-6"/>') + '</button>';
          return '<button type="button" data-p="' + it + '"' + (it === page ? ' aria-current="page"' : '') + '>' + it + '</button>';
        }).join('');
        if (cap) cap.textContent = 'Page ' + page + ' of 12';
        if (focus) { var f = pager.querySelector('[data-p="' + focus + '"]'); if (f) f.focus(); }
      }
      if (pager) { pg(); pager.addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (!b) return; var v = b.getAttribute('data-p'); page = v === 'prev' ? Math.max(1, page - 1) : v === 'next' ? Math.min(12, page + 1) : +v; pg(v); }); }
    });
  });
})();
