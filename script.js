/* ==========================================================
   PORTFOLIO AIRLINES INTRO — Auto Hide After Animation
========================================================== */
const introOverlay = document.getElementById("intro-overlay");

window.addEventListener("load", () => {
  setTimeout(() => {
    introOverlay.style.opacity = "0";
    introOverlay.style.pointerEvents = "none";
  }, 4700); // matches CSS fade timing
});


/* ==========================================================
   NAVBAR ACTIVE LINK ON SCROLL
========================================================== */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

function activateNavLink() {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) current = section.getAttribute("id");
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", activateNavLink);


/* ==========================================================
   SMOOTH FADE-IN FOR SECTIONS ON SCROLL
========================================================== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.15 }
);

// Apply fade-in animation to all major sections & cards
document.querySelectorAll(
  "section, .project-card, .timeline-item, .about-card, .skill-card, .info-card"
).forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});


/* ==========================================================
   MOBILE NAV SMOOTH SCROLL
========================================================== */
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(link.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});


/* ==========================================================
   OPTIONAL: PARALLAX FLOAT EFFECT FOR HERO ICONS
========================================================== */
const floatingIcons = document.querySelectorAll(".floating-icons .icon");

window.addEventListener("mousemove", (e) => {
  floatingIcons.forEach(icon => {
    const speed = 0.02;
    const x = (window.innerWidth - e.pageX) * speed;
    const y = (window.innerHeight - e.pageY) * speed;

    icon.style.transform = `translate(${x}px, ${y}px)`;
  });
});
