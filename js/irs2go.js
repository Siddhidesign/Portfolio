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
// LIGHTBOX IMAGE VIEW
document.querySelectorAll('.lightbox').forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 10000;

    const fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.style.maxWidth = '90%';
    fullImg.style.maxHeight = '90%';
    fullImg.style.borderRadius = '12px';
    fullImg.style.boxShadow = '0 0 60px rgba(255,255,255,0.1)';

    overlay.appendChild(fullImg);

    overlay.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    document.body.appendChild(overlay);
  });
});

