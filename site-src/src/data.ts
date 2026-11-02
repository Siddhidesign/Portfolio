// =========================================================
// ALL CONTENT LIVES HERE. Edit this file, the site updates.
// Content is taken from siddhidesign.github.io/Portfolio/
// =========================================================

const SITE = "https://siddhidesign.github.io/Portfolio/";

export const PROFILE = {
  name: "Siddhi Manche",
  surnameFirst: "MANCHE / SIDDHI",
  role: "UX Designer · Workflows, navigation and AI",
  focus: "Workflow tools for teams, easy navigation for customers, and AI-powered products",
  headline: "I make complex workflows simple for the teams who run them, and easy to navigate for the customers they serve. Now I research, design and build with AI.",
  promise:
    "I start with research, from store visits and interviews to usability tests. Then I design for customers, the staff who serve them, and the design systems that keep both on brand. I’ve written production HTML and CSS myself, so what I design can be built.",
  photo: SITE + "assets/v2/siddhi-grad.jpg",
  photoAlt: "Siddhi Manche in her University of Michigan-Dearborn graduation gown",
  from: { code: "BOM", city: "Mumbai" },
  to: { code: "USA", city: "Open across the US" },
  status: "Open to roles across the US",
};

export const CONTACT = {
  email: "manche.siddhi@gmail.com",
  linkedin: "https://www.linkedin.com/in/siddhi-manche/",
  github: "https://github.com/Siddhidesign",
  resume: "", // to show the résumé button: put resume.pdf in site-src/public and set this to "resume.pdf"
};

export const HERO_STATS: [string, string][] = [
  ["27%", "workflows: fewer order errors"],
  ["7 → 3", "navigation: home choices, IRS2Go"],
  ["6 of 8", "AI: testers fully trusted it"],
];

// The three things the whole portfolio proves. Each flight belongs to one or more.
export type Pillar = "workflow" | "nav" | "ai";
export const PILLARS: { id: Pillar; label: string; short: string; color: string; line: string }[] = [
  { id: "workflow", label: "Workflow design", short: "WORKFLOW", color: "#1F4E79", line: "Internal tools and systems that cut steps, errors and time for the teams doing the work." },
  { id: "nav", label: "Consumer navigation", short: "NAVIGATION", color: "#E8563A", line: "Fewer choices, clearer labels and paths customers follow without thinking." },
  { id: "ai", label: "AI UX", short: "AI", color: "#6B4FA0", line: "Designing AI people trust, and using AI to research, prototype and build faster." },
];

export type Status = "board" | "landed" | "ontime";
export interface Flight {
  id: string; code: string; color: string; type: string; gate: string; status: Status;
  title: string; tagline: string; from: string; to: string; role: string; desc: string;
  methods: string[]; stats: [string, string][]; image?: string; link: string; pillars: Pillar[];
}

// Flights = projects, in the order you want them shown
export const FLIGHTS: Flight[] = [
  {
    id: "jh", code: "JH 2023", color: "#1F4E79", type: "Internal tool", pillars: ["workflow"] as Pillar[], gate: "A1", status: "landed",
    title: "Jai Hind staff portal", tagline: "Product UX Designer · Feb 2023 to Jul 2024 · Mumbai",
    from: "Store staff juggling 5 separate systems to move an order from supplier to customer",
    to: "One order platform for the whole supplier-to-customer workflow",
    role: "Owned the supplier-to-customer workflow on a team of 3 designers",
    desc: "I started with store visits and stakeholder interviews, then designed the order platform that replaced 5 systems and cut order errors 27%.",
    methods: ["Store visits", "Stakeholder interviews", "Task analysis", "Workflows", "Dashboards"],
    stats: [["27%", "fewer order errors"], ["40%", "faster per order"], ["5 → 1", "systems replaced"]],
    image: SITE + "assets/jaihind/jh-13-final-dashboard.jpg", link: SITE + "cases/jaihind.html",
  },
  {
    id: "fm", code: "FM 2025", color: "#2E7D6B", type: "Design system", pillars: ["workflow"] as Pillar[], gate: "A2", status: "landed",
    title: "FindMe design system", tagline: "UX/UI Designer, internship · May to Aug 2025 · New York",
    from: "Two products drifting apart, screen by screen",
    to: "A shared library of 25+ components used across both",
    role: "Grew the component library and supported research",
    desc: "I grew a 25+ component library across 2 products and supported 12+ user interviews and usability tests, tagged in Dovetail.",
    methods: ["Component library", "Design tokens", "User interviews", "Usability tests", "Dovetail"],
    stats: [["25+", "components"], ["2", "products"], ["12+", "interviews and tests"]],
    image: SITE + "assets/findme-logo.svg", link: SITE + "cases/findme.html",
  },
  {
    id: "ol", code: "OL 2022", color: "#8A5A2B", type: "Front-end", pillars: ["nav", "ai"] as Pillar[], gate: "A3", status: "landed",
    title: "Omkar Labels catalog", tagline: "Junior Front-End Developer, part-time · May 2022 to Jan 2023 · Mumbai",
    from: "A care label maker needing a large catalog kept current",
    to: "A catalog built around the buyer’s questions, rebuilt in 2026 with an AI coding assistant",
    role: "Built and maintained the site with 3 developers in Git",
    desc: "In 2022 I hand-coded its 50+ product pages. In 2026 I rebuilt the site in Next.js, organized around the buyer’s questions, with Request a Quote one tap away. I planned, reviewed and tested; an AI assistant wrote much of the code.",
    methods: ["Information architecture", "HTML/CSS/JS", "Next.js", "AI-assisted build", "Accessibility testing"],
    stats: [["50+", "pages"], ["3", "developers"]],
    image: SITE + "assets/live/omkar.jpg", link: SITE + "cases/omkar.html",
  },
  {
    id: "ma", code: "MA 2026", color: "#6B4FA0", type: "AI · Fintech", pillars: ["ai"] as Pillar[], gate: "B1", status: "landed",
    title: "Money Anchor", tagline: "Master’s capstone · UX researcher and designer · 2025 to 2026",
    from: "People who overspend first and regret later",
    to: "An AI budgeting coach that speaks up before you spend",
    role: "IRB-approved study, University of Michigan-Dearborn",
    desc: "24 people in interviews and focus groups shaped the coach. Two rounds of testing took exploration success from 22% to 100%.",
    methods: ["IRB study", "Interviews", "Focus groups", "Usability testing", "AI trust"],
    stats: [["24", "participants"], ["22% → 100%", "exploration success"], ["6 of 8", "fully trusted the AI"]],
    image: SITE + "assets/live/anchor.jpg", link: SITE + "cases/anchor.html",
  },
  {
    id: "irs", code: "IR 2GO", color: "#2F5DA8", type: "Gov tech · a11y", pillars: ["nav"] as Pillar[], gate: "B2", status: "landed",
    title: "IRS2Go", tagline: "HCI course, team of 5 · Winter 2025",
    from: "The IRS’s official app, scoring 31.3 on usability",
    to: "A redesign that scored 78.25, with no account needed to check a refund",
    role: "Research, redesign and accessibility check",
    desc: "We redesigned the IRS’s official app so checking a refund no longer needs an account. Every redesigned screen passed my WCAG 2.1 AA check.",
    methods: ["SUS", "Usability testing", "Heuristic evaluation", "WCAG 2.1 AA"],
    stats: [["31.3 → 78.25", "SUS score"], ["100%", "screens pass WCAG 2.1 AA"]],
    image: SITE + "assets/live/ir2go.jpg", link: SITE + "cases/ir2go.html",
  },
  {
    id: "ev", code: "EV 2024", color: "#C27A12", type: "Mobility", pillars: ["nav"] as Pillar[], gate: "C1", status: "landed",
    title: "EV charging app", tagline: "Fall 2024",
    from: "A different app for every charging network",
    to: "One app for every charger",
    role: "Research and design",
    desc: "I designed one app for every charger and tested it with 10 drivers, reaching a 78.75 usability score.",
    methods: ["Driver research", "Prototyping", "Usability testing", "SUS"],
    stats: [["10", "drivers tested"], ["78.75", "SUS score"]],
    image: SITE + "assets/live/ev.jpg", link: SITE + "cases/ev.html",
  },
  {
    id: "hd", code: "HD 2026", color: "#E8563A", type: "AI concept", pillars: ["ai", "nav"] as Pillar[], gate: "C2", status: "board",
    title: "Magic Apron redesign", tagline: "Self-initiated concept · Oct 2026",
    from: "The Home Depot’s AI assistant answering differently at home and in Store Mode",
    to: "A concept with 6 changes, grounded in 1 interview",
    role: "Self-initiated",
    desc: "A short concept for The Home Depot’s AI assistant: 1 interview, 6 changes, including follow-up questions and an in-store fallback.",
    methods: ["Heuristic review", "Interview", "Conversational UX", "Concept"],
    stats: [["1", "interview"], ["6", "changes"]],
    image: SITE + "assets/magic-apron/c1-after.webp", link: SITE + "cases/magic-apron.html",
  },
];

export const AIRLINES = [
  { name: "University of Michigan-Dearborn", role: "Human-Centered Design Associate", date: "Sep 2025 to May 2026",
    note: "Kept 4 workstreams and 25 contributors moving in Figma and Miro." },
  { name: "FindMe LLC", role: "UX/UI Designer, internship", date: "May to Aug 2025", note: "New York" },
  { name: "Jai Hind Group", role: "Product UX Designer", date: "Feb 2023 to Jul 2024", note: "Mumbai" },
  { name: "Omkar Labels", role: "Junior Front-End Developer", date: "May 2022 to Jan 2023", note: "Mumbai" },
];
export const TOOLS = ["Figma", "FigJam", "Miro", "Dovetail", "Maze", "Claude Code"];

export const LOG = [
  { date: "2020", leg: "B.E., Electronics and Telecommunication", where: "Vidyalankar Institute of Technology, Mumbai", miles: "+ engineering",
    story: "I started as an engineer. It taught me how systems are built, which still shapes how I design them." },
  { date: "May 2022", leg: "Junior Front-End Developer", where: "Omkar Labels, Mumbai", miles: "+ code",
    story: "Built and kept up a 50+ page catalog website in HTML, CSS and JavaScript, working in Git with 3 developers." },
  { date: "Feb 2023", leg: "Product UX Designer", where: "Jai Hind Group, Mumbai", miles: "+ product",
    story: "From store visits and stakeholder interviews to an order platform that replaced 5 systems and cut order errors 27%." },
  { date: "2024", leg: "M.S., Human-Centered Design and Engineering", where: "University of Michigan-Dearborn", miles: "+ research",
    story: "Where research became the first step of everything: IRB studies, focus groups, SUS, and the Money Anchor capstone." },
  { date: "May 2025", leg: "UX/UI Designer, internship", where: "FindMe LLC, New York", miles: "+ systems",
    story: "Grew a 25+ component library across 2 products and supported 12+ interviews and usability tests." },
  { date: "Sep 2025", leg: "Human-Centered Design Associate", where: "University of Michigan-Dearborn", miles: "+ leadership",
    story: "Kept 4 workstreams and 25 contributors moving, with weekly FigJam critiques on progress, next steps and blockers." },
  { date: "2026", leg: "Designing and building with AI", where: "Omkar Labels rebuild, this portfolio", miles: "+ AI",
    story: "I rebuilt Omkar Labels in Next.js and built this site with an AI coding assistant. I plan, direct, review and test; the AI writes much of the code." },
  { date: "Oct 2026", leg: "Magic Apron concept", where: "Self-initiated", miles: "+ AI UX",
    story: "An AI assistant gave different answers at home and in Store Mode. 1 interview, 6 changes, including questions as taps." },
];

// Back of the boarding pass = "How I work"
export const PROCESS = [
  ["Research", "I go where the work happens and listen to the people doing it."],
  ["Define", "I group what I heard into patterns, then name the problem."],
  ["Ideate", "Many ideas on paper, then the layout in gray."],
  ["Design", "The brand becomes a design system, then polished screens."],
  ["Test", "I watch people use it, then fix what fails."],
  ["Ship and measure", "I work with developers until it holds up, then measure."],
];

export const WORDS = [
  { quote: "Siddhi designs with empathy. She took the time to understand our employees and how they work, and designed around them. She has a great understanding of users.",
    name: "Priyanka Jain", title: "Siddhi’s manager at Jai Hind Group", stamp: "JH", color: "#1F4E79", from: "Mumbai" },
  { quote: "Siddhi brought a rare mix of curiosity and rigor to our team. She dug into the research, listened carefully to users, and turned messy problems into clear, thoughtful design decisions.",
    name: "Shabaan Hossain", title: "Founder of FindMe", stamp: "FM", color: "#2E7D6B", from: "New York" },
];

export const THOUGHTS: [string, string][] = [
  ["GO WHERE THE", "WORK HAPPENS"],
  ["CLEAR LABELS", "READABLE COLOR"],
  ["THE ONE BUTTON", "YOU NEED"],
  ["WATCH PEOPLE", "THEN FIX IT"],
  ["RESEARCH BEFORE", "RUNWAY"],
  ["AI SUGGESTS", "YOU DECIDE"],
  ["FEWER STEPS", "FEWER ERRORS"],
];

export const STAMPS = [
  { t: "MUMBAI", s: "BOM · ORIGIN", color: "#E8563A", r: "-10deg", note: "Engineering at Vidyalankar, my first front-end job at Omkar Labels, and product UX at Jai Hind Group." },
  { t: "DEARBORN", s: "DTW · M.S. HCDE", color: "#2F5DA8", r: "6deg", note: "M.S. in Human-Centered Design and Engineering, then Human-Centered Design Associate on 4 workstreams." },
  { t: "NEW YORK", s: "JFK · FINDME", color: "#2E7D6B", r: "-4deg", note: "Design system internship at FindMe: 25+ components across 2 products." },
  { t: "USA", s: "OPEN · ANY GATE", color: "#C27A12", r: "8deg", note: "Open to UX/UI design and UX research roles across the US." },
  { t: "GOOGLE UX", s: "PRO CERTIFICATE", color: "#1F4E79", r: "-7deg", sq: true, note: "Google UX Design Professional Certificate." },
  { t: "AI BUILD", s: "CLAUDE CODE · NEXT.JS", color: "#6B4FA0", r: "-3deg", sq: true, note: "This portfolio and the Omkar Labels rebuild were built with an AI coding assistant. I plan, direct, review and test every page." },
  { t: "WCAG 2.1", s: "AA · CLEARED", color: "#2E7D6B", r: "5deg", sq: true, note: "Accessibility checked on every redesign. 100% of IRS2Go screens passed." },
];

// Baggage claim: drop your own photos in /public/photos and edit captions
export const BAGS: { src: string; caption: string; g1: string; g2: string }[] = [
  { src: "photos/1.jpg", caption: "Add a caption", g1: "#7FB3E6", g2: "#F6E7C8" },
  { src: "photos/2.jpg", caption: "Add a caption", g1: "#E8563A", g2: "#F5C518" },
  { src: "photos/3.jpg", caption: "Add a caption", g1: "#2E7D6B", g2: "#A6E3C8" },
  { src: "photos/4.jpg", caption: "Add a caption", g1: "#6B4FA0", g2: "#F2B8D0" },
  { src: "photos/5.jpg", caption: "Add a caption", g1: "#1F4E79", g2: "#7FB3E6" },
  { src: "photos/6.jpg", caption: "Add a caption", g1: "#C27A12", g2: "#F6E7C8" },
];

export const SKILL_GROUPS: { label: string; color: string; items: string[] }[] = [
  { label: "UX research", color: "#1F4E79", items: ["User interviews", "Field visits", "Focus groups", "Usability testing", "Think-aloud", "Heuristic evaluation", "Journey mapping"] },
  { label: "Synthesis", color: "#2E7D6B", items: ["Affinity mapping", "SUS", "Surveys", "Dovetail tagging"] },
  { label: "Design", color: "#E8563A", items: ["Workflow design", "Internal tools", "Information architecture", "Navigation", "Design systems", "Prototyping", "Figma"] },
  { label: "AI", color: "#6B4FA0", items: ["AI-assisted workflows", "Claude Code", "Figma Make", "AI integrations (APIs, MCP)", "AI output review", "Designing for AI trust"] },
  { label: "Technical", color: "#2B3440", items: ["HTML/CSS/JS", "Python", "SQL", "Git", "WCAG 2.1 AA"] },
];

export const INFO: { title: string; items: [string, string][] }[] = [
  { title: "Education", items: [["M.S., Human-Centered Design and Engineering", "University of Michigan-Dearborn, 2024 to 2026"], ["B.E., Electronics and Telecommunication", "Vidyalankar Institute of Technology, 2020 to 2024"]] },
  { title: "Certifications", items: [["Google UX Design", "Professional Certificate"]] },
  { title: "Research ops", items: [["IRB protocol", "Recruiting, consent, incentives, closeout"]] },
  { title: "Teamwork", items: [["Agile", "Developers, PMs and Marketing, presenting to non-designers"]] },
];

export const PURPOSE: [string, string][] = [["Hello", "Just saying hi"], ["Collaborate", "Working on something"], ["Hiring", "For a UX role"]];
export const SEATS: [string, string][] = [["Window", "Email"], ["Aisle", "LinkedIn"], ["Exit row", "GitHub"]];

// =========================================================
// UX LAB: each law backed by a real decision from a case study.
// badge: "tested" | "measured" | "found" | "concept"
// =========================================================
export interface Proof { flight: string; badge: "tested" | "measured" | "found" | "concept"; badgeText: string; did: string; stat: string; statLabel: string; }
export const LAB_PROOF: Record<string, { proof: Proof; also?: { flight: string; text: string } }> = {
  jakob: {
    proof: { flight: "ev", badge: "found", badgeText: "Found in testing · 10 drivers",
      did: "Experienced drivers expected payment to work like Tesla’s: set up once, then automatic. Ours didn’t, and it showed. After testing, payment moved to a default method, with the pay button always on screen.",
      stat: "109.66 s", statLabel: "for experienced drivers to charge and pay, the slowest task in testing" },
    also: { flight: "ma", text: "5 sections sit in a bottom bar like a bank app, so there was less to learn." },
  },
  fitts: {
    proof: { flight: "hd", badge: "concept", badgeText: "Concept · to be tested",
      did: "Reporting an empty shelf hid behind a small three-dot menu. I replaced it with a labeled “Can’t find it?” button on the product card: a bigger target, right where the shopper is looking.",
      stat: "Change 5", statLabel: "of 6 in the concept, designed around Fitts’s law" },
    also: { flight: "irs", text: "Big tap targets and one main action per screen, part of the redesign that scored 78.25." },
  },
  hick: {
    proof: { flight: "irs", badge: "tested", badgeText: "Tested · old app vs redesign",
      did: "The old home screen offered 7 equal menu items. We cut it to 3 clear choices, the 3 things people open the app for: refund, payment, tax help.",
      stat: "31.3 → 78.25", statLabel: "SUS score, old app against the redesign" },
    also: { flight: "irs", text: "“Explore without signing in” became the main button. Nobody dropped off at login after the change." },
  },
  miller: {
    proof: { flight: "jh", badge: "measured", badgeText: "Shipped · measured before and after",
      did: "I owned the supplier-to-customer workflow. Taking a customer order became a 4-step sales order that staff finish at the counter or on the phone.",
      stat: "40%", statLabel: "more efficient workflows, by time per order, on the shipped platform" },
    also: { flight: "hd", text: "Questions buried in a paragraph became cards: 1 of 2, then 2 of 2." },
  },
  vonr: {
    proof: { flight: "ma", badge: "tested", badgeText: "Tested · 2 rounds, 16 people",
      did: "In round one, the AI sat in the bottom menu with everything else, and people missed it. We made it a floating chat bubble with its own gradient, so it stands apart from the menu.",
      stat: "100%", statLabel: "finished the AI chat task in round two" },
  },
  prevent: {
    proof: { flight: "jh", badge: "measured", badgeText: "Shipped · measured before and after",
      did: "Stock problems only showed up after an order was approved, when it had already moved. We added a stock check before approving, instead of a one-click approve.",
      stat: "27%", statLabel: "fewer order errors after launch" },
    also: { flight: "irs", text: "Each field explains itself before you fill it in, with an example and a sample form." },
  },
};
