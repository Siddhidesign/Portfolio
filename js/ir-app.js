/* IRS2GO, rebuilt in code from my Figma file: the 2025 redesign, plus the
   original app for comparison ("Old app" mode, with red pins on what broke).
   Runs on ProtoShell (proto.js). Sample data only: nothing typed here is
   stored or sent anywhere, and calls, links and sign-in are simulated. */
(function () {
  'use strict';
  var P = window.ProtoShell;
  if (!P) return;
  var esc = P.esc;

  /* ── Icons (24px stroke icons, drawn for this page) ───────────────── */
  var PATHS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 4M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7c2 0 3.8-.6 5.3-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.2v.3"/>',
    a11y: '<circle cx="12" cy="4.6" r="1.9"/><path d="M4.5 8.6 12 10l7.5-1.4M12 10v4.4M12 14.4 8.6 21M12 14.4l3.4 6.6"/>',
    dollar: '<circle cx="12" cy="12" r="9.5"/><path d="M15 9.3c-.4-1.1-1.6-1.8-3-1.8-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.5 0-2.7-.8-3.1-1.9M12 5.8v1.7M12 16.5v1.7"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
    help: '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.2-2.5 4M12 17.2v.3"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    bank: '<path d="M3 10h18L12 4.5zM5.5 10v7.5M10 10v7.5M14 10v7.5M18.5 10v7.5M3 20h18"/>',
    phone: '<path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/>',
    pin: '<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    tools: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5L3.8 16.9a1.6 1.6 0 0 0 2.3 2.3l5.4-5.4a4 4 0 0 0 5-5.3l-2.4 2.4-2.1-.4-.4-2.1z"/>',
    play: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.3v5.4l4.6-2.7z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.8 6.8 12 13l8.2-6.2"/>',
    chat: '<path d="M4 5.5h16v10.5H9.5L5 19.5v-3.5H4z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9.5 12h6M9.5 15.5h6"/>',
    fp: '<path d="M8.5 7.6A5 5 0 0 1 17 11v1.3M7 11a5 5 0 0 1 .3-1.6M12 11v2.5a8.5 8.5 0 0 1-1.6 5M15.2 14.5a12.6 12.6 0 0 1-1.5 5.3M7 13.5a9 9 0 0 1-.8 3.6M18.8 16.3c.2-1 .2-2.1.2-3.3V11a7 7 0 0 0-12.2-4.7M5 11v1.5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    replay: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/>',
    spark: '<path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.6 2.6M15.4 15.4 18 18M6 18l2.6-2.6M15.4 8.6 18 6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    ext: '<path d="M14 4h6v6M20 4l-8.5 8.5M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>'
  };
  function ic(n, s) { s = s || 20; return '<svg class="i" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + PATHS[n] + '</svg>'; }

  /* Onboarding art: simple original illustrations, decorative only */
  var ART = [
    '<svg viewBox="0 0 240 200" aria-hidden="true" focusable="false"><ellipse cx="120" cy="182" rx="96" ry="9" fill="#E1E8F2"/><rect x="34" y="38" width="72" height="132" rx="13" fill="#1F4E8C"/><rect x="41" y="48" width="58" height="108" rx="7" fill="#DCE8F7"/><rect x="134" y="38" width="72" height="132" rx="13" fill="#1F4E8C"/><rect x="141" y="48" width="58" height="108" rx="7" fill="#DCE8F7"/><circle cx="70" cy="86" r="13" fill="#F4A259"/><path d="M52 132c3-19 33-19 36 0z" fill="#E76F51"/><circle cx="170" cy="86" r="13" fill="#8C5A3C"/><path d="M152 132c3-19 33-19 36 0z" fill="#2F80ED"/><path d="M96 70c12-16 36-16 48 0" fill="none" stroke="#1F4E8C" stroke-width="3" stroke-dasharray="4 6" stroke-linecap="round"/><circle cx="120" cy="112" r="17" fill="#F7C333" stroke="#fff" stroke-width="3"/><path d="M124 106c-1-2-3-3-5-3-3 0-5 1.6-5 3.6 0 4.8 10 2.6 10 7.4 0 2-2 3.6-5 3.6-2.5 0-4.4-1.2-5-3M119 100v3M119 117v3" fill="none" stroke="#7a5600" stroke-width="2.2" stroke-linecap="round"/><circle cx="200" cy="40" r="13" fill="#2F80ED"/><path d="M194 40l4 4 8-8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 240 200" aria-hidden="true" focusable="false"><ellipse cx="120" cy="182" rx="90" ry="9" fill="#E1E8F2"/><path d="M96 74a30 30 0 1 1 46 25c-9 6-13 11-13 21v7" fill="none" stroke="#E76F51" stroke-width="19" stroke-linecap="round"/><circle cx="129" cy="156" r="11" fill="#E76F51"/><rect x="152" y="36" width="66" height="42" rx="11" fill="#9EC5F8"/><path d="M165 77l-7 13 18-13z" fill="#9EC5F8"/><rect x="163" y="49" width="44" height="6" rx="3" fill="#fff"/><rect x="163" y="61" width="30" height="6" rx="3" fill="#fff"/><circle cx="56" cy="92" r="12" fill="#8C5A3C"/><path d="M44 176l4-58c1-8 15-8 16 0l4 58z" fill="#1F4E8C"/><path d="M66 124l18-14" stroke="#1F4E8C" stroke-width="7" stroke-linecap="round"/><circle cx="36" cy="44" r="10" fill="#7FA7DC"/><circle cx="36" cy="44" r="4" fill="#fff"/></svg>',
    '<svg viewBox="0 0 240 200" aria-hidden="true" focusable="false"><ellipse cx="120" cy="182" rx="90" ry="9" fill="#E1E8F2"/><rect x="82" y="26" width="80" height="144" rx="14" fill="#1F4E8C"/><rect x="90" y="38" width="64" height="120" rx="7" fill="#DCE8F7"/><path d="M104 66c10-12 26-12 36 0" fill="none" stroke="#2F80ED" stroke-width="5" stroke-linecap="round"/><path d="M134 58l7 8-9 3" fill="none" stroke="#2F80ED" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="62" y="98" width="96" height="58" rx="9" fill="#2F80ED"/><rect x="62" y="110" width="96" height="11" fill="#1F4E8C"/><rect x="73" y="134" width="32" height="8" rx="4" fill="#fff"/><circle cx="178" cy="54" r="16" fill="#F7C333" stroke="#fff" stroke-width="3"/><circle cx="64" cy="62" r="12" fill="#F7C333" stroke="#fff" stroke-width="3"/><g fill="#F4A259"><rect x="162" y="140" width="36" height="9" rx="4.5"/><rect x="165" y="151" width="36" height="9" rx="4.5"/><rect x="160" y="162" width="36" height="9" rx="4.5"/></g></svg>'
  ];
  var SLIDES = [
    ['Welcome to the New IRS2Go!', 'Explore faster ways to check your refund, get tax help, and make secure payments, all in one place.'],
    ['Your Tax Questions, Answered', 'Access FAQs, contact support, or submit a help request, all from the Help Center.'],
    ['Make Secure Payments with Confidence', 'Review your payment summary before checkout, and get receipts your way: email, SMS, or download.']
  ];

  /* ── Data ──────────────────────────────────────────────────────────── */
  var YEARS = [['2025', '2025 (Latest Tax Year)'], ['2024', '2024'], ['2023', '2023']];
  var FILING = [['single', 'Single'], ['mfj', 'Married filing jointly'], ['mfs', 'Married filing separately'], ['hoh', 'Head of household'], ['qss', 'Qualifying surviving spouse']];
  var SAMPLE = { year: '2025', ssn: '000-00-9735', fs: 'single', amt: '345.80' };
  var SIZES = [[1, 'Default'], [1.15, 'Large'], [1.3, 'Larger']];
  var PROCS = { pay1040: 'Pay1040', aci: 'ACI Payments, Inc.' };
  var CARD = {
    debit: { label: 'Personal debit card', short: 'Debit', rate: '$2.15 flat fee', fee: function () { return 2.15; } },
    credit: { label: 'Credit card', short: 'Credit', rate: '1.75% (min. $2.50)', fee: function (a) { return Math.max(2.5, r2(a * 0.0175)); } },
    commercial: { label: 'Commercial card', short: 'Commercial', rate: '2.89% (min. $2.50)', fee: function (a) { return Math.max(2.5, r2(a * 0.0289)); } }
  };
  var STATUS = [
    { t: 'Return Received', p: ['We have received your tax return and it is being processed.', 'If you filed a complete and accurate tax return, your refund should be issued within 21 days of the received date. However, processing may take longer under certain circumstances.'] },
    { t: 'Refund Approved', p: ['Your refund is approved. We are preparing to send it to your bank or by mail.', 'This screen will show the date we expect to send it.'] },
    { t: 'Refund Sent', p: ['Your refund is on its way.', 'Bank deposits can take a few days to show up in your account. Mailed checks take longer.'] }
  ];
  /* What broke in the old app (from my research) and how the redesign fixes it */
  var ISSUES = {
    r1: { t: 'No labels, no hints', b: 'Fields had no labels or format hints, so the rules only showed up after an error.', fix: 'Every field has a label and an example, plus a sample form that shows where to find each number.', go: 'refund' },
    r2: { t: '"Invalid entry", with no clue why', b: 'One vague error for the whole form, so people retried and gave up. 68% of people who tried left without a clear answer.', fix: 'Each field says exactly what is missing and how to fix it.', go: 'refund' },
    a1: { t: 'Not accessible', b: 'None of the original screens met WCAG 2.1 AA. (This rebuild uses passing colors, so this page stays accessible.)', fix: 'Every redesigned screen meets WCAG 2.1 AA, and you can make the text bigger inside the app.', go: 'more' },
    r3: { t: 'A status with no date or next step', b: '"Return Received", and nothing else. People could not tell what happens next, or when.', fix: 'A three-step timeline, Received, Approved, Sent, with what to expect at each step.', go: 'status' },
    p1: { t: 'Off to the website mid-task', b: 'Both options sent people to the website halfway through, with no summary before paying.', fix: 'Fees are compared in the app, and you confirm a summary before anything is paid.', go: 'paycard' },
    h1: { t: 'No results for a real ZIP code', b: 'The office finder showed no results for valid zip codes.', fix: 'Office search, phone numbers and online tools all live inside the app.', go: 'office' },
    c1: { t: 'Help means leaving the app', b: 'Phone numbers and local offices just link out to the website. In Alex\'s journey, this is where he gives up and searches online instead.', fix: 'All phone numbers and the office finder are part of Tax Help, in the app.', go: 'call' }
  };
  var LEAVE_PAY = 'Off to IRS.gov in the browser, in the middle of paying.', LEAVE_WEB = 'Off to IRS.gov in the browser. You have left the app.', LEAVE_OUT = 'This opens outside the app.';
  var OLDMAP = { onb: 'refund', login: 'refund', loginform: 'refund', status: 'status', paybank: 'pay', paycard: 'pay', payok: 'pay', call: 'o-contact', office: 'o-locator', tools: 'o-contact' };
  var NEWMAP = { 'o-locator': 'office', 'o-contact': 'call' };

  /* ── Helpers ───────────────────────────────────────────────────────── */
  function r2(n) { return Math.round(n * 100) / 100; }
  function money(n) { var p = r2(n).toFixed(2).split('.'); return '$' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + p[1]; }
  function parseAmt(v) { var t = String(v || '').replace(/[\s$,]/g, ''); if (!/^\d+(\.\d{1,2})?$/.test(t)) return null; var n = parseFloat(t); return n > 0 ? n : null; }
  function digits(v) { return String(v || '').replace(/\D/g, ''); }
  function label(list, v) { for (var i = 0; i < list.length; i++) if (list[i][0] === v) return list[i][1]; return ''; }
  function copy(o) { var r = {}; for (var k in o) r[k] = o[k]; return r; }
  function check(f) {
    var e = {};
    if (!f.year) e.year = 'Choose the tax year you filed for.';
    if (digits(f.ssn).length !== 9) e.ssn = 'Enter all 9 digits of your SSN.';
    if (!f.fs) e.fs = 'Choose the filing status on your return.';
    if (parseAmt(f.amt) === null) e.amt = 'Enter the refund amount from your return, like 345.80.';
    return e;
  }
  function n(o) { return Object.keys(o).length; }
  function last4(f) { var d = digits(f.ssn); return d.length === 9 ? d.slice(5) : '9735'; }

  /* ── Shared pieces ─────────────────────────────────────────────────── */
  var LOGO = '<span class="ir-logo" role="img" aria-label="IRS2GO"><span class="badge" aria-hidden="true">' + ic('bank', 16) + '</span><span class="wm" aria-hidden="true"><b>IRS</b>2GO</span></span>';
  function top(right) { return '<div class="ir-top">' + LOGO + (right || '') + '</div>'; }
  function hd(title, back) { return '<div class="ir-hd"><button type="button" class="ir-bk" data-a="go" data-v="' + back + '" data-k="back" aria-label="Back">' + ic('back', 18) + '</button><h2 data-k="h" tabindex="-1">' + esc(title) + '</h2></div>'; }
  function tabs(cur) {
    var T = [['refund', 'Refunds', 'dollar'], ['pay', 'Payments', 'card'], ['help', 'Tax Help', 'help'], ['more', 'More', 'grid']];
    return '<div class="ir-tabs" role="group" aria-label="App tabs">' + T.map(function (t) { return '<button type="button" data-a="tab" data-v="' + t[0] + '" data-k="tab-' + t[0] + '"' + (cur === t[0] ? ' aria-current="page"' : '') + '>' + ic(t[2], 22) + '<span>' + t[1] + '</span></button>'; }).join('') + '</div>';
  }
  function row(a, b, strong) { return '<div class="ir-row' + (strong ? ' tot' : '') + '"><span>' + a + '</span><b>' + b + '</b></div>'; }
  function navcard(a, v, icon, title, sub) { return '<button type="button" class="ir-card" data-a="' + a + '"' + (v ? ' data-v="' + v + '"' : '') + ' data-k="c-' + (v || a) + '"><span class="ic" aria-hidden="true">' + ic(icon, 20) + '</span><span><b>' + title + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span><span class="chev" aria-hidden="true">' + ic('chev', 18) + '</span></button>'; }
  function wrap(s, inner, cls) { return '<div class="ir' + (cls ? ' ' + cls : '') + (s.bold ? ' bold' : '') + '" style="--fs:' + s.fsz + '">' + inner + '</div>'; }
  function demoBtn(a, text, k) { return '<button type="button" class="ir-demo" data-a="' + a + '" data-k="' + (k || a) + '">' + ic('spark', 16) + '<span>' + text + '</span></button>'; }
  function sizeCtl(s, uid, where) {
    return '<div class="ir-lab"><span id="' + uid + where + 'sz">Text size</span></div><div class="ir-size" role="group" aria-labelledby="' + uid + where + 'sz">' + SIZES.map(function (z) {
      return '<button type="button" data-a="fsz" data-v="' + z[0] + '" data-k="' + where + 'fsz' + z[0] + '" aria-pressed="' + (s.fsz === z[0]) + '"><span style="font-size:' + Math.round(15 * z[0]) + 'px">A</span>' + z[1] + '</button>';
    }).join('') + '</div>';
  }
  function boldCtl(s, uid, where) { return '<label class="ir-toggle" for="' + uid + where + 'b"><span>Bold text</span><input id="' + uid + where + 'b" type="checkbox" role="switch" data-i="bold" data-k="' + where + 'bold"' + (s.bold ? ' checked' : '') + '></label>'; }

  /* ── Redesign screens ──────────────────────────────────────────────── */
  function vOnb(s) {
    var i = s.slide, dots = '';
    for (var d = 0; d < 3; d++) dots += '<button type="button" data-a="slide" data-v="' + d + '" data-k="dot' + d + '" aria-label="Slide ' + (d + 1) + ' of 3"' + (d === i ? ' aria-current="true"' : '') + '></button>';
    return { bar: '#F6F8FC', html: wrap(s, '<div class="ir-onb"><div class="ir-art">' + ART[i] + '</div><h2 data-k="h" tabindex="-1">' + SLIDES[i][0] + '</h2><p>' + SLIDES[i][1] + '</p><div class="ir-dots" role="group" aria-label="Intro slides">' + dots + '</div><button type="button" class="ir-btn" data-a="next" data-k="next">Next</button><button type="button" class="ir-skip" data-a="skip" data-k="skip">Skip</button></div>') };
  }
  function vLogin(s) {
    return { html: wrap(s, '<div class="ir-login">' + LOGO.replace('ir-logo', 'ir-logo big') +
      '<div class="ir-preview" aria-hidden="true"><span class="on"><i>1</i>Return Received</span><span><i>2</i>Refund Approved</span><span><i>3</i>Refund Sent</span></div>' +
      '<h2 data-k="h" tabindex="-1">Check your refund status</h2><p class="ir-p">By entering your information as shown on your tax return. This tool is updated no more than once every 24 hours, usually overnight.</p>' +
      '<button type="button" class="ir-btn" data-a="guest" data-k="guest">Explore without signing in</button>' +
      '<button type="button" class="ir-btn ghost" data-a="go" data-v="loginform" data-k="login">Log In</button>' +
      '<p class="ir-small">New user? <button type="button" class="ir-link" data-a="toast" data-v="Sign-up is turned off in this demo." data-k="signup">Sign Up</button></p></div>') };
  }
  function vLoginForm(s, ui) {
    var u = ui.uid;
    return { html: wrap(s, hd('Log In', 'login') + '<div class="ir-main"><p class="ir-p">Continue to IRS2GO</p><p class="ir-note">' + ic('lock', 16) + ' Sign-in is turned off in this demo, so these fields are locked.</p><div class="ir-form">' +
      '<div class="ir-f"><div class="ir-lab"><label for="' + u + 'em">Your Email <abbr title="required" aria-hidden="true">*</abbr></label></div><div class="ir-in"><input id="' + u + 'em" type="email" disabled placeholder="name@example.com"></div></div>' +
      '<div class="ir-f"><div class="ir-lab"><label for="' + u + 'pw">Password <abbr title="required" aria-hidden="true">*</abbr></label></div><div class="ir-in"><input id="' + u + 'pw" type="password" disabled placeholder="Password"></div></div>' +
      '<button type="button" class="ir-btn" data-a="toast" data-v="Sign-in is turned off in this demo. Try Explore without signing in." data-k="li">Log In</button>' +
      '<button type="button" class="ir-link ir-center" data-a="toast" data-v="Password help is turned off in this demo." data-k="fp">Forgot your password?</button>' +
      '<div class="ir-or"><span>OR</span></div><button type="button" class="ir-btn ghost" data-a="guest" data-k="guest2">Explore without signing in</button></div></div>') };
  }
  function vRefund(s, ui) {
    var f = s.f, e = s.err, u = ui.uid, full = !n(check(f));
    function fld(name, lab, ctrl, hint, extra) {
      var err = e[name], hid = u + name + 'h', eid = u + name + 'e', desc = (hint ? hid : '') + (err ? (hint ? ' ' : '') + eid : '');
      ctrl = ctrl.replace('%A%', ' id="' + u + name + '" data-i="' + name + '" data-k="' + name + '" aria-required="true"' + (desc ? ' aria-describedby="' + desc + '"' : '') + (hint ? ' data-hint="' + hid + '"' : '') + (err ? ' aria-invalid="true"' : ''));
      return '<div class="ir-f' + (err ? ' bad' : '') + '" data-f="' + name + '"><div class="ir-lab"><label for="' + u + name + '">' + lab + ' <abbr title="required" aria-hidden="true">*</abbr></label>' + (extra || '') + '</div>' + ctrl +
        (hint ? '<span class="ir-hint" id="' + hid + '">' + hint + '</span>' : '') +
        '<span class="ir-err" id="' + eid + '"' + (err ? '' : ' hidden') + '>' + ic('alert', 16) + '<span>' + esc(err || '') + '</span></span></div>';
    }
    function sel(name, ph, list) {
      return '<div class="ir-in sel"><select%A% class="' + (f[name] ? '' : 'empty') + '"><option value="">' + ph + '</option>' + list.map(function (o) { return '<option value="' + o[0] + '"' + (f[name] === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select><span class="end" aria-hidden="true">' + ic('down', 18) + '</span></div>';
    }
    var form = fld('year', 'Tax Year', sel('year', 'Select Tax Year', YEARS)) +
      fld('ssn', 'Social Security number (SSN)', '<div class="ir-in"><input%A% type="' + (s.showSsn ? 'text' : 'password') + '" inputmode="numeric" autocomplete="off" maxlength="11" placeholder="XXX - XX - XXXX" value="' + esc(f.ssn) + '"><button type="button" class="eye" data-a="eye" data-k="eye" aria-label="' + (s.showSsn ? 'Hide SSN' : 'Show SSN') + '">' + ic(s.showSsn ? 'eyeoff' : 'eye', 20) + '</button></div>', 'Demo: please use the sample data, not a real SSN.', '<button type="button" class="ir-qi" data-a="ssninfo" data-k="ssninfo" aria-label="About the SSN field">' + ic('info', 16) + '</button>') +
      fld('fs', 'Filing Status', sel('fs', 'Select Filing Status', FILING)) +
      fld('amt', 'Refund Amount', '<div class="ir-in"><span class="pre" aria-hidden="true">$</span><input%A% type="text" inputmode="decimal" autocomplete="off" placeholder="Enter amount. Ex: 10.00" value="' + esc(f.amt) + '"></div>', 'The exact amount from your return. Commas are fine.');
    return { html: wrap(s, top('<button type="button" class="ir-link" data-a="privacy" data-k="priv">Privacy Notice</button>') +
      '<div class="ir-main"><h2 class="t" data-k="h" tabindex="-1">Refund Status</h2><p class="ir-p">Check your refund status by entering your information as shown on your tax return. This tool is updated no more than once every 24 hours, usually overnight.</p>' +
      '<button type="button" class="ir-link ir-sf" data-a="sampleform" data-k="sf">Sample Form ' + ic('chev', 14) + '</button>' +
      demoBtn('fill', 'Demo: fill in sample data') +
      '<div class="ir-form">' + form + '</div>' +
      '<button type="button" class="ir-btn ir-get' + (full ? '' : ' muted') + '" data-a="get" data-k="get">Get Status</button>' +
      '<button type="button" class="ir-acc" data-a="a11y" data-k="acc">' + ic('a11y', 20) + ' Check Accessibility</button></div>' + tabs('refund')) };
  }
  function vStatus(s) {
    if (n(check(s.f))) { s.f = copy(SAMPLE); s.err = {}; }
    var st = s.status, f = s.f, info = STATUS[st];
    var steps = STATUS.map(function (x, i) { return '<li class="' + (i <= st ? 'on' : '') + '"' + (i === st ? ' aria-current="step"' : '') + '><i aria-hidden="true">' + (i < st ? ic('check', 14) : (i + 1)) + '</i><span>' + x.t + '</span></li>'; }).join('');
    return { html: wrap(s, hd('Refund Status', 'refund') + '<div class="ir-main"><ol class="ir-steps" aria-label="Refund progress">' + steps + '</ol>' +
      '<div class="ir-res" aria-live="polite"><h3>' + info.t + '</h3>' + info.p.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
      '<p class="ir-fine">Please Note: For refund information, please continue to check here, or visit the Refunds page on IRS.gov. Updates to refund status are made no more than once a day.</p>' +
      '<div class="ir-meta"><span><b>SSN:</b> XXX-XX-' + last4(f) + '</span><span><b>Filing Status:</b> ' + label(FILING, f.fs) + '</span><span><b>Tax Year:</b> ' + f.year + '</span><span><b>Refund:</b> ' + money(parseAmt(f.amt) || 0) + '</span></div>' +
      '<div class="ir-info"><span class="q" aria-hidden="true">?</span><div><b>Helpful Information</b>Please read the following information related to your tax situation: <button type="button" class="ir-link" data-a="toast" data-v="In the full design, Tax Topic 152 opens inside the app." data-k="tt">Tax Topic 152, Refund Information</button></div></div>' +
      demoBtn('nextstatus', st < 2 ? 'Demo: see the next status' : 'Demo: start over at Received') + '</div>') };
  }
  function vPay(s) {
    return { html: wrap(s, top() + '<div class="ir-main"><h2 class="t" data-k="h" tabindex="-1">Payments</h2>' +
      navcard('go', 'paybank', 'bank', 'Pay with Bank Account', 'If you\'re an individual taxpayer, IRS Direct Pay offers you a free, secure payment method.') +
      navcard('go', 'paycard', 'card', 'Pay with Debit/Credit Card', 'Choose an approved payment processor to make a secure tax payment online or by phone.') +
      '<div class="ir-info"><span class="q" aria-hidden="true">?</span><div>Can\'t pay now, need more payment options, or want additional information? Visit our payments website at <button type="button" class="ir-link" data-a="toast" data-v="In the full design, IRS.gov/Payments opens inside the app." data-k="irsp">IRS.gov/Payments</button>.</div></div></div>' + tabs('pay')) };
  }
  function amtField(s, u) {
    var err = s.payErr;
    return '<div class="ir-f' + (err ? ' bad' : '') + '"><div class="ir-lab"><label for="' + u + 'pa">Amount to pay</label></div><div class="ir-in"><span class="pre" aria-hidden="true">$</span><input id="' + u + 'pa" data-i="payamt" data-k="payamt" type="text" inputmode="decimal" autocomplete="off" value="' + esc(s.amt) + '"' + (err ? ' aria-invalid="true" aria-describedby="' + u + 'pae"' : '') + '></div>' + (err ? '<span class="ir-err" id="' + u + 'pae">' + ic('alert', 16) + '<span>' + err + '</span></span>' : '') + '</div>';
  }
  function payNums(s) { var a = parseAmt(s.amt) || 0, fee = s.via === 'bank' ? 0 : CARD[s.ptype].fee(a); return { a: a, fee: fee, tot: a + fee }; }
  function vPayBank(s, ui) {
    s.via = 'bank'; var m = payNums(s);
    return { html: wrap(s, hd('Pay with Bank Account', 'pay') + '<div class="ir-main"><span class="ir-tag">IRS Direct Pay</span><p class="ir-p ir-gap">If you\'re an individual taxpayer, IRS Direct Pay offers you a free, secure payment method.</p><div class="ir-form">' + amtField(s, ui.uid) + '</div>' +
      '<div class="ir-box">' + row('From', 'Sample checking ••••4821') + row('Fee', 'Free') + '</div></div>' +
      '<div class="ir-pay"><div class="sum tot"><span>Total</span><b data-total>' + money(m.tot) + '</b></div><button type="button" class="ir-btn" data-a="review" data-k="review">Review payment</button></div>') };
  }
  function vPayCard(s, ui) {
    s.via = 'card'; var m = payNums(s), pt = s.ptype;
    function cell(k, l, v, mn) { return '<span class="fee' + (k === pt ? ' on' : '') + '"><span>' + l + '</span><b>' + v + '</b>' + (mn ? '<small>' + mn + '</small>' : '') + '</span>'; }
    var fees = '<span class="ir-fees">' + cell('debit', 'Personal debit card', '$2.15') + cell('cash', 'Cash', '$1.50') + cell('credit', 'Credit card', '1.75%', 'Minimum fee $2.50') + cell('commercial', 'Commercial card', '2.89%', 'Minimum fee $2.50') + '</span>';
    var procs = Object.keys(PROCS).map(function (k) { return '<button type="button" class="ir-proc" data-a="proc" data-v="' + k + '" data-k="proc-' + k + '" aria-pressed="' + (s.proc === k) + '"><span class="nm">' + PROCS[k] + '<span class="radio" aria-hidden="true"></span></span>' + fees + '</button>'; }).join('');
    var seg = '<div class="ir-lab"><span id="' + ui.uid + 'ct">Your card</span></div><div class="ir-seg" role="group" aria-labelledby="' + ui.uid + 'ct">' + Object.keys(CARD).map(function (k) { return '<button type="button" data-a="ptype" data-v="' + k + '" data-k="pt-' + k + '" aria-pressed="' + (pt === k) + '">' + CARD[k].short + '</button>'; }).join('') + '</div>';
    return { html: wrap(s, hd('Fees by processor', 'pay') + '<div class="ir-main"><p class="ir-p">Choose the payment processor below that offers you the best fees for your card type and payment amount.</p><p class="ir-note">' + ic('info', 16) + ' Fees are from my 2025 design file, not live rates.</p>' +
      '<div class="ir-form">' + amtField(s, ui.uid) + '<div>' + seg + '</div></div>' + procs +
      '<button type="button" class="ir-more-btn" data-a="accepted" data-k="acc-list" aria-expanded="' + !!s.accOpen + '" aria-controls="' + ui.uid + 'al">Payment accepted ' + ic('down', 16) + '</button>' +
      '<div class="ir-acc-list" id="' + ui.uid + 'al"' + (s.accOpen ? '' : ' hidden') + '><p><b>Debit/Credit card:</b> Visa, Mastercard, Discover, American Express, STAR, Pulse, NYCE, Accel, AFFN, Cirrus, Interlink, Jeanie, Shazam, Maestro</p><p><b>Digital wallet:</b> Click to Pay, PayPal</p><p><b>Pay with cash:</b> VanillaDirect</p></div></div>' +
      '<div class="ir-pay"><div class="sum"><span>Fee, ' + CARD[pt].short.toLowerCase() + ' card with ' + PROCS[s.proc] + '</span><b data-fee>' + money(m.fee) + '</b></div><div class="sum tot"><span>Total charge</span><b data-total>' + money(m.tot) + '</b></div><button type="button" class="ir-btn" data-a="review" data-k="review">Make a payment</button></div>') };
  }
  function vPayOk(s) {
    var p = s.paid || { a: 540, fee: 2.15, who: 'Pay1040', date: '' };
    return { html: wrap(s, hd('Payment', 'pay') + '<div class="ir-main"><div class="ir-done"><span class="ir-ok" aria-hidden="true">' + ic('check', 34) + '</span><h3 data-k="h2" tabindex="-1">Payment Successful</h3><p>Receipt sent to the email on file.</p></div>' +
      '<div class="ir-box">' + row('SSN', 'XXX-XX-' + last4(s.f)) + row('Payment Date', p.date) + row('Paid with', p.who) + row('Tax payment', money(p.a)) + row('Fee', money(p.fee)) + row('Amount Paid', money(p.a + p.fee), true) + '</div>' +
      '<div class="ir-lab ir-gap"><span>Get your receipt</span></div><div class="ir-rcpt">' +
      ['Email', 'SMS', 'Download'].map(function (w) { return '<button type="button" data-a="toast" data-v="Receipt by ' + w.toLowerCase() + ': simulated in this demo." data-k="rc-' + w + '">' + w + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="ir-btn ir-gap" data-a="go" data-v="pay" data-k="done">Done</button></div>') };
  }
  function vHelp(s) {
    var soon = 'In the full design, this opens inside the app.';
    return { html: wrap(s, top() + '<div class="ir-main"><h2 class="t" data-k="h" tabindex="-1">Tax Help</h2><p class="ir-p">Find answers, call us, or get help in person.</p>' +
      navcard('go', 'call', 'phone', 'Call us', 'All phone numbers and hours') +
      navcard('go', 'office', 'pin', 'Find a local office', 'In-person help, by appointment') +
      navcard('go', 'tools', 'tools', 'Online tools', 'Refunds, payments, records and forms') +
      '<h3 class="ir-sec">Stay connected</h3>' +
      '<button type="button" class="ir-card" data-a="toast" data-v="' + soon + '" data-k="yt"><span class="ic" aria-hidden="true">' + ic('play', 20) + '</span><span><b>Videos</b><small>Short how-to videos</small></span><span class="chev" aria-hidden="true">' + ic('chev', 18) + '</span></button>' +
      '<button type="button" class="ir-card" data-a="toast" data-v="' + soon + '" data-k="tips"><span class="ic" aria-hidden="true">' + ic('mail', 20) + '</span><span><b>Tax tips by email</b><small>Subscribe to IRS tax tips</small></span><span class="chev" aria-hidden="true">' + ic('chev', 18) + '</span></button>' +
      '<button type="button" class="ir-card" data-a="toast" data-v="' + soon + '" data-k="x"><span class="ic" aria-hidden="true">' + ic('chat', 20) + '</span><span><b>IRS on X</b><small>News and updates</small></span><span class="chev" aria-hidden="true">' + ic('chev', 18) + '</span></button>' +
      '</div>' + tabs('help')) };
  }
  function vCall(s) {
    function line(who, hrs, note) { return '<div class="ir-call"><div><b>' + who + '</b><small>' + hrs + '</small>' + (note ? '<small>' + note + '</small>' : '') + '</div><button type="button" class="ir-btn" data-a="toast" data-v="Calling ' + who + ': simulated in this demo." data-k="call-' + who.charAt(0) + '" aria-label="Call, ' + who + '">CALL</button></div>'; }
    return { html: wrap(s, hd('All Phone Numbers', 'help') + '<div class="ir-main"><div class="ir-box tint"><b class="ir-q">Questions about your refund?</b><p>Please check it here before calling.</p><p>Refunds are generally issued in less than 21 days after we receive your tax return. You should only call if it\'s been longer.</p><button type="button" class="ir-link" data-a="go" data-v="refund" data-k="chk">Check my refund ' + ic('chev', 14) + '</button></div>' +
      line('Individuals', 'Monday to Friday, 7am to 7pm local time', 'Don\'t wait on the phone. Most tax questions can be answered on IRS.gov.') +
      line('Businesses', 'Monday to Friday, 7am to 7pm local time') +
      line('Victims of Identity Theft', 'Monday to Friday, 7am to 7pm local time', 'For more, see Identity Theft and Your Tax Records.') + '</div>') };
  }
  function vOffice(s, ui) {
    var u = ui.uid, res = '';
    if (s.zipRes) {
      res = '<div class="ir-results" aria-live="polite"><p class="ir-rh"><b>3 offices near ' + esc(s.zipRes) + '</b><span>Sample results for this demo</span></p>' +
        [['Downtown office', '1.2 mi'], ['Northside office', '3.8 mi'], ['Eastgate office', '7.5 mi']].map(function (o, i) {
          return '<div class="ir-office"><b>Taxpayer Assistance Center, ' + o[0] + '</b><small>' + o[1] + ' away · Monday to Friday, by appointment</small><div class="acts"><button type="button" class="ir-btn" data-a="toast" data-v="Booking a visit: simulated in this demo." data-k="bk' + i + '">' + ic('cal', 18) + ' Call to book</button><button type="button" class="ir-btn ghost" data-a="toast" data-v="Directions: simulated in this demo." data-k="dr' + i + '">Directions</button></div></div>';
        }).join('') + '</div>';
    }
    return { html: wrap(s, hd('Local Office', 'help') + '<div class="ir-main"><h3 class="ir-h3">Contact your local IRS office</h3><p class="ir-p">You can get in-person help at your local IRS Taxpayer Assistance Center.</p><p class="ir-p ir-gap">Call for an appointment after you find a Taxpayer Assistance Center near you.</p>' +
      '<div class="ir-form"><div class="ir-f' + (s.zipErr ? ' bad' : '') + '"><div class="ir-lab"><label for="' + u + 'zip">ZIP code</label></div><div class="ir-in"><input id="' + u + 'zip" data-i="zip" data-k="zip" type="text" inputmode="numeric" autocomplete="off" maxlength="5" placeholder="Ex: 48104" value="' + esc(s.zip) + '"' + (s.zipErr ? ' aria-invalid="true" aria-describedby="' + u + 'ze"' : '') + '></div>' + (s.zipErr ? '<span class="ir-err" id="' + u + 'ze">' + ic('alert', 16) + '<span>Enter a 5-digit ZIP code, like 48104.</span></span>' : '') + '</div></div>' +
      '<button type="button" class="ir-btn ir-gap" data-a="findoffice" data-k="find">' + ic('search', 18) + ' Find a Taxpayer Assistance Center office</button>' + res + '</div>') };
  }
  function vTools(s) {
    var soon = 'In the full design, this opens the IRS.gov page inside the app.';
    var L = [['user', 'Apply for an Employer ID Number (EIN)', ''], ['doc', 'Explore free filing options', ''], ['lock', 'Sign in to your account', 'go:login'], ['cal', 'Get your refund status', 'go:refund'], ['card', 'Make a payment', 'go:pay'], ['doc', 'Get your tax record', ''], ['info', 'Find forms & instructions', '']];
    return { html: wrap(s, hd('Online Tools', 'help') + '<div class="ir-main"><h3 class="ir-h3">How can we help you?</h3><div class="ir-menu">' + L.map(function (x, i) {
      var go = x[2] ? x[2].split(':')[1] : '';
      return '<button type="button" ' + (go ? 'data-a="go" data-v="' + go + '"' : 'data-a="toast" data-v="' + soon + '"') + ' data-k="t' + i + '"><span class="ic" aria-hidden="true">' + ic(x[0], 20) + '</span><span>' + esc(x[1]) + '</span>' + ic('chev', 16) + '</button>';
    }).join('') + '</div></div>') };
  }
  function vMore(s, ui) {
    return { html: wrap(s, top() + '<div class="ir-main"><h2 class="t" data-k="h" tabindex="-1">More</h2>' +
      '<div class="ir-box"><h3 class="ir-sec first">Accessibility</h3>' + sizeCtl(s, ui.uid, 'm') + boldCtl(s, ui.uid, 'm') + '</div>' +
      '<div class="ir-menu">' +
      '<button type="button" data-a="privacy" data-k="m-priv"><span class="ic" aria-hidden="true">' + ic('lock', 20) + '</span><span>Privacy Notice</span>' + ic('chev', 16) + '</button>' +
      '<button type="button" data-a="go" data-v="login" data-k="m-login"><span class="ic" aria-hidden="true">' + ic('user', 20) + '</span><span>Log in or sign up</span>' + ic('chev', 16) + '</button>' +
      '<button type="button" data-a="replay" data-k="m-replay"><span class="ic" aria-hidden="true">' + ic('replay', 20) + '</span><span>Replay the intro</span>' + ic('chev', 16) + '</button>' +
      '<button type="button" data-a="about" data-k="m-about"><span class="ic" aria-hidden="true">' + ic('info', 20) + '</span><span>About this prototype</span>' + ic('chev', 16) + '</button>' +
      '</div></div>' + tabs('more')) };
  }

  /* ── The original app ("Old app" mode) ─────────────────────────────── */
  function pin(id, num, cls) { return '<button type="button" class="ir-pin' + (cls ? ' ' + cls : '') + '" data-a="issue" data-v="' + id + '" data-k="pin-' + id + '" aria-label="Problem ' + num + ': ' + esc(ISSUES[id].t) + '">' + num + '</button>'; }
  function ohd(title, back) { return '<div class="ir-oh">' + (back ? '<button type="button" class="ir-obk" data-a="go" data-v="' + back + '" data-k="back" aria-label="Back">' + ic('back', 20) + '</button>' : '') + '<h2 data-k="h" tabindex="-1">' + esc(title) + '</h2></div>'; }
  function otabs(cur) {
    var T = [['refund', 'Refunds', 'dollar'], ['pay', 'Payments', 'card'], ['help', 'Tax Help', 'doc'], ['more', 'Connect', 'chat']];
    return '<div class="ir-otabs" role="group" aria-label="App tabs">' + T.map(function (t) { return '<button type="button" data-a="tab" data-v="' + t[0] + '" data-k="tab-' + t[0] + '"' + (cur === t[0] ? ' aria-current="page"' : '') + '>' + ic(t[2], 20) + '<span>' + t[1] + '</span></button>'; }).join('') + '</div>';
  }
  function olist(items) { return '<div class="ir-old-list">' + items.map(function (x, i) { return '<button type="button" data-a="' + x[0] + '" data-k="ol' + i + '"' + (x[4] ? ' data-v="' + esc(x[4]) + '"' : '') + '><span class="ic" aria-hidden="true">' + ic(x[1], 20) + '</span><span><b>' + x[2] + '</b>' + (x[3] ? '<small>' + x[3] + '</small>' : '') + '</span></button>'; }).join('') + '</div>'; }
  function vOld(s, ui) {
    var o = s.old, sc = OLDMAP[s.screen] || s.screen, h, tab = sc;
    if (['refund', 'status', 'pay', 'help', 'o-locator', 'more', 'o-contact'].indexOf(sc) < 0) sc = 'refund';
    if (sc === 'status' && !o.res) sc = 'refund';
    if (sc === 'refund') {
      var yr = '<option value="">Tax Year</option>' + YEARS.map(function (y) { return '<option value="' + y[0] + '"' + (o.year === y[0] ? ' selected' : '') + '>' + y[0] + '</option>'; }).join('');
      var fs = '<option value="">Filing Status</option>' + FILING.map(function (y) { return '<option value="' + y[0] + '"' + (o.fs === y[0] ? ' selected' : '') + '>' + y[1] + '</option>'; }).join('');
      h = ohd('IRS2Go') + '<div class="ir-old-main">' + (o.err ? '<p class="ir-old-err" role="alert">Invalid entry</p>' : '') +
        '<h3>Refund Status</h3><p>Check your refund status by entering your information as shown on your tax return. This tool is updated no more than once every 24 hours, usually overnight.</p><p>All fields are required.</p>' +
        '<div class="ir-pos">' + pin('r1', 1) +
        '<select class="ir-ol" data-i="o-year" data-k="o-year" aria-label="Tax Year">' + yr + '</select>' +
        '<div class="ir-ssn3" role="group" aria-label="SSN"><span aria-hidden="true">SSN</span><input class="ir-ol" data-i="o-s1" data-k="o-s1" maxlength="3" inputmode="numeric" autocomplete="off" aria-label="SSN, first 3 digits" value="' + esc(o.s1) + '"><span aria-hidden="true">-</span><input class="ir-ol" data-i="o-s2" data-k="o-s2" maxlength="2" inputmode="numeric" autocomplete="off" aria-label="SSN, middle 2 digits" value="' + esc(o.s2) + '"><span aria-hidden="true">-</span><input class="ir-ol w4" data-i="o-s3" data-k="o-s3" maxlength="4" inputmode="numeric" autocomplete="off" aria-label="SSN, last 4 digits" value="' + esc(o.s3) + '"></div>' +
        '<select class="ir-ol" data-i="o-fs" data-k="o-fs" aria-label="Filing Status">' + fs + '</select>' +
        '<input class="ir-ol" data-i="o-amt" data-k="o-amt" type="text" autocomplete="off" placeholder="Refund Amount" aria-label="Refund Amount" value="' + esc(o.amt) + '"></div>' +
        '<div class="ir-old-row"><span class="ir-pos"><button type="button" class="ol-link" data-a="issue" data-v="a1" data-k="o-acc">Accessibility</button>' + pin('a1', 3, 'side') + '</span><span class="ir-pos"><button type="button" class="ir-old-btn" data-a="o-get" data-k="o-get">Get Status</button>' + pin('r2', 2) + '</span></div>' +
        '<button type="button" class="ol-link" data-a="privacy" data-k="o-priv">Privacy Notice</button></div>';
      tab = 'refund';
    } else if (sc === 'status') {
      h = ohd('Refund Status', 'refund') + '<div class="ir-old-main"><div class="ir-pos ir-old-card">' + pin('r3', 1) + '<h3>Return Received</h3><p>We have received your tax return and it is being processed.</p></div></div>';
      tab = 'refund';
    } else if (sc === 'pay') {
      h = ohd('Payments') + '<div class="ir-old-main"><div class="ir-pos">' + pin('p1', 1) + olist([
        ['o-leave', 'bank', 'Pay Directly from Your Bank Account', 'If you\'re an individual taxpayer, IRS Direct Pay offers you a free, secure payment method.', LEAVE_PAY],
        ['o-leave', 'card', 'Pay by Debit Card, Credit Card or Digital Wallet', 'Choose an approved payment processor to make a secure tax payment online or by phone.', LEAVE_PAY]]) +
        '</div><p class="ir-old-note">' + ic('info', 18) + '<span>Can\'t pay now, need more payment options, or want additional information? Visit our payments website at IRS.gov/Payments.</span></p></div>';
    } else if (sc === 'help') {
      h = ohd('Free Tax Help') + '<div class="ir-old-main">' + olist([
        ['o-leave', 'doc', 'IRS Free File', 'Do your taxes for free with brand-name software, if you qualify.', LEAVE_WEB],
        ['go', 'pin', 'Free Tax Prep Site Locator', 'Find a Volunteer Income Tax Assistance (VITA) or Tax Counseling for the Elderly (TCE) site.', 'o-locator'],
        ['o-leave', 'pin', 'AARP Tax-Aide Site Locator', 'Free tax preparation, with a focus on issues unique to seniors.', LEAVE_WEB],
        ['o-leave', 'help', 'Use the EITC Assistant', 'Find out if you are eligible for the earned income tax credit (EITC).', LEAVE_WEB]]) + '</div>';
    } else if (sc === 'o-locator') {
      h = ohd('Free Tax Prep Site Locator', 'help') + '<div class="ir-old-main"><p>Enter a ZIP code to find a free tax preparation site near you.</p><input class="ir-ol" data-i="o-zip" data-k="o-zip" type="text" inputmode="numeric" autocomplete="off" maxlength="10" placeholder="ZIP Code" aria-label="ZIP Code" value="' + esc(o.zip) + '"><button type="button" class="ir-old-btn" data-a="o-find" data-k="o-find">Search</button>' +
        (o.zipTried ? '<div class="ir-pos ir-old-card" role="status">' + pin('h1', 1) + (o.zipBad ? '<p class="ir-old-err">Invalid entry</p>' : '<h3>No results found.</h3><p>No sites were found for ' + esc(o.zipTried) + '.</p>') + '</div>' : '') + '</div>';
      tab = 'help';
    } else if (sc === 'more') {
      h = ohd('Stay Connected') + '<div class="ir-old-main">' + olist([
        ['o-leave', 'chat', 'Twitter', '', LEAVE_OUT], ['o-leave', 'play', 'YouTube', '', LEAVE_OUT], ['o-leave', 'mail', 'Subscribe to Tax Tips', '', LEAVE_OUT], ['go', 'user', 'Contact Us', '', 'o-contact']]) + '</div>';
    } else {
      h = ohd('Contact Us', 'more') + '<div class="ir-old-main"><p>For tax assistance for the deaf and hard of hearing, call the TTY line listed on IRS.gov.</p><div class="ir-pos">' + pin('c1', 1) + olist([
        ['o-leave', 'tools', 'Online Tools', 'Visit IRS.gov for more tools and services', LEAVE_WEB], ['o-leave', 'phone', 'Phone Numbers', '', LEAVE_WEB], ['o-leave', 'pin', 'Local Offices', 'Find a local office on IRS.gov', LEAVE_WEB]]) + '</div></div>';
      tab = 'more';
    }
    return { tone: 'dark', bar: '#3F6797', html: '<div class="ir old">' + h + otabs(tab) + '</div>' };
  }

  /* ── Sheets and dialogs ────────────────────────────────────────────── */
  function a11ySheet(s, uid) { return '<div class="ir-sh"><h3 data-title>Accessibility</h3><p>Make the whole app easier to read.</p>' + sizeCtl(s, uid, 's') + boldCtl(s, uid, 's') + '<div class="acts"><button type="button" class="ir-btn" data-a="close">Done</button></div></div>'; }
  var SHEETS = {
    privacy: '<div class="ir-sh"><h3 data-title>Privacy Notice</h3><p>This is a portfolio prototype. Nothing you type is saved or sent anywhere.</p><p>In the real app, this notice explains how your information is used and protected.</p><div class="acts"><button type="button" class="ir-btn" data-a="close">Got it</button></div></div>',
    about: '<div class="ir-sh"><h3 data-title>About this prototype</h3><p>I rebuilt my IRS2GO redesign in HTML, CSS and JavaScript, so you can use it instead of just looking at it. Screens, copy and colors come from my Figma file.</p><p>All data is sample data. Calls, links, receipts and sign-in are simulated.</p><div class="acts"><button type="button" class="ir-btn" data-a="close">Close</button></div></div>',
    ssninfo: '<div class="ir-sh"><h3 data-title>Social Security number</h3><p>Use the 9-digit Social Security number (or ITIN) shown on your tax return.</p><p>In this demo, please use the sample data instead of a real number.</p><div class="acts"><button type="button" class="ir-btn" data-a="close">Got it</button></div></div>',
    sampleform: '<div class="ir-sh"><h3 data-title>Where to find these on your return</h3><p>Copy each one exactly as it appears on your Form 1040.</p>' +
      '<div class="ir-1040" aria-hidden="true"><div class="r hd"><b>Form 1040</b><span>U.S. Individual Income Tax Return</span><i class="c">1</i><span class="hl">2025</span></div>' +
      '<div class="r"><span>Your social security number</span><i class="c">2</i><span class="hl mono">000-00-9735</span></div>' +
      '<div class="r"><span>Filing Status</span><i class="c">3</i><span class="hl">&#9745; Single</span></div><div class="r faint"><span>Income, deductions and credits</span></div>' +
      '<div class="r"><span>Amount you want refunded to you</span><i class="c">4</i><span class="hl mono">345.80</span></div></div>' +
      '<ol class="ir-key"><li>Tax Year</li><li>Social Security number</li><li>Filing Status</li><li>Refund Amount</li></ol><p class="ir-fine">An illustration, not a real form.</p><div class="acts"><button type="button" class="ir-btn" data-a="close">Got it</button></div></div>',
    incomplete: '<div class="ir-sh ir-dlg"><span class="ir-dlg-ic" aria-hidden="true">' + ic('alert', 28) + '</span><h3 data-title>Incomplete Information</h3><p>Please complete all required fields before proceeding. Ensure all mandatory details are entered to check your status.</p><div class="acts"><button type="button" class="ir-btn" data-a="okinc">OK</button></div></div>',
    bio: '<div class="ir-sh ir-bio"><h3 data-title>Secure SSN Reveal</h3><p>To view your full SSN, please verify.</p><button type="button" class="fp" data-a="scan" data-first aria-label="Scan your fingerprint (simulated)">' + ic('fp', 40) + '</button><p class="ir-fine">Scan your fingerprint.</p><div class="acts"><button type="button" class="ir-btn ghost" data-a="close">Cancel</button></div></div>'
  };

  /* ── Small DOM updates that must not re-render (typing, live totals) ─ */
  function syncGet(sh) { var b = sh.app.querySelector('[data-k="get"]'); if (b) b.classList.toggle('muted', n(check(sh.s.f)) > 0); }
  function clearErr(sh, name) {
    var w = sh.app.querySelector('[data-f="' + name + '"]'); if (!w) return;
    w.classList.remove('bad');
    var c = w.querySelector('input, select'); if (c) { c.removeAttribute('aria-invalid'); var hnt = c.getAttribute('data-hint'); if (hnt) c.setAttribute('aria-describedby', hnt); else c.removeAttribute('aria-describedby'); }
    var e = w.querySelector('.ir-err'); if (e) e.hidden = true;
  }
  function updPay(sh) {
    var m = payNums(sh.s), f = sh.app.querySelector('[data-fee]'), t = sh.app.querySelector('[data-total]');
    if (f) f.textContent = money(m.fee); if (t) t.textContent = money(m.tot);
  }

  P.register('irs2go', {
    label: 'IRS2GO prototype',
    dark: '#003264',
    modes: { after: 'Redesign', before: 'Old app' },
    tourMode: 'after',
    tour: [
      { id: 'skip', label: 'Skip or finish the intro', go: 'onb', extra: { slide: 0 } },
      { id: 'guest', label: 'Explore without signing in', go: 'login' },
      { id: 'refund', label: 'Check a refund status', go: 'refund' },
      { id: 'pay', label: 'Pay $540, seeing the fee before you confirm', go: 'paycard' },
      { id: 'office', label: 'Find a local office by ZIP code', go: 'office' },
      { id: 'size', label: 'Make the text bigger', go: 'more' }
    ],
    tourIntro: 'Each one ticks itself off when you do it on the phone.',
    tourNote: 'Sample data only: nothing you type leaves this page. Fees are from my 2025 design file, not live rates.',
    state: function (sh) {
      sh.uid = sh.uid || 'ir' + Math.random().toString(36).slice(2, 7);
      return {
        mode: 'after', screen: sh.d && sh.d.mode === 'before' ? 'refund' : 'onb', slide: 0, fsz: 1, bold: false,
        f: { year: '', ssn: '', fs: '', amt: '' }, err: {}, showSsn: false, status: 0,
        via: 'card', ptype: 'debit', proc: 'pay1040', amt: '540.00', payErr: '', accOpen: false, paid: null,
        zip: '', zipErr: false, zipRes: '',
        old: { year: '', s1: '', s2: '', s3: '', fs: '', amt: '', err: false, res: false, tries: 0, zip: '', zipTried: '', zipBad: false }
      };
    },
    view: function (s, ui) {
      if (s.mode === 'before') return vOld(s, ui);
      switch (s.screen) {
        case 'onb': return vOnb(s);
        case 'login': return vLogin(s);
        case 'loginform': return vLoginForm(s, ui);
        case 'status': return vStatus(s);
        case 'pay': return vPay(s);
        case 'paybank': return vPayBank(s, ui);
        case 'paycard': return vPayCard(s, ui);
        case 'payok': return vPayOk(s);
        case 'help': return vHelp(s);
        case 'call': return vCall(s);
        case 'office': return vOffice(s, ui);
        case 'tools': return vTools(s);
        case 'more': return vMore(s, ui);
        default: return vRefund(s, ui);
      }
    },
    after: function (s) { this.layer.style.setProperty('--fs', s.fsz); },
    onMode: function (m) {
      var s = this.s;
      if (m === 'before') s.screen = OLDMAP[s.screen] || s.screen;
      else { s.screen = NEWMAP[s.screen] || s.screen; if (s.screen === 'status' && n(check(s.f))) s.screen = 'refund'; }
    },
    input: function (name, v, el, isChange) {
      var s = this.s;
      if (name === 'year' || name === 'fs') { if (!isChange) return; s.f[name] = v; delete s.err[name]; this.render(name); return; }
      if (name === 'ssn' || name === 'amt') { s.f[name] = v; if (s.err[name] && !check(s.f)[name]) { delete s.err[name]; clearErr(this, name); } syncGet(this); return; }
      if (name === 'payamt') { s.amt = v; updPay(this); return; }
      if (name === 'zip') { s.zip = v; return; }
      if (name === 'bold') { if (!isChange) return; s.bold = !!v; this.render(); var o = this.ov.querySelector('[data-i="bold"]'); if (o) o.checked = s.bold; return; }
      if (name.indexOf('o-') === 0) { var k = name.slice(2); if ((k === 'year' || k === 'fs') && !isChange) return; s.old[k] = v; }
    },
    actions: {
      go: function (v) { this.go(v); },
      tab: function (v) { this.go(v); },
      close: function () { this.closeOv(); },
      toast: function (v) { this.toast(v); },
      slide: function (v) { this.s.slide = +v; this.render('dot' + v); this.say(SLIDES[this.s.slide][0]); },
      next: function () { if (this.s.slide < 2) { this.s.slide++; this.render('next'); this.say('Slide ' + (this.s.slide + 1) + ' of 3. ' + SLIDES[this.s.slide][0]); } else { this.tick('skip'); this.go('login'); } },
      skip: function () { this.tick('skip'); this.go('login'); },
      replay: function () { this.s.slide = 0; this.go('onb'); },
      guest: function () { this.tick('guest'); this.go('refund'); this.toast('You\'re in as a guest. No account needed.'); },
      privacy: function () { this.open(SHEETS.privacy); },
      about: function () { this.open(SHEETS.about); },
      ssninfo: function () { this.open(SHEETS.ssninfo); },
      sampleform: function () { this.open(SHEETS.sampleform); },
      a11y: function () { this.open(a11ySheet(this.s, this.uid)); },
      fill: function () { this.s.f = copy(SAMPLE); this.s.err = {}; this.render('get'); this.toast('Sample data filled in. Now tap Get Status.'); },
      eye: function () {
        if (this.s.showSsn) { this.s.showSsn = false; this.render('eye'); return; }
        this.open(SHEETS.bio);
      },
      scan: function (v, el) {
        var self = this; el.disabled = true; el.classList.add('ok'); el.innerHTML = ic('check', 40);
        setTimeout(function () { self.closeOv(true); self.s.showSsn = true; self.render('eye'); self.toast('Verified. Your SSN is showing.'); }, P.reduce ? 0 : 600);
      },
      get: function (v, el) {
        if (el.getAttribute('aria-busy') === 'true') return;
        var s = this.s, e = check(s.f), self = this;
        s.err = e;
        if (n(e)) { this.render('get'); this.open(SHEETS.incomplete, { center: true }); return; }
        el.setAttribute('aria-busy', 'true'); el.innerHTML = '<span class="ir-spin" aria-hidden="true"></span> Checking';
        setTimeout(function () { s.status = 0; self.go('status'); self.tick('refund'); }, P.reduce ? 0 : 650);
      },
      okinc: function () { this.closeOv(true); var el = this.app.querySelector('[aria-invalid="true"]'); if (el) el.focus(); else this.screen.focus(); },
      nextstatus: function () { this.s.status = (this.s.status + 1) % 3; this.render('nextstatus'); this.say('Status: ' + STATUS[this.s.status].t); },
      ptype: function (v) { this.s.ptype = v; this.render('pt-' + v); },
      proc: function (v) { this.s.proc = v; this.render('proc-' + v); },
      accepted: function () { this.s.accOpen = !this.s.accOpen; this.render('acc-list'); },
      review: function () {
        var s = this.s, a = parseAmt(s.amt);
        if (a === null) { s.payErr = 'Enter an amount, like 540.00.'; this.render('payamt'); return; }
        s.payErr = ''; this.render('review');
        var m = payNums(s), card = s.via === 'card';
        this.open('<div class="ir-sh"><h3 data-title>Confirm Your Tax Payment</h3><p>Please review the payment details before proceeding:</p><div class="ir-box">' +
          row('Payment Processor', card ? PROCS[s.proc] : 'IRS Direct Pay') + (card ? row('Card', CARD[s.ptype].label) + row('Rate', CARD[s.ptype].rate) : row('From', 'Sample checking ••••4821')) +
          row('Tax payment', money(m.a)) + row('Fee', money(m.fee)) + row('Total Charge', money(m.tot), true) +
          '</div><div class="acts"><button type="button" class="ir-btn ghost" data-a="close">Cancel</button><button type="button" class="ir-btn" data-a="confirm">Confirm Payment</button></div></div>', { center: true });
      },
      confirm: function () {
        var s = this.s, m = payNums(s);
        s.paid = { a: m.a, fee: m.fee, who: s.via === 'card' ? PROCS[s.proc] + ', ' + CARD[s.ptype].label.toLowerCase() : 'IRS Direct Pay, bank account', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
        this.go('payok'); this.tick('pay');
        var h = this.app.querySelector('[data-k="h2"]'); if (h) h.focus({ preventScroll: true });
      },
      findoffice: function () {
        var s = this.s, z = digits(s.zip);
        if (z.length !== 5) { s.zipErr = true; s.zipRes = ''; this.render('zip'); return; }
        s.zipErr = false; s.zipRes = z; this.render('find'); this.say('3 sample offices found near ' + z + '.'); this.tick('office');
      },
      fsz: function (v) {
        var s = this.s; s.fsz = parseFloat(v); this.render();
        this.ov.querySelectorAll('[data-a="fsz"]').forEach(function (b) { b.setAttribute('aria-pressed', String(parseFloat(b.getAttribute('data-v')) === s.fsz)); });
        if (s.fsz > 1) this.tick('size');
      },
      issue: function (id) {
        var it = ISSUES[id];
        this.open('<div class="ir-sh"><span class="ir-tag red">What went wrong</span><h3 data-title>' + esc(it.t) + '</h3><p>' + esc(it.b) + '</p><span class="ir-tag">The fix</span><p>' + esc(it.fix) + '</p><div class="acts"><button type="button" class="ir-btn ghost" data-a="close">Close</button><button type="button" class="ir-btn" data-a="seefix" data-v="' + id + '">See the fix</button></div></div>');
      },
      seefix: function (id) { var it = ISSUES[id]; this.s.mode = 'after'; if (it.go === 'status') this.s.status = 0; this.go(it.go); },
      'o-get': function () {
        var o = this.s.old;
        var ok = o.year && digits(o.s1).length === 3 && digits(o.s2).length === 2 && digits(o.s3).length === 4 && o.fs && /^\d+(\.\d{1,2})?$/.test(String(o.amt).trim());
        if (!ok) { o.err = true; o.tries++; this.render('o-get'); if (o.tries === 3) this.toast('Three "Invalid entry" errors in a row. In testing, 68% left without a clear answer.'); return; }
        o.err = false; o.res = true; this.go('status');
      },
      'o-find': function () { var o = this.s.old, z = digits(o.zip); o.zipBad = z.length !== 5; o.zipTried = z || ' '; this.render('o-find'); },
      'o-leave': function (v) { this.toast(v || LEAVE_WEB); }
    }
  });
  P.start();

})();
