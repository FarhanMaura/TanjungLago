// Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    })
  );
}

// Gallery Functionality
let galleryData = [];

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
    // Fallback data jika API belum tersedia
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
      {
        id: 5,
        title: "Gotong Royong",
        category: "aktivitas",
        url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 6,
        title: "Produk Kerajinan",
        category: "produk",
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      },
    ];
    displayGallery("all");
  }
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

  filteredData.forEach((item) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";
    galleryItem.setAttribute("data-category", item.category);
    galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <h4>${item.title}</h4>
            </div>
        `;
    galleryItem.addEventListener("click", () => openModal(item));
    galleryGrid.appendChild(galleryItem);
  });
}

// Filter gallery
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

// Modal functionality
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const closeModal = document.querySelector(".close");

function openModal(item) {
  if (modal && modalImg && modalCaption) {
    modal.style.display = "block";
    modalImg.src = item.url;
    modalCaption.innerHTML = `<h3>${item.title}</h3><p>Kategori: ${item.category}</p>`;
  }
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    if (modal) {
      modal.style.display = "none";
    }
  });
}

if (modal) {
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Upload form handling
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

    formData.append("photo", fileInput.files[0]);
    formData.append("title", title);
    formData.append("category", category);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Foto berhasil diupload!");
        uploadForm.reset();
        loadGallery(); // Reload gallery
      } else {
        const error = await response.json();
        alert("Error uploading photo: " + error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading photo: " + error.message);
    }
  });
}

// Statistics Chart
function initChart() {
  const ctx = document.getElementById("incomeChart");
  if (!ctx) return;

  const incomeChart = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Pertanian", "Perkebunan", "Kerajinan", "Kehutanan"],
      datasets: [
        {
          label: "Pendapatan Rata-rata (Rp)",
          data: [1500000, 12000000, 500000, 700000],
          backgroundColor: [
            "rgba(44, 85, 48, 0.7)",
            "rgba(162, 215, 41, 0.7)",
            "rgba(139, 195, 74, 0.7)",
            "rgba(107, 153, 58, 0.7)",
          ],
          borderColor: [
            "rgba(44, 85, 48, 1)",
            "rgba(162, 215, 41, 1)",
            "rgba(139, 195, 74, 1)",
            "rgba(107, 153, 58, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "Rp " + value.toLocaleString("id-ID");
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return "Rp " + context.parsed.y.toLocaleString("id-ID");
            },
          },
        },
      },
    },
  });
}

// Contact form handling
const messageForm = document.getElementById("messageForm");
if (messageForm) {
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Harap lengkapi semua field!");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Pesan berhasil dikirim!");
        messageForm.reset();
      } else {
        const error = await response.json();
        alert("Error sending message: " + error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending message: " + error.message);
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
  initChart();

  // Load statistics data
  loadStatistics();
});

// Load statistics from API
async function loadStatistics() {
  try {
    const response = await fetch("/api/statistics");
    if (response.ok) {
      const stats = await response.json();

      // Update DOM elements dengan data dari API
      if (stats.total_penduduk) {
        const totalEl = document.getElementById("totalPenduduk");
        if (totalEl) totalEl.textContent = stats.total_penduduk;
      }
      if (stats.total_kk) {
        const kkEl = document.getElementById("totalKK");
        if (kkEl) kkEl.textContent = stats.total_kk;
      }
      if (stats.penduduk_laki) {
        const lakiEl = document.getElementById("pendudukLaki");
        if (lakiEl) lakiEl.textContent = stats.penduduk_laki;
      }
      if (stats.penduduk_perempuan) {
        const perempuanEl = document.getElementById("pendudukPerempuan");
        if (perempuanEl) perempuanEl.textContent = stats.penduduk_perempuan;
      }
    }
  } catch (error) {
    console.error("Error loading statistics:", error);
  }
}
