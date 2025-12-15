// Active nav on scroll
const sections = document.querySelectorAll('.cs-section');
const navLinks = document.querySelectorAll('.cs-nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 200) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Lightbox
document.querySelectorAll('.lightbox').forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    const full = document.createElement('img');
    full.src = img.src;
    full.className = 'lightbox-img';
    overlay.appendChild(full);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  });
});

// Expandable quotes
document.querySelectorAll('.expandable').forEach(q => {
  q.addEventListener('click', () => {
    q.classList.toggle('open');
  });
});
