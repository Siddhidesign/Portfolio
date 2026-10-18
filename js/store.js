/* Siddhi Manche · portfolio, version 3.
   Theme switch, image gallery, the step tracker, and the like + feedback box on case studies.
   Without JavaScript every page still reads fine, and feedback falls back to email. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var EMAIL = 'manche.siddhi@gmail.com';
  // Feedback goes to Siddhi's inbox through FormSubmit (no account; activated once by email).
  var ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;
  function $(s, el) { return (el || d).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || d).querySelectorAll(s)); }
  var live = $('[data-live]');
  function say(msg) { if (!live) return; live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 40); }

  /* Theme */
  function label() {
    var night = root.getAttribute('data-theme') === 'night';
    $$('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-label', night ? 'Switch to light mode' : 'Switch to dark mode'); });
  }
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
      root.setAttribute('data-theme', t);
      try { localStorage.setItem('theme', t); } catch (e) {}
      label(); say(t === 'night' ? 'Dark mode on.' : 'Light mode on.');
    });
  });
  label();

  /* Gallery: thumbnails swap the main image */
  var main = $('[data-gal-main]');
  if (main) {
    var cap = $('[data-gal-cap]');
    $$('[data-gal]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        main.src = a.getAttribute('href'); main.alt = a.getAttribute('data-alt') || '';
        if (cap) cap.textContent = a.getAttribute('data-cap') || '';
        $$('[data-gal]').forEach(function (x) { if (x === a) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current'); });
      });
    });
  }

  /* Process stepper: mark the step in view. Without JavaScript it is a plain list of links. */
  var stepLinks = $$('.stepper a');
  if (stepLinks.length && 'IntersectionObserver' in window) {
    var byId = {}, current = null, bar = $('.stepper');
    stepLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var a = byId[en.target.id];
        if (!a || a === current) return;
        if (current) current.removeAttribute('aria-current');
        a.setAttribute('aria-current', 'step'); current = a;
        if (bar && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = Math.max(0, a.parentNode.offsetLeft - 24);
      });
    }, { rootMargin: '-30% 0px -65% 0px' });
    $$('[data-step]').forEach(function (s) { io.observe(s); });
  }

  /* Like + feedback */
  var fb = $('[data-fb]');
  if (fb) {
    var form = $('[data-fb-form]', fb), status = $('[data-fb-status]', fb), choices = $$('[data-fb-choice]', fb);
    var caseName = fb.getAttribute('data-case'), key = 'sm-fb-' + fb.getAttribute('data-id');
    var sent = null; try { sent = localStorage.getItem(key); } catch (e) {}
    if (sent) { choices.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-fb-choice') === sent)); }); status.textContent = 'Thanks, you already sent feedback on this one.'; }
    choices.forEach(function (b) {
      b.addEventListener('click', function () {
        choices.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        form.elements.reaction.value = b.getAttribute('data-fb-choice');
        form.hidden = false; status.textContent = '';
        form.elements.message.focus();
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements._honey.value) return;
      var btn = $('button[type="submit"]', form); btn.disabled = true; btn.textContent = 'Sending...';
      var data = {
        _subject: 'Portfolio feedback: ' + caseName + ' (' + form.elements.reaction.value + ')',
        _template: 'table', _captcha: 'false',
        'Case study': caseName, Reaction: form.elements.reaction.value,
        Message: form.elements.message.value.trim() || '(no comment)',
        From: form.elements.from.value.trim() || '(anonymous)',
        Page: location.href
      };
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json().catch(function () { return {}; }); })
        .then(function () {
          try { localStorage.setItem(key, form.elements.reaction.value); } catch (err) {}
          form.hidden = true;
          status.textContent = 'Thank you! Your feedback is on its way to me.';
          status.focus();
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Send';
          status.innerHTML = 'That didn’t send. You can email me instead at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.';
          status.focus();
        });
    });
  }
})();
