/* ============================================================
   EV CASE STUDY - INTERACTIVE JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Create and Add Progress Bar
    const progressContainer = document.createElement('div');
    progressContainer.id = 'progress-container';
    const progressBar = document.createElement('div');
    progressBar.id = 'myBar';
    progressContainer.appendChild(progressBar);
    document.body.prepend(progressContainer);

    // 2. Scroll Logic
    window.onscroll = function() {
        // Progress Bar Update
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (winScroll / height) * 100;
        document.getElementById("myBar").style.width = scrolled + "%";

        // Navbar Styling on Scroll
        const nav = document.querySelector('.navbar');
        if (winScroll > 50) {
            nav.style.background = "rgba(255, 255, 255, 0.95)";
            nav.style.padding = "15px 5%";
            nav.style.boxShadow = "0 2px 20px rgba(0,0,0,0.05)";
        } else {
            nav.style.background = "transparent";
            nav.style.padding = "30px 5%";
            nav.style.boxShadow = "none";
        }
    };

    // 3. Intersection Observer for Phase Animations
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const phases = document.querySelectorAll('.cs-phase');
    phases.forEach(phase => {
        observer.observe(phase);
    });
});
