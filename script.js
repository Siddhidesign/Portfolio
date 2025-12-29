document.getElementById('loadMoreBtn').addEventListener('click', function() {
    const grid = document.getElementById('projectGrid');
    
    // Example data for new projects
    const newProjects = [
        { title: "Mobile App Design", category: "UX Design", img: "https://picsum.photos/600/400?random=20" },
        { title: "Brand Identity", category: "Visual", img: "https://picsum.photos/600/400?random=21" }
    ];

    newProjects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${proj.img}" alt="${proj.title}">
                <div class="hover-overlay">Click for more details</div>
            </div>
            <div class="card-info">
                <h3>${proj.title}</h3>
                <span class="category-tag">${proj.category}</span>
            </div>
        `;
        grid.appendChild(card);
    });

    // Optional: Hide button if no more projects
    // this.style.display = 'none';
});