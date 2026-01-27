/* =========================================
   IRS2GO - INTERACTIVE SCRIPTS
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Donut Chart Text Fix
    // Since CSS 'content' can't be easily dynamic without data-attr, 
    // we use JS to inject the percentage number inside the donut for accessibility
    
    const donuts = document.querySelectorAll('.donut');
    
    donuts.forEach(donut => {
        // The value is already set in the HTML style="--p:30", 
        // but we want to make sure the text inside matches visually.
        const percent = donut.textContent; 
        donut.innerHTML = `<span>${percent}</span>`;
    });

    console.log("Biotic Style IRS2Go Loaded");
});
document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       PART 1: SIDEBAR NAVIGATION HIGHLIGHT
    ========================================= */
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        root: document.querySelector('.content-area'), // Watch scrolling inside the right panel
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Find the ID of the section currently on screen
                const activeId = entry.target.getAttribute('id');
                
                // Add 'active' class to the matching link
                const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Start watching each section
    sections.forEach(section => {
        observer.observe(section);
    });

    /* =========================================
       PART 2: IMAGE ZOOM (LIGHTBOX)
    ========================================= */
    
    // Grab the modal elements from the HTML
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('fullImage');
    const closeBtn = document.querySelector('.close-btn');

    // Select ALL images inside the research placeholders
    // This works for both the single image AND the side-by-side images
    const images = document.querySelectorAll('.research-image-placeholder img');

    // Add a click event to every image
    images.forEach(img => {
        img.addEventListener('click', () => {
            modal.classList.add('active'); // Show the dark overlay
            modalImg.src = img.src;        // Copy the source of the clicked image to the modal
        });
    });

    // Function to close the modal
    const closeModal = () => {
        modal.classList.remove('active');
    };

    // Close when clicking the 'X' button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside the image (on the dark background)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});
