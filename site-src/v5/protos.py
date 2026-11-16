"""Figma links shown near the top of each case study, and the Fit Check before/after flows.
kind "proto" = a clickable prototype people can tap through; "file" = the Figma design file."""

FC = "https://www.figma.com/proto/BwMh24tomFnDsNs8RpKAv5/Fit-Check?page-id=12%3A1089&scaling=scale-down&node-id={n}&starting-point-node-id={s}"
def fc(node): return FC.format(n=node.replace(":", "-"), s=node.replace(":", "%3A"))

PROTOS = {
    "ir2go": [("Try the clickable prototype", "https://www.figma.com/proto/RHTthzwRZGf3j0rqaM6Hbh/IRS2GO--REDESIGN?page-id=0%3A1&node-id=1-1564&starting-point-node-id=1%3A1299", "proto")],
    "fitcheck": [("Click through the redesign (Walmart)", fc("51:414"), "proto"),
                 ("Click through today's Sparky", fc("51:371"), "proto")],
    "jaihind": [("Open all 34 flows in Figma", "https://www.figma.com/design/jkcD5ZIdXz9MUkG3va5sIo/Untitled?node-id=190-2", "file")],
    "ev": [("Open the app design in Figma", "https://www.figma.com/design/iQ43CH3FjQVDSkjKN35Zld/EV-Charging-prototype?node-id=0-1", "file")],
    "magic-apron": [("Open the case study in Figma", "https://www.figma.com/design/MS2GwRpGShTPmcSCDCWBof/Untitled?node-id=22-3", "file")],
}

# Fit Check: same task, real assistant today vs redesign. Each step: (caption) for before, (same, better) for after.
FLOWS = [
    dict(key="bestbuy", name="Best Buy · Ask Blue", task="Find a Black Friday TV deal for my living room.",
         proto=(fc("50:126"), fc("50:417")),
         before=["Opens Ask Blue: generic starter questions", "Taps \"What are the biggest Black Friday deals?\"", "First results: refrigerators",
                 "Scrolls to \"Large screen 4K TVs\"", "Opens a TV page; chat floats over it, sign-in pop-up", "Checks mounting, offers and add-ons alone"],
         after=[("Card, heading, chips.", "A goal-based starter, and it says it checks fit first."),
                ("Chat turn.", "Tap answers (distance, light, budget) shape the results."),
                ("Save badge, Black Friday price, rating, product image.", "Fit check on each card and why, with sources. Cards open the product page."),
                ("The normal Best Buy product page.", "Ask Blue shrinks to a small floating chat and offers questions about this TV."),
                ("The page's own Add to Cart button.", "Product questions answered on the page, with Verified / Good to know and the source."),
                ("Normal Best Buy cart and checkout.", "A quick check right after adding: optional plan unchecked, total vs budget, one-line receipt.")]),
    dict(key="walmart", name="Walmart · Ask Sparky", task="Buy a laptop with an Intel Core i9 and 512GB storage.",
         proto=(fc("51:371"), fc("51:414")),
         before=["Opens Sparky: generic suggestions", "\"I want to buy a laptop\" → Top Laptop Deals", "Compare top picks → side-by-side table",
                 "Types \"I want i9 core and 512GB storage\"", "Gets restored and pre-owned MacBooks", "Ends on a restored i7 laptop page"],
         after=[("Header, greeting, cream suggestion pills.", "A goal-based starter that leads to matches."),
                ("Chat turn.", "Tap use, must-haves and budget once; no retyping."),
                ("Card layout, price, rating, Black Friday tag.", "Every card shows the match; restored items hidden unless you ask."),
                ("The normal Walmart product page.", "Sparky shrinks to a small floating chat and offers questions about this laptop."),
                ("The page's own Add to cart button.", "Product questions answered on the page, with Verified / Good to know and the source."),
                ("Normal Walmart cart and checkout.", "A quick check right after adding: add-ons unchecked, total vs budget, one-line receipt.")]),
    dict(key="homedepot", name="Home Depot · Magic Apron", task="Find a Black Friday TV deal, the right size for my room.",
         proto=(fc("52:368"), fc("52:411")),
         before=["\"Show me Black Friday deals\" → Consulting the blueprint…", "Deals: impact wrench and a refrigerator", "Pages 3/4 of unrelated deals + suggested questions",
                 "Types \"On TV\" → TV deals 1/4", "Asks \"How do I choose the right size TV?\" → long text", "Text ends with more questions"],
         after=[("Header, disclaimer, outlined chips.", "A goal starter, not just \"deals\"."),
                ("Chat turn, chip style.", "Asks distance, budget and wall or stand before showing deals."),
                ("2-card carousel, outlined buttons, paging.", "Size advice in one line, fit on each card, sponsored labeled."),
                ("The normal Home Depot product page.", "Magic Apron shrinks to a small floating chat and offers questions about this TV."),
                ("The page's own Add to Cart button.", "Answers on the page, with the matching part, Verified / Good to know and the source."),
                ("Normal Home Depot cart and checkout.", "Flags the needed mount (shopper approves), Pro install stays optional, total vs budget.")]),
    dict(key="target", name="Target · Ask Target", task="Find a gift for a 5-year-old girl.",
         proto=(fc("53:338"), fc("53:381")),
         before=["Opens Ask Target: 3 generic starters", "Types \"I am looking for a gift for 5 year old girl\"", "Gets a summary + STEM kits carousel",
                 "Scrolls more categories: arts, games, active play", "Opens a scooter page; the chat is gone", "Lands on a generic \"Gift ideas\" page"],
         after=[("Header, disclaimer, \"How can we help?\", link starters.", "A goal-based starter."),
                ("Chat turn.", "Asks interests, budget and date before picking."),
                ("Product card style, badges, ratings.", "2 picks that match age, interests, budget and date, with why."),
                ("The normal Target product page.", "Ask Target stays as a small floating chat (not lost) and offers questions about this scooter."),
                ("The page's own Add to cart button.", "Product questions answered on the page, with Verified / Good to know and the source."),
                ("Normal Target cart and checkout.", "A quick check right after adding: helmet suggested but unchecked, total vs budget, one-line receipt.")]),
]
