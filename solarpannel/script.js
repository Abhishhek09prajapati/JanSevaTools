
// --- Sidebar Functionality ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// --- Slider Functionality ---
let currentSlide = 0;
const slidesContainer = document.getElementById('slides');
const totalSlides = 3;

function updateSlider() {
    slidesContainer.style.transform = `translateX(-${currentSlide * 33.333}%)`;
}

function moveSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= totalSlides) {
        currentSlide = 0; // wrap to first slide
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1; // wrap to last slide
    }
    updateSlider();
}

// Auto slide change every 5 seconds
setInterval(() => {
    moveSlide(1);
}, 1500);
