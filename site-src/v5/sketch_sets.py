"""Sketch sets for the other case studies, drawn with the pen in sketch.py.
Each screen is redrawn from a shipped screen or a documented screen in the project files.
Usage: python3 sketch_sets.py <irs2go|anchor|ev> <font.woff2> <out.png>
"""
import math, sys
from sketch import Pen, render


def nav4(p, x, y, labels=None):
    p.line(x + 6, y, x + 202, y, 1.1)
    for i in range(4):
        cx = x + 30 + i * 50
        p.rect(cx - 7, y + 10, 14, 12, 2, 1.1)
        if labels: p.text(cx, y + 38, labels[i], 13, "middle")


def head(p, x, y, title, back=True):
    p.text(x + 4, y + 44, ("<-  " if back else "") + title, 19)


def bars(p, x, y, w, frac):
    p.rect(x, y, w, 8, 3, 1.1)
    p.line(x + 2, y + 4, x + 2 + (w - 4) * frac, y + 4, 4)


# ---------- IRS2Go ----------
IRS_TABS = ["Refunds", "Payments", "Tax help", "More"]


def i_welcome(p, x, y):
    p.xbox(x + 30, y + 60, 150, 120)
    p.text(x + 104, y + 216, "Welcome to the", 19, "middle"); p.text(x + 104, y + 240, "new IRS2Go", 19, "middle")
    p.squig(x + 30, y + 266, 150); p.squig(x + 50, y + 284, 110)
    for k in range(3): p.circle(x + 92 + k * 12, y + 312, 3 if k else 4)
    p.btn(x + 10, y + 360, 188, "Next"); p.text(x + 104, y + 420, "Skip", 17, "middle")


def i_refund(p, x, y):
    p.text(x + 4, y + 42, "IRS2GO", 19); p.text(x + 204, y + 42, "privacy notice", 13, "end")
    p.text(x + 4, y + 72, "Refund status", 19); p.squig(x + 4, y + 86, 180, 1.8)
    p.text(x + 4, y + 108, "Sample form >", 15)
    p.field(x + 4, y + 134, 200, "Tax year *", None, drop=True)
    p.text(x + 4, y + 184, "SSN *", 15); p.text(x + 8, y + 204, "XXX - XX - XXXX", 15); p.line(x + 4, y + 210, x + 204, y + 210, 1.2)
    p.circle(x + 192, y + 199, 5); p.text(x + 176, y + 184, "show", 13, "end")
    p.field(x + 4, y + 230, 200, "Filing status *", None, drop=True)
    p.field(x + 4, y + 280, 200, "Refund amount *", "ex. $10.00")
    p.btn(x + 4, y + 326, 200, "Get status")
    nav4(p, x, y + 386, IRS_TABS)


def i_track(p, x, y):
    head(p, x, y, "Refund status")
    for k, t in enumerate(("Received", "Approved", "Sent")):
        cx = x + 30 + k * 72
        p.circle(cx, y + 80, 10); p.text(cx, y + 86, str(k + 1), 15, "middle"); p.text(cx, y + 112, t, 14, "middle")
        if k < 2: p.line(cx + 14, y + 80, cx + 58, y + 80, 1.1)
    p.text(x + 4, y + 150, "Return received", 18)
    for k in range(4): p.squig(x + 4, y + 172 + k * 18, 180 - k * 20, 1.8)
    p.text(x + 4, y + 268, "SSN  XXX-XX-", 15); p.squig(x + 96, y + 263, 30, 1.6)
    p.rect(x + 4, y + 330, 200, 64, 6); p.text(x + 14, y + 352, "? Helpful information", 15); p.squig(x + 14, y + 374, 140, 1.6)


def i_pay(p, x, y):
    head(p, x, y, "Payments", back=False)
    p.text(x + 4, y + 76, "How do you want to pay?", 16)
    for k, (t, s) in enumerate((("Pay with bank account", "in the app"), ("Pay with debit or credit card", "card processors"))):
        yy = y + 96 + k * 92
        p.rect(x + 4, yy, 200, 76, 8); p.rect(x + 14, yy + 14, 24, 18, 3)
        p.text(x + 46, yy + 28, t, 14); p.text(x + 46, yy + 52, s, 13); p.text(x + 194, yy + 44, ">", 17, "end")
    p.squig(x + 4, y + 300, 160, 1.8); p.squig(x + 4, y + 318, 110, 1.8)
    nav4(p, x, y + 386, IRS_TABS)


def i_card(p, x, y):
    head(p, x, y, "Pay by card")
    p.text(x + 4, y + 74, "Compare processors", 16)
    for k, n in enumerate(("Pay1040", "ACI Payment")):
        xx = x + 4 + k * 104
        p.rect(xx, y + 88, 96, 200, 8); p.text(xx + 48, y + 112, n, 15, "middle"); p.line(xx + 8, y + 122, xx + 88, y + 122, 1)
        for r, lab in enumerate(("fee", "cards", "wallet")):
            p.text(xx + 8, y + 146 + r * 34, lab, 13); p.squig(xx + 8, y + 158 + r * 34, 60, 1.4)
        p.circle(xx + 48, y + 268, 7)
    p.btn(x + 4, y + 312, 200, "Make payment")


def i_help(p, x, y):
    head(p, x, y, "Tax help", back=False)
    p.rect(x + 4, y + 62, 200, 26, 4); p.circle(x + 16, y + 75, 5); p.text(x + 28, y + 81, "search help", 15)
    for k, t in enumerate(("IRS Direct File", "IRS Free File", "Free Tax Prep")):
        yy = y + 104 + k * 88
        p.rect(x + 4, yy, 200, 76, 8); p.text(x + 14, yy + 22, t, 16)
        p.squig(x + 14, yy + 38, 150, 1.6); p.text(x + 194, yy + 64, "learn more >", 13, "end")
    nav4(p, x, y + 386, IRS_TABS)


def i_locator(p, x, y):
    head(p, x, y, "Free tax prep near you")
    p.field(x + 4, y + 70, 200, "ZIP code", "4 8 1 2 6")
    p.xbox(x + 4, y + 112, 200, 180)
    for px, py in ((60, 160), (130, 200), (90, 250), (160, 150)): p.pin(x + px, y + py)
    for k in range(2):
        yy = y + 306 + k * 46
        p.rect(x + 4, yy, 200, 38, 5); p.squig(x + 14, yy + 14, 110, 1.6); p.squig(x + 14, yy + 28, 60, 1.4)


IRS = ([i_welcome, i_refund, i_track, i_pay, i_card, i_help, i_locator],
       ["Welcome", "Refund status form", "Refund tracker", "Choose how to pay", "Processors side by side", "Tax help", "Find free tax prep"])


# ---------- Money Anchor ----------
MA_TABS = ["Home", "Accounts", "Transact.", "Reports"]


def bot(p, x, y):
    p.rect(x, y, 22, 22, 5); p.circle(x + 7, y + 10, 1.5, 1.4); p.circle(x + 15, y + 10, 1.5, 1.4)


def m_budget(p, x, y):
    p.text(x + 4, y + 44, "Budget", 22); p.circle(x + 160, y + 38, 6); p.circle(x + 192, y + 38, 9)
    p.rect(x + 4, y + 60, 200, 96, 10); p.text(x + 14, y + 80, "Total balance", 15); p.squig(x + 14, y + 106, 100, 3.4)
    p.text(x + 14, y + 140, "+ income", 14); p.text(x + 110, y + 140, "- spending", 14)
    p.btn(x + 4, y + 168, 96, "Adjust income", 24); p.btn(x + 108, y + 168, 96, "Add expense", 24)
    p.text(x + 4, y + 222, "Budget overview", 17); p.text(x + 204, y + 222, "view all", 13, "end")
    for k, t in enumerate(("Dining out", "Shopping", "Transport")):
        yy = y + 238 + k * 46
        p.circle(x + 14, yy + 14, 8); p.text(x + 30, yy + 20, t, 15); bars(p, x + 128, yy + 8, 72, (0.75, 0.78, 0.67)[k])
    bot(p, x + 180, y + 360)
    nav4(p, x, y + 392, MA_TABS)


def m_accounts(p, x, y):
    head(p, x, y, "Accounts", back=False)
    p.rect(x + 4, y + 62, 200, 70, 8); p.text(x + 14, y + 82, "All linked accounts", 15); p.squig(x + 14, y + 110, 90, 3)
    for k, t in enumerate(("Income", "Expenses", "Salary")):
        xx = x + 4 + k * 69
        p.rect(xx, y + 144, 62, 50, 6); p.text(xx + 31, y + 162, t, 13, "middle"); p.squig(xx + 12, y + 180, 38, 1.6)
    p.text(x + 4, y + 226, "Subscriptions", 17)
    for k in range(3):
        yy = y + 240 + k * 46
        p.rect(x + 4, yy, 200, 38, 6); p.xbox(x + 10, yy + 7, 24, 24); p.squig(x + 42, yy + 18, 70, 1.6)
        p.rect(x + 140, yy + 9, 56, 20, 9); p.text(x + 168, yy + 24, "cancel", 13, "middle")
    nav4(p, x, y + 392, MA_TABS)


def m_chat(p, x, y):
    head(p, x, y, "AI Anchor assistant")
    p.rect(x + 4, y + 66, 170, 28, 10); p.text(x + 14, y + 85, "Hey there. How can I help?", 14)
    p.rect(x + 4, y + 102, 180, 44, 10); p.squig(x + 14, y + 118, 150, 1.6); p.squig(x + 14, y + 134, 110, 1.6)
    for k, t in enumerate(("Help me find this item", "How much can I spend today?", "Where am I overspending?", "Where can I cut costs?")):
        p.rect(x + 4, y + 158 + k * 34, len(t) * 6.4 + 20, 26, 8); p.text(x + 14, y + 176 + k * 34, t, 13)
    p.rect(x + 4, y + 404, 200, 36, 12); p.text(x + 14, y + 427, "ask me about your budget", 13)
    p.circle(x + 168, y + 422, 7); p.circle(x + 190, y + 422, 7)


def m_insights(p, x, y):
    head(p, x, y, "AI insights")
    p.squig(x + 4, y + 70, 190, 1.6); p.squig(x + 4, y + 86, 140, 1.6)
    for k, (t, up) in enumerate((("Coffee", 1), ("Transport", 0))):
        yy = y + 102 + k * 108
        p.rect(x + 4, yy, 200, 96, 8); p.text(x + 14, yy + 22, t, 15); p.text(x + 194, yy + 22, "+%" if up else "-%", 14, "end")
        pts = [(x + 14 + i * 18, yy + (62 - i * 3 if up else 44 + i * 2) + p.j(3)) for i in range(11)]
        p.path(pts, 1.3); p.squig(x + 14, yy + 84, 140, 1.4)
    p.rect(x + 4, y + 322, 96, 70, 8); p.text(x + 14, y + 352, "3", 22); p.text(x + 14, y + 378, "new habits", 13)
    p.rect(x + 108, y + 322, 96, 70, 8); p.text(x + 118, y + 352, "2", 22); p.text(x + 118, y + 378, "need attention", 13)


def m_tx(p, x, y):
    head(p, x, y, "Transactions", back=False)
    p.rect(x + 4, y + 60, 200, 30, 6); p.text(x + 14, y + 80, "! Dining out is trending up", 14)
    p.rect(x + 4, y + 100, 200, 26, 4); p.circle(x + 16, y + 113, 5); p.text(x + 28, y + 119, "search", 15)
    for k, cat in enumerate(("Dining out", "Shopping", "Transport", "Shopping", "Dining out")):
        yy = y + 138 + k * 48
        p.circle(x + 16, yy + 18, 9); p.squig(x + 32, yy + 14, 70, 1.6)
        p.rect(x + 32, yy + 24, len(cat) * 6.5 + 14, 16, 7); p.text(x + 39, yy + 36, cat, 12)
        p.text(x + 204, yy + 22, "-$", 15, "end")
    nav4(p, x, y + 392, MA_TABS)


def m_report(p, x, y):
    head(p, x, y, "Spending report", back=False)
    p.rect(x + 104, y + 58, 100, 22, 10); p.text(x + 114, y + 74, "This month", 13); p.chev(x + 194, y + 69)
    cx, cy, r = x + 104, y + 168, 64
    p.circle(cx, cy, r, 1.5)
    for a in (0, 100, 190, 260): p.line(cx, cy, cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)), 1.2)
    for k, t in enumerate(("Dining out", "Shopping", "Transport", "Other")):
        yy = y + 258 + k * 30
        p.rect(x + 8, yy, 12, 12, 2, 1.1); p.text(x + 28, yy + 11, t, 15); p.squig(x + 150, yy + 6, 46, 1.4)
    nav4(p, x, y + 392, MA_TABS)


def m_goals(p, x, y):
    head(p, x, y, "Goals")
    for k in range(3):
        yy = y + 64 + k * 92
        p.rect(x + 4, yy, 200, 80, 8); p.squig(x + 14, yy + 18, 80, 1.8); p.text(x + 194, yy + 22, "$", 15, "end")
        bars(p, x + 14, yy + 34, 180, (0.6, 0.35, 0.8)[k]); p.text(x + 14, yy + 66, "AI: on track by", 13); p.squig(x + 112, yy + 61, 40, 1.4)
    p.btn(x + 4, y + 352, 200, "+ Add a goal")


ANCHOR = ([m_budget, m_accounts, m_chat, m_insights, m_tx, m_report, m_goals],
          ["Budget home", "Accounts & subscriptions", "AI assistant", "AI insights", "Transactions", "Spending report", "Savings goals"])


# ---------- EV charging ----------
def e_nav(p, x, y):
    p.line(x + 6, y, x + 202, y, 1.1)
    p.rect(x + 23, y + 12, 14, 12, 2, 1.1); p.circle(x + 80, y + 18, 6, 1.1)
    p.text(x + 130, y + 26, "$", 20, "middle"); p.circle(x + 180, y + 18, 7, 1.1)


def trip_box(p, x, y):
    p.rect(x + 4, y + 62, 200, 56, 8); p.circle(x + 16, y + 78, 4); p.text(x + 28, y + 83, "your location", 14)
    p.line(x + 26, y + 90, x + 196, y + 90, 1); p.pin(x + 16, y + 110); p.text(x + 28, y + 109, "destination", 14); p.circle(x + 190, y + 104, 5)


def e_plan(p, x, y):
    head(p, x, y, "Plan my trip", back=False); p.circle(x + 192, y + 38, 9)
    trip_box(p, x, y)
    p.xbox(x + 4, y + 130, 200, 200); p.circle(x + 150, y + 220, 6)
    p.rect(x + 14, y + 340, 180, 40, 10); p.text(x + 24, y + 365, "Calculating best route...", 14)
    e_nav(p, x, y + 400)


def e_routes(p, x, y):
    head(p, x, y, "Plan my trip", back=False); p.circle(x + 192, y + 38, 9)
    trip_box(p, x, y)
    p.rect(x + 4, y + 130, 200, 250, 4)
    p.path([(x + 150, y + 160), (x + 150, y + 220), (x + 90, y + 230), (x + 90, y + 340)], 3)
    p.path([(x + 150, y + 160), (x + 180, y + 250), (x + 120, y + 300), (x + 92, y + 340)], 1.2)
    p.circle(x + 150, y + 160, 6); p.pin(x + 92, y + 344)
    p.rect(x + 14, y + 200, 58, 24, 4); p.text(x + 43, y + 217, "40 min", 14, "middle")
    p.rect(x + 130, y + 330, 58, 24, 4); p.text(x + 159, y + 347, "50 min", 14, "middle")
    e_nav(p, x, y + 400)


def e_enroute(p, x, y):
    head(p, x, y, "Plan my trip", back=False)
    trip_box(p, x, y)
    p.rect(x + 4, y + 132, 200, 250, 10); p.text(x + 14, y + 156, "Chargers en route (2)", 16)
    for k, n in enumerate(("Autel charging station", "Tesla supercharger")):
        yy = y + 172 + k * 102
        p.text(x + 14, yy + 14, n, 15); p.text(x + 14, yy + 34, "min away", 13); p.text(x + 14, yy + 54, "$ / kWh", 13)
        p.btn(x + 14, yy + 64, 70, "Go here", 22); p.btn(x + 104, yy + 64, 90, "Station info", 22)
    e_nav(p, x, y + 400)


def e_checkin(p, x, y):
    p.rect(x + 4, y + 30, 200, 136, 10); p.xbox(x + 120, y + 40, 76, 60); p.text(x + 14, y + 112, "Check-in at", 18)
    p.rect(x + 14, y + 120, 180, 40, 8); p.text(x + 24, y + 140, "Autel charging st.", 15); p.text(x + 184, y + 145, ">", 16, "end")
    p.text(x + 4, y + 196, "Other stations near you", 17)
    for k, n in enumerate(("EVgo station", "Tesla supercharger", "ChargePoint")):
        yy = y + 210 + k * 56
        p.rect(x + 4, yy, 200, 46, 8); p.text(x + 14, yy + 22, n, 15); p.squig(x + 14, yy + 34, 50, 1.3); p.text(x + 194, yy + 28, ">", 16, "end")
    e_nav(p, x, y + 400)


def e_station(p, x, y):
    p.rect(x + 4, y + 30, 200, 136, 4); p.xbox(x + 50, y + 40, 108, 76); p.text(x + 14, y + 150, "Autel charging station", 16)
    p.text(x + 4, y + 192, "1 charger available", 14); p.text(x + 204, y + 192, "Type 2 (slow)", 14, "end")
    p.btn(x + 14, y + 210, 180, "Connect to start charging", 30)
    for k, t in enumerate(("Save", "Amenities", "Info")):
        xx = x + 6 + k * 68
        p.rect(xx, y + 260, 60, 60, 8); p.circle(xx + 30, y + 282, 8); p.text(xx + 30, y + 310, t, 13, "middle")
    p.text(x + 104, y + 356, "Contact help", 15, "middle"); p.line(x + 64, y + 360, x + 144, y + 360, 1)
    e_nav(p, x, y + 400)


def e_battery(p, x, y):
    head(p, x, y, "Battery health")
    p.rect(x + 24, y + 70, 150, 64, 8); p.rect(x + 174, y + 92, 10, 20, 2)
    for k in range(9): p.line(x + 34, y + 84 + k * 4, x + 128, y + 84 + k * 4, 2.2)
    p.text(x + 104, y + 160, "% charged  .  range", 15, "middle")
    for k, t in enumerate(("Good", "Fair", "Poor")):
        xx = x + 4 + k * 69
        p.rect(xx, y + 178, 62, 30, 6); p.text(xx + 31, y + 198, t, 14, "middle")
    p.rect(x + 4, y + 236, 200, 44, 6); p.text(x + 14, y + 256, "Phantom drain", 15); p.squig(x + 14, y + 270, 40, 1.4); p.circle(x + 190, y + 254, 6); p.text(x + 190, y + 259, "i", 12, "middle")
    e_nav(p, x, y + 400)


def e_pay(p, x, y):
    head(p, x, y, "Payment", back=False)
    p.text(x + 4, y + 74, "One way to pay at every network", 14)
    for k in range(2):
        yy = y + 90 + k * 56
        p.rect(x + 4, yy, 200, 46, 8); p.rect(x + 14, yy + 12, 30, 22, 3); p.squig(x + 54, yy + 22, 80, 1.6); p.circle(x + 190, yy + 23, 6)
    p.btn(x + 4, y + 210, 200, "+ Add payment method")
    e_nav(p, x, y + 400)


EV = ([e_plan, e_routes, e_enroute, e_checkin, e_station, e_battery, e_pay],
      ["Plan my trip", "Compare routes", "Chargers en route", "Check in nearby", "Station detail", "Battery health", "One payment"])

SETS = {"irs2go": IRS, "anchor": ANCHOR, "ev": EV}

if __name__ == "__main__":
    scr, lab = SETS[sys.argv[1]]
    print(sys.argv[3], render(sys.argv[2], sys.argv[3], screens=scr, labels=lab))
