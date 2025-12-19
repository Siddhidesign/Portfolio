// ==============================
// SMOOTH SCROLL FOR NAV LINKS
// ==============================
document.querySelectorAll('.nav-links a, .nav-contact-btn').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ==============================
// REVEAL ON SCROLL (Projects, Photos)
// ==============================
const revealElements = document.querySelectorAll('.project-card-image-style, .photo-grid img');

function revealOnScroll() {
  const triggerPoint = window.innerHeight * 0.85;
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerPoint) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);


// ==============================
// PARTICLE EFFECT STARTER (Optional)
// ==============================
// Generates simple floating gold dots
function createParticles() {
  const container = document.querySelector('.particle-container');
  if (!container) return;

  const particleCount = 60;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.animationDuration = 6 + Math.random() * 12 + 's';
    p.style.opacity = 0.3 + Math.random() * 0.6;
    p.style.width = p.style.height = 2 + Math.random() * 2 + 'px';
    container.appendChild(p);
  }
}

window.addEventListener('load', createParticles);
