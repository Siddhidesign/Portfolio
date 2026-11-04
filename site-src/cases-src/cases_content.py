# Content for every case study. Each run has the same five-node pipeline as the homepage.
# Step kinds: "" (neutral), "ai" (AI step), "hum" (my check), "ok" (result).
# **text** becomes bold.

A = "../assets/"
ORDER = ["omkar", "jaihind", "findme", "anchor", "ir2go", "ev", "magic-apron"]

CASES = {}

CASES["omkar"] = dict(
    id="omkar", code="OL-2022", color="#8A5A2B", status="shipped", kind="B2B catalog · front-end", short="Omkar Labels catalog",
    seo_title="Omkar Labels: A B2B catalog buyers check before they call",
    title="A B2B catalog buyers check before they call",
    lede="Omkar Labels makes clothing labels and tags for apparel brands. Buyers check its website before they pick up the phone, so a broken page or an old listing costs trust. As a front-end developer, I turned the designer's files into responsive pages for a catalog of 50+ products.",
    inp="A large catalog that had to stay current, and buyers deciding whether to call",
    out="A 50+ page catalog website in HTML, CSS and JavaScript, kept accurate",
    metrics=[("50+", "product pages kept accurate"), ("8 months", "as the developer on design handoffs")],
    hero=(A + "live/omkar.jpg", "Product photos from the catalog: a printing press, a hang tag on a shirt and printed labels."),
    meta=[("Role", "Junior front-end developer, part-time"), ("Timeline", "May 2022 to Jan 2023"), ("Team", "Worked with the designer and 3 developers"), ("Stack", "HTML, CSS, JavaScript, jQuery, Bootstrap, WordPress")],
    steps=[
        dict(id="input", node="Input", label="The shop window", side="Business and user goals", title="The website is the manufacturer's shop window", blocks=[
            ("p", "Omkar Labels has made clothing labels, hang tags and tapes since 1999. Buyers check the website before they pick up the phone."),
            ("bul", ["**What they make:** labels, trims, tags and packaging.", "**Whether to trust it:** two factories, in Thane and Narmadapuram, and a four-point quality check on every order.", "**Proof:** OEKO-TEX, FSC and Global Recycled Standard certifications."]),
            ("why", "A broken page or an old listing costs trust with exactly the people about to call."),
            ("fig", A + "jaihind/omkar-press.jpg", "An offset printing press on the factory floor.", "Offset printing on the factory floor."),
        ]),
        dict(id="plan", node="Plan", label="Buyer's questions", side="Information architecture", title="Organize the site around the buyer's questions", blocks=[
            ("p", "A B2B buyer needs to confirm what Omkar makes and whether to trust it, then ask for a price, without calling first."),
            ("bul", ["**What do you make?** Products grouped into 4 families, from the label inside the collar to the box on the shelf.", "**Can I trust you?** About Us and Quality one tap away, with the factories and certifications.", "**How do I order?** A 4-step path: order intake, design, quality check, delivery.", "**Request a Quote** as the one primary action, so the next step is always visible."]),
        ]),
        dict(id="check", node="Check", label="Handoff", side="Design-to-code handoff", k="hum", title="Raise the mismatch before release", blocks=[
            ("p", "When the design file and the browser didn't match, I raised it early and we solved it together before release. When a layout broke in one browser and not another, I traced the cause in Chrome DevTools and fixed the code, not the symptom."),
            ("why", "I've been the developer on the other side of a handoff, so my own handoffs now spell out states, spacing and behavior."),
        ]),
        dict(id="build", node="Build", label="Working pages", side="Responsive front-end", title="From design file to working page", blocks=[
            ("bul", ["**Layout:** HTML and CSS, with Bootstrap's grid so pages held up on every screen.", "**Behavior:** JavaScript and jQuery.", "**Content:** I kept the catalog of 50+ products accurate as things changed, on the company's WordPress site."]),
            ("chips", ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "WordPress", "Git", "Chrome DevTools"]),
        ]),
        dict(id="result", node="Result", label="What it taught me", side="Results and learning", k="ok", title="Why every designer should build something", blocks=[
            ("stats", [("50+", "product pages kept accurate"), ("8 months", "as the developer on the other side of handoffs"), ("3", "developers I worked with in Git")]),
            ("cards", [("Handoffs answer questions early", "I know which questions a handoff leaves open, because I used to be the one asking them."), ("Speak the developer's language", "I can talk through HTML and CSS with front-end developers on their terms."), ("Know what's buildable", "It taught me what is possible in the browser, which still shapes how I design.")]),
            ("queued", [("A quote assistant", "A buyer types \"500 woven labels, two colors\" and AI drafts the quote form for them to confirm."), ("Search in plain words", "Find the right label by describing it, without knowing the product name.")]),
        ]),
    ],
)

CASES["jaihind"] = dict(
    id="jaihind", code="JH-2023", color="#1F4E79", status="shipped", kind="internal tool · B2B workflow", short="Jai Hind staff portal and website",
    seo_title="Jai Hind: One order portal for 200 employees",
    title="One order portal for 200 employees",
    lede="Jai Hind sells menswear in 10 stores across Maharashtra, India. Orders moved by phone calls and paper books, so a whole day went into just 2 or 3 orders. I helped turn that into one portal where every order is entered once and tracked to the end.",
    inp="Phone calls, paper books and 5 systems that didn't talk to each other",
    out="One order portal for about 200 employees, tracked from call to delivery",
    note="Before AI tools · 80+ interviews by me · desktop and phone",
    metrics=[("27%", "fewer order errors"), ("2-3 → 7-8", "orders sent to suppliers a day"), ("40%", "faster per order"), ("5 → 1", "systems to move one order")],
    hero=(A + "jaihind/jh-13-final-dashboard.jpg", "The redesigned staff dashboard on desktop and phone: order count, sales, order trends, order status, top sellers and top customers."),
    meta=[("People", "About 200 employees, 10 stores"), ("Timeline", "Feb 2023 to Jul 2024"), ("My role", "Product UX Designer, full-time"), ("Team", "3 designers, 1 PM, developers")],
    links=[("Figma example, all 26 flows", "https://www.figma.com/design/jkcD5ZIdXz9MUkG3va5sIo/Untitled?node-id=190-2")],
    steps=[
        dict(id="input", node="Input", label="Phone, paper, phone", side="Where every order started", title="Phone, paper, phone again", blocks=[
            ("p", "Every order took the same slow route. Staff were good at their jobs. The tools were the problem."),
            ("flow", ["**A customer calls the store** and asks for a size, colour or item.", "**Staff write it in a book** by hand, in a paper file.", "**Staff call the supplier** to place the order, one call at a time.", "**Each person tracks their own orders,** so nobody sees the full picture."]),
            ("cards", [("Slow", "A whole day for only 2 or 3 orders."), ("Lost", "Orders got misplaced. To know the status, you had to call someone."), ("Scattered", "The rest of the work lived in 5 separate systems that did not talk to each other.")]),
        ]),
        dict(id="data", node="Data in", label="~200 people", side="Field research, before AI", title="About 200 people, every team", blocks=[
            ("p", "Our team of 3 designers met employees in all 10 stores before we drew a screen. Together we talked to about 200 people. I ran 80+ of those interviews myself, and watched how orders really move in the stores."),
            ("stats", [("~200", "employees met across 10 stores, as a team"), ("80+", "interviews I ran myself"), ("6", "teams: sales, managers, purchasing, tailoring, HR, owner")]),
            ("why", "Most of them had never used a work app. Many work on their feet, with a customer waiting.", "What we heard"),
            ("fig", A + "jaihind/jh-08-sketches.jpg", "Crazy 8s sketches on paper: eight ways in. Idea 1, two doors for shoppers and staff, is circled as the winner.", "Crazy 8s: eight ideas in eight minutes."),
        ]),
        dict(id="analyze", node="Analyze", label="Map every handoff", side="Mapping, by hand", title="Map every task, and every handoff between teams", blocks=[
            ("p", "We mapped every team's tasks and every handoff, then gave each workflow one home. The structure went round twice: once while mapping, once after testing. All of this was done by hand, before AI tools were in use."),
            ("cards", [("Staff work from phones", "Not from a desk. Every screen needed a phone layout."), ("The caller is still waiting", "An order can't stop halfway to look something up."), ("One order, typed many times", "The same order went into more than one place, so copies didn't match.")]),
            ("fig", A + "jaihind/jh-09-wireframe-dashboard.jpg", "A grayscale wireframe of the staff dashboard, desktop and phone side by side, with numbered notes.", "Gray wireframes first, desktop and phone."),
        ]),
        dict(id="verify", node="Verify", label="Test and audit", side="Testing with staff", k="hum", title="Tested with staff, then audited after launch", blocks=[
            ("p", "We tested the prototype with staff and fed what we learned back into the design. After launch, we audited the live portal against 10 usability heuristics: each finding with its impact and a fix."),
            ("fig", A + "v2/jh-audit.webp", "The audit board: dashboard screenshots above a table of 10 findings, each with its impact, usability heuristic and fix.", "After launch: 10 findings, each with a fix."),
        ]),
        dict(id="design", node="Design", label="4 key decisions", side="Decisions log", title="Four calls that shaped the portal", blocks=[
            ("p", "I owned the supplier-to-customer workflow: reorder from suppliers, take customer orders, and track them to delivery. I also built templates and components the team designed with, and worked with developers in Jira through the build."),
            ("decs", [
                dict(tag="Tesler's law", title="Enter an order once, follow it to the end", text="The work is complex, so the system carries it. Staff see one order moving through clear statuses: Pending, Approved, In transit, Delivered.", instead="a separate place for each step", badge="shipped", result="5 systems became 1."),
                dict(tag="Error prevention", title="Check stock before approving", text="Stock problems used to show up after an order was approved, when it had already moved. Now the stock check comes first.", instead="approve first, in one click", badge="measured", result="27% fewer order errors."),
                dict(tag="Miller's law", title="A sales order in 4 small steps", text="Each step is short enough to finish while the customer waits, at the counter or on the phone.", instead="one long form", badge="measured", result="40% faster per order.", img=(A + "jaihind/jh-18-prototype-mobile.jpg", "A row of phone screens from the prototype: dashboard, customers, new order steps, a delivery map and order status.")),
                dict(tag="User control", title="Add a new customer inside the order", text="On a phone order, the caller is on the line. So a new customer is added right there, without leaving the order.", instead="a \"No customer found\" dead end", badge="shipped", result="Part of the 4-step order."),
            ]),
            ("p", "I also worked on the marketing website's navigation, so shoppers can find a collection or a store fast, without a login wall."),
            ("fig", A + "live/jaihind.jpg", "The welcome screen with two doors: Explore the store for customers and Employee login for staff.", "One welcome screen, two doors: customers and staff."),
        ]),
        dict(id="result", node="Result", label="27% fewer errors", side="Measured before and after", k="ok", title="Before launch, then after", blocks=[
            ("table", ["Measure", "Before", "After", "Status"], [["Orders sent to suppliers a day", "2 to 3", "7 to 8", "measured"], ["Time to record the day's orders", "A full day", "Half a day", "measured"], ["Workflow speed, by time per order", "Baseline", "40% faster", "measured"], ["Order errors", "Baseline", "27% fewer", "measured"], ["Systems to move one order", "5", "1", "shipped"]]),
            ("p", "Errors fell because no order gets lost now. Each one is recorded once, has an owner and a status, and can be followed from the customer's call to delivery."),
            ("cards", [("Workflows are people", "The slow parts were the handoffs between teams, which no single team could see."), ("Design for the least sure user", "Big buttons and plain words helped people who had never used a work app."), ("Measure what the business feels", "Orders a day, time to record and errors were the numbers everyone cared about.")]),
            ("p", "In 2026 I rebuilt the whole workflow in Figma with sample data, with AI help and reviewed by me: 26 flows across every role, from sign-in to day-end closing, including onboarding, voice search and WCAG 2.2 AA. The live portal is internal, so this example shows how far the thinking goes."),
            ("queued", [("An agent drafts reorders, staff approve", "It reads stock and sales, drafts the supplier order, and flags conflicts, like the same size asked for by two stores. Every draft says why, like \"Sold 14 this week, 3 left\", with undo and a log. A person always has the final say.")]),
        ]),
    ],
)

CASES["findme"] = dict(
    id="findme", code="FM-2025", color="#2E7D6B", status="shipped", kind="design system · startup", short="FindMe design system",
    seo_title="FindMe: Growing a design system while the product kept shipping",
    title="Growing a design system while the product kept shipping",
    lede="FindMe helps people build a portfolio and share one link. Over a summer, I grew its Figma component library to 25+ components across 2 products, held brand pages to the brand's standards with Marketing, and designed features from research to final UI, inside the sprint with engineering.",
    inp="New screens every sprint, and small drift between them",
    out="A library of 25+ components keeping 2 products consistent",
    metrics=[("25+", "components, across 2 products"), ("28%", "more engagement on brand pages"), ("12+", "interviews and usability tests"), ("2", "products kept consistent")],
    meta=[("Role", "UX/UI Designer, internship"), ("Timeline", "May to Aug 2025"), ("Team", "Engineering, product and Marketing, Agile"), ("Where", "New York")],
    note="FindMe's own library is private, so the component examples here illustrate the method.",
    steps=[
        dict(id="input", node="Input", label="Drift", side="The problem", title="A product growing faster than its system", blocks=[
            ("p", "New screens shipped every sprint, which meant small drift: a slightly different button, a new spacing value, the same pattern solved twice."),
            ("why", "Drift slows engineers down and makes a product feel stitched together."),
        ]),
        dict(id="data", node="Data in", label="12+ sessions", side="Research", title="Research fed the wireframes", blocks=[
            ("p", "I supported 12+ user interviews and usability tests, tagged the findings in Dovetail, and fed what we learned into the wireframes."),
            ("chips", ["User interviews", "Usability tests in Maze", "Dovetail tagging"]),
        ]),
        dict(id="design", node="Design", label="The library", side="System", title="A library engineers can navigate", blocks=[
            ("p", "I worked on two tracks at once: adding components, patterns and visual standards to the Figma library, and designing features from research to final UI. Every screen was responsive from the first wireframe."),
            ("decs", [
                dict(tag="decision 1", title="Name components the way engineers look for them", text="A library engineers can't navigate doesn't get used, so every name follows one pattern: Button / Primary / Medium / Default.", badge="shipped", result="Every handoff used the library names."),
                dict(tag="decision 2", title="Define every variant and state", text="When nothing is left to guess, built screens match designed ones. Every component had its default, hover, focus, disabled and loading states defined.", badge="shipped", result="I worked with developers until the built screens matched."),
            ]),
        ]),
        dict(id="verify", node="Verify", label="In the sprint", side="Working with engineering", k="hum", title="Design inside the sprint, not ahead of it", blocks=[
            ("p", "I joined backlog refinement and sprint planning, so design questions came up while they were still cheap to answer. Handoffs named components by their library names and spelled out every state."),
            ("p", "With Marketing, brand-facing pages kept the same color, type and icon standards."),
        ]),
        dict(id="result", node="Result", label="28% engagement", side="Results", k="ok", title="In the founder's words", blocks=[
            ("quotes", ["Siddhi brought a rare mix of curiosity and rigor to our team. She dug into the research, listened carefully to users, and turned messy problems into clear, thoughtful design decisions. She's proactive, easy to collaborate with, and consistently raised the quality of everything she touched."]),
            ("p", "Shabaan Hossain, Founder of FindMe"),
            ("stats", [("25+", "components, 2 products"), ("28%", "more engagement on brand pages"), ("12+", "interviews and usability tests")]),
            ("queued", [("A first draft for every project", "Users paste their notes, and AI drafts a project write-up they can edit."), ("A design system checker", "AI flags components used off-spec in Figma before they reach handoff.")]),
        ]),
    ],
)

CASES["anchor"] = dict(
    id="anchor", code="MA-2026", color="#6B4FA0", status="tested", kind="AI product · fintech", short="Money Anchor",
    seo_title="Money Anchor: An AI budgeting coach people trust",
    title="An AI budgeting coach people trust",
    lede="Tapping a card doesn't feel like spending, so small buys and forgotten subscriptions add up. For our master's capstone, our team of 4 designed Money Anchor, a budgeting app with an AI coach that speaks up before you spend and explains why.",
    inp="People who overspend first and regret later, and avoid money apps",
    out="An AI coach that explains every suggestion and leaves you the final say",
    metrics=[("22% → 100%", "task success exploring the app, round 1 to 2"), ("6 of 8", "fully trusted the AI's advice"), ("24", "people in an IRB-approved study"), ("40+", "papers summarized with AI")],
    hero=(A + "live/anchor.jpg", "Three Money Anchor screens: budget, the AI assistant and insights."),
    meta=[("Role", "UX Researcher and Designer"), ("Timeline", "2025 to 2026, master's capstone"), ("Team", "Brandan, Giselle, Shreeraj and me"), ("My part", "Research, the AI coach and the budget flows")],
    steps=[
        dict(id="input", node="Input", label="Money feels unreal", side="The problem", title="Money that doesn't feel real", blocks=[
            ("p", "Cards and digital wallets remove the small pain of paying, so spending feels effortless until the statement arrives. Forgotten subscriptions keep charging. And most budgeting apps only chart the past, which many people avoid opening."),
            ("quotes", ["I spend more when I'm bored. Surfing online equals unnecessary spending.", "If my friends are going out, I'm going out too.", "I like when I get positive messages like, 'You saved $50 this week!'"]),
            ("why", "So the aim was to help in the moment, before the money is gone, without judging."),
        ]),
        dict(id="data", node="Data in", label="40+ papers, 24 people", side="Research", title="40+ papers, 10 apps, 24 people", blocks=[
            ("p", "We found 40+ research papers on spending behavior, and I summarized and analyzed them with AI. We benchmarked 10 budgeting apps, including Mint, YNAB, Rocket Money and Copilot. Then we interviewed 8 people aged 20 to 32 and ran 4 focus groups with 16 more, with university ethics (IRB) approval."),
            ("stats", [("40+", "papers, summarized with AI"), ("10", "apps benchmarked"), ("24", "people, interviews and focus groups")]),
            ("why", "Interviews covered private money habits. Focus groups surfaced the social side, like spending to keep up with friends."),
        ]),
        dict(id="analyze", node="Analyze", label="50+ quotes, 100 ideas", side="Synthesis", k="ai", title="50+ quotes into themes, 100 ideas into 10", blocks=[
            ("bul", ["People don't need more graphs. They need money in context, like \"this meal costs 3 hours of work.\"", "Forgotten subscriptions were a big, silent leak.", "People would trust AI only if it explained itself and left the final say to them."]),
            ("fig", "img/moneyanchor/affinity-map.jpg", "Our affinity map: research notes on sticky notes, grouped into themes such as proactive awareness, emotional motivation, and trust and control with AI.", "The affinity map: 50+ quotes, grouped into themes."),
            ("p", "Each of us wrote 25 ideas, 100 in all. We sorted them into 7 themes, cut duplicates down to 64, then voted. The top 10 went into the prototype, like spotting unused subscriptions and AI forecasts for savings goals."),
            ("bars", [("ideas written", 100, 100, "100", False), ("after sorting", 64, 100, "64", False), ("in the prototype", 10, 100, "10", False)]),
        ]),
        dict(id="design", node="Design", label="AI that explains", side="Decisions log", title="An AI that explains, and leaves you in charge", blocks=[
            ("p", "We wireframed 5 sections with a bottom bar, like a bank app, so there was less to learn. In Figma, we turned them into high-fidelity screens built from shared components. I designed the AI coach and the budget flows."),
            ("decs", [
                dict(tag="decision 1", title="Explain every suggestion", text="People wanted the reason and the final say, not orders. So each AI suggestion shows why, and how sure it is, before you apply it or say no.", badge="tested", result="Round two: 6 of 8 testers completely trusted the AI's budget advice.", img=(A + "v2/anchor-explain.webp", "An AI analysis card suggesting a smaller groceries budget, marked high confidence, with See AI Explanation, No Thanks and Apply Changes.")),
                dict(tag="decision 2", title="Help before you buy", text="Spending decisions happen in the moment, not in a monthly report. So you can ask the AI before a purchase, and it compares products, prices and stores within your budget.", badge="tested", result="Round one: everyone finished the shopping task.", img=(A + "moneyanchor/ai-anchor.png", "The AI Anchor assistant chat, with suggested questions like How much can I safely spend today?")),
                dict(tag="decision 3", title="A nudge, not a lecture", text="People said apps that scold them make them avoid money altogether. So alerts are gentle, and the AI suggests while you decide.", badge="tested", result="7 of 8 testers said an alert would make them rethink or cancel a purchase."),
            ]),
        ]),
        dict(id="verify", node="Verify", label="2 test rounds", side="Testing with 16 people", k="hum", title="Two rounds, then fix what failed", blocks=[
            ("p", "We ran 2 rounds of moderated tests on Maze and Zoom, 8 people per round. Each person explored the app, acted on AI advice, adjusted a budget and asked the AI for buying advice, thinking out loud while Maze recorded success, time and misclicks."),
            ("bars", [("success, round 1", 22, 100, "22%", True), ("success, round 2", 100, 100, "100%", False), ("misclicks, round 1", 29, 100, "29%", True), ("misclicks, round 2", 0, 100, "0%", False)]),
            ("decs", [
                dict(tag="changed after testing", title="The AI gets its own button", text="In round one, the AI sat in the bottom menu and people missed it. It became a chat bubble you can open from any screen, with a gradient so it stands apart.", badge="tested", result="Round two: 100% finished the AI chat task.", img=(A + "v2/anchor-home.webp", "The budget home screen with a floating AI button above the tab bar, and Adjust Income and Add Expense buttons.")),
                dict(tag="changed after testing", title="Buttons that say what they do", text="Testers misread the plus and minus icons. We labeled the main buttons Adjust Income and Add Expense.", badge="tested", result="Round two: 100% success and 0% misclicks.", img=(A + "moneyanchor/testing-iteration-1.jpg", "Before and after: plus and minus icons became labeled Adjust Income and Add Expense buttons.")),
                dict(tag="still open", title="Changing a budget is still hard", text="In round two, adjusting a budget still caused 54.7% misclicks, because people couldn't find where to start. We added Adjust to a menu on each budget.", badge="built", badge_text="not tested again"),
            ]),
        ]),
        dict(id="result", node="Result", label="6 of 8 trusted it", side="Results and learning", k="ok", title="What changed, and what I learned", blocks=[
            ("stats", [("22% → 100%", "success exploring the app"), ("0%", "misclicks on it in round two"), ("6 of 8", "completely trusted the AI's advice"), ("7 of 8", "would rethink a purchase after an alert")]),
            ("cards", [("Watch, don't just ask", "Testers rated navigation 4.4 out of 5 while still missing buttons. Behavior told the real story."), ("If they can't find it, it can't help", "The AI only worked for people once it was visible from every screen."), ("Trust takes time", "People wanted suggestions, not orders, and checked bigger decisions themselves.")]),
            ("queued", [("Voice check-ins", "A ten-second spoken summary of the week, for people who avoid opening money apps."), ("Let people correct the AI", "One tap fixes a wrong category, so the suggestions get more personal over time.")]),
        ]),
    ],
)

CASES["ir2go"] = dict(
    id="ir2go", code="IR-2GO", color="#2F5DA8", status="tested", kind="gov tech · accessibility", short="IRS2Go",
    seo_title="IRS2Go: Making the IRS app easy to use",
    title="Making the IRS app easy to use",
    lede="IRS2Go is the IRS's official app. It was rated 2.8 stars, and 45% of people quit before finishing a task. In a team of 5, we redesigned the three things people open it for: checking a refund, paying, and finding free tax help. Then we tested the old app against the new one.",
    inp="An official app people quit: 2.8 stars, 45% abandoning tasks",
    out="Every task finishes inside the app, no account needed for a refund",
    metrics=[("31.3 → 78.25", "usability score (SUS), old vs redesign"), ("350+", "App Store reviews and Quora posts analyzed"), ("100%", "of redesigned screens passed WCAG 2.1 AA"), ("~10", "taxpayer interviews, plus a survey")],
    hero=(A + "live/ir2go.jpg", "Three screens of the redesign: welcome, the refund form and the refund status."),
    meta=[("Role", "UX/UI Designer"), ("Timeline", "Winter 2025, 4 months"), ("Team", "5 students, HCI course"), ("My part", "Research, journey mapping, refund and payment flows, accessibility check")],
    links=[("Figma prototype", "https://www.figma.com/proto/RHTthzwRZGf3j0rqaM6Hbh/IRS2GO--REDESIGN?page-id=0%3A1&node-id=1-1564&starting-point-node-id=1%3A1299&t=TPSclTN0t7PQbSQ5-1")],
    steps=[
        dict(id="input", node="Input", label="People gave up", side="The problem", title="A government app people gave up on", blocks=[
            ("p", "People open IRS2Go to check a refund, pay what they owe, or find free tax help. All three were hard: forms rejected correct details, payments bounced out to the website, and help didn't cover refunds or payments."),
            ("stats", [("2.8 ★", "App Store rating"), ("45%", "quit before finishing a task"), ("0", "original screens met WCAG 2.1 AA")]),
            ("why", "When a tax app confuses people, they start to doubt the agency behind it."),
        ]),
        dict(id="data", node="Data in", label="350+ reviews, ~10 people", side="Research", title="Reviews, Quora, interviews and a survey", blocks=[
            ("p", "I mined 150+ App Store reviews and 200+ Quora posts, interviewed about 10 taxpayers and ran a survey. We watched people try each task in the old app, checked it against 10 usability rules, and summarized related research papers with AI."),
            ("stats", [("150+", "App Store reviews"), ("200+", "Quora posts"), ("~10", "interviews, plus a survey")]),
            ("fig", A + "irs2go/irs2go-before.png", "The original refund status screen, with gray placeholder text instead of labels and a small Get Status button.", "Before: the original refund form."),
        ]),
        dict(id="analyze", node="Analyze", label="Every failing step", side="Synthesis", k="ai", title="Write out every step, find where it breaks", blocks=[
            ("p", "We wrote out every step of each task to see exactly where people got stuck."),
            ("bul", ["**Refunds:** Tax Year looked like a text box but was a list, the SSN was split across 3 boxes, and the refund amount had to match to the cent.", "**Payments:** the app sent people to the IRS website and through several more pages, and some still couldn't pay.", "**Tax help:** it explained ways to file, but nothing about refunds or payments."]),
            ("why", "Writing out every step showed the cause of each failure, so we fixed causes instead of symptoms."),
            ("fig", A + "irs2go/ideation-1.png", "Storyboard comics for three scenarios: a user checking his refund status, paying his tax amount, and searching for tax help.", "Storyboards for the three tasks."),
        ]),
        dict(id="design", node="Design", label="3 choices, not 7", side="Decisions log", title="Every task finishes inside the app", blocks=[
            ("p", "Clear labels, one main action per screen, big tap targets, and 3 clear choices on Home instead of 7 equal menu items: Refunds, Payments and Tax Help."),
            ("decs", [
                dict(tag="decision 1 · error prevention", title="Help before the error", text="The old form explained its rules only after people got them wrong. Now every field has a label and an example, and a sample form shows where each answer is on your return.", badge="tested", result="Part of the redesign that scored 78.25.", img=(A + "irs2go/irs2go-refund-status-form.png", "The redesigned refund form with labelled required fields, a Sample Form link and an example amount.")),
                dict(tag="decision 2 · system status", title="The answer as a timeline", text="\"Return Received\" gave no date and no next step, and 68% of people left the old flow without a clear answer. Now the status reads Received, Approved, Sent.", badge="tested", result="Part of the redesign that scored 78.25.", img=(A + "v2/ir2go-status.webp", "The refund status screen with a three-step tracker: Return Received, Refund Approved, Refund Sent.")),
                dict(tag="decision 3", title="Pay without leaving the app", text="The old app sent people out to the website in the middle of paying. Now each payment option sits in the app, with its fees side by side.", badge="tested", result="All three tasks finish inside the app.", img=(A + "v2/ir2go-pay.webp", "The payment screen comparing processor fees by card type, with the total charge above Make a payment.")),
            ]),
        ]),
        dict(id="verify", node="Verify", label="Old vs new", side="Usability testing", k="hum", title="Old app against new, then fix", blocks=[
            ("p", "People did the same tasks on the old app and the redesign while thinking out loud. Then they rated each version with the System Usability Scale (SUS), a standard 10-question survey scored out of 100."),
            ("bars", [("old app", 31.3, 100, "31.3", True), ("redesign", 78.25, 100, "78.25", False), ("common average", 68, 100, "68", True)]),
            ("decs", [
                dict(tag="changed after testing", title="Guests first", text="Many people quit at the login screen; they wouldn't log in just to check a refund. So \"Explore without signing in\" became the main button.", badge="tested", result="Nobody dropped off at login after the change.", img=(A + "v2/ir2go-guest.webp", "The home screen with Explore without signing in as the main button, and Log in below it.")),
                dict(tag="changed after testing", title="A summary before paying", text="3 of 6 testers hesitated to pay because they couldn't see a summary first. We added a confirmation screen with the total before the pay button.", badge="tested", result="After the change, 0 of 6 were worried about paying."),
            ]),
        ]),
        dict(id="result", node="Result", label="SUS 31 → 78", side="Results and learning", k="ok", title="Usability more than doubled", blocks=[
            ("stats", [("31.3 → 78.25", "SUS, well above the 68 average"), ("100%", "screens passed my WCAG 2.1 AA check"), ("0", "trips out to the website"), ("No account", "needed to check a refund")]),
            ("cards", [("Bad UX costs trust", "In a government app, a confusing screen makes people doubt the agency itself."), ("Guests first", "Letting people in without an account isn't a shortcut. It's how they reach the answer."), ("Confirm what matters", "A summary before paying calmed people more than any form design could.")]),
            ("queued", [("A plain-language helper", "Ask \"why is my refund late?\" and get an answer in plain words, with a link to the official source."), ("Help while you type", "Catch a wrong format in a field before you submit, instead of after an error.")]),
        ]),
    ],
)

CASES["ev"] = dict(
    id="ev", code="EV-2024", color="#C27A12", status="tested", kind="research · mobility", short="EV charging app",
    seo_title="EV Charging: One app for every charger",
    title="One app for every charger",
    lede="EV drivers juggle apps to find a charger that works, fits their car and takes their payment. Our team of 4 started from data: 16,767 Google Maps reviews of charging stations, cleaned in Google Colab, plus a literature review. Then we designed one app for the whole stop and tested it with 10 drivers.",
    inp="A different app, card or membership for every charging network",
    out="One app to find, check in, charge and pay, tested with 10 drivers",
    metrics=[("16,767", "Google Maps reviews collected and cleaned"), ("78.75", "usability score (SUS), 10 drivers"), ("89.5", "SUS from drivers new to EVs"), ("400", "reviews sampled, 80 per network")],
    hero=(A + "live/ev.jpg", "Trip planning screens showing routes with live times and chargers on the way."),
    meta=[("Role", "UX Designer"), ("Timeline", "Fall 2024, Human Factors course"), ("Team", "4 students"), ("My part", "Research, the competitive audit and the charging flow")],
    links=[("Figma file", "https://www.figma.com/design/iQ43CH3FjQVDSkjKN35Zld/EV-Charging-prototype?node-id=0-1&t=viRqpQ7Mf5LJgJBk-1")],
    steps=[
        dict(id="input", node="Input", label="Too many apps", side="The problem", title="Too many apps, and no way to know", blocks=[
            ("p", "Each charging network wants its own app, card or membership. Drivers can't tell if a charger works until they arrive, and no app says whether a station feels safe at night."),
            ("stats", [("Half", "of 3,300 drivers worried about range"), ("25%", "hit unavailable or incompatible chargers"), ("15%+", "felt unsafe at a station")]),
            ("p", "From Plug In America's 2023 driver survey and J.D. Power's 2023 public charging study, which we reviewed."),
            ("why", "Range anxiety isn't only about the battery. It's about not trusting the information."),
        ]),
        dict(id="data", node="Data in", label="16,767 reviews", side="Research at scale", title="16,767 reviews, studies and apps", blocks=[
            ("p", "We collected 16,767 Google Maps reviews of US charging stations. Alongside them, we reviewed peer-reviewed studies and industry reports since 2012, summarized with AI, plus EV owner forums, and compared Tesla, ChargePoint, Electrify America, PlugShare and EVgo."),
            ("term", [("cmd", "load Google_Map_EVCS_review_data  # 16,767 reviews"), ("", "drop empty, duplicate, closed-station and under-20-character reviews"), ("", "keep reviews from the last 12 months, US only"), ("ai", "tag each review by network with AI-assisted Python in Google Colab"), ("hum", "sample 80 reviews per network: 400 to compare fairly"), ("ok", "average rating: Tesla 4.26, ChargePoint 3.76, others 3.25 to 3.34")]),
            ("bul", ["No app put safety and amenities first.", "Apps that cover every network, like PlugShare, had information but no way to pay.", "Network apps took payment, but only on their own network."]),
        ]),
        dict(id="analyze", node="Analyze", label="4 themes", side="Synthesis", k="ai", title="Four themes from the data and the papers", blocks=[
            ("cards", [("Range anxiety", "The fear of running out of charge, worst on long trips."), ("Reliability", "Charging speed, compatibility, and whether a charger works."), ("Payment", "A different app or card for each network.")]),
            ("p", "And a fourth: **safety and amenities,** lighting, restrooms and food nearby. Tesla's higher ratings pointed at what drivers expected everywhere: chargers that work and payment that just happens."),
            ("follow", "2026 follow-up · done with an AI assistant", ["8,036 recent US reviews coded into 11 themes, with sentiment scored by an AI model", "Reviews about broken chargers average 2.25★, against 3.72★ for all reviews", "Broken chargers come up in 4.4% of Tesla reviews and 22.5% of Electrify America reviews"], A + "ev/ratings-by-network.png", "Bar charts of average Google Maps rating by network, with 95% confidence intervals, for the 400-review sample and for all 8,036 cleaned reviews. Tesla is highest in both."),
        ]),
        dict(id="design", node="Design", label="One wallet", side="Decisions log", title="Familiar maps, clear status, one wallet", blocks=[
            ("p", "Each of us sketched 4 ideas in 4 minutes, and we voted on the features to keep. We built the screens in Figma, guided by 4 usability rules: familiar patterns like Google Maps, clear system status, user control, and preventing errors, like checking that a charger fits your car."),
            ("fig", A + "ev/sketches-grouped.png", "Paper sketches grouped into four ideas: real-time data, universal payment and rewards, personalized suggestions, and amenities and safety.", "Sketches, grouped into four ideas."),
            ("decs", [
                dict(tag="decision 1", title="One payment for every network", text="Each network wanted its own app, card or membership. Here you check in and pay in one place, with no RFID card.", badge="tested", result="The hardest task in testing, so it changed afterwards.", img=(A + "ev/ev-checkin.png", "Check-in screens: pick a station, see free chargers and start charging without an RFID card.")),
                dict(tag="decision 2", title="Show what's around the charger", text="Many drivers, especially women, worry about safety at quiet stations, and families need places to stop. So every station shows what is around it before you drive there.", badge="tested", result="Testers praised it across the board.", img=(A + "v2/ev-amen.webp", "The station screen with Amenities open, listing places to eat nearby.")),
                dict(tag="decision 3", title="Plan the trip, chargers included", text="Range anxiety peaks on long trips in unfamiliar places. So you enter where you're going and see chargers along the route, with live traffic.", badge="tested", result="New EV drivers praised how simply it previews stops."),
            ]),
        ]),
        dict(id="verify", node="Verify", label="10 drivers", side="Usability testing", k="hum", title="10 drivers, 3 tasks", blocks=[
            ("p", "We tested with 10 people: 5 new to EVs and 5 experienced drivers. Each found a nearby charger, found the battery health page, and charged and paid, thinking out loud while we timed them. Then everyone filled in the SUS survey."),
            ("bars", [("new to EVs", 89.5, 100, "89.5", False), ("experienced", 68.0, 100, "68.0", True), ("everyone", 78.75, 100, "78.75", False)]),
            ("decs", [
                dict(tag="Jakob's law · changed after testing", title="Pay like the apps drivers already trust", text="Experienced drivers took 109.66 seconds to charge and pay, and rated it 3.66 out of 5. They expected payment to work like Tesla's: set up once, then automatic. So payment now uses your default method, and a pay button stays on screen.", badge="built", badge_text="not tested again"),
                dict(tag="changed after testing", title="Words people actually use", text="\"Phantom battery\" confused people, so it became \"stand-by\", and the battery page got a simpler layout.", badge="built", badge_text="not tested again"),
            ]),
        ]),
        dict(id="result", node="Result", label="SUS 78.75", side="Results and learning", k="ok", title="What worked, and what came next", blocks=[
            ("stats", [("78.75", "average SUS, above the 68 benchmark"), ("89.5", "SUS from people new to EVs"), ("5.46 s", "to find a nearby charger, new drivers"), ("16,767", "reviews behind the decisions")]),
            ("cards", [("Range anxiety is about trust", "Reliable information calms drivers more than a bigger battery would."), ("Beginners and experts differ", "New drivers loved the simplicity. Experienced drivers measured us against Tesla."), ("Amenities were the surprise", "The feature no other app had was the one every tester praised.")]),
            ("queued", [("Predict broken chargers", "Learn from driver reports and history, and warn you before you drive to a charger that is likely down."), ("A hands-free trip assistant", "Ask out loud for the next working charger with food nearby, without touching the screen.")]),
        ]),
    ],
)

CASES["magic-apron"] = dict(
    id="magic-apron", code="HD-2026", color="#E8563A", status="concept", kind="AI assistant · retail concept", short="Magic Apron redesign",
    seo_title="Magic Apron: Ask the right question, finish the task",
    title="Ask the right question, finish the task",
    lede="I watched a first-time DIYer ask The Home Depot's AI assistant, Magic Apron, how to hang a photo frame. In Store Mode it showed only hanging kits, so they had to ask again. When the item wasn't on the shelf, reporting it ended with \"Thanks for letting us know.\" My redesign asks the 2 questions that matter as taps, and turns an empty shelf into a way to finish the task.",
    inp="An AI assistant giving different answers at home and in Store Mode",
    out="6 small changes: questions as taps, and a way to finish the task",
    note="A self-initiated concept. Not affiliated with or endorsed by The Home Depot. Impact is a hypothesis to test, not a result.",
    metrics=[("1", "user interview, recorded"), ("2", "pain points found"), ("6", "small changes, before and after"), ("1", "weekend, October 2026")],
    hero=(A + "magic-apron/c1-after.webp", "Store Mode asks how you want to hang it, with three options and a quiet Skip questions button."),
    meta=[("Role", "UX designer, solo"), ("Time", "1 weekend, October 2026"), ("Methods", "User interview, screen recordings, heuristic review, wireframes"), ("Tools", "Figma")],
    steps=[
        dict(id="data", node="Data in", label="1 interview", side="Research", title="Same question, same person, two answers", blocks=[
            ("p", "I interviewed a first-time DIYer while they used the app, and recorded the screen. They asked the same question on the Home tab and in Store Mode: \"I have a 24×28 photo frame and need to hang it on a wall. What products should I buy?\""),
            ("bul", ["**Home tab:** a hanging kit, or adhesive strips for no holes.", "**Store Mode:** hanging kits only. Strips appeared only after they typed \"Adhesive.\"", "Magic Apron did ask about weight and wall type, but at the end of a long paragraph, so they read past it."]),
            ("p", "Then the map showed the strips at Aisle 15, Bay 10. They weren't there. Reporting it showed \"Thanks for letting us know!\" and nothing else: no similar item, no other store, no delivery."),
            ("pair", [(A + "magic-apron/c6-before.webp", "The store map with the three-dot menu open: Wrong Location, Out of Stock, Inaccurate Inventory.", "Store map: the report menu"), (A + "magic-apron/c7-before.webp", "After reporting, the app only shows Thanks for letting us know.", "Then: \"Thanks\" and nothing else")]),
        ]),
        dict(id="analyze", node="Analyze", label="2 problems", side="Define", title="Two problems, two questions to answer", blocks=[
            ("cards", [("Problem 1", "First-time DIYers have to ask again, because the questions are buried in text and Store Mode narrows results without asking."), ("How might we", "let the AI ask the 1 or 2 questions that matter, as quick taps, before it picks products?"), ("Problem 2", "Shoppers can report an empty shelf, but the app ends at \"Thanks for letting us know.\"")]),
            ("why", "The store gets a useful signal, but the shopper still has no product.", "Why it matters"),
        ]),
        dict(id="verify", node="Verify", label="Heuristic review", side="My check", k="hum", title="Check each idea against the real screens", blocks=[
            ("p", "I wireframed the whole journey in grayscale first. It changed too much of the app, so I kept the ideas and moved them onto the real screens, checking each change against a usability principle."),
            ("fig", A + "magic-apron/wireframes.webp", "Six grayscale wireframes of the redesigned journey.", "Lo-fi wireframes I made before the redesign."),
        ]),
        dict(id="design", node="Design", label="6 changes", side="Before and after", title="Six small changes on the real screens", blocks=[
            ("decs", [
                dict(tag="change 1", title="Ask the most important question first", text="Before showing any product, Magic Apron asks how you want to hang it. In my interview, this one question would have caught \"adhesive.\"", principle="Error prevention", pair=[(A + "magic-apron/c1-before.webp", "Store Mode answers with hanging kits only.", "Before: the app today"), (A + "magic-apron/c1-after.webp", "Store Mode asks how you want to hang it, with tap options.", "After: my redesign")]),
                dict(tag="change 2", title="Questions as taps", text="Questions move out of the paragraph into their own card, 1 of 2 then 2 of 2, with a quiet \"Skip questions\" at the bottom.", principle="Recognition over recall", pair=[(A + "magic-apron/c2-before.webp", "Questions at the end of a long paragraph.", "Before"), (A + "magic-apron/c2-after.webp", "Question 2 of 2 as tap options.", "After")]),
                dict(tag="change 3", title="The right items, with the aisle", text="Results repeat the shopper's own answers, no holes and 10 to 20 lb, with the aisle and bay.", principle="Match the real world", pair=[(A + "magic-apron/c3-before.webp", "The user has to type Adhesive to get strips.", "Before"), (A + "magic-apron/c3-after.webp", "Large strips first, with the aisle.", "After")]),
                dict(tag="change 4", title="Low stock? Offer pickup today", text="When fewer than 5 are left, \"Buy for pickup\" opens a simple sheet with the photo, price and pickup place, and a \"Not now\" button.", principle="User control and freedom", pair=[(A + "magic-apron/c8-before.webp", "4 in stock with no way to set one aside.", "Before"), (A + "magic-apron/c8-after.webp", "A pickup sheet with Not now.", "After")]),
                dict(tag="change 5", title="A visible \"Can't find it?\" button", text="A labeled button on the product card replaces the small three-dot menu.", principle="Fitts's law", pair=[(A + "magic-apron/c6-before.webp", "The three-dot menu.", "Before"), (A + "magic-apron/c6-after.webp", "A Can't find it? button on the card.", "After")]),
                dict(tag="change 6", title="Report, then finish the task", text="After the thank-you, \"Still need it today?\" offers a similar item, a nearby store or delivery, with Undo.", principle="Help users recover from errors", pair=[(A + "magic-apron/c7-before.webp", "Only a thank-you.", "Before"), (A + "magic-apron/c7-after.webp", "Three ways to finish the task, with Undo.", "After")]),
            ]),
        ]),
        dict(id="result", node="Result", label="Hypotheses", side="How I'd measure it", k="ok", title="How I'd measure it", blocks=[
            ("p", "These are hypotheses, not results. I'd watch:"),
            ("bul", ["How often people ask again in the same chat", "How often people answer the questions or skip them", "Pickup orders on low-stock items", "\"Can't find it\" reports that still end in a purchase"]),
            ("why", "One interview plus my own walkthroughs is a signal, not proof. Next, I'd test with 5 first-time DIYers, at home and in the store.", "Limits"),
        ]),
    ],
)
