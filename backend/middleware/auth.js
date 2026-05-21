const { auth } = require('../config/firebase');

// Yeh middleware har protected route pe lagega
// Frontend se Firebase token aata hai, hum verify karte hain
const verifyToken = async (req, res, next) => {
  try {
    // Authorization header se token lo
    // Frontend bhejta hai: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token nahi mila! Pehle login karo.',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Firebase se token verify karo
    const decodedToken = await auth.verifyIdToken(token);

    // User info request mein add karo (agle route use karega)
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
    };

    next(); // Aage jao
  } catch (error) {
    console.error('Token verify error:', error.message);
    return res.status(401).json({
      error: 'Invalid token! Dobara login karo.',
    });
  }
};

module.exports = verifyToken;
