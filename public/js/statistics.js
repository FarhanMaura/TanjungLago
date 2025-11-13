// Statistics functionality
document.addEventListener("DOMContentLoaded", function () {
  loadStatistics();
  initCharts();
});

async function loadStatistics() {
  try {
    const response = await fetch("/api/statistics");
    if (response.ok) {
      const stats = await response.json();

      // Update DOM elements
      if (stats.total_penduduk) {
        const totalEl = document.getElementById("totalPenduduk");
        if (totalEl) {
          totalEl.textContent = formatNumber(stats.total_penduduk);
          animateCounter(totalEl, stats.total_penduduk);
        }
      }
      if (stats.total_kk) {
        const kkEl = document.getElementById("totalKK");
        if (kkEl) {
          kkEl.textContent = formatNumber(stats.total_kk);
          animateCounter(kkEl, stats.total_kk);
        }
      }
      if (stats.penduduk_laki) {
        const lakiEl = document.getElementById("pendudukLaki");
        if (lakiEl) {
          lakiEl.textContent = formatNumber(stats.penduduk_laki);
          animateCounter(lakiEl, stats.penduduk_laki);
        }
      }
      if (stats.penduduk_perempuan) {
        const perempuanEl = document.getElementById("pendudukPerempuan");
        if (perempuanEl) {
          perempuanEl.textContent = formatNumber(stats.penduduk_perempuan);
          animateCounter(perempuanEl, stats.penduduk_perempuan);
        }
      }
    }
  } catch (error) {
    console.error("Error loading statistics:", error);
  }
}

function animateCounter(element, target) {
  const current = parseInt(element.textContent.replace(/,/g, ""));
  if (isNaN(current)) return;

  const duration = 1500;
  const step = (target - current) / (duration / 16);
  let currentValue = current;

  const timer = setInterval(() => {
    currentValue += step;
    if (
      (step > 0 && currentValue >= target) ||
      (step < 0 && currentValue <= target)
    ) {
      currentValue = target;
      clearInterval(timer);
    }
    element.textContent = formatNumber(Math.floor(currentValue));
  }, 16);
}

function initCharts() {
  // Income Chart
  const incomeCtx = document.getElementById("incomeChart");
  if (incomeCtx) {
    new Chart(incomeCtx.getContext("2d"), {
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
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return "Rp " + context.parsed.y.toLocaleString("id-ID");
              },
            },
          },
        },
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
      },
    });
  }

  // Occupation Chart
  const occupationCtx = document.getElementById("occupationChart");
  if (occupationCtx) {
    new Chart(occupationCtx.getContext("2d"), {
      type: "pie",
      data: {
        labels: ["Pertanian", "Perkebunan", "Perikanan", "UMKM", "Lainnya"],
        datasets: [
          {
            data: [40, 25, 15, 12, 8],
            backgroundColor: [
              "#2c5530",
              "#a2d729",
              "#8bc34a",
              "#6b993a",
              "#4a7a29",
            ],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": " + context.parsed + "%";
              },
            },
          },
        },
      },
    });
  }
}
