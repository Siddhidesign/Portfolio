/* Money Anchor, rebuilt in code from our final screens: budget home, the
   AI Anchor chat, AI analysis with its explanation, insights, accounts,
   transactions and reports. "Design notes" pins the reasons behind each
   screen; "Before fixes" shows the version people tested, with what broke.
   Runs on ProtoShell (proto.js). Sample data and scripted AI answers only:
   nothing typed here is stored or sent anywhere. */
(function () {
  'use strict';
  var P = window.ProtoShell;
  if (!P) return;
  var esc = P.esc;

  var PATHS = {
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
    bank: '<path d="M3 10h18L12 4.5zM5.5 10v7.5M10 10v7.5M14 10v7.5M18.5 10v7.5M3 20h18"/>',
    doc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
    pie: '<path d="M11 4a8 8 0 1 0 9 9h-9z"/><path d="M14 3.2A8 8 0 0 1 20.8 10H14z"/>',
    bell: '<path d="M6 9.5a6 6 0 0 1 12 0c0 5.5 2.4 7 2.4 7H3.6S6 15 6 9.5"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>',
    robot: '<rect x="4.5" y="8" width="15" height="11" rx="3"/><path d="M12 5v3M9.2 13h.01M14.8 13h.01M9.5 16h5"/><circle cx="12" cy="4" r="1.2"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    dollar: '<path d="M12 3v18M16.5 7.5c-.6-1.6-2.4-2.5-4.5-2.5-2.5 0-4.5 1.3-4.5 3.3 0 4.6 9 2.4 9 7 0 2-2 3.4-4.5 3.4-2.3 0-4.1-1-4.7-2.7"/>',
    tdown: '<path d="M3 7l6 6 4-4 8 8M21 11v6h-6"/>',
    tup: '<path d="M3 17l6-6 4 4 8-8M21 13V7h-6"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.2 7.8 20 18M8.2 16.2 20 6"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    brain: '<path d="M9.5 4.2A3 3 0 0 0 6 7a3 3 0 0 0-2 5.2A3 3 0 0 0 6 17a3 3 0 0 0 5.5 2V5.5a2.4 2.4 0 0 0-2-1.3zM14.5 4.2A3 3 0 0 1 18 7a3 3 0 0 1 2 5.2A3 3 0 0 1 18 17a3 3 0 0 1-5.5 2"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkc: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/>',
    cart: '<path d="M3 4h2l2.2 11h11l2-8H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
    car: '<path d="M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v2.5M19 16v2.5M4 11h16"/><circle cx="8" cy="13.5" r=".9"/><circle cx="16" cy="13.5" r=".9"/>',
    fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1.5-3 4-3 7h3M17 3v18"/>',
    bag: '<path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
    coffee: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v3M12 3.5v3"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.2v.3"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.4"/>',
    repeat: '<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>'
  };
  function ic(n, s) { s = s || 20; return '<svg class="i" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + PATHS[n] + '</svg>'; }

  /* ── Sample data: January 2026, viewed on Jan 24 ───────────────────── */
  var CATS = {
    dine: { name: 'Dining Out', ic: 'fork', budget: 600, color: '#2F6FED' },
    shop: { name: 'Shopping', ic: 'bag', budget: 1000, color: '#8B6CF0' },
    trans: { name: 'Transport', ic: 'car', budget: 400, color: '#1A7F4B' },
    groc: { name: 'Groceries', ic: 'cart', budget: 350, color: '#E8862A' }
  };
  var ORDER = ['dine', 'shop', 'trans', 'groc'];
  var TODAY = 24, DAYS = 31, LEFT = DAYS - TODAY + 1, LAST_MONTH = 1259.20;
  var TX0 = [
    ['Sam Walters', 'dine', 80.00, 23, 'Dinner, split'], ['Fresh Mart', 'groc', 46.75, 22], ['Rideshare', 'trans', 20.50, 21],
    ['Sushi Bar', 'dine', 85.65, 18], ['Electronics store', 'shop', 190.50, 17], ['Corner Market', 'groc', 41.15, 15],
    ['Brunch Spot', 'dine', 64.00, 14], ['Gas station', 'trans', 58.30, 12], ['Online order', 'shop', 189.99, 11],
    ['Pizza Place', 'dine', 52.25, 10], ['Shoe store', 'shop', 120.00, 9], ['Noodle House', 'dine', 38.50, 7],
    ['Department store', 'shop', 245.00, 6], ['Transit pass', 'trans', 75.00, 5], ['Fresh Mart', 'groc', 62.40, 4],
    ['Rideshare', 'trans', 46.20, 3], ['Bookshop', 'shop', 34.51, 2], ['Daily Grind', 'dine', 129.60, 1, '24 coffees this month']
  ];
  var SERIES = {
    monthly: { lab: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'], val: [1402, 1288, 1511, 1346, 1259.2, null] },
    yearly: { lab: ['2022', '2023', '2024', '2025'], val: [14900, 16250, 17800, 16950] }
  };
  var RECEIPT = [['Bananas', 2.49], ['Oat milk', 4.29], ['Bread', 3.99], ['Eggs', 5.49], ['Spinach', 2.99], ['Coffee beans', 4.55]];

  /* Why each screen looks the way it does (blue pins in "Design notes") */
  var NOTES = {
    n1: { t: 'Progress bars, not graphs', b: 'In research, complex charts led to app avoidance. The dashboard shows a simple snapshot: how much is left in each budget.' },
    n2: { t: 'A coach you can talk to', b: 'A dashboard reads like a report card. A chat feels like a coach, so the AI lives one tap away on every screen.' },
    n3: { t: 'A bank-like view', b: 'Accounts look like the banking apps people already use, so there is nothing new to learn.' },
    n4: { t: 'Sorted for you', b: 'Manual logging was where people gave up, so spending is categorized automatically and receipts can be scanned.' },
    n5: { t: 'Reports with full breakdowns', b: 'A monthly view with every category behind it, for the people who want the detail.' },
    n6: { t: 'Explain the AI', b: 'People want the why behind a suggestion, and control over it. Once the AI explained itself, 75% of testers completely trusted it.' }
  };
  /* What testing found (red pins in "Before fixes") */
  var ISSUES = {
    i1: { r: 'Found in round one', t: 'The AI looked like part of the nav bar', b: 'People missed the AI because it sat in the tab bar like any other page. Only 22% finished the "explore the app" task, with a 29% misclick rate.', fix: 'The AI moved out of the nav bar into a floating chat bubble. In round two, the same task hit 100% success with no misclicks.', go: 'home' },
    i2: { r: 'Found in round one', t: 'The + and − buttons were misread', b: 'People misread the plus and minus buttons for expenses and income.', fix: 'They became "Adjust Income" and "Add Expense", in plain words.', go: 'home' },
    i3: { r: 'Found in round two', t: '"Why this suggestion?" was unclear', b: 'The link to the AI\'s reasoning didn\'t say what it would show.', fix: 'Renamed "See AI Explanation". Once the AI explained itself, 75% of testers completely trusted it.', go: 'analysis' }
  };

  /* ── Helpers ───────────────────────────────────────────────────────── */
  function r2(n) { return Math.round(n * 100) / 100; }
  function money(n) { var neg = n < 0, p = r2(Math.abs(n)).toFixed(2).split('.'); return (neg ? '−' : '') + '$' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + p[1]; }
  function m0(n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function parseAmt(v) { var t = String(v || '').replace(/[\s$,]/g, ''); if (!/^\d+(\.\d{1,2})?$/.test(t)) return null; var x = parseFloat(t); return x > 0 && x < 100000 ? x : null; }
  function spentBy(s, c) { var t = 0; s.tx.forEach(function (x) { if (!c || x.cat === c) t += x.amt; }); return r2(t); }
  function budgetTotal(s) { var t = 0; ORDER.forEach(function (k) { t += s.budgets[k]; }); return t; }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function day(d) { return 'Jan ' + d; }
  function n(o) { return Object.keys(o).length; }

  /* ── Shared pieces ─────────────────────────────────────────────────── */
  function wrap(s, inner) { return '<div class="ma' + (s.mode === 'r1' ? ' r1' : '') + '">' + inner + '</div>'; }
  function top(title, right) { return '<div class="ma-top"><h2 data-k="h" tabindex="-1">' + title + '</h2>' + (right || '') + '</div>'; }
  function hdr(title) { return '<div class="ma-top sub"><button type="button" class="ma-bk" data-a="back" data-k="back" aria-label="Back">' + ic('back', 22) + '</button><h2 data-k="h" tabindex="-1">' + title + '</h2></div>'; }
  function note(s, id, num, cls) { return s.mode === 'why' ? '<button type="button" class="ma-pin note' + (cls ? ' ' + cls : '') + '" data-a="note" data-v="' + id + '" data-k="pin-' + id + '" aria-label="Design note ' + num + ': ' + esc(NOTES[id].t) + '">' + num + '</button>' : ''; }
  function issue(s, id, num, cls) { return s.mode === 'r1' ? '<button type="button" class="ma-pin issue' + (cls ? ' ' + cls : '') + '" data-a="issue" data-v="' + id + '" data-k="pin-' + id + '" aria-label="Problem ' + num + ': ' + esc(ISSUES[id].t) + '">' + num + '</button>' : ''; }
  function tabs(s, cur) {
    var T = [['home', 'Home', 'grid'], ['accounts', 'Accounts', 'bank'], ['tx', 'Transactions', 'doc'], ['reports', 'Reports', 'pie']];
    if (s.mode === 'r1') T.splice(2, 0, ['chat', 'Ai Anchor', 'robot']);
    return '<div class="ma-tabs n' + T.length + '" role="group" aria-label="App tabs">' + T.map(function (t) {
      return '<span class="ma-tab"><button type="button" data-a="tab" data-v="' + t[0] + '" data-k="tab-' + t[0] + '"' + (cur === t[0] ? ' aria-current="page"' : '') + '>' + ic(t[2], 22) + '<span>' + t[1] + '</span></button>' + (t[0] === 'chat' ? issue(s, 'i1', 1, 'tabpin') : '') + '</span>';
    }).join('') + '</div>';
  }
  function fab(s) { return s.mode === 'r1' ? '' : '<div class="ma-fabwrap"><button type="button" class="ma-fab" data-a="go" data-v="chat" data-k="fab" aria-label="Ask AI Anchor">' + ic('robot', 22) + '</button>' + note(s, 'n2', 2, 'fabpin') + '</div>'; }
  function bar(spent, budget) { var p = pct(spent, budget); return '<span class="ma-bar' + (p > 100 ? ' over' : '') + '" aria-hidden="true"><i style="width:' + Math.min(p, 100) + '%"></i></span>'; }
  function totalCard(s, k) {
    var sp = spentBy(s), bt = budgetTotal(s), est = sp / TODAY * DAYS, up = (sp / LAST_MONTH - 1) * 100;
    return '<div class="ma-total ma-pos">' + (k ? note(s, k, 3) : '') + '<div class="tr1"><span class="t">Total Spending</span><span class="d">24 Jan 2026</span></div>' +
      '<div class="tr2"><b>' + m0(sp) + '</b><span class="up">' + ic('tup', 14) + (up >= 0 ? '+' : '−') + Math.abs(up).toFixed(1) + '%</span></div>' +
      '<div class="tr3"><span>Spending Progress</span><span>' + pct(sp, bt) + '% of your set budget!</span></div><span class="prog" aria-hidden="true"><i style="width:' + Math.min(pct(sp, bt), 100) + '%"></i></span>' +
      '<div class="tr4"><div class="est"><span>' + ic('refresh', 16) + ' Estimated Total</span><b>' + m0(est) + '</b></div><p>' + ic('sparkle', 16) + '<span>This estimation is calculated based on your total spending numbers.</span></p></div></div>';
  }
  function txRow(x) {
    var c = CATS[x.cat];
    return '<li><span class="ic" style="--c:' + c.color + '" aria-hidden="true">' + ic(c.ic, 18) + '</span><span class="w"><b>' + esc(x.who) + '</b><small>' + c.name + ' · ' + (x.note ? esc(x.note) : day(x.d)) + '</small></span><b class="a">' + money(x.amt) + '</b></li>';
  }
  function sorted(s) { return s.tx.slice().sort(function (a, b) { return s.sort === 'amt' ? b.amt - a.amt : (b.d - a.d) || (b.id - a.id); }); }

  /* ── Screens ───────────────────────────────────────────────────────── */
  function vHome(s) {
    var sp = spentBy(s), inc = s.income;
    var rows = ORDER.slice(0, s.showAll ? 4 : 3).map(function (k) {
      var c = CATS[k], v = spentBy(s, k), b = s.budgets[k];
      return '<li><button type="button" class="ma-row" data-a="cat" data-v="' + k + '" data-k="cat-' + k + '" aria-label="' + c.name + ' ' + money(v) + ' / ' + money(b) + ' spent"><span class="ic" aria-hidden="true">' + ic(c.ic, 20) + '</span><span class="nm">' + c.name + '</span><span class="amt">' + bar(v, b) + '<span>' + money(v) + ' / ' + money(b) + '</span></span></button></li>';
    }).join('');
    var acts = s.mode === 'r1'
      ? '<div class="ma-acts dark ma-pos">' + issue(s, 'i2', 2) + '<button type="button" class="ma-dark" data-a="expense" data-k="exp"><i aria-hidden="true">' + ic('minus', 18) + '</i>Add Expense</button><button type="button" class="ma-dark" data-a="income" data-k="inc"><i aria-hidden="true">' + ic('plus', 18) + '</i>Add Income</button></div>' +
        '<h3 class="ma-h3">Quick Actions</h3><div class="ma-quick">' + [['repeat', 'Manage Subscriptions', 'toast'], ['target', 'View Goals', 'toast'], ['tag', 'Price Negotiator', 'toast'], ['sparkle', 'Get Insights', 'insights']].map(function (q, i) {
          return '<button type="button" ' + (q[2] === 'toast' ? 'data-a="toast" data-v="Not part of this demo."' : 'data-a="go" data-v="insights"') + ' data-k="q' + i + '">' + ic(q[0], 24) + '<span>' + q[1] + '</span></button>';
        }).join('') + '</div>'
      : '<div class="ma-acts"><button type="button" class="ma-pill" data-a="income" data-k="inc">Adjust Income</button><button type="button" class="ma-pill" data-a="expense" data-k="exp">Add Expense</button></div>';
    return { bar: '#F5F7FF', html: wrap(s, top('Budget', '<div class="ma-top-r"><button type="button" class="ma-icb" data-a="bell" data-k="bell" aria-label="Notifications' + (s.bell ? ', 2 new' : '') + '">' + ic('bell', 24) + (s.bell ? '<i class="dot" aria-hidden="true"></i>' : '') + '</button><span class="ma-av" aria-hidden="true">S</span></div>') +
      '<div class="ma-main">' +
      (s.applied ? '<div class="ma-banner" role="status">' + ic('checkc', 18) + '<span>Budget updated: Groceries ' + m0(s.budgets.groc) + ', Transport ' + m0(s.budgets.trans) + '.</span><button type="button" data-a="undo" data-k="undo">Undo</button></div>' : '') +
      '<div class="ma-bal"><p class="lab">Total Balance</p><p class="big">' + money(inc - sp) + '</p><div class="io"><span><i class="g" aria-hidden="true">+</i><span>Income:<b class="g">' + money(inc) + '</b></span></span><span><i class="r" aria-hidden="true">−</i><span>Spending:<b class="r">' + money(sp) + '</b></span></span></div></div>' +
      acts +
      '<div class="ma-sec"><h3 class="ma-h3">Budget Overview</h3><button type="button" class="ma-link" data-a="viewall" data-k="viewall" aria-expanded="' + s.showAll + '">' + (s.showAll ? 'Show less' : 'View All') + '</button></div>' +
      '<div class="ma-card ma-pos">' + note(s, 'n1', 1) + '<ul class="ma-list">' + rows + '</ul></div></div>' + fab(s) + tabs(s, 'home')) };
  }
  function msgHtml(m, i) {
    if (m.chips) return '<div class="ma-chips">' + [['target', 'Help me find this item.', 'find'], ['dollar', 'How much can I safely spend today?', 'safe'], ['tdown', 'Where am I overspending?', 'over'], ['scissors', 'Where can I cut costs?', 'cut']].map(function (c) {
      return '<button type="button" class="ma-chip" data-a="ask" data-v="' + c[2] + '" data-k="chip-' + c[2] + '">' + ic(c[0], 16) + '<span>' + c[1] + '</span></button>';
    }).join('') + '</div>';
    if (m.typing) return '<div class="ma-msg ai typing" aria-hidden="true"><i></i><i></i><i></i></div>';
    return '<div class="ma-msg ' + m.from + '">' + m.text + (m.why ? '<button type="button" class="ma-why" data-a="explain" data-v="' + m.why + '" data-k="why-' + i + '">' + ic('brain', 16) + ' See AI Explanation</button>' : '') + (m.cta ? '<button type="button" class="ma-cta" data-a="go" data-v="' + m.cta[0] + '" data-k="cta-' + i + '">' + m.cta[1] + ' ' + ic('arrow', 16) + '</button>' : '') + '</div>';
  }
  function vChat(s, ui) {
    return { bar: '#F5F7FF', html: wrap(s, hdr('AI Anchor Assistant') + '<div class="ma-main ma-chat"><p class="ma-demo">' + ic('info', 14) + ' Demo: answers are scripted from sample data.</p>' +
      '<div class="ma-msgs ma-pos">' + s.chat.map(msgHtml).join('') + '</div></div>' +
      '<div class="ma-compose"><label class="sr" for="' + ui.uid + 'msg">Message AI Anchor</label><input id="' + ui.uid + 'msg" data-i="msg" data-k="msg" type="text" autocomplete="off" placeholder="Ask me how I can help with your budget!" value="' + esc(s.msg) + '">' +
      '<button type="button" class="ma-icb sm" data-a="toast" data-v="Voice input is simulated in this demo." data-k="mic" aria-label="Voice input">' + ic('mic', 20) + '</button><button type="button" class="ma-send" data-a="send" data-k="send" aria-label="Send">' + ic('send', 20) + '</button></div>' + (s.mode === 'r1' ? tabs(s, 'chat') : '')) };
  }
  function vAnalysis(s) {
    var done = s.applied;
    var why = s.mode === 'r1'
      ? '<span class="ma-pos blk">' + issue(s, 'i3', 3) + '<button type="button" class="ma-btn outline" data-a="explain" data-v="ana" data-k="explain">' + ic('brain', 18) + ' Why This Suggestion?</button></span>'
      : '<span class="ma-pos blk">' + note(s, 'n6', 6) + '<button type="button" class="ma-btn outline ai" data-a="explain" data-v="ana" data-k="explain">' + ic('brain', 18) + ' See AI Explanation</button></span>';
    return { bar: '#F5F7FF', html: wrap(s, hdr('AI Analysis') + '<div class="ma-main"><div class="ma-ana">' +
      '<div class="hd"><span class="ic" aria-hidden="true">' + ic('sparkle', 20) + '</span><div><b>AI Analysis Complete</b><small>Based on your spending patterns</small></div></div>' +
      '<div class="sug"><p><b>Suggestion:</b> Reduce your Groceries budget by $150 to accommodate your travel needs.</p><span class="conf">' + ic('checkc', 16) + ' High confidence recommendation</span></div>' +
      '<div class="chg dn"><span>' + ic('cart', 18) + ' Groceries</span><span><s>$350</s> ' + ic('tdown', 16) + ' <b>$200</b></span></div>' +
      '<div class="chg up"><span>' + ic('car', 18) + ' Transport</span><span><s>$400</s> ' + ic('tup', 16) + ' <b>$550</b></span></div></div>' +
      why + '<button type="button" class="ma-btn outline" data-a="impact" data-k="impact">' + ic('eye', 18) + ' Check Impact on Budget</button>' +
      (done ? '<div class="ma-applied" role="status">' + ic('checkc', 18) + '<span>Applied to your budget.</span><button type="button" data-a="undo" data-k="undo2">Undo</button></div>'
        : '<div class="ma-two"><button type="button" class="ma-btn ghost" data-a="nothanks" data-k="no">No Thanks</button><button type="button" class="ma-btn" data-a="apply" data-k="apply">Apply Changes</button></div>') +
      '</div>' + fab(s) + tabs(s, 'home')) };
  }
  function spark(pts, color, fill) {
    var w = 300, h = 70, mx = Math.max.apply(null, pts), mn = Math.min.apply(null, pts), d = '';
    pts.forEach(function (v, i) { var x = i / (pts.length - 1) * w, y = h - 8 - (v - mn) / ((mx - mn) || 1) * (h - 16); d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); });
    return '<svg class="ma-spark" viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true"><path d="' + d + ' L300 70 L0 70 Z" fill="' + fill + '"/><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>';
  }
  function vInsights(s) {
    return { bar: '#F5F7FF', html: wrap(s, hdr('Insights') + '<div class="ma-main"><p class="ma-p">Based on your spending history, we\'ve identified some consistent patterns in your financial behavior.</p>' +
      '<div class="ma-ins"><div class="hd"><span class="ic peach" aria-hidden="true">' + ic('coffee', 20) + '</span><div><b>Coffee Addiction</b><small>Average $5.40 / day</small></div><span class="badge rose">' + ic('tup', 14) + ' +15%</span></div>' + spark([3.9, 4.2, 4.0, 4.6, 4.8, 4.5, 5.1, 5.4, 5.2, 5.6, 5.4, 5.9], '#C2410C', 'rgba(232,134,42,.12)') + '<p>You\'re spending more on coffee this month compared to last month. Consider brewing at home!</p><button type="button" class="ma-why" data-a="explain" data-v="coffee" data-k="why-coffee">' + ic('brain', 16) + ' See AI Explanation</button></div>' +
      '<div class="ma-ins"><div class="hd"><span class="ic mint" aria-hidden="true">' + ic('car', 20) + '</span><div><b>Transport Savings</b><small>Rideshare &amp; gas</small></div><span class="badge mint">' + ic('tdown', 14) + ' −22%</span></div>' + spark([9.8, 9.5, 9.6, 9.1, 8.8, 8.9, 8.4, 8.2, 8.0, 7.9, 7.7, 7.6], '#15803D', 'rgba(21,128,61,.1)') + '<p>Great job! You\'ve significantly reduced your transportation costs this month.</p></div>' +
      '<div class="ma-stats"><div class="mint">' + ic('tup', 20) + '<b>3</b><span>New positive habits formed</span></div><div>' + ic('alert', 20) + '<b>2</b><span>Areas needing attention</span></div></div></div>' + fab(s) + tabs(s, 'reports')) };
  }
  function vAccounts(s) {
    var acc = [['Capital One', 'Savings Account', '2341', 11520], ['Chase', 'Checking Account', '8807', 2410]];
    return { bar: '#F5F7FF', html: wrap(s, top('Accounts') + '<div class="ma-main">' + totalCard(s, 'n3') +
      '<div class="ma-sec"><span class="ma-h4">' + ic('bank', 18) + ' Accounts</span><button type="button" class="ma-link plain" data-a="toast" data-v="Linking a bank is simulated in this demo." data-k="addacc">' + ic('plus', 16) + ' Add</button></div>' +
      acc.map(function (a, i) { return '<div class="ma-acc"><div class="t">' + ic('bank', 22) + '<span>' + a[0] + '</span><button type="button" class="ma-edit" data-a="toast" data-v="Editing an account is simulated in this demo." data-k="ed' + i + '" aria-label="Edit ' + a[0] + '">' + ic('pencil', 16) + '</button></div><p>' + a[1] + '</p><p>Acc No. ****' + a[2] + '</p><p class="bal">' + m0(a[3]) + '</p><p class="min">Min Balance: $0</p></div>'; }).join('') +
      '</div>' + fab(s) + tabs(s, 'accounts')) };
  }
  function donut(s) {
    var tot = spentBy(s) || 1, a0 = -Math.PI / 2, out = '', R = 46, r = 28, cx = 60, cy = 60;
    ORDER.forEach(function (k) {
      var v = spentBy(s, k), a1 = a0 + v / tot * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0;
      function p(rad, ang) { return (cx + rad * Math.cos(ang)).toFixed(2) + ' ' + (cy + rad * Math.sin(ang)).toFixed(2); }
      if (v > 0) out += '<path d="M' + p(R, a0) + ' A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + p(R, a1) + ' L' + p(r, a1) + ' A' + r + ' ' + r + ' 0 ' + big + ' 0 ' + p(r, a0) + ' Z" fill="' + CATS[k].color + '"/>';
      a0 = a1;
    });
    return '<svg class="ma-donut" viewBox="0 0 120 120" aria-hidden="true">' + out + '</svg>';
  }
  function listHtml(s) {
    var q = (s.q || '').trim().toLowerCase();
    var L = sorted(s).filter(function (x) { return (s.filter === 'all' || x.cat === s.filter) && (!q || (x.who + ' ' + (x.note || '') + ' ' + CATS[x.cat].name).toLowerCase().indexOf(q) > -1); });
    var shown = s.more ? L : L.slice(0, 6);
    return (L.length ? '<ul class="ma-txl">' + shown.map(txRow).join('') + '</ul>' : '<p class="ma-empty">No transactions match.</p>') +
      (L.length > 6 ? '<button type="button" class="ma-link" data-a="more" data-k="more" aria-expanded="' + s.more + '">' + (s.more ? 'Show less' : 'See More (' + (L.length - 6) + ')') + '</button>' : '');
  }
  function count(s) { var q = (s.q || '').trim().toLowerCase(), c = s.tx.filter(function (x) { return (s.filter === 'all' || x.cat === s.filter) && (!q || (x.who + ' ' + (x.note || '') + ' ' + CATS[x.cat].name).toLowerCase().indexOf(q) > -1); }).length; return c + (c === 1 ? ' item' : ' items'); }
  function vTx(s, ui) {
    var tot = spentBy(s);
    var legend = ORDER.map(function (k) { var v = spentBy(s, k); return '<li><i style="background:' + CATS[k].color + '"></i><span>' + CATS[k].name + '</span><b>' + pct(v, tot) + '%</b></li>'; }).join('');
    var chips = [['all', 'All Categories', 'grid']].concat(ORDER.map(function (k) { return [k, CATS[k].name, CATS[k].ic]; })).map(function (c) {
      return '<button type="button" data-a="filt" data-v="' + c[0] + '" data-k="filt-' + c[0] + '" aria-pressed="' + (s.filter === c[0]) + '"><span class="ic">' + ic(c[2], 20) + '</span><span>' + c[1] + '</span></button>';
    }).join('');
    return { bar: '#F5F7FF', html: wrap(s, top('Transactions') + '<div class="ma-main">' +
      '<div class="ma-card ma-pos ma-cat">' + note(s, 'n4', 4) + '<div class="ma-sec in"><h3 class="ma-h3 sm">Top Categories</h3><button type="button" class="ma-link plain" data-a="tab" data-v="reports" data-k="seerep">See Report</button></div><div class="ma-dwrap">' + donut(s) + '<ul class="ma-leg">' + legend + '</ul></div></div>' +
      '<div class="ma-two"><button type="button" class="ma-pill ic" data-a="expense" data-k="addtx">' + ic('plus', 18) + ' Add Transaction</button><button type="button" class="ma-pill ic" data-a="receipt" data-k="receipt">' + ic('receipt', 18) + ' Upload Receipt</button></div>' +
      '<div class="ma-search">' + ic('search', 18) + '<label class="sr" for="' + ui.uid + 'q">Search transactions</label><input id="' + ui.uid + 'q" data-i="q" data-k="q" type="search" autocomplete="off" placeholder="Search transactions" value="' + esc(s.q) + '"><button type="button" class="ma-icb sm" data-a="sort" data-k="sort" aria-label="Sort: ' + (s.sort === 'amt' ? 'largest first' : 'newest first') + '. Change sort">' + ic('filter', 18) + '</button></div>' +
      '<div class="ma-cats" role="group" aria-label="Filter by category">' + chips + '</div>' +
      '<div class="ma-card"><div class="ma-sec in"><h3 class="ma-h3 sm">Recent Transactions</h3><span class="ma-count" data-count-tx>' + count(s) + '</span></div><div data-list>' + listHtml(s) + '</div></div></div>' + fab(s) + tabs(s, 'tx')) };
  }
  function weekly(s) {
    var w = [0, 0, 0, 0];
    s.tx.forEach(function (x) { if (x.note === '24 coffees this month') { for (var d = 1; d <= TODAY; d++) w[Math.min(3, Math.floor((d - 1) / 7))] += 5.4; } else w[Math.min(3, Math.floor((x.d - 1) / 7))] += x.amt; });
    return { lab: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22'], val: w.map(r2) };
  }
  function chart(s) {
    var ser = s.period === 'weekly' ? weekly(s) : SERIES[s.period], vals = ser.val.map(function (v) { return v == null ? spentBy(s) : v; });
    var W = 300, H = 150, pl = 34, pb = 22, mx = Math.max.apply(null, vals) * 1.15, d = '', dots = '', labs = '', grid = '';
    for (var g = 0; g <= 3; g++) { var gy = (H - pb) - g / 3 * (H - pb - 8), gv = mx * g / 3; grid += '<line x1="' + pl + '" x2="' + W + '" y1="' + gy.toFixed(1) + '" y2="' + gy.toFixed(1) + '"/><text x="' + (pl - 6) + '" y="' + (gy + 3).toFixed(1) + '" text-anchor="end">' + (gv >= 1000 ? (gv / 1000).toFixed(1) + 'k' : Math.round(gv)) + '</text>'; }
    vals.forEach(function (v, i) {
      var x = pl + 10 + i / (vals.length - 1) * (W - pl - 20), y = (H - pb) - v / mx * (H - pb - 8);
      d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      dots += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.5"/>';
      labs += '<text x="' + x.toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + ser.lab[i] + '</text>';
    });
    var first = d.split(' L')[0].slice(1).split(' ')[0], last = d.split(' L').pop().split(' ')[0];
    var label = (s.period === 'weekly' ? 'Spending by week, January: ' : s.period === 'monthly' ? 'Spending by month: ' : 'Spending by year: ') + vals.map(function (v, i) { return ser.lab[i] + ' ' + m0(v); }).join(', ');
    return '<svg class="ma-chart" viewBox="0 0 300 150" role="img" aria-label="' + label + '"><g class="grid">' + grid + '</g><path class="area" d="' + d + ' L' + last + ' ' + (H - pb) + ' L' + first + ' ' + (H - pb) + ' Z"/><path class="line" d="' + d + '"/><g class="dots">' + dots + '</g><g class="labs">' + labs + '</g></svg>';
  }
  function vReports(s) {
    return { bar: '#F5F7FF', html: wrap(s, top('Reports') + '<div class="ma-main">' + totalCard(s) +
      '<button type="button" class="ma-btn" data-a="breakdown" data-k="bd">Breakdown ' + ic('arrow', 18) + '</button>' +
      '<div class="ma-card ma-pos ma-chartc">' + note(s, 'n5', 5) + '<div class="ma-chead"><div class="ma-seg" role="group" aria-label="Report period">' + [['weekly', 'Weekly'], ['monthly', 'Monthly'], ['yearly', 'Yearly']].map(function (p) { return '<button type="button" data-a="period" data-v="' + p[0] + '" data-k="per-' + p[0] + '" aria-pressed="' + (s.period === p[0]) + '">' + p[1] + '</button>'; }).join('') + '</div><button type="button" class="ma-icb dark" data-a="toast" data-v="Report download is simulated in this demo." data-k="dl" aria-label="Download report">' + ic('download', 18) + '</button></div>' + chart(s) + '</div>' +
      '<button type="button" class="ma-card ma-insl" data-a="go" data-v="insights" data-k="insl"><span class="ic" aria-hidden="true">' + ic('sparkle', 20) + '</span><span><b>AI Insights</b><small>3 new habits, 2 areas to watch</small></span>' + ic('chev', 18) + '</button>' +
      '</div>' + fab(s) + tabs(s, 'reports')) };
  }

  /* ── Sheets ────────────────────────────────────────────────────────── */
  function expHint(s) {
    var a = parseAmt(s.draft.amt), k = s.draft.cat, c = CATS[k];
    if (a === null) return 'Type an amount to see how it fits your ' + c.name + ' budget.';
    var after = spentBy(s, k) + a, b = s.budgets[k], p = pct(after, b);
    if (after > b) return 'Heads up: this puts ' + c.name + ' ' + money(after - b) + ' over budget, with ' + LEFT + ' days left this month.';
    return 'After this, ' + c.name + ' is at ' + money(after) + ' of ' + money(b) + ' (' + p + '%), with ' + LEFT + ' days left.';
  }
  function expenseSheet(s, uid) {
    var d = s.draft;
    return '<div class="ma-sh"><h3 data-title>Add Expense</h3>' +
      '<div class="ma-f"><label for="' + uid + 'ea">Amount</label><div class="ma-in"><span class="pre" aria-hidden="true">$</span><input id="' + uid + 'ea" data-i="eamt" data-k="eamt" data-first type="text" inputmode="decimal" autocomplete="off" placeholder="0.00" value="' + esc(d.amt) + '" aria-describedby="' + uid + 'eh"></div></div>' +
      '<div class="ma-f"><span class="ma-lab" id="' + uid + 'ec">Category</span><div class="ma-cpick" role="group" aria-labelledby="' + uid + 'ec">' + ORDER.map(function (k) { return '<button type="button" data-a="dcat" data-v="' + k + '" aria-pressed="' + (d.cat === k) + '">' + ic(CATS[k].ic, 16) + CATS[k].name + '</button>'; }).join('') + '</div></div>' +
      '<div class="ma-f"><label for="' + uid + 'en">Where</label><div class="ma-in"><input id="' + uid + 'en" data-i="enote" type="text" autocomplete="off" placeholder="Ex: Corner Cafe" value="' + esc(d.note) + '"></div></div>' +
      '<p class="ma-aihint" id="' + uid + 'eh" data-aihint aria-live="polite">' + ic('sparkle', 16) + '<span>' + expHint(s) + '</span></p>' +
      '<p class="ma-err" data-err hidden></p><div class="acts"><button type="button" class="ma-btn ghost" data-a="close">Cancel</button><button type="button" class="ma-btn" data-a="addexp">Add Expense</button></div></div>';
  }
  function incomeSheet(s, uid) {
    return '<div class="ma-sh"><h3 data-title>Adjust Income</h3><p>Your monthly take-home pay. Budgets and the balance update right away.</p><div class="ma-f"><label for="' + uid + 'in">Monthly income</label><div class="ma-in"><span class="pre" aria-hidden="true">$</span><input id="' + uid + 'in" data-i="iamt" data-first type="text" inputmode="decimal" autocomplete="off" value="' + esc(s.draftInc) + '"></div></div><p class="ma-err" data-err hidden></p><div class="acts"><button type="button" class="ma-btn ghost" data-a="close">Cancel</button><button type="button" class="ma-btn" data-a="saveinc">Save</button></div></div>';
  }
  function catSheet(s, k) {
    var c = CATS[k], v = spentBy(s, k), b = s.budgets[k], left = b - v;
    var list = sorted(s).filter(function (x) { return x.cat === k; }).map(txRow).join('');
    return '<div class="ma-sh"><h3 data-title>' + c.name + '</h3><p>' + money(v) + ' spent of ' + money(b) + '. ' + (left >= 0 ? money(left) + ' left for the next ' + LEFT + ' days.' : money(-left) + ' over budget.') + '</p>' + bar(v, b).replace('ma-bar', 'ma-bar big') +
      '<div class="ma-lab gap">Monthly budget</div><div class="ma-step"><button type="button" data-a="bstep" data-v="-25" data-k="bminus" aria-label="Lower ' + c.name + ' budget by $25">' + ic('minus', 18) + '</button><output aria-live="polite">' + m0(b) + '</output><button type="button" data-a="bstep" data-v="25" data-k="bplus" aria-label="Raise ' + c.name + ' budget by $25">' + ic('plus', 18) + '</button></div>' +
      '<h4 class="ma-sh4">This month</h4><ul class="ma-txl">' + list + '</ul><div class="acts"><button type="button" class="ma-btn" data-a="close">Done</button></div></div>';
  }
  function receiptSheet(s) {
    var tot = 0; RECEIPT.forEach(function (r) { tot += r[1]; });
    var body = '<div class="ma-rcpt" aria-label="Sample receipt"><b>FRESH MART</b><small>Jan 24, 2026</small>' + RECEIPT.map(function (r) { return '<p><span>' + r[0] + '</span><span>' + r[1].toFixed(2) + '</span></p>'; }).join('') + '<p class="t"><span>TOTAL</span><span>' + tot.toFixed(2) + '</span></p></div>';
    var st = s.scan;
    return '<div class="ma-sh"><h3 data-title>Upload Receipt</h3><p>' + (st === 'done' ? 'Read and sorted. Check it, then add it.' : 'A sample receipt for this demo. Scan it and Money Anchor fills in the rest.') + '</p>' + body +
      (st === 'done' ? '<div class="ma-found" role="status">' + ic('checkc', 18) + '<span><b>Fresh Mart, ' + money(tot) + '</b>Groceries, sorted automatically</span></div><div class="acts"><button type="button" class="ma-btn ghost" data-a="close">Cancel</button><button type="button" class="ma-btn" data-a="addrcpt" data-first>Add to Groceries</button></div>'
        : '<div class="acts"><button type="button" class="ma-btn ghost" data-a="close">Cancel</button><button type="button" class="ma-btn" data-a="scan" data-first' + (st === 'busy' ? ' aria-busy="true"' : '') + '>' + (st === 'busy' ? '<span class="ma-spin" aria-hidden="true"></span> Scanning' : ic('receipt', 18) + ' Scan receipt') + '</button></div>') + '</div>';
  }
  function impactSheet(s) {
    function rowI(k, from, to) { var v = spentBy(s, k), mx = Math.max(from, to) * 1.05; return '<div class="ma-imp"><b>' + CATS[k].name + '</b><span class="lbl">Now ' + m0(from) + '</span><span class="track" aria-hidden="true"><i class="b" style="width:' + (from / mx * 100) + '%"></i><i class="s" style="width:' + (v / mx * 100) + '%"></i></span><span class="lbl">After ' + m0(to) + '</span><span class="track" aria-hidden="true"><i class="b new" style="width:' + (to / mx * 100) + '%"></i><i class="s" style="width:' + (v / mx * 100) + '%"></i></span><small>' + money(v) + ' spent so far ' + (v <= to ? 'still fits.' : 'would be over.') + '</small></div>'; }
    var g0 = s.applied ? s.undo.groc : s.budgets.groc, t0 = s.applied ? s.undo.trans : s.budgets.trans;
    return '<div class="ma-sh"><h3 data-title>Impact on your budget</h3><p>Only two budgets change. Your total budget stays ' + m0(budgetTotal(s)) + '.</p>' + rowI('groc', g0, 200) + rowI('trans', t0, 550) +
      '<p class="ma-legend"><span><i class="s"></i>Spent so far</span><span><i class="b"></i>Budget</span></p><div class="acts"><button type="button" class="ma-btn ghost" data-a="close">Back</button>' + (s.applied ? '' : '<button type="button" class="ma-btn" data-a="apply">Apply Changes</button>') + '</div></div>';
  }
  function explainSheet(s, key) {
    var sec = function (t, b) { return '<div class="ma-ex"><b>' + t + '</b><p>' + b + '</p></div>'; }, h = '';
    var dv = spentBy(s, 'dine'), shv = spentBy(s, 'shop'), left = Math.max(0, s.budgets.dine - dv) + Math.max(0, s.budgets.shop - shv);
    if (key === 'ana') h = sec('What I looked at', 'Three months of your transactions and your current budgets (sample data).') + sec('What I noticed', 'Groceries came to about $160 a month (Nov $171, Dec $158, Jan ' + money(spentBy(s, 'groc')) + ' so far), well under your $350 budget. Your upcoming travel adds about $150 of transport costs.') + sec('How sure I am', 'High. Groceries stayed under $200 for three months in a row.') + sec('You\'re in control', 'Only these two budgets change, and your total stays the same. Nothing changes until you tap Apply Changes, and you can undo it.');
    else if (key === 'safe') h = sec('What I looked at', 'Your flexible budgets: Dining Out (' + money(Math.max(0, s.budgets.dine - dv)) + ' left) and Shopping (' + money(Math.max(0, s.budgets.shop - shv)) + ' left).') + sec('How I worked it out', money(left) + ' left ÷ ' + LEFT + ' days = about ' + money(left / LEFT) + ' a day. Groceries and Transport have their own room, so I left them out.') + sec('How sure I am', 'Medium. It assumes no big one-off costs before the month ends.');
    else if (key === 'over') h = sec('What I looked at', 'Each budget, compared with how far through the month we are: day ' + TODAY + ' of ' + DAYS + ', or ' + pct(TODAY, DAYS) + '%.') + sec('What I noticed', ORDER.map(function (k) { return CATS[k].name + ' ' + pct(spentBy(s, k), s.budgets[k]) + '%'; }).join(', ') + '. Anything above ' + pct(TODAY, DAYS) + '% is moving faster than the month.') + sec('Coffee', 'About $5.40 a day, up 15% from last month.');
    else if (key === 'cut' || key === 'coffee') h = sec('What I looked at', 'Your coffee purchases this month and last month.') + sec('How I worked it out', '24 coffees at about $5.40 each is $129.60 this month, up 15% from last month. Brewing at home most days could keep most of that.') + sec('How sure I am', 'High. It is the same habit almost every day.');
    else h = sec('What I looked at', 'Your transactions this month (sample data).');
    return '<div class="ma-sh"><span class="ma-tag">' + ic('brain', 14) + ' AI Explanation</span><h3 data-title>Why I suggested this</h3>' + h + '<div class="acts"><button type="button" class="ma-btn" data-a="close">Got it</button></div></div>';
  }

  /* ── Scripted answers (from the sample data) ───────────────────────── */
  var FIND = ['shoe', 'coffee', 'grind', 'sushi', 'pizza', 'noodle', 'brunch', 'book', 'rideshare', 'gas', 'transit', 'fresh', 'market', 'electronic', 'online', 'department', 'sam'];
  function answer(q, s) {
    var t = q.toLowerCase(), dv = spentBy(s, 'dine'), shv = spentBy(s, 'shop');
    if (q === 'find' || /find|item|where did i buy/.test(t) && !FIND.some(function (w) { return t.indexOf(w) > -1; })) return { text: 'Sure. Tell me what you bought, like "shoes" or "coffee", and I\'ll find it.' };
    var hit = FIND.filter(function (w) { return t.indexOf(w) > -1; })[0];
    if (hit) {
      var m = s.tx.filter(function (x) { return (x.who + ' ' + (x.note || '')).toLowerCase().indexOf(hit === 'coffee' ? 'grind' : hit) > -1; });
      if (m.length) return { text: 'I found ' + (m.length === 1 ? '1 match' : m.length + ' matches') + ': ' + m.slice(0, 3).map(function (x) { return x.who + ', ' + money(x.amt) + ' on ' + day(x.d) + ' (' + CATS[x.cat].name + ')'; }).join('; ') + '.' };
    }
    if (q === 'safe' || /safe|safely|today|how much can/.test(t)) { var left = Math.max(0, s.budgets.dine - dv) + Math.max(0, s.budgets.shop - shv); return { text: 'About <b>' + money(left / LEFT) + ' a day</b> for the next ' + LEFT + ' days keeps Dining Out and Shopping inside their budgets.', why: 'safe' }; }
    if (q === 'over' || /overspend|over budget|over spend|too much/.test(t)) {
      var worst = ORDER.slice().sort(function (a, b) { return spentBy(s, b) / s.budgets[b] - spentBy(s, a) / s.budgets[a]; })[0], wp = pct(spentBy(s, worst), s.budgets[worst]);
      return { text: (wp > 100 ? 'You\'re over budget on <b>' + CATS[worst].name + '</b> (' + wp + '% used).' : 'You\'re not over any budget yet. <b>' + CATS[worst].name + '</b> is closest at ' + wp + '% used.') + ' Coffee is up 15% from last month, about $5.40 a day.', why: 'over', cta: ['insights', 'See insights'] };
    }
    if (q === 'cut' || /cut|save|saving|cost|cheaper/.test(t)) return { text: 'Coffee is the easiest win: about $5.40 a day adds up to $129.60 this month. I also found a way to rebalance your budget.', why: 'cut', cta: ['analysis', 'Review suggestion'] };
    return { text: 'I can help with your budget, spending and savings. Try one of the questions above, or ask where you\'re overspending.' };
  }
  function ask(sh, q, label) {
    var s = sh.s;
    s.chat.push({ from: 'me', text: esc(label) });
    s.chat.push({ typing: true }); s.msg = '';
    sh.render('msg'); sh.screen.scrollTop = sh.screen.scrollHeight;
    setTimeout(function () {
      s.chat = s.chat.filter(function (m) { return !m.typing; });
      var a = answer(q, s); a.from = 'ai'; s.chat.push(a);
      if (s.screen !== 'chat') return;
      sh.render(); sh.screen.scrollTop = sh.screen.scrollHeight;
      sh.say('AI Anchor: ' + a.text.replace(/<[^>]+>/g, ''));
      if (q === 'over' || /overspend|over budget|over spend/i.test(q)) sh.tick('ask');
    }, P.reduce ? 0 : 700);
  }
  function reopen(sh, html, key, center) {
    var op = sh._opener; sh.open(html, { opener: op, center: center });
    var el = key && sh.ov.querySelector('[data-k="' + key + '"]'); if (el) el.focus();
  }

  P.register('anchor', {
    label: 'Money Anchor prototype',
    time: '9:41',
    modes: { final: 'Final', why: 'Design notes', r1: 'Before fixes' },
    tourMode: 'final',
    tour: [
      { id: 'ask', label: 'Ask the AI where you\'re overspending', go: 'chat' },
      { id: 'why', label: 'Open an AI explanation', go: 'analysis' },
      { id: 'apply', label: 'Check the impact, then apply the AI\'s change', go: 'analysis' },
      { id: 'expense', label: 'Add an expense and read the AI preview', go: 'home' },
      { id: 'receipt', label: 'Scan a receipt', go: 'tx' },
      { id: 'filter', label: 'Filter transactions by category', go: 'tx' }
    ],
    tourIntro: 'Each one ticks itself off when you do it on the phone.',
    tourNote: 'Sample data and scripted AI answers. Nothing you type leaves this page.',
    state: function (sh) {
      sh.uid = sh.uid || 'ma' + Math.random().toString(36).slice(2, 7);
      var b = {}; ORDER.forEach(function (k) { b[k] = CATS[k].budget; });
      return {
        mode: sh.d && sh.d.mode === 'r1' ? 'r1' : 'final', screen: 'home', from: 'home',
        income: 3200, budgets: b, tx: TX0.map(function (x, i) { return { id: i, who: x[0], cat: x[1], amt: x[2], d: x[3], note: x[4] || '' }; }), nid: 100,
        showAll: false, bell: true, applied: false, undo: null,
        chat: [{ from: 'ai', text: 'Hey there Sarah. How can I help?' }, { from: 'ai', text: 'Here are just a few things of the many things you can ask me about.' }, { chips: true }], msg: '',
        filter: 'all', q: '', more: false, sort: 'date', period: 'monthly',
        draft: { amt: '', cat: 'dine', note: '' }, draftInc: '3200.00', sheetCat: 'dine', scan: ''
      };
    },
    view: function (s, ui) {
      switch (s.screen) {
        case 'chat': return vChat(s, ui);
        case 'analysis': return vAnalysis(s);
        case 'insights': return vInsights(s);
        case 'accounts': return vAccounts(s);
        case 'tx': return vTx(s, ui);
        case 'reports': return vReports(s);
        default: return vHome(s);
      }
    },
    onMode: function (m) { if (m !== 'r1' && this.s.screen === 'chat' && this.s.from === 'chat') this.s.from = 'home'; },
    input: function (name, v, el, isChange) {
      var s = this.s, sh = this;
      if (name === 'msg') { s.msg = v; return; }
      if (name === 'q') { s.q = v; var box = sh.app.querySelector('[data-list]'), ct = sh.app.querySelector('[data-count-tx]'); if (box) box.innerHTML = listHtml(s); if (ct) ct.textContent = count(s); if (v.trim()) sh.tick('filter'); return; }
      if (name === 'eamt' || name === 'enote') { s.draft[name === 'eamt' ? 'amt' : 'note'] = v; var h = sh.ov.querySelector('[data-aihint] span'); if (h) h.textContent = expHint(s); return; }
      if (name === 'iamt') { s.draftInc = v; }
    },
    actions: {
      go: function (v) { if (['chat', 'analysis', 'insights'].indexOf(v) > -1 && ['chat', 'analysis', 'insights'].indexOf(this.s.screen) < 0) this.s.from = this.s.screen; this.go(v); },
      tab: function (v) { this.s.from = v; this.go(v); },
      back: function () { var f = this.s.from && this.s.from !== this.s.screen ? this.s.from : 'home'; this.go(f); },
      close: function () { this.closeOv(); },
      toast: function (v) { this.toast(v); },
      viewall: function () { this.s.showAll = !this.s.showAll; this.render('viewall'); },
      bell: function () {
        this.s.bell = false; this.render('bell');
        this.open('<div class="ma-sh"><h3 data-title>Notifications</h3><button type="button" class="ma-notif" data-a="go" data-v="analysis">' + ic('sparkle', 20) + '<span><b>AI Analysis Complete</b>I found a way to rebalance your budget.</span></button><button type="button" class="ma-notif" data-a="go" data-v="insights">' + ic('coffee', 20) + '<span><b>Coffee is up 15%</b>About $5.40 a day this month.</span></button><div class="acts"><button type="button" class="ma-btn ghost" data-a="close">Close</button></div></div>');
      },
      cat: function (v) { this.s.sheetCat = v; this.open(catSheet(this.s, v)); },
      bstep: function (v, el) { var s = this.s, k = s.sheetCat; s.budgets[k] = Math.max(25, s.budgets[k] + parseInt(v, 10)); this.render(); reopen(this, catSheet(s, k), el.getAttribute('data-k')); },
      expense: function () { this.s.draft = { amt: '', cat: this.s.filter !== 'all' ? this.s.filter : 'dine', note: '' }; this.open(expenseSheet(this.s, this.uid)); },
      dcat: function (v) { this.s.draft.cat = v; this.ov.querySelectorAll('[data-a="dcat"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v)); }); var h = this.ov.querySelector('[data-aihint] span'); if (h) h.textContent = expHint(this.s); },
      addexp: function () {
        var s = this.s, a = parseAmt(s.draft.amt), er = this.ov.querySelector('[data-err]');
        if (a === null) { if (er) { er.hidden = false; er.textContent = 'Enter an amount, like 12.50.'; } var f = this.ov.querySelector('[data-i="eamt"]'); if (f) { f.setAttribute('aria-invalid', 'true'); f.focus(); } return; }
        s.tx.push({ id: s.nid++, who: s.draft.note.trim() || 'Expense', cat: s.draft.cat, amt: a, d: TODAY, note: '' });
        this.closeOv(); this.render(); this.toast('Added ' + money(a) + ' to ' + CATS[s.draft.cat].name + '.'); this.tick('expense');
      },
      income: function () { this.s.draftInc = this.s.income.toFixed(2); this.open(incomeSheet(this.s, this.uid)); },
      saveinc: function () {
        var a = parseAmt(this.s.draftInc), er = this.ov.querySelector('[data-err]');
        if (a === null) { if (er) { er.hidden = false; er.textContent = 'Enter an amount, like 3200.'; } return; }
        this.s.income = a; this.closeOv(); this.render(); this.toast('Income set to ' + money(a) + ' a month.');
      },
      ask: function (v, el) { ask(this, v, el.textContent); },
      send: function () { var t = (this.s.msg || '').trim(); if (!t) { var i = this.app.querySelector('[data-i="msg"]'); if (i) i.focus(); return; } ask(this, t, t); },
      explain: function (v) { this.open(explainSheet(this.s, v)); this.tick('why'); },
      impact: function () { this.open(impactSheet(this.s)); },
      apply: function () {
        var s = this.s; if (s.applied) return;
        s.undo = { groc: s.budgets.groc, trans: s.budgets.trans }; s.budgets.groc = 200; s.budgets.trans = 550; s.applied = true;
        this.closeOv(true); this.go('home'); this.toast('Budget updated. You can undo it.'); this.tick('apply');
      },
      undo: function () { var s = this.s; if (!s.undo) return; s.budgets.groc = s.undo.groc; s.budgets.trans = s.undo.trans; s.applied = false; s.undo = null; this.render(); this.toast('Change undone. Your budget is back to before.'); var h = this.app.querySelector('[data-k="h"]'); if (h) h.focus({ preventScroll: true }); },
      nothanks: function () { this.go('home'); this.toast('Suggestion dismissed. Your budget is unchanged.'); },
      filt: function (v) { this.s.filter = v; this.s.more = false; this.render('filt-' + v); if (v !== 'all') this.tick('filter'); this.say((v === 'all' ? 'All categories' : CATS[v].name) + ' shown.'); },
      sort: function () { this.s.sort = this.s.sort === 'amt' ? 'date' : 'amt'; this.render('sort'); this.toast(this.s.sort === 'amt' ? 'Largest first.' : 'Newest first.'); },
      more: function () { this.s.more = !this.s.more; var box = this.app.querySelector('[data-list]'); if (box) { box.innerHTML = listHtml(this.s); var b = box.querySelector('[data-k="more"]'); if (b) b.focus(); } },
      receipt: function () { this.s.scan = ''; this.open(receiptSheet(this.s)); },
      scan: function () {
        var self = this; if (this.s.scan === 'busy') return; this.s.scan = 'busy'; reopen(this, receiptSheet(this.s), null);
        setTimeout(function () { self.s.scan = 'done'; if (self.ov.innerHTML) { reopen(self, receiptSheet(self.s), null); self.say('Receipt read: Fresh Mart, $23.80, Groceries.'); } }, P.reduce ? 0 : 900);
      },
      addrcpt: function () {
        var s = this.s, tot = 0; RECEIPT.forEach(function (r) { tot += r[1]; });
        s.tx.push({ id: s.nid++, who: 'Fresh Mart', cat: 'groc', amt: r2(tot), d: TODAY, note: 'Scanned receipt' }); s.scan = '';
        this.closeOv(); this.render(); this.toast('Added ' + money(tot) + ' to Groceries.'); this.tick('receipt');
      },
      period: function (v) { this.s.period = v; this.render('per-' + v); },
      breakdown: function () {
        var s = this.s;
        this.open('<div class="ma-sh"><h3 data-title>Breakdown</h3><p>January so far, by category.</p><ul class="ma-bd">' + ORDER.map(function (k) { var v = spentBy(s, k), b = s.budgets[k]; return '<li><span class="ic" style="--c:' + CATS[k].color + '" aria-hidden="true">' + ic(CATS[k].ic, 18) + '</span><span class="w"><b>' + CATS[k].name + '</b>' + bar(v, b) + '<small>' + money(v) + ' of ' + money(b) + ' (' + pct(v, b) + '%)</small></span></li>'; }).join('') + '</ul><div class="acts"><button type="button" class="ma-btn" data-a="close">Done</button></div></div>');
      },
      note: function (id) { var t = NOTES[id]; this.open('<div class="ma-sh"><span class="ma-tag blue">Design note</span><h3 data-title>' + esc(t.t) + '</h3><p>' + esc(t.b) + '</p><div class="acts"><button type="button" class="ma-btn" data-a="close">Got it</button></div></div>'); },
      issue: function (id) {
        var it = ISSUES[id];
        this.open('<div class="ma-sh"><span class="ma-tag red">' + it.r + '</span><h3 data-title>' + esc(it.t) + '</h3><p>' + esc(it.b) + '</p><span class="ma-tag">The fix</span><p>' + esc(it.fix) + '</p><div class="acts"><button type="button" class="ma-btn ghost" data-a="close">Close</button><button type="button" class="ma-btn" data-a="seefix" data-v="' + id + '">See the fix</button></div></div>');
      },
      seefix: function (id) { this.s.mode = 'final'; this.go(ISSUES[id].go); }
    }
  });
  P.start();

  /* Enter sends a chat message */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !e.target.matches || !e.target.matches('[data-proto="anchor"] [data-i="msg"]')) return;
    var root = e.target.closest('[data-proto]'), sh = root && root.__pr; if (!sh) return;
    e.preventDefault(); sh.def.actions.send.call(sh);
  });

})();
