// Intro fade-out after animation
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("intro-overlay").style.display = "none";
  }, 5000);
});

// Smooth Scroll Navigation
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });

    document.querySelectorAll(".nav-links a")
      .forEach(a => a.classList.remove("active"));
    this.classList.add("active");
  });
});
