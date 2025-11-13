const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database setup
const db = new sqlite3.Database("./database/desa.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  // Photos table
  db.run(
    `CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        filename TEXT NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error("Error creating photos table:", err);
      } else {
        console.log("Photos table ready");
      }
    }
  );

  // Contact messages table
  db.run(
    `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error("Error creating messages table:", err);
      } else {
        console.log("Messages table ready");
      }
    }
  );

  // Desa data table
  db.run(
    `CREATE TABLE IF NOT EXISTS desa_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error("Error creating desa_data table:", err);
      } else {
        console.log("Desa_data table ready");
        insertInitialData();
      }
    }
  );
}

function insertInitialData() {
  const initialData = [
    { key: "total_penduduk", value: "5483" },
    { key: "penduduk_laki", value: "2750" },
    { key: "penduduk_perempuan", value: "2733" },
    { key: "total_kk", value: "1278" },
    { key: "kepadatan_penduduk", value: "39.70" },
  ];

  initialData.forEach((data) => {
    db.run(
      `INSERT OR IGNORE INTO desa_data (key, value) VALUES (?, ?)`,
      [data.key, data.value],
      function (err) {
        if (err) {
          console.error("Error inserting initial data:", err);
        }
      }
    );
  });
  console.log("Initial data inserted");
}

// Buat folder yang diperlukan
const folders = ["./database", "./uploads", "./public/css", "./public/js"];
folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Created directory: ${folder}`);
  }
});

// Multer configuration untuk file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// API Routes

// Get all photos
app.get("/api/photos", (req, res) => {
  const limit = req.query.limit;
  let query = "SELECT * FROM photos ORDER BY upload_date DESC";
  let params = [];

  if (limit) {
    query += " LIMIT ?";
    params.push(parseInt(limit));
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching photos:", err);
      res.status(500).json({ error: err.message });
      return;
    }

    const photos = rows.map((photo) => ({
      ...photo,
      url: `/uploads/${photo.filename}`,
    }));

    res.json(photos);
  });
});

// Upload photo
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { title, category } = req.body;

  if (!title || !category) {
    // Hapus file yang sudah diupload jika validasi gagal
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ error: "Title and category are required" });
  }

  db.run(
    "INSERT INTO photos (title, category, filename) VALUES (?, ?, ?)",
    [title, category, req.file.filename],
    function (err) {
      if (err) {
        // Hapus file jika database error
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        message: "Photo uploaded successfully",
        url: `/uploads/${req.file.filename}`,
      });
    }
  );
});

// Get desa statistics
app.get("/api/statistics", (req, res) => {
  db.all("SELECT key, value FROM desa_data", (err, rows) => {
    if (err) {
      console.error("Error fetching statistics:", err);
      res.status(500).json({ error: err.message });
      return;
    }

    const stats = {};
    rows.forEach((row) => {
      stats[row.key] = row.value;
    });

    res.json(stats);
  });
});

// Submit contact message (backup ke database)
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.run(
    "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
    [name, email, subject, message],
    function (err) {
      if (err) {
        console.error("Error saving message:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Message saved successfully" });
    }
  );
});

// Route untuk halaman HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about.html", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/gallery.html", (req, res) => {
  res.sendFile(path.join(__dirname, "gallery.html"));
});

app.get("/statistics.html", (req, res) => {
  res.sendFile(path.join(__dirname, "statistics.html"));
});

app.get("/contact.html", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large (max 5MB)" });
    }
  }
  res.status(500).json({ error: error.message });
});

// Handle 404
app.use((req, res) => {
  res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Halaman Tidak Ditemukan</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #2c5530; font-size: 3rem; }
                p { color: #666; font-size: 1.2rem; }
                a { color: #a2d729; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>404</h1>
            <p>Halaman yang Anda cari tidak ditemukan.</p>
            <p><a href="/">Kembali ke Beranda</a></p>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ./uploads/`);
  console.log(`💾 Database: ./database/desa.db`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("✅ Database connection closed.");
    }
    process.exit(0);
  });
});
