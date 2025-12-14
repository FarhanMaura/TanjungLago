let galleryData = [];
let currentDeleteId = null;

document.addEventListener("DOMContentLoaded", function () {
  loadGallery();
  initGalleryFilters();
  initUploadForm();
  initModal();
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
    galleryData = [
      {
        id: 1,
        title: "Pemandangan Desa",
        category: "wisata",
        activity_date: "2023-12-01",
        description: "Pemandangan indah di sore hari yang menenangkan hati.",
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 2,
        title: "Aktivitas Nelayan",
        category: "aktivitas",
        activity_date: "2023-11-20",
        description:
          "Para nelayan sedang mempersiapkan jaring untuk menangkap ikan.",
        url: "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 3,
        title: "Kerupuk Kemplang",
        category: "produk",
        activity_date: "2023-10-15",
        description: "Proses pembuatan kerupuk kemplang khas desa.",
        url: "https://images.unsplash.com/photo-1587336764377-1eb53f6d80a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 4,
        title: "Sawah Desa",
        category: "wisata",
        activity_date: "2023-09-05",
        description: "Hamparan sawah hijau yang membentang luas.",
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
    ];
    displayGallery("all");
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

    galleryItem.innerHTML = `
            <div class="gallery-img-container">
                <img src="${item.url}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay-actions">
                    <button class="action-btn view" onclick="openModal('${
                      item.url
                    }', '${
      item.title
    }')" title="Lihat"><i class="fas fa-expand"></i></button>
                    <button class="action-btn delete" onclick="openDeleteModal(${
                      item.id
                    })" title="Hapus"><i class="fas fa-trash"></i></button>
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
