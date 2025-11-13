// Main JavaScript - Navigation and Common Functionality

// Initialize navigation
function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Prevent body scroll when menu is open
      if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((n) =>
      n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "auto";
      })
    );

    // Close menu when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        const isClickInsideNav =
          navMenu.contains(e.target) || hamburger.contains(e.target);
        if (!isClickInsideNav && navMenu.classList.contains("active")) {
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
          document.body.style.overflow = "auto";
        }
      }
    });
  }
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (
      linkPage === currentPage ||
      (currentPage === "index.html" &&
        (linkPage === "/" || linkPage === "/index.html")) ||
      (currentPage === "" && (linkPage === "/" || linkPage === "/index.html"))
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Utility function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// Handle navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const scrollY = window.scrollY;

  if (scrollY > 100) {
    navbar.style.background = "rgba(44, 85, 48, 0.95)";
    navbar.style.backdropFilter = "blur(10px)";
  } else {
    navbar.style.background = "linear-gradient(135deg, #2c5530, #1e3a23)";
    navbar.style.backdropFilter = "none";
  }
}

// Simple photo modal
function openPhotoModal(src, title) {
  // Create modal if it doesn't exist
  let modal = document.getElementById("photoModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "photoModal";
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            cursor: pointer;
        `;

    modal.innerHTML = `
            <div style="position: relative; max-width: 90%; max-height: 90%;">
                <img src="${src}" alt="${title}" style="max-width: 100%; max-height: 90vh; border-radius: 10px;">
                <div style="color: white; text-align: center; margin-top: 10px; font-size: 1.1rem;">${title}</div>
                <button onclick="closePhotoModal()" style="position: absolute; top: -40px; right: 0; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">×</button>
            </div>
        `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closePhotoModal();
      }
    });

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  }
}

function closePhotoModal() {
  const modal = document.getElementById("photoModal");
  if (modal) {
    modal.remove();
    document.body.style.overflow = "auto";
  }
}

// Handle window resize
function handleResize() {
  const navMenu = document.querySelector(".nav-menu");
  const hamburger = document.querySelector(".hamburger");

  if (window.innerWidth > 768) {
    // Reset mobile menu state on desktop
    if (navMenu && hamburger) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation
  initNavigation();

  // Set active navigation
  setActiveNavLink();

  // Add scroll effect to navbar
  window.addEventListener("scroll", handleNavbarScroll);

  // Handle window resize
  window.addEventListener("resize", handleResize);

  console.log("Website Desa Tanjung Lago loaded successfully!");
});

// Utility function to format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
