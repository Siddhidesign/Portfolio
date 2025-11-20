/* ============================================================
   PARTICLE ENGINE — Warm Gold Drift
============================================================ */

const particleContainer = document.createElement("div");
particleContainer.classList.add("particle-container");
document.body.prepend(particleContainer);

function createParticle() {
  const p = document.createElement("div");
  p.classList.add("particle");

  const size = 2 + Math.random() * 2;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;

  p.style.left = Math.random() * window.innerWidth + "px";
  p.style.top = window.innerHeight + 20 + "px";

  const duration = 14 + Math.random() * 8;
  p.style.animationDuration = `${duration}s`;

  particleContainer.appendChild(p);

  setTimeout(() => p.remove(), duration * 1000);
}

setInterval(createParticle, 350);



/* ============================================================
   SCROLL-BASED ACTIVE NAVIGATION
============================================================ */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let scrollPos = window.scrollY + 150;

  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      const id = sec.getAttribute("id");

      navLinks.forEach(l => l.classList.remove("active"));

      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
});



/* ============================================================
   CINEMATIC FADE + SLIDE IN
============================================================ */

const fadeElements = document.querySelectorAll(".cinematic-fade");

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.25 }
);

fadeElements.forEach(el => fadeObserver.observe(el));



/* ============================================================
   PROJECT CARD REVEAL
============================================================ */

const projectCards = document.querySelectorAll(".project-card");

const projectObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.3 }
);

projectCards.forEach(card => projectObserver.observe(card));



/* ============================================================
   EXPERIENCE TIMELINE REVEAL
============================================================ */

const expItems = document.querySelectorAll(".exp-item");

const expObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.2 }
);

expItems.forEach(i => expObserver.observe(i));



/* ============================================================
   PHOTO GRID REVEAL (Stagger)
============================================================ */

const photos = document.querySelectorAll(".photo-grid img");

const photoObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

photos.forEach(p => photoObserver.observe(p));



/* ============================================================
   CHECKPOINT LABELS (Glow Activation)
============================================================ */

const labels = document.querySelectorAll(".checkpoint-label");

const labelObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("reveal-label");
    });
  },
  { threshold: 0.5 }
);

labels.forEach(l => labelObserver.observe(l));



/* ============================================================
   PARALLAX FLOAT ON IMAGES
============================================================ */

document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 6;
  const y = (e.clientY / window.innerHeight - 0.5) * 6;

  document.querySelectorAll(".parallax-float").forEach(el => {
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
});



/* ============================================================
   SMOOTH SCROLL
============================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
