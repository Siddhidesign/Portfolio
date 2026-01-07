/* ============================================================
   PROJECT DATA STORE
   ============================================================ */
// This array contains the 4 projects that are hidden by default
const extraProjects = [
    {
        title: "EV Charging-Human Factors Project",
        category: "UI & UX",
        img: "https://picsum.photos/600/400?random=11",
        url: "ev.html",
        overlay: "View Case Study"
    },
    {
        title: "GrocGenie-AI powered grocery tracking app",
        category: "Sustainability",
        img: "https://picsum.photos/600/400?random=12",
        url: "grocgenie.html",
        overlay: "View Case Study"
    },
    {
        title: "Mental Health Support App",
        category: "Medical UI",
        img: "https://picsum.photos/600/400?random=13",
        url: "health.html",
        overlay: "View Case Study"
    },
    {
        title: "Real-Time Identification of Medicinal Plants",
        category: "IoT Design",
        img: "https://picsum.photos/600/400?random=14",
        url: "medicine.html",
        overlay: "View Case Study"
    }
];

/* ============================================================
   LOAD MORE FUNCTIONALITY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const projectGrid = document.getElementById('projectGrid');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Loop through our data array and create the HTML elements
            extraProjects.forEach((proj, index) => {
                // Create the anchor wrapper
                const link = document.createElement('a');
                link.href = proj.url;
                link.className = 'project-card-link';
                
                // Add a small delay for each card so they fade in one by one (staggered)
                link.style.animationDelay = `${index * 0.1}s`;

                link.innerHTML = `
                    <div class="project-card">
                        <div class="card-image-container">
                            <img src="${proj.img}" alt="${proj.title}">
                            <div class="hover-overlay">${proj.overlay}</div>
                        </div>
                        <div class="card-info">
                            <h3>${proj.title}</h3>
                            <span class="category-tag">${proj.category}</span>
                        </div>
                    </div>
                `;

                // Append to the grid
                projectGrid.appendChild(link);
            });

            // Hide the button after all projects are loaded
            this.style.display = 'none';
        });
    }
});

/* ============================================================
   SMOOTH SCROLLING FOR NAV LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
