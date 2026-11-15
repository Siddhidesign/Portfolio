"""JaiHind rough idea sheet: quick, messy thumbnail layouts drawn while deciding the structure,
with alternatives crossed out, the chosen layout circled, questions and sticky notes.
Redrawn for the case study page; it shows the thinking, not exact screens.

    python3 jh_ideas.py <font.woff2> <out.webp>
"""
import base64, math, sys
from pathlib import Path
from jh_sketch import Pen, INK, RED, PAPER

W, H = 1560, 1400
STICKY = "#f3df86"


class Messy(Pen):
    """Faster, looser hand: more wobble, more overshoot, sometimes three passes."""
    def line(self, x1, y1, x2, y2, w=1.5, col=INK, op=0.85, wob=2.2, double=True):
        self._line(x1, y1, x2, y2, w, col, op, wob)
        if double and self.r.random() < 0.8:
            self._line(x1 + self.j(2.4), y1 + self.j(2.4), x2 + self.j(2.4), y2 + self.j(2.4), w * 0.65, col, op * 0.5, wob)
        if double and self.r.random() < 0.25:
            self._line(x1 + self.j(3), y1 + self.j(3), x2 + self.j(3), y2 + self.j(3), w * 0.5, col, op * 0.35, wob)

    def block(self, x, y, w, h, op=0.38):
        """A scribbled-in solid area, the way you fill a box fast with the side of the pencil."""
        k = 0
        while k < h:
            self._line(x + self.j(2), y + k, x + w + self.j(3), y + k + self.j(1.5), 1.4, INK, op, 1.4)
            k += 3.2 + self.j(0.8)

    def lines(self, x, y, w, n, gap=8):
        for i in range(n):
            self._line(x, y + i * gap, x + w * self.r.uniform(0.45, 1.0), y + i * gap + self.j(1.2), 1.0, INK, 0.7, 1.2)

    def q(self, x, y, size=26):
        self.text(x, y, "?", size, "middle", col=RED, rot=8, weight=700)

    def check(self, x, y, s=16):
        self.path([(x, y), (x + s * 0.35, y + s * 0.45 + self.j(1)), (x + s, y - s * 0.6)], 2.6, RED, 0.9)

    def sticky(self, x, y, w, h, lines, rot):
        self.out.append(f'<g transform="rotate({rot} {x + w / 2} {y + h / 2})"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{STICKY}" opacity="0.92"/>'
                        f'<rect x="{x}" y="{y + h - 8}" width="{w}" height="8" fill="#000" opacity="0.04"/>')
        for i, s in enumerate(lines):
            self.out.append(f'<text x="{x + 12}" y="{y + 30 + i * 22}" font-size="17" fill="{INK}" fill-opacity="0.9">{s}</text>')
        self.out.append("</g>")

    def stain(self, cx, cy, r):
        self.out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#a47a45" stroke-width="5" stroke-opacity="0.12" filter="url(#soft)"/>')
        self.out.append(f'<circle cx="{cx + 3}" cy="{cy - 2}" r="{r - 4}" fill="#a47a45" fill-opacity="0.035"/>')


# --- thumbnails: desktop ~190 x 124, tablet ~96 x 130 ---
def frame(p, x, y, w=190, h=124):
    p.rect(x, y, w, h, 1.6); p.line(x, y + 12, x + w, y + 12, 1.0, double=False)


def home_sidebar_chart(p, x, y):
    frame(p, x, y); p.block(x + 4, y + 16, 34, 104, 0.25)
    p.rect(x + 46, y + 20, 136, 58, 1.1)
    for i, h in enumerate((14, 26, 18, 38, 30, 44)): p.line(x + 58 + i * 20, y + 74, x + 58 + i * 20, y + 74 - h, 3, double=False)
    p.lines(x + 48, y + 90, 130, 3, 9)


def home_tabs_list(p, x, y):
    frame(p, x, y)
    for i in range(5): p.line(x + 8 + i * 36, y + 22, x + 34 + i * 36, y + 22, 1.6, double=False)
    for k in range(6): p.rect(x + 8, y + 32 + k * 15, 174, 11, 0.9)


def home_cards_list_stock(p, x, y):
    frame(p, x, y)
    for i in range(5): p.line(x + 8 + i * 30, y + 22, x + 30 + i * 30, y + 22, 1.6, double=False)
    p.lines(x + 8, y + 34, 70, 1)
    for i in range(4): p.rect(x + 8 + i * 45, y + 42, 40, 22, 1.0); p.text(x + 14 + i * 45, y + 58, "#", 12)
    p.rect(x + 8, y + 70, 112, 48, 1.0); p.lines(x + 14, y + 80, 96, 4, 9)
    p.rect(x + 126, y + 70, 56, 48, 1.0); p.text(x + 130, y + 84, "stock", 11); p.lines(x + 130, y + 94, 44, 3, 8)


def home_tiles(p, x, y):
    frame(p, x, y)
    for r in range(3):
        for c in range(4):
            p.rect(x + 8 + c * 45, y + 20 + r * 34, 40, 28, 0.9)
            if (r + c) % 3 == 0: p.block(x + 12 + c * 45, y + 24 + r * 34, 30, 18, 0.2)


def order_long_form(p, x, y):
    frame(p, x, y, 120, 220)
    for k in range(12):
        p.lines(x + 10, y + 22 + k * 16, 50, 1); p.line(x + 10, y + 32 + k * 16, x + 110, y + 32 + k * 16, 0.9, double=False)
    p.rect(x + 10, y + 206, 100, 10, 1.0)


def order_two_col(p, x, y):
    frame(p, x, y)
    p.rect(x + 8, y + 20, 84, 98, 1.0); p.lines(x + 14, y + 30, 70, 9, 9)
    p.rect(x + 98, y + 20, 84, 98, 1.0); p.lines(x + 104, y + 30, 70, 9, 9)


def order_steps(p, x, y):
    frame(p, x, y)
    for i in range(4):
        p.circle(x + 22 + i * 44, y + 26, 7, 1.2)
        p.text(x + 22 + i * 44, y + 30, str(i + 1), 10, "middle")
        if i < 3: p.line(x + 31 + i * 44, y + 26, x + 57 + i * 44, y + 26, 0.9, double=False)
    p.block(x + 15, y + 19, 14, 14, 0.35)
    p.rect(x + 8, y + 42, 118, 76, 1.0); p.lines(x + 14, y + 52, 100, 6, 10)
    p.rect(x + 132, y + 42, 50, 76, 1.0); p.lines(x + 136, y + 52, 40, 4, 10); p.block(x + 136, y + 102, 42, 10, 0.4)


def approve_then_check(p, x, y):
    frame(p, x, y)
    p.lines(x + 10, y + 24, 170, 5, 12)
    p.rect(x + 120, y + 92, 62, 22, 1.2); p.text(x + 126, y + 108, "Approve", 11)


def approve_modal(p, x, y):
    frame(p, x, y)
    p.lines(x + 10, y + 24, 80, 7, 12)
    p.rect(x + 96, y + 18, 88, 102, 1.4)
    for k in range(3): p.rect(x + 102, y + 26 + k * 20, 12, 12, 0.9); p.lines(x + 118, y + 32 + k * 20, 56, 1)
    p.rect(x + 102, y + 88, 76, 10, 1.0); p.text(x + 104, y + 97, "!", 11, col=RED)
    p.block(x + 102, y + 102, 76, 12, 0.4)


def tab_list(p, x, y):
    p.rrect(x, y, 96, 130, 10, 1.4)
    for k in range(7): p.lines(x + 10, y + 16 + k * 15, 74, 1); p.text(x + 82, y + 22 + k * 15, "3", 10)


def tab_grid(p, x, y):
    p.rrect(x, y, 96, 130, 10, 1.4)
    for r in range(4):
        for c in range(4): p.rect(x + 10 + c * 19, y + 16 + r * 19, 16, 16, 0.8)
    p.block(x + 48, y + 35, 16, 16, 0.3)
    p.rect(x + 10, y + 96, 76, 24, 1.0); p.lines(x + 14, y + 104, 60, 2, 8)


def tab_board(p, x, y):
    p.rrect(x, y, 130, 96, 10, 1.4)
    for c in range(5):
        p.line(x + 10 + c * 23, y + 16, x + 28 + c * 23, y + 16, 1.2, double=False)
        for k in range((2, 3, 1, 2, 1)[c]): p.rect(x + 10 + c * 23, y + 22 + k * 22, 18, 18, 0.8)


def tab_keypad(p, x, y):
    p.rrect(x, y, 96, 130, 10, 1.4); p.rect(x + 10, y + 14, 76, 18, 1.0)
    for r in range(4):
        for c in range(3): p.rect(x + 12 + c * 25, y + 40 + r * 21, 20, 16, 0.8)


def tab_stepper(p, x, y):
    p.rrect(x, y, 96, 130, 10, 1.4)
    p.rect(x + 8, y + 40, 22, 30, 1.3); p.text(x + 19, y + 62, "-", 18, "middle")
    p.rect(x + 66, y + 40, 22, 30, 1.3); p.text(x + 77, y + 62, "+", 18, "middle")
    p.text(x + 48, y + 62, "3.25", 13, "middle", weight=700); p.block(x + 10, y + 98, 76, 14, 0.4)


def build(font_b64):
    p = Messy(41)
    p.text(56, 60, "rough ideas: thinking out loud", 32, rot=0.8, weight=700)
    p.text(58, 88, "quick thumbnails before any real screen. most of these got crossed out.", 15, rot=0.5, op=0.75)

    # 1. staff home
    y = 150
    p.text(56, y - 20, "1. staff home: what do I see first?", 20, rot=0.8, weight=700); p.underline(56, y - 12, 330, INK)
    xs = [60, 300, 540, 780]
    home_sidebar_chart(p, xs[0], y); p.strike(xs[0], y, 190, 124); p.note(xs[0], y + 152, ["big chart? staff", "don't care, store does"], 15)
    home_tabs_list(p, xs[1], y); p.q(xs[1] + 205, y + 40); p.note(xs[1], y + 152, ["just a list...", "where's stock?"], 15)
    home_cards_list_stock(p, xs[2], y); p.ellipse(xs[2] + 95, y + 62, 120, 84); p.check(xs[2] + 196, y - 6, 22); p.note(xs[2] + 10, y + 166, ["this one: my numbers,", "my orders, stock on the side"], 15)
    home_tiles(p, xs[3], y); p.strike(xs[3], y, 190, 124); p.note(xs[3], y + 152, ["12 tiles = too much", "to read"], 15)
    p.arrow(xs[1] + 196, y + 100, xs[2] - 12, y + 96, INK, 1.2, -0.3)
    p.sticky(1060, y - 8, 200, 118, ["most never used", "a work app ->", "big buttons,", "plain words"], 3)
    p.text(1290, y + 30, "phone version", 15, rot=2); p.text(1290, y + 50, "later? floor staff", 15, rot=2); p.text(1290, y + 70, "carry phones!", 15, rot=2)
    p.rrect(1300, y + 82, 54, 94, 8, 1.3); p.lines(1308, y + 96, 38, 6, 11); p.q(1376, y + 120)

    # 2. phone order
    y = 500
    p.text(56, y - 20, "2. phone order: one form or steps?", 20, rot=0.8, weight=700); p.underline(56, y - 12, 330, INK)
    order_long_form(p, 60, y); p.strike(60, y, 120, 220); p.note(196, y + 40, ["one long form", "= can't finish while", "the customer waits"], 15)
    order_two_col(p, 380, y); p.q(586, y + 50); p.note(380, y + 152, ["2 columns? still long"], 15)
    order_steps(p, 640, y); p.ellipse(735, y + 62, 118, 82); p.check(836, y - 6, 22)
    p.note(650, y + 166, ["4 short steps:", "customer, products,", "delivery, review"], 15)
    # flow scribble
    fx, fy = 930, y + 20
    for i, t in enumerate(("call", "stock?", "approve", "supplier")):
        p.rrect(fx + i * 150, fy, 104, 36, 10, 1.3); p.text(fx + 52 + i * 150, fy + 24, t, 16, "middle")
        if i < 3: p.arrow(fx + 106 + i * 150, fy + 18, fx + 146 + i * 150, fy + 18, INK, 1.2, 0.1)
    p.ellipse(fx + 202, fy + 18, 66, 30)
    p.note(fx + 120, fy + 74, ["check stock BEFORE approve,", "not after it ships!!"], 16)
    p.underline(fx + 120, fy + 98, 230); p.underline(fx + 124, fy + 102, 220)
    p.text(fx, fy + 150, "old way:", 15, weight=700)
    p.text(fx, fy + 172, "call -> paper book -> call supplier -> ???", 15, rot=0.8)
    p.strike(fx - 4, fy + 156, 360, 22)

    # 3. approve
    y = 860
    p.text(56, y - 20, "3. manager approve: when does stock get checked?", 20, rot=0.8, weight=700); p.underline(56, y - 12, 470, INK)
    approve_then_check(p, 60, y); p.strike(60, y, 190, 124); p.note(60, y + 152, ["approve first, check", "later? too late"], 15)
    p.arrow(260, y + 62, 330, y + 62, INK, 1.2, 0.0)
    approve_modal(p, 340, y); p.ellipse(435, y + 62, 118, 84); p.check(536, y - 6, 22)
    p.note(340, y + 166, ["stock next to each item,", "warning before approve"], 15)
    p.sticky(640, y + 6, 220, 96, ["one order record.", "never type it twice"], -3)
    p.stain(1000, y + 30, 46)

    # 4. tablet
    y = 1180
    p.text(56, y - 20, "4. tablets on the floor + cutting table", 20, rot=0.8, weight=700); p.underline(56, y - 12, 380, INK)
    tab_list(p, 60, y); p.strike(60, y, 96, 130); p.note(56, y + 158, ["sizes as a list:", "too much scrolling"], 14)
    tab_grid(p, 220, y); p.check(330, y - 4, 20); p.note(214, y + 158, ["size x colour grid,", "tap a cell to hold"], 14)
    tab_board(p, 400, y + 16); p.note(398, y + 140, ["tailor board:", "columns = stages"], 14); p.q(548, y + 40)
    tab_keypad(p, 640, y); p.strike(640, y, 96, 130); p.note(632, y + 158, ["keypad for metres?", "typing errors"], 14)
    tab_stepper(p, 790, y); p.check(900, y - 4, 20); p.note(784, y + 158, ["- / + stepper", "0.25 m steps"], 14)
    p.sticky(1000, y - 6, 230, 118, ["tailors read", "Marathi first.", "test labels with", "them!"], 4)
    p.text(1270, y + 30, "Mewar:", 16, weight=700); p.text(1270, y + 52, "wedding date drives", 15)
    p.text(1270, y + 72, "EVERYTHING", 15, weight=700); p.underline(1270, y + 78, 96)
    p.circle(1300, y + 116, 8); p.line(1310, y + 116, 1360, y + 116, 1.1); p.circle(1370, y + 116, 8); p.line(1380, y + 116, 1430, y + 116, 1.1); p.circle(1440, y + 116, 8)
    p.text(1440, y + 144, "wedding", 13, "middle")

    p.smudge(700, 420, 220, 34, 0.05); p.smudge(260, 1110, 160, 30, 0.05); p.smudge(1300, 800, 140, 50, 0.04)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
<style>@font-face{{font-family:Pen;src:url(data:font/woff2;base64,{font_b64}) format("woff2")}}text{{font-family:Pen}}</style>
<filter id="pencil" x="-2%" y="-2%" width="104%" height="104%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="1" seed="3" result="g"/>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.8" result="mask"/>
  <feComposite in="d" in2="mask" operator="in"/>
</filter>
<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.22  0 0 0 0 0.18  0 0 0 0.1 0"/></filter>
<filter id="blur"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="soft"><feGaussianBlur stdDeviation="1.5"/></filter>
<pattern id="rule" width="1560" height="30" patternUnits="userSpaceOnUse"><line x1="0" y1="29" x2="1560" y2="29" stroke="#7d93b2" stroke-opacity="0.18" stroke-width="1"/></pattern>
</defs>
<rect width="{W}" height="{H}" fill="{PAPER}"/>
<rect width="{W}" height="{H}" fill="url(#rule)"/>
<line x1="40" y1="0" x2="40" y2="{H}" stroke="{RED}" stroke-opacity="0.18" stroke-width="1.2"/>
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
