/* ============================================================
   EV CASE STUDY - INTERACTIVE LOGIC
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll-Reveal Animation
    // This makes the sections slide up and fade in as you scroll down
    const observerOptions = {
        threshold: 0.15 // Section triggers when 15% is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once visible, no need to observe anymore
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to all case study phases
    const phases = document.querySelectorAll('.cs-phase');
    phases.forEach(phase => {
        phase.classList.add('cs-reveal'); // Initial hidden state
        observer.observe(phase);
    });

    // 2. Navigation Link Smooth Scroll
    // Ensures clicking "Portfolio" or internal links is smooth
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Navbar Background Toggle
    // Makes the navbar solid color after scrolling past the hero
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });
});