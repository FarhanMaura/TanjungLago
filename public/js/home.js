// Homepage specific functionality
document.addEventListener("DOMContentLoaded", function () {
  // Load latest photos for preview
  loadPhotoPreview();

  // Animate stats counter
  animateStats();

  // Load statistics data
  loadStatistics();
});

// Load photo preview from API
async function loadPhotoPreview() {
  try {
    const response = await fetch("/api/photos?limit=4");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const photos = await response.json();

    const previewGrid = document.getElementById("photoPreview");
    if (previewGrid && photos.length > 0) {
      previewGrid.innerHTML = photos
        .map(
          (photo) => `
                <div class="preview-item" onclick="openPhotoModal('${photo.url}', '${photo.title}')">
                    <img src="${photo.url}" alt="${photo.title}" loading="lazy">
                    <div class="preview-overlay">
                        <h4>${photo.title}</h4>
                        <span>${photo.category}</span>
                    </div>
                </div>
            `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading photo preview:", error);
    // Fallback photos are already in HTML
  }
}

// Animate statistics counters
function animateStats() {
  const counters = document.querySelectorAll(".hero-stat h3");

  counters.forEach((counter) => {
    const originalText = counter.textContent;
    let target;

    if (originalText.includes(",")) {
      target = parseInt(originalText.replace(",", ""));
    } else if (originalText.includes("+")) {
      target = parseInt(originalText.replace("+", ""));
    } else {
      return; // Skip non-numeric values
    }

    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        if (originalText.includes("+")) {
          counter.textContent = Math.floor(current).toLocaleString() + "+";
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      } else {
        counter.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  });
}

// Load statistics from API
async function loadStatistics() {
  try {
    const response = await fetch("/api/statistics");
    if (response.ok) {
      const stats = await response.json();

      // Update DOM elements dengan data dari API
      if (stats.total_penduduk) {
        const totalEl = document.getElementById("totalPenduduk");
        if (totalEl) totalEl.textContent = formatNumber(stats.total_penduduk);
      }
      if (stats.total_kk) {
        const kkEl = document.getElementById("totalKK");
        if (kkEl) kkEl.textContent = formatNumber(stats.total_kk);
      }
    }
  } catch (error) {
    console.error("Error loading statistics:", error);
  }
}
