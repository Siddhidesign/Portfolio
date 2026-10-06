/* Lab demos: a resizable catalog page (Omkar) and a component states
   playground (FindMe). Without JavaScript the catalog still shows at
   full width and the playground shows its default state. */
(function () {
  'use strict';

  /* 1. Resizable catalog: drag the handle, use the slider or a preset */
  function initCatalog(root) {
    var win = root.querySelector('.lab-win'), stage = root.querySelector('.lab-stage'), range = root.querySelector('input[type="range"]'),
      out = root.querySelector('output'), bp = root.querySelector('.lab-chrome b'), handle = root.querySelector('.lab-handle'), say = root.querySelector('.ls-say');
    var cur = 1140;
    function maxW() { return Math.max(320, Math.min(1140, stage.clientWidth - 40)); }
    function bpName(w) { return w >= 1200 ? 'xl' : w >= 992 ? 'lg' : w >= 768 ? 'md' : w >= 576 ? 'sm' : 'xs'; }
    function colName(w) { return w >= 992 ? 'col-lg-3' : w >= 576 ? 'col-sm-6' : 'col-12'; }
    function set(w) {
      var mx = maxW(); w = Math.max(320, Math.min(mx, Math.round(w))); cur = w;
      win.style.setProperty('--w', w + 'px');
      range.max = mx; range.value = w; out.textContent = w + 'px';
      bp.textContent = bpName(w); bp.setAttribute('aria-label', 'Breakpoint: ' + bpName(w));
      root.querySelectorAll('.ls-card .col').forEach(function (c) { c.textContent = colName(w); });
      root.querySelectorAll('[data-w]').forEach(function (b) { var t = b.getAttribute('data-w') === 'max' ? mx : +b.getAttribute('data-w'); b.setAttribute('aria-pressed', String(Math.abs(t - w) < 2)); });
      var sw = stage.clientWidth; if (handle) handle.style.left = Math.min(sw - 16, (sw + w) / 2 + 4) + 'px';
    }
    root.querySelectorAll('[data-w]').forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-w') === 'max' ? maxW() : +b.getAttribute('data-w')); }); });
    range.addEventListener('input', function () { win.classList.add('drag'); set(+range.value); win.classList.remove('drag'); });
    if (handle) {
      handle.addEventListener('pointerdown', function (e) {
        e.preventDefault(); handle.setPointerCapture(e.pointerId); win.style.transition = 'none';
        function mv(ev) { var r = stage.getBoundingClientRect(); set(2 * (ev.clientX - r.left - r.width / 2)); }
        function up() { handle.removeEventListener('pointermove', mv); handle.removeEventListener('pointerup', up); win.style.transition = ''; }
        handle.addEventListener('pointermove', mv); handle.addEventListener('pointerup', up);
      });
    }
    root.querySelectorAll('[data-tog]').forEach(function (b) {
      b.addEventListener('click', function () { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); win.classList.toggle(b.getAttribute('data-tog'), on); });
    });
    var menu = root.querySelector('.ls-menu'), drop = root.querySelector('.ls-drop');
    if (menu && drop) menu.addEventListener('click', function () { var on = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(on)); drop.classList.toggle('open', on); });
    root.querySelectorAll('.ls-chips button').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f'), n = 0;
        root.querySelectorAll('.ls-chips button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        root.querySelectorAll('.ls-card').forEach(function (c) { var on = f === 'all' || c.getAttribute('data-c') === f; c.hidden = !on; if (on) n++; });
        if (say) say.textContent = n + (n === 1 ? ' product' : ' products') + ' shown.';
      });
    });
    root.querySelectorAll('[data-quote]').forEach(function (b) { b.addEventListener('click', function () { if (say) say.textContent = 'Quote requests are switched off in this recreation.'; }); });
    window.addEventListener('resize', function () { set(Math.min(cur, maxW())); });
    set(maxW());
  }

  /* 2. Component states playground */
  var SIZE = { sm: ['Small', 32, '0 12', 8, 13], md: ['Medium', 40, '0 16', 10, 14], lg: ['Large', 48, '0 20', 12, 16] };
  var VARIANT = { primary: ['Primary', 'color.brand.600', 'color.white', 'none'], secondary: ['Secondary', 'color.white', 'color.brand.700', 'color.brand.600'], ghost: ['Ghost', 'transparent', 'color.brand.700', 'none'] };
  var STATE = {
    default: ['Default', 'Resting state. Every other state is a change from this one.'],
    hover: ['Hover', 'The background steps one shade darker. Nothing moves, so the layout never jumps.'],
    focus: ['Focus', 'A 3px blue ring with a white gap, visible on any background. Shown for keyboard focus.'],
    disabled: ['Disabled', 'Gray and not clickable. Only used with a reason nearby, like a missing required field.'],
    loading: ['Loading', 'A spinner joins the label, and the button keeps its width so nothing shifts.']
  };
  function initSpec(root) {
    var st = { v: 'primary', s: 'md', t: 'default' };
    var btn = root.querySelector('.lab-btn'), prev = root.querySelector('.lab-preview'), code = root.querySelector('.lab-name code'), note = root.querySelector('.lab-note'), toks = root.querySelector('.lab-tokens');
    function render() {
      var V = VARIANT[st.v], S = SIZE[st.s], T = STATE[st.t], off = st.t === 'disabled';
      btn.className = 'lab-btn ' + st.v + ' ' + st.s + (st.t === 'hover' || st.t === 'focus' || st.t === 'disabled' ? ' ' + st.t : '');
      btn.innerHTML = (st.t === 'loading' ? '<span class="sp"></span>' : '') + 'Save project';
      var name = 'Button / ' + V[0] + ' / ' + S[0] + ' / ' + T[0];
      code.textContent = name; prev.setAttribute('aria-label', 'Preview: ' + name.replace(/ \/ /g, ', '));
      toks.innerHTML = '<dt>Height</dt><dd>' + S[1] + 'px</dd><dt>Padding</dt><dd>' + S[2] + 'px</dd><dt>Radius</dt><dd>' + S[3] + 'px</dd><dt>Label</dt><dd>' + S[4] + 'px, semibold</dd>' +
        '<dt>Background</dt><dd>' + (off ? (st.v === 'ghost' ? 'transparent' : 'color.gray.200') : st.t === 'hover' && st.v === 'primary' ? 'color.brand.700' : st.t === 'hover' ? 'color.brand.50' : V[1]) + '</dd>' +
        '<dt>Text</dt><dd>' + (off ? 'color.gray.600' : V[2]) + '</dd><dt>Border</dt><dd>' + (off && st.v !== 'ghost' ? 'color.gray.200' : V[3]) + '</dd>' + (st.t === 'focus' ? '<dt>Focus ring</dt><dd>3px color.focus, 3px gap</dd>' : '');
      note.textContent = T[1];
      root.querySelectorAll('[data-k]').forEach(function (b) { var k = b.getAttribute('data-k'), v = b.getAttribute('data-v'); b.setAttribute('aria-pressed', String(st[k] === v)); });
    }
    root.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (!b) return; st[b.getAttribute('data-k')] = b.getAttribute('data-v'); render(); });
    render();
  }

  function init() {
    document.querySelectorAll('[data-lab="catalog"]').forEach(initCatalog);
    document.querySelectorAll('[data-lab="spec"]').forEach(initSpec);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
