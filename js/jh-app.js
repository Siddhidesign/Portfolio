/* Jai Hind staff console, recreated in code from the Figma file.
   Screens: Welcome (two doors), the shopper's door, Dashboard, Orders,
   Customers, and a four-step sales order with one live cart.
   Modes: Wireframe (with the file's numbered notes), Before (the team's
   original look, with the audit's findings pinned on it) and After.
   Data is placeholder, exactly as in the file. Nothing is sent anywhere. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '₹ ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function attr(o) { var s = ''; for (var k in o) { if (o[k] !== false && o[k] != null) s += ' ' + k + (o[k] === true ? '' : '="' + esc(o[k]) + '"'); } return s; }

  /* ── Icons (24px stroke) ───────────────────────────────── */
  var I = {
    refresh: '<path d="M20 11a8 8 0 1 0-2.4 5.8"/><path d="M20 4v7h-7"/>',
    bell: '<path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>',
    down: '<path d="m6 9 6 6 6-6"/>', left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h3l2.6 11.6a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 8H6.4"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17" r="2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    pin: '<path d="M12 21s7-6.6 7-11.5a7 7 0 1 0-14 0C5 14.4 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    chart: '<path d="M4 4v16h16"/><path d="M8 16v-3M12 16V9M16 16V6"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14a6 6 0 0 1 3 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    warn: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    menu: '<path d="M4 7h16M4 12h10M4 17h16"/>',
    printer: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>', upload: '<path d="M12 15V3M7 8l5-5 5 5M4 21h16"/>',
    swap: '<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    store: '<path d="M4 10v10h16V10"/><path d="M3 4h18l-1 6H4z"/><path d="M10 20v-5h4v5"/>'
  };
  function ico(n, s) { s = s || 16; return '<svg class="ji" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + I[n] + '</svg>'; }

  /* ── Simple garment drawings for product thumbnails ────── */
  var SH = {
    tee: 'M14 7 20 5Q24 9.5 28 5L34 7 42 15 36 20.5 33 17.5V42H15V17.5L12 20.5 6 15Z',
    shirt: 'M15 6 20 4 24 8 28 4 33 6 41 30 37 31.5 33 17V44H15V17L11 31.5 7 30Z',
    jeans: 'M15 4H33L36 44H27L24 16 21 44H12Z',
    tie: 'M21 4H27L28 8 25.6 10.6 30 33 24 42 18 33 22.4 10.6 20 8Z'
  };
  function shape(kind, c, tx) {
    var st = ' stroke="rgba(0,0,0,.3)" stroke-width="1" stroke-linejoin="round"';
    var g = '<g' + (tx ? ' transform="' + tx + '"' : '') + '>';
    if (kind === 'polo' || kind === 'tee') {
      g += '<path d="' + SH.tee + '" fill="' + c + '"' + st + '/>';
      if (kind === 'polo') g += '<path d="M20 5 24 11 28 5" fill="none"' + st + '/><path d="M24 11V18" stroke="rgba(0,0,0,.3)"/><circle cx="24" cy="14" r=".9" fill="rgba(0,0,0,.35)"/><circle cx="24" cy="16.6" r=".9" fill="rgba(0,0,0,.35)"/>';
      else g += '<path d="M20 5Q24 9.5 28 5" fill="none"' + st + '/>';
    } else if (kind === 'shirt') {
      g += '<path d="' + SH.shirt + '" fill="' + c + '"' + st + '/><path d="M20 4 22 10 24 8 26 10 28 4" fill="none"' + st + '/><path d="M24 9V44" stroke="rgba(0,0,0,.25)"/>';
      [15, 22, 29, 36].forEach(function (y) { g += '<circle cx="25.2" cy="' + y + '" r=".8" fill="rgba(0,0,0,.35)"/>'; });
    } else if (kind === 'jeans') {
      g += '<path d="' + SH.jeans + '" fill="' + c + '"' + st + '/><path d="M15 8.5H33M24 8.5V16M17 12Q19 15 21.5 12M26.5 12Q29 15 31 12" fill="none" stroke="rgba(255,255,255,.35)"/>';
    } else if (kind === 'tie') {
      g += '<path d="' + SH.tie + '" fill="' + c + '"' + st + '/><path d="M20.4 8H27.6" stroke="rgba(0,0,0,.25)"/>';
    }
    return g + '</g>';
  }
  function garment(g) {
    var k = g[0], inner;
    if (k === 'set') inner = shape('polo', g[3], 'translate(10 6) scale(.62)') + shape('polo', g[2], 'translate(2 13) scale(.62)') + shape('polo', g[1], 'translate(14 16) scale(.62)');
    else if (k === 'ties') inner = shape('tie', g[1], 'translate(-6 4) scale(.85)') + shape('tie', g[2], 'translate(4 2) scale(.85)') + shape('tie', g[3], 'translate(14 6) scale(.85)');
    else inner = shape(k, g[1]);
    return '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  var ART = {
    shop: '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false"><path d="M60 18a7 7 0 1 1 7 7v6l42 26H11l42-26"/><path d="M28 57 22 108h76l-6-51"/><path d="M50 57v12a10 10 0 0 0 20 0V57"/></svg>',
    staff: '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false"><path d="M16 46v60h88V46"/><path d="M10 18h100l-6 28H16z"/><path d="M10 18l6 28M38 18l-4 28M60 18v28M82 18l4 28M110 18l-6 28"/><path d="M48 106V74h24v32"/><rect x="24" y="60" width="16" height="16"/><rect x="80" y="60" width="16" height="16"/></svg>'
  };

  /* ── Data from the file (placeholder) ──────────────────── */
  var ST = { pending: 'Pending', flagged: 'Flagged', approved: 'Approved', processing: 'Processing', shipped: 'Shipped', transit: 'In-Transit', delivered: 'Delivered', cancelled: 'Cancelled', returned: 'Returned', damaged: 'Damaged' };
  var TABS = ['all', 'pending', 'flagged', 'approved', 'processing', 'shipped', 'transit', 'delivered', 'cancelled'];
  var COUNTS = { all: 10400, pending: 2080, flagged: 20, approved: 2082, processing: 202, shipped: 208, transit: 1239, delivered: 2080, cancelled: 2080 };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  var TREND = { orders: [280, 355, 262, 420, 770, 455, 530], sales: [272, 350, 258, 418, 772, 452, 528] };
  var RATE = [['flagged', 6.12], ['pending', 9.84], ['approved', 22.37], ['shipped', 15.06], ['delivered', 42.37], ['cancelled', 4.24]];
  var CYCLE = [['flagged', 567], ['pending', 234], ['approved', 789], ['shipped', 1034], ['delivered', 1499], ['cancelled', 121]];
  var PRODUCTS = [
    { id: 'polo-brown', n: 'Polo Shirt- Brown', p: 275, g: ['polo', '#C9A27A'] },
    { id: 'tie-3', n: 'Tie- 3 set', p: 120, g: ['ties', '#E3B341', '#C98F2E', '#EED18A'] },
    { id: 'polo-blue', n: 'Polo Shirt- Blue', p: 150, g: ['polo', '#6FA8E6'] },
    { id: 'tee-white', n: 'Shirt- White', p: 270, g: ['tee', '#FFFFFF'], dk: true },
    { id: 'polo-black', n: 'Polo Shirt- Black', p: 190, g: ['polo', '#2A2D33'] },
    { id: 'polo-3', n: 'Polo Shirt- 3 set', p: 440, g: ['set', '#25365A', '#7C2433', '#1F2328'] },
    { id: 'polo-5', n: 'Polo Shirt- 5 set', p: 535, g: ['set', '#8A94A6', '#2F3E5C', '#4B5563'] },
    { id: 'jeans-black', n: 'Jeans- Black', p: 675, flat: 25, g: ['jeans', '#23262B'] },
    { id: 'jeans-blue', n: 'Jeans- Blue', p: 675, g: ['jeans', '#3F6EA6'] },
    { id: 'shirt-formal', n: 'Formal Shirt- White', p: 675, pct: 5, g: ['shirt', '#EEF1F5'] }
  ];
  var PBY = {}; PRODUCTS.forEach(function (p) { PBY[p.id] = p; });
  var CART0 = { 'polo-brown': 1, 'polo-blue': 2, 'jeans-black': 1, 'shirt-formal': 1, 'polo-3': 1, 'tie-3': 1, 'tee-white': 1, 'jeans-blue': 1 };
  var TOP = [
    { n: 'Polo Shirt- Blue', c: 15, p: 250, g: ['polo', '#6FA8E6'] }, { n: 'T-shirt White', c: 10, p: 200, g: ['tee', '#FFFFFF'], dk: true },
    { n: 'Black- Jeans', c: 18, p: 850, g: ['jeans', '#23262B'] }, { n: 'Polo Shirt- Brown', c: 20, p: 250, g: ['polo', '#C9A27A'] },
    { n: 'Formal Shirt- White', c: 15, p: 349, g: ['shirt', '#EEF1F5'] }, { n: 'Denim Jeans- Blue', c: 10, p: 900, g: ['jeans', '#3F6EA6'] }
  ];
  /* Phone numbers are shortened here; the search uses the first five digits. */
  var CUSTOMERS = [
    { id: 'C-1713', n: 'Manohar Pandey', ph: '+91 96730 •••99', key: '96730', addr: 'South Side, Level 6, 18 Kemal Ataturk Avenue, Mumbai-430055', dist: 'Mumbai', f: 14, pay: 'GPay', vip: true },
    { id: 'C-1688', n: 'Kavita Pawar', ph: '+91 98220 •••67', key: '98220', addr: '21, FC Road, Shivajinagar, Pune', dist: 'Pune', f: 11, pay: 'UPI' },
    { id: 'C-1642', n: 'Raj Mahadik', ph: '+91 99230 •••56', key: '99230', addr: 'H 12, Rd 12, Sec 12, Mumbai-1230', dist: 'Mumbai', f: 9, pay: 'Cash' },
    { id: 'C-1597', n: 'Tanvir Ahmed Anik', ph: '+91 90110 •••74', key: '90110', addr: '39/A, Senpara Parbata, Mumbai', dist: 'Mumbai', f: 8, pay: 'GPay' },
    { id: 'C-1561', n: 'Sneha Kulkarni', ph: '+91 97675 •••09', key: '97675', addr: '7, Karve Road, Kothrud, Pune', dist: 'Pune', f: 7, pay: 'Card' },
    { id: 'C-1534', n: 'Aditya Deshmukh', ph: '+91 98500 •••12', key: '98500', addr: '14, College Road, Nashik', dist: 'Nashik', f: 6, pay: 'UPI' }
  ];
  var HISTORY = [['HFS123456789', 3456, 'processing', 'Jul 26, 2022'], ['HFS123456782', 1280, 'approved', 'Jul 19, 2022'], ['HFS123456775', 2940, 'delivered', 'Jul 02, 2022'], ['HFS123456768', 675, 'delivered', 'Jun 21, 2022']];
  var ORDERS = [
    ['HF12893712', 'Jan 18, 2022', 'Jan 20, 2022', 'Jan 26, 2022', 'Raj Mahadik', 'H 12, Rd 12, Sec 12, Mumbai-1230', 'Mumbai Warehouse, Bhiwandi', 'pending', 3456, 'GPay', 'Vfast'],
    ['HF12893725', 'Jan 17, 2022', 'Jan 19, 2022', 'Jan 25, 2022', 'Manohar Pandey', '18 Kemal Ataturk Ave, Mumbai', 'Laxmi Road Store, Pune', 'approved', 1280, 'UPI', 'Padhke'],
    ['HF12893738', 'Jan 16, 2022', 'Jan 18, 2022', 'Jan 24, 2022', 'Kavita Pawar', '21, FC Road, Shivajinagar, Pune', 'Kothrud Store, Pune', 'processing', 2940, 'Cash', 'Vfast'],
    ['HF12893751', 'Jan 15, 2022', 'Jan 17, 2022', 'Jan 23, 2022', 'Tanvir Ahmed Anik', '39/A, Senpara Parbata, Mumbai', 'Alibaug Warehouse', 'shipped', 675, 'Card', 'Vfast'],
    ['HF12893764', 'Jan 14, 2022', 'Jan 16, 2022', 'Jan 22, 2022', 'Sneha Kulkarni', '7, Karve Road, Kothrud, Pune', 'Nashik Store, College Rd', 'transit', 4120, 'GPay', 'Padhke'],
    ['HF12893777', 'Jan 13, 2022', 'Jan 15, 2022', 'Jan 21, 2022', 'Aditya Deshmukh', '14, College Road, Nashik', 'Kolhapur Store', 'delivered', 1550, 'COD', 'Vfast'],
    ['HF12893790', 'Jan 18, 2022', 'Jan 20, 2022', 'Jan 26, 2022', 'Pooja Shinde', '3, Rajarampuri, Kolhapur', 'Mumbai Warehouse, Bhiwandi', 'pending', 2275, 'GPay', 'Vfast'],
    ['HF12893803', 'Jan 17, 2022', 'Jan 19, 2022', 'Jan 25, 2022', 'Vikram Jadhav', '52, Aundh Road, Aundh, Pune', 'Laxmi Road Store, Pune', 'flagged', 890, 'UPI', 'Padhke'],
    ['HF12893816', 'Jan 16, 2022', 'Jan 18, 2022', 'Jan 24, 2022', 'Neha Bhosale', '9, Magarpatta, Hadapsar, Pune', 'Kothrud Store, Pune', 'delivered', 5340, 'Cash', 'Vfast'],
    ['HF12893829', 'Jan 15, 2022', 'Jan 17, 2022', 'Jan 23, 2022', 'Rohan Joshi', '11, Gangapur Road, Nashik', 'Alibaug Warehouse', 'cancelled', 1050, 'Card', 'Vfast'],
    ['HF12893842', 'Jan 14, 2022', 'Jan 16, 2022', 'Jan 22, 2022', 'Mahesh Patil', '39/A, Senpara Parbata, Mumbai', 'Nashik Store, College Rd', 'approved', 760, 'GPay', 'Padhke'],
    ['HF12893855', 'Jan 13, 2022', 'Jan 15, 2022', 'Jan 21, 2022', 'Priyanka More', '5, Baner Road, Baner, Pune', 'Kolhapur Store', 'shipped', 3180, 'COD', 'Vfast']
  ].map(function (r) { return { inv: r[0], cd: r[1], od: r[2], dd: r[3], cust: r[4], addr: r[5], pick: r[6], st: r[7], amt: r[8], pay: r[9], partner: r[10] }; });
  var INVENTORY = [['Polo Shirt - Blue', 4, 100], ['Polo Shirt - Brown', 2, 950], ['Polo Shirt - Black', 5, 2]];
  var STORES = ['Laxmi Road', 'Kothrud', 'Pimpri-Chinchwad', 'Aundh', 'Hadapsar', 'Kolhapur', 'Nashik', 'Sambhaji Nagar', 'Kumthekar Road', 'Camp'];
  var NOTES = ['Top bar: Dashboard, Orders, Customers, New Order and the account menu.', 'Silk banner with the page title and a period selector.', 'Two KPIs, each with its change vs yesterday.', 'Orders and sales trends, each with its own period.', 'Order rate and cycle time use the status colors.', 'Top 10 selling items carousel.', 'Top customers table; a row opens customer details.'];
  var ISSUES = {
    brand: ['high', 'Consistency and standards', "The visual language doesn't match the Jai Hind brand: teal accents, generic type, no logo treatment.", 'Site palette, ZCOOL headings, a black header and navy silk page banners.'],
    account: ['low', 'User control and freedom', 'No visible account menu or log out.', 'An account menu on desktop and an account sheet on mobile, each with Log out.'],
    mobile: ['high', 'Flexibility and efficiency of use', 'No mobile layouts for staff working on the shop floor. Switch the demo to Phone to feel it.', '26 mobile screens: cards, bottom sheets, a tab bar and a sticky cart bar.'],
    data: ['medium', 'Match between system and real world', 'Placeholder data mixes regions: Dhaka delivery zones, +880 and 01600000000 phone numbers.', 'Mumbai and Pune zones, +91 numbers and varied, realistic rows.'],
    rows: ['low', 'Recognition rather than recall', 'Identical repeated rows make tables hard to scan in reviews.', 'Varied sample data, status chips and linked customer names.'],
    tabs: ['high', 'Visibility of system status', 'Order status tabs run off the screen: In-Transit, Delivered and Cancelled are cut off.', 'Tabs with counts sit in the page banner, and become scrollable pills on mobile.']
  };
  var MODE_LABEL = { wire: 'Wireframe', before: 'Before', after: 'After' };

  function line(id, q) {
    var p = PBY[id], gross = p.p * q, d = 0;
    if (p.flat) d = p.flat * q; else if (p.pct) d = Math.round(gross * p.pct) / 100;
    return { gross: gross, disc: d, net: gross - d };
  }
  function cartInfo(cart) {
    var n = 0, sub = 0; Object.keys(cart).forEach(function (k) { n += cart[k]; sub += line(k, cart[k]).net; });
    var adv = Math.min(500, sub + 60);
    return { n: n, sub: sub, del: 60, adv: adv, total: sub + 60 - adv };
  }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }

  /* ── The console ───────────────────────────────────────── */
  var registry = {};

  function Console(root) {
    var d = root.dataset;
    this.root = root;
    this.modes = (d.modes || 'wire,before,after').split(',');
    this.controls = (d.controls || 'mode,device,jump').split(',');
    this.init0 = { view: d.view || 'welcome', mode: d.mode || 'after', device: d.device || 'desktop' };
    this.reset(true);
    this.build();
    if (root.id) registry[root.id] = this;
  }

  Console.prototype.reset = function (silent) {
    this.s = {
      view: this.init0.view, mode: this.init0.mode, device: this.init0.device,
      filter: 'all', q: '', sel: {}, period: "Today's", bar: { orders: 2, sales: 2 }, off: {},
      cart: clone(CART0), cq: '96730', cust: 'C-1713', pq: 'Office casual', step: 'so',
      del: { place: 'Home', addr: 'South Side, Level 6, 18 Kemal Ataturk Avenue, Mumbai-430055', pickup: 'Alibaug Warehouse', partner: 'Padhke', pay: 'Cash on Delivery', notes: 'Gift-wrap the polo shirts. Call the customer 30 minutes before delivery.' },
      orders: clone(ORDERS), counts: clone(COUNTS), customers: clone(CUSTOMERS), seq: 868, fresh: null, placed: null, page: 1
    };
    if (!silent) { this.closeOv(true); this.render(); this.toast('Demo reset.'); }
  };

  Console.prototype.build = function () {
    var self = this, r = this.root, c = '', ctl = this.controls;
    r.classList.add('jh-demo');
    c += '<div class="jh-controls">';
    if (r.dataset.hint) c += '<span class="jh-hint" aria-hidden="true">' + esc(r.dataset.hint) + '</span>';
    if (ctl.indexOf('mode') > -1 && this.modes.length > 1) {
      c += '<div class="jh-seg" role="group" aria-label="Design stage"><span class="jh-seg-l" aria-hidden="true">Show</span>';
      this.modes.forEach(function (m) { c += '<button type="button" data-ctl="mode" data-v="' + m + '" aria-pressed="false">' + MODE_LABEL[m] + '</button>'; });
      c += '</div>';
    }
    if (ctl.indexOf('device') > -1) c += '<div class="jh-seg jh-seg-device" role="group" aria-label="Screen size"><button type="button" data-ctl="device" data-v="desktop" aria-pressed="false">Desktop</button><button type="button" data-ctl="device" data-v="phone" aria-pressed="false">Phone</button></div>';
    if (ctl.indexOf('jump') > -1) c += '<div class="jh-go" role="group" aria-label="Jump to a screen"><button type="button" data-ctl="go" data-v="welcome">Welcome</button><button type="button" data-ctl="go" data-v="dashboard">Dashboard</button><button type="button" data-ctl="go" data-v="orders">Orders</button><button type="button" data-ctl="go" data-v="new">New order</button><button type="button" data-ctl="reset" aria-label="Reset the demo">' + '↺ Reset</button></div>';
    c += '</div>';
    c += '<div class="jh-frame"><div class="jh-chrome" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(r.dataset.url || 'Jai Hind staff console · coded replica · placeholder data') + '</span></div>';
    c += '<div class="jh-vp" role="region" tabindex="0" aria-label="' + esc(r.dataset.label || 'Interactive Jai Hind console, recreated in code') + '"><div class="jh"></div></div>';
    c += '<div class="jh-layer"><div class="jh-ov"></div><div class="jh-toast" role="status" aria-live="polite"></div></div></div>';
    r.innerHTML = c;
    this.vp = r.querySelector('.jh-vp'); this.app = r.querySelector('.jh'); this.layer = r.querySelector('.jh-layer');
    this.ov = r.querySelector('.jh-ov'); this.toastEl = r.querySelector('.jh-toast');
    r.addEventListener('click', function (e) { self.onClick(e); });
    r.addEventListener('input', function (e) { self.onInput(e); });
    r.addEventListener('change', function (e) { self.onChange(e); });
    r.addEventListener('keydown', function (e) { self.onKey(e); });
    r.addEventListener('mouseover', function (e) { self.hover(e, true); });
    r.addEventListener('mouseout', function (e) { self.hover(e, false); });
    r.addEventListener('focusin', function (e) { self.hover(e, true); });
    r.addEventListener('focusout', function (e) { self.hover(e, false); });
    document.addEventListener('click', function (e) { if (self.popOpen && !self.layer.contains(e.target) && !(self._opener && self._opener.contains(e.target))) self.closeOv(true); });
    this.render();
  };

  Console.prototype.render = function (focusKey) {
    var s = this.s, r = this.root, a = document.activeElement;
    var k = focusKey || (a && this.app.contains(a) && a.getAttribute('data-k'));
    r.setAttribute('data-mode', s.mode); r.setAttribute('data-device', s.device);
    this.app.className = 'jh' + (s.mode === 'before' ? ' is-before' : '');
    this.app.innerHTML = this['v_' + s.view]();
    r.querySelectorAll('[data-ctl="mode"],[data-ctl="device"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === s[b.getAttribute('data-ctl')])); });
    r.querySelectorAll('[data-ctl="go"]').forEach(function (b) { if (b.getAttribute('data-v') === s.view) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    if (k) { var el = this.app.querySelector('[data-k="' + k + '"]'); if (el) el.focus({ preventScroll: true }); }
  };

  Console.prototype.go = function (view, opts) {
    opts = opts || {};
    var s = this.s;
    if (s.mode === 'before' && ['dashboard', 'orders'].indexOf(view) < 0) { s.mode = 'after'; }
    s.view = view;
    if (opts.filter) s.filter = opts.filter;
    if (view === 'new' && opts.step) s.step = opts.step;
    if (view === 'new' && !opts.step && s.step === 'done') { s.step = 'so'; }
    this.closeOv(true);
    this.vp.scrollTop = 0;
    this.render('h');
  };

  /* ── Small builders ──────────────────────────────────── */
  Console.prototype.btn = function (a, v, label, cls, k, extra) {
    return '<button type="button"' + attr({ 'class': cls || null, 'data-a': a, 'data-v': v, 'data-k': k || null }) + (extra || '') + '>' + label + '</button>';
  };
  Console.prototype.pin = function (n, style) { return '<button type="button" class="jh-pin note" data-a="pin" data-v="' + n + '" aria-label="Wireframe note ' + n + '" style="' + style + '">' + n + '</button>'; };
  Console.prototype.issue = function (key, style) { return '<button type="button" class="jh-pin issue" data-a="issue" data-v="' + key + '" aria-label="Audit finding: ' + esc(ISSUES[key][2]) + '" style="' + style + '">!</button>'; };
  Console.prototype.chip = function (st) { return '<span class="jh-chip ' + st + '">' + ST[st] + '</span>'; };
  Console.prototype.cust = function () { var id = this.s.cust; return this.s.customers.filter(function (c) { return c.id === id; })[0] || null; };

  Console.prototype.head = function () {
    var s = this.s, b = s.mode === 'before', v = s.view, self = this;
    var nav = b ? [['dashboard', 'Dashboard'], ['orders', 'Orders']] : [['dashboard', 'Dashboard'], ['orders', 'Orders'], ['customers', 'Customers']];
    var h = '<header class="jh-head"><span class="jh-burger" aria-hidden="true">' + ico('menu', 22) + '</span><span class="jh-logo">JAIHIND</span>';
    if (!b) h += '<span class="jh-sub">Staff console</span>';
    h += '<nav class="jh-nav" aria-label="Console">' + nav.map(function (n) { var on = v === n[0] || (v === 'new' && n[0] === 'orders'); return '<button type="button" data-a="go" data-v="' + n[0] + '" data-k="nav-' + n[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + n[1] + '</button>'; }).join('') + '</nav>';
    h += '<div class="jh-head-r">';
    if (!b) h += '<button type="button" class="jh-new" data-a="go" data-v="new" data-k="hnew">' + ico('plus', 14) + 'New Order</button>';
    h += '<button type="button" class="jh-bell" data-a="bell" data-k="bell" aria-label="Notifications, 2 new" aria-haspopup="true">' + ico('bell', 16) + '<span class="dot"></span></button>';
    if (b) h += '<span class="jh-av" aria-hidden="true">PS</span>';
    else h += '<button type="button" class="jh-me" data-a="acct" data-k="acct" aria-haspopup="true" aria-label="Account menu, Priya Sharma"><span class="jh-av" aria-hidden="true">PS</span><span class="who"><b>Priya Sharma</b><small>Store Manager · Laxmi Road</small></span>' + ico('down', 14) + '</button>';
    h += '</div>';
    if (v === 'dashboard') h += self.pin(1, 'left:8px;top:6px');
    h += self.issue('brand', 'left:150px;top:6px') + self.issue('account', 'right:4px;top:4px');
    return h + '</header>';
  };

  Console.prototype.tabbar = function () {
    var v = this.s.view;
    var items = [['dashboard', 'home', 'Home'], ['orders', 'box', 'Orders'], ['new', 'plus', 'New Order'], ['customers', 'users', 'Customers'], ['acct', 'user', 'Account']];
    return '<nav class="jh-tabbar" aria-label="Console, phone">' + items.map(function (t) {
      var on = t[0] === v;
      if (t[0] === 'new') return '<button type="button" class="fab" data-a="go" data-v="new" data-k="tb-new"' + (on ? ' aria-current="page"' : '') + '><i>' + ico('plus', 20) + '</i>New Order</button>';
      if (t[0] === 'acct') return '<button type="button" data-a="acct" data-k="tb-acct">' + ico('user', 20) + 'Account</button>';
      return '<button type="button" data-a="go" data-v="' + t[0] + '" data-k="tb-' + t[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + ico(t[1], 20) + t[2] + '</button>';
    }).join('') + '</nav>';
  };

  Console.prototype.banner = function (o) {
    var h = '<section class="jh-banner">';
    if (o.crumb) h += '<p class="crumb">' + o.crumb + '</p>';
    h += '<h2 class="d-xl" tabindex="-1" data-k="h">' + o.title + (o.titlePin || '') + '</h2><div class="jh-rule" aria-hidden="true"></div>';
    if (o.sub) h += '<p class="bsub">' + o.sub + '</p>';
    if (o.acts) h += '<div class="acts">' + o.acts + '</div>';
    if (o.extra) h += o.extra;
    return h + (o.pins || '') + '</section>';
  };

  /* ── Views ─────────────────────────────────────────────── */
  Console.prototype.v_welcome = function () {
    return '<div class="jh-welcome"><div class="jh-wtop"><span class="jh-logo">JAIHIND</span><span class="jh-tg">Since 1980 · Pune</span></div>' +
      '<div class="jh-whero"><span class="k">Welcome to Jaihind</span><h2 tabindex="-1" data-k="h">Pune’s fashion destination</h2><i></i><p>How would you like to continue?</p></div>' +
      '<div class="jh-doors">' +
      '<div class="jh-door shop"><span class="art">' + ART.shop + '</span><small>For customers</small><h3>Explore the store</h3><p>Browse our collections, brands and 10 stores across Pune, Kolhapur, Nashik and Sambhaji Nagar.</p>' + this.btn('go', 'shop', ico('arrow', 15) + 'Explore the store', 'b light', 'door-shop') + '</div>' +
      '<div class="jh-door staff"><span class="art">' + ART.staff + '</span><small>For the Jaihind team</small><h3>Employee login</h3><p>Sign in to the staff console to manage orders, customers and sales for Jaihind and Mewar stores.</p>' + this.btn('login', '', ico('arrow', 15) + 'Employee login', 'b red', 'door-staff') + '</div>' +
      '</div><p class="jh-wfoot">Jaihind &amp; Mewar · ' + STORES.join(' · ') + '</p></div>';
  };

  Console.prototype.v_shop = function () {
    var cats = [['Ethnic wear', 'linear-gradient(160deg,#7c2433,#3a1219)', ['shirt', '#E8C77A']], ['Formal', 'linear-gradient(160deg,#25365a,#101826)', ['shirt', '#EEF1F5']], ['Blazers & suits', 'linear-gradient(160deg,#3b3f46,#15171b)', ['shirt', '#2A2D33']], ['Office wear', 'linear-gradient(160deg,#3f6ea6,#1c3352)', ['polo', '#C9A27A']]];
    return '<div class="jh-shop"><header class="jh-head"><span class="jh-logo">JAIHIND</span><nav class="jh-nav" aria-label="Shop"><button type="button" aria-current="page">Collections</button><button type="button" data-a="shopnote" data-v="Brands">Brands</button><button type="button" data-a="shopnote" data-v="Stores">Stores</button></nav><div class="jh-head-r">' + this.btn('go', 'welcome', ico('back', 15) + 'Welcome', 'b s light', 'shop-back') + '</div></header>' +
      this.banner({ title: 'Collections', sub: 'Browse by occasion. Every header, menu and footer link is wired on desktop and mobile.' }) +
      '<div class="jh-body"><div class="jh-card"><div class="jh-card-h"><div><h3>Shop by occasion</h3><p class="cap">Placeholder tiles stand in for the brand photography.</p></div></div><div class="jh-cats">' +
      cats.map(function (c) { return '<button type="button" class="jh-cat" data-a="shopnote" data-v="' + esc(c[0]) + '" style="--g:' + c[1] + '">' + garment(c[2]) + '<b>' + esc(c[0]) + '</b></button>'; }).join('') +
      '</div></div><div class="jh-card"><div class="jh-card-h"><div><h3>Our stores</h3><p class="cap">Rohan’s lowest point was working out which store to visit. Tap one.</p></div></div><div class="jh-stores">' +
      STORES.map(function (s) { return '<button type="button" class="jh-store" data-a="store" data-v="' + esc(s) + '">' + ico('pin', 14) + esc(s) + '</button>'; }).join('') + '</div></div></div></div>';
  };

  Console.prototype.v_dashboard = function () {
    var s = this.s, b = s.mode === 'before', self = this;
    var periodSel = '<label class="jh-sel"><span class="sr">Period</span><select data-i="period" data-k="period">' + ["Today's", 'This week', 'This month', 'This year'].map(function (p) { return '<option' + (p === s.period ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select>' + ico('down', 14) + '</label>';
    var acts = this.btn('refresh', 'dash', ico('refresh', 15), 'ib on-dark', 'refresh', ' aria-label="Refresh"') + periodSel;
    var kpi = function (label, ic, value, up, delta) {
      return '<div class="jh-card jh-kpi' + (s.flash ? ' flash' : '') + '"><div class="jh-kpi-top"><span class="jh-kpi-ico">' + ico(ic, 15) + '</span><span class="lbl">' + label + '</span><span class="jh-delta ' + (up ? 'up' : 'down') + '">' + (b ? delta + (up ? ' ↑' : ' ↓') + ' than yesterday' : (up ? '↑ ' : '↓ ') + delta + ' than yesterday') + '</span></div><div class="num-kpi">' + value + '</div></div>';
    };
    var h = this.head();
    h += this.banner({ title: 'Dashboard', sub: 'Store performance overview · ' + (s.period === "Today's" ? 'Sep 18, 2022, 12:00 AM' : s.period + ', to Sep 18, 2022'), acts: acts, pins: (s.view === 'dashboard' ? this.pin(2, 'left:16px;top:14px') : ''), titlePin: this.issue('mobile', '').replace('class="jh-pin issue"', 'class="jh-pin issue inl"') });
    h += '<div class="jh-body">';
    h += '<div class="jh-g2" style="position:relative">' + kpi('Total order count', 'doc', '12,632,129', true, '1.2%') + kpi('Total sales value', 'chart', 'INR 1,687,309.00', false, '0.2%') + this.pin(3, 'left:-10px;top:-10px') + '</div>';
    h += '<div class="jh-g2" style="position:relative">' + this.card('Orders trends', 'Sep 7, 2021 to Sep 7, 2022', this.bars('orders', 'orders'), '<span class="pill">Yearly ' + ico('down', 12) + '</span>') + this.card('Sales trends', 'Sep 7, 2021 to Sep 7, 2022', this.bars('sales', 'in sales'), '<span class="pill">Yearly ' + ico('down', 12) + '</span>') + this.pin(4, 'left:-10px;top:-10px') + '</div>';
    h += '<div class="jh-g2" style="position:relative">' + this.card('Order rate', 'Sep 7, 2021 to Sep 7, 2022 · tap a status to hide it', this.donut(), '<span class="pill">Custom ' + ico('down', 12) + '</span>') + this.card('Order cycle time', 'Average hours per status · tap a bar to open those orders', this.cycle(), '<span class="pill">Yearly ' + ico('down', 12) + '</span>') + this.pin(5, 'left:-10px;top:-10px') + '</div>';
    h += '<div style="position:relative">' + this.card('Top 10 selling items', 'Best sellers by average count this week', this.top(), this.btn('scroll', '-1', ico('left', 15), 'ib', 'sc-l', ' aria-label="Previous items"') + ' ' + this.btn('scroll', '1', ico('right', 15), 'ib dark', 'sc-r', ' aria-label="Next items"')) + this.pin(6, 'left:-10px;top:-10px') + '</div>';
    h += '<div style="position:relative">' + this.card('Top 10 customers', 'Ranked by order frequency · a row opens the customer', this.custTable(6), '<span class="pill">This week ' + ico('down', 12) + '</span>') + this.pin(7, 'left:-10px;top:-10px') + (b ? this.issue('data', 'right:120px;top:12px') + this.issue('rows', 'right:84px;top:12px') : '') + '</div>';
    h += '</div>' + this.tabbar();
    s.flash = false;
    return h;
  };

  Console.prototype.card = function (title, sub, body, right) {
    return '<div class="jh-card"><div class="jh-card-h"><div><h3>' + title + ' <span aria-hidden="true">' + ico('refresh', 13) + '</span></h3><p class="cap">' + sub + '</p></div>' + (right ? '<div style="display:flex;gap:6px;align-items:center">' + right + '</div>' : '') + '</div>' + body + '</div>';
  };

  Console.prototype.bars = function (key, unit) {
    var data = TREND[key], sel = this.s.bar[key], max = 800, h = '<div class="jh-chart"><div class="jh-yax" aria-hidden="true">';
    for (var v = 0; v <= max; v += 100) h += '<span style="bottom:' + (v / max * 100) + '%">' + v + '</span>';
    h += '</div><div class="jh-plot" role="group" aria-label="' + (key === 'orders' ? 'Orders' : 'Sales') + ' by month, choose a month">';
    for (v = 100; v <= max; v += 100) h += '<i class="gl" style="bottom:' + (v / max * 100) + '%" aria-hidden="true"></i>';
    data.forEach(function (val, i) {
      h += '<button type="button" class="jh-col" data-a="bar" data-v="' + key + ':' + i + '" data-k="bar-' + key + i + '" aria-pressed="' + (i === sel) + '" aria-label="' + MONTHS[i] + ', ' + val + ' ' + unit + '" style="--v:' + (val / max * 100).toFixed(1) + '%"><i></i><span class="x" aria-hidden="true">' + MONTHS[i] + '</span><span class="tip" aria-hidden="true">' + MONTHS[i] + ' · ' + val + '</span></button>';
    });
    return h + '</div></div>';
  };

  Console.prototype.donut = function () {
    var s = this.s, on = RATE.filter(function (r) { return !s.off[r[0]]; }), tot = on.reduce(function (a, r) { return a + r[1]; }, 0), C = 2 * Math.PI * 60, acc = 0;
    var segs = RATE.map(function (r) {
      if (s.off[r[0]]) return '';
      var len = tot ? r[1] / tot * C : 0, out = '<circle data-s="' + r[0] + '" cx="85" cy="85" r="60" stroke="var(--st-' + r[0] + ')" stroke-dasharray="' + len.toFixed(2) + ' ' + (C - len).toFixed(2) + '" stroke-dashoffset="' + (-acc).toFixed(2) + '"/>';
      acc += len; return out;
    }).join('');
    var shown = on.length === RATE.length ? '12.6M' : (tot.toFixed(1) + '%');
    var legend = RATE.map(function (r) { return '<button type="button" data-a="seg" data-v="' + r[0] + '" data-k="seg-' + r[0] + '" aria-pressed="' + !s.off[r[0]] + '" style="--c:var(--st-' + r[0] + ')"><i></i><span>' + ST[r[0]] + '</span><b>' + r[1].toFixed(2) + '%</b></button>'; }).join('');
    return '<div class="jh-rate"><div class="jh-donut" role="img" aria-label="Order rate. ' + RATE.map(function (r) { return ST[r[0]] + ' ' + r[1] + ' percent'; }).join(', ') + '"><svg viewBox="0 0 170 170">' + segs + '</svg><div class="mid" aria-hidden="true"><b data-mid>' + shown + '</b><small data-mid-l>' + (on.length === RATE.length ? 'Orders' : 'Shown') + '</small></div></div><div class="jh-legend" role="group" aria-label="Show or hide a status">' + legend + '</div></div>';
  };

  Console.prototype.cycle = function () {
    return '<div class="jh-cycle">' + CYCLE.map(function (c) {
      return '<div class="jh-cyc"><span>' + ST[c[0]] + '</span><div class="track"><button type="button" data-a="cyc" data-v="' + c[0] + '" data-k="cyc-' + c[0] + '" style="--w:' + (c[1] / 1600 * 100).toFixed(1) + '%;--c:var(--st-' + c[0] + ')" aria-label="' + ST[c[0]] + ', ' + c[1] + ' hours on average. Open ' + ST[c[0]] + ' orders">' + c[1] + '</button></div></div>';
    }).join('') + '<div class="jh-axis" aria-hidden="true"><span>0</span><span>400</span><span>800</span><span>1200</span><span>1600</span></div></div>';
  };

  Console.prototype.top = function () {
    return '<div class="jh-scroll" data-scroller tabindex="0" role="list" aria-label="Top selling items, scrolls sideways">' + TOP.map(function (t, i) {
      return '<div class="jh-item" role="listitem"><div class="jh-thumb' + (t.dk ? ' dk' : '') + '"><span class="rank">#' + (i + 1) + '</span>' + garment(t.g) + '</div><b>' + t.n + '</b><small>Average count: ' + t.c + '</small><span class="price">₹ ' + t.p + ' per piece</span></div>';
    }).join('') + '</div>';
  };

  Console.prototype.custTable = function (limit, rowsIn) {
    var b = this.s.mode === 'before', self = this;
    var rows = rowsIn || this.s.customers.slice(0, limit);
    if (b) rows = new Array(limit).join('.').split('.').map(function () { return { id: 'C-1713', n: 'Tanvir Ahmed Anik', ph: '01600000000', addr: '39/A, Senpara Parbata, Mumbai, India', dist: 'Mumbai', f: 4, pay: 'Gpay', same: true }; });
    var t = '<div class="jh-tw"><table class="jh-table"><thead><tr><th scope="col">Customer ID</th><th scope="col">Customer phone</th><th scope="col">Customer name</th><th scope="col">Location</th><th scope="col">District</th><th scope="col">Order frequency</th><th scope="col">Payment method</th></tr></thead><tbody>';
    rows.forEach(function (c, i) {
      t += '<tr' + (b ? '' : ' data-a="cust" data-v="' + c.id + '"') + ' data-t="' + esc((c.id + ' ' + c.n + ' ' + c.dist).toLowerCase()) + '"><td>' + (b ? '<span class="link">' + c.id + '</span>' : '<button type="button" class="link" data-a="cust" data-v="' + c.id + '" data-k="cr-' + c.id + '">' + c.id + '</button>') + '</td><td>' + c.ph + '</td><td class="b6">' + esc(c.n) + '</td><td>' + esc(c.addr) + '</td><td>' + c.dist + '</td><td>' + c.f + '</td><td>' + c.pay + '</td></tr>';
    });
    t += '</tbody></table></div><div class="jh-list">';
    rows.forEach(function (c) {
      t += '<button type="button" class="jh-oc" data-a="cust" data-v="' + c.id + '" data-k="cl-' + c.id + '" data-t="' + esc((c.id + ' ' + c.n + ' ' + c.dist).toLowerCase()) + '"><span class="r"><b>' + esc(c.n) + '</b><b>' + c.f + ' orders</b></span><span class="r"><span class="meta">' + c.id + ' · ' + c.dist + '</span><span class="jh-tg">' + c.pay + '</span></span></button>';
    });
    return t + '</div>';
  };

  Console.prototype.v_customers = function () {
    var h = this.head();
    h += this.banner({ title: 'Customers', sub: 'Everyone who has ordered from your stores. Tap one to edit their details.', acts: this.btn('addcust', '', ico('plus', 14) + 'Add customer', 'b s light', 'addc') });
    h += '<div class="jh-body"><div class="jh-card"><div class="jh-tools"><span class="cap">' + this.s.customers.length + ' customers (sample)</span><label class="jh-search"><span class="sr">Search customers</span>' + ico('search', 15) + '<input type="search" data-i="cfilter" placeholder="Search by name, ID or district" autocomplete="off"></label></div>' + this.custTable(this.s.customers.length, this.s.customers) + '<p class="jh-empty" data-empty hidden>No customers match that search.</p></div></div>';
    return h + this.tabbar();
  };

  Console.prototype.v_orders = function () {
    var s = this.s, b = s.mode === 'before', self = this;
    var tabs = '<div class="jh-tabs" role="group" aria-label="Filter by order status">' + TABS.map(function (t) {
      var label = t === 'all' ? 'All Orders' : ST[t];
      return '<button type="button" class="jh-tab" data-a="tab" data-v="' + t + '" data-k="tab-' + t + '" aria-pressed="' + (s.filter === t) + '">' + label + (b ? ' (' + s.counts[t] + ')' : '') + '<b>' + s.counts[t] + '</b></button>';
    }).join('') + '</div>';
    var acts = this.btn('action', '', ico('more', 15) + 'Action', 'b s ghost-l', 'act', ' aria-haspopup="true"') + this.btn('go', 'new', ico('plus', 14) + '<span class="hide-s">Create Order</span><span class="show-s">Create</span>', 'b s light', 'create');
    var h = this.head();
    h += this.banner({ title: 'Orders', sub: 'Track, approve and dispatch orders across every store', acts: acts, extra: tabs, pins: this.issue('tabs', 'right:12px;bottom:40px') });
    var rows = this.visibleOrders();
    var nsel = Object.keys(s.sel).length;
    h += '<div class="jh-body"><div class="jh-card">';
    h += '<div class="jh-tools"><div class="jh-pager" role="group" aria-label="Pages">' + this.btn('page', 'prev', ico('left', 13), '', 'pg-prev', ' aria-label="Previous page"') + ['1', '2', '3'].map(function (p) { return '<button type="button" data-a="page" data-v="' + p + '" data-k="pg-' + p + '"' + (String(s.page) === p ? ' aria-current="page"' : '') + '>' + p + '</button>'; }).join('') + '<span aria-hidden="true">…</span>' + this.btn('page', '12', '12', '', 'pg-12') + this.btn('page', 'next', ico('right', 13), '', 'pg-next', ' aria-label="Next page"') + this.btn('refresh', 'orders', ico('refresh', 14), '', 'rf', ' aria-label="Refresh orders"') + this.btn('filters', '', ico('sliders', 14), '', 'flt', ' aria-label="More filters"') + '</div>' +
      '<label class="jh-search"><span class="sr">Search invoice or customer</span><input type="search" data-i="q" value="' + esc(s.q) + '" placeholder="Search invoice or customer" autocomplete="off">' + ico('search', 15) + '</label></div>';
    if (nsel && !b) h += '<div class="jh-selbar" role="status"><b>' + nsel + ' selected</b><span style="margin-left:auto"></span>' + this.btn('chg', '', ico('swap', 14) + 'Change status', 'b s light', 'chg') + this.btn('clearsel', '', 'Clear', 'b s ghost-l', 'clr') + '</div>';
    h += this.orderTable(rows) + '<p class="jh-empty" data-empty' + (rows.length ? ' hidden' : '') + '>No orders match. Try another tab or search.</p>';
    h += '</div></div>';
    return h + this.tabbar();
  };

  Console.prototype.visibleOrders = function () {
    var s = this.s;
    if (s.mode === 'before') return new Array(12).join('.').split('.').map(function () { return { inv: 'HF12893712', cd: 'Jan 18, 2022', od: 'Jan 20, 2022', dd: 'Jun 22, 2022', cust: 'Mahadik Raj', addr: 'H 12, Rd 12, Sec 12, Mumbai-1230', pick: 'H 12, Rd 12, Sec 12, Mumbai-1230', st: 'pending', amt: 3456, pay: 'Gpay', partner: 'Vfast', same: true }; });
    return s.orders.filter(function (o) { return s.filter === 'all' || o.st === s.filter; });
  };

  Console.prototype.orderTable = function (rows) {
    var s = this.s, b = s.mode === 'before', self = this, q = s.q.toLowerCase();
    var allSel = rows.length && rows.every(function (o) { return s.sel[o.inv]; });
    var t = '<div class="jh-tw"><table class="jh-table"><thead><tr><th scope="col"><input type="checkbox" class="jh-check" data-a="selall" data-k="selall" aria-label="Select all orders shown"' + (allSel && !b ? ' checked' : '') + '></th><th scope="col">Invoice no</th><th scope="col">Creation date</th><th scope="col">Order date</th><th scope="col">Delivery date</th><th scope="col">Customer name</th><th scope="col">Customer address</th><th scope="col">Pick up address</th><th scope="col">Order status</th><th scope="col">Sales amount</th><th scope="col">Payment</th><th scope="col">Delivery partner</th></tr></thead><tbody>';
    rows.forEach(function (o, i) {
      var txt = (o.inv + ' ' + o.cust).toLowerCase(), hide = q && txt.indexOf(q) < 0 && !b;
      var key = b ? 'b' + i : o.inv;
      t += '<tr class="' + (s.sel[o.inv] && !b ? 'sel' : '') + (s.fresh === o.inv ? ' new' : '') + '" data-a="row" data-v="' + key + '" data-t="' + esc(txt) + '"' + (hide ? ' hidden' : '') + '><td><input type="checkbox" class="jh-check" data-a="sel" data-v="' + o.inv + '" data-k="sel-' + key + '" aria-label="Select ' + o.inv + '"' + (s.sel[o.inv] && !b ? ' checked' : '') + '></td><td><span class="link">' + o.inv + '</span></td><td>' + o.cd + '</td><td>' + o.od + '</td><td>' + o.dd + '</td><td class="b6">' + esc(o.cust) + '</td><td>' + esc(o.addr) + '</td><td>' + esc(o.pick) + '</td><td>' + (b ? 'Pending' : self.chip(o.st)) + '</td><td>' + (b ? 'INR 3456.00' : money(o.amt)) + '</td><td>' + o.pay + '</td><td>' + o.partner + '</td></tr>';
    });
    t += '</tbody></table></div><div class="jh-list">';
    if (!b) rows.forEach(function (o) {
      var txt = (o.inv + ' ' + o.cust).toLowerCase(), hide = q && txt.indexOf(q) < 0;
      t += '<div class="jh-oc' + (s.sel[o.inv] ? ' sel' : '') + '" data-t="' + esc(txt) + '"' + (hide ? ' hidden' : '') + '><span class="r"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" class="jh-check" data-a="sel" data-v="' + o.inv + '" data-k="selc-' + o.inv + '"' + (s.sel[o.inv] ? ' checked' : '') + '><span class="link">' + o.inv + '</span></label>' + self.chip(o.st) + '</span><span class="r"><b>' + esc(o.cust) + '</b><b>' + money(o.amt) + '</b></span><span class="meta">Created ' + o.cd.slice(0, 6) + ' · Order ' + o.od.slice(0, 6) + ' · Delivery ' + o.dd.slice(0, 6) + '</span><span class="route">' + ico('pin', 13) + esc(o.pick) + ' → ' + esc(o.addr) + '</span><span class="r"><span class="jh-tg">' + o.pay + '</span><span class="meta">Partner: ' + o.partner + '</span></span></div>';
    });
    return t + '</div>';
  };

  Console.prototype.steps = function () {
    var st = this.s.step, order = ['so', 'so', 'del', 'chk'], idx = { so: 1, del: 2, chk: 3, done: 4 }[st];
    var names = ['Customer', 'Products', 'Delivery & Payment', 'Checkout'];
    return '<ol class="jh-steps" aria-label="Sales order steps">' + names.map(function (n, i) {
      var cls = i < idx ? 'done' : (i === idx ? 'cur' : '');
      return '<li class="jh-step ' + cls + '"' + (i === idx ? ' aria-current="step"' : '') + '><i>' + (i < idx ? ico('check', 12) : (i + 1)) + '</i><span>' + n + '</span></li>';
    }).join('') + '</ol>';
  };

  Console.prototype.v_new = function () {
    var s = this.s, ci = cartInfo(s.cart), h = this.head(), self = this;
    var titles = { so: 'Create sales order', del: 'Delivery & payment', chk: 'Checkout', done: 'Order placed' };
    var crumbs = { so: 'Orders / New sales order', del: 'Orders / New sales order / Delivery', chk: 'Orders / New sales order / Checkout', done: 'Orders / New sales order' };
    h += this.banner({ crumb: crumbs[s.step], title: titles[s.step], extra: this.steps() });
    h += '<div class="jh-body">' + this['step_' + s.step](ci) + '</div>';
    if (s.step === 'so' || s.step === 'del') h += '<div class="jh-cartbar" role="status">' + ico('cart', 16) + '<span><b>' + ci.n + ' items</b> · ' + money(ci.sub) + '</span>' + this.btn('cart', '', 'View cart ' + ico('right', 13), 'b light', 'cartbar') + '</div>';
    return h + this.tabbar();
  };

  Console.prototype.step_so = function (ci) {
    var s = this.s, c = this.cust(), self = this, q = digits(s.cq), qn = s.cq.trim().toLowerCase();
    var match = function (x) { if (!qn) return false; if (q) return x.key.indexOf(q.slice(0, 5)) === 0 || (q.length >= 5 && q.indexOf(x.key) === 0); return x.n.toLowerCase().indexOf(qn) > -1; };
    var found = (c && match(c)) ? c : (s.customers.filter(match)[0] || null);
    s.cust = found ? found.id : null;
    var left = '<div class="jh-card"><h3 class="h3" style="text-transform:uppercase;letter-spacing:.6px">Customer</h3><p class="cap">Find the shopper by phone number or name</p><label class="jh-field has-ico" style="margin-top:12px"><small>Search customer</small><input type="search" data-i="cq" data-k="cq" value="' + esc(s.cq) + '" autocomplete="off" inputmode="search">' + ico('search', 16) + '</label>';
    if (found) {
      left += '<div class="jh-cust"><div class="row"><div class="jh-kv"><small>Customer ID</small><span class="link">' + found.id + '</span></div>' + (found.vip ? '<span class="jh-chip vip">' + ico('crown', 11) + ' VIP</span>' : '') + '</div><div class="jh-kv"><small>Customer name</small><span>' + esc(found.n) + '</span></div><div class="jh-kv"><small>Mobile number</small><span>' + found.ph + '</span></div><div class="jh-kv"><small>Customer address</small><span>' + esc(found.addr) + '</span></div>' + this.btn('cust', found.id, ico('edit', 14) + 'Edit', 'b s sec', 'editc') + '</div>';
      left += '<h4 class="h3" style="margin-top:16px;text-transform:uppercase">Order history</h4><div class="jh-hist">' + HISTORY.map(function (r) { return '<div><span class="link">' + r[0] + '</span>' + self.chip(r[2]) + '<b>' + money(r[1]) + '</b><small>' + r[3] + '</small></div>'; }).join('') + '</div>';
    } else if (!qn) {
      left += '<div class="jh-none" role="status"><span class="cap">Type a phone number or a name to find the customer.</span></div>';
    } else {
      left += '<div class="jh-none" role="status"><b>No customer found</b><span class="cap">No one matches “' + esc(s.cq) + '”. Add them here and keep the order moving, the caller is waiting.</span>' + this.btn('addcust', '', ico('plus', 14) + 'Add customer', 'b s pri', 'addc2') + '</div>';
    }
    left += '</div>';
    var pq = s.pq.trim().toLowerCase();
    var list = PRODUCTS.filter(function (p) { return !pq || pq === 'office casual' || p.n.toLowerCase().indexOf(pq) > -1; });
    var mid = '<div class="jh-card"><div class="jh-card-h" style="margin-bottom:8px"><div><h3>Products</h3><p class="cap">Add items to this order</p></div>' + this.btn('filters', '', ico('sliders', 14), 'ib', 'pf', ' aria-label="Product filters"') + '</div>' +
      '<label class="jh-field has-ico"><small>Product search</small><input type="search" data-i="pq" data-k="pq" value="' + esc(s.pq) + '" autocomplete="off">' + ico('search', 16) + '</label>' +
      '<div style="display:flex;justify-content:space-between;gap:8px;margin:10px 0 2px"><span class="cap" data-pcount>' + list.length + ' items found' + (s.pq ? ' for “' + esc(s.pq) + '”' : '') + '</span>' + (s.pq ? this.btn('clearpq', '', 'Clear search', 'link', 'clearpq') : '') + '</div>' +
      '<div class="jh-prods">' + list.map(function (p) { return self.prodRow(p); }).join('') + '</div>';
    var ok = ci.n > 0 && !!found;
    mid += '<div class="jh-next">' + (ok ? '' : '<span class="cap" role="status">' + (!found ? 'Find or add a customer to continue.' : 'Add at least one product to continue.') + '</span>') + this.btn('step', 'del', 'Continue to delivery ' + ico('arrow', 15), 'b pri', 'go-del', ok ? '' : ' disabled') + '</div></div>';
    var fab = '<button type="button" class="jh-cartfab" data-a="cart" data-k="cartfab" aria-label="Cart: ' + ci.n + ' items, ' + money(ci.sub) + '. Open cart">' + ico('cart', 18) + '<b>' + ci.n + '</b><small>Items</small><span>' + money(ci.sub) + '</span></button>';
    return '<div class="jh-so">' + left + mid + '<div>' + fab + '</div></div>';
  };

  Console.prototype.prodRow = function (p) {
    var q = this.s.cart[p.id] || 0;
    var ctl = q ? '<span class="jh-stepper" role="group" aria-label="' + esc(p.n) + ' quantity">' + this.btn('qty', p.id + ':-1', ico('minus', 14), '', 'qm-' + p.id, ' aria-label="Remove one ' + esc(p.n) + '"') + '<span aria-live="polite">' + q + ' added</span>' + this.btn('qty', p.id + ':1', ico('plus', 14), '', 'qp-' + p.id, ' aria-label="Add one more ' + esc(p.n) + '"') + '</span>'
      : this.btn('qty', p.id + ':1', ico('cart', 14) + 'Add to Cart', 'jh-add', 'qa-' + p.id, ' aria-label="Add ' + esc(p.n) + ' to cart"');
    return '<div class="jh-prod"><span class="jh-thumb' + (p.dk ? ' dk' : '') + '">' + garment(p.g) + '</span><span class="nm"><b>' + esc(p.n) + '</b><small>' + money(p.p) + '</small></span>' + ctl + '</div>';
  };

  Console.prototype.step_del = function (ci) {
    var s = this.s, d = s.del, c = this.cust() || { n: '', ph: '', addr: '' };
    var uid = this.uid();
    var radio = function (name, val, opts, label) { return '<div class="jh-radios" role="radiogroup" aria-label="' + label + '">' + opts.map(function (o) { return '<label><input type="radio" name="jh-' + name + '-' + uid + '" data-i="del.' + name + '" value="' + esc(o) + '"' + (o === val ? ' checked' : '') + '>' + esc(o) + '</label>'; }).join('') + '</div>'; };
    var sel = function (key, label, opts) { return '<label class="jh-field"><small>' + label + '</small><select data-i="del.' + key + '">' + opts.map(function (o) { return '<option' + (o === d[key] ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label>'; };
    var left = '<div class="jh-card"><div class="jh-card-h"><h3>Customer</h3>' + this.btn('step', 'so', 'Edit', 'link', 'ed1') + '</div><div class="jh-form"><div class="jh-kv"><small>Customer name</small><span>' + esc(c.n) + '</span></div><div class="jh-kv"><small>Mobile number</small><span>' + c.ph + '</span></div></div></div>';
    var mid = '<div class="jh-card"><div class="jh-card-h"><div><h3>Delivery &amp; payment</h3><p class="cap">Prefilled from the customer, change anything</p></div></div><div class="jh-form">' +
      '<div><p class="lbl" style="color:var(--jh-text-2);margin-bottom:6px">Deliver to</p>' + radio('place', d.place, ['Home', 'Work', 'Others'], 'Deliver to') + '</div>' +
      '<label class="jh-field"><small>Delivery address</small><textarea rows="2" data-i="del.addr">' + esc(d.addr) + '</textarea></label>' +
      '<div class="two"><label class="jh-field has-ico"><small>Order date</small><input value="2 Aug, 2024" readonly>' + ico('cal', 15) + '</label>' + sel('pickup', 'Pick-up location', ['Alibaug Warehouse', 'Mumbai Warehouse, Bhiwandi', 'Laxmi Road Store, Pune', 'Kothrud Store, Pune']) + '</div>' +
      '<div class="two">' + sel('partner', 'Preferred delivery partner', ['Padhke', 'Vfast']) + '<div></div></div>' +
      '<div><p class="lbl" style="color:var(--jh-text-2);margin-bottom:6px">Payment method</p>' + radio('pay', d.pay, ['Cash on Delivery', 'UPI', 'GPay', 'Card'], 'Payment method') + '</div>' +
      '<label class="jh-field"><small>Note for the store</small><textarea rows="2" data-i="del.notes">' + esc(d.notes) + '</textarea></label></div>' +
      '<div class="jh-next">' + this.btn('step', 'so', ico('back', 15) + 'Back', 'b sec', 'back-so') + this.btn('step', 'chk', 'Continue to checkout ' + ico('arrow', 15), 'b pri', 'go-chk') + '</div></div>';
    return '<div class="jh-so">' + left + mid + '<div>' + '<button type="button" class="jh-cartfab" data-a="cart" data-k="cartfab2" aria-label="Cart: ' + ci.n + ' items. Open cart">' + ico('cart', 18) + '<b>' + ci.n + '</b><small>Items</small><span>' + money(ci.sub) + '</span></button></div></div>';
  };

  Console.prototype.step_chk = function (ci) {
    var s = this.s, d = s.del, c = this.cust() || { n: '', ph: '', addr: '' }, self = this;
    var kv = function (k, v) { return '<div class="jh-kv"><small>' + k + '</small><span>' + esc(v) + '</span></div>'; };
    var left = '<div style="display:grid;gap:14px"><div class="jh-card"><div class="jh-card-h"><h3>Customer</h3>' + this.btn('step', 'so', 'Edit', 'link', 'ec') + '</div><div class="jh-form">' + kv('Customer name', c.n) + kv('Mobile number', c.ph) + kv('Customer address', c.addr) + '</div></div>' +
      '<div class="jh-card"><div class="jh-card-h"><h3>Delivery</h3>' + this.btn('step', 'del', 'Edit', 'link', 'ed') + '</div><div class="jh-form">' + kv('Delivery address · ' + d.place, d.addr) + kv('Order date', '2 Aug, 2024') + kv('Pick-up location', d.pickup) + kv('Preferred delivery partner', d.partner) + kv('Payment method', d.pay) + '</div></div>' +
      '<div class="jh-card"><div class="jh-card-h"><h3>Notes</h3></div><div class="jh-form">' + kv('Note for the store', d.notes || 'None') + '</div></div></div>';
    var items = Object.keys(s.cart).map(function (id) {
      var p = PBY[id], q = s.cart[id], l = line(id, q);
      var disc = l.disc ? '<small class="disc">' + (p.flat ? '₹ ' + p.flat * q + ' discount applied' : p.pct + '% discount applied') + '</small>' : '';
      return '<li><span class="q">' + q + '</span><span class="jh-thumb' + (p.dk ? ' dk' : '') + '">' + garment(p.g) + '</span><span><b>' + esc(p.n) + '</b><small>Amount: ' + money(p.p) + ' · Qty: ' + q + '</small>' + disc + '</span><span class="amt">' + (l.disc ? '<s>' + money(l.gross) + '</s>' : '') + money(l.net) + '</span></li>';
    }).join('');
    var mid = '<div class="jh-card"><div class="jh-card-h"><div><h3>Order summary</h3><p class="cap">' + ci.n + ' items · Invoice will be generated after placing the order</p></div></div><ul class="jh-sum">' + items + '</ul>' +
      '<div class="jh-tot"><div><span>Subtotal</span><span>' + money(ci.sub) + '</span></div><div><span>Delivery charge (within Mumbai)</span><span>' + money(ci.del) + '</span></div><div><span>Discount</span><span class="minus">- ' + money(0) + '</span></div><div><span>Advance payment</span><span class="plus">- ' + money(ci.adv) + '</span></div></div>' +
      '<div class="jh-pay"><span>Total payable</span><b>' + money(ci.total) + '</b></div>' +
      '<div class="jh-next">' + this.btn('go', 'orders', 'Cancel', 'b sec', 'cancel-o') + this.btn('place', '', ico('check', 15) + 'Place Order', 'b pri', 'place') + '</div></div>';
    return '<div class="jh-so two">' + left + mid + '</div>';
  };

  Console.prototype.step_done = function () {
    var p = this.s.placed || {};
    return '<div class="jh-card"><div class="jh-done" role="status"><span class="big">' + ico('check', 30) + '</span><h3 class="d-m">Order placed</h3><p>Invoice <span class="link">' + esc(p.inv || '') + '</span> lands in <b>Pending</b>, ready for approval. The Pending count on Orders went up by one.</p><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' + this.btn('seeorder', '', 'See it in Orders ' + ico('arrow', 15), 'b pri', 'see') + this.btn('neworder', '', 'Start a new order', 'b sec', 'again') + '</div></div></div>';
  };

  /* ── Overlays: dialogs, drawers, popovers, toast ─────── */
  Console.prototype.toast = function (msg) {
    var t = this.toastEl, self = this;
    t.innerHTML = '<span class="ok">' + ico('check', 13) + '</span><span>' + esc(msg) + '</span>';
    t.classList.add('on'); clearTimeout(this._tt);
    this._tt = setTimeout(function () { t.classList.remove('on'); setTimeout(function () { if (!t.classList.contains('on')) t.innerHTML = ''; }, 400); }, 3800);
  };

  Console.prototype.open = function (html, o) {
    o = o || {};
    this.closeOv(true);
    this._opener = o.opener || document.activeElement;
    this.popOpen = !!o.pop;
    if (o.pop) {
      this.ov.innerHTML = '<div class="jh-pop' + (o.menu ? ' jh-menu' : '') + '" role="dialog" aria-label="' + esc(o.label || 'Details') + '">' + html + '</div>';
      var pop = this.ov.firstChild, lr = this.layer.getBoundingClientRect(), br = this._opener.getBoundingClientRect();
      var w = pop.offsetWidth, hgt = pop.offsetHeight;
      var left = Math.max(12, Math.min(br.left - lr.left + br.width / 2 - w / 2, lr.width - w - 12));
      var top = br.bottom - lr.top + 8;
      if (top + hgt > lr.height - 8) top = Math.max(8, br.top - lr.top - hgt - 8);
      pop.style.left = left + 'px'; pop.style.top = top + 'px';
    } else {
      this.ov.innerHTML = '<div class="jh-scrim' + (o.side ? ' side' : '') + '" data-scrim><div class="jh-dialog" role="dialog" aria-modal="true" aria-labelledby="jh-dlg-' + this.uid() + '" tabindex="-1">' + html.replace('id="dlg-t"', 'id="jh-dlg-' + this._uid + '"') + '</div></div>';
    }
    var f = this.ov.querySelector('[data-first]') || this.ov.querySelector('button, input, select, textarea, [tabindex]');
    if (f) f.focus();
  };
  Console.prototype.uid = function () { this._uid = Math.random().toString(36).slice(2, 8); return this._uid; };
  Console.prototype.closeOv = function (silent) {
    if (!this.ov || !this.ov.innerHTML) return;
    this.ov.innerHTML = ''; this.popOpen = false;
    if (!silent && this._opener && document.body.contains(this._opener)) this._opener.focus();
    else if (!silent) this.vp.focus();
  };
  Console.prototype.dlgHead = function (title) { return '<div class="jh-dlg-h"><h3 id="dlg-t">' + title + '</h3><button type="button" class="jh-x" data-a="close" aria-label="Close">' + ico('x', 14) + '</button></div>'; };

  Console.prototype.openCustomer = function (id, opener) {
    var c = this.s.customers.filter(function (x) { return x.id === id; })[0]; if (!c) return;
    var dists = ['Mumbai', 'Pune', 'Nashik', 'Kolhapur'];
    var html = this.dlgHead('Edit customer') + '<p class="jh-dlg-p">' + c.id + (c.vip ? ' · VIP customer' : '') + ' · ' + c.f + ' orders. Changes save to this customer only.</p><div class="jh-form" style="display:grid;gap:12px">' +
      '<label class="jh-field"><small>Customer name</small><input data-f="n" value="' + esc(c.n) + '" data-first></label>' +
      '<label class="jh-field"><small>Mobile number</small><input value="' + c.ph + '" readonly aria-describedby="phnote"></label><p class="cap" id="phnote" style="margin-top:-6px;color:#656B75;font-size:12px">Numbers are shortened in this demo.</p>' +
      '<label class="jh-field"><small>Customer address</small><textarea rows="2" data-f="addr">' + esc(c.addr) + '</textarea></label>' +
      '<label class="jh-field"><small>District</small><select data-f="dist">' + dists.map(function (d) { return '<option' + (d === c.dist ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="jh-dlg-f"><button type="button" class="b txt" data-a="close">Cancel</button><button type="button" class="b pri" data-a="savecust" data-v="' + c.id + '">' + ico('check', 15) + 'Save changes</button></div>';
    this.open(html, { side: true, opener: opener });
  };

  Console.prototype.openAddCustomer = function (opener) {
    var d = digits(this.s.cq);
    var html = this.dlgHead('Create customer') + '<p class="jh-dlg-p">Add the caller without leaving the order. They’ll be selected as soon as you save.</p><div class="jh-form" style="display:grid;gap:12px">' +
      '<label class="jh-field"><small>Customer name</small><input data-f="n" placeholder="Full name" data-first></label>' +
      '<label class="jh-field"><small>Mobile number</small><input data-f="ph" value="' + (d ? '+91 ' + esc(d.slice(0, 5)) : '+91 ') + '" inputmode="tel"></label>' +
      '<label class="jh-field"><small>Customer address</small><textarea rows="2" data-f="addr" placeholder="House, street, area, city"></textarea></label></div>' +
      '<div class="jh-dlg-f"><button type="button" class="b txt" data-a="close">Cancel</button><button type="button" class="b pri" data-a="createcust">' + ico('plus', 15) + 'Create customer</button></div>';
    this.open(html, { side: true, opener: opener });
  };

  Console.prototype.openCart = function (opener) {
    var s = this.s, ci = cartInfo(s.cart), self = this, ids = Object.keys(s.cart);
    var body = ids.length ? '<ul class="jh-sum">' + ids.map(function (id) {
      var p = PBY[id], q = s.cart[id], l = line(id, q);
      return '<li style="grid-template-columns:44px 1fr auto"><span class="jh-thumb' + (p.dk ? ' dk' : '') + '">' + garment(p.g) + '</span><span><b>' + esc(p.n) + '</b><small>' + money(l.net) + '</small></span><span class="jh-stepper" role="group" aria-label="' + esc(p.n) + ' quantity"><button type="button" data-a="cqty" data-v="' + id + ':-1" aria-label="Remove one ' + esc(p.n) + '">' + ico('minus', 14) + '</button><span>' + q + '</span><button type="button" data-a="cqty" data-v="' + id + ':1" aria-label="Add one more ' + esc(p.n) + '">' + ico('plus', 14) + '</button></span></li>';
    }).join('') + '</ul><div class="jh-tot"><div><b>Subtotal</b><b>' + money(ci.sub) + '</b></div></div>'
      : '<div class="jh-none"><span class="big" style="color:#656B75">' + ico('cart', 28) + '</span><b>No products in cart</b><span class="cap">Search for a product and add it here.</span></div>';
    var html = this.dlgHead('Cart (' + ci.n + ' items)') + '<p class="jh-dlg-p">One cart for the product list, this panel and checkout, so the count always matches.</p>' + body +
      '<div class="jh-dlg-f"><button type="button" class="b sec" data-a="close" data-first>Continue shopping</button>' + (ci.n ? '<button type="button" class="b pri" data-a="cartnext">Continue to delivery ' + ico('arrow', 15) + '</button>' : '') + '</div>';
    this.open(html, { side: true, opener: opener });
  };

  Console.prototype.openChange = function (opener) {
    var s = this.s, inv = Object.keys(s.sel);
    var opts = TABS.slice(1).map(function (t, i) { return '<label class="jh-field" style="display:flex;align-items:center;gap:10px;cursor:pointer"><input type="radio" name="jh-st" value="' + t + '"' + (i === 2 ? ' checked data-first' : '') + ' style="accent-color:#0A1119"><span class="jh-chip ' + t + '">' + ST[t] + '</span></label>'; }).join('');
    var html = this.dlgHead('Change status') + '<p class="jh-dlg-p">' + inv.length + ' order' + (inv.length > 1 ? 's' : '') + ' selected: ' + inv.join(', ') + '. Pick the new status.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' + opts + '</div>' +
      '<div class="jh-dlg-f"><button type="button" class="b txt" data-a="close">Cancel</button><button type="button" class="b pri" data-a="chgnext">Continue ' + ico('arrow', 15) + '</button></div>';
    this.open(html, { opener: opener });
  };

  Console.prototype.openApprove = function (opener) {
    var s = this.s, inv = Object.keys(s.sel);
    var rows = INVENTORY.map(function (r) { var short = r[2] < r[1]; return '<tr><td class="b6">' + r[0] + '</td><td>' + r[1] + ' x Pieces</td><td' + (short ? ' style="color:#B02A2A;font-weight:600"' : '') + '>' + r[2] + ' x Pieces' + (short ? ' (short)' : '') + '</td><td>Mumbai Warehouse</td></tr>'; }).join('');
    var html = this.dlgHead('Approve order') + '<p class="jh-dlg-p">Are you sure you want to approve this order? The inventory will also be updated once this is approved. Once approved, you can add this order to a delivery plan.</p>' +
      '<p class="jh-dlg-p"><b>Invoice no:</b> <span style="color:#B02A2A;font-weight:600">' + esc(inv.join(', ')) + '</span></p>' +
      '<div class="jh-tw" style="margin:0;padding:0;border:1px solid #E7E4DF;border-radius:12px"><table class="jh-table"><caption class="sr">Inventory check</caption><thead><tr><th scope="col">Item name</th><th scope="col">Requested qty</th><th scope="col">Available qty</th><th scope="col">Warehouse</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="jh-warn" role="alert">' + ico('warn', 15) + 'At least one of the products of the selected order is understocked in the inventory.</p>' +
      '<div class="jh-dlg-f"><button type="button" class="b txt" data-a="close">Cancel</button><button type="button" class="b sec" data-a="approve" data-v="sub">Approve and create sub-order</button><button type="button" class="b pri" data-a="approve" data-v="all" data-first>' + ico('check', 15) + 'Approve</button></div>';
    this.open(html, { opener: opener });
  };

  Console.prototype.openPreview = function (to, opener) {
    var s = this.s, inv = Object.keys(s.sel), tot = 0;
    var rows = s.orders.filter(function (o) { return s.sel[o.inv]; }).map(function (o) { tot += o.amt; return '<tr><td><span class="link">' + o.inv + '</span></td><td>' + esc(o.cust) + '</td><td>' + money(o.amt) + '</td></tr>'; }).join('');
    var html = this.dlgHead('Preview') + '<p class="jh-dlg-p">' + inv.length + ' order' + (inv.length > 1 ? 's' : '') + ' will move to <b>' + ST[to] + '</b>. Check the totals before you confirm.</p>' +
      (to === 'transit' ? '<label class="jh-field" style="margin-bottom:12px"><small>Assign delivery partner</small><select data-first><option>Vfast</option><option>Padhke</option></select></label>' : '') +
      '<div class="jh-tw" style="margin:0;padding:0;border:1px solid #E7E4DF;border-radius:12px"><table class="jh-table"><thead><tr><th scope="col">Invoice</th><th scope="col">Customer</th><th scope="col">Amount</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td colspan="2" class="b6" style="padding:11px 10px">Total</td><td class="b6" style="padding:11px 10px">' + money(tot) + '</td></tr></tfoot></table></div>' +
      '<div class="jh-dlg-f"><button type="button" class="b txt" data-a="close">Cancel</button><button type="button" class="b pri" data-a="apply" data-v="' + to + '">' + ico('check', 15) + 'Confirm</button></div>';
    this.open(html, { opener: opener });
  };

  Console.prototype.applyStatus = function (to, note) {
    var s = this.s, n = 0;
    s.orders.forEach(function (o) { if (s.sel[o.inv] && o.st !== to) { s.counts[o.st] = Math.max(0, s.counts[o.st] - 1); s.counts[to] += 1; o.st = to; n++; } });
    var picked = Object.keys(s.sel).length;
    s.sel = {};
    this.closeOv(true); this.render();
    this.toast(note || ('Status updated: ' + picked + ' order' + (picked > 1 ? 's' : '') + ' now ' + ST[to] + '. Tabs and counts refreshed.'));
    var h = this.app.querySelector('[data-k="tab-' + to + '"]') || this.app.querySelector('[data-k="h"]'); if (h) h.focus();
  };

  Console.prototype.pop = function (html, opener, label, menu) { this.open(html, { pop: true, opener: opener, label: label, menu: menu }); };

  /* ── Events ──────────────────────────────────────────── */
  Console.prototype.onClick = function (e) {
    var self = this, s = this.s;
    var ctl = e.target.closest('[data-ctl]');
    if (ctl && this.root.contains(ctl)) {
      var c = ctl.getAttribute('data-ctl'), v = ctl.getAttribute('data-v');
      if (c === 'mode') {
        if (v === 'before' && ['dashboard', 'orders'].indexOf(s.view) < 0) s.view = 'dashboard';
        s.mode = v; this.closeOv(true); this.render();
        this.toast(v === 'before' ? 'Before: the team’s original console. Red pins mark the audit’s findings.' : v === 'wire' ? 'Wireframe: grey boxes first. Blue pins open the file’s notes.' : 'After: the redesign, in Jaihind’s own colors and fonts.');
      } else if (c === 'device') { s.device = v; this.closeOv(true); this.render(); }
      else if (c === 'go') { if (v === 'new' && s.step === 'done') s.step = 'so'; this.go(v); }
      else if (c === 'reset') { this.reset(); }
      return;
    }
    if (e.target.closest('[data-scrim]') === e.target) { this.closeOv(); return; }
    var t = e.target.closest('[data-a]');
    if (!t || !this.root.contains(t)) return;
    var a = t.getAttribute('data-a'), val = t.getAttribute('data-v');
    switch (a) {
      case 'go': if (val === 'new' && s.step === 'done') s.step = 'so'; this.go(val); break;
      case 'login': this.go('dashboard'); this.toast('Signed in as Priya Sharma, Store Manager (demo).'); break;
      case 'shopnote': this.toast(val + ': shoppers browse the site from here. This demo follows the staff door.'); break;
      case 'store': this.toast('Directions to ' + val + ' open in Google Maps. Recommended next: add hours and a Call store button.'); break;
      case 'refresh': s.flash = val === 'dash'; this.render(); this.toast(val === 'dash' ? 'Dashboard refreshed.' : 'Orders refreshed.'); break;
      case 'bar': var p = val.split(':'); s.bar[p[0]] = +p[1]; this.render(); break;
      case 'seg':
        var on = RATE.filter(function (r) { return !s.off[r[0]]; }).length;
        if (!s.off[val] && on === 1) { this.toast('Keep at least one status visible.'); break; }
        s.off[val] = !s.off[val]; this.render(); break;
      case 'cyc': s.filter = val; this.go('orders'); this.toast('Showing ' + ST[val] + ' orders.'); break;
      case 'scroll': var sc = this.app.querySelector('[data-scroller]'); if (sc) sc.scrollBy({ left: (+val) * 320, behavior: reduce ? 'auto' : 'smooth' }); break;
      case 'cust': if (s.mode === 'before') break; e.preventDefault(); this.openCustomer(val, t.closest('button') || t); break;
      case 'row': if (e.target.closest('input,button,label')) break; if (s.mode === 'before') break; var cb = t.querySelector('input[type="checkbox"]'); if (cb) { cb.checked = !cb.checked; this.toggleSel(cb.getAttribute('data-v'), cb.checked, cb.getAttribute('data-k')); } break;
      case 'tab': s.filter = val; s.sel = {}; this.render(); break;
      case 'page': if (val !== '1' && val !== 'prev') this.toast('This demo has one page of sample orders.'); break;
      case 'filters': this.toast('Filters by store, date and payment live here in the file. Not wired in this demo.'); break;
      case 'action':
        var nsel = Object.keys(s.sel).length;
        this.pop('<button type="button" data-a="chg"' + (nsel && s.mode !== 'before' ? '' : ' disabled aria-disabled="true"') + '>' + ico('swap', 15) + 'Change status' + (nsel ? '' : ' <small style="color:#656B75">(select orders first)</small>') + '</button><button type="button" data-a="note" data-v="A challan is ready to print.">' + ico('printer', 15) + 'Print challan</button><button type="button" data-a="note" data-v="Upload a sheet of orders here.">' + ico('upload', 15) + 'Upload orders</button><button type="button" data-a="note" data-v="CSV export started (demo).">' + ico('download', 15) + 'Export as CSV</button><button type="button" data-a="note" data-v="PDF export started (demo).">' + ico('download', 15) + 'Export as PDF</button>', t, 'Order actions', true);
        break;
      case 'note': this.closeOv(); this.toast(val); break;
      case 'sel': break;
      case 'selall': break;
      case 'clearsel': s.sel = {}; this.render(); break;
      case 'chg': if (t.disabled) break; this.openChange(t); break;
      case 'chgnext':
        var picked = this.ov.querySelector('input[name="jh-st"]:checked'); if (!picked) break;
        var to = picked.value;
        if (to === 'approved') this.openApprove(this._opener);
        else if (to === 'transit' || to === 'delivered') this.openPreview(to, this._opener);
        else this.applyStatus(to);
        break;
      case 'approve': this.applyStatus('approved', val === 'sub' ? 'Approved. A sub-order holds 3 × Polo Shirt - Black until stock arrives.' : 'Approved. Inventory updated, ready for a delivery plan.'); break;
      case 'apply': this.applyStatus(val); break;
      case 'close': this.closeOv(); break;
      case 'savecust':
        var c = s.customers.filter(function (x) { return x.id === val; })[0], ov = this.ov;
        if (c) { c.n = ov.querySelector('[data-f="n"]').value.trim() || c.n; c.addr = ov.querySelector('[data-f="addr"]').value.trim() || c.addr; c.dist = ov.querySelector('[data-f="dist"]').value; }
        this.closeOv(); this.render(); this.toast('Changes saved for ' + (c ? c.n : 'the customer') + '.');
        break;
      case 'addcust': this.openAddCustomer(t); break;
      case 'createcust':
        var o2 = this.ov, nm = o2.querySelector('[data-f="n"]').value.trim();
        if (!nm) { var f = o2.querySelector('[data-f="n"]'); f.setAttribute('aria-invalid', 'true'); f.focus(); this.toast('Add a name to create the customer.'); break; }
        var ph = o2.querySelector('[data-f="ph"]').value.trim(), id = 'C-' + (1800 + s.customers.length);
        s.customers.unshift({ id: id, n: nm, ph: ph || '+91', key: digits(ph).replace(/^91/, '').slice(0, 5), addr: o2.querySelector('[data-f="addr"]').value.trim() || 'Address to confirm', dist: 'Pune', f: 0, pay: 'UPI' });
        s.cust = id; s.cq = nm; s.del.addr = s.customers[0].addr;
        this.closeOv(true); if (s.view !== 'new') this.go('new'); else this.render('pq'); this.toast('Customer ' + nm + ' created and selected.');
        break;
      case 'qty': case 'cqty':
        var q = val.split(':'), cur = s.cart[q[0]] || 0, nq = cur + (+q[1]);
        if (nq <= 0) delete s.cart[q[0]]; else s.cart[q[0]] = nq;
        if (a === 'cqty') { this.render(); this.openCart(this._opener); }
        else { var fk = t.getAttribute('data-k'); if (nq === 1 && cur === 0) fk = 'qp-' + q[0]; if (nq === 0) fk = 'qa-' + q[0]; this.render(fk); }
        break;
      case 'clearpq': s.pq = ''; this.render('pq'); break;
      case 'cart': this.openCart(t); break;
      case 'cartnext': this.closeOv(true); s.step = 'del'; this.vp.scrollTop = 0; this.render('h'); break;
      case 'step': if (t.disabled) break; s.step = val; this.vp.scrollTop = 0; this.render('h'); break;
      case 'place':
        var ci = cartInfo(s.cart), cu = this.cust(), inv = 'HF12893' + s.seq; s.seq += 13;
        s.orders.unshift({ inv: inv, cd: 'Aug 02, 2024', od: 'Aug 02, 2024', dd: 'Aug 06, 2024', cust: cu ? cu.n : 'Walk-in', addr: s.del.addr, pick: s.del.pickup, st: 'pending', amt: ci.sub + ci.del, pay: s.del.pay === 'Cash on Delivery' ? 'COD' : s.del.pay, partner: s.del.partner });
        s.counts.all += 1; s.counts.pending += 1; s.fresh = inv; s.placed = { inv: inv }; s.cart = {}; s.step = 'done';
        this.vp.scrollTop = 0; this.render('see'); this.toast('Order ' + inv + ' placed. It lands in Pending.');
        break;
      case 'seeorder': s.filter = 'pending'; this.go('orders'); break;
      case 'neworder': s.cart = clone(CART0); s.step = 'so'; this.go('new', { step: 'so' }); break;
      case 'acct':
        this.pop('<div class="who"><b>Priya Sharma</b><small>Store Manager · Laxmi Road</small></div><hr><button type="button" data-a="note" data-v="Switch between the stores you manage here.">' + ico('store', 15) + 'Switch store</button><button type="button" data-a="logout">' + ico('logout', 15) + 'Log out</button>', t, 'Account', true);
        break;
      case 'logout': this.closeOv(true); this.go('welcome'); this.toast('Logged out. Back to the Welcome screen.'); break;
      case 'bell':
        this.pop('<b class="t">Notifications</b><div class="jh-menu" style="padding:0"><button type="button" data-a="bellflag">' + ico('warn', 15) + 'Flagged orders need a look</button><button type="button" data-a="note" data-v="Polo Shirt - Black is low in Mumbai Warehouse.">' + ico('box', 15) + 'Low stock: Polo Shirt - Black</button></div>', t, 'Notifications');
        break;
      case 'bellflag': s.filter = 'flagged'; this.go('orders'); break;
      case 'pin':
        this.pop('<button type="button" class="jh-x" data-a="close" aria-label="Close note">' + ico('x', 12) + '</button><b class="t">Wireframe note ' + val + '</b><p>' + esc(NOTES[+val - 1]) + '</p>', t, 'Wireframe note ' + val);
        break;
      case 'issue':
        var is = ISSUES[val];
        this.pop('<button type="button" class="jh-x" data-a="close" aria-label="Close finding">' + ico('x', 12) + '</button><b class="t">Audit finding</b><p>' + esc(is[2]) + '</p><span class="sev ' + is[0] + '">' + is[0].charAt(0).toUpperCase() + is[0].slice(1) + ' impact</span><span class="sev low">' + esc(is[1]) + '</span><p style="margin-top:10px"><b>The fix:</b> ' + esc(is[3]) + '</p><p style="margin-top:10px"><button type="button" class="b s pri" data-a="seefix" style="display:inline-flex">See the fix ' + ico('arrow', 14) + '</button></p>', t, 'Audit finding');
        break;
      case 'seefix': s.mode = 'after'; this.closeOv(true); this.render(); this.toast('After: the same screen, redesigned.'); break;
    }
  };

  Console.prototype.toggleSel = function (inv, on, k) {
    if (this.s.mode === 'before') return;
    if (on) this.s.sel[inv] = true; else delete this.s.sel[inv];
    this.render(k);
  };

  Console.prototype.onChange = function (e) {
    var t = e.target, s = this.s;
    if (!this.root.contains(t)) return;
    var a = t.getAttribute('data-a');
    if (a === 'sel') { this.toggleSel(t.getAttribute('data-v'), t.checked, t.getAttribute('data-k')); return; }
    if (a === 'selall') { var rows = this.visibleOrders(), q = s.q.toLowerCase(); rows.forEach(function (o) { var m = !q || (o.inv + ' ' + o.cust).toLowerCase().indexOf(q) > -1; if (m) { if (t.checked) s.sel[o.inv] = true; else delete s.sel[o.inv]; } }); this.render('selall'); return; }
    var i = t.getAttribute('data-i');
    if (i === 'period') { s.period = t.value; s.flash = true; this.render('period'); this.toast('Showing ' + t.value.toLowerCase().replace("today's", 'today') + '. Numbers are placeholders.'); return; }
    if (i && i.indexOf('del.') === 0) { s.del[i.slice(4)] = t.value; }
  };

  Console.prototype.onInput = function (e) {
    var t = e.target, s = this.s, i = t.getAttribute && t.getAttribute('data-i');
    if (!i || !this.root.contains(t)) return;
    if (i === 'q') { s.q = t.value; this.filterRows(s.q, '.jh-table tbody tr, .jh-list .jh-oc'); return; }
    if (i === 'cfilter') { this.filterRows(t.value, '.jh-table tbody tr, .jh-list .jh-oc'); return; }
    if (i === 'cq') { s.cq = t.value; clearTimeout(this._cqT); var self = this; this._cqT = setTimeout(function () { self.render('cq'); var el = self.app.querySelector('[data-k="cq"]'); if (el) { var L = el.value.length; try { el.setSelectionRange(L, L); } catch (x) {} } }, 250); return; }
    if (i === 'pq') { s.pq = t.value; clearTimeout(this._pqT); var me = this; this._pqT = setTimeout(function () { me.render('pq'); var el = me.app.querySelector('[data-k="pq"]'); if (el) { var L = el.value.length; try { el.setSelectionRange(L, L); } catch (x) {} } }, 250); return; }
    if (i.indexOf('del.') === 0) { s.del[i.slice(4)] = t.value; }
  };

  Console.prototype.filterRows = function (q, sel) {
    q = (q || '').trim().toLowerCase(); var n = 0;
    this.app.querySelectorAll(sel).forEach(function (r) { var m = !q || (r.getAttribute('data-t') || '').indexOf(q) > -1; r.hidden = !m; if (m && r.tagName === 'TR') n++; });
    var em = this.app.querySelector('[data-empty]'); if (em) em.hidden = n > 0;
  };

  Console.prototype.hover = function (e, on) {
    var b = e.target.closest && e.target.closest('.jh-legend button');
    if (!b || !this.root.contains(b)) return;
    var k = b.getAttribute('data-v'), d = b.closest('.jh-rate'); if (!d) return;
    var mid = d.querySelector('[data-mid]'), ml = d.querySelector('[data-mid-l]'), s = this.s;
    d.querySelectorAll('circle').forEach(function (c) { c.style.opacity = on && c.getAttribute('data-s') !== k ? '.25' : ''; });
    if (on && !s.off[k]) { var r = RATE.filter(function (x) { return x[0] === k; })[0]; mid.textContent = r[1].toFixed(2) + '%'; ml.textContent = ST[k]; }
    else if (!on) { var all = RATE.every(function (x) { return !s.off[x[0]]; }); mid.textContent = all ? '12.6M' : RATE.filter(function (x) { return !s.off[x[0]]; }).reduce(function (a, x) { return a + x[1]; }, 0).toFixed(1) + '%'; ml.textContent = all ? 'Orders' : 'Shown'; }
  };

  Console.prototype.onKey = function (e) {
    if (e.key === 'Escape' && this.ov.innerHTML) { e.preventDefault(); this.closeOv(); return; }
    if (e.key === 'Tab' && this.ov.querySelector('.jh-dialog')) {
      var f = Array.prototype.slice.call(this.ov.querySelectorAll('button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'));
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  /* ── Boot: build each demo when it nears the screen ──── */
  function boot(el) { if (el.__jh) return; el.__jh = new Console(el); }
  function start() {
    var els = document.querySelectorAll('[data-jh]'), vh = window.innerHeight || 800;
    if (!('IntersectionObserver' in window)) { els.forEach(boot); return; }
    els.forEach(function (el) { if (el.getBoundingClientRect().top < vh + 400) boot(el); });
    var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { boot(en.target); io.unobserve(en.target); } }); }, { rootMargin: '400px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  /* Buttons elsewhere on the page can drive a demo: data-jh-go="#id" data-view data-mode data-device data-step data-do */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-jh-go]'); if (!b) return;
    var el = document.querySelector(b.getAttribute('data-jh-go')); if (!el) return;
    e.preventDefault(); boot(el);
    var c = el.__jh, s = c.s, d = b.dataset;
    if (d.mode) s.mode = d.mode;
    if (d.device) s.device = d.device;
    if (d.filter) s.filter = d.filter;
    if (d.view === 'new') { s.step = d.step || 'so'; if (!Object.keys(s.cart).length) s.cart = clone(CART0); }
    if (d.view) c.go(d.view); else c.render();
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (d.do === 'approve') {
      var first = s.orders.filter(function (o) { return o.st === 'pending'; })[0];
      if (first) { s.filter = 'pending'; s.sel = {}; s.sel[first.inv] = true; c.render(); setTimeout(function () { c.openApprove(el.querySelector('[data-k="h"]')); }, reduce ? 0 : 450); }
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.JHConsole = { boot: boot };
})();
