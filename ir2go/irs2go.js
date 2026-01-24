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
