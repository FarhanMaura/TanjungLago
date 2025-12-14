// Shared authentication handler for all pages
let isAdmin = false;

// Check authentication status on page load
async function checkAuthStatus() {
  try {
    const response = await fetch("/api/auth/check");
    const data = await response.json();
    isAdmin = data.authenticated;
    updateAuthUI();
  } catch (error) {
    console.error("Error checking auth:", error);
    isAdmin = false;
    updateAuthUI();
  }
}

// Update UI based on authentication
function updateAuthUI() {
  const authNavItem = document.getElementById("authNavItem");
  const authIcon = document.getElementById("authIcon");
  const authText = document.getElementById("authText");

  if (authNavItem) {
    authNavItem.style.display = "block";
  }

  if (isAdmin) {
    // Update nav to show logout
    if (authIcon) authIcon.className = "fas fa-sign-out-alt";
    if (authText) authText.textContent = "Logout";
  } else {
    // Update nav to show login
    if (authIcon) authIcon.className = "fas fa-sign-in-alt";
    if (authText) authText.textContent = "Login";
  }
}

// Handle auth button click
function initAuthHandler() {
  const authNavLink = document.getElementById("authNavLink");

  if (authNavLink) {
    authNavLink.addEventListener("click", async (e) => {
      e.preventDefault();

      if (isAdmin) {
        // Logout
        try {
          const response = await fetch("/api/auth/logout", {
            method: "POST",
          });

          if (response.ok) {
            showNotification("Logout berhasil!", "success");
            isAdmin = false;
            updateAuthUI();
            
            // Reload if on gallery page to hide admin features
            if (window.location.pathname.includes("gallery")) {
              setTimeout(() => window.location.reload(), 1000);
            }
          }
        } catch (error) {
          console.error("Logout error:", error);
          showNotification("Error logout", "error");
        }
      } else {
        // Redirect to login
        window.location.href = "/login.html";
      }
    });
  }
}

// Simple notification function
function showNotification(message, type = "info") {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 3000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `;

  if (type === "success") {
    notification.style.background = "#25D366";
  } else if (type === "error") {
    notification.style.background = "#e74c3c";
  } else {
    notification.style.background = "#3498db";
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
  initAuthHandler();
});
