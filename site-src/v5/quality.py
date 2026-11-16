"""Visual design, accessibility and design system notes for each case study.
Every line comes from the shipped screens on this site or facts already on the case pages.
Projects without a visual design deliverable (curriculum research, Research Lens) have no entry."""

QUALITY = {
    "jaihind": [
        ("Visual design", [
            "Black and red JaiHind brand on calm, card-based layouts, so numbers and actions stand out.",
            "One primary action, New Order, always in the header on desktop and in the center of the phone's bottom bar.",
            "Order status uses one fixed colour set (Flagged red, Pending amber, Approved teal, Shipped purple, Delivered green, Cancelled grey) on every screen.",
            "The same dashboard reflows from desktop to tablet to phone without changing what anything means.",
        ]),
        ("Accessibility", [
            "Designed for the least sure user: big buttons, plain words and Marathi labels.",
            "Touch steppers instead of typing quantities, and undo on key actions, so mistakes are easy to avoid and easy to fix.",
            "Status is never shown by colour alone. Every colour sits next to a text label.",
        ]),
        ("Design system", [
            "My team's own shared Figma library, built for this platform.",
            "Covers desktop, tablet and phone, JaiHind and Mewar themes, and English and Marathi.",
            "591+ screens built from one library.",
        ]),
    ],
    "findme": [
        ("Visual design", [
            "One spacing scale and one solution per pattern, to stop the drift that crept in with every sprint.",
            "Two products share the same components, so they look and behave the same.",
        ]),
        ("Accessibility", [
            "Every component has its default, hover, focus, disabled and loading states designed, so keyboard users always see where they are and nothing is left for engineers to guess.",
        ]),
        ("Design system", [
            "FindMe's own Figma library, which I grew to 25+ components across 2 products.",
            "Every name follows one pattern, Button / Primary / Medium / Default, so engineers find components by the name they search for.",
            "The library is private, so this page describes the method rather than showing it.",
        ]),
    ],
    "ir2go": [
        ("Visual design", [
            "One accent colour, IRS navy, for actions and the active tab. Everything else stays neutral.",
            "A label above every field, required fields marked, and one primary button per screen.",
            "A 4-tab bar with an icon and a word on each tab: Refunds, Payments, Tax Help, More.",
        ]),
        ("Accessibility", [
            "Designed to WCAG 2.1 AA, and tested with VoiceOver, the iPhone screen reader.",
            "A Check Accessibility entry right on the refund form.",
            "Usability score (SUS) went from 31.3 to 78.25.",
        ]),
        ("Design system", [
            "Apple's Human Interface Guidelines for iPhone: tab bar, navigation, form fields and pickers.",
            "Styled with the IRS brand colours so it still feels official.",
        ]),
    ],
    "anchor": [
        ("Visual design", [
            "Soft blue-white background with white cards, so the AI's messages read as calm, separate blocks.",
            "Suggested questions appear as tappable chips with icons, so people don't have to know what to type.",
            "Inter for the interface, with clear size steps between titles, messages and chips.",
        ]),
        ("Accessibility", [
            "Text contrast passes WCAG 2.1 AA on the assistant screen: messages about 17:1, chips about 10:1, input hint about 6:1.",
            "A microphone button gives a way to ask without typing.",
        ]),
        ("Design system", [
            "Our team's style guide in Figma (Inter, Helvetica).",
            "iPhone layout from Apple's Human Interface Guidelines, with Material Design components such as the top app bar and suggestion chips.",
        ]),
    ],
    "ev": [
        ("Visual design", [
            "One teal accent for every action, and a station photo at the top so drivers recognise where they are.",
            "A single full-width button for the main step, like Connect to start Charging.",
            "Save, Amenities and Information as icon tiles, each with a text label.",
        ]),
        ("Accessibility", [
            "White text on the teal buttons measures about 5.2:1, which passes WCAG 2.1 AA.",
            "Large, full-width buttons that are easy to tap at a charger.",
        ]),
        ("Design system", [
            "Android with Material Design: bottom navigation, cards and full-width buttons.",
        ]),
    ],
    "fitcheck": [
        ("Visual design", [
            "Rows that differ are highlighted, and the highlight can be turned on or off.",
            "Missing facts read Not stated in plain text instead of being left blank or guessed.",
            "The total with estimated tax sits in bold at the bottom, where the eye ends.",
        ]),
        ("Accessibility", [
            "Text contrast on the redesigned compare screen passes WCAG 2.1 AA, including the small note under the table (about 7.5:1).",
            "Differences are shown with a highlight and words, not colour alone.",
        ]),
        ("Design system", [
            "Each retailer's own look and components: Best Buy Ask Blue, Walmart Sparky, Home Depot Magic Apron and Ask Target.",
            "I improved the steps inside each assistant instead of reskinning them, so a team could ship the change without a redesign.",
        ]),
    ],
    "magic-apron": [
        ("Visual design", [
            "Follows The Home Depot's orange and Magic Apron's existing layout.",
            "A small 2 of 2 counter shows how many questions are left.",
            "Answers are full-width options, with Skip questions, show all options offered on every question.",
        ]),
        ("Accessibility", [
            "Full-width answer buttons are large tap targets.",
            "Skipping is always possible, so the questions never block someone who already knows what they want.",
        ]),
        ("Design system", [
            "The Home Depot's existing Magic Apron design, so the fix fits what the team already ships.",
        ]),
    ],
    "omkar": [
        ("Design system", [
            "Pages built on Bootstrap's grid and components inside WordPress, with HTML, CSS, JavaScript and jQuery.",
        ]),
    ],
}
