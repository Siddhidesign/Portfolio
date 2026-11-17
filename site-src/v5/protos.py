"""Figma links shown near the top of each case study, and the Fit Check before/after flows.
kind "proto" = a clickable prototype people can tap through; "file" = the Figma design file."""

FC = "https://www.figma.com/proto/BwMh24tomFnDsNs8RpKAv5/Fit-Check?page-id=12%3A1089&scaling=scale-down&node-id={n}&starting-point-node-id={s}"
def fc(node): return FC.format(n=node.replace(":", "-"), s=node.replace(":", "%3A"))
V5 = "https://www.figma.com/proto/BwMh24tomFnDsNs8RpKAv5/Fit-Check?page-id={p}&node-id={n}&starting-point-node-id={s}&scaling=scale-down-width"
def v5(page, node): return V5.format(p=page.replace(":", "%3A"), n=node.replace(":", "-"), s=node.replace(":", "%3A"))
V5FILE = "https://www.figma.com/design/BwMh24tomFnDsNs8RpKAv5/Fit-Check?node-id=422-3"

PROTOS = {
    "ir2go": [("Try the clickable prototype", "https://www.figma.com/proto/RHTthzwRZGf3j0rqaM6Hbh/IRS2GO--REDESIGN?page-id=0%3A1&node-id=1-1564&starting-point-node-id=1%3A1299", "proto")],
    "fitcheck": [("Click through the redesign (Best Buy)", v5("271:24", "287:24"), "proto"),
                 ("All 4 retailers, design system and case study", V5FILE, "file"),
                 ("Click through today's Sparky", fc("51:371"), "proto")],
    "jaihind": [("Open all 34 flows in Figma", "https://www.figma.com/design/jkcD5ZIdXz9MUkG3va5sIo/Untitled?node-id=190-2", "file")],
    "ev": [("Open the app design in Figma", "https://www.figma.com/design/iQ43CH3FjQVDSkjKN35Zld/EV-Charging-prototype?node-id=0-1", "file")],
    "magic-apron": [("Open the case study in Figma", "https://www.figma.com/design/MS2GwRpGShTPmcSCDCWBof/Untitled?node-id=22-3", "file")],
}

# Fit Check: same task, real assistant today vs redesign. Each step: (caption) for before, (same, better) for after.
FLOWS = [
    dict(key="bestbuy", name="Best Buy · Ask Blue", task="Set up surround sound for my bedroom TV, under $500 for everything.", rec="Recorded live on bestbuy.com, Nov 17, 2026",
         proto=(None, v5("271:24", "287:24")),
         before=["Opens Ask Blue: generic starters (ranges, iPhones, tablets)", "Types the task; it starts pulling picks right away",
                 "Answers without asking which TV or how big the room is", "13+ soundbars in three groups, sale tags first, none tied to my TV",
                 "Asks \"Will it work with my TV?\" Gets \"Yes\" without knowing the TV", "Product page: the chat stays open over the product photos"],
         after=[("Ask Blue's panel, Best Buy blue, the starter list.", "Greets Alex by name and offers goals: Set up bedroom sound under $500."),
                ("Chat turn, Best Buy chips.", "4 quick taps (which TV, budget, room size, surround) answered one at a time; Make a plan unlocks at 4 of 4."),
                ("Product card, price, Save badge, rating.", "2 soundbars that fit this TV, best fit first, each with what it passed and a cable flagged as needed."),
                ("The normal Best Buy product page.", "The page loads clean; Ask Blue waits, then rises as a small bar with a nudge."),
                ("The page's own Add to Cart button.", "\"Will it work with my TV?\" Yes, through the optical port: Verified from specs, with the cable sold separately."),
                ("Best Buy's add-to-cart flow.", "Before adding: which cable, nothing pre-selected, both totals with tax against the $500 budget.")]),
    dict(key="walmart", name="Walmart · Ask Sparky", task="Buy a laptop with an Intel Core i9 and 512GB storage.",
         proto=(fc("51:371"), v5("223:24", "264:24")),
         before=["Opens Sparky: generic suggestions", "\"I want to buy a laptop\" → Top Laptop Deals", "Compare top picks → side-by-side table",
                 "Types \"I want i9 core and 512GB storage\"", "Gets restored and pre-owned MacBooks", "Ends on a restored i7 laptop page"],
         after=[('Header, greeting, cream suggestion pills.', 'Goal starters; one tap starts a guided search.'),
                ("Chat turn, Walmart's chips.", 'Three quick taps, answered one at a time; Show matches unlocks only when all are answered.'),
                ('Card layout, price, rating.', '2 new laptops that pass i9, 16GB, 512GB and New. The pick with only 2 ratings is flagged, no ads.'),
                ('The normal Walmart product page.', 'The page loads clean; Sparky rises as a small bar and opens to suggested questions on tap.'),
                ("The page's own Add to cart button.", 'Battery answer with labeled evidence: Verified spec vs Good to know from 2 reviews.'),
                ('Normal Walmart cart and checkout.', 'Cart check: specs as asked, $298.72 under budget, and the missing maker warranty flagged.')]),
    dict(key="homedepot", name="Home Depot · Magic Apron", task="Find a Black Friday TV deal, the right size for my room.",
         proto=(fc("52:368"), v5("223:25", "264:70661")),
         before=["\"Show me Black Friday deals\" → Consulting the blueprint…", "Deals: impact wrench and a refrigerator", "Pages 3/4 of unrelated deals + suggested questions",
                 "Types \"On TV\" → TV deals 1/4", "Asks \"How do I choose the right size TV?\" → long text", "Text ends with more questions"],
         after=[('Header, disclaimer, outlined chips.', 'Goal starters; Find a TV deal sized for my room.'),
                ('Chat turn, chip style.', 'Distance, budget and wall or stand, one tap at a time before any deals.'),
                ('2-card layout, outlined buttons.', 'A 65-inch fit for 8 ft: best fit next to a labeled sponsored pick, same checks.'),
                ('The normal Home Depot product page.', 'The page loads clean; Magic Apron rises as a small bar and opens on tap.'),
                ("The page's own Add to Cart button.", 'Which mount fits: Verified screw pattern and weight, aisle and bay in stock.'),
                ('Normal Home Depot cart and checkout.', 'Cart check: fits the room, under budget, and no wall mount yet flagged for approval.')]),
    dict(key="target", name="Target · Ask Target", task="Find a gift for a 5-year-old girl.",
         proto=(fc("53:338"), v5("223:26", "264:71926")),
         before=["Opens Ask Target: 3 generic starters", "Types \"I am looking for a gift for 5 year old girl\"", "Gets a summary + STEM kits carousel",
                 "Scrolls more categories: arts, games, active play", "Opens a scooter page; the chat is gone", "Lands on a generic \"Gift ideas\" page"],
         after=[('Header, disclaimer, "How can we help?".', 'Goal starters; Find a gift for someone.'),
                ('Chat turn.', 'Age, interests, budget and date, answered one tap at a time.'),
                ('Product card style, badges.', '2 picks ranked by fit only, with why they fit and when they arrive.'),
                ('The normal Target product page.', 'The page loads clean; Ask Target rises as a small bar and opens on tap.'),
                ("The page's own Add to cart button.", 'Size answer with evidence, and a helmet suggested but not added.'),
                ('Normal Target cart and checkout.', 'Cart check: right age, ready before Nov 21, $7.21 under budget.')]),
]
