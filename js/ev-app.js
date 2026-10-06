/* EV Charging concept, rebuilt in code from my Figma screens: plan a trip,
   see working chargers on the route, check in, start charging and pay in
   one app. Status colors carry the meaning first (green works, red doesn't,
   amber is unknown), always with a word next to the color.
   Runs on ProtoShell (proto.js). Sample data only; navigation, payment and
   charging are simulated. */
(function () {
  'use strict';
  var P = window.ProtoShell;
  if (!P) return;
  var esc = P.esc;

  var PATHS = {
    home: '<path d="M4 11 12 4l8 7v9h-5v-6h-6v6H4z"/>',
    bell: '<path d="M6 9.5a6 6 0 0 1 12 0c0 5.5 2.4 7 2.4 7H3.6S6 15 6 9.5"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>',
    dollar: '<path d="M12 3v18M16.5 7.5c-.6-1.6-2.4-2.5-4.5-2.5-2.5 0-4.5 1.3-4.5 3.3 0 4.6 9 2.4 9 7 0 2-2 3.4-4.5 3.4-2.3 0-4.1-1-4.7-2.7"/>',
    chat: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    loc: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.5"/>',
    pin: '<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
    check: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.5l2.7 2.7L16 9.8"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
    fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1.5-3 4-3 7h3M17 3v18"/>',
    people: '<circle cx="8" cy="6" r="2.5"/><circle cx="16" cy="6" r="2.5"/><path d="M5 21v-6l-1-4h8l-1 4v6M13 21v-6l-1-4h8l-1 4v6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.2v.3"/>',
    cart: '<path d="M3 4h2l2.2 11h11l2-8H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    nav: '<path d="M3 11 21 3l-8 18-2-8z"/>',
    car: '<path d="M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v2.5M19 16v2.5M4 11h16"/><circle cx="8" cy="13.5" r=".9"/><circle cx="16" cy="13.5" r=".9"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
    battery: '<rect x="2.5" y="7" width="17" height="10" rx="2"/><path d="M21.5 10.5v3M5.5 10v4"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>'
  };
  function ic(n, s) { s = s || 20; return '<svg class="i" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + PATHS[n] + '</svg>'; }

  /* ── Sample stations (status: ok, down, unknown) ──────────────────── */
  var ST = {
    autel: { name: 'Autel Charging Station', short: 'Autel Charging St.', city: 'Clawson, MI', st: 'ok', note: 'Working: a driver checked in 12 minutes ago', free: 1, type: 'TYPE 2', speed: 'Slow Charge', price: 0.50, away: '10 minutes away', x: 170, y: 392,
      food: ['Taco Bell', 'Subway'], shop: ['Clawson Mall', 'Staples', 'Aldi'] },
    tesla: { name: 'Tesla Supercharger', short: 'Tesla Supercharger', city: 'Troy, MI', st: 'ok', note: 'Working: 4 of 8 stalls free right now', free: 4, type: 'DC fast', speed: 'Fast Charge', price: 0.52, away: '25 minutes away', x: 170, y: 466,
      food: ['Coffee shop', 'Deli'], shop: ['Grocery store'] },
    library: { name: 'Library Lot Charger', short: 'Library Lot Charger', city: 'Royal Oak, MI', st: 'down', note: 'Out of service: reported by 3 drivers, 2 hours ago', free: 0, type: 'TYPE 2', speed: 'Slow Charge', price: 0.45, x: 82, y: 300 },
    garage: { name: 'Main St Garage Charger', short: 'Main St Garage', city: 'Birmingham, MI', st: 'unknown', note: 'Unknown: no reports in the last 24 hours', free: null, type: 'TYPE 2', speed: 'Slow Charge', price: 0.48, x: 300, y: 196 },
    mall: { name: 'Mall Parking Charger', short: 'Mall Parking', city: 'Southfield, MI', st: 'ok', note: 'Working: a driver checked in 40 minutes ago', free: 2, type: 'TYPE 2', speed: 'Slow Charge', price: 0.49, x: 64, y: 448 }
  };
  var NEAR = [['evgo', 'EVgo Station'], ['tesla', 'Tesla Supercharger'], ['cp', 'Chargepoint Charger']];
  var STLAB = { ok: 'Working', down: 'Out of service', unknown: 'Unknown' };
  var ROUTES = [
    { id: 'a', min: 40, d: 'M250 250 L250 330 L170 330 L170 540', lab: [196, 300] },
    { id: 'b', min: 50, d: 'M250 250 L302 300 L302 420 L214 470 L170 540', lab: [306, 380] },
    { id: 'c', min: 50, d: 'M250 250 L338 262 L338 476 L250 500 L170 540', lab: [342, 470] }
  ];

  function stDot(st, label) { return '<span class="ev-st ' + st + '"><i aria-hidden="true"></i>' + (label || STLAB[st]) + '</span>'; }
  function money(n) { return '$' + n.toFixed(2); }

  /* A stylized map of the area (not a real map), drawn in SVG */
  function mapSvg(s) {
    var roads = '';
    [[0, 120, 375, 140], [0, 250, 375, 240], [0, 330, 375, 330], [0, 420, 375, 410], [0, 540, 375, 560], [80, 0, 70, 640], [170, 0, 170, 640], [250, 0, 260, 640], [338, 0, 330, 640]].forEach(function (r) { roads += '<line x1="' + r[0] + '" y1="' + r[1] + '" x2="' + r[2] + '" y2="' + r[3] + '" class="rd"/>'; });
    [[0, 60, 375, 80], [0, 190, 375, 180], [0, 480, 375, 470], [30, 0, 40, 640], [120, 0, 125, 640], [210, 0, 205, 640], [300, 0, 295, 640]].forEach(function (r) { roads += '<line x1="' + r[0] + '" y1="' + r[1] + '" x2="' + r[2] + '" y2="' + r[3] + '" class="rd2"/>'; });
    roads += '<path class="hw" d="M-10 600 C 80 520, 120 420, 210 380 S 330 300, 390 150"/><path class="hw" d="M60 -10 C 90 120, 140 200, 230 230 S 360 300, 390 330"/>';
    var labels = [['Rochester Hills', 250, 92], ['Pontiac', 60, 150], ['Troy', 268, 214], ['Bloomfield Hills', 34, 226], ['Birmingham', 112, 286], ['Clawson', 196, 364], ['Royal Oak', 120, 438], ['Southfield', 20, 506], ['Ferndale', 150, 590], ['Warren', 300, 380], ['Sterling Heights', 280, 300], ['Detroit', 290, 610]].map(function (l) { return '<text x="' + l[1] + '" y="' + l[2] + '">' + l[0] + '</text>'; }).join('');
    var shields = [['75', 40, 170], ['96', 230, 600], ['24', 140, 60], ['59', 330, 240]].map(function (h) { return '<g class="sh"><rect x="' + (h[1] - 11) + '" y="' + (h[2] - 9) + '" width="22" height="16" rx="4"/><text x="' + h[1] + '" y="' + (h[2] + 3) + '">' + h[0] + '</text></g>'; }).join('');
    var routes = '';
    if (s.routes) ROUTES.slice().sort(function (a, b) { return (a.id === s.route) - (b.id === s.route); }).forEach(function (r) { routes += '<path class="rt' + (r.id === s.route ? ' on' : '') + '" d="' + r.d + '"/>'; });
    return '<svg class="ev-map" viewBox="0 0 375 640" preserveAspectRatio="none" aria-hidden="true" focusable="false"><rect width="375" height="640" class="bg"/><path class="wtr" d="M240 640 C 280 600, 330 610, 375 570 L375 640 Z"/>' + roads + routes + labels + shields +
      '<g class="me" transform="translate(250 250)"><circle r="14" class="halo"/><circle r="7"/></g><g class="dest" transform="translate(170 540)"><path d="M0 0 C -9 -12, -12 -18, -12 -24 A12 12 0 0 1 12 -24 C 12 -18, 9 -12, 0 0z"/><circle cy="-24" r="4.5"/></g></svg>';
  }
  /* Real buttons on top of the drawn map, so every marker is reachable by keyboard */
  function mapButtons(s) {
    var b = Object.keys(ST).map(function (k) { var t = ST[k]; return '<button type="button" class="ev-mk ' + t.st + '" style="left:' + (t.x / 3.75) + '%;top:' + (t.y / 6.4) + '%" data-a="marker" data-v="' + k + '" data-k="mk-' + k + '" aria-label="' + t.name + ', ' + STLAB[t.st] + '">' + ic('bolt', 14) + '</button>'; }).join('');
    if (s.routes) b += ROUTES.map(function (r, i) { return '<button type="button" class="ev-rt' + (r.id === s.route ? ' on' : '') + '" style="left:' + (r.lab[0] / 3.75) + '%;top:' + (r.lab[1] / 6.4) + '%" data-a="pickroute" data-v="' + r.id + '" data-k="rt-' + r.id + '" aria-pressed="' + (r.id === s.route) + '" aria-label="Route ' + (i + 1) + ', ' + r.min + ' minutes' + (i === 0 ? ', fastest' : '') + '">' + r.min + ' min</button>'; }).join('');
    return b;
  }
  function tabs(cur) {
    var T = [['map', 'Home', 'home'], ['alerts', 'Alerts', 'bell'], ['pay', 'Payments', 'dollar'], ['chat', 'Chat', 'chat']];
    return '<div class="ev-tabs" role="group" aria-label="App tabs">' + T.map(function (t) { return '<button type="button" data-a="tab" data-v="' + t[0] + '" data-k="tab-' + t[0] + '" aria-label="' + t[1] + '"' + (cur === t[0] ? ' aria-current="page"' : '') + '>' + ic(t[2], 26) + '</button>'; }).join('') + '</div>';
  }
  function wrap(inner, cls) { return '<div class="ev' + (cls ? ' ' + cls : '') + '">' + inner + '</div>'; }
  function hdr(title, back) { return '<div class="ev-hd"><button type="button" class="ev-bk" data-a="go" data-v="' + back + '" data-k="back" aria-label="Back">' + ic('back', 22) + '</button><h2 data-k="h" tabindex="-1">' + title + '</h2></div>'; }

  /* ── Screens ───────────────────────────────────────────────────────── */
  function vMap(s) {
    var card = '';
    if (s.calc) card = '<div class="ev-sheet" role="status"><p class="big">Calculating Best Route for you<span class="dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></p></div>';
    else if (!s.routes) card = '<div class="ev-sheet"><p class="big">Where to?</p><p class="sm">Working chargers on your way, before you leave.</p><button type="button" class="ev-btn" data-a="plan" data-k="plan">' + ic('nav', 18) + ' Find the best route</button></div>';
    else {
      var r = ROUTES.filter(function (x) { return x.id === s.route; })[0], fast = s.route === 'a';
      var list = '';
      if (s.open) list = '<div class="ev-enr" id="ev-enr"><p class="t">Charger en-route (2)</p>' + ['autel', 'tesla'].map(function (k) {
        var t = ST[k];
        return '<div class="ev-stop"><div class="top"><button type="button" class="ev-name" data-a="station" data-v="' + k + '" data-k="nm-' + k + '">' + t.name + '</button>' + stDot(t.st) + '</div><p class="sm">' + t.away + ' · ' + money(t.price) + ' per kWh</p><div class="row"><button type="button" class="ev-mini" data-a="gohere" data-v="' + k + '" data-k="go-' + k + '">Go here</button><button type="button" class="ev-mini light" data-a="station" data-v="' + k + '" data-k="dt-' + k + '">Detailed Station Info</button></div></div>';
      }).join('') + '</div>';
      card = '<div class="ev-sheet"><div class="ev-sum"><div><p class="big">' + r.min + ' minutes</p><p class="sm">' + (fast ? 'Fastest route with current traffic conditions' : 'Slower with current traffic. The 40 minute route is faster.') + '</p></div><button type="button" class="ev-start" data-a="start" data-k="start">' + (s.started ? 'Started' : 'Start') + '</button></div>' +
        (fast ? '<button type="button" class="ev-exp" data-a="toggle" data-k="exp" aria-expanded="' + !!s.open + '" aria-controls="ev-enr">2 charging stations ' + ic('down', 16) + '</button>' + list : '<p class="sm">No working chargers on this route.</p>') + '</div>';
    }
    var banner = s.low ? '<div class="ev-alert" role="alert">' + ic('battery', 20) + '<div><b>Battery at 18%, about 40 miles left</b>Nearest working charger: Autel Charging Station, 10 minutes away.</div><button type="button" class="ev-mini" data-a="station" data-v="autel" data-k="lowgo">Go here</button></div>' : '';
    return { tone: 'dark', bar: '#1D2830', html: wrap('<div class="ev-mapwrap">' + mapSvg(s) + '<div class="ev-btns">' + mapButtons(s) + '</div>' +
      '<div class="ev-maptop"><h2 data-k="h" tabindex="-1">Plan My Trip</h2><span class="ev-av" aria-hidden="true">S</span></div>' +
      '<div class="ev-search"><div class="f">' + ic('loc', 18) + '<span>Your Location</span>' + ic('mic', 18) + '</div><div class="f b">' + ic('pin', 18) + '<span>Professional Education Center</span></div></div>' + banner +
      '<div class="ev-legend" aria-hidden="true">' + stDot('ok') + stDot('down', 'Down') + stDot('unknown') + '</div>' +
      (!s.low && !s.calc ? '<button type="button" class="ev-demo" data-a="low" data-k="low">Demo: low battery</button>' : '') +
      card + '</div>' + tabs('map'), 'dark') };
  }
  function art(k) {
    return '<svg class="ev-art" viewBox="0 0 375 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs><linearGradient id="evsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FC7D9"/><stop offset="1" stop-color="#D9E8EE"/></linearGradient></defs><rect width="375" height="210" fill="url(#evsky)"/><rect y="150" width="375" height="60" fill="#8A9399"/><rect x="200" y="96" width="175" height="58" fill="#C9B79C"/><rect x="214" y="110" width="146" height="20" fill="#6F7F86"/><path d="M0 156 H375" stroke="#F2F2F2" stroke-width="3" stroke-dasharray="18 14"/>' +
      '<rect x="64" y="58" width="58" height="104" rx="8" fill="#E7ECEC" stroke="#9AA6A6" stroke-width="3"/><rect x="74" y="70" width="38" height="26" rx="3" fill="#2E625A"/><path d="M93 76 86 86h6l-2 6 8-10h-6z" fill="#BFF0E6"/><rect x="60" y="160" width="66" height="8" rx="3" fill="#2B2F38"/><path d="M118 112 C 150 118, 160 150, 196 150" stroke="#2B2F38" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M170 168 C 176 140, 196 126, 236 124 L 300 124 C 330 124, 350 140, 362 168 Z" fill="#3D4652"/><path d="M206 128 L 228 110 L 296 110 L 318 128 Z" fill="#59636E"/><circle cx="214" cy="170" r="16" fill="#1D2024"/><circle cx="324" cy="170" r="16" fill="#1D2024"/>' +
      '<rect width="375" height="210" fill="#2E625A" opacity=".35"/></svg>';
  }
  function vStation(s, ui) {
    var k = s.st, t = ST[k] || ST.autel, fav = !!s.fav[k];
    var cta = s.connected === k ? '<button type="button" class="ev-btn big" data-a="plugin" data-k="cta">' + ic('plug', 20) + ' Plugin to start Charging</button><p class="ev-hint">Plug the cable into your car. It starts on its own, and you pay in the app.</p>'
      : '<button type="button" class="ev-btn big" data-a="connect" data-k="cta"' + (t.st === 'down' ? ' disabled' : '') + '>' + ic('bolt', 20) + ' Connect to start Charging</button>' + (t.st === 'down' ? '<p class="ev-hint warn">This charger is out of service, so connecting is off. Try Autel Charging Station.</p>' : '');
    var amen = s.amen ? '<div class="ev-amen" id="' + ui.uid + 'am"><div class="grp food"><span class="ic" aria-hidden="true">' + ic('fork', 30) + '</span><ul>' + (t.food || []).map(function (x, i) { return '<li><span>' + x + '</span><button type="button" data-a="toast" data-v="Directions to ' + x + ': simulated in this demo." data-k="f' + i + '" aria-label="Directions to ' + x + '">' + ic('pin', 18) + '</button></li>'; }).join('') + '</ul></div>' +
      '<div class="grp shop"><span class="ic" aria-hidden="true">' + ic('cart', 30) + '</span><ul>' + (t.shop || []).map(function (x, i) { return '<li><span>' + x + '</span><button type="button" data-a="toast" data-v="Directions to ' + x + ': simulated in this demo." data-k="s' + i + '" aria-label="Directions to ' + x + '">' + ic('pin', 18) + '</button></li>'; }).join('') + '</ul></div></div>' : '';
    return { tone: 'dark', bar: '#2E625A', html: wrap('<div class="ev-head">' + art(k) + '<button type="button" class="ev-bk on" data-a="go" data-v="' + (s.from || 'map') + '" data-k="back" aria-label="Back">' + ic('back', 22) + '</button><h2 data-k="h" tabindex="-1">' + t.name + '</h2></div>' +
      '<div class="ev-main"><div class="ev-facts"><span>' + ic('bolt', 22) + '<b>' + (t.free == null ? 'Availability unknown' : t.free + ' Charger' + (t.free === 1 ? '' : 's') + ' Available') + '</b></span><span>' + ic('check', 20) + '<span><b>' + t.type + '</b> (' + t.speed + ')</span></span></div>' +
      '<p class="ev-status">' + stDot(t.st) + '<span>' + t.note + '</span></p>' + cta +
      '<div class="ev-acts"><button type="button" data-a="fav" data-k="fav" aria-pressed="' + fav + '" class="' + (fav ? 'on' : '') + '">' + ic('heart', 26) + '<span>Save as Favorite</span></button><button type="button" data-a="amen" data-k="amen" aria-expanded="' + !!s.amen + '" aria-controls="' + ui.uid + 'am"><span class="ic2">' + ic('fork', 22) + ic('people', 22) + '</span><span>Amenities</span></button><button type="button" data-a="info" data-v="' + k + '" data-k="info">' + ic('info', 26) + '<span>Information</span></button></div>' +
      amen + '<button type="button" class="ev-help" data-a="toast" data-v="Contact Help: simulated in this demo." data-k="help">Contact Help</button></div>' + tabs('map')) };
  }
  function vCheckin(s) {
    return { tone: 'dark', bar: '#3A4A47', html: wrap('<div class="ev-cihead">' + art('autel') + '<h2 data-k="h" tabindex="-1">Check-in at</h2><button type="button" class="ev-scard" data-a="station" data-v="autel" data-k="ci-autel"><span><b>Autel Charging St.</b><small>Clawson, MI</small></span>' + ic('chev', 20) + '</button></div>' +
      '<div class="ev-main"><h3 class="ev-h3">Other Stations<br>near you</h3>' + NEAR.map(function (n) { return '<button type="button" class="ev-scard" data-a="' + (n[0] === 'tesla' ? 'station' : 'toast') + '" data-v="' + (n[0] === 'tesla' ? 'tesla' : n[1] + ': details are simulated in this demo.') + '" data-k="ci-' + n[0] + '"><span><b>' + n[1] + '</b><small>Clawson, MI</small></span>' + ic('chev', 20) + '</button>'; }).join('') + '</div>' + tabs('map')) };
  }
  function vAlerts(s) {
    var items = s.alerts.length ? s.alerts.map(function (a, i) { return '<li><span class="ic" aria-hidden="true">' + ic(a.ic, 20) + '</span><div><b>' + a.t + '</b><p>' + a.b + '</p></div></li>'; }).join('') : '<li class="empty"><p>No alerts yet. Try "Demo: low battery" on the map.</p></li>';
    return { tone: 'dark', bar: '#000000', html: wrap('<div class="ev-pagehd"><h2 data-k="h" tabindex="-1">Alerts</h2></div><div class="ev-main"><ul class="ev-list">' + items + '</ul></div>' + tabs('alerts'), 'page') };
  }
  function vPay(s) {
    var rows = s.sessions.length ? s.sessions.map(function (x) { return '<li><span class="ic" aria-hidden="true">' + ic('bolt', 20) + '</span><div><b>' + x.where + '</b><p>' + x.kwh.toFixed(1) + ' kWh · ' + x.when + '</p></div><b class="amt">' + money(x.cost) + '</b></li>'; }).join('') : '<li class="empty"><p>No charging sessions yet.</p></li>';
    return { tone: 'dark', bar: '#000000', html: wrap('<div class="ev-pagehd"><h2 data-k="h" tabindex="-1">Payments</h2></div><div class="ev-main"><div class="ev-paycard"><p class="k">One payment, every network</p><p class="big">' + ic('card', 22) + ' Saved card •••• 0018</p><p class="sm">Pay at any charger in the app. No RFID card, no extra membership. Sample card for this demo.</p></div><h3 class="ev-h3 sm">Recent sessions</h3><ul class="ev-list">' + rows + '</ul></div>' + tabs('pay'), 'page') };
  }
  function vChat(s, ui) {
    return { tone: 'dark', bar: '#000000', html: wrap('<div class="ev-pagehd"><h2 data-k="h" tabindex="-1">Ask the AI</h2></div><div class="ev-main"><p class="ev-sm">Demo: answers are scripted from sample data.</p><div class="ev-msgs">' + s.chat.map(function (m) { return '<p class="ev-msg ' + m.f + '">' + m.t + '</p>'; }).join('') + '</div>' +
      '<div class="ev-chips">' + [['work', 'Is the Autel charger working?'], ['cost', 'What will a charge cost?'], ['near', 'Where is the nearest fast charger?']].map(function (c) { return '<button type="button" data-a="ask" data-v="' + c[0] + '" data-k="ask-' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div></div>' + tabs('chat'), 'page') };
  }

  var ANS = {
    work: 'Yes. A driver checked in there 12 minutes ago, and 1 charger is free.',
    cost: 'At $0.50 per kWh, adding about 30 kWh costs around $15. You pay in the app.',
    near: 'Tesla Supercharger in Troy, 25 minutes away, with 4 of 8 stalls free.'
  };

  P.register('ev', {
    label: 'EV charging app prototype',
    time: '8:23',
    dark: '#1D2830',
    tour: [
      { id: 'route', label: 'Plan a trip and start the fastest route', go: 'map' },
      { id: 'stop', label: 'Open a charging stop on the way', go: 'map', extra: { routes: true, route: 'a', open: true } },
      { id: 'status', label: 'Tap a red or amber charger on the map', go: 'map' },
      { id: 'amen', label: 'See what is nearby while you charge', go: 'station', extra: { st: 'autel' } },
      { id: 'charge', label: 'Check in and start charging, no RFID card', go: 'checkin' },
      { id: 'alert', label: 'Get a low-battery alert', go: 'map' }
    ],
    tourIntro: 'Each one ticks itself off when you do it on the phone.',
    tourNote: 'A concept, rebuilt from my Figma file. Stations, prices and statuses are sample data, and the map is a drawing.',
    state: function (sh) {
      sh.uid = sh.uid || 'ev' + Math.random().toString(36).slice(2, 7);
      return { screen: 'map', from: 'map', routes: false, route: 'a', open: false, calc: false, started: false, low: false, st: 'autel', fav: {}, amen: false, connected: '', alerts: [], sessions: [], chat: [{ f: 'ai', t: 'Hi! Ask me about chargers, costs or your trip.' }] };
    },
    view: function (s, ui) {
      switch (s.screen) {
        case 'station': return vStation(s, ui);
        case 'checkin': return vCheckin(s);
        case 'alerts': return vAlerts(s);
        case 'pay': return vPay(s);
        case 'chat': return vChat(s, ui);
        default: return vMap(s);
      }
    },
    actions: {
      go: function (v) { this.go(v); },
      tab: function (v) { this.s.from = v; this.go(v); },
      toast: function (v) { this.toast(v); },
      close: function () { this.closeOv(); },
      plan: function () {
        var self = this, s = this.s; s.calc = true; this.render('h'); this.say('Calculating the best route.');
        setTimeout(function () { s.calc = false; s.routes = true; s.route = 'a'; if (s.screen === 'map') { self.render('rt-a'); self.say('3 routes found. The fastest takes 40 minutes.'); } }, P.reduce ? 0 : 1200);
      },
      pickroute: function (v) { this.s.route = v; this.s.open = false; this.s.started = false; this.render('rt-' + v); },
      toggle: function () { this.s.open = !this.s.open; this.render('exp'); },
      start: function () { this.s.started = true; this.render('start'); this.toast('Navigation started: simulated in this demo.'); this.tick('route'); },
      gohere: function (v) { this.s.started = true; this.toast('Heading to ' + ST[v].name + ': simulated in this demo.'); this.tick('route'); this.render('go-' + v); },
      station: function (v) { this.s.from = this.s.screen === 'station' ? this.s.from : this.s.screen; this.s.st = v; this.s.amen = false; this.go('station'); if (this.s.from === 'map') this.tick('stop'); },
      marker: function (v) {
        var t = ST[v];
        if (t.st !== 'ok') this.tick('status');
        this.open('<div class="ev-sh"><p class="ev-sh-st">' + stDot(t.st) + '</p><h3 data-title>' + t.name + '</h3><p>' + t.city + ' · ' + money(t.price) + ' per kWh</p><p>' + t.note + '.</p><div class="acts"><button type="button" class="ev-btn ghost" data-a="close">Close</button>' + (t.st === 'ok' ? '<button type="button" class="ev-btn" data-a="station" data-v="' + v + '">Details</button>' : '') + '</div></div>');
      },
      low: function () {
        var s = this.s; s.low = true;
        if (!s.alerts.some(function (a) { return a.k === 'low'; })) s.alerts.unshift({ k: 'low', ic: 'battery', t: 'Battery at 18%', b: 'Nearest working charger: Autel Charging Station, 10 minutes away.' });
        this.render('lowgo'); this.tick('alert');
      },
      fav: function () { var k = this.s.st; this.s.fav[k] = !this.s.fav[k]; this.render('fav'); this.toast(this.s.fav[k] ? 'Saved as a favorite.' : 'Removed from favorites.'); },
      amen: function () { this.s.amen = !this.s.amen; this.render('amen'); if (this.s.amen) { this.tick('amen'); this.say('Nearby: food and shopping.'); } },
      info: function (v) {
        var t = ST[v];
        this.open('<div class="ev-sh"><h3 data-title>' + t.name + '</h3><dl class="ev-dl"><div><dt>Status</dt><dd>' + stDot(t.st) + '</dd></div><div><dt>Connector</dt><dd>' + t.type + ', ' + t.speed + '</dd></div><div><dt>Price</dt><dd>' + money(t.price) + ' per kWh</dd></div><div><dt>Pay with</dt><dd>This app, on any network</dd></div><div><dt>Latest report</dt><dd>' + t.note + '</dd></div></dl><p class="ev-fine">Sample data for this demo.</p><div class="acts"><button type="button" class="ev-btn" data-a="close">Got it</button></div></div>');
      },
      connect: function () { this.s.connected = this.s.st; this.render('cta'); this.say('Connected. Plug in to start charging.'); },
      plugin: function () {
        var s = this.s, t = ST[s.st], kwh = 12.4, cost = kwh * t.price;
        s.charging = { kwh: kwh, cost: cost };
        this.open('<div class="ev-sh"><p class="ev-sh-st">' + stDot('ok', 'Charging') + '</p><h3 data-title>Charging started</h3><p>' + t.name + ', ' + t.type + '. Paying with your saved card on this network, with no RFID card.</p><div class="ev-meter" aria-hidden="true"><i></i></div><p class="ev-fine">Sample session: stop any time.</p><div class="acts"><button type="button" class="ev-btn" data-a="stop">Stop charging</button></div></div>');
        this.tick('charge');
      },
      stop: function () {
        var s = this.s, t = ST[s.st], c = s.charging || { kwh: 12.4, cost: 12.4 * t.price };
        s.sessions.unshift({ where: t.name, kwh: c.kwh, cost: c.cost, when: 'Today' });
        s.connected = ''; s.charging = null;
        this.closeOv(true); this.go('pay'); this.toast('Charging stopped. Paid ' + money(c.cost) + ' for ' + c.kwh.toFixed(1) + ' kWh.');
      },
      ask: function (v, el) { this.s.chat.push({ f: 'me', t: esc(el.textContent) }, { f: 'ai', t: ANS[v] }); this.render('ask-' + v); this.say(ANS[v]); }
    }
  });
  P.start();
})();
