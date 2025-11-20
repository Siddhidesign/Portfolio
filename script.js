/* ============================================================
   SCROLL–BASED ACTIVE NAVIGATION
============================================================ */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let scrollPos = window.scrollY + 140;

  sections.forEach((sec) => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      let id = sec.getAttribute("id");

      navLinks.forEach((link) => link.classList.remove("active"));

      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
});



/* ============================================================
   CHECKPOINT LABEL REVEAL ON SCROLL
============================================================ */
const checkpointLabels = document.querySelectorAll(".checkpoint-label");

const labelObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-label");
      }
    });
  },
  { threshold: 0.3 }
);

checkpointLabels.forEach((label) => labelObserver.observe(label));



/* ============================================================
   GLOW CARD APPEAR ANIMATION
============================================================ */
const glowCards = document.querySelectorAll(".glow-card, .project-card");

const glowObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("glow-in");
      }
    });
  },
  { threshold: 0.25 }
);

glowCards.forEach((card) => {
  card.classList.add("pre-glow"); // initial state
  glowObserver.observe(card);
});



/* ============================================================
   PHOTO GRID REVEAL
============================================================ */
const photos = document.querySelectorAll(".photo-grid img");

const photoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("photo-visible");
      }
    });
  },
  { threshold: 0.25 }
);

photos.forEach((img) => {
  img.classList.add("photo-hidden");
  photoObserver.observe(img);
});



/* ============================================================
   SMOOTH SCROLL (For consistency)
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
