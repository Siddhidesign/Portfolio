/* Siddhi Manche · portfolio motion, version 3.
   Back to top, the section you are reading in the header, a pointer label over projects,
   the Experience card stack, scroll reveals and the hero count-up.
   Content is only hidden after this runs, and the animated parts are skipped for reduced motion. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window;
  function $$(s, el) { return Array.prototype.slice.call((el || d).querySelectorAll(s)); }
  var reduce = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in w;
  var chev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7"/></svg>';

  /* Back to top */
  var up = d.createElement('a');
  up.className = 'to-top'; up.href = '#main';
  up.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V5M6 11l6-6 6 6"/></svg><span class="sr">Back to top</span>';
  d.body.appendChild(up);
  var navLinks = $$('.nav a[href^="#"]');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    w.requestAnimationFrame(function () {
      var h = root.scrollHeight - root.clientHeight;
      up.classList.toggle('show', w.scrollY > 900);
      if (h > 0 && w.scrollY >= h - 4 && navLinks.length) {
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        navLinks[navLinks.length - 1].classList.add('is-active');
      }
      ticking = false;
    });
  }
  w.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Header: highlight the section in view */
  if (hasIO && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { var s = d.getElementById(a.getAttribute('href').slice(1)); if (s) byId[s.id] = a; });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        byId[en.target.id].classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { navIO.observe(d.getElementById(id)); });
  }

  /* Theme icon turns when switched */
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (reduce) return;
      b.classList.remove('spin'); void b.offsetWidth; b.classList.add('spin');
    });
  });

  /* A label follows the pointer over projects. Mouse and trackpad only; the real link is the project title. */
  if (w.matchMedia && w.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var tagEl = d.createElement('div');
    tagEl.className = 'cur-tag'; tagEl.setAttribute('aria-hidden', 'true');
    tagEl.innerHTML = '<span></span>';
    d.body.appendChild(tagEl);
    var pill = tagEl.firstChild, current = null, px = 0, py = 0, raf = 0;
    var place = function () { raf = 0; tagEl.style.transform = 'translate3d(' + (px + 16) + 'px,' + (py + 20) + 'px,0)'; };
    d.addEventListener('pointermove', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (!t) { tagEl.classList.remove('on'); current = null; return; }
      if (t !== current) { current = t; pill.innerHTML = t.getAttribute('data-cursor') + ' ' + chev; }
      px = e.clientX; py = e.clientY;
      if (!raf) raf = w.requestAnimationFrame(place);
      tagEl.classList.add('on');
    }, { passive: true });
    var hide = function () { tagEl.classList.remove('on'); current = null; };
    w.addEventListener('scroll', hide, { passive: true });
    d.addEventListener('pointerleave', hide);
    w.addEventListener('blur', hide);
  }

  /* Experience: the cards sit in a pile, the next one peeking out below, until you open them.
     Without JavaScript they are a plain list of cards. */
  var stack = d.querySelector('.xp-stack');
  if (stack && stack.children.length > 1) {
    var cards = Array.prototype.slice.call(stack.children), open = false, spread = false;
    var btn = d.createElement('button');
    btn.type = 'button'; btn.className = 'xp-toggle';
    btn.setAttribute('aria-controls', stack.id);
    var layout = function () {
      var gap = 12, peek = spread ? 20 : 14;
      if (open) {
        var y = 0;
        cards.forEach(function (c, i) { c.style.setProperty('--y', y + 'px'); c.style.setProperty('--s', '1'); c.style.zIndex = cards.length - i; y += c.offsetHeight + gap; });
        stack.style.setProperty('--h', (y - gap) + 'px');
      } else {
        var h0 = cards[0].offsetHeight, shown = Math.min(cards.length, 4);
        stack.style.setProperty('--h0', h0 + 'px');
        cards.forEach(function (c, i) { var k = Math.min(i, shown - 1); c.style.setProperty('--y', (k * peek) + 'px'); c.style.setProperty('--s', (1 - k * 0.04).toFixed(2)); c.style.zIndex = cards.length - i; });
        stack.style.setProperty('--h', (h0 + (shown - 1) * peek) + 'px');
      }
    };
    var setOpen = function (next) {
      open = next;
      stack.classList.toggle('collapsed', !open);
      btn.setAttribute('aria-expanded', String(open));
      btn.innerHTML = (open ? 'Show less' : 'Show all ' + cards.length + ' roles') + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>';
      layout();
    };
    stack.classList.add('is-stack', 'xp-init');
    stack.parentNode.insertBefore(btn, stack.nextSibling);
    setOpen(false);
    w.requestAnimationFrame(function () { w.requestAnimationFrame(function () { stack.classList.remove('xp-init'); }); });
    btn.addEventListener('click', function () {
      setOpen(!open);
      if (!open && stack.getBoundingClientRect().top < 70) stack.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    });
    stack.addEventListener('click', function () { if (!open) { setOpen(true); btn.focus(); } });
    stack.addEventListener('mouseenter', function () { if (!open) { spread = true; layout(); } });
    stack.addEventListener('mouseleave', function () { if (spread) { spread = false; layout(); } });
    var queued = 0;
    var relayout = function () { if (!queued) queued = w.requestAnimationFrame(function () { queued = 0; layout(); }); };
    if ('ResizeObserver' in w) { var ro = new ResizeObserver(relayout); ro.observe(stack); cards.forEach(function (c) { ro.observe(c); }); }
    w.addEventListener('resize', relayout);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(relayout);
  }

  if (reduce || !hasIO) return;

  /* Count a number up from zero. The real value stays in the page for screen readers. */
  function countUp(b, delay) {
    var final = b.textContent.trim();
    var m = final.match(/^(\d+(?:\.\d+)?)(%|\+)?$/);
    if (!m || b.getAttribute('data-counted')) return;
    b.setAttribute('data-counted', '1');
    var target = parseFloat(m[1]), dec = (m[1].split('.')[1] || '').length, suf = m[2] || '';
    b.innerHTML = '<span aria-hidden="true">' + (0).toFixed(dec) + suf + '</span><span class="sr">' + final + '</span>';
    var vis = b.firstChild, start = null, dur = 1100;
    setTimeout(function () {
      w.requestAnimationFrame(function step(t) {
        if (start === null) start = t;
        var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
        vis.textContent = (target * e).toFixed(dec) + suf;
        if (k < 1) w.requestAnimationFrame(step);
      });
    }, delay || 0);
  }
  $$('.stats b').forEach(function (b, i) { countUp(b, 500 + i * 120); });

  /* Mark what rises on scroll: each section label, each block, and list rows one after another */
  function tag(list, step) {
    list.forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      if (step) el.style.setProperty('--d', Math.min(i, 6) * step + 'ms');
    });
  }
  tag($$('.lsec-h'), 0);
  $$('.lsec-body').forEach(function (body) {
    Array.prototype.slice.call(body.children).forEach(function (el) {
      if (/^(UL|OL|DL)$/.test(el.tagName)) tag(Array.prototype.slice.call(el.children), 70);
      else tag([el], 0);
    });
  });

  /* Anything already on screen shows at once, without animating */
  var items = $$('[data-reveal]'), vh = w.innerHeight;
  items.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) el.classList.add('in');
  });
  root.classList.add('motion', 'm-init');
  w.requestAnimationFrame(function () { w.requestAnimationFrame(function () { root.classList.remove('m-init'); }); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
})();
