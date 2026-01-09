/* ============================================================
   GROCGENIE - INTERACTIVE LOGIC
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Create Progress Bar Element
    const bar = document.createElement('div');
    bar.id = 'myBar';
    document.body.prepend(bar);

    // 2. Scroll Events (Progress Bar & Navbar)
    window.addEventListener('scroll', () => {
        // Calculate Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";

        // Navbar Styling
        const nav = document.querySelector('.navbar');
        if (winScroll > 80) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    // This observer triggers the 'is-visible' class when the section enters the viewport
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the section is visible
        rootMargin: "0px 0px -50px 0px"
    });

    // Apply observer to all phases
    document.querySelectorAll('.cs-phase').forEach(phase => {
        revealObserver.observe(phase);
    });

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
