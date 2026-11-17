"""Research artifacts pulled from Siddhi's Google Drive, transcribed as written there.
Each block names its source so every claim on the page can be traced back. Participant names are left out.

Placement keys: "empathize", "define", "ideate", "design", "test".
"""

IRS_SRC = "Team LUCID deck, IRS2Go Redesign Phase 2"
EV_SRC = "Team sheet, Pain Points for EV Charging"
EV_TEST = "Team sheet, EV Charging App Task Analysis Survey"
MA_SRC = "Team deck, Money Anchor Conceptual Design"

ARTIFACTS = {
    "ir2go": {
        "empathize": [
            {"type": "issues", "title": "Pain points in the 3 tasks we chose", "src": IRS_SRC, "cols": [
                ("Check refund", ["The most frequently used task", "Inconsistent input fields", "Lack of standardization"]),
                ("Make payment", ["Excessive web redirection", "Inefficient process", "No way to store payment details"]),
                ("Free tax help", ["Limited help focus", "No guidelines for refunds and payments"]),
            ]},
            {"type": "steps", "title": "Task analysis of the current app", "src": IRS_SRC, "note": "Every step a taxpayer took, with the friction we logged.", "cols": [
                ("Refund status", [
                    ("Open the IRS2Go app", ""), ("Read the text instructions", ""), ("Tap the Tax Year box", ""),
                    ("Choose the year from the list", "Looks fillable, but has to be selected"), ("Fill SSN box 1", ""), ("Fill SSN box 2", ""),
                    ("Fill SSN box 3", ""), ("Tap Filing Status", ""), ("Choose an option from the list", "Looks fillable, but has to be selected"),
                    ("Fill in the refund amount", "No rounding: it must be exact"), ("Get status", "")]),
                ("Pay by card or wallet", [
                    ("Open the IRS2Go app", ""), ("Tap Payment", ""), ("Choose debit card, credit card or digital wallet", ""),
                    ("Redirected to the IRS website", "Leaves the app"), ("Read instructions and scroll", "Multiple embedded links"),
                    ("Read processor 1 information", ""), ("Read processor 2 information", ""), ("Choose a processor", ""),
                    ("Tap Make a Payment", "Redirected again"), ("Choose personal or business tax", "Redirected again"),
                    ("Read instructions and fill the form", ""), ("Cannot pay", "Task fails")]),
                ("Free tax help", [("Open the IRS2Go app", ""), ("Tap Free Tax Help", ""), ("Pick from a list of options", "No help for refunds or payments")]),
            ]},
        ],
        "define": [
            {"type": "scenarios", "title": "User scenarios", "src": IRS_SRC, "items": [
                ("Refund status", "A young adult filing taxes for the first time", "He files on the IRS website, then installs IRS2Go to keep checking his refund. He enters his details from the dropdowns and submits to see where his refund stands."),
                ("Payment", "The same taxpayer, now owing money", "After checking his refund he realizes he owes the IRS. He opens Payment, picks a method, enters his details and confirms the transaction."),
                ("Tax help", "A senior citizen with a pile of tax documents", "Confused by the paperwork, he opens Tax Help, finds the Free Tax Prep Site Locator, enters his ZIP code and sees nearby locations on a map."),
            ]},
        ],
        "design": [
            {"type": "steps", "title": "Task analysis of the new design", "src": IRS_SRC, "note": "The same tasks after the redesign. Changes are in the notes.", "cols": [
                ("Refund status", [("Read the instructions", "Sample form available"), ("Tap Tax Year", ""), ("Choose the year from the list", ""),
                                   ("Fill the SSN box", "Show or hide option"), ("Tap Filing Status and choose", ""), ("Fill in the refund amount", "Example provided"), ("Get status", "")]),
                ("Payment", [("Pay with bank account", "In the app"), ("Pay with debit or credit card", "Processors compared side by side"), ("Make payment", "")]),
                ("Help", [("IRS Direct File", "Short description and a link"), ("IRS Free File", "Short description and a link"), ("Free Tax Prep", "Short description and a link"), ("Search", "New")]),
            ]},
        ],
    },
    "ev": {
        "empathize": [
            {"type": "matrix", "title": "Pain points across 11 research sources", "src": EV_SRC,
             "note": "We reviewed peer-reviewed papers, industry studies and driver forums, and marked which pain points each one raised.",
             "cols": ["Range anxiety", "Charging speed", "Car compatibility", "Chargers working", "Safety", "Ease of access", "Payment"],
             "groups": [
                 ("Peer-reviewed", [("Mental models guide EV charging", [1, 1, 1, 0, 0, 1, 0]),
                                    ("Fast-charging stations: challenges and issues", [0, 1, 1, 1, 0, 0, 0]),
                                    ("Locating EV charging stations", [1, 0, 1, 1, 0, 1, 0]),
                                    ("How people value EV charging service", [1, 1, 0, 0, 0, 0, 0]),
                                    ("Charging infrastructure and gender equality", [1, 0, 0, 1, 1, 0, 0])]),
                 ("Industry", [("EVX Public Charging Study", [0, 1, 0, 1, 0, 0, 1]),
                               ("Improving EV charging on long journeys (BP)", [1, 1, 1, 1, 1, 1, 0]),
                               ("Plug In America Report 2023", [1, 1, 1, 1, 0, 0, 0])]),
                 ("Anecdotal", [("Payment methods", [1, 1, 0, 1, 0, 0, 1]),
                                ("r/electricvehicles", [0, 0, 0, 0, 0, 0, 1]),
                                ("r/Ioniq5 thread on US charging", [0, 1, 0, 1, 0, 1, 1])]),
             ]},
        ],
        "define": [
            {"type": "issues", "title": "From pain point to idea", "src": EV_SRC, "cols": [
                ("Range anxiety", ["Use car data, weather and charger properties to calculate range for the distance entered"]),
                ("Reliability", ["Calculate charging time from charger properties and live data", "Show options that fit the car, with cost and charger level filters", "Track live charger status and explore reservations"]),
                ("Location and amenities", ["List lighting, parking, washrooms and nearby cafes with their hours", "An emergency button that shares location"]),
                ("Network compatibility", ["One way to pay across every charging network"]),
            ]},
        ],
        "test": [
            {"type": "compare", "title": "Find a nearby charger, by driver type", "src": EV_TEST, "rows": [
                ("People planning to own an EV", "5.46 s", "1.2 out of 5"),
                ("People who own an EV", "6.19 s", "1.3 out of 5")],
             "heads": ("Group", "Average time", "Difficulty (1 is easy)")},
        ],
    },
    "anchor": {
        "define": [
            {"type": "scenarios", "title": "Storyboard personas", "src": MA_SRC,
             "note": "Two narrative personas we used to walk Money Anchor through real-life money moments.", "items": [
                ("Storyboard 1", "Jordan, the mindful spender", ""),
                ("Storyboard 2", "Maya, a new user", "")]},
            {"type": "map", "title": "From interview quotes to design decisions", "src": MA_SRC, "rows": [
                ("Something simple and easy to see", "Clear progress bars and a budget snapshot on the dashboard"),
                ("I use my banking app to see what I spend", "A bank-like view that matches what people already know"),
                ("Seeing weekly spend could stop me overspending", "Real-time categorized transactions with trend alerts"),
                ("AI telling me I overspent would be very helpful", "A conversational AI with personal, transparent nudges"),
                ("I want a pie chart report of my spending", "Monthly visual spending reports with full breakdowns")]},
        ],
        "ideate": [
            {"type": "funnel", "title": "Ideation and brainstorming", "src": MA_SRC, "steps": [
                ("100", "ideas: 4 team members, 25 each"), ("64", "kept in the Idea Book after a voting rubric"), ("4", "top ideas carried into design")],
             "chips": ["Proactive awareness", "Emotional motivation", "AI trust", "Simplification", "Accountability", "Real-life goals"]},
            {"type": "pair", "title": "What made the cut", "src": MA_SRC,
             "a": ("Top ideas", ["Budget builder and savings tracker", "AI-powered predictions", "Subscription cancellation", "Automatic transaction categories"]),
             "b": ("Set aside as out of reach", ["AR affordability scores", "Emotion-tracking app", "Biometric card lock"])},
            {"type": "process", "title": "Low-fidelity process", "src": MA_SRC, "steps": [
                ("Research insights", "Interviews and focus groups pointed to simplicity, clarity and AI."),
                ("Sketches", "Hand-drawn layouts for flows, navigation and key screens."),
                ("Wireframes", "Digital screens in Figma: budget, accounts, AI assistant, transactions."),
                ("Lo-fi prototype", "A clickable Figma prototype linking every screen for testing.")]},
            {"type": "ia", "title": "Information architecture", "src": MA_SRC, "root": "Money Anchor",
             "note": "5 core sections, shaped to match the banking apps people already use.",
             "kids": ["Dashboard", "Accounts", "AI Chatbot", "Transactions", "Spending Report"]},
            {"type": "chips", "title": "Style guide", "src": MA_SRC, "items": ["Built in Figma", "Inter", "Helvetica"]},
        ],
        "test": [
            {"type": "issues", "title": "Limits of this research, and what we learned", "src": MA_SRC, "cols": [
                ("Limitations", ["Small sample: interviews may not represent all young adults", "Participants may have given socially desirable answers", "Time limited research depth and iterations", "Fast-changing AI tools affected consistency"]),
                ("Lessons learned", ["Simplicity wins: complex features confuse", "Working directly with users produced the strongest designs", "Stress and motivation shape money behavior", "Prototyping early caught major issues before hi-fi"]),
            ]},
        ],
    },
}


FC_SRC = "My screen recordings of Ask Blue, Sparky, Magic Apron and Ask Target, Oct to Nov 2026"
HDMA_SRC = "My recorded session with a first-time DIYer, Oct 2026"
ARTIFACTS["fitcheck"] = {
    "empathize": [
        {"type": "matrix", "title": "Same task, four assistants", "src": FC_SRC, "total": "Problems found, out of 4", "rowhead": "What I saw",
         "note": "What happened on each assistant when I gave it the same shopping task.",
         "cols": ["Ask Blue", "Sparky", "Magic Apron", "Ask Target"], "groups": [
            ("Seen in my recordings", [("Deals shown before any question", [1, 1, 1, 1]), ("Specs retyped in prose", [1, 1, 1, 1]),
                                       ("Ads mixed into the picks", [1, 1, 1, 1]), ("Chat lost on the product page", [1, 1, 1, 1])])]},
    ],
    "define": [
        {"type": "pair", "title": "What my review caught, and what the studies added", "src": "My recordings, then NN/g and Baymard usability studies (2025 to 2026)",
         "a": ("From my recordings", ["Answers before asking", "The shopper does the checking", "The chat gets lost on product pages", "No reason to trust the picks"]),
         "b": ("Missed until I read the studies", ["An unlabeled launcher", "No sign of what the assistant could see", "Nothing marked as unverified", "No way to reach a person"])},
    ],
}
ARTIFACTS["magic-apron"] = {
    "empathize": [
        {"type": "pair", "title": "Same question, two answers", "src": HDMA_SRC,
         "a": ("Home tab", ["Suggested hanging kits or adhesive strips"]),
         "b": ("Store Mode", ["Showed only hanging kits", "Adhesive strips appeared only after typing \"Adhesive\"", "An empty shelf ended with \"Thanks for letting us know\""])},
    ],
}
ARTIFACTS["findme"] = {
    "empathize": [
        {"type": "process", "title": "From research to the library", "src": "My internship work at FindMe, May to Aug 2025", "steps": [
            ("Test", "12+ user interviews and usability tests in Maze."),
            ("Tag", "Findings tagged in Dovetail."),
            ("Wireframe", "Findings fed straight into the wireframes."),
            ("Systemize", "25+ components named Button / Primary / Medium / Default."),
            ("Build", "Every state defined, worked with developers until built matched designed.")]},
    ],
}

# The marketing website navigation, read from the live jaihindretail.com menu (Nov 2026).
SITENAV = {
    "jaihind": {
        "url": "https://jaihindretail.com",
        "menu": [("Home", []),
                 ("About", ["Legacy", "Awards & achievements", "History", "Gift vouchers", "CSR & events"]),
                 ("Collections", ["Casual wear", "Formal wear", "Ethnic wear", "Occasion wear", "Blazers & suits", "Fabrics", "Accessories", "Custom tailoring"]),
                 ("Brands", ["JaiHind", "Mewar"]),
                 ("Corporate", []),
                 ("Customer services", ["Careers"])],
        "points": [
            ("6 top-level items", "Everything a shopper or job seeker needs sits behind 6 labels, so the menu fits one phone screen without scrolling."),
            ("Shop in 2 taps", "Collections opens straight into 8 categories, including custom tailoring, so a shopper reaches any category in 2 taps."),
            ("Two brands, one site", "JaiHind and its sister brand Mewar each get their own page under Brands instead of competing on the home page."),
            ("Company story kept apart", "Legacy, awards, history and CSR live under About, so they don't crowd the shopping path."),
        ],
    },
}
