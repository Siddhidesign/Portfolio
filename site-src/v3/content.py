# Minimal portfolio content. Every number here comes from the existing case studies,
# the resume, or facts Siddhi confirmed. Nothing is invented.
# Case structure follows the brief: problem first, one line of "why" under every key screen,
# one idea I rejected and why, then the result.
#
# *text* = italic accent, **text** = bold.

A = "assets/"

SITE = dict(
    name="Siddhi Manche",
    role="UX Researcher and Designer",
    title="I turn messy *data* into workflows people *trust*.",
    intro=[
        "I started as a front-end developer, building catalog pages from designers' files. At **JaiHind-India** I moved into design: our team interviewed about 200 store employees, and I redesigned how orders move from the counter to the supplier.",
        "My M.S. in Human-Centered Design at **UM-Dearborn** added AI to my research. I use it to read thousands of reviews, transcripts and papers, then I check every finding myself before it shapes a design.",
    ],
    status="Open to UX research and product design roles in the US",
    email="manche.siddhi@gmail.com",
    linkedin="https://www.linkedin.com/in/siddhi-manche",
    github="https://github.com/Siddhidesign",
    resume="resume.pdf",
    photo=A + "v2/siddhi-grad.jpg",
)

HOW = [
    ("Go where the work happens", "Store floors, phone calls, real screens. I watch the task before I redraw it."),
    ("Let AI do the heavy reading", "Thousands of reviews, transcripts and papers, sorted into themes in hours."),
    ("Check every finding myself", "Every AI theme goes back to the raw quotes before it becomes a decision."),
    ("Measure what the team feels", "Orders a day, errors, task success. Numbers people already care about."),
]

TOOLS = [
    ("Research", ["Dovetail", "Maze", "Google Colab", "Python", "UM-GPT", "Figma affinity boards"]),
    ("Design", ["Figma", "Figma Make", "Prototyping", "Design systems"]),
    ("Build", ["HTML, CSS, JavaScript", "TypeScript", "Git", "Claude Code"]),
    ("Team", ["Jira", "Agile sprints", "WCAG 2.1 AA"]),
]

WORDS = [
    ("Siddhi designs with empathy. She took the time to understand our employees and how they work, and designed around them. She has a great understanding of users.",
     "Priyanka Jain", "Siddhi’s manager at JaiHind-India"),
    ("Siddhi brought a rare mix of curiosity and rigor to our team. She dug into the research, listened carefully to users, and turned messy problems into clear, thoughtful design decisions.",
     "Shabaan Hossain", "Founder of FindMe"),
]

# Home page order: work experience first (newest first), then academic projects, then side projects.
EXPERIENCE = ["canvas", "findme", "jaihind", "omkar"]
PROJECTS = ["anchor", "ev", "ir2go"]
SIDE = ["research-lens", "magic-apron"]
FEATURED = EXPERIENCE + PROJECTS

CASES = {}

CASES["jaihind"] = dict(
    role="Product UX Designer", dates="Feb 2023 to Jul 2024",
    org="JaiHind-India", year="2023 to 2024", kind="B2B internal tool",
    card="Cutting order errors 27% for a 10-store retailer",
    line="One order portal for about 200 employees, replacing phone calls, paper books and 5 systems.",
    tags=["B2B workflow", "Field research", "Internal tool"],
    cover=A + "jaihind/jh-13-final-dashboard.jpg", cover_alt="The redesigned staff dashboard on desktop and phone.", cover_fit="top",
    title="One order portal for *200 employees*",
    meta=[("Role", "Product UX Designer"), ("Timeline", "Feb 2023 to Jul 2024"), ("Team", "3 designers, 1 PM, developers"), ("I owned", "Supplier ordering, customer orders, order tracking")],
    tldr=[("Problem", "Orders moved by phone and paper. A whole day went into 2 or 3 supplier orders, and orders got lost."),
          ("What I did", "Interviewed store staff, mapped every handoff, and designed one portal where an order is entered once and tracked to delivery."),
          ("Result", "Orders sent a day went from 2 to 3 to 7 to 8, with 27% fewer errors and 1 system instead of 5.")],
    metrics=[("27%", "fewer order errors"), ("2-3 → 7-8", "supplier orders a day"), ("40%", "faster per order"), ("5 → 1", "systems per order")],
    problem=["Every order took the same route. A customer called the store, staff wrote it in a paper book, then called the supplier, one call at a time. Each person tracked their own orders, so nobody saw the full picture.",
             "Staff were good at their jobs. The tools were the problem."],
    problem_img=(A + "jaihind/jh-02-before-dashboard.jpg", "The old dashboard before the redesign."),
    research=dict(
        text="Before drawing a screen, our team of 3 designers met employees in all 10 stores. Together we talked to about 200 people across sales, managers, purchasing, tailoring, HR and the owner. I ran 80+ of those interviews myself.",
        findings=["Staff work on their feet, from phones, often with a customer waiting.", "The same order was typed into more than one place, so copies didn't match.", "Most had never used a work app before."],
        img=(A + "jaihind/jh-08-sketches.jpg", "Crazy 8s sketches on paper.")),
    decisions=[
        dict(title="Enter an order once, follow it to the end", img=None,
             why="The work is complex, so the system should carry it. Staff see one order moving through Pending, Approved, In transit and Delivered.", result="5 systems became 1"),
        dict(title="Check stock before approving", img=None,
             why="Stock problems used to surface after an order had already moved. Catching them first prevents the error instead of fixing it.", result="27% fewer order errors"),
        dict(title="A sales order in 4 short steps", img=(A + "jaihind/jh-18-prototype-mobile.jpg", "Phone screens: new order steps, delivery map and order status."),
             why="Each step is short enough to finish while the customer waits at the counter or on the phone.", result="40% faster per order"),
        dict(title="Add a new customer inside the order", img=None,
             why="On a phone order the caller is still on the line, so adding them can't send staff to another screen.", result="Part of the 4-step order"),
    ],
    rejected=[("One-click approval, with stock checked later", "It was quicker to tap, but stock problems showed up after the order had already moved. Checking first prevents the wrong order instead of fixing it."),
              ("One long order form", "Staff take orders standing at the counter or on a call. A long form can't be finished while someone waits.")],
    results=dict(rows=[["Orders sent to suppliers a day", "2 to 3", "7 to 8"], ["Time to record the day's orders", "A full day", "Half a day"], ["Time per order", "Baseline", "40% faster"], ["Order errors", "Baseline", "27% fewer"], ["Systems to move one order", "5", "1"]],
                 note="After launch we audited the live portal against 10 usability heuristics and logged each finding with a fix.",
                 img=(A + "v2/jh-audit.webp", "Audit board: 10 findings, each with impact, heuristic and fix.")),
    next=["An agent drafts supplier reorders from stock and sales, with the reason on every draft (\"Sold 14 this week, 3 left\"). Staff approve every one."],
    links=[("Figma example, all 26 flows", "https://www.figma.com/design/jkcD5ZIdXz9MUkG3va5sIo/Untitled?node-id=190-2")],
)

CASES["anchor"] = dict(
    org="M.S. capstone", year="2025 to 2026", kind="AI product · Fintech",
    card="Designing an AI budgeting coach people trust",
    line="IRB-approved study with 24 participants. 6 of 8 testers fully trusted the AI's advice.",
    tags=["AI", "Research", "Fintech"],
    cover=A + "live/anchor.jpg", cover_alt="Money Anchor screens: budget, AI assistant and insights.",
    title="An AI budgeting coach people *trust*",
    meta=[("Role", "UX Researcher and Designer"), ("Timeline", "2025 to 2026"), ("Team", "4 designers"), ("Study", "IRB-approved, protocol HUM00280873")],
    tldr=[("Problem", "Tapping a card doesn't feel like spending, and most budgeting apps only chart the past, which people avoid opening."),
          ("What I did", "Led research and designed the AI coach and budget flows: a coach that speaks up before you spend and explains why."),
          ("Result", "In round two, task success exploring the app reached 100% (from 22%), and 6 of 8 testers fully trusted the AI.")],
    metrics=[("24", "participants, IRB-approved"), ("75%", "fully trusted the AI (6 of 8)"), ("22% → 100%", "task success exploring the app"), ("40+", "papers summarized with AI")],
    problem=["Cards and digital wallets remove the small pain of paying. Forgotten subscriptions keep charging. And most money apps feel like a report card, so people stop opening them."],
    quotes=["I spend more when I'm bored. Surfing online equals unnecessary spending.", "If my friends are going out, I'm going out too."],
    research=dict(
        text="I summarized and analyzed 40+ research papers with AI, and we benchmarked 10 budgeting apps. Then we interviewed 8 people aged 20 to 32 and ran 4 focus groups with 16 more.",
        findings=["People don't need more graphs. They need money in context.", "Forgotten subscriptions were a big, silent leak.", "People would trust AI only if it explained itself and left them the final say."],
        img=("cases/img/moneyanchor/affinity-map.jpg", "Affinity map of research notes grouped into themes.")),
    decisions=[
        dict(title="Explain every suggestion", img=(A + "v2/anchor-explain.webp", "AI card suggesting a smaller grocery budget, with confidence and Apply or No thanks."),
             why="People wanted the reason and the final say. Each suggestion shows why and how sure the AI is, and you apply it or say no.", result="6 of 8 fully trusted the AI"),
        dict(title="Help before you buy, not after", img=(A + "moneyanchor/ai-anchor.png", "AI Anchor chat with suggested questions."),
             why="Spending decisions happen in the moment, so you can ask the coach before a purchase, not read about it next month.", result="Everyone finished the shopping task"),
        dict(title="A nudge, not a lecture", img=None,
             why="People said apps that scold them make them avoid money altogether, so alerts are gentle and the decision stays yours.", result="7 of 8 would rethink a purchase after an alert"),
    ],
    rejected=[("The AI as one tab in the bottom menu", "In round one people walked right past it. It became a floating button on every screen, and AI task success reached 100%."),
              ("Plus and minus icons for income and expenses", "Testers misread them. Labeled buttons, Adjust Income and Add Expense, took misclicks from 29% to 0%.")],
    results=dict(rows=[["Task success exploring the app", "22%", "100%"], ["Misclicks on that task", "29%", "0%"], ["Fully trusted the AI's advice", "", "6 of 8"]],
                 note="Still open: adjusting a budget caused 54.7% misclicks in round two. We added Adjust to each budget's menu but didn't test it again.", img=None),
    next=["Voice check-ins: a ten-second spoken summary of the week.", "One tap to correct a wrong category, so suggestions get more personal."],
    links=[],
)

CASES["ev"] = dict(
    org="Human Factors course", year="2024", kind="Research · Mobility",
    card="Finding what breaks EV charging, in 16,767 reviews",
    line="AI-assisted review analysis, then one app for every charging network, tested with 10 drivers.",
    tags=["Data research", "AI analysis", "Mobile"],
    cover=A + "live/ev.jpg", cover_alt="Trip planning screens with chargers along the route.",
    title="One app for *every charger*",
    meta=[("Role", "UX Designer"), ("Timeline", "Fall 2024"), ("Team", "4 students"), ("Tools", "Google Colab, Python, Figma")],
    tldr=[("Problem", "Drivers juggle an app, card or membership per network and can't tell if a charger works until they arrive."),
          ("What I did", "Started from 16,767 Google Maps reviews cleaned in Google Colab, found what drivers trust, and designed one app to find, check in and pay."),
          ("Result", "Usability score of 78.75 with 10 drivers, and 89.5 from people new to EVs.")],
    metrics=[("16,767", "reviews collected and cleaned"), ("78.75", "usability score (SUS)"), ("89.5", "SUS, new EV drivers"), ("5.46 s", "to find a charger")],
    problem=["Each charging network wants its own app. Drivers can't see whether a charger works, fits their car, or feels safe at night until they get there."],
    research=dict(
        text="We collected 16,767 Google Maps reviews of US charging stations, cleaned them with AI-assisted Python in Google Colab, and compared 80 reviews per network. We also reviewed studies since 2012 and compared 5 charging apps.",
        findings=["Tesla rated highest (4.26) because chargers work and payment just happens.", "Apps covering every network had information but no way to pay.", "No app put safety and amenities first."],
        img=(A + "ev/ratings-by-network.png", "Average rating by network with 95% confidence intervals.")),
    decisions=[
        dict(title="One payment for every network", img=(A + "ev/ev-checkin.png", "Check-in screens: pick a station and start charging without a card."),
             why="Each network wanted its own app or card. Here you check in and pay in one place.", result="Hardest task, so it changed after testing"),
        dict(title="Show what's around the charger", img=(A + "v2/ev-amen.webp", "Station screen with nearby food listed."),
             why="Drivers worry about quiet stations at night, and families need a place to stop.", result="Praised by every tester"),
        dict(title="Plan the trip with chargers included", img=None,
             why="Range anxiety peaks on long trips, so chargers show along the route with live traffic.", result="New drivers praised how simple it was"),
    ],
    rejected=[("Paying step by step at every stop", "Experienced drivers took 109.66 seconds and expected it to work like Tesla: set up once, then automatic. Payment now uses your default method."),
              ("The label \"phantom battery\"", "It confused people. It became \"stand-by\".")],
    results=dict(rows=[["People new to EVs", "", "SUS 89.5"], ["Experienced drivers", "", "SUS 68.0"], ["Everyone", "", "SUS 78.75"]],
                 note="The two changes above were built but not tested again.", img=None),
    next=["Warn drivers before they drive to a charger likely to be down, using reports and history."],
    links=[("Figma file", "https://www.figma.com/design/iQ43CH3FjQVDSkjKN35Zld/EV-Charging-prototype?node-id=0-1")],
)

CASES["ir2go"] = dict(
    org="HCI course", year="2025", kind="Gov tech · Accessibility",
    card="Taking the IRS app's usability from 31 to 78",
    line="Rebuilt refund, payment and tax-help flows for a 2.8-star app where 45% quit mid-task.",
    tags=["Gov tech", "Accessibility", "Research"],
    cover=A + "live/ir2go.jpg", cover_alt="Redesigned IRS2Go screens: welcome, refund form and status.",
    title="Making the IRS app *easy to use*",
    meta=[("Role", "UX/UI Designer"), ("Timeline", "Winter 2025, 4 months"), ("Team", "5 students"), ("I owned", "Research, refund and payment flows, accessibility")],
    tldr=[("Problem", "IRS2Go was rated 2.8 stars, 45% of people quit before finishing a task, and no screen met WCAG 2.1 AA."),
          ("What I did", "Mined 350+ reviews and posts, interviewed about 10 taxpayers, and redesigned the 3 tasks people open the app for."),
          ("Result", "Usability score went from 31.3 to 78.25, and every redesigned screen passed WCAG 2.1 AA.")],
    metrics=[("31.3 → 78.25", "usability score (SUS)"), ("350+", "reviews and posts analyzed"), ("100%", "screens pass WCAG 2.1 AA"), ("In-app", "payment, no trips to the website")],
    problem=["People open IRS2Go to check a refund, pay, or find free help. Forms rejected correct details, payments bounced out to the website, and help didn't cover refunds or payments."],
    research=dict(
        text="I analyzed 150+ App Store reviews and 200+ Quora posts, interviewed about 10 taxpayers, ran a survey, and summarized related papers with AI. Then we wrote out every step of each task to see where it broke.",
        findings=["Tax Year looked like a text box but was a list.", "The refund amount had to match to the cent, with no example.", "Payments sent people out to the website, and some still couldn't pay."],
        img=(A + "irs2go/irs2go-before.png", "The original refund form, with placeholder text instead of labels.")),
    decisions=[
        dict(title="Help before the error", img=(A + "irs2go/irs2go-refund-status-form.png", "Redesigned refund form with labels, examples and a sample form."),
             why="The old form explained its rules only after people got them wrong. Now every field has a label and an example.", result="Part of the 78.25 redesign"),
        dict(title="The answer as a timeline", img=(A + "v2/ir2go-status.webp", "Refund status: Received, Approved, Sent."),
             why="\"Return Received\" gave no date and no next step. Received, Approved, Sent shows where you are and what's next.", result="Part of the 78.25 redesign"),
        dict(title="Pay without leaving the app", img=(A + "v2/ir2go-pay.webp", "Payment screen comparing fees by card type."),
             why="Being sent to the website mid-payment broke trust, so every option and its fee sits in the app.", result="No trips out to the website"),
    ],
    rejected=[("Log in first, like the old app", "Many people quit at the login screen just to check a refund. \"Explore without signing in\" became the main button, and nobody dropped off there."),
              ("Pay straight from the form", "3 of 6 testers hesitated without a summary. A confirmation screen with the total before paying took that to 0 of 6.")],
    results=dict(rows=[["Usability score (SUS)", "31.3", "78.25"], ["Screens passing WCAG 2.1 AA", "None", "All"], ["Account needed to check a refund", "Yes", "No"]],
                 note=None, img=(A + "v2/ir2go-guest.webp", "Home screen with Explore without signing in as the main button.")),
    next=["Ask \"why is my refund late?\" and get a plain answer that links to the official source."],
    links=[("Figma prototype", "https://www.figma.com/proto/RHTthzwRZGf3j0rqaM6Hbh/IRS2GO--REDESIGN?page-id=0%3A1&node-id=1-1564&starting-point-node-id=1%3A1299")],
)

CASES["findme"] = dict(
    role="UX/UI Designer", dates="May to Aug 2025",
    org="FindMe", year="2025", kind="Design system · Startup",
    card="Growing a design system while the product kept shipping",
    line="25+ components keeping 2 products consistent, and 28% more engagement on brand pages.",
    tags=["Design system", "Research", "Agile"],
    cover=None, cover_text=("25+", "components across 2 products"),
    title="A design system, *built inside the sprint*",
    meta=[("Role", "UX/UI Designer"), ("Timeline", "May to Aug 2025"), ("Team", "Engineering, product, Marketing"), ("Where", "New York")],
    tldr=[("Problem", "New screens shipped every sprint, and small drift crept in: a slightly different button, the same pattern solved twice."),
          ("What I did", "Grew the Figma library to 25+ components across 2 products and designed features from research to final UI, inside the sprint."),
          ("Result", "28% more engagement on brand pages, and handoffs that named every component and state.")],
    metrics=[("25+", "components"), ("2", "products kept consistent"), ("28%", "more engagement on brand pages"), ("12+", "interviews and usability tests")],
    problem=["Drift slows engineers down and makes a product feel stitched together. FindMe was growing faster than its system."],
    research=dict(
        text="I supported 12+ user interviews and usability tests in Maze, tagged findings in Dovetail, and fed them straight into the wireframes.",
        findings=[], img=None),
    decisions=[
        dict(title="Name components the way engineers search for them", img=None,
             why="A library engineers can't navigate doesn't get used, so every name follows one pattern: Button / Primary / Medium / Default.", result="Every handoff used library names"),
        dict(title="Define every variant and state", img=None,
             why="When nothing is left to guess, built screens match designed ones. Default, hover, focus, disabled and loading are all defined.", result="Worked with developers until built matched designed"),
        dict(title="Design inside the sprint, not ahead of it", img=None,
             why="Joining backlog refinement and sprint planning meant design questions came up while they were still cheap to answer.", result=None),
    ],
    rejected=[],
    results=dict(rows=[], note=None, img=None),
    next=["AI that flags components used off-spec in Figma before they reach handoff."],
    links=[],
    note="FindMe's library is private, so this page describes the method rather than showing it.",
)

CASES["research-lens"] = dict(
    org="Self-initiated", year="2026", kind="MCP server · building",
    card="Research Lens: AI answers that cite participants", line="An MCP server that answers research questions with participant-level citations.",
    tags=["MCP", "TypeScript", "AI in research"], cover=None, status="building",
    title="AI research answers that *cite their sources*",
    meta=[("Role", "Designer and builder"), ("Timeline", "Nov 2026"), ("Status", "Building, deploying next"), ("Stack", "TypeScript, Node, MCP")],
    tldr=[("Problem", "AI synthesis can't tell you who said it, or how many people said it."),
          ("What I did", "Built an MCP server that lets an assistant query a research repository directly, with 5 tools."),
          ("Result", "In progress. Every excerpt returns with a participant ID, round and timestamp.")],
    metrics=[("5", "tools"), ("TypeScript", "MCP server")],
    problem=["The usual AI research workflow is copy and paste. The model only sees what you happened to paste, and the output carries no citations."],
    research=None,
    decisions=[
        dict(title="Count people, not quotes", img=None, why="pattern_frequency counts distinct participants, because three quotes from one person is not a pattern.", result="Patterns you can defend"),
        dict(title="Say what the data can't support", img=None, why="draft_findings ends with a NOT SUPPORTED section that refuses causal claims on a small sample.", result="No overclaiming"),
    ],
    rejected=[("Letting the AI write the findings", "It would blur who said what. The server retrieves and counts. The researcher still writes the finding.")],
    results=None, next=[], links=[],
)

CASES["canvas"] = dict(
    org="University of Michigan-Dearborn", year="2025 to 2026", kind="Curriculum research",
    role="Human-Centered Design Researcher", dates="Sep 2025 to May 2026",
    card="2 new UX courses from 2 semesters of research",
    line="Found where a UX curriculum built before AI fell short of current practice, with 43 students and 50+ papers.",
    tags=["Longitudinal research", "AI literature review", "Affinity mapping"],
    cover=None, cover_text=("2", "new UX courses"),
    title="Bringing a pre-AI UX curriculum *up to date*",
    meta=[("Role", "Human-Centered Design Researcher"), ("Timeline", "Sep 2025 to May 2026"), ("Where", "UM-Dearborn"), ("Tools", "UM-GPT, Figma, Zoom, Canvas")],
    tldr=[("Problem", "The UX curriculum was built before AI, and it fell short of how UX is practiced now."),
          ("What I did", "Two semesters of research: 50+ papers and industry reports analyzed with UM-GPT, plus feedback from 43 students across 8 presentations."),
          ("Result", "2 new UX courses came out of the research.")],
    metrics=[("50+", "papers and industry reports"), ("43", "students' feedback"), ("8", "presentations"), ("2", "new UX courses")],
    problem=["AI changed how UX research and design are done, but the coursework still reflected the field before it. Students were learning a version of the job that was already changing."],
    research=dict(text="Over 2 semesters I reviewed 50+ papers and industry reports with UM-GPT, the university's AI tool, and gathered feedback from 43 students across 8 presentations in 2 cohorts.",
                  findings=[], img=None),
    decisions=[
        dict(title="Put research and student feedback on one board", img=None,
             why="Mapping findings and feedback onto shared Figma affinity boards across 2 cohorts showed real patterns, not one-off complaints.", result=None),
        dict(title="Consolidate weekly, recommend monthly", img=None,
             why="I consolidated findings with 10+ research assistants in weekly Zoom sessions and presented recommendations to faculty every month, so research turned into decisions.", result="2 new UX courses"),
    ],
    rejected=[], results=None, next=[], links=[],
)

CASES["magic-apron"] = dict(
    org="Concept", year="2026", kind="AI assistant · Retail concept",
    card="Magic Apron: fixing an AI shopping assistant", line="Fixing an AI shopping assistant after watching a first-time DIYer use it.",
    tags=["AI assistant", "Concept"], cover=A + "magic-apron/c1-after.webp", cover_alt="Store Mode asks how you want to hang it, with tap options.", cover_fit="top",
    title="Ask the right question, *finish the task*",
    meta=[("Role", "UX designer, solo"), ("Time", "1 weekend, Oct 2026"), ("Methods", "Interview, screen recording, heuristic review"), ("Status", "Concept")],
    tldr=[("Problem", "The Home Depot's AI assistant gave different answers at home and in Store Mode, and an empty shelf ended with \"Thanks for letting us know.\""),
          ("What I did", "Interviewed a first-time DIYer while they used the app, then designed 6 small changes on the real screens."),
          ("Result", "A concept with hypotheses to test, not results. Not affiliated with The Home Depot.")],
    metrics=[("1", "recorded interview"), ("2", "pain points"), ("6", "small changes")],
    problem=["Asked how to hang a photo frame, Store Mode showed only hanging kits. Adhesive strips appeared only after the person typed \"Adhesive.\" When the strips weren't on the shelf, reporting it led nowhere."],
    research=None,
    decisions=[
        dict(title="Ask the most important question first", img=(A + "magic-apron/c1-after.webp", "Store Mode asks how you want to hang it, with tap options."),
             why="One question, \"how do you want to hang it?\", would have caught adhesive in my interview.", result="Hypothesis: fewer repeat questions"),
        dict(title="Report, then finish the task", img=(A + "magic-apron/c7-after.webp", "After reporting, three ways to still get the item, with Undo."),
             why="The store gets a signal, but the shopper still needs the product: a similar item, a nearby store, or delivery.", result="Hypothesis: more reports end in a purchase"),
    ],
    rejected=[("My first lo-fi redesign of the whole journey", "It changed too much of the app. I kept the ideas and moved them onto the real screens.")],
    results=None, next=[], links=[],
)

CASES["omkar"] = dict(
    role="Junior Front-End Developer", dates="May 2022 to Jan 2023",
    org="Omkar Labels", year="2022", kind="Front-end development",
    card="Building a 50+ page B2B catalog from design files", line="Built every page from designers' handoff files and checked each against the design before release.",
    tags=["Front-end", "B2B catalog"], cover=A + "live/omkar.jpg", cover_alt="Omkar Labels products: a printing press, a hang tag and printed labels.",
    title="Where I learned what a *handoff* leaves out",
    meta=[("Role", "Junior Front-End Developer"), ("Timeline", "May 2022 to Jan 2023"), ("Team", "Designers and 3 developers"), ("Stack", "HTML, CSS, JavaScript, jQuery, Bootstrap, WordPress")],
    tldr=[("Problem", "A clothing-label manufacturer needed its 50+ product catalog built and kept accurate for B2B buyers."),
          ("What I did", "Built the pages one by one from designers' handoff files, about 2 days per page, and checked each against the design before handing it to the lead developers."),
          ("Result", "50+ pages shipped. Designers owned navigation and categories; my part was building them faithfully.")],
    metrics=[("50+", "pages built"), ("~2 days", "per page"), ("8 months", "on the developer side of handoffs")],
    problem=["Buyers check the site before they call, so a broken page or an old listing costs trust."],
    research=None,
    decisions=[dict(title="Raise the mismatch before release", img=None,
                    why="When the design file and the browser didn't match, I raised it early and traced layout bugs in Chrome DevTools instead of patching symptoms.", result="Why my handoffs now spell out every state")],
    rejected=[], results=None, next=[], links=[],
)

ORDER = EXPERIENCE + PROJECTS + SIDE
