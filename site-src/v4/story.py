# Case-study narrative layer: Problem → Goals → Solutions → Research & design → Reflection & outcome → Future scope.
# Every fact is already in ../v3/content.py; this file only reorganizes and rewords it.
# flows: (step, what happens, stall-or-fix label or "")

STORY = {}

STORY["jaihind"] = dict(
    scene="A whole day for 2 or 3 orders",
    scene_sub="Orders moved by phone calls and paper books, and each person tracked their own, so nobody could see the full picture.",
    goals=[("One record", "Enter each order once, so copies can't disagree."),
           ("Fewer errors", "Catch stock problems before an order moves, not after."),
           ("Fast at the counter", "Finish an order while the customer is still waiting.")],
    solutions_title="Four changes that made every order easy to follow",
    solutions=[("Enter an order once, and everyone sees where it is", "An order moves through Pending, Approved, In transit and Delivered in one place, so nobody has to call around to find it."),
               ("Stock gets checked before anyone approves", "The portal checks stock first, so a problem is caught before the order moves instead of after."),
               ("A sales order fits inside one phone call", "Four short steps replace one long form, so staff finish while the customer waits at the counter or on the line."),
               ("New customers get added without leaving the order", "If the caller isn't in the system, staff add them right inside the order, so nobody hits a \"No customer found\" dead end.")],
    research_title="How we got from 2 orders a day to 8",
    insight=("One order, typed many times", "The same order went into more than one place, so copies didn't match. Entering it once became the rule every screen followed."),
    flow_before=[("Customer calls", "Asks for a size, colour or item.", ""), ("Written in a book", "Staff note it by hand, in a paper file.", "Copies don't match"),
                 ("Call the supplier", "One call at a time.", "Biggest stall"), ("Track it yourself", "Each person tracks their own orders.", "Nobody sees it all")],
    flow_before_foot="2 to 3 orders a day",
    flow_after=[("Customer calls", "Order entered once, in 4 short steps.", "Fast start"), ("Stock check", "Runs before approval.", "Error caught early"),
                ("Send to supplier", "From the same order record.", "No re-typing"), ("Track by status", "Pending, Approved, In transit, Delivered.", "Everyone sees it")],
    flow_after_foot="7 to 8 orders a day",
    outcome_title="Workflows are people, not screens",
    outcome_sub="The slow parts were the handoffs between teams, which no single team could see until we mapped them.",
    goal_results=[("One record", "5 systems became 1"), ("Fewer errors", "27% fewer order errors"), ("Fast at the counter", "40% faster per order")],
    lesson="Design for the least sure user: big buttons and plain words helped people who had never used a work app.",
    future=[("Agent-drafted reorders", "An agent drafts supplier reorders from stock and sales, with the reason on every draft (\"Sold 14 this week, 3 left\"). Staff approve every one.")],
)

STORY["anchor"] = dict(
    scene="Tapping a card doesn't feel like spending",
    scene_sub="Forgotten subscriptions keep charging, and most money apps only chart the past, so people stop opening them.",
    goals=[("In the moment", "Help before a purchase, not in next month's report."),
           ("Explained", "Every AI suggestion shows why, and how sure it is."),
           ("Your call", "The AI suggests. The person decides.")],
    solutions_title="Three ways the coach earns trust",
    solutions=[("Every suggestion comes with its reason", "Each AI suggestion shows why and how confident it is, with Apply and No thanks side by side, so people stay in control."),
               ("Ask before you buy, not after", "You can ask the coach about a purchase in the moment, and it compares products, prices and stores within your budget."),
               ("A nudge, never a lecture", "Alerts stay gentle, because people said apps that scold them make them avoid money altogether.")],
    research_title="How we got from 22% to 100%, and kept people in charge",
    insight=("The trust condition", "People would trust AI only if it explained itself and left them the final say. That became a requirement for every AI screen."),
    flow_before=[("Spend", "Tap a card, money feels unreal.", ""), ("Forget", "Subscriptions keep charging.", "Silent leak"),
                 ("Open the app later", "Charts of the past, if at all.", "Biggest stall")],
    flow_before_foot="22% task success, round one",
    flow_after=[("Ask first", "Ask the coach before a purchase.", "In the moment"), ("See why", "Suggestion with reason and confidence.", "Trust fix"),
                ("Decide", "Apply, or say no thanks.", "Your call")],
    flow_after_foot="100% task success, round two",
    twist=("The AI was on screen in round one. People walked right past it.", "It sat in the bottom menu as one more tab. We made it a floating button on every screen, and AI task success reached 100% in round two."),
    outcome_title="People trust AI that explains itself and lets them say no",
    outcome_sub="Behavior told the real story: testers rated navigation 4.4 out of 5 while still missing buttons.",
    goal_results=[("In the moment", "Everyone finished the shopping task"), ("Explained", "6 of 8 fully trusted the AI"), ("Your call", "7 of 8 would rethink a purchase after an alert")],
    lesson="Watch, don't just ask. What people do in a test matters more than how they rate it.",
    future=[("Voice check-ins", "A ten-second spoken summary of the week, for people who avoid opening money apps."), ("Correct the AI in one tap", "Fix a wrong category with one tap, so suggestions get more personal over time.")],
)

STORY["ev"] = dict(
    scene="Every charging network wants its own app",
    scene_sub="Drivers can't tell if a charger works, fits their car, or feels safe at night until they get there.",
    goals=[("One wallet", "Find, check in and pay on any network, in one place."),
           ("Safe stops", "Know what's around a charger before driving to it."),
           ("Easy for beginners", "Someone new to EVs can find a charger fast.")],
    solutions_title="Three things every charging stop needed",
    solutions=[("Check in and pay once, on any network", "Pick a station, start charging and pay in one place, so drivers stop carrying a card per network."),
               ("See what's around the charger before you go", "Every station shows what's nearby before you drive there, because drivers worried about quiet stations at night and families need a place to stop."),
               ("Plan the trip with chargers already on it", "Enter where you're going and see chargers along the route with live traffic, where range anxiety peaks.")],
    research_title="How 16,767 reviews shaped one app",
    insight=("The Tesla benchmark", "Tesla rated highest (4.26 of 5) because chargers work and payment just happens. Experienced drivers measured every other flow against it."),
    flow_before=[("Pick a network", "A different app, card or membership.", "Stall"), ("Drive there", "Hope the charger works and fits.", "Biggest stall"),
                 ("Pay", "In that network's app only.", "Stall")],
    flow_before_foot="A different app for every network",
    flow_after=[("Plan the route", "Chargers on the way, live traffic.", "Fast start"), ("Check the stop", "Amenities and safety first.", "Trust fix"),
                ("Check in and pay", "One place, any network.", "No extra cards")],
    flow_after_foot="SUS 78.75 with 10 drivers",
    twist=("Payment was the slowest step for experienced drivers.", "They took 109.66 seconds and expected it to work like Tesla: set up once, then automatic. Payment now uses your default method, with a pay button that stays on screen. Built, not tested again."),
    outcome_title="Range anxiety is about trust, not batteries",
    outcome_sub="Reliable information calmed drivers more than a bigger battery would.",
    goal_results=[("One wallet", "Hardest task, redesigned after testing"), ("Safe stops", "Praised by every tester"), ("Easy for beginners", "SUS 89.5 and 5.46 s to find a charger")],
    lesson="Beginners and experts want different things: new drivers loved the simplicity, experienced drivers compared us to Tesla.",
    future=[("Warn before a dead charger", "Learn from driver reports and history, and warn you before you drive to a charger that is likely down.")],
)

STORY["ir2go"] = dict(
    scene="An official app people gave up on",
    scene_sub="IRS2Go was rated 2.8 stars, 45% of people quit before finishing a task, and no screen met WCAG 2.1 AA.",
    goals=[("No dead ends", "Every task finishes inside the app."),
           ("Right the first time", "Explain each field before people get it wrong."),
           ("Open to everyone", "No account to check a refund, and accessible to all.")],
    solutions_title="Three tasks that now finish inside the app",
    solutions=[("Every field explains itself before you type", "Each field has a label and an example, and a sample form shows where each answer is on your return, so people don't learn the rules by failing."),
               ("Your refund reads like a timeline", "Received, Approved, Sent replaces a bare \"Return Received\", so people see where they are and what comes next."),
               ("Pay without leaving the app", "Every payment option and its fee sits side by side in the app, instead of a jump to the website mid-payment.")],
    research_title="How usability went from 31 to 78",
    insight=("Rules you learn by failing", "The old form explained its rules only after people got them wrong: Tax Year looked like a text box, and the refund amount had to match to the cent."),
    flow_before=[("Log in", "Required, even to check a refund.", "Biggest stall"), ("Fill the form", "Placeholders instead of labels.", "Errors"),
                 ("Read the status", "\"Return Received\", no date.", "No next step"), ("Pay", "Sent out to the website.", "Dead end")],
    flow_before_foot="SUS 31.3",
    flow_after=[("Explore as a guest", "No account needed.", "Fast start"), ("Fill the form", "Labels, examples, a sample form.", "Right first time"),
                ("Read the timeline", "Received, Approved, Sent.", "Clear status"), ("Pay in the app", "Fees side by side, then a summary.", "No dead end")],
    flow_after_foot="SUS 78.25",
    twist=("Many people quit at the login screen.", "They wouldn't log in just to check a refund. \"Explore without signing in\" became the main button, and nobody dropped off there after the change."),
    outcome_title="A confusing screen costs trust in the agency, not just the app",
    outcome_sub="In a government app, every dead end makes people doubt the institution behind it.",
    goal_results=[("No dead ends", "No trips out to the website"), ("Right the first time", "SUS 31.3 to 78.25"), ("Open to everyone", "All redesigned screens pass WCAG 2.1 AA")],
    lesson="Guests first isn't a shortcut. It's how people reach the answer.",
    future=[("Plain-language answers", "Ask \"why is my refund late?\" and get a plain answer that links to the official source.")],
)

STORY["findme"] = dict(
    scene="Every sprint added a slightly different button",
    scene_sub="New screens shipped fast, and small drift crept in: a new spacing value, the same pattern solved twice.",
    goals=[("Findable", "Engineers can find the right component by name."),
           ("Complete", "Every state is defined, so nothing is guessed."),
           ("Consistent", "Two products share one library.")],
    solutions_title="Three habits that kept 2 products consistent",
    solutions=[("Name components the way engineers search", "Every name follows one pattern, Button / Primary / Medium / Default, so the library is easy to navigate."),
               ("Define every variant and state", "Default, hover, focus, disabled and loading are all designed, so built screens match designed ones."),
               ("Design inside the sprint, not ahead of it", "Joining backlog refinement and sprint planning meant design questions came up while they were cheap to answer.")],
    research_title="Research that fed straight into the wireframes",
    outcome_title="A library nobody can find doesn't get used",
    outcome_sub="Naming and states mattered as much as how the components looked.",
    goal_results=[("Findable", "Every handoff used library names"), ("Complete", "Built screens matched the designs"), ("Consistent", "25+ components across 2 products")],
    future=[("Off-spec checker", "AI that flags components used off-spec in Figma before they reach handoff.")],
)

STORY["canvas"] = dict(
    scene="Students were learning a version of UX that was already changing",
    scene_sub="The UX curriculum was built before AI, and it fell short of how UX is practiced now.",
    solutions_title="How the research reached the syllabus",
    solutions=[("Research and student feedback on one board", "Findings and feedback went onto shared Figma affinity boards across 2 cohorts, so real patterns stood out from one-off complaints."),
               ("Consolidate weekly, recommend monthly", "I consolidated findings with 10+ research assistants every week and presented recommendations to faculty every month, so research turned into decisions.")],
    research_title="Two semesters of evidence",
    outcome_title="Patterns, not one-off complaints",
    outcome_sub="Weekly synthesis and monthly recommendations kept findings moving into decisions.",
    goal_results=[("Result", "2 new UX courses")],
)

STORY["omkar"] = dict(
    scene="Buyers check the website before they pick up the phone",
    scene_sub="For a clothing-label maker, a broken page or an old listing costs trust with the people about to call.",
    solutions_title="What building it taught me",
    solutions=[("Raise the mismatch before release", "When the design file and the browser didn't match, I raised it early and traced layout bugs in Chrome DevTools, so fixes went to the cause, not the symptom.")],
    outcome_title="Every designer should build something",
    outcome_sub="I know which questions a handoff leaves open, because I used to be the one asking them.",
    goal_results=[("Result", "50+ catalog pages built, about 2 days each")],
)

STORY["research-lens"] = dict(
    scene="AI synthesis can't tell you who said it",
    scene_sub="Copy-and-paste means the model only sees what you happened to paste, and the output carries no citations.",
    goals=[("Traceable", "Every excerpt carries a participant ID, round and timestamp."),
           ("Honest counts", "Patterns count people, not quotes."),
           ("Humble", "It says what the data can't support.")],
    solutions_title="Five tools, one constraint: retrieve and count, never interpret",
    solutions=[("Count people, not quotes", "pattern_frequency counts distinct participants, because three quotes from one person is not a pattern."),
               ("Say what the data can't support", "draft_findings ends with a NOT SUPPORTED section that refuses causal claims on a small sample.")],
    outcome_title="AI research answers you can trace back to a person",
    outcome_sub="The server retrieves and counts. The researcher still writes the finding.",
    goal_results=[("Status", "Building, deploying next")],
)

STORY["magic-apron"] = dict(
    scene="Same question, two different answers",
    scene_sub="At home the assistant suggested hanging kits or adhesive strips. In Store Mode it showed only kits, and an empty shelf ended with \"Thanks for letting us know.\"",
    solutions_title="Six small changes, two shown here",
    solutions=[("Ask how you want to hang it, before showing products", "One question as a tap would have caught \"adhesive\" in my interview, instead of a long answer people read past."),
               ("After reporting an empty shelf, still get the item", "\"Still need it today?\" offers a similar item, a nearby store or delivery, with Undo.")],
    twist=("My first redesign changed too much of the app.", "I wireframed the whole journey in grayscale first. I kept the ideas and moved them onto the real screens instead."),
    outcome_title="One interview is a signal, not proof",
    outcome_sub="These are hypotheses to test. Next, I'd test with 5 first-time DIYers, at home and in the store.",
    goal_results=[("Status", "Concept, not affiliated with The Home Depot")],
)

# ---------------- explanatory diagrams, placed per section ----------------
def L(label, rows, verdict): return dict(label=label, rows=rows, verdict=verdict)

FIGS = {}

FIGS["jaihind"] = dict(
    problem=[dict(kind="scenario", title="Where one order lived",
        left=L("Before: phone, paper and 5 systems", [("Customer phone call", ""), ("Paper order book", "by hand"), ("Supplier call", "one at a time"), ("Each person's own tracking", "no full picture"), ("5 systems that didn't talk", "typed again")], "Typed many times, copies don't match"),
        right=L("After: 1 order record", [("Entered once", "4 short steps"), ("Stock checked", "before approval"), ("Sent to supplier", "same record"), ("Status everyone sees", "Pending → Delivered")], "1 place, one version of the truth"),
        cap="Before and after, for the same customer order.")],
    solutions=[dict(kind="steps", title="One order, four statuses everyone can see",
        items=[("Pending", "Entered once, at the counter or on a call"), ("Approved", "Only after the stock check"), ("In transit", "Sent to the supplier from the same record"), ("Delivered", "Tracked from the call to delivery")])],
    research=[dict(kind="pipeline", title="From store visits to a shipped portal",
        items=[("~200", "employees met in 10 stores, as a team"), ("80+", "interviews I ran myself"), ("Every handoff", "mapped across 6 teams"), ("Crazy 8s", "eight ideas in eight minutes"), ("Wireframes", "gray, desktop and phone"), ("Tested", "with staff, then fixed")],
        end=("10 heuristics", "audit of the live portal, each with a fix"))],
    results=[dict(kind="bars", title="Orders sent to suppliers in a day", maxv=8,
        items=[("Before (phone and paper)", 2.5, "2-3", False), ("After (one portal)", 7.5, "7-8", True)],
        cap="Measured before launch and after. Orders also got 40% faster and 27% less error-prone.")],
)

FIGS["anchor"] = dict(
    problem=[dict(kind="scenario", title="When does the help arrive?",
        left=L("A typical money app", [("You tap your card", "feels free"), ("The statement arrives", "weeks later"), ("A chart of the past", "if you open it")], "Help arrives after the money is gone"),
        right=L("Money Anchor", [("You ask before buying", "in the moment"), ("The coach explains why", "with confidence"), ("You decide", "apply or no thanks")], "Help arrives before you spend"),
        cap="Most budgeting apps report on spending. The coach steps in at the moment of the decision.")],
    solutions=[dict(kind="steps", title="Three steps from a question to a decision",
        items=[("Ask the coach", "\"How much can I safely spend today?\""), ("See the reason", "Every suggestion shows why and how sure it is"), ("Decide", "Apply the change, or say no thanks")])],
    research=[dict(kind="funnel", title="From 40+ papers to 10 features in the prototype",
        items=[("40+", "research papers, summarized and analyzed with AI"), ("10", "budgeting apps benchmarked"), ("24", "people: 8 interviews and 16 in 4 focus groups (IRB-approved)"), ("100", "ideas written by our team of 4"), ("64", "after sorting into 7 themes"), ("10", "features in the prototype")])],
    results=[dict(kind="bars", title="Round one vs round two, 8 testers each", maxv=100, unit="%",
        items=[("Task success, round 1", 22, "22", False), ("Task success, round 2", 100, "100", True), ("Misclicks, round 1", 29, "29", False), ("Misclicks, round 2", 0, "0", True)],
        cap="Exploring the app. After the AI got its own button and buttons got labels.")],
)

FIGS["ev"] = dict(
    problem=[dict(kind="scenario", title="One road trip, two ways",
        left=L("Today", [("Tesla app", "own network"), ("ChargePoint app or card", "own network"), ("Electrify America app", "own network"), ("EVgo app", "own network"), ("PlugShare", "info, no payment")], "5 apps, and you still can't tell if it works"),
        right=L("One app", [("Plan the route", "chargers on the way"), ("Check the stop", "what's nearby"), ("Check in", "any network"), ("Pay", "one wallet")], "1 app for the whole stop"),
        cap="The networks we compared in our competitive audit.")],
    solutions=[dict(kind="steps", title="Four steps for every charging stop",
        items=[("Plan the route", "Chargers along the way, with live traffic"), ("Check the stop", "See what's nearby before you drive there"), ("Check in", "Pick a free charger, no RFID card"), ("Pay", "One payment method for every network")])],
    research=[dict(kind="pipeline", title="From 16,767 reviews to a fair comparison",
        items=[("16,767", "Google Maps reviews of US stations"), ("Cleaned", "empty, duplicate, closed and very short reviews removed"), ("12 months", "recent, US only"), ("Tagged", "by network, with AI-assisted Python in Colab")],
        end=("400", "reviews sampled, 80 per network")),
        dict(kind="bars", title="Average rating by network, 400-review sample", maxv=5,
        items=[("Tesla", 4.26, "4.26", True), ("ChargePoint", 3.76, "3.76", False), ("Other", 3.34, "3.34", False), ("Electrify America", 3.32, "3.32", False), ("EVgo", 3.25, "3.25", False)],
        cap="Out of 5 stars. Tesla's lead pointed at what drivers expect everywhere: chargers that work and payment that just happens."),
        dict(kind="table", title="What existing apps did, and didn't",
        cols=["PlugShare", "Network apps", "Our app"],
        rows=[["Information for every network", True, False, True], ["Pay for a charge", False, "Own network only", True], ["Safety and amenities up front", False, False, True]],
        cap="From our competitive audit of Tesla, ChargePoint, Electrify America, PlugShare and EVgo.")],
    results=[dict(kind="bars", title="Usability score (SUS) with 10 drivers", maxv=100, ref=(68, "68 is the common average"),
        items=[("New to EVs", 89.5, "89.5", True), ("Experienced", 68.0, "68.0", False), ("Everyone", 78.75, "78.75", True)])],
)

FIGS["ir2go"] = dict(
    problem=[dict(kind="menu", title="Seven equal choices became three clear ones",
        cap="People open the app for three things, so the home screen offers exactly those three.")],
    solutions=[dict(kind="steps", title="Every task now finishes inside the app",
        items=[("Explore as a guest", "No account to check a refund"), ("Pick a task", "Refunds, Payments or Tax Help"), ("Fill it right", "Labels, examples and a sample form"), ("Finish here", "A status timeline, or pay with fees shown")])],
    research=[dict(kind="pipeline", title="Where the research came from",
        items=[("150+", "App Store reviews"), ("200+", "Quora posts"), ("~10", "taxpayer interviews"), ("1", "survey"), ("Papers", "summarized with AI")],
        end=("Every step", "written out, to find where each task broke"))],
    results=[dict(kind="bars", title="Usability score (SUS), same tasks, old app vs redesign", maxv=100, ref=(68, "68 is the common average"),
        items=[("Old app", 31.3, "31.3", False), ("Redesign", 78.25, "78.25", True)])],
)

FIGS["findme"] = dict(
    problem=[dict(kind="drift", title="What drift looks like, and what fixed it")],
    solutions=[dict(kind="anatomy", title="Every component named the way engineers search",
        parts=[("Button", "component"), ("Primary", "variant"), ("Medium", "size"), ("Default", "state")],
        cap="Illustrates the naming method. FindMe's library itself is private.")],
)

FIGS["canvas"] = dict(
    research=[dict(kind="pipeline", title="How two semesters of research reached the syllabus",
        items=[("50+", "papers and industry reports, with UM-GPT"), ("43", "students' feedback across 8 presentations"), ("2 cohorts", "mapped on shared Figma affinity boards"), ("Weekly", "consolidated with 10+ research assistants"), ("Monthly", "recommendations to faculty")],
        end=("2", "new UX courses"))],
)

FIGS["omkar"] = dict(
    solutions=[dict(kind="pipeline", title="The loop, repeated for every page",
        items=[("Design file", "from the designers"), ("Build", "about 2 days per page"), ("Check", "against the design, in Chrome DevTools"), ("Hand off", "to the lead developers")],
        end=("50+", "catalog pages"))],
)

FIGS["research-lens"] = dict(
    problem=[dict(kind="scenario", title="Three quotes are not three people",
        left=L("Counting quotes", [("Quote 1", "participant A"), ("Quote 2", "participant A"), ("Quote 3", "participant A")], "Looks like a pattern: 3"),
        right=L("Counting participants", [("Participant A", "3 quotes"), ("Distinct people", "1")], "Actually 1 person"),
        cap="Illustrative example. pattern_frequency counts distinct participants, not quotes.")],
    solutions=[dict(kind="pipeline", title="How a question travels",
        items=[("AI assistant", "asks a research question"), ("Research Lens", "5 tools: search, quotes by theme, pattern frequency, compare rounds, draft findings"), ("Repository", "sessions, segments, rounds, tagged excerpts")],
        end=("Every answer", "with participant ID, round and timestamp"))],
)

FIGS["magic-apron"] = dict(
    problem=[dict(kind="scenario", title="Same question, asked in two places",
        left=L("Store Mode", [("Hanging kits", "only option"), ("Adhesive strips", "only after typing it")], "The person had to ask again"),
        right=L("Home tab", [("Hanging kit", ""), ("Adhesive strips", "no holes")], "Two options, one answer"),
        cap="\"I have a 24×28 photo frame and need to hang it on a wall. What products should I buy?\"")],
)
