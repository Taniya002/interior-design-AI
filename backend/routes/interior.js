const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const cloudinary = require('cloudinary').v2;
const verifyToken = require('../middleware/auth');

const router = express.Router();

const THEMES = [
  'Modern Minimalist',
  'Scandinavian',
  'Bohemian',
  'Industrial',
  'Luxury Contemporary',
  'Japandi',
  'Coastal',
  'Art Deco',
  'Rustic Farmhouse',
  'Mid-Century Modern',
];

async function imageUrlToBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
}

async function uploadToCloudinary(base64Data, userId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Data}`,
      {
        folder: 'interior-design-ai/generated',
        public_id: `generated_${userId}_${Date.now()}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
  });
}

async function generateWithStabilityAI(imageBuffer, prompt) {
  const formData = new FormData();
  formData.append('mode', 'image-to-image');
  formData.append('image', imageBuffer, {
    filename: 'room.jpg',
    contentType: 'image/jpeg',
  });
  formData.append('prompt', prompt);
  formData.append('strength', '0.7');
  formData.append('output_format', 'jpeg');
  formData.append('model', 'sd3-large-turbo');

  const response = await axios({
    method: 'post',
    url: 'https://api.stability.ai/v2beta/stable-image/generate/sd3',
    headers: {
      Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      Accept: 'image/*',
      ...formData.getHeaders(),
    },
    data: formData,
    responseType: 'arraybuffer',
    timeout: 120000,
  });

  return Buffer.from(response.data, 'binary').toString('base64');
}

router.get('/themes', (req, res) => {
  res.json({ themes: THEMES });
});

router.post('/generate', verifyToken, async (req, res) => {
  try {
    // ✅ Sirf ek baar declare
    console.log("=== REQUEST BODY ===", req.body);
    const { roomImageUrl, theme } = req.body;
    console.log("roomImageUrl:", roomImageUrl);
    console.log("theme:", theme);

    if (!roomImageUrl) {
      return res.status(400).json({ error: 'Room ki image URL required hai!' });
    }
    if (!theme) {
      return res.status(400).json({ error: 'Theme select karo!' });
    }
    if (!THEMES.includes(theme)) {
      return res.status(400).json({
        error: `Invalid theme! Valid themes: ${THEMES.join(', ')}`,
      });
    }

    console.log(`Generating: ${theme} for user ${req.user.email}`);

    const prompt = `Restyle this room into ${theme} interior design style. 
    Keep the exact room structure, walls, windows, and layout the same. 
    Change furniture, materials, decor, colors and lighting to match ${theme} aesthetic. 
    Realistic, premium, professional interior photography, high quality, 8K.`;

    console.log('Room image download ho rahi hai...');
    const imageBuffer = await imageUrlToBuffer(roomImageUrl);

    console.log('Stability AI se generate ho raha hai...');
    const base64Result = await generateWithStabilityAI(imageBuffer, prompt);

    console.log('Cloudinary pe save ho raha hai...');
    const generatedImageUrl = await uploadToCloudinary(base64Result, req.user.uid);

    console.log('Generation complete!');
    console.log('Image URL:', generatedImageUrl);

    res.json({
      success: true,
      originalRoom: roomImageUrl,
      theme,
      generatedImageUrl,
      user: req.user.name,
    });

  } catch (error) {
    const errMsg = error.response?.data
      ? Buffer.from(error.response.data).toString()
      : error.message;

    console.error('Generation error:', errMsg);

    if (error.response?.status === 402) {
      return res.status(402).json({ error: 'Credits khatam! Stability AI account mein add karo.' });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'API key galat hai! .env check karo.' });
    }

    res.status(500).json({ error: errMsg });
  }
});

module.exports = router;