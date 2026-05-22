
// Mobile menu functionality
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

// Mobile menu toggle
menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Close mobile menu when clicking on links
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Filter functionality
const filterBtns = document.querySelectorAll(".filter-btn");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const toolCards = document.querySelectorAll(".tool-card");

function filterTools(category) {
    toolCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
            card.style.display = "block";
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "scale(1)";
            }, 10);
        } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.9)";
            setTimeout(() => {
                card.style.display = "none";
            }, 300);
        }
    });
}

// Filter buttons click
filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const category = btn.dataset.category;

        // Update active state
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Filter tools
        filterTools(category);
    });
});

// Sidebar links click
sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = link.dataset.category;

        // Update active state
        sidebarLinks.forEach((l) => l.classList.remove("sidebar-active"));
        link.classList.add("sidebar-active");

        // Update filter buttons
        filterBtns.forEach((btn) => {
            if (btn.dataset.category === category) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // Filter tools
        filterTools(category);

        // Scroll to tools section
        document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href !== "#") {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    });
});

// Add transition styles for tool cards
toolCards.forEach((card) => {
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
});

// Navbar background on scroll
const navbar = document.querySelector("nav");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("shadow-xl");
    } else {
        navbar.classList.remove("shadow-xl");
    }
});

// Form submission (only if form exists)
const contactForm = document.querySelector("form");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for your message! We will get back to you soon.");
        contactForm.reset();
    });
}


async function loadComponent(id, file) {
    const response = await fetch(file);
    const data = await response.text();
    document.getElementById(id).innerHTML = data;
}
loadComponent("footer", "./s/footer.html");