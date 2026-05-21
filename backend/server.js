require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

// ─── Routes & Middleware ──────────────────────────
const uploadRoutes = require('./routes/upload');
const interiorRoutes = require('./routes/interior');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Cloudinary Config ────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Middleware ───────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

// ─── Routes ───────────────────────────────────────
app.use('/api', uploadRoutes);            // POST /api/upload-room
app.use('/api/interior', interiorRoutes); // GET  /api/interior/themes
                                          // POST /api/interior/generate

// ─── Health Check ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🏠 Interior Design AI Backend is running!',
    endpoints: {
      uploadRoom:     'POST /api/upload-room',
      getThemes:      'GET  /api/interior/themes',
      generateDesign: 'POST /api/interior/generate',
    },
  });
});

// ─── Global Error Handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: err.message || 'Server error!' });
});

// ─── Start Server ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/upload-room`);
  console.log(`   GET  http://localhost:${PORT}/api/interior/themes`);
  console.log(`   POST http://localhost:${PORT}/api/interior/generate`);
});
