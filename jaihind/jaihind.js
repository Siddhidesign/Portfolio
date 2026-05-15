document.addEventListener('DOMContentLoaded', () => {
    
    // --- STICKY NAVIGATION HIGHLIGHTER ---
    const sections = document.querySelectorAll('section[id]'); // Only select sections with IDs
    const navLinks = document.querySelectorAll('.sticky-menu a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is near middle of viewport
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
                
                // Find the matching link and make it active
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

    // --- LIGHTBOX MODAL FUNCTIONALITY ---
    
    // Get the modal
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("modal-caption");

    // Make functions globally available so HTML onclick works
    window.openModal = function(element) {
        modal.style.display = "block";
        modalImg.src = element.src;
        captionText.innerHTML = element.alt;
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    window.closeModal = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Restore scrolling
    }

    // Close on Escape Key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            window.closeModal();
        }
    });

    // Close if clicking outside the image
    modal.onclick = function(event) {
        if (event.target === modal) {
            window.closeModal();
        }
    }
});
