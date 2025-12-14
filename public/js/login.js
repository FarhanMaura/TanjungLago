// Check if already logged in
async function checkAuth() {
  try {
    const response = await fetch("/api/auth/check");
    const data = await response.json();
    
    if (data.authenticated) {
      // Already logged in, redirect to gallery
      window.location.href = "/gallery.html";
    }
  } catch (error) {
    console.error("Error checking auth:", error);
  }
}

// Run on page load
checkAuth();

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const loginBtn = document.getElementById("loginBtn");
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");

  // Hide previous errors
  errorMessage.style.display = "none";

  // Validate inputs
  if (!username || !password) {
    showError("Username dan password harus diisi");
    return;
  }

  // Show loading state
  const originalBtnText = loginBtn.innerHTML;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
  loginBtn.disabled = true;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Login successful
      showSuccess("Login berhasil! Mengalihkan...");
      
      // Redirect to gallery after short delay
      setTimeout(() => {
        window.location.href = "/gallery.html";
      }, 1000);
    } else {
      // Login failed
      showError(data.error || "Login gagal. Silakan coba lagi.");
      loginBtn.innerHTML = originalBtnText;
      loginBtn.disabled = false;
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("Terjadi kesalahan. Silakan coba lagi.");
    loginBtn.innerHTML = originalBtnText;
    loginBtn.disabled = false;
  }
});

function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  
  errorText.textContent = message;
  errorMessage.style.display = "flex";
  errorMessage.style.background = "#fee";
  errorMessage.style.color = "#c33";
  errorMessage.style.border = "1px solid #fcc";
}

function showSuccess(message) {
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  
  errorText.textContent = message;
  errorMessage.style.display = "flex";
  errorMessage.style.background = "#efe";
  errorMessage.style.color = "#2c5530";
  errorMessage.style.border = "1px solid #cfc";
  
  // Change icon to success
  errorMessage.querySelector("i").className = "fas fa-check-circle";
}
