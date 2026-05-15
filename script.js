/* ============================================================
   PROJECT DATA STORE
   ============================================================ */
const extraProjects = [
    {
        title: "EV Charging - Human Factors Project",
        category: "UI & UX",
        img: "assets/Project2.png",
        url: "ev/ev.html",
        overlay: "View Case Study"
    },
    {
        title: "GrocGenie - AI powered grocery tracking app",
        category: "Sustainability",
        img: "assets/grocgenie.png",
        url: "grocgenie/grocgenie.html",
        overlay: "View Case Study"
    },
    {
        title: "Real-Time Identification of Medicinal Plants",
        category: "IoT Design",
        img: "assets/real-time-thumbnail.png",
        url: "https://github.com/Siddhidesign/Real-time-Identification-of-Medicinal-Plants?tab=readme-ov-file",
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
            extraProjects.forEach((proj, index) => {
                const link = document.createElement('a');
                link.href = proj.url;
                link.className = 'project-card-link reveal';
                link.style.transitionDelay = `${index * 0.1}s`;

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

                projectGrid.appendChild(link);

                // Trigger reveal on newly added cards
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        link.classList.add('visible');
                    });
                });
            });

            this.style.display = 'none';
        });
    }

    /* ============================================================
       TITLE CYCLING ANIMATION
       ============================================================ */
    const titleLine1 = document.getElementById('titleLine1');
    const titleLine2 = document.getElementById('titleLine2');
    const heroTitle  = document.getElementById('heroTitle');

    if (titleLine1 && titleLine2 && heroTitle) {
        const titles = [
            { line1: 'User Experience', line2: 'Designer' },
            { line1: 'UI',              line2: 'Developer' },
            { line1: 'User',            line2: 'Researcher' },
            { line1: 'Product',         line2: 'Designer' },
        ];

        let current = 0;

        setInterval(() => {
            heroTitle.classList.add('title-fade-out');

            setTimeout(() => {
                current = (current + 1) % titles.length;
                titleLine1.textContent = titles[current].line1;
                titleLine2.textContent = titles[current].line2;
                heroTitle.classList.remove('title-fade-out');
            }, 450);
        }, 3000);
    }

    /* ============================================================
       SCROLL REVEAL — IntersectionObserver
       ============================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ============================================================
       NAVBAR SCROLL SHRINK
       ============================================================ */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* ============================================================
       CARD FAN — looping animation + hover interactions
       ============================================================ */
    const cardFanWrapper = document.getElementById('cardFanWrapper');
    if (cardFanWrapper) {
        const fanCards         = Array.from(cardFanWrapper.querySelectorAll('.fan-card'));
        const FAN_ROTATIONS    = [-45, -15, 15, 45];   // fanned-out positions (30° gaps)
        const SPREAD_ROTATIONS = [-60, -20, 20, 60];   // hover-spread positions (40° gaps)
        const STACK_ROT        = -47;                   // stacked pile position (left)
        const STAGGER_MS       = 200;                   // delay between each card fanning
        const HOLD_MS          = 4000;                  // pause between loop cycles
        const RESUME_MS        = 1000;                  // delay before loop resumes after hover

        let loopTimer = null;
        let isHovered = false;
        let animGen   = 0;  // incremented to cancel in-flight animation callbacks

        function useSpring(card) {
            card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease-in-out';
        }
        function useSnappy(card) {
            card.style.transition = 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out';
        }
        function useCollapse(card) {
            card.style.transition = 'transform 0.4s ease-in-out';
        }

        // Collapse all cards to the stacked position at once
        function collapseToStack(gen, onDone) {
            fanCards.forEach((card, i) => {
                useCollapse(card);
                card.style.transform = `rotate(${STACK_ROT}deg)`;
                card.style.zIndex    = fanCards.length - i;
                card.style.boxShadow = '';
            });
            setTimeout(() => { if (animGen === gen) onDone(); }, 500);
        }

        // Fan cards out left-to-right with spring stagger
        function fanOut(gen, onDone) {
            fanCards.forEach((card, i) => {
                setTimeout(() => {
                    if (animGen !== gen) return;
                    useSpring(card);
                    card.style.transform = `rotate(${FAN_ROTATIONS[i]}deg)`;
                    card.style.zIndex    = i + 1;
                }, i * STAGGER_MS);
            });
            const settlems = (fanCards.length - 1) * STAGGER_MS + 700;
            setTimeout(() => {
                if (animGen !== gen) return;
                fanCards.forEach(useSnappy);
                if (onDone) onDone();
            }, settlems);
        }

        // Schedule the next collapse → fan-out cycle
        function scheduleLoop() {
            const gen = ++animGen;
            loopTimer = setTimeout(() => {
                if (isHovered) return;
                collapseToStack(gen, () => {
                    if (isHovered) return;
                    setTimeout(() => {
                        if (isHovered) return;
                        fanOut(gen, () => { if (!isHovered) scheduleLoop(); });
                    }, 250);
                });
            }, HOLD_MS);
        }

        // --- Initial state: stacked pile on the left, visible ---
        fanCards.forEach((card, i) => {
            card.style.transition = 'none';
            card.style.transform  = `rotate(${STACK_ROT}deg)`;
            card.style.opacity    = '1';
            card.style.zIndex     = fanCards.length - i;
        });

        // Fan out on page load after a brief moment, then start the loop
        setTimeout(() => {
            const gen = ++animGen;
            fanOut(gen, () => scheduleLoop());
        }, 500);

        // --- Wrapper hover: spread cards, pause loop ---
        cardFanWrapper.addEventListener('mouseenter', () => {
            isHovered = true;
            clearTimeout(loopTimer);
            ++animGen; // cancel any in-flight loop step

            fanCards.forEach((card, i) => {
                useSnappy(card);
                card.style.transform = `rotate(${SPREAD_ROTATIONS[i]}deg)`;
                card.style.zIndex    = i + 1;
                card.style.boxShadow = '';
            });
        });

        cardFanWrapper.addEventListener('mouseleave', () => {
            isHovered = false;
            fanCards.forEach((card, i) => {
                useSnappy(card);
                card.style.transform = `rotate(${FAN_ROTATIONS[i]}deg)`;
                card.style.zIndex    = i + 1;
                card.style.boxShadow = '';
            });
            // Resume loop after 1 second
            loopTimer = setTimeout(() => { if (!isHovered) scheduleLoop(); }, RESUME_MS);
        });

        // --- Individual card lift on hover ---
        fanCards.forEach((card, i) => {
            card.addEventListener('mouseenter', () => {
                useSnappy(card);
                card.style.transform = `rotate(${SPREAD_ROTATIONS[i]}deg) translateY(-20px)`;
                card.style.zIndex    = '10';
                card.style.boxShadow = '0 30px 60px rgba(0,0,0,0.3)';
            });
            card.addEventListener('mouseleave', () => {
                if (isHovered) {
                    useSnappy(card);
                    card.style.transform = `rotate(${SPREAD_ROTATIONS[i]}deg)`;
                    card.style.zIndex    = i + 1;
                    card.style.boxShadow = '';
                }
            });
        });
    }

    /* ============================================================
       SKILL TAGS — staggered float animation on section enter
       ============================================================ */
    const skillSection = document.querySelector('.services-section');
    if (skillSection) {
        const skillTags = skillSection.querySelectorAll('.skill-tag');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillTags.forEach((tag, i) => {
                        tag.style.transition = `transform 0.3s ease, background-color 0.3s ease, opacity 0.5s ease ${i * 0.06}s`;
                        tag.style.opacity = '1';
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillTags.forEach(tag => { tag.style.opacity = '0'; });
        skillObserver.observe(skillSection);
    }
});

/* ============================================================
   SMOOTH SCROLLING FOR NAV LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
