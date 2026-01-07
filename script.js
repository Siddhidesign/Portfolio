/* General Styles */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background-color: #f8f8f8; color: #333; }

/* Navigation */
.navbar { display: flex; justify-content: center; align-items: center; padding: 40px; gap: 80px; }
.nav-link { text-decoration: none; color: #888; font-size: 14px; font-weight: 500; }
.logo { font-family: 'Playfair Display', serif; font-size: 24px; text-align: center; line-height: 1; }
.orange-text { color: #d98e5f; display: block; }

/* Hero Section */
.hero-container { position: relative; height: 90vh; display: flex; justify-content: center; align-items: center; text-align: center; overflow: hidden; }
.main-title { font-family: 'Playfair Display', serif; font-size: clamp(40px, 8vw, 85px); color: #1a2a4e; line-height: 1.1; margin: 15px 0; }
.main-title em { font-style: italic; }
.cta-button { background: #ff1a1a; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; }

/* Floating Images */
.float-img { position: absolute; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); width: 180px; z-index: -1; }
.img-1 { top: 15%; left: 10%; transform: rotate(-15deg); }
.img-2 { top: 10%; right: 10%; transform: rotate(15deg); }
.img-3 { bottom: 15%; left: 15%; transform: rotate(-10deg); width: 220px; }
.img-4 { bottom: 10%; right: 15%; transform: rotate(10deg); width: 200px; }

/* Works Section */
.works-section { padding: 100px 5%; background: #eceae6; border-radius: 40px 40px 0 0; }
.section-intro { text-align: center; margin-bottom: 60px; }
.telescope-icon { width: 50px; margin-bottom: 20px; }
.italic-heading { font-family: 'Playfair Display', serif; font-style: italic; color: #1a2a4e; font-size: 24px; margin-bottom: 40px; }
.works-main-title { font-family: 'Playfair Display', serif; font-size: 60px; color: #1a2a4e; margin-bottom: 10px; }
.works-sub { color: #666; font-size: 18px; }

/* Project Grid */
.project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
.project-card { background: #e3e1dc; border-radius: 20px; padding: 25px; cursor: pointer; transition: transform 0.3s ease; }
.project-card:hover { transform: translateY(-10px); }

.card-image-container { position: relative; border-radius: 15px; overflow: hidden; background: #fff; margin-bottom: 20px; }
.card-image-container img { width: 100%; display: block; transition: filter 0.3s ease; }

/* Hover Detail Text */
.hover-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(26, 42, 78, 0.7); color: white;
    display: flex; justify-content: center; align-items: center;
    opacity: 0; transition: opacity 0.3s ease; font-weight: 500;
}
.project-card:hover .hover-overlay { opacity: 1; }
.project-card:hover .card-image-container img { filter: blur(2px); }

.card-info h3 { font-size: 28px; margin-bottom: 15px; color: #333; }
.category-tag { background: #222; color: white; padding: 8px 18px; border-radius: 20px; font-size: 12px; }

/* Load More Button */
.load-more-container { text-align: center; margin-top: 60px; }
.load-more-btn { background: #ff5e00; color: white; border: none; padding: 15px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.load-more-btn:hover { background: #e05200; transform: scale(1.05); }
