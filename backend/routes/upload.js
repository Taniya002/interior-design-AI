const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Multer - image memory mein temporarily rakhega
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    // Sirf images allow karo
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sirf image files allowed hain!'), false);
    }
  },
});

// POST /api/upload-room
// Room ki photo Cloudinary pe upload karo, public URL milegi
router.post('/upload-room', verifyToken, upload.single('roomImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file required hai!' });
    }

    // Buffer ko Cloudinary pe upload karo
    const publicUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'interior-design-ai/rooms',
          // User ke UID se organize karo
          public_id: `room_${req.user.uid}_${Date.now()}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      publicUrl, // Yeh URL /api/interior ko dena hai
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
