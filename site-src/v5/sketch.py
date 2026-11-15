"""Pen-on-paper sketch renderer. Draws low-fidelity phone sketches as wobbly SVG lines
with a handwriting font, in the style of the Figma case-study template.
Usage: python3 sketch.py <font.woff2> <out.png>
"""
import base64, math, random, sys
from pathlib import Path

INK = "#2b2b2b"
PW, PH = 250, 500  # phone size


class Pen:
    def __init__(self, seed):
        self.r = random.Random(seed)
        self.out = []

    def j(self, a=0.9):
        return self.r.uniform(-a, a)

    def path(self, pts, w=1.35):
        d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        self.out.append(f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')

    def line(self, x1, y1, x2, y2, w=1.35):
        n = max(2, int(math.hypot(x2 - x1, y2 - y1) / 14))
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        o = self.r.uniform(0.5, 2.2)  # pen overshoot at the end
        pts = []
        drift = 0
        for i in range(n + 1):
            t = i / n
            drift += self.j(0.45)
            drift *= 0.8
            pts.append((x1 + dx * t + nx * drift, y1 + dy * t + ny * drift))
        pts[-1] = (x2 + dx / L * o + self.j(0.6), y2 + dy / L * o + self.j(0.6))
        pts[0] = (pts[0][0] + self.j(0.6), pts[0][1] + self.j(0.6))
        self.path(pts, w)

    def rect(self, x, y, w, h, r=0, lw=1.35):
        if r <= 0:
            self.line(x, y, x + w, y, lw); self.line(x + w, y, x + w, y + h, lw)
            self.line(x + w, y + h, x, y + h, lw); self.line(x, y + h, x, y, lw)
            return
        pts = []
        for cx, cy, a0 in ((x + w - r, y + r, -90), (x + w - r, y + h - r, 0), (x + r, y + h - r, 90), (x + r, y + r, 180)):
            for k in range(0, 91, 15):
                a = math.radians(a0 + k)
                pts.append((cx + r * math.cos(a) + self.j(0.35), cy + r * math.sin(a) + self.j(0.35)))
        pts.append((pts[0][0] + 2 + self.j(), pts[0][1] + self.j()))
        self.path(pts, lw)

    def xbox(self, x, y, w, h):
        self.rect(x, y, w, h)
        self.line(x + 2, y + 2, x + w - 2, y + h - 2, 1.1)
        self.line(x + w - 2, y + 2, x + 2, y + h - 2, 1.1)

    def squig(self, x, y, w, amp=2.2):
        pts, k = [], 0
        while k <= w:
            pts.append((x + k, y + amp * math.sin(k / 3.1) + self.j(0.5)))
            k += 1.6
        self.path(pts, 1.1)

    def circle(self, cx, cy, r, lw=1.3):
        a0 = self.r.uniform(0, 6.28)
        pts = [(cx + (r + self.j(0.5)) * math.cos(a0 + t / 24 * 6.6), cy + (r + self.j(0.5)) * math.sin(a0 + t / 24 * 6.6)) for t in range(25)]
        self.path(pts, lw)

    def text(self, x, y, s, size=17, anchor="start"):
        rot = self.j(1.2)
        self.out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" transform="rotate({rot:.2f} {x:.1f} {y:.1f})">{s}</text>')

    def chev(self, x, y):
        self.path([(x - 4, y - 2), (x, y + 2 + self.j(0.3)), (x + 4, y - 2)], 1.2)

    def arrow(self, x, y, w=16):
        self.line(x, y, x + w, y, 1.2)
        self.path([(x + w - 5, y - 4), (x + w + 1, y), (x + w - 5, y + 4)], 1.2)

    def pin(self, cx, cy):
        self.circle(cx, cy - 6, 5)
        self.path([(cx - 4, cy - 3), (cx, cy + 5), (cx + 4, cy - 3)], 1.2)

    def btn(self, x, y, w, label, h=26, arrow=False):
        self.rect(x, y, w, h, 4)
        self.text(x + w / 2 - (8 if arrow else 0), y + h - 7, label, 17, "middle")
        if arrow: self.arrow(x + w / 2 + len(label) * 3 + 2, y + h / 2)

    def field(self, x, y, w, label, val=None, drop=False):
        self.text(x, y, label, 15)
        if val: self.text(x + 2, y + 20, val, 16)
        self.line(x, y + 26, x + w, y + 26, 1.2)
        if drop: self.chev(x + w - 8, y + 15)

    def svg(self):
        return "\n".join(self.out)


def phone(p, ox, oy):
    p.rect(ox, oy, PW, PH, 26, 1.6)
    p.rect(ox + 6, oy + 6, PW - 12, PH - 12, 21, 1.1)
    p.line(ox + PW / 2 - 22, oy + 15, ox + PW / 2 + 12, oy + 15, 2.4)
    p.circle(ox + PW / 2 + 22, oy + 15, 2, 1.6)
    for yy in (110, 150):
        p.line(ox - 2, oy + yy, ox - 2, oy + yy + 26, 2.2)


def nav(p, x, y):
    p.line(x + 10, y, x + PW - 30, y, 1.1)
    for i, cx in enumerate((32, 72, 112, 152, 192)):
        if i == 2:
            p.circle(x + cx, y + 18, 13); p.text(x + cx, y + 24, "+", 22, "middle")
        else:
            p.rect(x + cx - 7, y + 12, 14, 12, 2, 1.1)


# Each screen draws inside the phone; (x, y) is the top-left of the screen area.
def s_dashboard(p, x, y):
    p.text(x + 4, y + 46, "JAIHIND", 22); p.circle(x + 196, y + 40, 8)
    p.text(x + 4, y + 82, "Dashboard", 22); p.rect(x + 140, y + 66, 64, 22, 10); p.text(x + 150, y + 82, "Today", 15); p.chev(x + 194, y + 77)
    p.rect(x + 4, y + 100, 200, 66, 6); p.text(x + 14, y + 120, "Total order count", 15); p.squig(x + 14, y + 146, 90, 3.2)
    p.rect(x + 4, y + 176, 200, 66, 6); p.text(x + 14, y + 196, "Total sales value", 15); p.squig(x + 14, y + 222, 110, 3.2)
    p.rect(x + 4, y + 252, 200, 130, 6); p.text(x + 14, y + 272, "Orders trends", 15); p.chev(x + 190, y + 268)
    for i, h in enumerate((30, 40, 26, 46, 80, 50, 58)):
        p.rect(x + 22 + i * 25, y + 368 - h, 12, h, 0, 1.1)
    p.line(x + 16, y + 368, x + 196, y + 368, 1.1)
    nav(p, x, y + 400)


def s_orders(p, x, y):
    p.text(x + 4, y + 46, "Orders", 22); p.rect(x + 146, y + 30, 58, 22, 10); p.text(x + 156, y + 46, "+ new", 15)
    for i, t in enumerate(("All", "Pending", "Flagged")):
        p.rect(x + 4 + i * 66, y + 64, 60, 22, 10); p.text(x + 34 + i * 66, y + 80, t, 15, "middle")
    p.rect(x + 4, y + 96, 200, 26, 4); p.circle(x + 16, y + 109, 5); p.text(x + 28, y + 115, "search invoice", 15)
    for k in range(4):
        yy = y + 136 + k * 64
        p.rect(x + 4, yy, 200, 56, 5); p.text(x + 12, yy + 18, "#HF", 15); p.squig(x + 40, yy + 13, 50)
        p.squig(x + 12, yy + 36, 80); p.rect(x + 140, yy + 8, 56, 18, 8); p.squig(x + 148, yy + 17, 38, 1.6)
    nav(p, x, y + 400)


def s_approve(p, x, y):
    p.text(x + 4, y + 46, "Orders", 22)
    for k in range(2): p.squig(x + 10, y + 80 + k * 22, 160)
    p.line(x - 2, y + 130, x + 210, y + 130, 1.2)
    p.text(x + 8, y + 158, "Approve order", 20); p.text(x + 196, y + 156, "x", 16)
    for k, n in enumerate(("Polo shirt", "Polo shirt", "Jeans")):
        yy = y + 178 + k * 46
        p.xbox(x + 8, yy, 30, 30); p.text(x + 46, yy + 14, n, 15); p.squig(x + 46, yy + 27, 50, 1.6)
        p.text(x + 200, yy + 14, "avail", 14, "end"); p.squig(x + 164, yy + 27, 34, 1.6)
    p.rect(x + 8, y + 318, 192, 22, 3); p.text(x + 16, y + 334, "! not enough stock", 15)
    p.btn(x + 8, y + 352, 192, "Approve")
    p.btn(x + 8, y + 386, 192, "Approve + sub-order")


def s_customer(p, x, y):
    p.text(x + 4, y + 44, "<-  New sales order", 18)
    p.text(x + 4, y + 70, "step 1 of 4", 14); p.line(x + 4, y + 78, x + 204, y + 78, 1); p.line(x + 4, y + 79, x + 54, y + 79, 2.6)
    p.text(x + 4, y + 108, "Customer", 20)
    p.rect(x + 4, y + 120, 200, 28, 4); p.text(x + 12, y + 139, "phone or name", 15); p.circle(x + 190, y + 133, 5)
    p.rect(x + 20, y + 170, 168, 110, 6); p.circle(x + 104, y + 202, 12); p.text(x + 104, y + 236, "No customer found", 16, "middle")
    p.btn(x + 50, y + 246, 108, "+ Add customer")
    p.text(x + 4, y + 312, "Products", 20); p.rect(x + 4, y + 324, 200, 28, 4); p.squig(x + 12, y + 338, 70)
    p.line(x - 2, y + 430, x + 210, y + 430, 1.2); p.text(x + 8, y + 456, "0 items", 16); p.text(x + 196, y + 456, "view cart >", 16, "end")


def s_products(p, x, y):
    p.text(x + 4, y + 44, "<-  New sales order", 18)
    p.text(x + 4, y + 70, "step 2 of 4", 14); p.line(x + 4, y + 78, x + 204, y + 78, 1); p.line(x + 4, y + 79, x + 104, y + 79, 2.6)
    p.text(x + 4, y + 106, "Products", 20)
    p.rect(x + 4, y + 116, 200, 26, 4); p.text(x + 12, y + 134, "search products", 15)
    for k in range(4):
        yy = y + 154 + k * 62
        p.xbox(x + 6, yy, 44, 44); p.squig(x + 60, yy + 10, 60); p.text(x + 60, yy + 34, "Rs", 15); p.squig(x + 78, yy + 30, 26, 1.6)
        p.btn(x + 134, yy + 12, 70, "add +", 22)
    p.line(x - 2, y + 430, x + 210, y + 430, 1.2); p.text(x + 8, y + 456, "3 items", 16); p.text(x + 196, y + 456, "view cart >", 16, "end")


def s_newcust(p, x, y):
    p.text(x + 4, y + 44, "<-  Create customer", 18)
    p.text(x + 4, y + 66, "caller stays on the line", 13)
    p.field(x + 4, y + 90, 200, "Phone number *", "+91 _ _ _ _")
    p.field(x + 4, y + 140, 200, "Customer name *", "Manohar")
    p.field(x + 4, y + 190, 200, "Address")
    p.xbox(x + 4, y + 236, 200, 92); p.pin(x + 104, y + 286)
    for i, t in enumerate(("Home", "Work", "Other")):
        p.circle(x + 12 + i * 66, y + 346, 5); p.text(x + 22 + i * 66, y + 352, t, 15)
    p.btn(x + 4, y + 384, 94, "Clear"); p.btn(x + 110, y + 384, 94, "Create")


def s_delivery(p, x, y):
    p.text(x + 4, y + 44, "<-  Delivery & payment", 18)
    p.text(x + 4, y + 70, "step 3 of 4", 14); p.line(x + 4, y + 78, x + 204, y + 78, 1); p.line(x + 4, y + 79, x + 154, y + 79, 2.6)
    p.field(x + 4, y + 104, 200, "Pick up location", "Mumbai warehouse", drop=True)
    p.field(x + 4, y + 154, 200, "Delivery partner", None, drop=True)
    p.field(x + 4, y + 204, 200, "Order date", "2 Aug")
    p.text(x + 4, y + 260, "Payment", 15)
    for i, t in enumerate(("Cash", "UPI", "Card")):
        p.circle(x + 12 + i * 66, y + 280, 5); p.text(x + 22 + i * 66, y + 286, t, 15)
    p.line(x + 4, y + 306, x + 204, y + 306, 1)
    p.text(x + 4, y + 328, "Subtotal", 15); p.squig(x + 150, y + 323, 50, 1.6)
    p.text(x + 4, y + 350, "Delivery", 15); p.squig(x + 150, y + 345, 50, 1.6)
    p.btn(x + 4, y + 384, 94, "Back"); p.btn(x + 110, y + 384, 94, "Checkout", arrow=False)


def s_review(p, x, y):
    p.text(x + 4, y + 44, "<-  Checkout", 18)
    p.text(x + 4, y + 70, "step 4 of 4", 14); p.line(x + 4, y + 78, x + 204, y + 78, 1); p.line(x + 4, y + 79, x + 204, y + 79, 2.6)
    for k, t in enumerate(("Customer", "Delivery", "Items")):
        yy = y + 96 + k * 82
        p.text(x + 4, yy + 16, t, 17); p.text(x + 204, yy + 16, "edit", 14, "end")
        p.rect(x + 4, yy + 24, 200, 50, 5); p.squig(x + 14, yy + 40, 110); p.squig(x + 14, yy + 60, 70)
    p.field(x + 4, y + 352, 200, "Notes")
    p.btn(x + 4, y + 394, 200, "Place order", arrow=False)


SCREENS = [s_dashboard, s_orders, s_approve, s_customer, s_products, s_newcust, s_delivery, s_review]
LABELS = ["Dashboard", "Orders by status", "Approve, stock checked", "1. Customer",
          "2. Products", "Add customer mid-order", "3. Delivery & payment", "4. Review"]


def build(font_b64, cols=4, screens=None, labels=None):
    screens = screens or SCREENS; labels = labels or LABELS
    gap_x, gap_y, pad = 60, 84, 50
    rows = math.ceil(len(screens) / cols)
    W = pad * 2 + cols * PW + (cols - 1) * gap_x
    H = pad * 2 + rows * (PH + gap_y) - gap_y + 30
    p = Pen(7)
    for i, fn in enumerate(screens):
        cx, cy = i % cols, i // cols
        ox = pad + cx * (PW + gap_x); oy = pad + cy * (PH + gap_y)
        phone(p, ox, oy)
        fn(p, ox + 21, oy + 22)
        p.text(ox + PW / 2, oy + PH + 34, labels[i], 21, "middle")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<style>@font-face{{font-family:Pen;src:url(data:font/woff2;base64,{font_b64}) format("woff2")}}text{{font-family:Pen;fill:{INK}}}</style>
<rect width="{W}" height="{H}" fill="#fff"/>{p.svg()}</svg>'''
    return svg, W, H


def render(font_path, out, **kw):
    from playwright.sync_api import sync_playwright
    font = base64.b64encode(Path(font_path).read_bytes()).decode()
    svg, W, H = build(font, **kw)
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        pg.set_content(f"<html><body style='margin:0'>{svg}</body></html>"); pg.wait_for_timeout(400)
        pg.screenshot(path=out, full_page=True); b.close()
    return W, H


if __name__ == "__main__":
    from playwright.sync_api import sync_playwright
    font = base64.b64encode(Path(sys.argv[1]).read_bytes()).decode()
    svg, W, H = build(font)
    Path(sys.argv[2]).with_suffix(".svg").write_text(svg) if len(sys.argv) > 3 else None
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        pg.set_content(f"<html><body style='margin:0'>{svg}</body></html>"); pg.wait_for_timeout(400)
        pg.screenshot(path=sys.argv[2], full_page=True); b.close()
    print(sys.argv[2], W, H)
