// WhatsApp Contact Form functionality
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("messageForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      sendToWhatsApp();
    });
  }

  // Auto-format phone number
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      // Format to Indonesian phone number
      if (value.startsWith("0")) {
        value = "62" + value.substring(1);
      } else if (!value.startsWith("62") && value.length > 0) {
        value = "62" + value;
      }

      e.target.value = value;
    });

    // Add placeholder text on focus
    phoneInput.addEventListener("focus", function () {
      if (!this.value) {
        this.placeholder = "62xxxxxxxxxxx";
      }
    });

    phoneInput.addEventListener("blur", function () {
      this.placeholder = "Contoh: 081234567890";
    });
  }
});

function sendToWhatsApp() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value.trim();

  // Validasi
  if (!name || !phone || !subject || !message) {
    showAlert("Harap lengkapi semua field yang wajib diisi!", "error");
    return;
  }

  // Validasi nomor WhatsApp
  if (!validatePhoneNumber(phone)) {
    showAlert("Nomor WhatsApp tidak valid! Format: 62xxxxxxxxxxx", "error");
    return;
  }

  // Format pesan untuk WhatsApp
  const whatsappMessage = formatWhatsAppMessage(name, phone, subject, message);

  // Encode message untuk URL
  const encodedMessage = encodeURIComponent(whatsappMessage);

  // ⭐⭐ NOMOR WHATSAPP ADMIN DESA - SUDAH DIGANTI ⭐⭐
  const adminNumber = "6283834559661"; // Format: tanpa +, tanpa spasi/dash

  // Buat URL WhatsApp
  const whatsappURL = `https://wa.me/${adminNumber}?text=${encodedMessage}`;

  // Tampilkan konfirmasi sebelum membuka WhatsApp
  showConfirmation(whatsappURL, name);
}

function formatWhatsAppMessage(name, phone, subject, message) {
  const timestamp = new Date().toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `Halo Admin Desa Tanjung Lago! 👋

Saya *${name}* ingin menghubungi mengenai:
*${subject}*

📝 *Detail Pesan:*
${message}

---
📋 *Informasi Kontak:*
• Nama: ${name}
• Nomor: ${phone}
• Waktu: ${timestamp}

*Pesan ini dikirim melalui website resmi Desa Tanjung Lago*`;
}

function validatePhoneNumber(phone) {
  const phoneRegex = /^62[0-9]{9,12}$/;
  return phoneRegex.test(phone);
}

function showConfirmation(whatsappURL, name) {
  // Buat modal konfirmasi
  const modal = document.createElement("div");
  modal.id = "confirmationModal";
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;

  modal.innerHTML = `
        <div style="background: white; padding: 2.5rem; border-radius: 20px; text-align: center; max-width: 450px; margin: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <div style="color: #25D366; font-size: 4rem; margin-bottom: 1.5rem;">
                <i class="fab fa-whatsapp"></i>
            </div>
            <h3 style="color: #2c5530; margin-bottom: 1rem; font-size: 1.5rem;">Pesan Siap Dikirim!</h3>
            <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
                Halo <strong>${name}</strong>, pesan Anda akan dikirim ke WhatsApp admin desa.
            </p>
            <p style="color: #888; margin-bottom: 2rem; font-size: 0.9rem;">
                WhatsApp akan terbuka secara otomatis. Pastikan Anda sudah menginstall WhatsApp di perangkat ini.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button onclick="closeConfirmation()" style="padding: 12px 24px; border: 2px solid #2c5530; background: white; color: #2c5530; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s;">
                    <i class="fas fa-times"></i> Batal
                </button>
                <button onclick="openWhatsApp('${whatsappURL}')" style="padding: 12px 24px; background: #25D366; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s; display: flex; align-items: center; gap: 8px;">
                    <i class="fab fa-whatsapp"></i> Buka WhatsApp
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Prevent body scroll
  document.body.style.overflow = "hidden";
}

function openWhatsApp(url) {
  window.open(url, "_blank");
  closeConfirmation();
  resetForm();
  showAlert("Pesan berhasil dikirim! WhatsApp telah dibuka.", "success");
}

function closeConfirmation() {
  const modal = document.getElementById("confirmationModal");
  if (modal) {
    modal.style.animation = "fadeOut 0.3s ease-in";
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
      // Restore body scroll
      document.body.style.overflow = "auto";
    }, 300);
  }
}

function resetForm() {
  const form = document.getElementById("messageForm");
  if (form) {
    form.reset();
  }
}

function showAlert(message, type = "info") {
  // Remove existing alert
  const existingAlert = document.querySelector(".alert-message");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.className = `alert-message ${type}`;
  alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;

  if (type === "success") {
    alert.style.background = "#25D366";
  } else if (type === "error") {
    alert.style.background = "#e74c3c";
  } else {
    alert.style.background = "#3498db";
  }

  alert.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${
              type === "success"
                ? "fa-check-circle"
                : type === "error"
                ? "fa-exclamation-circle"
                : "fa-info-circle"
            }"></i>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(alert);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => {
        if (alert.parentNode) {
          alert.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Add CSS for animations
const contactStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.alert-message {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);

// Add to window object for global access
window.closeConfirmation = closeConfirmation;
window.openWhatsApp = openWhatsApp;
