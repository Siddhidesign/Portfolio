"""JaiHind first sketches on desktop and tablet, drawn to look like pencil on sketchbook paper:
grainy double strokes, overshooting corners, hatched buttons, red-pen notes, a crossed-out idea.
Every screen is redrawn for the case study page from the shipped portal; sample data only.

    python3 jh_sketch.py <font.woff2> <out.webp>
"""
import base64, math, random, sys
from pathlib import Path

INK, RED, PAPER = "#34312c", "#c4402c", "#f6f2e7"
W, H = 1560, 1790
DW, DH = 680, 440          # desktop browser frame
TW, TH = 310, 440          # tablet frame


class Pen:
    def __init__(self, seed):
        self.r = random.Random(seed)
        self.out = []

    def j(self, a=1.0):
        return self.r.uniform(-a, a)

    def path(self, pts, w=1.4, col=INK, op=0.92):
        d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        self.out.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-opacity="{op}" stroke-width="{w:.2f}" stroke-linecap="round" stroke-linejoin="round"/>')

    def _line(self, x1, y1, x2, y2, w, col, op, wob):
        L = math.hypot(x2 - x1, y2 - y1) or 1
        n = max(2, int(L / 11))
        ux, uy = (x2 - x1) / L, (y2 - y1) / L
        nx, ny = -uy, ux
        s0, s1 = self.r.uniform(-1.5, 2.5), self.r.uniform(0.5, 4.5)   # start early, overshoot the end
        bow = self.j(wob * 1.6)                                       # whole stroke bows a little
        pts, drift = [], 0.0
        for i in range(n + 1):
            t = i / n
            drift = drift * 0.75 + self.j(wob * 0.55)
            off = drift + bow * math.sin(math.pi * t)
            pts.append((x1 - ux * s0 + (x2 - x1 + ux * (s0 + s1)) * t + nx * off,
                        y1 - uy * s0 + (y2 - y1 + uy * (s0 + s1)) * t + ny * off))
        self.path(pts, w * self.r.uniform(0.85, 1.15), col, op)

    def line(self, x1, y1, x2, y2, w=1.4, col=INK, op=0.9, wob=1.0, double=True):
        self._line(x1, y1, x2, y2, w, col, op, wob)
        if double and self.r.random() < 0.7:  # a second, lighter pass like a pencil going over it again
            self._line(x1 + self.j(1.2), y1 + self.j(1.2), x2 + self.j(1.2), y2 + self.j(1.2), w * 0.6, col, op * 0.45, wob)

    def rect(self, x, y, w, h, lw=1.4, col=INK, op=0.9):
        self.line(x, y, x + w, y, lw, col, op); self.line(x + w, y, x + w, y + h, lw, col, op)
        self.line(x + w, y + h, x, y + h, lw, col, op); self.line(x, y + h, x, y, lw, col, op)

    def rrect(self, x, y, w, h, r=8, lw=1.3, col=INK, op=0.9, passes=2):
        for k in range(passes):
            pts = []
            for cx, cy, a0 in ((x + w - r, y + r, -90), (x + w - r, y + h - r, 0), (x + r, y + h - r, 90), (x + r, y + r, 180)):
                for d in range(0, 91, 15):
                    a = math.radians(a0 + d)
                    pts.append((cx + r * math.cos(a) + self.j(0.6), cy + r * math.sin(a) + self.j(0.6)))
            pts.append((pts[0][0] + self.r.uniform(2, 7), pts[0][1] + self.j(1.2)))
            self.path(pts, lw if k == 0 else lw * 0.6, col, op if k == 0 else op * 0.45)

    def circle(self, cx, cy, r, lw=1.3, col=INK, op=0.9, turns=1.12):
        a0 = self.r.uniform(0, 6.28); n = 28
        pts = [(cx + (r + self.j(r * 0.06 + 0.5)) * math.cos(a0 + t / n * 6.283 * turns),
                cy + (r + self.j(r * 0.06 + 0.5)) * math.sin(a0 + t / n * 6.283 * turns)) for t in range(n + 1)]
        self.path(pts, lw, col, op)

    def ellipse(self, cx, cy, rx, ry, lw=1.6, col=RED, op=0.85):
        a0 = self.r.uniform(0, 6.28); n = 40
        pts = [(cx + (rx + self.j(3)) * math.cos(a0 + t / n * 7.0), cy + (ry + self.j(2)) * math.sin(a0 + t / n * 7.0)) for t in range(n + 1)]
        self.path(pts, lw, col, op)

    def text(self, x, y, s, size=15, anchor="start", col=INK, rot=1.2, op=0.92, weight=None):
        s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        r = self.j(rot)
        fw = f' font-weight="{weight}"' if weight else ""
        self.out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" fill="{col}" fill-opacity="{op}"{fw} transform="rotate({r:.2f} {x:.1f} {y:.1f})">{s}</text>')

    def squig(self, x, y, w, amp=2.2, lw=1.1, col=INK):
        pts, k, ph = [], 0.0, self.r.uniform(0, 3)
        while k <= w:
            pts.append((x + k, y + amp * math.sin(k / 3.0 + ph) + self.j(0.5)))
            k += 1.5
        self.path(pts, lw, col, 0.8)

    def hatch(self, x, y, w, h, gap=5.5, col=INK, op=0.5):
        """Diagonal pencil shading inside a box, strokes a bit uneven like real hatching."""
        k = -h
        while k < w:
            x1, y1, x2, y2 = x + k, y + h, x + k + h, y
            if x1 < x: y1 -= (x - x1); x1 = x
            if x2 > x + w: y2 += (x2 - (x + w)); x2 = x + w
            if y1 > y and y2 < y + h + 1:
                self._line(x1 + 1, y1 - 1, x2 - 1, y2 + 1, 0.9, col, op, 0.4)
            k += gap + self.j(1.2)

    def xbox(self, x, y, w, h):
        self.rect(x, y, w, h, 1.2)
        self.line(x + 2, y + 2, x + w - 2, y + h - 2, 0.9, double=False)
        self.line(x + w - 2, y + 2, x + 2, y + h - 2, 0.9, double=False)

    def pill(self, x, y, w, label, h=20, size=12, fill=False):
        self.rrect(x, y, w, h, h / 2, 1.1)
        if fill: self.hatch(x + 4, y + 3, w - 8, h - 6, 4, op=0.3)
        self.text(x + w / 2, y + h - 6, label, size, "middle", rot=0.6)

    def btn(self, x, y, w, label, h=26, primary=False, size=14):
        self.rrect(x, y, w, h, 5, 1.4 if primary else 1.2)
        if primary: self.hatch(x + 3, y + 3, w - 6, h - 6, 5, op=0.45)
        self.text(x + w / 2, y + h - 8, label, size, "middle", rot=0.6, weight=700 if primary else None)

    def field(self, x, y, w, ph, h=24, icon=True):
        self.rrect(x, y, w, h, 4, 1.1)
        self.text(x + 8, y + h - 7, ph, 12, rot=0.5, op=0.75)
        if icon: self.circle(x + w - 12, y + h / 2 - 1, 4.5, 1.0); self.line(x + w - 9, y + h / 2 + 2, x + w - 5, y + h / 2 + 6, 1.0, double=False)

    def arrow(self, x1, y1, x2, y2, col=RED, lw=1.6, bend=0.25):
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        cx, cy = mx - (y2 - y1) * bend, my + (x2 - x1) * bend
        pts = [((1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2 + self.j(0.5),
                (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2 + self.j(0.5)) for t in [i / 22 for i in range(23)]]
        self.path(pts, lw, col, 0.85)
        a = math.atan2(y2 - pts[-3][1], x2 - pts[-3][0])
        for s in (2.6, -2.6):
            self.path([(x2 - 11 * math.cos(a + s * 0.17), y2 - 11 * math.sin(a + s * 0.17)), (x2, y2)], lw, col, 0.85)

    def note(self, x, y, lines, size=17, anchor="start"):
        for i, s in enumerate(lines):
            self.text(x, y + i * (size + 3), s, size, anchor, col=RED, rot=2.2, op=0.9)

    def underline(self, x, y, w, col=RED):
        self._line(x, y, x + w, y + self.j(2), 1.5, col, 0.8, 0.8)

    def strike(self, x, y, w, h):
        self._line(x - 6, y - 4, x + w + 6, y + h + 4, 2.4, RED, 0.8, 1.2)
        self._line(x + w + 6, y - 6, x - 6, y + h + 2, 2.4, RED, 0.8, 1.2)

    def smudge(self, cx, cy, rx, ry, op=0.07):
        self.out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{INK}" opacity="{op}" filter="url(#blur)"/>')

    def svg(self):
        return "\n".join(self.out)


# ---------------- frames ----------------
def browser(p, ox, oy, url):
    p.rect(ox, oy, DW, DH, 1.6)
    p.line(ox, oy + 30, ox + DW, oy + 30, 1.2)
    for i in range(3): p.circle(ox + 16 + i * 15, oy + 15, 4.2, 1.1)
    p.rrect(ox + 70, oy + 7, 300, 16, 8, 1.0, passes=1)
    p.text(ox + 82, oy + 20, url, 11, rot=0.3, op=0.6)


def tablet(p, ox, oy):
    p.rrect(ox, oy, TW, TH, 24, 1.7)
    p.rrect(ox + 12, oy + 22, TW - 24, TH - 44, 6, 1.0, passes=1)
    p.circle(ox + TW / 2, oy + 11, 2.6, 1.2)


def topbar(p, x, y, title, tabs=None):
    p.text(x + 6, y + 21, "JAIHIND", 17, weight=700, rot=0.5)
    p.text(x + 96, y + 21, title, 14, rot=0.6)
    if tabs:
        tx = x + 96
        for i, t in enumerate(tabs):
            p.text(tx, y + 21, t, 13, rot=0.5, op=0.85)
            if i == 0: p.underline(tx - 2, y + 27, len(t) * 7.4 + 4, INK)
            tx += len(t) * 7.6 + 22
    p.field(x + 500, y + 4, 148, "search", 22)
    p.line(x - 2, y + 34, x + 658, y + 34, 1.1)


# ---------------- desktop screens (x, y = top-left of content, ~656 x 395) ----------------
def d_home(p, x, y):
    topbar(p, x, y, "", ["Home", "Products", "Customers", "Orders", "Stock", "Timesheet"])
    p.text(x + 8, y + 70, "Good morning, Amit", 22, rot=0.8)
    p.text(x + 8, y + 90, "Laxmi Rd  ·  clocked in 9:58", 12, rot=0.5, op=0.7)
    stats = [("my orders today", "6"), ("customers helped", "14"), ("hours this week", "29.8 h"), ("stock needs sent", "5")]
    for i, (l, v) in enumerate(stats):
        bx = x + 8 + i * 162
        p.rect(bx, y + 104, 150, 66, 1.2)
        p.text(bx + 10, y + 122, l, 12, rot=0.5, op=0.8)
        p.text(bx + 10, y + 154, v, 24, rot=1, weight=700)
    p.rect(x + 8, y + 184, 398, 60, 1.2)
    p.text(x + 18, y + 202, "Quick actions", 14)
    p.btn(x + 18, y + 210, 124, "+ phone order", primary=True, size=13)
    p.btn(x + 150, y + 210, 96, "check stock", size=13); p.btn(x + 254, y + 210, 82, "clock out", size=13)
    p.rect(x + 8, y + 254, 398, 132, 1.2)
    p.text(x + 18, y + 274, "Current orders", 14); p.text(x + 396, y + 274, "view all", 12, "end", op=0.7)
    for k, st in enumerate(("pending", "approved", "in transit", "delivered")):
        yy = y + 288 + k * 24
        p.text(x + 18, yy + 15, f"ORD-48{21 - k * 4:02d}", 12, rot=0.4); p.squig(x + 100, yy + 10, 80, 1.8)
        p.text(x + 214, yy + 15, "Rs", 12, rot=0.4); p.squig(x + 234, yy + 10, 34, 1.6)
        p.pill(x + 300, yy + 1, 90, st, 18, 11)
        if k < 3: p.line(x + 16, yy + 22, x + 396, yy + 22, 0.7, op=0.35, double=False)
    p.rect(x + 418, y + 184, 230, 202, 1.2)
    p.text(x + 428, y + 204, "Check stock", 14); p.text(x + 428, y + 220, "this store first, then 9 more", 11, op=0.7)
    p.field(x + 428, y + 228, 210, "formal shirt, white")
    p.text(x + 430, y + 286, "40", 15, weight=700); p.pill(x + 466, y + 272, 92, "3 here", 18, 11)
    p.text(x + 430, y + 318, "42", 15, weight=700); p.pill(x + 466, y + 304, 160, "0 here · 6 Kothrud", 18, 11)
    p.text(x + 430, y + 346, "ask for a transfer ->", 12, rot=0.6)
    p.underline(x + 430, y + 350, 128, INK)


def d_order(p, x, y):
    topbar(p, x, y, "New phone order")
    labels = ("Customer", "Products", "Delivery", "Review")
    for i, l in enumerate(labels):
        cx = x + 40 + i * 130
        p.circle(cx, y + 60, 11, 1.3)
        if i == 0: p.hatch(cx - 7, y + 53, 14, 14, 3.5, op=0.6)
        p.text(cx, y + 65 if i else y + 65, str(i + 1) if i else "", 12, "middle")
        p.text(cx + 18, y + 65, l, 13, rot=0.5)
        if i < 3: p.line(cx + 86, y + 60, cx + 116, y + 60, 1.0, double=False)
    p.text(x + 8, y + 104, "Customer", 16, weight=700)
    p.field(x + 8, y + 112, 390, "phone: 98220 41 _ _ _")
    p.rect(x + 8, y + 144, 390, 40, 1.1); p.circle(x + 28, y + 164, 9, 1.1)
    p.text(x + 44, y + 160, "Rohan M.", 13); p.squig(x + 44, y + 172, 120, 1.6)
    p.text(x + 8, y + 214, "Items", 16, weight=700); p.text(x + 398, y + 214, "+ add product", 12, "end", op=0.8)
    rows = [("Formal shirt, white  40", "qty 2", "3 here"), ("Slim jeans, black  32", "qty 1", "3 here"), ("Formal shirt, white  42", "qty 1", "0 here · 6 Kothrud")]
    for k, (n, q, s) in enumerate(rows):
        yy = y + 226 + k * 40
        p.line(x + 8, yy, x + 398, yy, 0.8, op=0.4, double=False)
        p.text(x + 10, yy + 24, n, 12, rot=0.4); p.text(x + 170, yy + 24, q, 12, rot=0.4, op=0.8)
        p.pill(x + 214, yy + 9, 130 if k == 2 else 64, s, 18, 11)
        p.text(x + 396, yy + 24, "Rs", 12, "end"); p.squig(x + 352, yy + 30, 30, 1.4)
    p.text(x + 214, y + 368, "request it from Kothrud ->", 12, rot=0.5); p.underline(x + 214, y + 372, 150, INK)
    p.rect(x + 420, y + 92, 228, 230, 1.3)
    p.text(x + 432, y + 114, "Order summary", 14, weight=700)
    for k, l in enumerate(("Items", "Subtotal", "Delivery")):
        p.text(x + 432, y + 142 + k * 24, l, 12, op=0.8); p.squig(x + 580, y + 138 + k * 24, 54, 1.5)
    p.text(x + 432, y + 220, "Delivery", 11, op=0.7)
    for k, l in enumerate(("home", "pick up")):
        p.circle(x + 440 + k * 82, y + 236, 5, 1.0); p.text(x + 450 + k * 82, y + 241, l, 12)
    p.line(x + 430, y + 254, x + 638, y + 254, 1.0)
    p.text(x + 432, y + 278, "Total", 15, weight=700); p.squig(x + 566, y + 273, 70, 2.4, 1.4)
    p.btn(x + 432, y + 290, 204, "Continue ->", primary=True)


def d_approve(p, x, y):
    topbar(p, x, y, "", ["Orders", "Stock + transfers", "Supplier orders", "Staff"])
    for i, t in enumerate(("All", "Pending", "Flagged")): p.pill(x + 8 + i * 74, y + 48, 66, t, 22, 12, fill=(i == 1))
    p.line(x + 8, y + 90, x + 640, y + 90, 1.0)
    for k in range(7):
        yy = y + 98 + k * 40
        p.rect(x + 12, yy + 10, 14, 14, 1.0); p.text(x + 40, yy + 23, f"ORD-47{90 - k * 3}", 12, rot=0.4)
        p.squig(x + 120, yy + 18, 90, 1.7); p.squig(x + 236, yy + 18, 40, 1.5)
        p.line(x + 8, yy + 34, x + 640, yy + 34, 0.6, op=0.3, double=False)
    p.smudge(x + 470, y + 220, 200, 170, 0.06)
    mx, my = x + 318, y + 46
    p.line(mx + 6, my + 342, mx + 336, my + 342, 2.2, op=0.35, double=False)   # drop shadow, pressed harder
    p.line(mx + 336, my + 6, mx + 336, my + 342, 2.2, op=0.35, double=False)
    p.rect(mx, my, 330, 336, 1.6)
    p.text(mx + 14, my + 28, "Approve order", 18, weight=700); p.text(mx + 314, my + 26, "x", 15, "end")
    p.text(mx + 14, my + 48, "ORD-4781  ·  Vikas R.", 12, op=0.75)
    items = [("Polo shirt  M", "in stock"), ("Polo shirt  L", "in stock"), ("Jeans  32", "only 1 left")]
    for k, (n, s) in enumerate(items):
        yy = my + 62 + k * 50
        p.xbox(mx + 14, yy, 36, 36); p.text(mx + 60, yy + 16, n, 13); p.squig(mx + 60, yy + 28, 60, 1.5)
        p.text(mx + 316, yy + 20, s, 12, "end", op=0.85)
    p.rrect(mx + 14, my + 222, 302, 30, 4, 1.3)
    p.text(mx + 24, my + 242, "!  not enough stock: jeans 32 (need 2)", 12)
    p.btn(mx + 14, my + 262, 302, "Approve available items", primary=True, size=13)
    p.btn(mx + 14, my + 298, 302, "Approve + sub-order for the rest", size=13)


def d_bill(p, x, y):
    topbar(p, x, y, "", ["Counter", "Bills", "Returns", "My shift"])
    p.text(x + 8, y + 66, "New bill", 20, weight=700)
    for i, t in enumerate(("Items", "Offers", "Payment", "Done")):
        p.pill(x + 120 + i * 82, y + 50, 72, t, 22, 12, fill=(i == 0))
    p.rect(x + 8, y + 86, 400, 300, 1.2)
    p.field(x + 18, y + 96, 380, "scan, type or tap the mic", icon=True)
    for k in range(5): p.line(x + 26 + k * 3, y + 102, x + 26 + k * 3, y + 114, 0.9, double=False)
    p.text(x + 18, y + 142, "ITEM", 11, op=0.6); p.text(x + 210, y + 142, "QTY", 11, op=0.6); p.text(x + 300, y + 142, "AMOUNT", 11, op=0.6)
    rows = [("Cotton shirting, 2.4 m", "1", "3,600"), ("Kurta, maroon", "1", "2,499")]
    for k, (n, q, a) in enumerate(rows):
        yy = y + 150 + k * 38
        p.line(x + 18, yy, x + 398, yy, 0.8, op=0.4, double=False)
        p.text(x + 18, yy + 24, n, 13, rot=0.4); p.text(x + 214, yy + 24, q, 13); p.text(x + 300, yy + 24, "Rs " + a, 13)
        p.text(x + 396, yy + 24, "remove", 11, "end", op=0.7)
    p.rrect(x + 18, y + 236, 380, 44, 6, 1.1)
    p.text(x + 30, y + 256, "scissors:  kurta needs a hem", 13); p.text(x + 30, y + 272, "slip goes to the tailor after payment", 11, op=0.75)
    p.text(x + 18, y + 308, "Customer", 13, weight=700); p.text(x + 18, y + 328, "found by phone  ·  1,240 points", 12, op=0.8)
    p.squig(x + 18, y + 350, 160, 1.6)
    p.rect(x + 420, y + 86, 228, 300, 1.3)
    p.text(x + 432, y + 108, "Bill summary", 14, weight=700)
    p.text(x + 432, y + 134, "To pay", 14); p.text(x + 636, y + 134, "Rs 6,099", 18, "end", weight=700)
    p.text(x + 432, y + 160, "becomes 2 invoices:", 12, op=0.8)
    p.rect(x + 432, y + 168, 98, 54, 1.1); p.text(x + 440, y + 186, "LLP", 12, weight=700); p.text(x + 440, y + 202, "fabric", 11); p.text(x + 440, y + 216, "Rs 3,600", 11)
    p.rect(x + 538, y + 168, 100, 54, 1.1); p.text(x + 546, y + 186, "Silver Star", 12, weight=700); p.text(x + 546, y + 202, "kurta", 11); p.text(x + 546, y + 216, "Rs 2,499", 11)
    p.text(x + 432, y + 248, "Payment", 12, op=0.8)
    for k, l in enumerate(("cash", "UPI", "card")):
        p.circle(x + 440 + k * 64, y + 266, 5, 1.0); p.text(x + 450 + k * 64, y + 271, l, 12)
    p.hatch(x + 437, y + 261, 7, 9, 2.5, op=0.6)
    p.btn(x + 432, y + 302, 204, "Hold bill", size=13)
    p.btn(x + 432, y + 338, 204, "Take payment", primary=True)


# ---------------- tablet screens (x, y = top-left of the screen, ~286 x 396) ----------------
def t_grid(p, x, y):
    p.text(x + 8, y + 28, "Formal shirt, slim fit", 15, weight=700)
    p.text(x + 8, y + 46, "updated 2 min ago", 11, op=0.7)
    sizes = ("38", "40", "42", "44"); cols = ("white", "sky", "black")
    for i, s in enumerate(sizes): p.text(x + 92 + i * 48, y + 76, s, 13, "middle", weight=700)
    vals = [["2·5", "3·6", "0·6", "1·4"], ["4·2", "1·3", "2·2", "0·1"], ["0·3", "5·5", "3·4", "2·2"]]
    for r, c in enumerate(cols):
        yy = y + 84 + r * 44
        p.text(x + 8, yy + 27, c, 12)
        for i in range(4):
            p.rect(x + 70 + i * 48, yy + 4, 44, 36, 1.0)
            p.text(x + 92 + i * 48, yy + 28, vals[r][i], 12, "middle")
    p.hatch(x + 168, y + 92, 40, 30, 4, op=0.35)
    p.text(x + 8, y + 236, "here · nearest", 10, op=0.65)
    p.line(x + 2, y + 252, x + 284, y + 252, 1.2)
    p.text(x + 10, y + 276, "Hold: white 42", 14, weight=700)
    p.text(x + 10, y + 296, "at Kothrud (6)  ·  for Rohan M.", 12, op=0.85)
    for i, l in enumerate(("1 h", "2 h", "4 h")): p.pill(x + 10 + i * 58, y + 308, 50, l, 22, 12, fill=(i == 1))
    p.btn(x + 10, y + 344, 266, "Hold 2 h  +  tell Kothrud", primary=True, h=30, size=13)


def t_board(p, x, y):
    p.text(x + 8, y + 28, "Tailoring jobs", 15, weight=700)
    p.pill(x + 196, y + 12, 82, "EN | Marathi", 20, 10)
    heads = ("Meas.", "Cut", "Stitch", "Trial", "Ready")
    cw = 54
    for i, h in enumerate(heads):
        cx = x + 6 + i * (cw + 2)
        p.text(cx + cw / 2, y + 60, h, 12, "middle", weight=700)
        p.line(cx, y + 68, cx + cw - 4, y + 68, 1.0, double=False)
        n = (2, 3, 2, 1, 2)[i]
        for k in range(n):
            yy = y + 76 + k * 62
            p.rect(cx, yy, cw - 4, 54, 1.0)
            p.text(cx + 4, yy + 15, f"TJ{11 + i}{k}", 10, op=0.8); p.squig(cx + 4, yy + 28, cw - 14, 1.4); p.squig(cx + 4, yy + 42, cw - 24, 1.3)
    p.out.append("")
    p.rect(x + 66, y + 270, 48, 54, 1.0)
    p.text(x + 70, y + 286, "TJ118", 10, op=0.8); p.squig(x + 70, y + 300, 36, 1.4)
    p.arrow(x + 116, y + 296, x + 172, y + 262, INK, 1.2, 0.2)
    p.text(x + 8, y + 360, "scan the card to move it", 12, op=0.8)


def t_cut(p, x, y):
    p.text(x + 8, y + 28, "Cut fabric", 15, weight=700)
    p.rect(x + 8, y + 42, 74, 74, 1.3)
    rr = random.Random(5)
    for i in range(7):
        for k in range(7):
            if rr.random() < 0.45: p.hatch(x + 13 + i * 9.5, y + 47 + k * 9.5, 8, 8, 2.6, op=0.55)
    p.text(x + 94, y + 62, "BLT-0412", 13, weight=700); p.text(x + 94, y + 80, "linen, sky blue", 12)
    p.text(x + 94, y + 100, "42.5 m on the bolt", 12, op=0.85)
    p.text(x + 8, y + 150, "Cut length", 13, op=0.8)
    p.rrect(x + 8, y + 160, 64, 56, 8, 1.5); p.text(x + 40, y + 198, "-", 30, "middle", weight=700)
    p.rrect(x + 214, y + 160, 64, 56, 8, 1.5); p.text(x + 246, y + 198, "+", 28, "middle", weight=700)
    p.text(x + 143, y + 200, "3.25 m", 26, "middle", weight=700)
    p.text(x + 143, y + 236, "steps of 0.25 m", 11, "middle", op=0.7)
    p.text(x + 8, y + 268, "42.5 m  ->  39.25 m left", 14)
    p.text(x + 8, y + 290, "for: Rohan M.  ·  shirt x 2", 12, op=0.8)
    p.btn(x + 8, y + 316, 270, "Make job card + print QR", primary=True, h=30, size=13)
    p.text(x + 8, y + 372, "low remnant warns before cutting", 11, op=0.7)


def t_wedding(p, x, y):
    p.text(x + 8, y + 28, "Kulkarni family", 16, weight=700)
    p.text(x + 8, y + 46, "Mewar · Kumthekar Rd", 11, op=0.7)
    p.rrect(x + 8, y + 56, 270, 40, 6, 1.4)
    p.text(x + 18, y + 82, "Wedding  ·  Mon, Nov 27", 15, weight=700)
    ev = ("Haldi", "Sangeet", "Wedding")
    p.line(x + 30, y + 122, x + 250, y + 122, 1.1, double=False)
    for i, e in enumerate(ev):
        cx = x + 30 + i * 110
        p.circle(cx, y + 122, 6, 1.2)
        if i == 2: p.hatch(cx - 4, y + 118, 8, 8, 2.5, op=0.7)
        p.text(cx, y + 144, e, 11, "middle")
    p.text(x + 8, y + 174, "Fittings", 13, weight=700)
    for k, (n, d) in enumerate((("groom, 2nd fitting", "Sat"), ("father, final", "Nov 11"))):
        yy = y + 182 + k * 26
        p.rect(x + 10, yy + 4, 12, 12, 1.0); p.text(x + 30, yy + 15, n, 12); p.text(x + 278, yy + 15, d, 12, "end", op=0.8)
    p.text(x + 8, y + 252, "Colour match", 13, weight=700)
    for i in range(4):
        cx = x + 26 + i * 40
        p.circle(cx, y + 274, 13, 1.2)
        p.hatch(cx - 8, y + 266, 16, 16, 2.6 + i * 1.6, op=0.5)
    p.text(x + 8, y + 316, "Designer: embroidered sherwani", 12, weight=700)
    for i in range(5):
        cx = x + 22 + i * 58
        p.circle(cx, y + 336, 6, 1.1)
        if i < 2: p.hatch(cx - 4, y + 332, 8, 8, 2.4, op=0.8)
        if i < 4: p.line(cx + 8, y + 336, cx + 50, y + 336, 0.9, double=False)
    for i, l in enumerate(("sketch", "fabric", "embroid.", "fitting", "ready")):
        p.text(x + 22 + i * 58, y + 358, l, 10, "middle", op=0.8)


# ---------------- page ----------------
def build(font_b64):
    p = Pen(23)
    p.text(60, 58, "wireframes taking shape", 30, rot=0.6, weight=700)
    p.text(62, 86, "the picked ideas, drawn out: desktop for counter + head office, tablet for the floor, cutting table, Mewar", 15, rot=0.4, op=0.75)

    # crossed-out early idea, top right
    ix, iy = 1250, 18
    p.rect(ix, iy, 92, 92, 1.1)
    for k in range(9): p.squig(ix + 8, iy + 10 + k * 9, 70 - (k % 3) * 12, 1.2, 0.9)
    p.strike(ix, iy, 92, 92)
    p.note(ix + 104, iy + 30, ["one long form?", "no! too slow", "on a phone call"], 15)

    rows = [(60, 120), (820, 120), (60, 680), (820, 680)]
    screens = [(d_home, "Staff home", "portal / home"), (d_order, "Phone order, step 1 of 4", "portal / orders / new"),
               (d_approve, "Manager: approve, stock checked", "portal / store-orders"), (d_bill, "Counter: 1 payment, 2 invoices", "portal / counter / bill")]
    for (ox, oy), (fn, label, url) in zip(rows, screens):
        browser(p, ox, oy, url)
        fn(p, ox + 12, oy + 38)
        p.text(ox + DW / 2, oy + DH + 36, label, 19, "middle", rot=0.8)

    ty = 1250
    p.text(60, ty - 22, "tablet", 18, rot=0.8, weight=700); p.underline(60, ty - 16, 60, INK)
    p.text(60, 108, "desktop", 18, rot=0.8, weight=700); p.underline(60, 114, 70, INK)
    tabs = [(t_grid, "Stock grid + 2 h hold"), (t_board, "Tailor job board"), (t_cut, "Fabric cut + QR job card"), (t_wedding, "Mewar wedding profile")]
    for i, (fn, label) in enumerate(tabs):
        ox = 60 + i * 376
        tablet(p, ox, ty)
        fn(p, ox + 12, ty + 22)
        p.text(ox + TW / 2, ty + TH + 36, label, 19, "middle", rot=0.8)

    # red-pen notes and arrows
    p.note(470, 642, ["my work first,", "not company charts"]); p.arrow(560, 646, 470, 290, bend=-0.2)
    p.note(1010, 642, ["stock checked BEFORE", "approval!"]); p.arrow(1150, 640, 1110, 445, bend=0.2)
    p.ellipse(1100, 418, 92, 22)
    p.note(320, 1206, ["catch it here,", "not after it ships"]); p.arrow(440, 1196, 525, 1000, bend=-0.2)
    p.ellipse(536, 982, 170, 24)
    p.note(1240, 1206, ["1 payment,", "2 company invoices"]); p.arrow(1290, 1196, 1290, 920, bend=0.15)
    p.note(60, 1752, ["tap a cell ->", "hold it for the customer"], 16)
    p.note(450, 1752, ["Marathi labels??", "test with tailors"], 16)
    p.arrow(560, 1740, 650, 1300, bend=0.25)
    p.note(830, 1752, ["stepper, no typing", "numbers"], 16)
    p.arrow(940, 1742, 975, 1445, bend=-0.2)
    p.note(1200, 1752, ["date moves ->", "every fitting moves"], 16)
    p.arrow(1320, 1740, 1440, 1320, bend=-0.25)
    p.underline(1200, 1758, 110)

    p.smudge(300, 1100, 180, 30, 0.05); p.smudge(1400, 600, 120, 40, 0.05); p.smudge(800, 40, 160, 22, 0.04)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
<style>@font-face{{font-family:Pen;src:url(data:font/woff2;base64,{font_b64}) format("woff2")}}text{{font-family:Pen}}</style>
<filter id="pencil" x="-2%" y="-2%" width="104%" height="104%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="9" result="g"/>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="mask"/>
  <feComposite in="d" in2="mask" operator="in"/>
</filter>
<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="2"/><feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.22  0 0 0 0 0.18  0 0 0 0.09 0"/></filter>
<filter id="blur"><feGaussianBlur stdDeviation="14"/></filter>
<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#8a9bb0" fill-opacity="0.35"/></pattern>
</defs>
<rect width="{W}" height="{H}" fill="{PAPER}"/>
<rect width="{W}" height="{H}" fill="url(#dots)"/>
<rect width="{W}" height="{H}" filter="url(#paper)"/>
<g filter="url(#pencil)">{p.svg()}</g>
</svg>'''


def render(font_path, out):
    from playwright.sync_api import sync_playwright
    from PIL import Image
    font = base64.b64encode(Path(font_path).read_bytes()).decode()
    svg = build(font)
    png = Path(out).with_suffix(".png")
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        pg.set_content(f"<html><body style='margin:0'>{svg}</body></html>"); pg.wait_for_timeout(700)
        pg.screenshot(path=str(png), full_page=True); b.close()
    Image.open(png).convert("RGB").save(out, "WEBP", quality=84, method=6)
    png.unlink()
    return out


if __name__ == "__main__":
    print(render(sys.argv[1], sys.argv[2]))
