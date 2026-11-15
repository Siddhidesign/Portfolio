"""JaiHind sketches in Siddhi's paper style: black marker on loose sheets of paper on a wooden desk,
one screen per sheet with a handwritten title, and star / heart dot-vote stickers on the picks.
Redrawn for the case study page; sample data only.

    python3 jh_paper.py <font.woff2> <ideas|screens> <out.webp>
"""
import base64, math, random, sys
from pathlib import Path
from jh_sketch import Pen

MK = "#141414"
W = 1800


class Marker(Pen):
    """Felt-tip: one confident stroke, thicker, little wobble, rarely a second pass."""
    def line(self, x1, y1, x2, y2, w=2.1, col=MK, op=0.95, wob=0.95, double=True):
        self._line(x1, y1, x2, y2, w, col, op, wob)
        if double and self.r.random() < 0.12:
            self._line(x1 + self.j(1.5), y1 + self.j(1.5), x2 + self.j(1.5), y2 + self.j(1.5), w * 0.8, col, op * 0.8, wob)

    def rect(self, x, y, w, h, lw=2.1, col=MK, op=0.95):
        super().rect(x, y, w, h, lw, col, op)

    def rrect(self, x, y, w, h, r=8, lw=2.0, col=MK, op=0.95, passes=1):
        super().rrect(x, y, w, h, r, lw, col, op, passes)

    def circle(self, cx, cy, r, lw=2.4, col=MK, op=0.95, turns=1.08):
        super().circle(cx, cy, r, lw, col, op, turns)

    def t(self, x, y, s, size=20, anchor="start", rot=1.5, bold=False):
        s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        r = self.j(rot); sw = 0.9 if bold else 0.25
        self.out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" fill="{MK}" stroke="{MK}" stroke-width="{sw}" stroke-linejoin="round" transform="rotate({r:.2f} {x:.1f} {y:.1f})">{s}</text>')

    def xbox(self, x, y, w, h):
        self.rect(x, y, w, h, 2.2)
        self.line(x + 4, y + 4, x + w - 4, y + h - 4, 2.2, double=False)
        self.line(x + w - 4, y + 4, x + 4, y + h - 4, 2.2, double=False)

    def wave(self, x, y, w, amp=4):
        pts, k, ph = [], 0.0, self.r.uniform(0, 3)
        while k <= w:
            pts.append((x + k, y + amp * math.sin(k / 6.0 + ph) + self.j(0.6))); k += 2
        self.path(pts, 2.2, MK, 0.9)

    def ul(self, x, y, w):
        self._line(x, y, x + w, y + self.j(2), 2.4, MK, 0.95, 0.6)

    def bigx(self, x, y, w, h):
        self._line(x - 4, y - 4, x + w + 4, y + h + 4, 3.6, MK, 0.95, 1.0)
        self._line(x + w + 4, y - 4, x - 4, y + h + 4, 3.6, MK, 0.95, 1.0)

    def loop(self, cx, cy, rx, ry):
        a0 = self.r.uniform(0, 6.28)
        pts = [(cx + (rx + self.j(3)) * math.cos(a0 + i / 40 * 7), cy + (ry + self.j(3)) * math.sin(a0 + i / 40 * 7)) for i in range(41)]
        self.path(pts, 2.8, MK, 0.95)

    def arw(self, x1, y1, x2, y2, bend=0.3):
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        cx, cy = mx - (y2 - y1) * bend, my + (x2 - x1) * bend
        pts = [((1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2) for t in [i / 24 for i in range(25)]]
        self.path(pts, 2.6, MK, 0.95)
        a = math.atan2(y2 - pts[-3][1], x2 - pts[-3][0])
        for s in (1, -1):
            self.path([(x2 - 14 * math.cos(a + s * 0.45), y2 - 14 * math.sin(a + s * 0.45)), (x2, y2)], 2.6, MK, 0.95)


# ---------- scene helpers ----------
def star(cx, cy, r=26, rot=0):
    pts = []
    for i in range(10):
        a = math.radians(-90 + rot + i * 36); rr = r if i % 2 == 0 else r * 0.45
        pts.append(f"{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}")
    p = " ".join(pts)
    return (f'<polygon points="{p}" fill="#000" opacity="0.28" transform="translate(3 4)" filter="url(#sh)"/>'
            f'<polygon points="{p}" fill="#f5c542" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>')


def heart(cx, cy, s=1.0, rot=0):
    d = "M0,10 C-28,-12 -14,-30 0,-16 C14,-30 28,-12 0,10 Z"
    tf = f"translate({cx} {cy}) rotate({rot}) scale({s * 1.25})"
    return (f'<path d="{d}" fill="#000" opacity="0.28" transform="{tf} translate(2 3)" filter="url(#sh)"/>'
            f'<path d="{d}" fill="#ee7d77" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" transform="{tf}"/>')


def sheet(x, y, w, h, rot, body, fill="#fefefc"):
    return (f'<g transform="translate({x} {y}) rotate({rot} {w / 2} {h / 2})">'
            f'<rect x="6" y="9" width="{w}" height="{h}" fill="#000" opacity="0.5" filter="url(#sh2)"/>'
            f'<rect width="{w}" height="{h}" fill="{fill}"/><rect width="{w}" height="{h}" fill="url(#light)"/>'
            f'<g filter="url(#ink)">{body}</g></g>')


def wrap(font_b64, h, inner, W=W):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{h}" viewBox="0 0 {W} {h}">
<defs>
<style>@font-face{{font-family:Pen;src:url(data:font/woff2;base64,{font_b64}) format("woff2")}}text{{font-family:Pen}}</style>
<filter id="wood" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.07" numOctaves="4" seed="11"/>
  <feColorMatrix type="matrix" values="0.30 0 0 0 0.07  0.19 0 0 0 0.04  0.12 0 0 0 0.025  0 0 0 0 1"/>
</filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.0018 0.16" numOctaves="3" seed="3"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.40  0 0 0 0 0.26  0 0 0 0 0.17  0 0 0 1.3 -0.72"/>
</filter>
<filter id="ink" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="6"/><feDisplacementMap in="SourceGraphic" scale="1.3" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="sh"><feGaussianBlur stdDeviation="2.5"/></filter>
<filter id="sh2"><feGaussianBlur stdDeviation="7"/></filter>
<linearGradient id="light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#7a6a55" stop-opacity="0.06"/></linearGradient>
<radialGradient id="vig" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient>
</defs>
<rect width="{W}" height="{h}" fill="#24160f"/>
<rect width="{W}" height="{h}" filter="url(#wood)" opacity="0.85"/>
<rect width="{W}" height="{h}" filter="url(#grain)"/>
{inner}
<rect width="{W}" height="{h}" fill="url(#vig)"/>
</svg>'''


# ---------- screen sheets (local coords) ----------
def desk_frame(p, x, y, w, h):
    p.rect(x, y, w, h); p.line(x, y + 22, x + w, y + 22, 2.2)
    for i in range(3): p.circle(x + 14 + i * 13, y + 11, 3.5, 2)


def s_home(p):
    p.t(24, 44, "Staff Home", 30, bold=True); p.ul(24, 52, 150)
    desk_frame(p, 22, 70, 386, 236)
    p.t(36, 120, "JAIHIND", 17, bold=True)
    for i, t in enumerate(("Home", "Orders", "Stock")): p.t(130 + i * 70, 120, t, 15)
    p.t(36, 150, "Good morning, \"Amit\"", 19)
    for i, v in enumerate(("6", "14", "29h", "5")):
        p.rect(36 + i * 64, 162, 54, 40, 2.2); p.t(50 + i * 64, 192, v, 20, bold=True)
    for k in range(3):
        p.xbox(36, 216 + k * 28, 20, 20); p.line(64, 228 + k * 28, 220, 228 + k * 28, 2)
    p.rect(296, 162, 98, 132, 2.2); p.t(304, 184, "Check", 15); p.t(304, 202, "stock", 15)
    p.t(304, 232, "40  3 here", 12); p.t(304, 256, "42  0 here", 12); p.t(304, 278, "6 Kothrud", 12)


def s_order(p):
    p.t(24, 44, "New Phone Order", 30, bold=True); p.ul(24, 52, 210)
    desk_frame(p, 22, 70, 386, 236)
    for i in range(4):
        p.circle(56 + i * 70, 116, 12)
        p.t(56 + i * 70, 122, str(i + 1), 15, "middle")
        if i < 3: p.line(70 + i * 70, 116, 112 + i * 70, 116, 2)
    p.t(36, 158, "Customer", 17, bold=True); p.rect(36, 166, 220, 26, 2.2); p.t(44, 186, "98220 ...", 14)
    p.t(36, 218, "Items", 17, bold=True)
    for k, s in enumerate(("3 here", "6 Kothrud")):
        p.line(36, 236 + k * 30, 140, 236 + k * 30, 2); p.rrect(150, 222 + k * 30, 90, 22, 10, 2); p.t(160, 238 + k * 30, s, 12)
    p.rect(278, 140, 116, 152, 2.2); p.t(288, 164, "Summary", 15, bold=True)
    p.wave(288, 186, 80); p.wave(288, 208, 60); p.t(288, 240, "Total", 15)
    p.rrect(288, 254, 96, 28, 6, 2.4); p.t(336, 274, "Continue", 13, "middle")


def s_approve(p):
    p.t(24, 44, "Approve Order", 30, bold=True); p.ul(24, 52, 190)
    desk_frame(p, 22, 70, 386, 236)
    for k in range(6): p.rect(36, 106 + k * 30, 14, 14, 2); p.line(58, 114 + k * 30, 170, 114 + k * 30, 2)
    p.rect(190, 92, 206, 206, 2.8); p.t(202, 118, "Approve order", 17, bold=True)
    for k, s in enumerate(("in stock", "in stock", "1 left")):
        p.xbox(202, 130 + k * 34, 26, 26); p.t(236, 148 + k * 34, "Polo" if k < 2 else "Jeans", 14); p.t(386, 148 + k * 34, s, 12, "end")
    p.rect(202, 236, 184, 22, 2); p.t(210, 252, "! not enough stock", 13)
    p.rrect(202, 264, 184, 26, 6, 2.6); p.t(294, 283, "Approve", 14, "middle", bold=True)


def s_bill(p):
    p.t(24, 44, "Counter Bill", 30, bold=True); p.ul(24, 52, 170)
    desk_frame(p, 22, 70, 386, 236)
    p.rect(36, 100, 230, 24, 2); p.t(44, 118, "scan item", 14)
    for k, n in enumerate(("Fabric 2.4m", "Kurta")):
        p.t(40, 152 + k * 28, n, 15); p.t(256, 152 + k * 28, "Rs ~~", 13, "end")
    p.rect(36, 210, 230, 40, 2); p.t(46, 236, "hem -> tailor slip", 14)
    p.rect(284, 100, 112, 196, 2.2); p.t(292, 124, "To pay", 15, bold=True); p.t(292, 148, "Rs 6,099", 15)
    p.t(292, 174, "2 invoices:", 12); p.rect(292, 182, 46, 34, 2); p.t(296, 204, "LLP", 12); p.rect(344, 182, 46, 34, 2); p.t(347, 204, "Silver", 11)
    for k, l in enumerate(("cash", "UPI")): p.circle(300, 234 + k * 20, 5, 2); p.t(312, 239 + k * 20, l, 12)
    p.rrect(292, 264, 96, 26, 6, 2.6); p.t(340, 283, "Pay", 14, "middle", bold=True)


def tab_frame(p, x, y, w, h):
    p.rrect(x, y, w, h, 18, 2.8); p.circle(x + w / 2, y + 12, 3, 2)


def s_grid(p):
    p.t(24, 46, "Stock Grid", 30, bold=True); p.ul(24, 54, 150)
    tab_frame(p, 30, 76, 300, 400)
    p.t(50, 126, "Formal shirt", 18)
    for i, s in enumerate(("38", "40", "42", "44")): p.t(112 + i * 52, 162, s, 16, "middle", bold=True)
    for r, c in enumerate(("wht", "sky", "blk")):
        p.t(48, 198 + r * 50, c, 14)
        for i in range(4): p.rect(88 + i * 52, 172 + r * 50, 46, 40, 2)
    p.t(112, 198, "3", 14, "middle"); p.t(164, 248, "1", 14, "middle"); p.t(216, 198, "0", 14, "middle")
    p.loop(216, 192, 34, 26)
    p.t(50, 352, "Hold at Kothrud", 16)
    p.rrect(50, 372, 260, 38, 8, 2.8); p.t(180, 398, "HOLD 2 h", 18, "middle", bold=True)


def s_board(p):
    p.t(24, 46, "Tailor Board", 30, bold=True); p.ul(24, 54, 170)
    tab_frame(p, 30, 76, 300, 400)
    for i, h in enumerate(("Meas", "Cut", "Stitch", "Trial", "Ready")):
        x = 44 + i * 56
        p.t(x + 24, 124, h, 13, "middle"); p.line(x, 132, x + 48, 132, 2)
        for k in range((2, 3, 1, 2, 1)[i]): p.xbox(x + 4, 144 + k * 56, 40, 46)
    p.arw(110, 352, 170, 300, 0.35)
    p.t(50, 420, "scan card to move it", 15)


def s_cut(p):
    p.t(24, 46, "Cut Fabric", 30, bold=True); p.ul(24, 54, 150)
    tab_frame(p, 30, 76, 300, 400)
    p.rect(50, 106, 74, 74, 2.6)
    rr = random.Random(2)
    for i in range(6):
        for k in range(6):
            if rr.random() < 0.45: p.rect(56 + i * 11, 112 + k * 11, 8, 8, 1.8)
    p.t(136, 130, "Bolt 0412", 16, bold=True); p.t(136, 154, "42.5 m", 16)
    p.rect(50, 214, 62, 62, 2.8); p.t(81, 256, "-", 34, "middle", bold=True)
    p.rect(248, 214, 62, 62, 2.8); p.t(279, 256, "+", 32, "middle", bold=True)
    p.t(180, 256, "3.25 m", 26, "middle", bold=True)
    p.t(50, 318, "-> 39.25 m left", 17)
    p.rrect(50, 372, 260, 38, 8, 2.8); p.t(180, 398, "Make job card", 17, "middle", bold=True)


def s_wedding(p):
    p.t(24, 46, "Mewar Wedding", 30, bold=True); p.ul(24, 54, 200)
    tab_frame(p, 30, 76, 300, 400)
    p.t(50, 124, "Kulkarni family", 19, bold=True)
    p.rect(50, 138, 260, 40, 2.6); p.t(62, 164, "Wedding  Nov 27", 17)
    p.line(70, 214, 290, 214, 2.2)
    for i, e in enumerate(("Haldi", "Sangeet", "Wedding")):
        p.circle(70 + i * 110, 214, 8); p.t(70 + i * 110, 242, e, 13, "middle")
    p.t(50, 284, "Fittings", 16, bold=True)
    for k in range(2): p.rect(50, 296 + k * 26, 16, 16, 2); p.line(76, 306 + k * 26, 230, 306 + k * 26, 2)
    p.t(50, 372, "Colours", 16, bold=True)
    for i in range(4): p.circle(140 + i * 40, 368, 13, 2.4)
    p.t(50, 420, "designer: 2 of 5 done", 14)


# ---------- idea sheets ----------
def mini_desk(p, x, y, w=150, h=96):
    p.rect(x, y, w, h, 2.4); p.line(x, y + 12, x + w, y + 12, 1.8)


def i_home(p):
    p.t(22, 42, "What do I see first?", 26, bold=True); p.ul(22, 50, 240)
    mini_desk(p, 22, 76); p.rect(28, 92, 26, 74, 2); [p.line(66 + i * 14, 160, 66 + i * 14, 160 - h, 3.4) for i, h in enumerate((20, 34, 26, 48, 40, 56))]
    p.bigx(22, 76, 150, 96); p.t(22, 200, "big chart? no", 15)
    mini_desk(p, 196, 76)
    for i in range(4): p.rect(202 + i * 35, 96, 30, 20, 1.8)
    p.rect(202, 124, 92, 40, 1.8); p.rect(300, 124, 40, 40, 1.8); p.t(302, 148, "stk", 11)
    p.loop(271, 124, 98, 64); p.t(196, 214, "my orders + stock", 15)
    mini_desk(p, 370, 76)
    for r in range(3):
        for c in range(4): p.rect(376 + c * 35, 94 + r * 25, 30, 20, 1.6)
    p.bigx(370, 76, 150, 96); p.t(370, 200, "12 tiles? too much", 15)


def i_order(p):
    p.t(22, 42, "One form or steps?", 26, bold=True); p.ul(22, 50, 220)
    p.rect(22, 72, 80, 150, 2.4)
    for k in range(9): p.line(30, 86 + k * 15, 94, 86 + k * 15, 1.8)
    p.bigx(22, 72, 80, 150); p.t(112, 110, "too long", 15); p.t(112, 130, "on a call", 15)
    mini_desk(p, 230, 80)
    for i in range(4):
        p.circle(250 + i * 36, 108, 9, 2)
        if i < 3: p.line(260 + i * 36, 108, 276 + i * 36, 108, 1.8)
    p.rect(238, 126, 90, 42, 1.8); p.rect(334, 126, 40, 42, 1.8)
    p.loop(305, 128, 100, 66); p.t(240, 222, "4 short steps!", 17, bold=True)
    p.t(420, 110, "call", 15); p.arw(450, 104, 480, 104, 0.1); p.t(488, 110, "stock?", 15)
    p.t(420, 160, "check stock", 15); p.t(420, 180, "BEFORE approve", 15, bold=True); p.ul(420, 188, 120)


def i_approve(p):
    p.t(22, 42, "When to check stock?", 26, bold=True); p.ul(22, 50, 240)
    mini_desk(p, 22, 76)
    for k in range(4): p.line(30, 100 + k * 14, 160, 100 + k * 14, 1.8)
    p.rect(110, 150, 54, 16, 1.8); p.bigx(22, 76, 150, 96); p.t(22, 200, "approve, check later?", 15)
    p.arw(186, 124, 222, 124, 0.0)
    mini_desk(p, 236, 76)
    for k in range(4): p.line(244, 100 + k * 14, 300, 100 + k * 14, 1.8)
    p.rect(310, 92, 70, 76, 2.2)
    for k in range(3): p.rect(316, 98 + k * 18, 12, 12, 1.6)
    p.t(316, 164, "!", 14, bold=True)
    p.loop(311, 124, 98, 64); p.t(236, 214, "warn before approve", 15)


def i_tablet(p):
    p.t(22, 42, "Floor + cutting table", 26, bold=True); p.ul(22, 50, 240)
    p.rrect(22, 76, 70, 100, 10, 2.4)
    for k in range(6): p.line(30, 92 + k * 13, 82, 92 + k * 13, 1.8)
    p.bigx(22, 76, 70, 100); p.t(22, 202, "list", 15)
    p.rrect(116, 76, 70, 100, 10, 2.4)
    for r in range(3):
        for c in range(3): p.rect(124 + c * 18, 90 + r * 18, 14, 14, 1.5)
    p.loop(151, 126, 52, 66); p.t(116, 214, "grid!", 16, bold=True)
    p.rrect(226, 76, 70, 100, 10, 2.4)
    for r in range(4):
        for c in range(3): p.rect(234 + c * 18, 92 + r * 18, 14, 14, 1.5)
    p.bigx(226, 76, 70, 100); p.t(214, 202, "keypad = typos", 14)
    p.rrect(330, 76, 70, 100, 10, 2.4); p.t(342, 132, "-", 26, bold=True); p.t(380, 132, "+", 24, bold=True)
    p.loop(365, 126, 52, 66); p.t(324, 214, "stepper!", 16, bold=True)
    p.t(430, 110, "Marathi", 16); p.t(430, 132, "labels?", 16); p.t(440, 160, "?", 34, bold=True)


def sticky(x, y, w, h, rot, lines, seed):
    m = Marker(seed)
    for i, s in enumerate(lines): m.t(16, 42 + i * 28, s, 21)
    return sheet(x, y, w, h, rot, m.svg(), fill="#f6e27a")


def build(font_b64, kind):
    if kind == "screens":
        H = 960
        tops = [(s_home, -2.2), (s_order, 1.4), (s_approve, -0.8), (s_bill, 2.0)]
        bots = [(s_grid, 1.8), (s_board, -1.6), (s_cut, 1.1), (s_wedding, -2.4)]
        inner = ""
        for i, (fn, r) in enumerate(tops):
            p = Marker(100 + i); fn(p); inner += sheet(28 + i * 440, 36, 430, 326, r, p.svg())
        for i, (fn, r) in enumerate(bots):
            p = Marker(200 + i); fn(p); inner += sheet(52 + i * 440, 420, 360, 500, r, p.svg())
        inner += star(420, 62, 30, 8) + star(860, 54, 28, -10) + heart(812, 60, 1.0, -12) + star(1230, 76, 26, 20)
        inner += star(392, 454, 30, -6) + heart(436, 470, 0.95, 14) + star(1270, 450, 28, 12) + heart(1660, 452, 1.0, -8) + star(1706, 470, 26, 4)
        return wrap(font_b64, H, inner)
    H = 860
    inner = ""
    p = Marker(12); p.t(20, 50, "ROUGH IDEAS", 36, bold=True); p.ul(20, 60, 230)
    p.t(20, 100, "thumbnails first,", 21); p.t(20, 128, "crossed out most", 21)
    inner += sheet(44, 26, 380, 160, -1.4, p.svg())
    fns = [(i_home, -1.6), (i_order, 1.2), (i_approve, 1.8), (i_tablet, -1.2)]
    for i, (fn, r) in enumerate(fns):
        p = Marker(300 + i); fn(p)
        x, y = (40 if i % 2 == 0 else 640), (226 if i < 2 else 520)
        inner += sheet(x, y, 570, 260, r, p.svg())
    inner += sticky(470, 40, 230, 150, -3, ["one order record.", "never type", "it twice"], 10)
    inner += sticky(1270, 250, 230, 170, 4, ["most never used", "a work app:", "big buttons,", "plain words"], 9)
    inner += sticky(1290, 520, 230, 170, -2.5, ["tailors read", "Marathi first.", "test labels", "with them!"], 11)
    inner += star(620, 254, 26, 10) + star(1220, 256, 24, -12) + heart(1206, 548, 0.9, 10) + star(612, 546, 24, 6) + star(1240, 540, 22, -4)
    return wrap(font_b64, H, inner, 1550)


def render(font_path, kind, out):
    from playwright.sync_api import sync_playwright
    from PIL import Image
    font = base64.b64encode(Path(font_path).read_bytes()).decode()
    svg = build(font, kind)
    H = int(svg.split('height="')[1].split('"')[0]); Wd = int(svg.split('width="')[1].split('"')[0])
    png = Path(out).with_suffix(".png")
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": Wd, "height": H}, device_scale_factor=1.5)
        pg.set_content(f"<html><body style='margin:0'>{svg}</body></html>"); pg.wait_for_timeout(800)
        pg.screenshot(path=str(png), full_page=True); b.close()
    Image.open(png).convert("RGB").save(out, "WEBP", quality=82, method=6)
    png.unlink()
    return out


if __name__ == "__main__":
    print(render(sys.argv[1], sys.argv[2], sys.argv[3]))
