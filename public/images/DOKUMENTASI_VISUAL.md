# Dokumentasi Visual Website Desa Tanjung Lago

Dokumen ini berisi penjelasan lengkap tentang semua wireframe, prototype, flowchart, dan diagram brainstorming yang telah dibuat untuk website Desa Tanjung Lago.

---

## 📋 Daftar Isi

1. [Wireframes (6 Halaman)](#wireframes)
2. [High-Fidelity Prototypes (3 Interface)](#prototypes)
3. [Flowcharts (3 Diagram)](#flowcharts)
4. [Brainstorming & Architecture (2 Diagram)](#brainstorming)

---

## 🎨 Wireframes

### 1. Homepage Wireframe
**File:** `wireframe_homepage_*.png`

**Konten:**
- Navigation bar dengan logo "Desa Tanjung Lago" dan menu (Beranda, Tentang, Galeri, Statistik, Kontak)
- Hero section dengan background image, headline, dan 2 CTA buttons
- 3 kotak statistik (5,483+ Penduduk, 1367 M Sejarah, 50+ UMKM)
- Section "Mengapa Desa Tanjung Lago?" dengan 3 feature cards:
  - Sejarah Panjang (ikon history)
  - Potensi Alam (ikon seedling)
  - Gotong Royong (ikon hands)
- Section "Desa dalam Angka" dengan 4 stat boxes
- Preview galeri foto (grid 4 gambar)
- Footer dengan 4 kolom (logo, quick links, informasi, kontak)

### 2. About Page Wireframe
**File:** `wireframe_about_*.png`

**Konten:**
- Page header "Tentang Desa Tanjung Lago"
- Layout 2 kolom:
  - **Kolom kiri:** Konten teks panjang tentang:
    - Desa Tanjung Lago (intro)
    - Sejarah Singkat
    - Profil dan Kondisi Penduduk (list)
    - Potensi Ekonomi dan Sumber Daya
    - Pendapatan per Sektor (list)
    - Pendidikan dan Infrastruktur
    - Lokasi Desa
  - **Kolom kanan:** Google Maps embed (sticky)

### 3. Gallery Page Wireframe
**File:** `wireframe_gallery_*.png`

**Konten:**
- Filter buttons (Semua, Wisata, Aktivitas, Produk Lokal, Infrastruktur)
- Grid foto responsif (3-4 kolom) dengan:
  - Image placeholder
  - Category badge
  - Date icon
  - Title
  - Description snippet
  - Hover overlay dengan tombol edit/delete (admin only)
- Upload section dengan form:
  - File input
  - Title input
  - Category dropdown
  - Date picker
  - Description textarea
  - Upload button
- Modal wireframes untuk:
  - Image preview
  - Delete confirmation
  - Edit form

### 4. Statistics Page Wireframe
**File:** `wireframe_statistics_*.png`

**Konten:**
- 4 stat cards besar (Total Penduduk, Kepala Keluarga, Penduduk Laki-laki, Penduduk Perempuan)
- 2 chart section:
  - Bar chart: Pendapatan Rata-rata per Sektor
  - Pie chart: Distribusi Mata Pencaharian
- Tabel data detail kependudukan (3 kolom: Kategori, Jumlah, Persentase)

### 5. Contact Page Wireframe
**File:** `wireframe_contact_*.png`

**Konten:**
- Layout 2 kolom:
  - **Kolom kiri:** 
    - Contact information cards (Address, Phone/WhatsApp, Email, Operating Hours)
    - Quick action buttons (Chat WhatsApp, Telepon Langsung)
  - **Kolom kanan:**
    - Contact form (Nama, WhatsApp, Subjek, Pesan)
    - Submit button "Kirim via WhatsApp"
- Google Maps embed (full-width)

### 6. Login Page Wireframe
**File:** `wireframe_login_*.png`

**Konten:**
- Centered login card dengan:
  - Shield icon
  - "Admin Login" heading
  - Username input
  - Password input
  - Error message area
  - Login button
  - Footer note "Hanya admin yang memiliki akses"

---

## 🎯 High-Fidelity Prototypes

### 1. Homepage Prototype
**File:** `prototype_homepage_*.png`

**Design Features:**
- Green gradient navigation (#2c5530 to #1e3a23)
- Hero section dengan scenic village background, dark overlay
- Lime green accent color (#a2d729) untuk stats dan badges
- Modern card design dengan shadows
- Vibrant, professional web design

### 2. Gallery Admin Prototype
**File:** `prototype_gallery_admin_*.png`

**Design Features:**
- Filter pills (rounded, green when active)
- Photo cards dengan:
  - Rounded corners
  - Drop shadows
  - Category badges
  - Date icons
  - Admin overlay on hover (circular edit/delete buttons)
- Modern upload form dengan green accents
- Edit modal popup

### 3. Statistics Dashboard Prototype
**File:** `prototype_statistics_dashboard_*.png`

**Design Features:**
- Clean stat cards dengan green icons
- Modern charts (Chart.js style):
  - Colorful bar chart untuk income by sector
  - Pie chart dengan legend
- Clean data table dengan alternating rows
- Professional dashboard UI

---

## 🔄 Flowcharts

### 1. User Journey Flowchart
**File:** `flowchart_user_journey_*.png`

**Menggambarkan:**
- Complete user journey dari landing hingga goal completion
- 4 jalur utama:
  1. Learn about village → About page
  2. View photos → Gallery page → Filter → View modal
  3. Check statistics → Statistics page → View charts
  4. Contact village → Contact page → Submit to WhatsApp
- Admin path terpisah: Login → Authentication → Gallery management → Logout
- Color-coded paths (green untuk public, blue untuk admin)

### 2. Admin Authentication Flowchart
**File:** `flowchart_admin_auth_*.png`

**Menggambarkan:**
- Complete authentication flow
- Login process dengan validation
- Rate limiting (max 5 attempts dalam 15 menit)
- Session management
- Admin actions (Upload, Edit, Delete)
- Logout process
- API endpoints labeled (POST /api/auth/login, dll)
- Error handling paths

### 3. Gallery CRUD Operations Flowchart
**File:** `flowchart_gallery_crud_*.png`

**Menggambarkan:**
- **CREATE:** Upload form → Validation → Multer → Save file → Database INSERT
- **READ:** Page load → GET /api/photos → Query DB → Render grid
- **UPDATE:** Edit click → Load data → Modal → PUT /api/photos/:id → Update DB
- **DELETE:** Delete click → Confirmation → DELETE /api/photos/:id → Remove file
- Color-coded operations (green=create, blue=read, yellow=update, red=delete)
- Database dan file system operations
- Error handling branches

---

## 🧠 Brainstorming & Architecture

### 1. Feature Brainstorming Mind Map
**File:** `brainstorm_features_*.png`

**Central Node:** Desa Tanjung Lago Website

**Main Branches:**
1. **Public Features:**
   - Homepage (hero, stats, features)
   - About (history, demographics, map)
   - Gallery (photos, categories, filters)
   - Statistics (charts, population data)
   - Contact (form, WhatsApp, map)

2. **Admin Features:**
   - Authentication (login, session, logout)
   - Gallery Management (upload, edit, delete)
   - Security (bcrypt, rate limiting, helmet)

3. **Technical Stack:**
   - Frontend (HTML, CSS, JavaScript)
   - Backend (Node.js, Express)
   - Database (SQLite)
   - File Upload (Multer)
   - Charts (Chart.js)

4. **Data Categories:**
   - Demographics (5,483 people, 1,278 families)
   - Economy (agriculture, plantation, UMKM)
   - Infrastructure (education, roads, internet)

5. **User Types:**
   - Visitors (view content)
   - Admin (manage gallery)
   - Community (submit messages)

### 2. System Architecture Diagram
**File:** `architecture_diagram_*.png`

**Layers:**

1. **Client Layer (Blue):**
   - HTML pages (index, about, gallery, statistics, contact, login)
   - JavaScript files (main.js, gallery.js, statistics.js, contact.js, auth.js, login.js)
   - CSS (style.css)

2. **Server Layer (Green):**
   - Routes (/, /api/photos, /api/upload, /api/auth/login, /api/statistics, /api/contact)
   - Middleware (helmet, session, multer, rate-limit, authentication)

3. **Data Layer (Orange):**
   - SQLite Database dengan tables:
     - photos (id, title, description, activity_date, category, filename, upload_date)
     - messages (id, name, email, subject, message, created_date)
     - desa_data (id, key, value, updated_date)
     - admin_users (id, username, password_hash, created_at, last_login)
   - File System (/uploads directory)

4. **External Services (Purple):**
   - Google Maps API
   - WhatsApp integration
   - Chart.js CDN
   - Font Awesome CDN

5. **Security:**
   - bcrypt password hashing
   - express-session
   - helmet headers
   - rate limiting

---

## 📊 Ringkasan Website

### Halaman Publik (6 halaman)
1. **Homepage** - Hero, features, stats, gallery preview
2. **About** - Sejarah, demografi, potensi ekonomi, map
3. **Gallery** - Photo grid dengan filter kategori
4. **Statistics** - Charts dan data kependudukan
5. **Contact** - Form kontak, WhatsApp integration, map
6. **Login** - Admin authentication

### Fitur Admin
- Secure login dengan bcrypt
- Session management
- Gallery CRUD operations (Create, Read, Update, Delete)
- Rate limiting untuk keamanan
- File upload dengan Multer

### Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Security:** bcrypt, helmet, express-session, rate-limit
- **File Upload:** Multer
- **Charts:** Chart.js
- **Maps:** Google Maps API
- **Icons:** Font Awesome

### Data Desa
- Total Penduduk: 5,483 orang
- Kepala Keluarga: 1,278 KK
- Laki-laki: 2,750 orang
- Perempuan: 2,733 orang
- Tahun Berdiri: 1367 M
- Jarak dari Palembang: 50 KM

---

## 🎨 Color Scheme

- **Primary Green:** #2c5530
- **Secondary Green:** #a2d729
- **Accent Green:** #8bc34a
- **Dark Green:** #1e3a23
- **Text Color:** #333
- **Light Gray:** #f8f9fa
- **Dark Gray:** #6c757d

---

## 📝 Catatan Penggunaan

Semua file visual ini dapat digunakan untuk:
1. **Presentasi** kepada stakeholder
2. **Development reference** untuk developer
3. **User testing** untuk validasi UX
4. **Documentation** untuk project handover
5. **Marketing materials** untuk promosi website

---

**Dibuat:** 20 Desember 2025  
**Untuk:** Website Desa Tanjung Lago - KKN Kabupaten Banyuasin  
**Total Assets:** 14 gambar (6 wireframes, 3 prototypes, 3 flowcharts, 2 diagrams)
