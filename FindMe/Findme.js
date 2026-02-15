document.addEventListener('DOMContentLoaded', () => {
    
    // --- STICKY NAVIGATION HIGHLIGHTER ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sticky-menu a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is in middle of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to current
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.sticky-menu a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- LIGHTBOX MODAL ---
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("modal-caption");

    // Open Modal
    window.openModal = function(element) {
        modal.style.display = "block";
        modalImg.src = element.src;
        captionText.innerHTML = element.alt;
        document.body.style.overflow = "hidden"; // Stop scrolling
    }

    // Close Modal
    window.closeModal = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Resume scrolling
    }

    // Keyboard Close (ESC)
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            window.closeModal();
        }
    });

    // Click Outside Close
    modal.onclick = function(event) {
        if (event.target === modal) {
            window.closeModal();
        }
    }
});
