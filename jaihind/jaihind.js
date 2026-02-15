document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that are linked in the sidebar
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sticky-menu a');

    // Options for the Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Get the ID of the current section
                const id = entry.target.getAttribute('id');
                
                // Find the corresponding link and add active class
                const activeLink = document.querySelector(`.sticky-menu a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Start observing each section
    sections.forEach(section => {
        observer.observe(section);
    });
});
