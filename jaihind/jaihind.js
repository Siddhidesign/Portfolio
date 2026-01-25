// Initialize AOS animation library
AOS.init({
    duration: 800,    // How long the animation lasts
    offset: 120,      // Offset (in px) from the original trigger point
    once: true,       // Whether animation should happen only once
    easing: 'ease-in-out-quad'
});
// Initialize AOS animation library
AOS.init({
    duration: 800,
    offset: 120,
    once: true,
    easing: 'ease-in-out-quad'
});

/* --- LIGHTBOX FUNCTIONS --- */

// Get the modal
var modal = document.getElementById("imageModal");

// Get the image and insert it inside the modal
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

function openModal(element) {
  modal.style.display = "block";
  modalImg.src = element.src;
  captionText.innerHTML = element.alt; // Uses the alt text as caption
  
  // Disable scrolling on body while modal is open
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  
  // Re-enable scrolling
  document.body.style.overflow = "auto";
}

// Close modal when pressing ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});
