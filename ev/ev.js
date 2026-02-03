document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECT ELEMENTS
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-item');

    // 2. INTERSECTION OBSERVER OPTIONS
    // Trigger when 30% of the section is visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    // 3. CREATE THE OBSERVER
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the id of the section currently in view
                const currentId = entry.target.getAttribute('id');
                
                // Remove 'active' class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    
                    // Add 'active' class to the matching link
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // 4. ACTIVATE OBSERVER ON ALL SECTIONS
    sections.forEach(section => {
        observer.observe(section);
    });

    // 5. SMOOTH CLICK HANDLING (Optional polish)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 40, // Offset for breathing room
                behavior: 'smooth'
            });
        });
    });
});
