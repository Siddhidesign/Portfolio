window.onscroll = function() { updateProgressBar() };

function updateProgressBar() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    
    // Create the bar if it doesn't exist
    let bar = document.getElementById("myBar");
    if (!bar) {
        let container = document.createElement("div");
        container.style.cssText = "position:fixed;top:0;z-index:100;width:100%;height:4px;background:#ccc;";
        bar = document.createElement("div");
        bar.id = "myBar";
        bar.style.cssText = "height:4px;background:#ff5e00;width:0%;";
        container.appendChild(bar);
        document.body.appendChild(container);
    }
    bar.style.width = scrolled + "%";
}/* =========================================
   BUTTON FADE-IN ANIMATION
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the button is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); // Run only once
            }
        });
    }, observerOptions);

    const protoBtn = document.querySelector('.prototype-btn');
    
    if (protoBtn) {
        // Set initial state for animation
        protoBtn.style.opacity = "0";
        protoBtn.style.transform = "translateY(20px)";
        protoBtn.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        
        // Start watching
        observer.observe(protoBtn);
    }
});
