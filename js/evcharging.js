// Example: Add click handler for section buttons
const navButtons = document.querySelectorAll('.hero-nav button');
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Optional: Scroll to section logic
  });
});
// js/script.js
document.addEventListener("DOMContentLoaded", () => {
  const bars = document.querySelectorAll('.progress');

  bars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';

    setTimeout(() => {
      bar.style.transition = 'width 1.5s ease';
      bar.style.width = width;
    }, 300);
  });
});
