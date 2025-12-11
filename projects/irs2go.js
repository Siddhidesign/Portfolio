function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });

    // Update sidebar active state
    const navItems = document.querySelectorAll('.sidebar-nav div');
    navItems.forEach(item => item.classList.remove('active'));
    const clicked = [...navItems].find(i => i.textContent.toLowerCase() === id);
    if (clicked) clicked.classList.add('active');
  }
}
