let galleryData = [];
let currentDeleteId = null;
let currentEditId = null;
let isAdmin = false;

document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
  loadGallery();
  initGalleryFilters();
  initUploadForm();
  initModal();
  initAuthNav();
});

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
    galleryData = [];
    displayGallery("all");
  }
}

// Check authentication status
async function checkAuthStatus() {
  try {
    const response = await fetch("/api/auth/check");
    const data = await response.json();
    isAdmin = data.authenticated;
    updateUIForAuth();
  } catch (error) {
    console.error("Error checking auth:", error);
    isAdmin = false;
    updateUIForAuth();
  }
}

// Update UI based on authentication
function updateUIForAuth() {
  const uploadSection = document.querySelector(".upload-section");
  const authNavItem = document.getElementById("authNavItem");
  const authNavLink = document.getElementById("authNavLink");
  const authIcon = document.getElementById("authIcon");
  const authText = document.getElementById("authText");

  if (authNavItem) {
    authNavItem.style.display = "block";
  }

  if (isAdmin) {
    // Show upload section for admin
    if (uploadSection) {
      uploadSection.style.display = "block";
    }
    
    // Update nav to show logout
    if (authIcon) authIcon.className = "fas fa-sign-out-alt";
    if (authText) authText.textContent = "Logout";
  } else {
    // Hide upload section for non-admin
    if (uploadSection) {
      uploadSection.style.display = "none";
    }
    
    // Update nav to show login
    if (authIcon) authIcon.className = "fas fa-sign-in-alt";
    if (authText) authText.textContent = "Login";
  }
}

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

    const date = item.activity_date
      ? new Date(item.activity_date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    // Show edit/delete buttons only for admin
    const adminButtons = isAdmin
      ? `<button class="action-btn edit" onclick="openEditModal(${
          item.id
        })" title="Edit"><i class="fas fa-edit"></i></button>
         <button class="action-btn delete" onclick="openDeleteModal(${
           item.id
         })" title="Hapus"><i class="fas fa-trash"></i></button>`
      : "";

    galleryItem.innerHTML = `
            <div class="gallery-img-container">
                <img src="${item.url}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay-actions">
                    <button class="action-btn view" onclick="openModal('${
                      item.url
                    }', '${
      item.title
    }')" title="Lihat"><i class="fas fa-expand"></i></button>
                    ${adminButtons}
                </div>
                <span class="category-badge ${item.category}">${
      item.category
    }</span>
            </div>
            <div class="gallery-content">
                <div class="gallery-meta">
                    <i class="far fa-calendar-alt"></i> ${date}
                </div>
                <h4>${item.title}</h4>
                <p class="gallery-desc">${
                  item.description || "Tidak ada deskripsi"
                }</p>
            </div>
        `;
    galleryGrid.appendChild(galleryItem);
  });
}

function initUploadForm() {
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();
      const fileInput = document.getElementById("photoInput");
      const title = document.getElementById("photoTitle").value;
      const category = document.getElementById("photoCategory").value;
      const date = document.getElementById("photoDate").value;
      const description = document.getElementById("photoDescription").value;

      if (!fileInput.files[0] || !title || !category || !date) {
        alert("Harap lengkapi field wajib (Foto, Judul, Kategori, Tanggal)!");
        return;
      }

      const submitBtn = uploadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
      submitBtn.disabled = true;

      formData.append("photo", fileInput.files[0]);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("activity_date", date);
      formData.append("description", description);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          showNotification("Foto berhasil diupload!", "success");
          uploadForm.reset();
          loadGallery();
        } else {
          const error = await response.json();
          showNotification("Error uploading photo: " + error.error, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("Error uploading photo: " + error.message, "error");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });
  }

  initDeleteModal();
  initEditModal();
}

function openModal(src, title) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");

  if (modal && modalImg && modalCaption) {
    modal.style.display = "block";
    modalImg.src = src;
    modalCaption.innerHTML = `<h3>${title}</h3>`;
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function openDeleteModal(photoId) {
  currentDeleteId = photoId;
  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) {
    deleteModal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) {
    deleteModal.style.display = "none";
    document.body.style.overflow = "auto";
    currentDeleteId = null;
  }
}

async function deletePhoto(photoId) {
  try {
    const response = await fetch(`/api/photos/${photoId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showNotification("Foto berhasil dihapus!", "success");
      loadGallery();
    } else {
      const error = await response.json();
      showNotification("Error menghapus foto: " + error.error, "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification("Error menghapus foto: " + error.message, "error");
  }
}

function initDeleteModal() {
  const deleteModal = document.getElementById("deleteModal");
  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");

  if (confirmDelete) {
    confirmDelete.addEventListener("click", () => {
      if (currentDeleteId) {
        deletePhoto(currentDeleteId);
      }
      closeDeleteModal();
    });
  }

  if (cancelDelete) {
    cancelDelete.addEventListener("click", closeDeleteModal);
  }

  if (deleteModal) {
    window.addEventListener("click", (e) => {
      if (e.target === deleteModal) {
        closeDeleteModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && deleteModal.style.display === "block") {
        closeDeleteModal();
      }
    });
  }
}

// ============= EDIT MODAL =============

function openEditModal(photoId) {
  if (!isAdmin) {
    showNotification("Hanya admin yang dapat mengedit foto", "error");
    return;
  }

  const photo = galleryData.find((p) => p.id === photoId);
  if (!photo) {
    showNotification("Foto tidak ditemukan", "error");
    return;
  }

  currentEditId = photoId;

  // Populate form
  document.getElementById("editPhotoId").value = photo.id;
  document.getElementById("editPhotoTitle").value = photo.title;
  document.getElementById("editPhotoCategory").value = photo.category;
  document.getElementById("editPhotoDate").value = photo.activity_date || "";
  document.getElementById("editPhotoDescription").value =
    photo.description || "";

  // Show modal
  const editModal = document.getElementById("editModal");
  if (editModal) {
    editModal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeEditModal() {
  const editModal = document.getElementById("editModal");
  if (editModal) {
    editModal.style.display = "none";
    document.body.style.overflow = "auto";
    currentEditId = null;
  }
}

function initEditModal() {
  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editForm");
  const closeEditBtn = document.querySelector(".close-edit");
  const cancelEditBtn = document.getElementById("cancelEdit");

  if (closeEditBtn) {
    closeEditBtn.addEventListener("click", closeEditModal);
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", closeEditModal);
  }

  if (editForm) {
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const photoId = document.getElementById("editPhotoId").value;
      const title = document.getElementById("editPhotoTitle").value;
      const category = document.getElementById("editPhotoCategory").value;
      const activity_date = document.getElementById("editPhotoDate").value;
      const description = document.getElementById(
        "editPhotoDescription"
      ).value;

      const submitBtn = editForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(`/api/photos/${photoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category,
            activity_date,
            description,
          }),
        });

        if (response.ok) {
          showNotification("Foto berhasil diupdate!", "success");
          closeEditModal();
          loadGallery();
        } else {
          const error = await response.json();
          showNotification("Error: " + error.error, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("Error updating photo: " + error.message, "error");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  if (editModal) {
    window.addEventListener("click", (e) => {
      if (e.target === editModal) {
        closeEditModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && editModal.style.display === "block") {
        closeEditModal();
      }
    });
  }
}

// ============= AUTH NAV =============

function initAuthNav() {
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
            updateUIForAuth();
            loadGallery(); // Reload to hide edit/delete buttons
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
  }, 5000);
}

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

const styleSheet = document.createElement("style");
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
