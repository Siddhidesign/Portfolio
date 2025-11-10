// Hide intro after animation completes
window.addEventListener("load", () => {
  const intro = document.getElementById("intro-overlay");
  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.visibility = "hidden";
    intro.style.transition = "opacity 0.8s ease";
  }, 5100);
});
// Wait for page to load then remove intro overlay after animation ends
window.addEventListener("load", () => {
  const intro = document.getElementById("intro-overlay");
  setTimeout(() => {
    intro.style.display = "none";
  }, 5500); // 5.5 seconds total before hiding
});
// Smooth Scroll Navigation
document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Active Navbar Highlight on Scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
