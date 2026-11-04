// Case study behaviour: theme, header hide, progress bar, pipeline highlight, reveal, lightbox.
(function () {
  var root = document.documentElement;
  try { if (localStorage.getItem('sm-theme') === 'dark') root.dataset.theme = 'dark'; } catch (e) {}
  document.addEventListener('DOMContentLoaded', function () {
    var t = document.getElementById('themeBtn');
    if (t) t.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('sm-theme', root.dataset.theme); } catch (e) {}
    });
    var bar = document.querySelector('.bar'), prog = document.querySelector('.progress'), last = scrollY;
    var links = [].slice.call(document.querySelectorAll('.pipe a'));
    var steps = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    function onScroll() {
      var y = scrollY;
      if (bar) bar.classList.toggle('hide', y > last && y > 300); last = y;
      var h = document.documentElement.scrollHeight - innerHeight;
      if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      var act = -1;
      steps.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) act = i; });
      links.forEach(function (a, i) { a.classList.toggle('on', i === act); });
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        [].forEach.call(e.target.querySelectorAll('.bars i[data-w]'), function (b) { b.style.width = b.dataset.w; });
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    [].forEach.call(document.querySelectorAll('[data-reveal]'), function (el) { io.observe(el); });
    var lb = document.createElement('div'); lb.className = 'lb'; lb.innerHTML = '<img alt="">'; document.body.appendChild(lb);
    lb.addEventListener('click', function () { lb.classList.remove('show'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('show'); });
    [].forEach.call(document.querySelectorAll('.fig img,.pair img,.dec img,.himg img,.follow img'), function (img) {
      img.addEventListener('click', function () { var i = lb.querySelector('img'); i.src = img.src; i.alt = img.alt; lb.classList.add('show'); });
    });
  });
})();
