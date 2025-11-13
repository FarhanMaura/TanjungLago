// Gallery functionality
let galleryData = [];

document.addEventListener("DOMContentLoaded", function () {
  loadGallery();
  initGalleryFilters();
  initUploadForm();
  initModal();
});

// Load gallery images
async function loadGallery() {
  try {
    const response = await fetch("/api/photos");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    galleryData = await response.json();
    displayGallery("all");
  } catch (error) {
    console.error("Error loading gallery:", error);
    // Fallback data
    galleryData = [
      {
        id: 1,
        title: "Pemandangan Desa",
        category: "wisata",
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 2,
        title: "Aktivitas Nelayan",
        category: "aktivitas",
        url: "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 3,
        title: "Kerupuk Kemplang",
        category: "produk",
        url: "https://images.unsplash.com/photo-1587336764377-1eb53f6d80a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 4,
        title: "Sawah Desa",
        category: "wisata",
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
    ];
    displayGallery("all");
  }
}

// Initialize gallery filters
function initGalleryFilters() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.getAttribute("data-filter");
      displayGallery(filter);
    });
  });
}

// Display gallery based on filter
function displayGallery(filter) {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  const filteredData =
    filter === "all"
      ? galleryData
      : galleryData.filter((item) => item.category === filter);

  if (filteredData.length === 0) {
    galleryGrid.innerHTML = `
            <div class="no-photos" style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: #666;">
                <i class="fas fa-images" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 1rem; color: #2c5530;">Tidak ada foto untuk kategori ini</h3>
                <p>Silakan upload foto pertama untuk kategori ${filter}</p>
            </div>
        `;
    return;
  }

  filteredData.forEach((item) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";
    galleryItem.setAttribute("data-category", item.category);
    galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <h4>${item.title}</h4>
                <span>${item.category}</span>
                <button class="view-btn" onclick="openModal('${item.url}', '${item.title}')" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;">
                    <i class="fas fa-expand" style="color: #2c5530;"></i>
                </button>
            </div>
        `;
    galleryGrid.appendChild(galleryItem);
  });
}

// Initialize upload form
function initUploadForm() {
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();
      const fileInput = document.getElementById("photoInput");
      const title = document.getElementById("photoTitle").value;
      const category = document.getElementById("photoCategory").value;

      if (!fileInput.files[0] || !title || !category) {
        alert("Harap lengkapi semua field!");
        return;
      }

      // Show loading state
      const submitBtn = uploadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
      submitBtn.disabled = true;

      formData.append("photo", fileInput.files[0]);
      formData.append("title", title);
      formData.append("category", category);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          showNotification("Foto berhasil diupload!", "success");
          uploadForm.reset();
          loadGallery(); // Reload gallery
        } else {
          const error = await response.json();
          showNotification("Error uploading photo: " + error.error, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("Error uploading photo: " + error.message, "error");
      } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// Initialize modal
function initModal() {
  const modal = document.getElementById("imageModal");
  const closeBtn = document.querySelector(".close");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });
  }
}

// Modal functionality
function openModal(src, title) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");

  if (modal && modalImg && modalCaption) {
    modal.style.display = "block";
    modalImg.src = src;
    modalCaption.innerHTML = `<h3>${title}</h3>`;

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  }
}

// Close modal
function closeModal() {
  const modal = document.getElementById("imageModal");
  if (modal) {
    modal.style.display = "none";
    // Restore body scroll
    document.body.style.overflow = "auto";
  }
}

// Show notification
function showNotification(message, type = "info") {
  // Remove existing notification
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

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Add CSS for notifications
const notificationStyles = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
