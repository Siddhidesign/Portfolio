/* Siddhi Manche · portfolio motion, version 1.
   Scroll progress, back to top, the section you are reading in the header, scroll reveals,
   count-ups, card tilt and the How I work sequence.
   Content is only hidden after this runs, and the animated parts are skipped for reduced motion. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window;
  function $$(s, el) { return Array.prototype.slice.call((el || d).querySelectorAll(s)); }
  var reduce = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in w;

  /* Scroll progress and back to top */
  var bar = d.createElement('div');
  bar.className = 'sp'; bar.setAttribute('aria-hidden', 'true');
  d.body.appendChild(bar);
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
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, w.scrollY / h) : 0) + ')';
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

  /* Mark what reveals on scroll, with a small stagger inside each group */
  function tag(list, step) {
    list.forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      if (step) el.style.setProperty('--d', Math.min(i, 6) * step + 'ms');
    });
  }
  tag($$('main .sec-head, .more-h, .about-grid > div, #system .wrap > .ds > .ds-panel, .quote, .contact .wrap > *, #system .wrap > .more-detail'), 0);
  $$('.grid').forEach(function (g) { tag(Array.prototype.slice.call(g.children), 90); });
  tag($$('.journey > li'), 70);
  tag($$('.skills > div'), 70);
  $$('.skills .tags').forEach(function (ul) {
    Array.prototype.slice.call(ul.children).forEach(function (li, i) { li.style.setProperty('--t', Math.min(i, 16) * 22 + 'ms'); });
  });
  var seq = d.querySelector('.method');
  if (seq) {
    seq.setAttribute('data-seq', '');
    Array.prototype.slice.call(seq.children).forEach(function (li, i) { li.style.setProperty('--k', i); });
  }

  function onIn(el) {
    if (el.classList.contains('card')) $$('.card-result > b:first-child', el).forEach(function (b, i) { countUp(b, 250 + i * 100); });
    if (el.hasAttribute('data-seq')) setTimeout(function () { el.classList.add('done'); }, 1800);
  }

  /* Anything already on screen shows at once, without animating */
  var items = $$('[data-reveal], [data-seq]'), vh = w.innerHeight;
  items.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) { el.classList.add('in'); if (el.hasAttribute('data-seq')) el.classList.add('done'); }
  });
  root.classList.add('motion', 'm-init');
  w.requestAnimationFrame(function () { w.requestAnimationFrame(function () { root.classList.remove('m-init'); }); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
      onIn(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });

  /* Cards lean toward the pointer, only with a mouse or trackpad */
  if (w.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.card').forEach(function (card) {
      var media = card.querySelector('.card-media');
      if (!media) return;
      card.addEventListener('pointermove', function (e) {
        var c = card.getBoundingClientRect(), r = media.getBoundingClientRect();
        var x = (e.clientX - c.left) / c.width, y = (e.clientY - c.top) / c.height;
        media.style.transform = 'perspective(800px) rotateX(' + ((0.5 - y) * 6).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 8).toFixed(2) + 'deg) translateY(-4px)';
        media.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        media.style.setProperty('--my', (e.clientY - r.top) + 'px');
        card.classList.add('tilt');
      });
      card.addEventListener('pointerleave', function () {
        media.style.transform = '';
        card.classList.remove('tilt');
      });
    });
  }
})();
