/* ================================
   INTRO LOADING SCREEN
================================ */
window.addEventListener("load", () => {
  const intro = document.getElementById("intro-overlay");

  // Remove overlay after animation
  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.pointerEvents = "none";

    setTimeout(() => {
      intro.style.display = "none";
    }, 900);
  }, 4700);
});


/* ================================
   SMOOTH SCROLLING FOR NAV LINKS
================================ */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    // Only smooth scroll for same-page links
    if (link.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      document.querySelector(link.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});


/* ================================
   ACTIVE NAV HIGHLIGHT ON SCROLL
================================ */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
  let fromTop = window.scrollY + 120;

  sections.forEach(section => {
    const id = section.getAttribute("id");

    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      navLinks.forEach(link => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);


/* ================================
   FADE-IN ANIMATION ON SCROLL
================================ */
const revealElements = document.querySelectorAll(
  ".hero-section, .about-section, .experience-section, .projects-section, .skills-section, .contact-section"
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(40px)";
  el.style.transition = "all 0.9s ease-out";
  revealObserver.observe(el);
});
