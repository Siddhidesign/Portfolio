/* =========================================
   1. READING PROGRESS BAR
   ========================================= */
// When the user scrolls the page, run the updateProgressBar function
window.onscroll = function() {
    updateProgressBar();
    revealOnScroll(); // Also run the fade-in animation check
};

function updateProgressBar() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    
    let bar = document.getElementById("myBar");
    if (bar) {
        bar.style.width = scrolled + "%";
    }
}

/* =========================================
   2. SCROLL REVEAL ANIMATION (FADE IN)
   ========================================= */
// This makes elements fade in nicely as you scroll down
function revealOnScroll() {
    var reveals = document.querySelectorAll(".cs-section, .problem-card, .result-card");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150; // Trigger when element is 150px into view

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

/* =========================================
   3. PROTOTYPE BUTTON FLOATING ANIMATION
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const protoBtn = document.querySelector('.prototype-btn');
    
    if (protoBtn) {
        // Set initial state via JS so it doesn't hide if JS fails
        protoBtn.style.opacity = "0";
        protoBtn.style.transform = "translateY(20px)";
        protoBtn.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        
        observer.observe(protoBtn);
    }
    
    // Trigger reveals once on load in case user starts in middle of page
    revealOnScroll();
});
